#!/usr/bin/env python3
"""Erzeugt die Sprachaufnahmen der Figuren mit Piper (lokale Sprachsynthese) und ffmpeg-Effekten.

Aufruf (aus dem Repo):
    node fall/tools/lines.mjs > /tmp/jobs.json
    python fall/tools/voices.py /tmp/jobs.json            # nur fehlende Dateien
    python fall/tools/voices.py /tmp/jobs.json --force    # alles neu
    python fall/tools/voices.py --ambience                # Hintergrundgeräusche in fall/audio/
    python fall/tools/voices.py --probe mls 0 1 2 ...     # Tonhöhe von Sprechern messen (zum Aussuchen)

Braucht: pip install piper-tts, ffmpeg, Stimmen in ~/.cache/piper (de_DE-<name>.onnx + .onnx.json).
Lizenzen der Stimmen: siehe fall/CREDITS.md.
"""
import json, os, subprocess, sys, tempfile, wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VOICES = Path(os.environ.get('PIPER_VOICES', Path.home() / '.cache' / 'piper'))
MODELS = {
    'thorsten-high': 'de_DE-thorsten-high', 'thorsten_emotional': 'de_DE-thorsten_emotional-medium',
    'kerstin': 'de_DE-kerstin-low', 'eva_k': 'de_DE-eva_k-x_low',
}
_loaded = {}


def voice(name):
    from piper import PiperVoice
    if name not in _loaded:
        # espeak-ng verträgt keine langen Pfade: Daten liegen (als Link) neben den Stimmen
        esp = VOICES / 'espeak-ng-data'
        kw = {'espeak_data_dir': str(esp)} if esp.exists() else {}
        _loaded[name] = PiperVoice.load(str(VOICES / (MODELS[name] + '.onnx')), **kw)
    return _loaded[name]


def synth(text, v, out_wav):
    from piper import SynthesisConfig
    pv = voice(v['model'])
    cfg = SynthesisConfig(speaker_id=v.get('speaker'), length_scale=v.get('len', 1.0), noise_scale=v.get('noise', .6), noise_w_scale=v.get('noisew', .8))
    with wave.open(str(out_wav), 'wb') as w:
        pv.synthesize_wav(text, w, syn_config=cfg)
    return pv.config.sample_rate


# Effektketten je Figur (ffmpeg -af). sr = Abtastrate der Stimme.
def chain(fx, sr):
    down = .82  # Tonhöhe runter für „demon“
    return {
        'call': 'highpass=f=110,lowpass=f=7600,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,equalizer=f=2800:t=q:w=1.2:g=2',
        'phone': 'highpass=f=320,lowpass=f=3300,acompressor=threshold=-22dB:ratio=5,acrusher=bits=12:mix=.25,equalizer=f=1500:t=q:w=1:g=4',
        'radio': 'highpass=f=420,lowpass=f=2900,acompressor=threshold=-24dB:ratio=6,acrusher=bits=8:mix=.35,equalizer=f=1800:t=q:w=1:g=5',
        'whisper': 'highpass=f=180,lowpass=f=5200,acompressor=threshold=-26dB:ratio=4,volume=1.6',
        'demon': f'asetrate={int(sr * down)},aresample={sr},atempo={1 / down:.4f},lowpass=f=4800,acrusher=bits=10:mix=.18,aecho=0.8:0.6:45|110:0.35|0.2,acompressor=threshold=-18dB:ratio=4',
        'robot': 'highpass=f=150,chorus=0.6:0.9:40|55:0.35|0.3:0.25|0.35:1.8|2.2,flanger=delay=1:depth=1:speed=.3:width=40,acompressor=threshold=-20dB:ratio=3',
        'video': 'highpass=f=90,lowpass=f=9000,aecho=0.85:0.5:35|70:0.18|0.1,acompressor=threshold=-20dB:ratio=3',
        'mailbox': 'highpass=f=340,lowpass=f=3200,acompressor=threshold=-22dB:ratio=5,acrusher=bits=9:mix=.3',
    }.get(fx, 'anull')


# Hintergrund, der unter manche Stimmen gemischt wird
def bed(fx):
    return {
        'radio': 'anoisesrc=color=white:amplitude=0.045,bandpass=f=2000:width_type=h:w=2400,tremolo=f=7:d=0.5',
        'whisper': 'anoisesrc=color=brown:amplitude=0.12,lowpass=f=500,tremolo=f=0.25:d=0.7',
        'phone': 'anoisesrc=color=pink:amplitude=0.012,bandpass=f=1500:width_type=h:w=2500',
        'mailbox': 'anoisesrc=color=pink:amplitude=0.015,bandpass=f=1500:width_type=h:w=2500',
    }.get(fx)


def run(args):
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *args], check=True)


def duration(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(path)], capture_output=True, text=True).stdout
    return float(out.strip() or 0)


def render(job, out):
    v = job['voice']
    with tempfile.TemporaryDirectory() as td:
        raw = Path(td) / 'raw.wav'
        sr = synth(job['text'], v, raw)
        fx = v.get('fx', 'call')
        pre = 0.35
        inputs = ['-i', str(raw)]
        shift = ''
        if v.get('pitch'):  # Tonhöhe in Halbtönen, Tempo bleibt
            r = 2 ** (v['pitch'] / 12)
            shift = f"asetrate={int(sr * r)},aresample={sr},atempo={1 / r:.4f},"
        graph = f"[0:a]adelay={int(pre * 1000)}:all=1,apad=pad_dur=0.25,{shift}{chain(fx, sr)}[v]"
        mix = ['[v]']
        n = 1
        b = bed(fx)
        if b:
            inputs += ['-f', 'lavfi', '-t', '60', '-i', f'{b},aformat=sample_rates={sr}:channel_layouts=mono']
            mix.append(f'[{n}:a]'); n += 1
        if fx == 'mailbox':  # Piepton vor der Nachricht
            inputs += ['-f', 'lavfi', '-t', '0.3', '-i', f'sine=f=1000:sample_rate={sr}']
            graph += f";[{n}:a]volume=0.25[beep]"; mix.append('[beep]'); n += 1
        if job.get('bells'):  # Glockenschläge im Hintergrund (Fall Funkstille)
            inputs += ['-f', 'lavfi', '-t', '2.2', '-i', f"aevalsrc='0.5*sin(2*PI*392*t)*exp(-2.2*t)+0.3*sin(2*PI*784.6*t)*exp(-3*t)+0.15*sin(2*PI*1180*t)*exp(-4*t)':s={sr}"]
            k = job['bells']
            graph += f";[{n}:a]asplit={k}" + ''.join(f'[b{i}]' for i in range(k))
            for i in range(k):
                graph += f";[b{i}]adelay={int(600 + i * 1150)}:all=1,volume=0.5[bd{i}]"
                mix.append(f'[bd{i}]')
            n += 1
        if len(mix) > 1:
            graph += ';' + ''.join(mix) + f'amix=inputs={len(mix)}:duration=first:normalize=0[m]'
            last = '[m]'
        else:
            last = '[v]'
        post = []
        if job.get('speed'):
            post.append(f"asetrate={int(sr * job['speed'])},aresample={sr}")
        if job.get('reverse'):
            post.append('areverse')
        post.append('alimiter=limit=0.95,afade=t=in:d=0.05')
        graph += f';{last}' + ','.join(post) + '[out]'
        run([*inputs, '-filter_complex', graph, '-map', '[out]', '-ac', '1', '-ar', '44100', '-c:a', 'aac', '-b:a', '64k', '-movflags', '+faststart', str(out)])


def main_jobs(path, force):
    jobs = json.load(open(path))
    by_case = {}
    for j in jobs:
        by_case.setdefault(j['case'], []).append(j)
    for cid, js in by_case.items():
        d = ROOT / 'cases' / cid / 'audio'
        d.mkdir(parents=True, exist_ok=True)
        mf = d / 'manifest.json'
        manifest = json.loads(mf.read_text()) if mf.exists() and not force else {}
        keep = set()
        for i, j in enumerate(js):
            f = f"{j['key']}.m4a"
            keep.add(f)
            out = d / f
            # Neu erzeugen, wenn die Datei fehlt oder sich Stimme/Effekte geändert haben
            sig = json.dumps([j['voice'], j.get('reverse'), j.get('speed'), j.get('bells')], sort_keys=True)
            if force or not out.exists() or manifest.get(j['key'], {}).get('s') != sig:
                print(f"[{cid} {i + 1}/{len(js)}] {j['npc']}: {j['text'][:60]}")
                render(j, out)
            manifest[j['key']] = {'f': f, 'd': int(duration(out) * 1000), 's': sig}
        # Alte Dateien aufräumen, die keine Zeile mehr brauchen
        for old in d.glob('*.m4a'):
            if old.name not in keep:
                old.unlink()
        manifest = {k: v for k, v in manifest.items() if v['f'] in keep}
        mf.write_text(json.dumps(manifest, separators=(',', ':')))
        print(f'{cid}: {len(manifest)} Aufnahmen')


AMB = {
    'hum': "aevalsrc='0.05*sin(2*PI*50*t)+0.03*sin(2*PI*100*t)+0.015*sin(2*PI*150*t)':s=44100,volume=0.8[a];anoisesrc=color=pink:amplitude=0.03:r=44100,lowpass=f=1200[b];[a][b]amix=inputs=2:normalize=0",
    'wind': 'anoisesrc=color=brown:amplitude=0.5:r=44100,lowpass=f=700,tremolo=f=0.13:d=0.7,volume=0.8',
    'storm': "anoisesrc=color=brown:amplitude=0.6:r=44100,lowpass=f=900,tremolo=f=0.21:d=0.8[a];anoisesrc=color=pink:amplitude=0.2:r=44100,highpass=f=1500,tremolo=f=0.37:d=0.9[b];aevalsrc='0.08*sin(2*PI*38*t)*(0.5+0.5*sin(2*PI*0.07*t))':s=44100[c];[a][b][c]amix=inputs=3:normalize=0",
    'radio': 'anoisesrc=color=white:amplitude=0.12:r=44100,bandpass=f=2200:width_type=h:w=2600,tremolo=f=9:d=0.6,volume=0.6',
    # Fahrstuhlmusik: Arpeggio über C – Am – F – G
    'wartemusik': ("aevalsrc='"
                   "(st(0,mod(floor(t/2),4));st(1,if(eq(ld(0),0),0,if(eq(ld(0),1),-3,if(eq(ld(0),2),-7,-5))));"
                   "st(2,mod(floor(t*4),3));st(3,if(eq(ld(2),0),0,if(eq(ld(2),1),if(eq(ld(0),1),3,4),7)));"
                   "0.18*sin(2*PI*523.25*pow(2,(ld(1)+ld(3))/12)*t)*exp(-5*mod(t,0.25))"
                   "+0.07*sin(2*PI*130.81*pow(2,ld(1)/12)*t)+0.03*sin(2*PI*261.63*pow(2,(ld(1)+7)/12)*t))'"
                   ":s=44100,lowpass=f=3000,aecho=0.8:0.6:120:0.25,volume=0.9"),
}


def ambience():
    d = ROOT / 'audio'
    d.mkdir(exist_ok=True)
    for name, src in AMB.items():
        out = d / f'{name}.m4a'
        print('Atmo', name)
        graph = src + ',afade=t=in:d=1,afade=t=out:st=31:d=1'
        run(['-filter_complex', graph + '[o]', '-map', '[o]', '-t', '32', '-ac', '1', '-c:a', 'aac', '-b:a', '48k', str(out)])


def probe(model, speakers):
    import numpy as np
    for s in speakers:
        with tempfile.TemporaryDirectory() as td:
            p = Path(td) / 'p.wav'
            sr = synth('Guten Abend. Ich habe nicht viel Zeit, also hören Sie mir bitte genau zu.', {'model': model, 'speaker': int(s)}, p)
            with wave.open(str(p)) as w:
                x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float)
            f0s = []
            for i in range(0, len(x) - 2048, 1024):
                fr = x[i:i + 2048] * np.hanning(2048)
                if np.sqrt((fr ** 2).mean()) < 300:
                    continue
                ac = np.correlate(fr, fr, 'full')[2047:]
                lo, hi = int(sr / 350), int(sr / 70)
                k = lo + int(np.argmax(ac[lo:hi]))
                if ac[k] > .3 * ac[0]:
                    f0s.append(sr / k)
            print(model, s, f'{np.median(f0s):.0f} Hz' if f0s else '?')


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a:
        print(__doc__); sys.exit(1)
    if a[0] == '--ambience':
        ambience()
    elif a[0] == '--probe':
        probe(a[1], a[2:])
    else:
        main_jobs(a[0], '--force' in a)
