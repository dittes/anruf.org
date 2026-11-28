"""Build local German and English lip-sync timing from the final voiced M4As (ffmpeg + Rhubarb Lip Sync)."""
import argparse
import os
from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]


def analyse(directory, filename, text, language, binary):
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / 'voice.wav'
        subprocess.run(['ffmpeg', '-v', 'error', '-i', str(directory / filename),
                        '-ac', '1', '-ar', '16000', str(wav)], check=True)
        recognizer = 'pocketSphinx' if language == 'en' else 'phonetic'
        cmd = [binary, '--quiet', '-r', recognizer, '--threads', '1', '--extendedShapes', 'GHX', '-f', 'tsv']
        if language == 'en':
            dialog = Path(tmp) / 'dialog.txt'
            dialog.write_text(text, encoding='utf-8')
            cmd.extend(['-d', str(dialog)])
        rows = subprocess.check_output([*cmd, str(wav)], text=True)
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
    language = os.environ.get('FALL_LANG', 'de')
    for case in sorted({j['case'] for j in jobs}):
        if args.cases and case not in args.cases:
            continue
        directory = ROOT / 'cases' / case / ('audio-en' if language == 'en' else 'audio')
        manifest = json.loads((directory / 'manifest.json').read_text())
        lines = {manifest[j['key']]['f']: j['text'] for j in jobs if j['case'] == case
                 and not j['npc'].startswith('clip:') and j['key'] in manifest}
        with ThreadPoolExecutor(max_workers=4) as pool:
            result = dict(pool.map(lambda f: analyse(directory, f, lines[f], language, args.rhubarb), sorted(lines)))
        with tempfile.NamedTemporaryFile('w', dir=directory, delete=False) as out:
            json.dump(result, out, separators=(',', ':'))
            out.write('\n')
        target = directory / 'mouth-cues.json'
        Path(out.name).chmod(0o644)
        Path(out.name).replace(target)
        print(case, len(result), flush=True)


if __name__ == '__main__':
    main()
