// Töne (Web Audio), Stimmen (Aufnahmen oder Sprachausgabe), Lippenbewegung, Atmosphäre.
import {G} from './game.mjs'
import {$$, TEST, fill, store} from './core.mjs'
import {akey, audioText} from './lib.mjs'
import {cueAt, setMouth, textCues} from './portraits/speech.mjs'
import {lang, t} from './i18n.mjs'

/* =================== Töne =================== */
export let actx = null, master = null, sfxBus = null
export function audio() {
  try {
    if (!actx) {
      actx = new (window.AudioContext || window.webkitAudioContext)()
      // Ausgang: Begrenzer, damit Stimmen + Atmosphäre + Effekte nie übersteuern
      const lim = actx.createDynamicsCompressor()
      lim.threshold.value = -6; lim.knee.value = 6; lim.ratio.value = 12; lim.attack.value = .003; lim.release.value = .18
      lim.connect(actx.destination)
      master = actx.createGain(); master.connect(lim)
    }
    if (actx.state === 'suspended') actx.resume()
  } catch {}
  return actx
}
// Effekte laufen über einen Bus mit etwas Raumhall; Stimmen und Atmosphäre gehen direkt auf master.
export function impulse(a, secs) {
  const n = Math.floor(a.sampleRate * secs), ir = a.createBuffer(2, n, a.sampleRate)
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c)
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-4.5 * i / n) * Math.min(1, i / (a.sampleRate * .012))
  }
  return ir
}
export function bus() {
  const a = audio(); if (!a) return null
  if (!sfxBus) {
    sfxBus = a.createGain(); sfxBus.gain.value = 1.8
    const room = a.createConvolver(), wet = a.createGain()
    room.buffer = impulse(a, 1.3); wet.gain.value = .2
    sfxBus.connect(master); sfxBus.connect(room); room.connect(wet).connect(master)
  }
  return sfxBus
}
export function tone(freq, t0, dur, type = 'sine', vol = .12) {
  const a = audio(), out = bus(); if (!a || !out) return
  const at = a.currentTime + t0
  // Grundton plus leiser Oberton (klingt weniger nach Piepser); alles mit Hüllkurve gegen Knackser
  const parts = type === 'sine' ? [[1, 1], [2.01, .22], [3, .06]] : [[1, 1]]
  for (const [m, k] of parts) {
    const o = a.createOscillator(), g = a.createGain()
    o.type = type; o.frequency.value = freq * m
    g.gain.setValueAtTime(0, at)
    g.gain.linearRampToValueAtTime(vol * k, at + .015)
    g.gain.exponentialRampToValueAtTime(.0001, at + dur / (m > 1 ? 1.6 : 1))
    o.connect(g).connect(out); o.start(at); o.stop(at + dur + .05)
  }
}
export function noise(dur, vol = .25, freq = 1800) {
  const a = audio(), out = bus(); if (!a || !out) return
  const buf = a.createBuffer(1, Math.max(1, a.sampleRate * dur), a.sampleRate), d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (Math.random() < .3 ? 1 : .2)
  const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(), t = a.currentTime
  s.buffer = buf; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = .7
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.001, t + dur)
  s.connect(f).connect(g).connect(out); s.start()
}
export const SFX = {
  join: () => { tone(523, 0, .25); tone(659, .1, .25); tone(784, .2, .4) },
  leave: () => { tone(659, 0, .25); tone(440, .12, .45) },
  knock: () => { [0, .18, .5].forEach(t => tone(90, t, .12, 'triangle', .5)) },
  ring: () => { for (let i = 0; i < 4; i++) { tone(880, i * .25, .1, 'square', .05); tone(1100, i * .25 + .08, .1, 'square', .05) } },
  call: () => { for (let i = 0; i < 2; i++) { tone(440, i * .45, .35, 'sine', .1); tone(480, i * .45, .35, 'sine', .08) } },
  glitch: () => { noise(.5, .35, 1200); tone(55, 0, .6, 'sawtooth', .08) },
  static: () => noise(1.2, .2, 2600),
  page: () => tone(1320, 0, .12, 'sine', .06),
  right: () => { tone(660, 0, .15); tone(990, .12, .35) },
  wrong: () => tone(140, 0, .35, 'square', .07),
  near: () => { tone(440, 0, .15); tone(415, .12, .25) },
  chapter: () => { tone(98, 0, 2.2, 'sine', .18); tone(147, .05, 2, 'sine', .08); noise(.8, .05, 400) },
  end: () => { tone(392, 0, .6); tone(494, .2, .6); tone(587, .4, 1.2) },
  off: () => { tone(120, 0, .4, 'sawtooth', .1); noise(.3, .2, 300) },
  beat: () => { tone(60, 0, .15, 'sine', .4); tone(55, .22, .18, 'sine', .3) },
  chat: () => { tone(1046, 0, .08, 'sine', .05); tone(1318, .07, .1, 'sine', .05) }
}

/* =================== Stimmen: Aufnahmen, sonst Sprachausgabe =================== */
export let voiceOn = !TEST && store.get('voice', '1') === '1'
export let voiceVol = Number(store.get('vol', '0.9'))
export function setVoiceOn(on) { voiceOn = on; store.set('voice', on ? '1' : '0') }
export function setVoiceVol(v) { voiceVol = v; store.set('vol', v) }
export const AU = {manifest: {}, cues: {}, base: '', el: null, raf: 0, amb: null, ambName: null}
export let deVoice = null
export function pickVoice() {
  const vs = speechSynthesis?.getVoices?.() || []
  // Nur lokale Stimmen: Online-Stimmen schicken den Text an einen Server.
  deVoice = vs.find(v => v.localService && v.lang?.toLowerCase().startsWith(lang)) || null
}
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice }
export async function loadAudio(id) {
  AU.base = `cases/${id}/audio${lang === 'en' ? '-en' : ''}/`
  const read = async file => {
    try {
      const res = await fetch(AU.base + file, {cache: 'no-cache'})
      return res.ok ? await res.json() : {}
    } catch { return {} }
  }
  ;[AU.manifest, AU.cues] = await Promise.all([read('manifest.json'), read('mouth-cues.json')])
  // Aufnahmen im Hintergrund vorladen (klein, damit es später nicht ruckelt)
  const files = [...new Set(Object.values(AU.manifest).map(m => m.f))]
  ;(async () => { for (const f of files) { try { await fetch(AU.base + f) } catch {} } })()
}
export const lineMeta = (npc, text) => AU.manifest[akey(npc, audioText(text, lang))]
export function stopVoice() {
  try { AU.el?.pause() } catch {}
  AU.el = null; AU.utterance = null; cancelAnimationFrame(AU.raf)
  $$('.tile.npc').forEach(t => setMouth(t, null))
  if ('speechSynthesis' in window) speechSynthesis.cancel()
}
export function speak(npc, text, tile) {
  stopVoice()
  if (!voiceOn) return
  const m = lineMeta(npc, text)
  if (m) {
    const a = audio()
    const el = new Audio(AU.base + m.f)
    AU.el = el
    const cues = AU.cues[m.f]
    let analyser, buffer, level = 0, previous = performance.now()
    try {
      const src = a.createMediaElementSource(el), gain = a.createGain()
      gain.gain.value = voiceVol
      if (tile && !cues) {
        analyser = a.createAnalyser()
        analyser.fftSize = 512
        buffer = new Uint8Array(analyser.fftSize)
        src.connect(analyser); analyser.connect(gain)
      } else src.connect(gain)
      gain.connect(master)
    } catch { el.volume = voiceVol }
    const animate = now => {
      if (AU.el !== el || !tile) return
      if (cues) setMouth(tile, cueAt(cues, el.currentTime))
      else if (analyser) {
        analyser.getByteTimeDomainData(buffer)
        let sum = 0
        for (const v of buffer) sum += (v - 128) ** 2
        const target = Math.max(0, Math.min(1, (Math.sqrt(sum / buffer.length) / 128 - .02) * 7))
        level += (target - level) * (1 - Math.exp(-(now - previous) / (target > level ? 35 : 65)))
        setMouth(tile, null, level)
      }
      previous = now
      AU.raf = requestAnimationFrame(animate)
    }
    if (tile) AU.raf = requestAnimationFrame(animate)
    const finished = () => {
      if (AU.el !== el) return
      cancelAnimationFrame(AU.raf)
      setMouth(tile, null)
      AU.el = null
    }
    el.onended = el.onerror = finished
    el.play().catch(finished)
    return
  }
  // Lokale Ersatzstimme: geschätzte Lautfolge an Wortgrenzen neu verankern.
  if (!('speechSynthesis' in window) || !deVoice) return
  const u = new SpeechSynthesisUtterance(fill(text))
  u.voice = deVoice; u.lang = deVoice.lang; u.volume = voiceVol
  const v = G.c?.npcs[npc]?.tts || {}
  u.pitch = v.pitch ?? 1; u.rate = v.rate ?? 1
  AU.utterance = u
  u.onend = u.onerror = () => {
    if (AU.utterance !== u) return
    AU.utterance = null
    setMouth(tile, null)
  }
  const schedule = textCues(u.text, u.rate)
  let start = 0, offset = 0
  const animate = now => {
    if (AU.utterance !== u || !tile) return
    setMouth(tile, cueAt(schedule.cues, offset + (now - start) / 1000))
    AU.raf = requestAnimationFrame(animate)
  }
  u.onstart = () => {
    if (AU.utterance !== u) return
    start = performance.now()
    AU.raf = requestAnimationFrame(animate)
  }
  u.onboundary = e => {
    if (e.name !== 'word' || schedule.offsets[e.charIndex] == null) return
    start = performance.now()
    offset = schedule.offsets[e.charIndex] / 100
  }
  speechSynthesis.speak(u)
}
export function sayDuration(npc, text) {
  const m = lineMeta(npc, text, '')
  if (m) return m.d + 450
  return 1100 + fill(text).length * 62 / (G.c?.npcs[npc]?.tts?.rate || 1)
}
// Atmosphäre: Web Audio statt <audio loop>. AAC dämpft die ersten Samples einer Datei, ein Datei-Loop knackt oder
// „atmet“ darum. Die Dateien tragen 0,5 s Vor- und Nachlauf (voices.py --ambience), die Schleife läuft nur im Innern.
export const AMB_LOOP = 32, AMB_PAD = .5
export const ambBufs = {}
export const ambBuffer = name => ambBufs[name] ||= fetch(`audio/${name}.m4a`).then(r => r.arrayBuffer()).then(b => audio().decodeAudioData(b))
export const ambLevel = () => .5 * voiceVol
export function setAmbience(name) {
  if (TEST) name = null
  if (AU.ambName === name) return
  AU.ambName = name
  const old = AU.amb
  if (old) {
    old.gain.gain.setTargetAtTime(0, actx.currentTime, .35)
    setTimeout(() => { try { old.src?.stop() } catch {} old.gain.disconnect() }, 2500)
  }
  AU.amb = null
  const a = name && audio()
  if (!a) return
  const amb = {gain: a.createGain(), src: null}
  amb.gain.gain.value = 0; amb.gain.connect(master)
  AU.amb = amb
  ambBuffer(name).then(buf => {
    if (AU.amb !== amb) return
    const s = a.createBufferSource()
    s.buffer = buf; s.loop = true; s.loopStart = AMB_PAD; s.loopEnd = AMB_PAD + AMB_LOOP
    s.connect(amb.gain); s.start(0, AMB_PAD); amb.src = s
    amb.gain.gain.setTargetAtTime(ambLevel(), a.currentTime, .8)
  }).catch(() => { delete ambBufs[name] })
}
