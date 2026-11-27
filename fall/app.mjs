// „Akte 0“ — Exit-Games im Videoanruf, auf Basis von anruf.org.
// Anruf: Trystero (Signaling über Nostr), Medien direkt zwischen den Browsern, wie in ../index.html.
// Spiel: Ein Host arbeitet das Skript des Falls ab und schickt nach jeder Änderung den ganzen Spielstand an alle.
// Alle anderen zeigen nur an. Legt der Host auf, übernimmt die Person mit der kleinsten ID ab demselben Schritt.
// Der Host speichert den Stand im Browser: Ein langer Fall lässt sich später über denselben Link fortsetzen.

import {joinRoom, selfId} from '../vendor/trystero.mjs'
import qrcode from '../vendor/qrcode.mjs'
import {APP_ID, DEFAULT_RELAYS, TURN, TURN_FALLBACK} from '../config.mjs'
import {CASES} from './cases/index.mjs'
import {portrait} from './portrait.mjs'
import {cueAt, setMouth, textCues} from './portraits/speech.mjs'
import {akey, audioText, norm, sha} from './lib.mjs'

const $ = (s, el = document) => el.querySelector(s)
const $$ = (s, el = document) => [...el.querySelectorAll(s)]
const h = (tag, attrs = {}, ...kids) => {
  const el = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v
    else if (k === 'html') el.innerHTML = v
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v)
    else if (v !== false && v != null) el.setAttribute(k, v === true ? '' : v)
  }
  for (const k of kids.flat()) if (k != null && k !== false) el.append(k)
  return el
}
const qs = new URLSearchParams(location.search)
const RELAYS = qs.get('relay') ? [qs.get('relay')] : DEFAULT_RELAYS
const LIMIT = 8
// ?fast: Wartezeiten ×0,1 zum Ausprobieren · ?test: ×0,02 und stumm, für den automatischen Durchlauf (tools/test.html)
const TEST = qs.has('test')
const SPEED = TEST ? .02 : qs.has('fast') ? .1 : 1
const store = {
  get: (k, d) => { try { return localStorage.getItem('fall.' + k) ?? d } catch { return d } },
  set: (k, v) => { try { localStorage.setItem('fall.' + k, v) } catch {} },
  del: k => { try { localStorage.removeItem('fall.' + k) } catch {} }
}
const sess = {
  get: k => { try { return sessionStorage.getItem('fall.' + k) } catch { return null } },
  set: (k, v) => { try { sessionStorage.setItem('fall.' + k, v) } catch {} }
}
const cleanName = s => String(s || '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 24)
const randomSlug = () => {
  const a = ['nacht', 'nebel', 'funk', 'akte', 'spur', 'signal', 'echo', 'schatten', 'sturm', 'glas']
  const b = ['falke', 'leitung', 'lampe', 'kanal', 'notiz', 'welle', 'zeuge', 'turm', 'boje', 'datei']
  const r = n => n[Math.floor(Math.random() * n.length)]
  return `${r(a)}-${r(b)}-${Math.random().toString(36).slice(2, 7)}`
}
let myName = cleanName(store.get('name', ''))

function toast(text, ms = 3400, cls = '') {
  const t = h('div', {class: 'toast ' + cls}, text)
  $('#toasts').append(t)
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400) }, ms)
}
const fmtClock = ms => {
  const s = Math.max(0, Math.floor(ms / 1000)), hh = Math.floor(s / 3600)
  return (hh ? hh + ':' : '') + `${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
const fill = text => String(text).replace(/\{me\}/g, myName)
  .replace(/\{time\}/g, new Date().toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'}) + ' Uhr')

function qrSvg(text) {
  const q = qrcode(0, 'M'); q.addData(text); q.make()
  const n = q.getModuleCount(); let d = ''
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`
  return `<svg viewBox="-2 -2 ${n + 4} ${n + 4}" shape-rendering="crispEdges"><rect x="-2" y="-2" width="${n + 4}" height="${n + 4}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`
}

/* =================== Töne =================== */
let actx = null, master = null, sfxBus = null
function audio() {
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
function impulse(a, secs) {
  const n = Math.floor(a.sampleRate * secs), ir = a.createBuffer(2, n, a.sampleRate)
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c)
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-4.5 * i / n) * Math.min(1, i / (a.sampleRate * .012))
  }
  return ir
}
function bus() {
  const a = audio(); if (!a) return null
  if (!sfxBus) {
    sfxBus = a.createGain(); sfxBus.gain.value = 1.8
    const room = a.createConvolver(), wet = a.createGain()
    room.buffer = impulse(a, 1.3); wet.gain.value = .2
    sfxBus.connect(master); sfxBus.connect(room); room.connect(wet).connect(master)
  }
  return sfxBus
}
function tone(freq, t0, dur, type = 'sine', vol = .12) {
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
function noise(dur, vol = .25, freq = 1800) {
  const a = audio(), out = bus(); if (!a || !out) return
  const buf = a.createBuffer(1, Math.max(1, a.sampleRate * dur), a.sampleRate), d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (Math.random() < .3 ? 1 : .2)
  const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(), t = a.currentTime
  s.buffer = buf; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = .7
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.001, t + dur)
  s.connect(f).connect(g).connect(out); s.start()
}
const SFX = {
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
let voiceOn = !TEST && store.get('voice', '1') === '1'
let voiceVol = Number(store.get('vol', '0.9'))
const AU = {manifest: {}, cues: {}, base: '', el: null, raf: 0, amb: null, ambName: null}
let deVoice = null
function pickVoice() {
  const vs = speechSynthesis?.getVoices?.() || []
  // Nur lokale Stimmen: Online-Stimmen schicken den Text an einen Server.
  deVoice = vs.find(v => v.localService && v.lang?.toLowerCase().startsWith('de')) || null
}
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice }
async function loadAudio(id) {
  AU.base = `cases/${id}/audio/`
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
const lineMeta = (npc, text) => AU.manifest[akey(npc, audioText(text))]
function stopVoice() {
  try { AU.el?.pause() } catch {}
  AU.el = null; AU.utterance = null; cancelAnimationFrame(AU.raf)
  $$('.tile.npc').forEach(t => setMouth(t, null))
  if ('speechSynthesis' in window) speechSynthesis.cancel()
}
function speak(npc, text, tile) {
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
function sayDuration(npc, text) {
  const m = lineMeta(npc, text, '')
  if (m) return m.d + 450
  return 1100 + fill(text).length * 62 / (G.c?.npcs[npc]?.tts?.rate || 1)
}
// Atmosphäre: Web Audio statt <audio loop>. AAC dämpft die ersten Samples einer Datei, ein Datei-Loop knackt oder
// „atmet“ darum. Die Dateien tragen 0,5 s Vor- und Nachlauf (voices.py --ambience), die Schleife läuft nur im Innern.
const AMB_LOOP = 32, AMB_PAD = .5
const ambBufs = {}
const ambBuffer = name => ambBufs[name] ||= fetch(`audio/${name}.m4a`).then(r => r.arrayBuffer()).then(b => audio().decodeAudioData(b))
const ambLevel = () => .5 * voiceVol
function setAmbience(name) {
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

/* =================== Startseite =================== */
let caseId = '', slug = ''
{
  const m = location.hash.slice(1).match(/^([a-z0-9-]+)\/([a-z0-9-]+)$/i)
  if (m && CASES.some(c => c.id === m[1])) { caseId = m[1]; slug = m[2].toLowerCase() }
}
function setupHome() {
  const invited = !!slug
  document.body.dataset.invited = invited ? '1' : ''
  $('#nameIn').value = myName
  $('#nameIn').addEventListener('input', () => $('#nameIn').classList.remove('need'))
  let picked = caseId || store.get('case', CASES[0].id)
  if (!CASES.some(c => c.id === picked)) picked = CASES[0].id
  const renderCases = () => {
    $('#cases').replaceChildren(...CASES.filter(c => !invited || c.id === caseId).map(c => h('button', {
      class: 'casecard' + (c.id === picked ? ' on' : ''), type: 'button', style: `--a:${c.accent}`,
      onclick: () => { if (invited) return; picked = c.id; store.set('case', c.id); renderCases() }
    },
    h('div', {class: 'cover', html: portrait(c.cover)}),
    h('div', {class: 'cbody'},
      h('div', {class: 'mono'}, c.file, c.solo ? h('span', {class: 'solotag'}, 'Solo') : null),
      h('h3', {}, c.title),
      h('p', {}, c.tagline),
      h('div', {class: 'meta'}, h('span', {}, '👥 ' + c.players), h('span', {}, '⏱ ' + c.duration), h('span', {title: 'Schwierigkeit'}, '◆'.repeat(c.difficulty) + '◇'.repeat(3 - c.difficulty)))
    ))))
  }
  renderCases()
  $('#goBtn').textContent = invited ? 'Dem Anruf beitreten' : 'Fall eröffnen'
  $('#homeLead').textContent = invited
    ? 'Du wurdest in einen laufenden Fall gerufen. Jemand braucht deine Hilfe. Jetzt.'
    : 'Exit-Games im Videoanruf. Jede Person bekommt andere Unterlagen. Figuren rufen an, klopfen an, lügen euch an. Ohne Konto, ohne App, direkt im Browser.'
  $('#goBtn').addEventListener('click', () => {
    const nm = cleanName($('#nameIn').value)
    if (!nm) { $('#nameIn').classList.add('need'); $('#nameIn').focus(); toast('Wie heißt du? Die anderen und die Figuren sprechen dich mit deinem Namen an.'); return }
    myName = nm; store.set('name', myName)
    audio()
    if (!slug) { caseId = picked; slug = randomSlug(); sess.set('host.' + caseId + '/' + slug, '1'); history.replaceState(null, '', '#' + caseId + '/' + slug) }
    enter()
  })
  // Gespeicherte Fälle zum Fortsetzen
  const saves = []
  try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k?.startsWith('fall.save.')) saves.push([k.slice(10), JSON.parse(localStorage.getItem(k))]) } } catch {}
  saves.sort((a, b) => b[1].at - a[1].at)
  $('#saves').hidden = !saves.length || invited
  $('#saveList').replaceChildren(...saves.slice(0, 5).map(([room, sv]) => h('li', {},
    h('a', {href: '#' + room, onclick: () => sess.set('host.' + room, '1')}, `${sv.title} · Kapitel ${sv.chapter || 1}`),
    h('small', {}, ' ' + new Date(sv.at).toLocaleString('de-DE', {dateStyle: 'short', timeStyle: 'short'})),
    h('button', {class: 'x', title: 'Löschen', type: 'button', onclick: e => { e.preventDefault(); store.del('save.' + room); e.target.closest('li').remove() }}, '×'))))
  $('#codeForm').addEventListener('submit', async e => {
    e.preventDefault()
    const code = norm($('#codeIn').value)
    for (const meta of CASES) {
      const c = (await meta.load()).default
      const k = c.codes?.[await sha(c.id, code)]
      if (k) { const en = c.endings[k]; $('#codeOut').replaceChildren(h('b', {}, `${c.title} · ${en.title}`), h('br'), en.epilog); return }
    }
    $('#codeOut').textContent = 'Dieser Code öffnet keine Akte.'
  })
}
window.addEventListener('hashchange', () => location.reload())

/* =================== Anruf =================== */
const R = {room: null, stream: null, peers: new Map(), mic: true, cam: true, snap: null}
const peerOf = id => {
  let p = R.peers.get(id)
  if (!p) {
    p = {id, name: '…', mic: true, cam: false, joinedAt: Date.now()}
    p.tile = makeTile(p)
    R.peers.set(id, p)
    layout()
  }
  return p
}
let iceCache = null
async function getTurn() {
  if (iceCache) return iceCache
  if (TURN.apiKey && TURN.domain && !qs.get('relay')) {
    try {
      const res = await fetch(`https://${TURN.domain}/api/v1/turn/credentials?apiKey=${encodeURIComponent(TURN.apiKey)}`, {signal: AbortSignal.timeout?.(4000)})
      if (!res.ok) throw 0
      const list = await res.json()
      const turn = (Array.isArray(list) ? list : []).filter(s => [].concat(s.urls).some(u => /^turns?:/.test(u)))
      if (turn.length) return (iceCache = turn)
    } catch {}
  }
  return TURN_FALLBACK.length ? TURN_FALLBACK : null
}
async function getMedia() {
  if (qs.has('nomedia') || !navigator.mediaDevices?.getUserMedia) return new MediaStream()
  const audioC = {echoCancellation: true, noiseSuppression: true, autoGainControl: true}
  const videoC = {width: {ideal: 640}, height: {ideal: 480}, frameRate: {ideal: 24, max: 30}, facingMode: 'user'}
  try { return await navigator.mediaDevices.getUserMedia({audio: audioC, video: videoC}) } catch {}
  try { return await navigator.mediaDevices.getUserMedia({audio: audioC}) } catch {}
  toast('Ohne Kamera und Mikrofon. Du kannst trotzdem mitspielen und im Chat schreiben.', 5000)
  return new MediaStream()
}

async function enter() {
  document.body.dataset.view = 'room'
  const meta = CASES.find(c => c.id === caseId)
  const [stream, turn, mod] = await Promise.all([getMedia(), getTurn(), meta.load(), loadAudio(caseId)])
  G.c = mod.default
  document.documentElement.style.setProperty('--amber', G.c.accent || '#ffb23f')
  $('#caseTitle').textContent = G.c.unit
  $('#caseSub').textContent = '· ' + G.c.title
  document.title = G.c.title + ' — Akte 0'
  R.stream = stream
  R.mic = stream.getAudioTracks().length > 0
  R.cam = stream.getVideoTracks().length > 0
  R.self = {id: selfId, name: myName, self: true}
  R.self.tile = makeTile(R.self)
  setVideo(R.self, stream)
  syncDock(); layout()

  const room = joinRoom({appId: APP_ID, relayConfig: {urls: RELAYS, warnOnRelayFailure: false}, turnConfig: turn || []}, `fall/${caseId}/${slug}`, {
    onJoinError: d => console.warn('fall: join error', d)
  })
  R.room = room
  R.meta = room.makeAction('meta')
  R.game = room.makeAction('game')
  R.chat = room.makeAction('chat')
  R.scr = room.makeAction('scr')
  R.scr.onMessage = (d, {peerId}) => {
    const p = peerOf(peerId)
    if (d?.on) p.screenSid = String(d.sid || '')
    else { p.screenSid = ''; removeScreen(p) }
  }
  R.meta.onMessage = (d, {peerId}) => {
    if (!d || typeof d !== 'object') return
    const p = peerOf(peerId)
    const n = cleanName(d.n) || 'Gast'
    if (p.name === '…') { toast(`${n} ist in der Leitung`); sysMsg(`${n} ist dazugekommen`) }
    p.name = n; p.mic = !!d.mic; p.cam = !!d.cam; p.hasCam = d.hc !== false; p.hasMic = d.hm !== false; p.covered = !!d.cv
    updateTile(p)
    G.onPeerMeta(p)
    if (G.state) G.render(); else renderLobby()
  }
  R.game.onMessage = (d, {peerId}) => G.onMessage(d, peerId)
  R.chat.onMessage = (d, {peerId}) => {
    if (typeof d?.t !== 'string') return
    const t = d.t.slice(0, 500).trim(); if (!t) return
    addMsg(peerOf(peerId).name, t, 'peer')
  }
  room.onPeerJoin = id => {
    const p = peerOf(id)
    if (R.peers.size >= LIMIT) toast('Die Leitung ist voll (max. 8).')
    if (R.stream.getTracks().length) room.addStream(R.stream, {target: id})
    sendMeta(id)
    shareScreenTo(id)
    G.onPeerJoin(p)
    SFX.join(); renderLobby()
  }
  room.onPeerLeave = id => {
    const p = R.peers.get(id); if (!p) return
    R.peers.delete(id)
    removeScreen(p)
    p.tile.classList.add('out'); setTimeout(() => { p.tile.remove(); layout() }, 350)
    if (p.name !== '…') { toast(`${p.name} hat aufgelegt`); sysMsg(`${p.name} hat aufgelegt`) }
    SFX.leave()
    G.onPeerLeave(id)
    renderLobby()
  }
  room.onPeerStream = (s, id, meta) => {
    const p = peerOf(id)
    if (meta?.screen || (p.screenSid && s.id === p.screenSid)) addScreen(p, s)
    else setVideo(p, s)
  }
  startSensors()
  G.init()
}
function sendMeta(target) {
  try { R.meta?.send({n: myName, mic: R.mic, cam: R.cam, hc: R.stream?.getVideoTracks().length > 0, hm: R.stream?.getAudioTracks().length > 0, cv: !!R.covered}, target ? {target} : undefined)?.catch?.(() => {}) } catch {}
}
function players() {
  return [selfId, ...[...R.peers.values()].filter(p => p.name !== '…').map(p => p.id)].sort()
}
const nameOf = id => id === selfId ? myName : (R.peers.get(id)?.name || G.state?.names?.[id] || 'Gast')
const micOf = id => id === selfId ? R.mic : !!R.peers.get(id)?.mic
const camOf = id => id === selfId ? R.cam : !!R.peers.get(id)?.cam
// Wer gar keine Kamera hat, kann sie nicht anschalten: zählt bei „alle Kameras an“ als erfüllt
const hasCamOf = id => id === selfId ? R.stream?.getVideoTracks().length > 0 : R.peers.get(id)?.hasCam !== false
const hasMicOf = id => id === selfId ? R.stream?.getAudioTracks().length > 0 : R.peers.get(id)?.hasMic !== false
const coveredOf = id => id === selfId ? !!R.covered : !!R.peers.get(id)?.covered
// covered: Kamera an, aber mit der Hand zugehalten (Helligkeit wird nur im eigenen Browser gemessen)
const condOk = (kind, id) => kind === 'mic' ? !micOf(id) : kind === 'cam' ? !camOf(id) : kind === 'camOn' ? camOf(id) || !hasCamOf(id)
  : kind === 'covered' ? coveredOf(id) || !hasCamOf(id) : !micOf(id) && !camOf(id)
const roleName = r => !r ? '' : r === 'beide' ? Object.values(G.c.roles).map(x => x.name).join(' + ') : G.c.roles[r]?.name || r

/* ---- Kacheln ---- */
const STAGE = () => $('#stage')
function makeTile(p) {
  const t = h('div', {class: 'tile' + (p.self ? ' me' : '') + (p.npc ? ' npc' : '')},
    p.npc ? h('div', {class: 'pic', html: portrait(p.face, true)}) : h('div', {class: 'face'}, h('span', {class: 'ini'}, (p.name || '?').slice(0, 1).toUpperCase())),
    p.npc ? h('canvas', {class: 'static', width: 96, height: 60}) : h('video', {autoplay: true, playsinline: true, muted: !!p.self}),
    p.npc ? h('div', {class: 'lamp'}) : null,
    p.npc ? h('div', {class: 'signote', hidden: true}) : null,
    h('div', {class: 'label'}, h('span', {class: 'nm'}, p.self ? `${p.name} (du)` : p.name), h('span', {class: 'role'}), h('span', {class: 'mut', title: 'stumm'}, '🔇')),
    p.npc ? h('div', {class: 'sub2'}, p.face?.photo ? null : h('span', {class: 'camoff'}, 'Kamera aus · '), p.sub || '') : null
  )
  STAGE().append(t)
  requestAnimationFrame(() => t.classList.add('in'))
  return t
}
function setVideo(p, stream) {
  const v = $('video', p.tile); if (!v) return
  v.srcObject = stream
  if (p.self) v.muted = true
  v.play?.().catch(() => {})
  p.stream = stream
  updateTile(p)
}
function updateTile(p) {
  const t = p.tile; if (!t) return
  if (!p.self && !t.dataset.renamed) $('.nm', t).textContent = p.name
  const ini = $('.ini', t); if (ini) ini.textContent = (p.name || '?').slice(0, 1).toUpperCase()
  const hasCam = p.self ? R.cam : p.cam && p.stream?.getVideoTracks().length
  t.classList.toggle('nocam', !hasCam)
  t.classList.toggle('muted', p.self ? !R.mic : !p.mic)
  $('.role', t).textContent = G.c ? roleName(G.state?.roles?.[p.self ? selfId : p.id]) : ''
}
function layout() {
  const n = $$('#stage .tile:not(.out):not(.screen)').length
  const cols = n <= 1 ? 1 : n <= 4 ? 2 : 3
  STAGE().style.setProperty('--cols', innerWidth < 640 && n > 1 ? Math.min(cols, 2) : cols)
}
addEventListener('resize', layout)

/* ---- Dock ---- */
function syncDock() {
  $('#micBtn').setAttribute('aria-pressed', !R.mic)
  $('#micBtn .lb').textContent = R.mic ? 'Mikro an' : 'Stumm'
  $('#camBtn').setAttribute('aria-pressed', !R.cam)
  $('#camBtn .lb').textContent = R.cam ? 'Kamera an' : 'Kamera aus'
  $('#screenBtn').hidden = !canScreen
  $('#screenBtn').classList.toggle('live', !!R.screen)
  $('#screenBtn .lb').textContent = R.screen ? 'Teilen beenden' : 'Bildschirm'
  $('#voiceBtn').setAttribute('aria-pressed', !voiceOn)
  $('#voiceBtn .lb').textContent = voiceOn ? 'Stimmen an' : 'Nur Text'
  updateTile(R.self)
}
function setMic(on) {
  const tr = R.stream.getAudioTracks()
  if (on && !tr.length) { toast('Kein Mikrofon verfügbar.'); return }
  R.mic = on; tr.forEach(t => t.enabled = on); syncDock(); sendMeta(); G.render()
}
function setCam(on) {
  const tr = R.stream.getVideoTracks()
  if (on && !tr.length) { toast('Keine Kamera verfügbar.'); return }
  R.cam = on; tr.forEach(t => t.enabled = on); syncDock(); sendMeta(); G.render()
}

/* ---- Chat ---- */
function addMsg(who, text, kind = 'peer', extra = '') {
  const m = h('div', {class: 'msg ' + kind}, h('b', {}, who), extra ? h('small', {}, ' ' + extra) : null, h('br'), text)
  $('#msgs').append(m); $('#msgs').scrollTop = 1e9
  if (kind !== 'mine' && !document.body.classList.contains('chat-open')) { $('#chatBtn').classList.add('dot'); SFX.chat() }
}
function sysMsg(text) { $('#msgs').append(h('div', {class: 'msg sys'}, text)); $('#msgs').scrollTop = 1e9 }

/* =================== Spiel =================== */
const G = {
  c: null,          // geladener Fall
  state: null,      // letzter Spielstand (vom Host)
  rt: {},           // Laufzeit des aktuellen Schritts (nur Host)
  seen: {sub: 0, fx: 0, init: false, pages: new Set(), chats: 0},
  npcTiles: new Map(),
  log: [],
  timer: 0,
  room() { return caseId + '/' + slug },

  isHost() { return this.state?.host === selfId },
  init() {
    let saved = null
    try { saved = JSON.parse(store.get('save.' + this.room(), 'null')) } catch {}
    if (sess.get('host.' + this.room())) {
      if (saved?.state?.phase === 'play') {
        this.state = {...saved.state, host: selfId, paused: true, pausedAt: Date.now(), pausedBy: '', v: saved.state.v + 1}
        this.assignRoles()   // neue Verbindungs-ID nach dem Neuladen: Rollen neu verteilen
        toast('Gespeicherter Fall geladen. Drückt auf „Weiter“, wenn alle da sind.', 6000)
      } else this.state = this.fresh()
    } else setTimeout(() => { this.waitedLong = true; if (!this.state) renderLobby() }, 6000)
    this.render()
    clearInterval(this.timer); this.timer = setInterval(() => this.tick(), 200)
    sendMeta()
  },
  fresh() {
    return {v: 1, caseId, phase: 'lobby', host: selfId, step: 0, stepAt: 0, roles: {}, names: {}, npcs: [], sub: null, subN: 0,
      pages: [], puzzle: null, puzzleAt: 0, solved: [], hints: {}, tries: [], knock: null, call: null, ask: null, vote: null, votes: {},
      results: {}, flags: {}, ending: null, fxN: 0, fxq: [], startedAt: 0, endedAt: 0, quiet: null, chapter: null, goal: '', done: [],
      hold: null, clap: null, timer: null, morse: null, dark: false, lockLeave: false, amb: null, paused: false, chats: [], frags: [], notes: {text: '', by: ''}, strikes: 0, table: [], poses: {}}
  },
  claimHost() {
    this.state = this.state ? {...this.state, host: selfId} : this.fresh()
    sess.set('host.' + this.room(), '1')
    this.rt = {}
    this.commit()
  },
  commit() {
    this.state.v++
    // Erst senden, dann anzeigen: Ein Fehler in der Anzeige darf das Spiel der anderen nicht anhalten
    try { R.game.send({t: 'state', s: this.state})?.catch?.(() => {}) } catch {}
    this.render()
    if (this.isHost() && this.state.phase !== 'lobby' && !TEST) {
      if (this.state.phase === 'end') store.del('save.' + this.room())
      else if (!this._saveT) this._saveT = setTimeout(() => {
        this._saveT = 0
        if (this.state.phase === 'play') store.set('save.' + this.room(), JSON.stringify({state: this.state, at: Date.now(), title: this.c.title, chapter: this.state.chapter?.n}))
      }, 1500)
    }
  },
  send(msg) {
    if (this.isHost()) this.onMessage(msg, selfId)
    else try { R.game.send(msg, {target: this.state?.host})?.catch?.(() => {}) } catch {}
  },
  onPeerJoin(p) {
    if (this.isHost()) setTimeout(() => { try { R.game.send({t: 'state', s: this.state}, {target: p.id}) } catch {} }, 300)
  },
  onPeerMeta(p) {
    if (!this.isHost()) return
    const s = this.state
    if (s.phase === 'play' && !s.roles[p.id]) { this.assignRoles(); this.commit() }
    else if (s.names[p.id] !== p.name) { s.names[p.id] = p.name; this.commit() }
  },
  onPeerLeave(id) {
    const s = this.state; if (!s) return
    if (s.host === id) {
      if (players()[0] === selfId) { this.claimHost(); toast('Die Einsatzleitung hat aufgelegt. Du leitest jetzt den Fall.', 4500) }
    } else if (this.isHost()) { if (this.rt.holders) delete this.rt.holders[id]; this.commit() }
  },
  onMessage(d, from) {
    if (!d || typeof d !== 'object') return
    if (d.t === 'state') {
      const s = d.s; if (!s || typeof s !== 'object' || s.host !== from || s.caseId !== caseId) return
      const cur = this.state
      if (cur && cur.host === selfId && from !== selfId) {
        // Zwei Hosts: der weitere Spielstand gewinnt, sonst die kleinere ID
        if (cur.phase !== 'lobby' && s.phase === 'lobby') return
        if (cur.phase === s.phase && (cur.step > s.step || (cur.step === s.step && from > selfId))) return
        sess.set('host.' + this.room(), '')
      }
      if (cur && cur.host === from && s.v <= cur.v) return
      this.state = s; this.render(); sendMeta()
      return
    }
    if (!this.isHost()) return
    const s = this.state, rt = this.rt
    if (d.t === 'start' && s.phase === 'lobby') {
      s.phase = 'play'; s.startedAt = Date.now(); s.step = 0; s.stepAt = Date.now(); this.rt = {}
      this.assignRoles(); this.commit()
    } else if (d.t === 'answer' && s.puzzle && s.puzzle === d.p && typeof d.a === 'string') {
      const a = d.a.slice(0, 60), pz = this.c.puzzles[d.p]
      if (pz.by && s.roles[from] !== pz.by && s.roles[from] !== 'beide') return
      sha(this.c.id, norm(a)).then(hash => {
        if (this.state.puzzle !== d.p) return
        const ok = pz.hash.includes(hash), near = !ok && pz.near?.[hash]
        if (ok && !s.solved.includes(d.p)) s.solved.push(d.p)
        this.fx(ok ? 'right' : near ? 'near' : 'wrong')
        s.tries = [...s.tries.slice(-5), {by: nameOf(from), a, ok, near: near || ''}]
        this.commit()
      })
    } else if (d.t === 'hint' && s.puzzle === d.p) {
      const n = s.hints[d.p] || 0
      if (n < this.c.puzzles[d.p].hints.length) { s.hints[d.p] = n + 1; this.commit() }
    } else if (d.t === 'admit' && s.knock) rt.admitted = true
    else if (d.t === 'deny' && s.knock) { s.knock = null; rt.retryAt = Date.now() + 7000; this.commit() }
    else if (d.t === 'accept' && s.call) rt.accepted = true
    else if (d.t === 'decline' && s.call) { s.call = null; rt.retryAt = Date.now() + 6000; rt.declined = (rt.declined || 0) + 1; this.fx('off'); this.commit() }
    else if (d.t === 'ask' && s.ask && !s.ask.busy) {
      const st = this.c.script[s.step], o = st?.[2]?.options?.find(x => x.id === d.id)
      if (!o || !s.ask.opts?.some(x => x.id === o.id) || (s.ask.used.includes(o.id) && !o.repeat)) return
      if (!s.ask.used.includes(o.id)) s.ask.used.push(o.id)
      s.ask.busy = true
      s.ask.last = o.label
      s.ask.pose = o.pose || null
      rt.queue = (o.say || []).map(x => Array.isArray(x) ? x : [o.npc || st[1], x])
      ;(o.unlock || []).forEach(p => this.unlock(p))
      if (o.set) Object.assign(s.flags, o.set)
      if (o.wrong) { s.strikes++; this.fx('wrong') }
      if (o.goal) this.goal(o.goal)
      if (o.end) rt.endAfter = true
      this.commit()
    } else if (d.t === 'vote' && s.vote && s.vote.options.some(o => o.id === d.v)) {
      s.votes[from] = d.v; this.commit()
    } else if (d.t === 'loud' && s.clap) {
      rt.loud ||= {}; rt.loud[from] = Date.now()
    } else if (d.t === 'hold' && s.hold) {
      rt.holders ||= {}; rt.holders[from] = !!d.on
    } else if (d.t === 'table' && typeof d.page === 'string' && s.pages.includes(d.page)) {
      // Arbeitstisch: eine Seite aus der eigenen Akte für alle sichtbar hinlegen (oder wieder wegnehmen)
      const table = s.table || [], r = this.c.pages[d.page]?.role, role = s.roles[from]
      const mine = !r || role === 'beide' || r === role
      const i = table.findIndex(x => x.page === d.page)
      if (d.on && i < 0 && mine) s.table = [...table.slice(-7), {page: d.page, by: nameOf(from)}]
      else if (!d.on && i >= 0) s.table = table.filter(x => x.page !== d.page)
      else return
      this.commit()
    } else if (d.t === 'notes' && typeof d.text === 'string') {
      s.notes = {text: d.text.slice(0, 5000), by: nameOf(from)}; this.commit()
    } else if (d.t === 'pause') {
      if (d.on && !s.paused) { s.paused = true; s.pausedAt = Date.now(); s.pausedBy = nameOf(from) }
      else if (!d.on && s.paused) {
        const dt = Date.now() - s.pausedAt
        s.paused = false; s.stepAt += dt
        if (rt.until) rt.until += dt
        if (rt.lastT) rt.lastT += dt
        if (rt.ringAt) rt.ringAt += dt
        if (s.timer) s.timer.until += dt
        if (s.startedAt) s.startedAt += dt
        if (s.puzzleAt) s.puzzleAt += dt
        if (s.sub) { s.subN++; s.sub = {...s.sub, id: s.subN} }   // letzten Satz noch einmal sagen
      }
      this.commit()
    } else if (d.t === 'restart') {
      store.del('save.' + this.room())
      this.state = {...this.fresh(), v: s.v + 1, fxN: s.fxN, subN: s.subN}; this.rt = {}; this.commit()
    }
  },
  assignRoles() {
    const s = this.state, ids = players(), roleIds = Object.keys(this.c.roles)
    s.names = Object.fromEntries(ids.map(id => [id, nameOf(id)]))
    if (ids.length === 1) { s.roles = {[ids[0]]: 'beide'}; return }
    const roles = {}
    for (const id of ids) if (s.roles[id] && s.roles[id] !== 'beide') roles[id] = s.roles[id]
    for (const id of ids) if (!roles[id]) {
      const cnt = r => Object.values(roles).filter(x => x === r).length
      roles[id] = roleIds.reduce((a, b) => cnt(b) < cnt(a) ? b : a)
    }
    s.roles = roles
  },
  fx(kind, arg) { const s = this.state; s.fxN++; s.fxq = [...s.fxq.slice(-6), {n: s.fxN, kind, arg}] },
  next() { this.state.step++; this.state.stepAt = Date.now(); this.rt = {} },
  goto(label) {
    const i = this.c.script.findIndex(st => st[0] === 'label' && st[1] === label)
    if (i < 0) { console.warn('fall: Sprungmarke fehlt', label); this.next(); return }
    this.state.step = i; this.state.stepAt = Date.now(); this.rt = {}
  },
  say(npc, text) {
    const s = this.state
    s.subN++
    s.sub = {id: s.subN, npc, text}
    this.rt.until = Date.now() + sayDuration(npc, text) * (SPEED < 1 ? SPEED * 2.5 : 1)
  },
  unlock(p) { if (!this.state.pages.includes(p)) this.state.pages.push(p) },
  goal(text) {
    const s = this.state
    if (s.goal && s.goal !== text) s.done = [...s.done, s.goal]
    s.goal = text
  },

  // Host: Schritte abarbeiten. Sofortige Schritte laufen in einem Durchlauf, auch wenn der Browser den Timer drosselt.
  tick() {
    this.paintLive()
    const s = this.state
    if (!s || !this.c || !this.isHost() || s.phase !== 'play' || s.paused) return
    const before = JSON.stringify(s)
    // Nach einem Ende nichts mehr abarbeiten (sonst liefe das Skript in die nächste Sprungmarke weiter)
    for (let guard = 0; guard < 40 && s.phase === 'play' && this.step1(s); guard++);
    if (JSON.stringify(s) !== before) this.commit()
  },
  step1(s) {
    const now = Date.now(), st = this.c.script[s.step], rt = this.rt, at = s.step
    if (!st) return false
    const [kind, a, b] = st
    // Sätze aus einer Warteschlange (Antworten im Verhör) haben Vorrang
    if (rt.queue?.length) { if (!rt.until || now > rt.until) this.say(...rt.queue.shift()); return false }
    switch (kind) {
      case 'label': this.next(); break
      case 'goto': this.goto(a); break
      case 'branch': if (a(s)) this.goto(b); else this.next(); break
      case 'set': s.flags[a] = b; this.next(); break
      case 'chapter': s.chapter = {n: a, title: b}; this.fx('chapter', {n: a, title: b}); this.next(); break
      case 'goal': this.goal(a); this.next(); break
      case 'wait': if (now - s.stepAt >= a * SPEED) this.next(); break
      case 'snap': this.fx('snap'); this.next(); break
      case 'join': if (!s.npcs.includes(a)) s.npcs.push(a); this.fx(b || 'join'); this.next(); break
      case 'leave': s.npcs = s.npcs.filter(n => n !== a); if (s.sub?.npc === a) s.sub = null; if (s.morse?.npc === a) s.morse = null; this.fx(b || 'leave'); this.next(); break
      case 'fx': this.fx(a, b); this.next(); break
      case 'pose': s.poses = {...s.poses, [a]: b || null}; this.next(); break   // Figur zeigt ein anderes Bild (z. B. Handykamera umgedreht)
      case 'unlock': this.unlock(a); this.next(); break
      case 'fragment': s.frags = [...s.frags, {sym: a, val: b}]; this.fx('fragment', a + ' ' + b); this.next(); break
      case 'dark': s.dark = !!a; this.fx(a ? 'off' : 'right'); this.next(); break
      case 'lockLeave': s.lockLeave = !!a; this.next(); break
      case 'ambience': s.amb = a || null; this.next(); break
      case 'morse': s.morse = a && b ? {npc: a, text: b, unit: Math.max(st[3] || 380, 340), role: st[4] || null, mode: 'morse'} : null; this.next(); break
      case 'signal': s.morse = a && b ? {npc: a, text: b, unit: st[3]?.unit || 520, role: st[3]?.role || null, mode: 'colors'} : null; this.next(); break
      case 'clap': {   // alle gleichzeitig klatschen oder rufen
        const ids = players()
        if (!s.clap) { s.clap = {label: a.label, text: a.text || '', window: a.window || 1400, count: 0, need: ids.length}; rt.loud = {} }
        const ok = ids.filter(id => !hasMicOf(id) || (rt.loud?.[id] && now - rt.loud[id] < s.clap.window))
        s.clap.count = ok.length; s.clap.need = ids.length
        if (ok.length >= ids.length) { s.clap = null; this.fx('right'); this.next() }
        break
      }
      case 'timer': s.timer = a ? {until: now + a * (SPEED < 1 ? SPEED * 3 : 1), label: b || 'Zeit'} : null; this.next(); break
      case 'chat': {
        const o = st[3] || {}
        s.chats = [...s.chats.slice(-40), {id: (s.chats.at(-1)?.id || 0) + 1, npc: a, text: b, to: o.to || null}]
        this.next(); break
      }
      case 'say':
        if (!rt.said) { rt.said = true; this.say(a, b) }
        else if (now > rt.until) this.next()
        break
      case 'quiet': {   // ['quiet', 'mic'|'cam'|'both'|'camOn', npc, text, warn]: spricht erst, wenn alle so weit sind
        const ids = players(), ok = ids.every(id => condOk(a, id))
        s.quiet = {kind: a, npc: b}
        if (ok) {
          if (!rt.said) { rt.said = true; rt.warned = false; this.say(b, st[3]) }
          else if (now > rt.until) { s.quiet = null; this.next() }
        } else if (rt.said && !rt.warned) {
          rt.said = false; rt.warned = true
          this.say(b, st[4] || 'Nein. Nicht so. Erst wenn alle so weit sind.'); rt.until = 0
        }
        break
      }
      case 'puzzle': s.puzzle = a; s.puzzleAt = now; this.next(); break
      case 'solve': {   // ['solve', id, {taunts, every, npc, onFail}]
        const o = b || {}
        if (s.solved.includes(a)) { s.puzzle = null; this.next(); break }
        if (s.puzzle !== a) { s.puzzle = a; s.puzzleAt = now; s.tries = [] }
        if (o.onFail && s.timer && now > s.timer.until) { s.timer = null; s.puzzle = null; this.goto(o.onFail); break }
        if (o.every && o.taunts?.length && now - (rt.lastT || s.stepAt) > o.every * SPEED && (!rt.until || now > rt.until)) {
          rt.lastT = now; rt.ti = rt.ti || 0
          if (o.npc && s.npcs.includes(o.npc)) this.say(o.npc, o.taunts[rt.ti++ % o.taunts.length])
        }
        break
      }
      case 'knock':
        if (rt.admitted) { s.knock = null; this.next(); break }
        if (!s.knock && (!rt.retryAt || now > rt.retryAt)) { s.knock = a; this.fx('knock') }
        break
      case 'call': {   // eingehender Anruf: jemand muss rangehen
        const o = b || {}
        if (rt.accepted) { s.call = null; if (!s.npcs.includes(a)) s.npcs.push(a); this.fx('join'); this.next(); break }
        if (!s.call && (!rt.retryAt || now > rt.retryAt)) { s.call = {npc: a, at: now, note: rt.declined ? (o.again || 'ruft noch einmal an …') : (o.note || 'ruft an …')}; rt.ringAt = now }
        if (s.call && now - rt.ringAt > (o.timeout || 25000)) { s.call = null; rt.retryAt = now + 5000; rt.declined = (rt.declined || 0) + 1; this.fx('off') }
        break
      }
      case 'ask': {   // Verhör: Team wählt Fragen, Figur antwortet
        if (!s.ask || s.ask.step !== s.step) s.ask = {step: s.step, npc: a, prompt: b.prompt || 'Was fragt ihr?', used: [], busy: false, last: ''}
        const have = p => s.pages.includes(p) || s.solved.includes(p) || !!s.flags[p]
        const opts = b.options.filter(o => !o.needs || [].concat(o.needs).every(have)).filter(o => !o.hideUsed || !s.ask.used.includes(o.id))
        s.ask.opts = opts.map(o => ({id: o.id, label: o.label, used: s.ask.used.includes(o.id), repeat: !!o.repeat, tag: o.tag || ''}))
        if (s.ask.busy && (!rt.until || now > rt.until)) {
          s.ask.busy = false
          if (rt.endAfter) { s.ask = null; this.next(); break }
        }
        break
      }
      case 'hold': {   // alle halten gleichzeitig einen Knopf gedrückt
        const ids = players()
        if (!s.hold) { s.hold = {label: a.label, ms: a.ms || 3000, count: 0, since: 0, need: ids.length}; rt.holders ||= {} }
        s.hold.need = ids.length
        s.hold.count = ids.filter(id => rt.holders?.[id]).length
        if (s.hold.count >= ids.length) { s.hold.since ||= now; if (now - s.hold.since >= s.hold.ms) { s.hold = null; this.fx('right'); this.next() } }
        else s.hold.since = 0
        break
      }
      case 'vote': {
        if (!s.vote) { s.vote = {id: a.id, prompt: a.prompt, text: a.text || '', options: a.options.filter(o => !o.if || o.if(s)).map(({id, label, desc}) => ({id, label, desc}))}; s.votes = {} }
        const ids = players(), votes = ids.map(id => s.votes[id]).filter(Boolean)
        if (votes.length >= ids.length) {
          const c = {}; votes.forEach(v => c[v] = (c[v] || 0) + 1)
          const max = Math.max(...Object.values(c)), top = Object.keys(c).filter(k => c[k] === max)
          s.results[s.vote.id] = top.length === 1 ? top[0] : (top.includes(s.votes[s.host]) ? s.votes[s.host] : top[0])
          s.vote = null; this.next()
        }
        break
      }
      case 'ending': {
        const id = typeof a === 'function' ? a(s) : a
        s.ending = id; s.phase = 'end'; s.endedAt = now; s.clap = null; s.hold = null; s.npcs = []; s.puzzle = null; s.timer = null; s.morse = null; s.dark = false; s.amb = null; s.lockLeave = false; s.quiet = null; s.ask = null
        s.subN++; s.sub = {id: s.subN, npc: null, text: this.c.endings[id].text}
        this.fx('end'); this.next()
        break
      }
      default: console.warn('fall: unbekannter Schritt', kind); this.next()
    }
    return s.step !== at
  },

  /* ---- Anzeige auf allen Geräten ---- */
  render() {
    try { this.render1() } catch (e) { console.error('fall: Anzeige', e) }
  },
  render1() {
    const s = this.state
    document.body.dataset.phase = s?.phase || 'wait'
    renderLobby()
    if (!s || !this.c) return
    const role = s.roles[selfId]
    document.body.dataset.role = role || ''
    $('#roleChip').textContent = role ? roleName(role) : 'Lobby'
    $('#chapterChip').textContent = s.chapter ? `Kapitel ${s.chapter.n}/${this.c.chapters}` : ''
    $('#goal').hidden = !s.goal || s.phase !== 'play'
    $('#goalText').textContent = fill(s.goal || '')
    document.body.classList.toggle('dark', !!s.dark)
    setAmbience(s.phase === 'play' && !s.paused ? s.amb : null)
    // Figuren-Kacheln
    for (const [id, t] of this.npcTiles) if (!s.npcs.includes(id)) {
      this.npcTiles.delete(id); t.classList.add('out'); setTimeout(() => { t.remove(); layout() }, 350)
    }
    for (const id of s.npcs) if (!this.npcTiles.has(id)) {
      const n = this.c.npcs[id]
      const t = makeTile({npc: true, name: n.name, face: n.face, sub: n.sub})
      t.dataset.npc = id
      if (n.look) t.classList.add(...n.look.split(/\s+/).map(l => 'look-' + l))
      if (n.widget) t.append(h('button', {class: 'info', title: 'Verbindungsdetails', onclick: () => t.classList.toggle('show-net')}, 'i'), h('div', {class: 'net', 'data-widget': n.widget}))
      t.dataset.pose = n.face.photo || ''
      this.npcTiles.set(id, t)
    }
    for (const [id, tile] of this.npcTiles) {
      const n = this.c.npcs[id]
      if (!n.face.photo) continue
      const votePose = n.afterVote && s.results?.[n.afterVote.id] && n.afterVote.pose
      const askPose = s.ask?.npc === id && s.ask.busy && s.ask.pose
      const pose = askPose || s.poses?.[id] || votePose || n.face.photo
      if (pose === tile.dataset.pose) continue
      tile.dataset.pose = pose
      $('.pic', tile).innerHTML = portrait({...n.face, photo: pose}, true)
      tile.classList.remove('flip'); void tile.offsetWidth; tile.classList.add('flip')
    }
    layout()
    // Untertitel + Stimme
    if (s.sub && s.sub.id !== this.seen.sub) {
      this.seen.sub = s.sub.id
      const text = fill(s.sub.text), npc = s.sub.npc
      const who = npc ? this.c.npcs[npc].name : this.c.file
      $('#subs').replaceChildren(h('b', {}, who + ': '), text)
      $('#subs').classList.add('on')
      this.log.push({who, text, npc, raw: s.sub.text}); renderLog()
      if (npc && !s.paused) {
        const t = this.npcTiles.get(npc)
        speak(npc, s.sub.text, t)
        if (t) { t.classList.add('speaking'); clearTimeout(t._sp); t._sp = setTimeout(() => t.classList.remove('speaking'), sayDuration(npc, s.sub.text)) }
      }
      clearTimeout(this._subT); this._subT = setTimeout(() => $('#subs').classList.remove('on'), (npc ? sayDuration(npc, s.sub.text) : 9000) + 5000)
    } else if (!s.sub) $('#subs').classList.remove('on')
    // Effekte
    if (!this.seen.init) { this.seen.init = true; if (s.phase !== 'lobby') { this.seen.fx = s.fxN; this.seen.chats = s.chats?.at(-1)?.id || 0 } }
    for (const f of s.fxq || []) if (f.n > this.seen.fx) this.playFx(f.kind, f.arg)
    this.seen.fx = Math.max(this.seen.fx, s.fxN)
    // Nachrichten von Figuren (manche nur für eine Rolle)
    for (const m of s.chats || []) if (m.id > this.seen.chats) {
      this.seen.chats = m.id
      if (m.to && role !== m.to && role !== 'beide') continue
      const n = this.c.npcs[m.npc]
      addMsg(n?.name || m.npc, fill(m.text), 'npc', m.to ? `· nur für ${roleName(m.to)}` : '')
      toast(`💬 ${n?.name || m.npc}${m.to ? ' (nur an dich)' : ''}: ${fill(m.text).slice(0, 90)}${m.text.length > 90 ? '…' : ''}`, 6000, 'npcmsg')
    }
    renderDossier(s, role)
    renderPuzzle(s)
    renderKnock(s); renderCall(s); renderAsk(s); renderVote(s); renderHold(s); renderClap(s); renderQuiet(s); renderPause(s); renderNotes(s); renderFrags(s)
    for (const p of [R.self, ...R.peers.values()]) updateTile(p)
    if (s.phase === 'end') renderEnd(s)
    else { $('#end').hidden = true; $('#end').dataset.done = '' }
    if (!s.pages.length) this.seen.pages.clear()
    if (s.phase === 'play' && !this.helpShown && !store.get('helped')) { this.helpShown = true; $('#help').hidden = false }
  },
  playFx(kind, arg) {
    if (kind === 'snap') return takeSnap()
    if (kind === 'mirror') return showMirror(arg)
    if (kind === 'chapter') return showChapter(arg)
    if (kind === 'crash') return fakeCrash(arg || 4000)
    if (kind === 'rename') return renameAll(arg || 'Verdächtig')
    if (kind === 'fragment') { SFX.right(); toast(`🧩 Neues Fragment: ${arg}`, 4000); return }
    if (kind === 'toast') { toast(fill(arg), 5000, 'npcmsg'); return }
    for (const k of ['flash', 'shake', 'glitch']) if (kind === k) {
      document.body.classList.remove(k); void document.body.offsetWidth; document.body.classList.add(k)
      setTimeout(() => document.body.classList.remove(k), 1000)
    }
    if (kind === 'flash') return SFX.static()
    if (kind === 'shake') return SFX.beat()
    SFX[kind]?.()
  },
  // Live: Rauschen auf Figuren, Morse-Lampe, Uhr, Countdown, Widgets
  paintLive() {
    const s = this.state
    if (s?.startedAt) $('#clock').textContent = fmtClock((s.endedAt || (s.paused ? s.pausedAt : Date.now())) - s.startedAt)
    if (s?.timer && s.phase === 'play') {
      const left = s.timer.until - (s.paused ? s.pausedAt : Date.now())
      $('#timer').hidden = false
      $('#timer').textContent = `⏱ ${s.timer.label} ${fmtClock(Math.max(0, left))}`
      $('#timer').classList.toggle('urgent', left < 30000)
    } else $('#timer').hidden = true
    if (!document.hidden) for (const t of this.npcTiles.values()) {
      const c = $('canvas', t); if (!c) continue
      const x = c.getContext('2d'), img = x.createImageData(c.width, c.height), dd = img.data
      for (let i = 0; i < dd.length; i += 4) { const v = Math.random() * 255; dd[i] = dd[i + 1] = dd[i + 2] = v; dd[i + 3] = 255 }
      x.putImageData(img, 0, 0)
    }
    renderClapLive()
    if (!this._wAt || Date.now() - this._wAt > 850) {
      this._wAt = Date.now()
      for (const el of $$('[data-widget]')) {
        const fn = this.c?.widgets?.[el.dataset.widget]; if (!fn) continue
        try { fn(el, {role: s?.roles[selfId], state: s, now: Date.now(), elapsed: s?.startedAt ? Date.now() - s.startedAt : 0}) } catch (e) { console.warn(e) }
      }
    }
    // Hinweis-Schubser nach 6 Minuten an einem Rätsel
    if (s?.puzzle && s.puzzleAt && !s.paused && Date.now() - s.puzzleAt > 6 * 60000 * SPEED && !this._nudged?.[s.puzzle]) {
      (this._nudged ||= {})[s.puzzle] = true
      $('#hintBtn').classList.add('pulse')
      toast('Hängt ihr fest? In der Akte gibt es Hinweise. Alle sehen sie.', 5000)
    }
  }
}

/* ---- Morse ---- */
const MORSE = {A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.'}
// Signalfolge als Liste [an?, Dauer in Takten, Zeichen]: Morse (· — mit Buchstaben- und Wortpausen) oder Farben
const seqCache = new Map()
function signalSeq(mode, text) {
  const k = mode + '|' + text
  if (seqCache.has(k)) return seqCache.get(k)
  const seq = []
  if (mode === 'colors') {
    for (const ch of text.toUpperCase()) seq.push([COLORS[ch] || null, 2, ch], [null, 1, ''])
    seq.push([null, 7, 'end'])
  } else {
    for (const w of text.toUpperCase().split(' ')) {
      for (const ch of w) { for (const sym of MORSE[ch] || '') seq.push([1, sym === '.' ? 1 : 3, sym === '.' ? '·' : '—'], [0, 1, '']); seq.push([0, 2, ' ']) }
      seq.push([0, 4, '/'])
    }
    seq.push([0, 10, 'end'])  // lange Pause, dann von vorn
  }
  seqCache.set(k, seq)
  return seq
}
// Wo steht das Signal gerade? Liefert Lampe (an/Farbe), bisher Gesendetes und ob gerade die Pause vor dem Neubeginn läuft
function signalAt(mode, text, unit, now) {
  const seq = signalSeq(mode, text), total = seq.reduce((a, x) => a + x[1], 0)
  let t = (now / unit) % total
  const done = []
  for (let i = 0; i < seq.length; i++) {
    const [v, d, sym] = seq[i]
    if (t < d) return {lamp: v, cur: v ? sym : '', done, restart: sym === 'end', idx: i, left: (d - t) * unit}
    if (v) done.push(sym)
    else if (sym === ' ' || sym === '/') done.push(sym)
    t -= d
  }
  return {lamp: null, done, restart: true, idx: -1, left: 0}
}
// Signallampe: eigener Bildtakt statt des 200-ms-Spieltakts, mit Mitschreibstreifen und wahlweise Piepton
let sigBeep = store.get('beep', '') === '1', sigLast = -1
function signalLoop() {
  requestAnimationFrame(signalLoop)
  const s = G.state, sm = s?.phase === 'play' && !s.paused ? s.morse : null, myRole = s?.roles?.[selfId]
  const canSee = sm && (!sm.role || myRole === sm.role || myRole === 'beide')
  const tile = canSee && $(`.tile[data-npc="${sm.npc}"]`), lamp = tile && $('.lamp', tile)
  $$('.tile .lamp.on').forEach(l => { if (l !== lamp) l.classList.remove('on') })
  $$('.tile .sigstrip').forEach(x => { if (x.closest('.tile') !== tile) x.remove() })
  $$('.tile .signote').forEach(n => {
    const show = !!(sm && !canSee && n.closest('.tile').dataset.npc === sm.npc)
    n.hidden = !show
    if (show) n.textContent = `📡 sendet ein Signal. Nur ${roleName(sm.role)} kann es sehen.`
  })
  if (!lamp) { sigLast = -1; return }
  const st = signalAt(sm.mode, sm.text, sm.unit, Date.now()), col = sm.mode === 'colors'
  lamp.classList.toggle('col', col)
  if (col) lamp.style.setProperty('--lc', st.lamp || 'transparent')
  lamp.classList.toggle('on', !!st.lamp)
  // Mitschreibstreifen unten auf der Kachel
  let strip = $('.sigstrip', tile)
  if (!strip) {
    strip = h('div', {class: 'sigstrip'}, h('span', {class: 'bulb'}), h('span', {class: 'syms'}),
      h('button', {type: 'button', class: 'beep', title: 'Signal als Ton mithören', onclick: () => { sigBeep = !sigBeep; store.set('beep', sigBeep ? '1' : ''); strip.dataset.k = '' }}))
    tile.append(strip)
  }
  strip.classList.toggle('lit', !!st.lamp); strip.style.setProperty('--lc', col ? st.lamp || 'transparent' : '#ffe9a8')
  const key = st.idx + '|' + st.restart + '|' + sigBeep
  if (strip.dataset.k !== key) {
    strip.dataset.k = key
    $('.beep', strip).textContent = sigBeep ? '🔊' : '🔈'
    const syms = $('.syms', strip)
    if (st.restart) syms.replaceChildren(h('span', {class: 'restart'}, '⟲ Pause … gleich beginnt das Signal von vorn'))
    else if (col) syms.replaceChildren(...st.done.filter(x => x !== ' ' && x !== '/').map(c => h('i', {class: 'chip', style: `--c:${COLORS[c]}`})),
      st.cur ? h('i', {class: 'chip now', style: `--c:${COLORS[st.cur]}`}) : '')
    else syms.replaceChildren(...st.done.join('').replace(/ +/g, ' ').split(/(\/)/).map(p => p === '/' ? h('b', {class: 'wgap'}, ' / ') : h('span', {}, p)),
      st.cur ? h('b', {class: 'now'}, st.cur) : '')
  }
  // Piepton genau beim Einschalten, so lang wie das Zeichen
  if (st.idx !== sigLast) {
    if (sigBeep && st.lamp && !st.restart) tone(col ? 440 + 'RGBYWV'.indexOf(st.cur) * 110 : 680, 0, st.left / 1000, 'sine', .07)
    sigLast = st.idx
  }
}
requestAnimationFrame(signalLoop)

/* ---- Überraschungen ---- */
function takeSnap() {
  const v = $('video', R.self.tile)
  if (!R.cam || !v?.videoWidth) return
  const c = document.createElement('canvas'); c.width = 320; c.height = Math.round(320 * v.videoHeight / v.videoWidth)
  const x = c.getContext('2d'); x.translate(c.width, 0); x.scale(-1, 1); x.drawImage(v, 0, 0, c.width, c.height)
  R.snap = c.toDataURL('image/jpeg', .7)   // bleibt im Browser, wird nie gesendet
}
function showMirror(arg) {
  SFX.glitch()
  const t = $(`.tile[data-npc="${arg?.npc || ''}"]`) || [...G.npcTiles.values()].at(-1)
  if (!t) return
  if (R.snap) { const img = h('img', {class: 'mirror', src: R.snap, alt: ''}); t.append(img); setTimeout(() => img.remove(), 3600) }
  if (arg?.label) { const l = h('div', {class: 'mirrorlabel'}, fill(arg.label)); t.append(l); setTimeout(() => l.remove(), 3600) }
}
function showChapter(arg) {
  if (!arg) return
  SFX.chapter()
  const c = $('#chapterCard')
  $('#chNum').textContent = `Kapitel ${arg.n}`; $('#chTitle').textContent = arg.title
  c.hidden = false; c.classList.remove('go'); void c.offsetWidth; c.classList.add('go')
  clearTimeout(c._t); c._t = setTimeout(() => { c.hidden = true }, 3800)
}
function fakeCrash(ms) {
  SFX.glitch(); stopVoice()
  const o = $('#crash'); o.hidden = false
  setTimeout(() => { o.hidden = true; SFX.join() }, ms)
}
function renameAll(text) {
  SFX.glitch()
  $$('#stage .tile:not(.npc)').forEach((t, i) => {
    if (t.dataset.renamed) return
    t.dataset.renamed = '1'; const nm = $('.nm', t), old = nm.textContent
    nm.textContent = fill(text).replace('{n}', i + 1); nm.classList.add('evil')
    setTimeout(() => { nm.textContent = old; nm.classList.remove('evil'); delete t.dataset.renamed }, 7000)
  })
}

/* ---- Arbeitstisch: geteilte Unterlagen als eigene Kachel ---- */
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c])
function renderTable(s) {
  const table = s.phase === 'play' ? s.table || [] : []
  let t = $('#tableTile')
  if (!table.length) { if (t) { t.id = ''; t.classList.add('out'); setTimeout(() => { t.remove(); layout() }, 350) } return }
  if (!t) {
    t = h('div', {class: 'tile desk', id: 'tableTile'}, h('div', {class: 'cards'}), h('div', {class: 'label'}, h('span', {class: 'nm'}, '📌 Arbeitstisch')))
    STAGE().append(t); requestAnimationFrame(() => t.classList.add('in')); layout()
  }
  const key = table.map(x => x.page + x.by).join()
  if (t.dataset.k === key) return
  t.dataset.k = key
  $('.cards', t).replaceChildren(...table.map((x, i) => h('button', {class: 'card', type: 'button', style: `--r:${((i * 37) % 9) - 4}deg`,
    onclick: () => { G.activePage = x.page; $('#tabs').dataset.k = ''; setSide('akte'); renderDossier(G.state, G.state.roles[selfId]) }},
    h('b', {}, G.c.pages[x.page]?.title || x.page), h('small', {}, 'von ' + x.by))))
}

/* ---- Bildschirm teilen (eigener Stream neben der Kamera) ---- */
const canScreen = !!navigator.mediaDevices?.getDisplayMedia && !/Android|iPhone|iPad/i.test(navigator.userAgent)
function shareScreenTo(id) {
  const sc = R.screen; if (!sc) return
  try { R.scr.send({on: true, sid: sc.stream.id}, id ? {target: id} : undefined)?.catch?.(() => {}) } catch {}
  try { R.room.addStream(sc.stream, id ? {target: id, metadata: {screen: true}} : {metadata: {screen: true}}) } catch {}
}
async function startScreen() {
  if (!R.room || R.screen) return
  let ds
  try { ds = await navigator.mediaDevices.getDisplayMedia({video: {frameRate: {ideal: 15, max: 30}}, audio: false, selfBrowserSurface: 'include', surfaceSwitching: 'include'}) }
  catch (err) { if (err.name !== 'NotAllowedError' && err.name !== 'AbortError') toast('Bildschirm konnte nicht geteilt werden.'); return }
  const vt = ds.getVideoTracks()[0]
  try { vt.contentHint = 'detail' } catch {}
  R.screen = {stream: ds}
  vt.onended = () => stopScreen()
  shareScreenTo()
  syncDock()
  toast(R.peers.size ? 'Die anderen sehen jetzt deinen Bildschirm. Tipp: Für einzelne Seiten reicht „📌 Auf den Arbeitstisch legen“ in der Akte.' : 'Du teilst deinen Bildschirm, sobald jemand da ist.', 5000)
}
function stopScreen() {
  const sc = R.screen; if (!sc) return
  R.screen = null
  sc.stream.getTracks().forEach(t => { t.onended = null; t.stop() })
  try { R.scr.send({on: false})?.catch?.(() => {}) } catch {}
  try { R.room.removeStream(sc.stream) } catch {}
  syncDock()
}
function addScreen(p, s) {
  if (p.screen?.stream === s) return
  removeScreen(p)
  const v = h('video', {autoplay: true, playsinline: true, muted: true})
  const t = h('div', {class: 'tile screen', title: 'Doppelklick: Vollbild'}, v, h('div', {class: 'label'}, h('span', {class: 'nm'}, '🖥 ' + p.name + ' · Bildschirm')))
  v.muted = true; v.srcObject = new MediaStream(s.getVideoTracks()); v.play?.().catch(() => {})
  t.addEventListener('dblclick', () => document.fullscreenElement ? document.exitFullscreen() : t.requestFullscreen?.())
  STAGE().prepend(t); requestAnimationFrame(() => t.classList.add('in'))
  p.screen = {stream: s, tile: t}
  toast(`🖥 ${p.name} teilt den Bildschirm`)
  layout()
}
function removeScreen(p) {
  const sc = p.screen; if (!sc) return
  p.screen = null
  sc.tile.classList.add('out'); setTimeout(() => { sc.tile.remove(); layout() }, 350)
}

/* ---- Lobby ---- */
function renderLobby() {
  const s = G.state, el = $('#lobby')
  const link = location.origin + location.pathname + '#' + caseId + '/' + slug
  $('#lobbyLink').textContent = link.replace(/^https?:\/\//, '')
  if ($('#lobbyQr').dataset.for !== link) { $('#lobbyQr').innerHTML = qrSvg(link); $('#lobbyQr').dataset.for = link }
  const ids = R.self ? players() : []
  $('#lobbyPlayers').replaceChildren(...ids.map(id => h('li', {}, nameOf(id), id === selfId ? ' (du)' : '', s?.host === id ? h('small', {}, ' · leitet') : '')))
  const host = G.isHost()
  $('#startBtn').hidden = !host
  $('#claimBtn').hidden = host || !!s || !G.waitedLong
  $('#lobbyTitle').textContent = G.c ? G.c.title : ''
  $('#lobbyIntro').textContent = G.c ? G.c.lobby : ''
  $('#lobbyWait').textContent = host && G.c?.solo ? 'Ein Fall für dich allein. Wer mag, kann über den Link zuschauen und mitraten.' : host ? (ids.length < 2
    ? 'Allein? Öffne den Link auf deinem Handy als zweites Gerät, oder starte allein mit allen Akten.'
    : `${ids.length} in der Leitung. Ihr bekommt verschiedene Akten. Redet miteinander.`)
    : s ? 'Warte, bis die Einsatzleitung beginnt …' : 'Verbinde mit der Leitung …'
  $('#startBtn').textContent = G.c?.solo ? 'Anruf annehmen' : ids.length < 2 ? 'Allein beginnen' : 'Fall beginnen'
  el.hidden = !!s && s.phase !== 'lobby'
}

/* ---- Akte, Notizen, Protokoll ---- */
function renderDossier(s, role) {
  const table = s.table || [], onTable = id => table.find(x => x.page === id)
  const own = id => { const r = G.c.pages[id]?.role; return !r || role === 'beide' || r === role }
  const vis = s.pages.filter(id => own(id) || onTable(id))
  const fresh = vis.filter(id => !G.seen.pages.has(id))
  if (fresh.length) {
    fresh.forEach(id => G.seen.pages.add(id))
    $('#akteBtn').classList.add('dot')
    if (s.phase === 'play' && G._dossierInit) {
      SFX.page()
      const put = fresh.filter(id => !own(id)), mine = fresh.filter(own)
      if (mine.length) toast(`🗂 Neu in deiner Akte: ${mine.map(id => G.c.pages[id].title).join(', ')}`)
      for (const id of put) toast(`📌 ${onTable(id).by} legt „${G.c.pages[id].title}“ auf den Arbeitstisch`, 4500)
    }
    G.activePage = fresh.at(-1)
  }
  // Was vom Tisch genommen wurde und nicht in der eigenen Akte steht, ist wieder weg
  for (const id of [...G.seen.pages]) if (!vis.includes(id)) G.seen.pages.delete(id)
  renderTable(s)
  G._dossierInit = true
  if (!vis.includes(G.activePage)) G.activePage = vis[0]
  const many = players().length > 1
  const tabs = $('#tabs'), key = vis.join() + '|' + G.activePage + '|' + table.map(x => x.page).join() + '|' + many
  if (tabs.dataset.k !== key) {
    tabs.dataset.k = key
    tabs.replaceChildren(...vis.map(id => h('button', {class: 'tab' + (G.c.pages[id].role ? ' own' : '') + (onTable(id) ? ' pinned' : ''), 'aria-selected': id === G.activePage,
      title: onTable(id) ? 'Liegt auf dem Arbeitstisch' : '',
      onclick: () => { G.activePage = id; renderDossier(G.state, G.state.roles[selfId]) }}, (onTable(id) ? '📌 ' : '') + G.c.pages[id].title)))
    const id = G.activePage, pg = G.c.pages[id], t = onTable(id)
    $$('.tuner', $('#page')).forEach(t => t._cleanup?.())
    const note = !pg ? '' : t && !own(id) ? `<p class="ownnote tbl">📌 Liegt auf dem Arbeitstisch, von ${esc(t.by)} hingelegt.</p>`
      : pg.role && role !== 'beide' ? `<p class="ownnote">Nur in deiner Akte (${roleName(pg.role)}). Die anderen sehen das nicht, außer du legst es auf den Tisch.</p>` : ''
    $('#page').innerHTML = pg ? note + pg.html : '<p class="note">Noch keine Unterlagen.</p>'
    // Auf den Tisch legen: nur sinnvoll, wenn noch jemand da ist und die anderen die Seite nicht ohnehin haben
    if (pg && many && (pg.role || t)) $('#page').prepend(h('button', {class: 'btn tablebtn', type: 'button', onclick: () => G.send({t: 'table', page: id, on: !t})},
      t ? '↩ Vom Arbeitstisch nehmen' : '📌 Auf den Arbeitstisch legen'))
    mountPage($('#page'))
  }
  $('#doneList').replaceChildren(...(s.done || []).map(d => h('li', {}, fill(d))))
  $('#doneBox').hidden = !(s.done || []).length
}
function mountPage(root) {
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
function mountMorseTable(el) {
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
          h('button', {type: 'button', class: 'btn', onclick: () => { cur += '.'; tone(680, 0, .08, 'sine', .06); draw() }}, '· kurz'),
          h('button', {type: 'button', class: 'btn', onclick: () => { cur += '-'; tone(680, 0, .24, 'sine', .06); draw() }}, '– lang'),
          h('button', {type: 'button', class: 'btn', onclick: () => { if (hit) word += hit; cur = ''; draw() }}, 'Buchstabe ✓'),
          h('button', {type: 'button', class: 'btn', onclick: () => { word += ' '; cur = ''; draw() }}, 'Wort ␣'),
          h('button', {type: 'button', class: 'btn', onclick: () => { if (cur) cur = cur.slice(0, -1); else word = word.slice(0, -1); draw() }}, '⌫'))),
      // nach Länge sortiert: Wer „drei Zeichen“ gesehen hat, sucht nur in einer Spalte
      h('div', {class: 'mcols'}, ...[1, 2, 3, 4, 5].map(n => {
        const list = letters.filter(([, c]) => c.length === n)
        return list.length ? h('div', {class: 'mcol'}, h('div', {class: 'mono'}, n + (n === 1 ? ' Zeichen' : ' Zeichen')),
          ...list.map(([k, c]) => h('div', {class: 'mrow' + (cur && c.startsWith(cur) ? ' fit' : '') + (c === cur ? ' hit' : '')}, h('b', {}, k), h('span', {}, show(c))))) : null
      })))
  }
  draw()
}
function mountTape(el, clipId) {
  const clip = G.c.clips?.[clipId]; if (!clip) return
  const m = AU.manifest[akey('clip:' + clipId, clip.text || '')]
  el.classList.add('tape')
  el.replaceChildren(
    h('div', {class: 'reels'}, h('i'), h('i')),
    h('div', {class: 'tname'}, clip.title),
    h('div', {class: 'tctl'},
      h('button', {class: 'btn', 'data-a': 'play', type: 'button'}, '▶ Abspielen'),
      h('label', {}, 'Tempo ', h('select', {'data-a': 'rate'}, ...[.5, .75, 1, 1.25, 1.5].map(r => h('option', {value: r, selected: r === 1}, String(r).replace('.', ',') + '×')))),
      h('label', {}, h('input', {type: 'checkbox', 'data-a': 'rev'}), ' rückwärts')
    ))
  if (!m) { el.append(h('p', {class: 'note'}, 'Aufnahme fehlt (Sprachdateien noch nicht erzeugt).')); return }
  let buf = null, rev = null, src = null
  const reset = () => { src = null; el.classList.remove('playing'); $('[data-a=play]', el).textContent = '▶ Abspielen' }
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
    src = s; el.classList.add('playing'); $('[data-a=play]', el).textContent = '■ Stopp'
    if (el.dataset.spectrum != null) spectrum(el, s, g)
    s.onended = () => { if (src === s) reset() }
  }
}
function renderLog() {
  $('#logList').replaceChildren(...G.log.slice().reverse().map(l => h('li', {},
    l.npc && (lineMeta(l.npc, l.raw) || deVoice) ? h('button', {class: 'replay', title: 'Noch mal hören', type: 'button', onclick: () => speak(l.npc, l.raw, G.npcTiles.get(l.npc))}, '▶') : null,
    h('b', {}, l.who + ': '), l.text)))
}
let notesDirty = 0
function renderNotes(s) {
  const ta = $('#notesIn')
  if (document.activeElement !== ta && !notesDirty && ta.value !== s.notes.text) ta.value = s.notes.text
  $('#notesBy').textContent = s.notes.by ? `Zuletzt geändert von ${s.notes.by}. Alle sehen diese Notizen.` : 'Alle sehen diese Notizen. Haltet fest, was ihr herausfindet.'
}
function renderFrags(s) {
  const f = s.frags || []
  $('#frags').hidden = !f.length
  $('#frags').replaceChildren(h('span', {class: 'mono'}, 'Fragmente'), ...f.map(x => h('span', {class: 'frag'}, h('i', {}, x.sym), ' ', x.val)))
}
function renderPuzzle(s) {
  const box = $('#puzzle'), p = s.puzzle && G.c.puzzles[s.puzzle]
  box.hidden = !p || s.phase !== 'play'
  $('#akteBtn').classList.toggle('task', !!p)
  if (!p) { box.dataset.id = ''; return }
  if (box.dataset.id !== s.puzzle) {
    box.dataset.id = s.puzzle
    $('#pq').textContent = fill(p.q); $('#pa').placeholder = p.ph || 'Lösung'; $('#pa').value = ''
    $('#pa').inputMode = p.input === 'digits' ? 'numeric' : 'text'
    $('#pa').readOnly = p.input === 'switches' || p.input === 'colors'
    $('#keypad').hidden = p.input !== 'digits'
    buildInput(p)
    $('#hintBtn').classList.remove('pulse')
    setSide('akte')
  }
  const role = s.roles[selfId], locked = p.by && role !== p.by && role !== 'beide'
  $('#puzzleForm').hidden = locked; $('#keypad').hidden = locked || p.input !== 'digits'; $('#pextra').hidden = locked
  $('#pby').hidden = !p.by
  $('#pby').textContent = locked ? `Eingeben kann nur: ${roleName(p.by)}. Ihr helft mit dem, was in eurer Akte steht.` : p.by ? `Nur du (${roleName(p.by)}) kannst hier eingeben.` : ''
  const n = s.hints[s.puzzle] || 0
  $('#hints').replaceChildren(...p.hints.slice(0, n).map((x, i) => h('li', {}, h('b', {}, `Hinweis ${i + 1}: `), x)))
  $('#hintBtn').hidden = n >= p.hints.length
  $('#hintBtn').textContent = `Hinweis anfordern (${n}/${p.hints.length}, alle sehen ihn)`
  $('#tries').replaceChildren(...s.tries.slice(-3).map(t => h('li', {class: t.ok ? 'ok' : t.near ? 'near' : ''}, `${t.by}: „${t.a}“ ${t.ok ? '✓' : t.near ? '≈ ' + t.near : '✗'}`)))
}
function renderKnock(s) {
  $('#knock').hidden = !s.knock
  if (s.knock) $('#knockText').textContent = `${G.c.npcs[s.knock].name} klopft an und möchte in den Anruf.`
}
let ringT = 0
function renderCall(s) {
  const c = $('#call')
  c.hidden = !s.call
  if (!s.call) { clearInterval(ringT); ringT = 0; c.dataset.npc = ''; return }
  const n = G.c.npcs[s.call.npc]
  if (c.dataset.npc !== s.call.npc + s.call.at) {
    c.dataset.npc = s.call.npc + s.call.at
    $('#callPic').innerHTML = portrait(n.face)
    $('#callName').textContent = n.name
    $('#callSub').textContent = ''
    clearInterval(ringT); SFX.call(); ringT = setInterval(() => { if (G.state?.call) SFX.call(); else { clearInterval(ringT); ringT = 0 } }, 2600)
  }
  $('#callNote').textContent = s.call.note
}
function renderAsk(s) {
  const box = $('#ask')
  box.hidden = !s.ask || s.phase !== 'play'
  if (!s.ask) return
  $('#askWho').textContent = G.c.npcs[s.ask.npc]?.name || ''
  $('#askPrompt').textContent = s.ask.busy ? `Ihr fragt: „${s.ask.last}“` : s.ask.prompt
  const key = JSON.stringify([s.ask.opts, s.ask.busy])
  if (box.dataset.k === key) return
  box.dataset.k = key
  $('#askOpts').replaceChildren(...(s.ask.opts || []).map(o => h('button', {
    class: 'askbtn' + (o.used ? ' used' : '') + (o.tag ? ' tag-' + o.tag : ''), type: 'button', disabled: s.ask.busy || (o.used && !o.repeat),
    onclick: () => G.send({t: 'ask', id: o.id})
  }, o.tag === 'accuse' ? '⚠ ' : o.tag === 'proof' ? '🗂 ' : o.tag === 'leave' ? '⏎ ' : '', o.label)))
}
function renderVote(s) {
  const v = $('#vote')
  v.hidden = !s.vote
  if (!s.vote) return
  $('#voteTitle').textContent = s.vote.prompt
  $('#voteText').textContent = s.vote.text || 'Jede Person stimmt ab. Die Mehrheit entscheidet, bei Gleichstand die Einsatzleitung.'
  const mine = s.votes[selfId], key = s.vote.id + mine
  if (v.dataset.k !== key) {
    v.dataset.k = key
    $('#voteOpts').replaceChildren(...s.vote.options.map(o => h('button', {class: 'opt', type: 'button', 'aria-pressed': o.id === mine, onclick: () => G.send({t: 'vote', v: o.id})}, h('b', {}, o.label), h('span', {}, o.desc || ''))))
  }
  const ids = players()
  $('#voteCount').textContent = `${ids.filter(id => s.votes[id]).length} von ${ids.length} haben entschieden`
}
let holding = false
function renderHold(s) {
  $('#hold').hidden = !s.hold
  if (!s.hold) { holding = false; return }
  $('#holdLabel').textContent = s.hold.label
  $('#holdCount').textContent = `${s.hold.count} von ${s.hold.need} halten`
  $('#holdBtn').classList.toggle('on', holding)
  $('#hold').classList.toggle('all', s.hold.count >= s.hold.need)
}
function renderQuiet(s) {
  const q = s.quiet
  $('#quiet').hidden = !q || s.phase !== 'play'
  if (!q) return
  const what = {mic: 'alle Mikrofone aus', cam: 'alle Kameras aus', both: 'alle Kameras und Mikrofone aus', camOn: 'alle Kameras an', covered: 'alle Kameras mit der Hand zuhalten (Kamera an lassen!)'}[q.kind]
  const ids = players(), ok = ids.filter(id => condOk(q.kind, id)).length
  $('#quietText').textContent = `${G.c.npcs[q.npc]?.name || 'Jemand'} wartet: ${what}`
  $('#quietCount').textContent = `${ok}/${ids.length}`
  $('#quiet').classList.toggle('ok', ok >= ids.length)
}
function renderPause(s) {
  $('#paused').hidden = !s.paused || s.phase !== 'play'
  if (s.paused) { $('#pausedBy').textContent = s.pausedBy ? `Angehalten von ${s.pausedBy}.` : 'Gespeicherter Stand.'; stopVoice() }
  $('#pauseBtn').hidden = s.phase !== 'play'
}
function setSide(which) {
  const ak = which === 'akte' || which === 'notes' || which === 'log'
  document.body.classList.toggle('akte-open', ak)
  document.body.classList.toggle('chat-open', which === 'chat')
  if (ak) {
    $$('#akteSeg button').forEach(b => b.setAttribute('aria-selected', b.dataset.seg === which))
    $('#akte').dataset.seg = which
    $('#akteBtn').classList.remove('dot')
  }
  if (which === 'chat') $('#chatBtn').classList.remove('dot')
}

/* ---- Abschluss & Teilen ---- */
function renderEnd(s) {
  const e = G.c.endings[s.ending]; if (!e) return
  const box = $('#end')
  if (box.dataset.done === String(s.endedAt)) return
  box.dataset.done = String(s.endedAt)
  box.hidden = false
  setSide(null)
  $('#endTitle').textContent = e.title
  $('#endText').textContent = e.text
  const team = Object.values(s.names)
  const time = fmtClock(s.endedAt - s.startedAt)
  const hints = Object.values(s.hints).reduce((a, b) => a + b, 0)
  $('#endStats').textContent = `${time} · ${hints} Hinweise · einer von ${Object.keys(G.c.endings).length} Ausgängen`
  const canvas = drawFile({team, time, code: e.code, hints})
  $('#endImg').src = canvas.toDataURL('image/png')
  const url = location.origin + location.pathname
  const text = `${G.c.share.text.replace('{time}', time)}\n${url}\n${G.c.share.tag}`
  $('#shareBtn').onclick = async () => {
    const blob = await new Promise(r => canvas.toBlob(r, 'image/png'))
    const file = new File([blob], `akte-${G.c.id}.png`, {type: 'image/png'})
    if (navigator.canShare?.({files: [file]})) { try { await navigator.share({files: [file], text}) } catch {} }
    else downloadBlob(blob)
  }
  $('#saveBtn').onclick = () => canvas.toBlob(downloadBlob, 'image/png')
  $('#copyBtn').onclick = () => navigator.clipboard?.writeText(text).then(() => toast('Text kopiert'), () => toast('Kopieren ging nicht.'))
}
function downloadBlob(blob) {
  const a = h('a', {href: URL.createObjectURL(blob), download: `akte-${G.c.id}.png`}); a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 5000)
}
// Geschwärzte Akte als Bild (1080 × 1350). Verrät nichts über die Lösung; der Code öffnet den Epilog.
function drawFile({team, time, code, hints}) {
  const c0 = G.c, W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H
  const x = c.getContext('2d')
  const mono = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace'
  const sans = 'ui-sans-serif, -apple-system, "Segoe UI", Roboto, Arial, sans-serif'
  x.fillStyle = '#e9e3d4'; x.fillRect(0, 0, W, H)
  for (let i = 0; i < 9000; i++) { x.fillStyle = `rgba(80,60,30,${Math.random() * .05})`; x.fillRect(Math.random() * W, Math.random() * H, 2, 2) }
  x.fillStyle = '#1a1814'
  x.font = `600 30px ${mono}`; x.fillText(c0.unit.toUpperCase(), 80, 120)
  x.font = `500 26px ${mono}`; x.fillStyle = '#5b554a'; x.fillText(c0.file, 80, 165)
  x.strokeStyle = '#1a1814'; x.lineWidth = 3; x.beginPath(); x.moveTo(80, 195); x.lineTo(W - 80, 195); x.stroke()
  x.fillStyle = '#1a1814'; x.font = `800 80px ${sans}`
  const words = c0.title.split(' '), mid = Math.ceil(words.length / 2)
  x.fillText(words.slice(0, mid).join(' '), 80, 315); x.fillText(words.slice(mid).join(' '), 80, 405)
  x.font = `500 30px ${mono}`
  const rows = [['STATUS', 'GELÖST'], ['DAUER', time], ['HINWEISE', String(hints)], ['TEAM', team.join(', ').toUpperCase().slice(0, 34)], ...c0.share.rows.map(r => [r, null])]
  rows.forEach(([k, v], i) => {
    const y = 510 + i * 64
    x.fillStyle = '#5b554a'; x.fillText(k, 80, y)
    if (v) { x.fillStyle = '#1a1814'; x.fillText(v, 440, y) }
    else { x.fillStyle = '#111'; x.fillRect(440, y - 30, 330 + ((i * 97) % 200), 40) }
  })
  x.fillStyle = '#1a1814'; x.font = `400 28px ${sans}`
  c0.share.lines.forEach((l, i) => x.fillText(l, 80, 1070 + i * 42))
  x.fillStyle = '#111'; x.fillRect(80, 1070 + c0.share.lines.length * 42 - 28, 520, 34)
  x.save(); x.translate(820, 340); x.rotate(-.22)
  x.strokeStyle = 'rgba(190,30,30,.85)'; x.fillStyle = 'rgba(190,30,30,.85)'; x.lineWidth = 7
  x.strokeRect(-170, -62, 340, 124); x.font = `800 50px ${mono}`; x.textAlign = 'center'; x.fillText('VERTRAULICH', 0, 18)
  x.restore()
  x.fillStyle = '#1a1814'; x.font = `600 30px ${mono}`
  x.fillText('FREIGABECODE: ' + code, 80, 1240)
  x.fillStyle = '#5b554a'; x.font = `500 26px ${mono}`
  x.fillText('anruf.org/fall · Code eingeben, Akte öffnen', 80, 1288)
  return c
}


/* =================== Sensoren (bleiben im Browser) =================== */
// Helligkeit der eigenen Kamera: „zugehalten“, wenn die Kamera an ist und das Bild fast schwarz.
// Lautstärke des eigenen Mikros: beim gemeinsamen Klatschen meldet der Browser nur „laut“, keine Töne.
function startSensors() {
  const c = document.createElement('canvas'); c.width = 16; c.height = 12
  const x = c.getContext('2d', {willReadFrequently: true})
  setInterval(() => {
    const v = $('video', R.self?.tile || document.body)
    if (!R.cam || !v?.videoWidth) { if (R.covered) { R.covered = false; sendMeta(); G.render() } return }
    x.drawImage(v, 0, 0, 16, 12)
    const d = x.getImageData(0, 0, 16, 12).data
    let sum = 0; for (let i = 0; i < d.length; i += 4) sum += .2126 * d[i] + .7152 * d[i + 1] + .0722 * d[i + 2]
    R.lum = sum / (d.length / 4) / 255
    const cov = R.covered ? R.lum < .16 : R.lum < .1   // mit Hysterese
    if (cov !== !!R.covered) { R.covered = cov; sendMeta(); G.render() }
  }, 400)
  const tr = R.stream?.getAudioTracks()[0]
  if (!tr) return
  try {
    const a = audio(), src = a.createMediaStreamSource(new MediaStream([tr])), an = a.createAnalyser()
    an.fftSize = 1024; src.connect(an)
    const buf = new Uint8Array(an.fftSize)
    let last = 0
    setInterval(() => {
      an.getByteTimeDomainData(buf)
      let peak = 0; for (const v of buf) peak = Math.max(peak, Math.abs(v - 128) / 128)
      R.level = R.mic ? peak : 0
      if (G.state?.clap && R.mic && peak > .5 && Date.now() - last > 350) { last = Date.now(); G.send({t: 'loud'}) }
    }, 50)
  } catch {}
}
function renderClap(s) {
  $('#clap').hidden = !s.clap
  if (!s.clap) return
  $('#clapLabel').textContent = s.clap.label
  $('#clapText').textContent = s.clap.text || 'Alle gleichzeitig, so laut ihr könnt. Mikro muss an sein.'
  $('#clapCount').textContent = `${s.clap.count} von ${s.clap.need} gehört`
  $('#clapMic').hidden = R.mic || !R.stream?.getAudioTracks().length
}
function renderClapLive() {
  if ($('#clap').hidden) return
  $('#clapBar').style.width = Math.min(100, (R.level || 0) * 200) + '%'
  $('#clapBar').classList.toggle('hot', (R.level || 0) > .5)
}

/* =================== Farbsignal =================== */
const COLORS = {R: '#ff3b30', G: '#3ddc84', B: '#4a8cff', Y: '#ffd23f', W: '#ffffff', V: '#b98cff'}

/* =================== Eingaben: Schalter und Farbtasten =================== */
function buildInput(p) {
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
      h('span', {class: 'mono'}, 'Stunde'), btn('−', () => { hh = hh === 1 ? 12 : hh - 1 }), btn('＋', () => { hh = hh === 12 ? 1 : hh + 1 }),
      h('span', {class: 'mono'}, 'Minute'), btn('−', () => { mm = (mm + 55) % 60 }), btn('＋', () => { mm = (mm + 5) % 60 })))
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
function spectrum(el, src, g) {
  const a = audio(), an = a.createAnalyser(); an.fftSize = 8192; g.connect(an)
  let out = $('.spec', el); if (!out) { out = h('div', {class: 'spec'}); el.append(out) }
  const bins = new Float32Array(an.frequencyBinCount), hz = a.sampleRate / an.fftSize
  const loop = () => {
    if (!el.classList.contains('playing')) { out.textContent = 'Frequenzanzeige: —'; return }
    an.getFloatFrequencyData(bins)
    const peaks = []
    for (let i = Math.floor(500 / hz); i < 1700 / hz; i++) if (bins[i] > -48 && bins[i] >= bins[i - 1] && bins[i] >= bins[i + 1]) peaks.push([bins[i], i * hz])
    peaks.sort((x, y) => y[0] - x[0])
    const top = []
    for (const [, f] of peaks) { if (top.every(t => Math.abs(t - f) > 60)) top.push(f); if (top.length === 2) break }
    out.textContent = top.length === 2 ? `Frequenzanzeige: ${top.sort((x, y) => x - y).map(f => Math.round(f / 5) * 5 + ' Hz').join(' + ')}` : 'Frequenzanzeige: —'
    requestAnimationFrame(loop)
  }
  loop()
}
// Funkempfänger: Frequenz einstellen, bis die Stimme aus dem Rauschen auftaucht
function mountTuner(el) {
  const clip = G.c.clips?.[el.dataset.tuner]; if (!clip) return
  const m = AU.manifest[akey('clip:' + el.dataset.tuner, clip.text || '')]
  const min = Number(el.dataset.min || 150), max = Number(el.dataset.max || 170), target = Number(el.dataset.target)
  el.classList.add('tuner')
  el.replaceChildren(
    h('div', {class: 'freq'}, h('b', {}, min.toFixed(3).replace('.', ',')), ' MHz'),
    h('div', {class: 'sig'}, h('i')),
    h('input', {type: 'range', min, max, step: .005, value: min, 'aria-label': 'Frequenz'}),
    h('div', {class: 'tctl'}, h('button', {class: 'btn', type: 'button'}, '▶ Empfänger an'), h('button', {class: 'btn fine', type: 'button', 'data-d': -.005}, '−'), h('button', {class: 'btn fine', type: 'button', 'data-d': .005}, '+')))
  let nodes = null
  const range = $('input', el)
  const update = () => {
    const f = Number(range.value), d = Math.abs(f - target)
    const v = Math.max(0, 1 - d / .06)
    $('.freq b', el).textContent = f.toFixed(3).replace('.', ',')
    $('.sig i', el).style.width = Math.round(Math.max(.04, v) * 100) + '%'
    if (nodes) { nodes.vg.gain.value = v * voiceVol; nodes.ng.gain.value = (1 - v * .85) * .18 * voiceVol }
  }
  range.oninput = update
  $$('.fine', el).forEach(b => b.onclick = () => { range.value = (Number(range.value) + Number(b.dataset.d)).toFixed(3); update() })
  $('.tctl .btn', el).onclick = async e => {
    const a = audio()
    if (nodes) { nodes.stop(); nodes = null; e.target.textContent = '▶ Empfänger an'; el.classList.remove('playing'); return }
    const nb = a.createBuffer(1, a.sampleRate * 2, a.sampleRate), nd = nb.getChannelData(0)
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1
    const ns = a.createBufferSource(); ns.buffer = nb; ns.loop = true
    const ng = a.createGain(), vg = a.createGain(), bp = a.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = .5
    ns.connect(bp).connect(ng).connect(master); ns.start()
    let vs = null
    if (m) { const buf = await a.decodeAudioData(await (await fetch(AU.base + m.f)).arrayBuffer()); vs = a.createBufferSource(); vs.buffer = buf; vs.loop = true; vs.connect(vg).connect(master); vs.start() }
    nodes = {ng, vg, stop: () => { try { ns.stop(); vs?.stop() } catch {} }}
    stopVoice(); e.target.textContent = '■ Empfänger aus'; el.classList.add('playing'); update()
  }
  el._cleanup = () => nodes?.stop()
  update()
}
// Chiffrierscheibe: verschiebt jeden Buchstaben, bis der Text lesbar wird
function mountCipher(el) {
  const text = el.dataset.cipher.toUpperCase(), A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let k = 0
  el.classList.add('cipher')
  const draw = () => {
    const dec = text.replace(/[A-Z]/g, ch => A[(A.indexOf(ch) - k + 26) % 26])
    el.replaceChildren(
      h('div', {class: 'wheel'}, h('div', {class: 'row'}, ...[...A].map(c => h('span', {}, c))), h('div', {class: 'row sh'}, ...[...A].map((_, i) => h('span', {}, A[(i - k + 26) % 26])))),
      h('div', {class: 'tctl'}, h('button', {class: 'btn', type: 'button', onclick: () => { k = (k + 25) % 26; draw() }}, '◀'), h('b', {}, `Verschiebung ${k}`), h('button', {class: 'btn', type: 'button', onclick: () => { k = (k + 1) % 26; draw() }}, '▶')),
      h('div', {class: 'dec'}, dec))
  }
  draw()
}
// Beweisfoto mit Lupe: zoomen und verschieben
function mountPhoto(el) {
  const svg = G.c.photos?.[el.dataset.photo]; if (!svg) return
  el.classList.add('photo')
  const vb = svg.match(/viewBox="0 0 (\d+) (\d+)"/)
  if (vb) el.style.setProperty('--ar', vb[1] + '/' + vb[2])
  el.innerHTML = `<div class="vp"><div class="img">${svg}</div></div><div class="tctl"><button class="btn" type="button" data-z="1.6">＋</button><button class="btn" type="button" data-z=".625">－</button><button class="btn" type="button" data-z="0">⟲</button><span class="mono">Ziehen zum Verschieben</span></div>`
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
function mountShred(el) {
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
      h('p', {class: 'mono'}, solved ? '✓ Wieder zusammengesetzt' : 'Zwei Streifen nacheinander antippen, um sie zu tauschen.'))
  }
  draw()
}

/* =================== Bedienung =================== */
function bind() {
  $('#micBtn').onclick = () => setMic(!R.mic)
  $('#camBtn').onclick = () => setCam(!R.cam)
  $('#screenBtn').onclick = () => R.screen ? stopScreen() : startScreen()
  $('#voiceBtn').onclick = () => { voiceOn = !voiceOn; store.set('voice', voiceOn ? '1' : '0'); if (!voiceOn) stopVoice(); syncDock() }
  $('#volIn').value = voiceVol
  $('#volIn').oninput = e => { voiceVol = Number(e.target.value); store.set('vol', voiceVol); if (AU.amb) AU.amb.gain.gain.setTargetAtTime(ambLevel(), actx.currentTime, .05) }
  $('#akteBtn').onclick = () => setSide(document.body.classList.contains('akte-open') ? null : ($('#akte').dataset.seg || 'akte'))
  $('#chatBtn').onclick = () => setSide(document.body.classList.contains('chat-open') ? null : 'chat')
  $$('#akteSeg button').forEach(b => b.onclick = () => setSide(b.dataset.seg))
  $$('.close').forEach(b => b.onclick = () => setSide(null))
  $('#pauseBtn').onclick = () => G.send({t: 'pause', on: !G.state?.paused})
  $('#resumeBtn').onclick = () => { audio(); G.send({t: 'pause', on: false}) }
  let leaveTried = false
  $('#leaveBtn').onclick = () => {
    if (G.state?.lockLeave && !leaveTried) { leaveTried = true; SFX.glitch(); toast(G.c.lockText || 'Dieses Meeting kann nicht verlassen werden.', 4500, 'npcmsg'); return }
    if (confirm('Auflegen und den Fall verlassen? Wer leitet, kann später über denselben Link weitermachen.')) { R.room?.leave(); location.href = location.pathname }
  }
  $('#chatForm').onsubmit = e => {
    e.preventDefault()
    const t = $('#chatIn').value.trim(); if (!t) return
    $('#chatIn').value = ''
    addMsg(myName, t, 'mine')
    try { R.chat.send({t})?.catch?.(() => {}) } catch {}
  }
  $('#startBtn').onclick = () => G.send({t: 'start'})
  $('#claimBtn').onclick = () => G.claimHost()
  $('#copyLink').onclick = () => navigator.clipboard?.writeText(location.origin + location.pathname + '#' + caseId + '/' + slug).then(() => toast('Link kopiert'))
  $('#inviteBtn').onclick = async () => {
    const text = (G.c?.invite || 'Ich brauche deine Hilfe. Heute Nacht, per Videoanruf. Sag niemandem davon.') + '\n' + location.origin + location.pathname + '#' + caseId + '/' + slug
    if (navigator.share) { try { await navigator.share({text}) } catch {} }
    else navigator.clipboard?.writeText(text).then(() => toast('Einladung kopiert. Schick sie per Messenger.'))
  }
  $('#puzzleForm').onsubmit = e => {
    e.preventDefault()
    const a = $('#pa').value.trim(); if (!a || !G.state?.puzzle) return
    $('#pa').value = ''
    G.send({t: 'answer', p: G.state.puzzle, a})
  }
  $('#keypad').onclick = e => {
    const k = e.target.closest('button')?.dataset.k; if (!k) return
    tone(700 + Math.random() * 80, 0, .06, 'square', .04)
    if (k === '<') $('#pa').value = $('#pa').value.slice(0, -1)
    else if (k === 'ok') $('#puzzleForm').requestSubmit()
    else $('#pa').value += k
  }
  $('#hintBtn').onclick = () => G.state?.puzzle && G.send({t: 'hint', p: G.state.puzzle})
  $('#admitBtn').onclick = () => G.send({t: 'admit'})
  $('#denyBtn').onclick = () => G.send({t: 'deny'})
  $('#acceptBtn').onclick = () => { audio(); G.send({t: 'accept'}) }
  $('#declineBtn').onclick = () => G.send({t: 'decline'})
  const hold = on => {
    if (holding === on || !G.state?.hold) return
    holding = on; $('#holdBtn').classList.toggle('on', on)
    if (on) tone(220, 0, .1, 'sine', .08)
    G.send({t: 'hold', on})
  }
  $('#holdBtn').addEventListener('pointerdown', e => { e.preventDefault(); hold(true) })
  for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) $('#holdBtn').addEventListener(ev, () => hold(false))
  addEventListener('keydown', e => { if (e.code === 'Space' && G.state?.hold && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName)) { e.preventDefault(); hold(true) } })
  addEventListener('keyup', e => { if (e.code === 'Space') hold(false) })
  let nt = 0
  $('#notesIn').oninput = () => { notesDirty = 1; clearTimeout(nt); nt = setTimeout(() => { notesDirty = 0; G.send({t: 'notes', text: $('#notesIn').value}) }, 500) }
  $('#helpBtn').onclick = () => { $('#help').hidden = false }
  $('#helpOk').onclick = () => { $('#help').hidden = true; store.set('helped', '1') }
  $('#againBtn').onclick = () => { $('#end').hidden = true; G.send({t: 'restart'}) }
  $('#homeBtn').onclick = () => { R.room?.leave(); location.href = location.pathname }
  addEventListener('keydown', e => { if (e.key === 'Escape') setSide(null) })
  addEventListener('beforeunload', () => R.room?.leave())
  // Dunkel: Taschenlampe folgt dem Zeiger
  const lamp = e => { const p = e.touches?.[0] || e; document.body.style.setProperty('--lx', p.clientX + 'px'); document.body.style.setProperty('--ly', p.clientY + 'px') }
  addEventListener('pointermove', lamp); addEventListener('touchmove', lamp, {passive: true})
}

setupHome()
bind()

// ?debug: Spielstand in der Konsole erreichbar (zum Testen: G.jump(schritt))
if (qs.has('debug')) { window.G = G; G.jump = i => { G.state.step = i; G.state.stepAt = Date.now(); G.rt = {}; G.commit() } }
