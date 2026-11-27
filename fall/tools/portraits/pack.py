"""Profilbilder für die Kacheln packen: Grundbild + Blinzel- und Mund-Ebene.

Eingabe ist eine JSON-Datei {id: {"base": "bild.png", "expr": "bild-augen-zu-mund-auf.png"}} („expr“ ist optional,
dann gibt es nur das Standbild, z. B. für Räume oder Beweisfotos). Die Gesichtspunkte kommen aus landmarks.swift
(Apple Vision, läuft lokal):

    swiftc fall/tools/portraits/landmarks.swift -o /tmp/landmarks
    /tmp/landmarks *.png > points.json
    python3 fall/tools/portraits/pack.py bilder.json points.json

Schreibt fall/portraits/<id>.webp, <id>-blink.webp, <id>-voice.webp und ergänzt fall/portraits/frames.mjs
(bestehende Einträge bleiben erhalten).
"""
import json
import math
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'portraits'
SIZE = (960, 540)


def bounds(pts, part):
    p = np.array(pts[part]) * SIZE
    left, right = p[p[:, 0].argmin()], p[p[:, 0].argmax()]
    return (left + right) / 2, np.linalg.norm(right - left), math.atan2(*(right - left)[::-1])


def patch(src, src_pts, target_pts, part):
    """Ausschnitt (Augen oder Mund) aus dem Ausdrucksbild auf das Grundbild ausrichten, mit weicher Maske."""
    sc, sw, sa = bounds(src_pts, part)
    tc, tw, ta = bounds(target_pts, part)
    angle = sa - ta
    mat = sw / tw * np.array([[math.cos(angle), -math.sin(angle)], [math.sin(angle), math.cos(angle)]])
    reg = Image.open(src).convert('RGB').resize(SIZE, Image.Resampling.LANCZOS).transform(
        SIZE, Image.Transform.AFFINE, tuple(np.c_[mat, sc - mat @ tc].flatten()), Image.Resampling.BICUBIC)
    yy, xx = np.mgrid[:SIZE[1], :SIZE[0]]
    dx, dy = xx - tc[0], yy - tc[1]
    u = (dx * math.cos(ta) + dy * math.sin(ta)) / tw
    v = (-dx * math.sin(ta) + dy * math.cos(ta)) / tw
    radius = np.sqrt((u / .82) ** 2 + ((v - .06) / .57) ** 2) if part == 'mouth' else np.sqrt((u / .72) ** 2 + (v / .37) ** 2)
    alpha = np.clip((1 - radius) / .24, 0, 1)
    alpha = alpha ** 2 * (3 - 2 * alpha)
    reg.putalpha(Image.fromarray((alpha * 255).astype('uint8')))
    return reg


def read_frames():
    f = OUT / 'frames.mjs'
    if not f.exists():
        return {}
    body = re.search(r'\{(.*)\}', f.read_text(), re.S).group(1)
    return {k: json.loads(v) for k, v in re.findall(r'"([^"]+)":\s*(\{[^}]*\})', body)}


def main(spec_file, points_file):
    spec = json.load(open(spec_file))
    pts = json.load(open(points_file))
    frames = read_frames()
    for pid, item in spec.items():
        base = item['base']
        Image.open(base).convert('RGB').resize(SIZE, Image.Resampling.LANCZOS).save(OUT / f'{pid}.webp', quality=84, method=5)
        expr = item.get('expr')
        if not expr:
            print(pid, 'Standbild')
            continue
        bp, ep = pts.get(str(Path(base).resolve())) or pts.get(base), pts.get(str(Path(expr).resolve())) or pts.get(expr)
        if not bp or not ep or not all(k in bp and k in ep for k in ('left', 'right', 'mouth')):
            print(pid, 'kein Gesicht erkannt, nur Standbild')
            continue
        closed = patch(expr, ep, bp, 'left')
        closed.alpha_composite(patch(expr, ep, bp, 'right'))
        frames[pid] = {}
        for kind, layer in {'blink': closed, 'voice': patch(expr, ep, bp, 'mouth')}.items():
            l, t, r, b = layer.getbbox()
            layer.crop((l, t, r, b)).save(OUT / f'{pid}-{kind}.webp', quality=87, method=5)
            frames[pid][kind] = [l, t, r - l, b - t]
        print(pid, frames[pid])
    (OUT / 'frames.mjs').write_text('// Bildausschnitte [x, y, Breite, Höhe] im 960 × 540 großen Kamerabild.\nexport const frames = {\n'
        + ''.join('  ' + json.dumps(k) + ': ' + json.dumps(v, separators=(', ', ': ')) + ',\n' for k, v in sorted(frames.items())) + '}\n')


if __name__ == '__main__':
    main(*sys.argv[1:3])
