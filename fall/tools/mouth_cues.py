"""Build local German lip-sync timing from the final voiced M4As (ffmpeg + Rhubarb Lip Sync)."""
import argparse
import os
from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]


def analyse(job, binary):
    directory, filename = job
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / 'voice.wav'
        subprocess.run(['ffmpeg', '-v', 'error', '-i', str(directory / filename),
                        '-ac', '1', '-ar', '16000', str(wav)], check=True)
        rows = subprocess.check_output([binary, '--quiet', '-r', 'phonetic', '--threads', '1',
                                        '--extendedShapes', 'GHX', '-f', 'tsv', str(wav)], text=True)
    # Centiseconds and shape letters, flattened for compact local transfer.
    cues = []
    for line in rows.splitlines():
        sec, shape = line.split()
        cues.extend([round(100 * float(sec)), shape])
    return filename, cues


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--rhubarb', default='rhubarb')
    parser.add_argument('cases', nargs='*')
    args = parser.parse_args()
    jobs = json.loads(subprocess.check_output(['node', str(ROOT / 'tools/lines.mjs')]))
    for case in sorted({j['case'] for j in jobs}):
        if args.cases and case not in args.cases:
            continue
        directory = ROOT / 'cases' / case / ('audio-en' if os.environ.get('FALL_LANG') == 'en' else 'audio')
        manifest = json.loads((directory / 'manifest.json').read_text())
        filenames = sorted({manifest[j['key']]['f'] for j in jobs if j['case'] == case
                            and not j['npc'].startswith('clip:') and j['key'] in manifest})
        with ThreadPoolExecutor(max_workers=4) as pool:
            result = dict(pool.map(lambda f: analyse((directory, f), args.rhubarb), filenames))
        with tempfile.NamedTemporaryFile('w', dir=directory, delete=False) as out:
            json.dump(result, out, separators=(',', ':'))
            out.write('\n')
        target = directory / 'mouth-cues.json'
        Path(out.name).chmod(0o644)
        Path(out.name).replace(target)
        print(case, len(result), flush=True)


if __name__ == '__main__':
    main()
