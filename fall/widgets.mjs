// Seiten-Widgets in der Akte (Tonband, Empfänger, Chiffre, Foto, Aktenvernichter, Morsetafel) und Rätsel-Eingaben.
import {AU, audio, master, stopVoice, tone, voiceVol} from './sound.mjs'
import {G, MORSE} from './game.mjs'
import {akey} from './lib.mjs'
import {$, $$, fill, h, store} from './core.mjs'
import {lang, t} from './i18n.mjs'
const dec = s => lang === 'de' ? s.replace('.', ',') : s
import {portrait} from './portrait.mjs'

export function mountPage(root) {
  // UV-Lampe: verborgene Schrift wird sichtbar, wo der Zeiger ist
  $$('.uv', root).forEach(uv => {
    const ink = $('.ink', uv)
    const move = e => {
      const r = uv.getBoundingClientRect(), p = e.touches?.[0] || e
      uv.style.setProperty('--x', (p.clientX - r.left) + 'px'); uv.style.setProperty('--y', (p.clientY - r.top) + 'px')
      if (ink) { const q = ink.getBoundingClientRect(); ink.style.setProperty('--ix', (p.clientX - q.left) + 'px'); ink.style.setProperty('--iy', (p.clientY - q.top) + 'px') }
    }
    uv.addEventListener('pointermove', move); uv.addEventListener('touchmove', move, {passive: true})
    uv.addEventListener('pointerleave', () => { uv.style.setProperty('--x', '-300px'); ink?.style.setProperty('--ix', '-300px') })
  })
  // Tonband: abspielen, langsamer/schneller, rückwärts
  $$('[data-tape]', root).forEach(el => mountTape(el, el.dataset.tape))
  $$('[data-tuner]', root).forEach(mountTuner)
  $$('[data-cipher]', root).forEach(mountCipher)
  $$('[data-photo]', root).forEach(mountPhoto)
  $$('[data-face]', root).forEach(el => { const f = G.c.faces?.[el.dataset.face]; if (f) el.innerHTML = portrait(f.face) + `<div class="facecap">${f.caption || ''}</div>` })
  $$('[data-shred]', root).forEach(mountShred)
  $$('[data-morsetable]', root).forEach(mountMorseTable)
}
// Morsetafel zum Nachschlagen und Mitschreiben: · und – antippen, passender Buchstabe leuchtet auf
export function mountMorseTable(el) {
  const show = c => c.replace(/\./g, '·').replace(/-/g, '–')
  const letters = Object.entries(MORSE).filter(([k]) => /[A-Z]/.test(k) || el.dataset.morsetable === 'digits')
  let cur = '', word = ''
  el.classList.add('mtable')
  const draw = () => {
    const hit = letters.find(([, c]) => c === cur)?.[0]
    el.replaceChildren(
      h('div', {class: 'mdec'},
        h('div', {class: 'mout'}, h('span', {class: 'mword'}, word || ' '), h('span', {class: 'mcur'}, show(cur) || '…'), h('b', {}, cur ? (hit || '?') : '')),
        h('div', {class: 'mbtns'},
          h('button', {type: 'button', class: 'btn', onclick: () => { cur += '.'; tone(680, 0, .08, 'sine', .06); draw() }}, t('morse.short')),
          h('button', {type: 'button', class: 'btn', onclick: () => { cur += '-'; tone(680, 0, .24, 'sine', .06); draw() }}, t('morse.long')),
          h('button', {type: 'button', class: 'btn', onclick: () => { if (hit) word += hit; cur = ''; draw() }}, t('morse.letter')),
          h('button', {type: 'button', class: 'btn', onclick: () => { word += ' '; cur = ''; draw() }}, t('morse.word')),
          h('button', {type: 'button', class: 'btn', onclick: () => { if (cur) cur = cur.slice(0, -1); else word = word.slice(0, -1); draw() }}, '⌫'))),
      // nach Länge sortiert: Wer „drei Zeichen“ gesehen hat, sucht nur in einer Spalte
      h('div', {class: 'mcols'}, ...[1, 2, 3, 4, 5].map(n => {
        const list = letters.filter(([, c]) => c.length === n)
        return list.length ? h('div', {class: 'mcol'}, h('div', {class: 'mono'}, t(n === 1 ? 'morse.one' : 'morse.many', {n})),
          ...list.map(([k, c]) => h('div', {class: 'mrow' + (cur && c.startsWith(cur) ? ' fit' : '') + (c === cur ? ' hit' : '')}, h('b', {}, k), h('span', {}, show(c))))) : null
      })))
  }
  draw()
}
export function mountTape(el, clipId) {
  const clip = G.c.clips?.[clipId]; if (!clip) return
  const m = AU.manifest[akey('clip:' + clipId, clip.text || '')]
  el.classList.add('tape')
  el.replaceChildren(
    h('div', {class: 'reels'}, h('i'), h('i')),
    h('div', {class: 'tname'}, clip.title),
    h('div', {class: 'tctl'},
      h('button', {class: 'btn', 'data-a': 'play', type: 'button'}, t('tape.play')),
      h('label', {}, t('tape.tempo'), h('select', {'data-a': 'rate'}, ...[.5, .75, 1, 1.25, 1.5].map(r => h('option', {value: r, selected: r === 1}, (lang === 'de' ? String(r).replace('.', ',') : String(r)) + '×')))),
      h('label', {}, h('input', {type: 'checkbox', 'data-a': 'rev'}), t('tape.rev'))
    ))
  if (!m) { el.append(h('p', {class: 'note'}, t('tape.missing'))); return }
  let buf = null, rev = null, src = null
  const reset = () => { src = null; el.classList.remove('playing'); $('[data-a=play]', el).textContent = t('tape.play') }
  $('[data-a=play]', el).onclick = async () => {
    const a = audio()
    if (src) { try { src.stop() } catch {} reset(); return }
    if (!buf) buf = await a.decodeAudioData(await (await fetch(AU.base + m.f)).arrayBuffer())
    let b = buf
    if ($('[data-a=rev]', el).checked) {
      if (!rev) { rev = a.createBuffer(buf.numberOfChannels, buf.length, buf.sampleRate); for (let c = 0; c < buf.numberOfChannels; c++) rev.getChannelData(c).set(buf.getChannelData(c).slice().reverse()) }
      b = rev
    }
    stopVoice()
    const s = a.createBufferSource(); s.buffer = b; s.playbackRate.value = Number($('[data-a=rate]', el).value)
    const g = a.createGain(); g.gain.value = voiceVol
    s.connect(g).connect(master); s.start()
    src = s; el.classList.add('playing'); $('[data-a=play]', el).textContent = t('tape.stop')
    if (el.dataset.spectrum != null) spectrum(el, s, g)
    s.onended = () => { if (src === s) reset() }
  }
}

/* =================== Eingaben: Schalter und Farbtasten =================== */
export function buildInput(p) {
  const box = $('#pextra'); box.replaceChildren(); box.className = ''
  if (p.input === 'switches') {
    box.className = 'switches'
    const st = Array(p.n || 8).fill(0)
    const sync = () => { $('#pa').value = st.join('') }
    st.forEach((_, i) => box.append(h('button', {type: 'button', class: 'sw', 'aria-pressed': 'false', onclick: e => {
      st[i] = st[i] ? 0 : 1; e.currentTarget.setAttribute('aria-pressed', !!st[i]); tone(st[i] ? 520 : 360, 0, .05, 'square', .05); sync()
    }}, h('i'), h('span', {}, (p.labels?.[i]) || 'S' + (i + 1)))))
    sync()
  }
  if (p.input === 'clock') {   // Zeiger stellen: Lösung als „4:10“
    box.className = 'clockpad'
    let hh = 12, mm = 0
    const face = h('div', {class: 'clockface'})
    const draw = () => {
      const ha = (hh % 12 + mm / 60) * 30, ma = mm * 6
      face.innerHTML = `<svg viewBox="-50 -50 100 100"><circle r="47" fill="#efe9d8" stroke="#5a4030" stroke-width="3"/>${
        Array.from({length: 12}, (_, i) => `<text x="${Math.sin(i * Math.PI / 6) * 36}" y="${-Math.cos(i * Math.PI / 6) * 36 + 4}" font-size="10" text-anchor="middle" fill="#222" font-family="Georgia,serif">${['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'][i]}</text>`).join('')
      }<line y2="-22" stroke="#111" stroke-width="3.4" stroke-linecap="round" transform="rotate(${ha})"/><line y2="-34" stroke="#111" stroke-width="2" stroke-linecap="round" transform="rotate(${ma})"/><circle r="2.6" fill="#8a6a2a"/></svg>`
      $('#pa').value = `${hh}:${String(mm).padStart(2, '0')}`
    }
    const btn = (label, f) => h('button', {type: 'button', class: 'btn', onclick: () => { f(); tone(1200, 0, .03, 'square', .03); draw() }}, label)
    box.append(face, h('div', {class: 'clockbtns'},
      h('span', {class: 'mono'}, t('clock.hour')), btn('−', () => { hh = hh === 1 ? 12 : hh - 1 }), btn('＋', () => { hh = hh === 12 ? 1 : hh + 1 }),
      h('span', {class: 'mono'}, t('clock.min')), btn('−', () => { mm = (mm + 55) % 60 }), btn('＋', () => { mm = (mm + 5) % 60 })))
    draw()
  }
  if (p.input === 'colors') {
    box.className = 'colorpad'
    const seq = []
    const sync = () => { $('#pa').value = seq.join(' ') }
    for (const [name, col] of p.colors) box.append(h('button', {type: 'button', class: 'cp', style: `--c:${col}`, onclick: () => { seq.push(name); tone(300 + seq.length * 60, 0, .08, 'sine', .08); sync() }}, name))
    box.append(h('button', {type: 'button', class: 'cp del', onclick: () => { seq.pop(); sync() }}, '⌫'))
    sync()
  }
}

/* =================== Seiten-Widgets =================== */
// Frequenzanzeige beim Tonband: zeigt die zwei stärksten Töne (für Wähltöne)
export function spectrum(el, src, g) {
  const a = audio(), an = a.createAnalyser(); an.fftSize = 8192; g.connect(an)
  let out = $('.spec', el); if (!out) { out = h('div', {class: 'spec'}); el.append(out) }
  const bins = new Float32Array(an.frequencyBinCount), hz = a.sampleRate / an.fftSize
  const loop = () => {
    if (!el.classList.contains('playing')) { out.textContent = t('spec.off'); return }
    an.getFloatFrequencyData(bins)
    const peaks = []
    for (let i = Math.floor(500 / hz); i < 1700 / hz; i++) if (bins[i] > -48 && bins[i] >= bins[i - 1] && bins[i] >= bins[i + 1]) peaks.push([bins[i], i * hz])
    peaks.sort((x, y) => y[0] - x[0])
    const top = []
    for (const [, f] of peaks) { if (top.every(t => Math.abs(t - f) > 60)) top.push(f); if (top.length === 2) break }
    out.textContent = top.length === 2 ? t('spec.on', {f: top.sort((x, y) => x - y).map(f => Math.round(f / 5) * 5 + ' Hz').join(' + ')}) : t('spec.off')
    requestAnimationFrame(loop)
  }
  loop()
}
// Funkempfänger: Frequenz einstellen, bis die Stimme aus dem Rauschen auftaucht
export function mountTuner(el) {
  const clip = G.c.clips?.[el.dataset.tuner]; if (!clip) return
  const m = AU.manifest[akey('clip:' + el.dataset.tuner, clip.text || '')]
  const min = Number(el.dataset.min || 150), max = Number(el.dataset.max || 170), target = Number(el.dataset.target)
  el.classList.add('tuner')
  el.replaceChildren(
    h('div', {class: 'freq'}, h('b', {}, dec(min.toFixed(3))), ' MHz'),
    h('div', {class: 'sig'}, h('i')),
    h('input', {type: 'range', min, max, step: .005, value: min, 'aria-label': t('tuner.aria')}),
    h('div', {class: 'tctl'}, h('button', {class: 'btn', type: 'button'}, t('tuner.on')), h('button', {class: 'btn fine', type: 'button', 'data-d': -.005}, '−'), h('button', {class: 'btn fine', type: 'button', 'data-d': .005}, '+')))
  let nodes = null
  const range = $('input', el)
  const update = () => {
    const f = Number(range.value), d = Math.abs(f - target)
    const v = Math.max(0, 1 - d / .06)
    $('.freq b', el).textContent = dec(f.toFixed(3))
    $('.sig i', el).style.width = Math.round(Math.max(.04, v) * 100) + '%'
    if (nodes) { nodes.vg.gain.value = v * voiceVol; nodes.ng.gain.value = (1 - v * .85) * .18 * voiceVol }
  }
  range.oninput = update
  $$('.fine', el).forEach(b => b.onclick = () => { range.value = (Number(range.value) + Number(b.dataset.d)).toFixed(3); update() })
  $('.tctl .btn', el).onclick = async e => {
    const a = audio()
    if (nodes) { nodes.stop(); nodes = null; e.target.textContent = t('tuner.on'); el.classList.remove('playing'); return }
    const nb = a.createBuffer(1, a.sampleRate * 2, a.sampleRate), nd = nb.getChannelData(0)
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1
    const ns = a.createBufferSource(); ns.buffer = nb; ns.loop = true
    const ng = a.createGain(), vg = a.createGain(), bp = a.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = .5
    ns.connect(bp).connect(ng).connect(master); ns.start()
    let vs = null
    if (m) { const buf = await a.decodeAudioData(await (await fetch(AU.base + m.f)).arrayBuffer()); vs = a.createBufferSource(); vs.buffer = buf; vs.loop = true; vs.connect(vg).connect(master); vs.start() }
    nodes = {ng, vg, stop: () => { try { ns.stop(); vs?.stop() } catch {} }}
    stopVoice(); e.target.textContent = t('tuner.off'); el.classList.add('playing'); update()
  }
  el._cleanup = () => nodes?.stop()
  update()
}
// Chiffrierscheibe: verschiebt jeden Buchstaben, bis der Text lesbar wird
export function mountCipher(el) {
  const text = el.dataset.cipher.toUpperCase(), A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let k = 0
  el.classList.add('cipher')
  const draw = () => {
    const dec = text.replace(/[A-Z]/g, ch => A[(A.indexOf(ch) - k + 26) % 26])
    el.replaceChildren(
      h('div', {class: 'wheel'}, h('div', {class: 'row'}, ...[...A].map(c => h('span', {}, c))), h('div', {class: 'row sh'}, ...[...A].map((_, i) => h('span', {}, A[(i - k + 26) % 26])))),
      h('div', {class: 'tctl'}, h('button', {class: 'btn', type: 'button', onclick: () => { k = (k + 25) % 26; draw() }}, '◀'), h('b', {}, t('cipher.shift', {k})), h('button', {class: 'btn', type: 'button', onclick: () => { k = (k + 1) % 26; draw() }}, '▶')),
      h('div', {class: 'dec'}, dec))
  }
  draw()
}
// Beweisfoto mit Lupe: zoomen und verschieben
export function mountPhoto(el) {
  const svg = G.c.photos?.[el.dataset.photo]; if (!svg) return
  el.classList.add('photo')
  const vb = svg.match(/viewBox="0 0 (\d+) (\d+)"/)
  if (vb) el.style.setProperty('--ar', vb[1] + '/' + vb[2])
  el.innerHTML = `<div class="vp"><div class="img">${svg}</div></div><div class="tctl"><button class="btn" type="button" data-z="1.6">＋</button><button class="btn" type="button" data-z=".625">－</button><button class="btn" type="button" data-z="0">⟲</button><span class="mono">${t('photo.drag')}</span></div>`
  const vp = $('.vp', el), img = $('.img', el)
  let z = 1, tx = 0, ty = 0
  const apply = () => {
    const w = vp.clientWidth, hh = vp.clientHeight
    tx = Math.min(0, Math.max(w - w * z, tx)); ty = Math.min(0, Math.max(hh - hh * z, ty))
    img.style.transform = `translate(${tx}px,${ty}px) scale(${z})`
  }
  const zoomAt = (f, cx, cy) => { const nz = Math.min(10, Math.max(1, z * f)); tx = cx - (cx - tx) * nz / z; ty = cy - (cy - ty) * nz / z; z = nz; apply() }
  $$('[data-z]', el).forEach(b => b.onclick = () => { const f = Number(b.dataset.z); if (!f) { z = 1; tx = ty = 0; apply() } else zoomAt(f, vp.clientWidth / 2, vp.clientHeight / 2) })
  vp.addEventListener('wheel', e => { e.preventDefault(); const r = vp.getBoundingClientRect(); zoomAt(e.deltaY < 0 ? 1.25 : .8, e.clientX - r.left, e.clientY - r.top) }, {passive: false})
  let drag = null
  vp.addEventListener('pointerdown', e => { drag = [e.clientX - tx, e.clientY - ty]; vp.setPointerCapture(e.pointerId) })
  vp.addEventListener('pointermove', e => { if (!drag) return; tx = e.clientX - drag[0]; ty = e.clientY - drag[1]; apply() })
  vp.addEventListener('pointerup', () => { drag = null })
  apply()
}
// Aktenvernichter-Streifen: zwei anklicken, um sie zu tauschen, bis der Text lesbar ist
export function mountShred(el) {
  const sh = G.c.shreds?.[el.dataset.shred]; if (!sh) return
  const L = Math.max(...sh.lines.map(l => l.length)), n = sh.n || 8, w = Math.ceil(L / n)
  const lines = sh.lines.map(l => l.padEnd(n * w, ' '))
  const store = (G.shredOrder ||= {})
  const order = store[el.dataset.shred] ||= (sh.order || [...Array(n).keys()].reverse()).slice()
  let sel = null
  el.classList.add('shred')
  const draw = () => {
    const solved = order.every((v, i) => v === i)
    el.classList.toggle('solved', solved)
    el.replaceChildren(h('div', {class: 'strips'}, ...order.map((si, pos) => h('button', {type: 'button', class: 'strip' + (sel === pos ? ' sel' : ''), style: `--r:${((si * 37) % 7 - 3) * .4}deg`,
      onclick: () => {
        if (sel === null) { sel = pos } else { [order[sel], order[pos]] = [order[pos], order[sel]]; sel = null; tone(400 + pos * 30, 0, .05, 'triangle', .05) }
        draw()
      }}, ...lines.map(l => h('span', {}, l.slice(si * w, si * w + w).replace(/ /g, ' ')))))),
      h('p', {class: 'mono'}, solved ? t('shred.done') : t('shred.hint')))
  }
  draw()
}
