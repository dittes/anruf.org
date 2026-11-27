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
import {akey, audioText, CODENAMES, norm, sha} from './lib.mjs'

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
const SPEED = qs.has('fast') ? .1 : 1   // ?fast: Wartezeiten ×0,1 zum Testen
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
let myName = cleanName(store.get('name', '')) || CODENAMES[Math.floor(Math.random() * CODENAMES.length)]
const spokenName = () => CODENAMES.includes(myName) ? myName : ''

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
let actx = null, master = null
function audio() {
  try {
    if (!actx) { actx = new (window.AudioContext || window.webkitAudioContext)(); master = actx.createGain(); master.connect(actx.destination) }
    if (actx.state === 'suspended') actx.resume()
  } catch {}
  return actx
}
function tone(freq, t0, dur, type = 'sine', vol = .12) {
  const a = audio(); if (!a) return
  const o = a.createOscillator(), g = a.createGain()
  o.type = type; o.frequency.value = freq
  g.gain.setValueAtTime(0, a.currentTime + t0)
  g.gain.linearRampToValueAtTime(vol, a.currentTime + t0 + .02)
  g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + t0 + dur)
  o.connect(g).connect(master); o.start(a.currentTime + t0); o.stop(a.currentTime + t0 + dur + .05)
}
function noise(dur, vol = .25, freq = 1800) {
  const a = audio(); if (!a) return
  const buf = a.createBuffer(1, Math.max(1, a.sampleRate * dur), a.sampleRate), d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (Math.random() < .3 ? 1 : .2)
  const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain()
  s.buffer = buf; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = .7; g.gain.value = vol
  s.connect(f).connect(g).connect(master); s.start()
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
let voiceOn = store.get('voice', '1') === '1'
let voiceVol = Number(store.get('vol', '0.9'))
const AU = {manifest: {}, base: '', el: null, raf: 0, amb: null, ambName: null}
let deVoice = null
function pickVoice() {
  const vs = speechSynthesis?.getVoices?.() || []
  // Nur lokale Stimmen: Online-Stimmen schicken den Text an einen Server.
  deVoice = vs.find(v => v.localService && v.lang?.toLowerCase().startsWith('de')) || null
}
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice }
async function loadAudio(id) {
  AU.base = `cases/${id}/audio/`
  try { AU.manifest = await (await fetch(AU.base + 'manifest.json', {cache: 'no-cache'})).json() } catch { AU.manifest = {} }
  // Aufnahmen im Hintergrund vorladen (klein, damit es später nicht ruckelt)
  const files = [...new Set(Object.values(AU.manifest).map(m => m.f))]
  ;(async () => { for (const f of files) { try { await fetch(AU.base + f) } catch {} } })()
}
const lineMeta = (npc, text, name = spokenName()) => AU.manifest[akey(npc, audioText(text, name))] || AU.manifest[akey(npc, audioText(text, ''))]
function stopVoice() {
  try { AU.el?.pause() } catch {}
  AU.el = null; cancelAnimationFrame(AU.raf)
  $$('.tile.npc').forEach(t => t.style.setProperty('--m', 0))
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
    try {
      const src = a.createMediaElementSource(el), an = a.createAnalyser(), g = a.createGain()
      an.fftSize = 512; g.gain.value = voiceVol
      src.connect(an); an.connect(g).connect(master)
      const buf = new Uint8Array(an.fftSize)
      const loop = () => {
        if (AU.el !== el) return
        an.getByteTimeDomainData(buf)
        let sum = 0; for (const v of buf) sum += (v - 128) ** 2
        const rms = Math.sqrt(sum / buf.length) / 128
        tile?.style.setProperty('--m', Math.min(1, rms * 7).toFixed(2))
        AU.raf = requestAnimationFrame(loop)
      }
      loop()
    } catch { el.volume = voiceVol }
    el.play().catch(() => {})
    return
  }
  // Keine Aufnahme: lokale Sprachausgabe, der Mund bewegt sich dann zufällig
  if (!('speechSynthesis' in window) || !deVoice) return
  const u = new SpeechSynthesisUtterance(fill(text))
  u.voice = deVoice; u.lang = deVoice.lang; u.volume = voiceVol
  const v = G.c?.npcs[npc]?.tts || {}
  u.pitch = v.pitch ?? 1; u.rate = v.rate ?? 1
  let on = true
  u.onend = () => { on = false; tile?.style.setProperty('--m', 0) }
  const wob = () => { if (!on) return; tile?.style.setProperty('--m', (Math.random() * .8).toFixed(2)); setTimeout(wob, 110) }
  wob()
  speechSynthesis.speak(u)
}
function sayDuration(npc, text) {
  const m = lineMeta(npc, text, '')
  if (m) return m.d + 450
  return 1100 + fill(text).length * 62 / (G.c?.npcs[npc]?.tts?.rate || 1)
}
function setAmbience(name) {
  if (AU.ambName === name) return
  AU.ambName = name
  const old = AU.amb
  if (old) { old.fade = true; const t = setInterval(() => { old.volume = Math.max(0, old.volume - .03); if (old.volume <= 0) { clearInterval(t); old.pause() } }, 60) }
  AU.amb = null
  if (!name) return
  const el = new Audio(`audio/${name}.m4a`); el.loop = true; el.volume = 0
  AU.amb = el
  el.play().catch(() => {})
  const t = setInterval(() => { if (el.fade) return clearInterval(t); el.volume = Math.min(.3 * voiceVol, el.volume + .02); if (el.volume >= .3 * voiceVol) clearInterval(t) }, 80)
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
  const markName = () => $$('#names .chipbtn').forEach(b => b.classList.toggle('on', b.textContent === $('#nameIn').value.trim()))
  $('#names').replaceChildren(...CODENAMES.map(n => h('button', {class: 'chipbtn', type: 'button', onclick: () => { $('#nameIn').value = n; markName() }}, n)))
  $('#nameIn').addEventListener('input', markName); markName()
  let picked = caseId || store.get('case', CASES[0].id)
  if (!CASES.some(c => c.id === picked)) picked = CASES[0].id
  const renderCases = () => {
    $('#cases').replaceChildren(...CASES.filter(c => !invited || c.id === caseId).map(c => h('button', {
      class: 'casecard' + (c.id === picked ? ' on' : ''), type: 'button', style: `--a:${c.accent}`,
      onclick: () => { if (invited) return; picked = c.id; store.set('case', c.id); renderCases() }
    },
    h('div', {class: 'cover', html: portrait(c.cover)}),
    h('div', {class: 'cbody'},
      h('div', {class: 'mono'}, c.file),
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
    myName = cleanName($('#nameIn').value) || myName; store.set('name', myName)
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
  R.meta.onMessage = (d, {peerId}) => {
    if (!d || typeof d !== 'object') return
    const p = peerOf(peerId)
    const n = cleanName(d.n) || 'Gast'
    if (p.name === '…') { toast(`${n} ist in der Leitung`); sysMsg(`${n} ist dazugekommen`) }
    p.name = n; p.mic = !!d.mic; p.cam = !!d.cam; p.hasCam = d.hc !== false
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
    G.onPeerJoin(p)
    SFX.join(); renderLobby()
  }
  room.onPeerLeave = id => {
    const p = R.peers.get(id); if (!p) return
    R.peers.delete(id)
    p.tile.classList.add('out'); setTimeout(() => { p.tile.remove(); layout() }, 350)
    if (p.name !== '…') { toast(`${p.name} hat aufgelegt`); sysMsg(`${p.name} hat aufgelegt`) }
    SFX.leave()
    G.onPeerLeave(id)
    renderLobby()
  }
  room.onPeerStream = (s, id) => setVideo(peerOf(id), s)
  G.init()
}
function sendMeta(target) {
  try { R.meta?.send({n: myName, mic: R.mic, cam: R.cam, hc: R.stream?.getVideoTracks().length > 0}, target ? {target} : undefined)?.catch?.(() => {}) } catch {}
}
function players() {
  return [selfId, ...[...R.peers.values()].filter(p => p.name !== '…').map(p => p.id)].sort()
}
const nameOf = id => id === selfId ? myName : (R.peers.get(id)?.name || G.state?.names?.[id] || 'Gast')
const micOf = id => id === selfId ? R.mic : !!R.peers.get(id)?.mic
const camOf = id => id === selfId ? R.cam : !!R.peers.get(id)?.cam
// Wer gar keine Kamera hat, kann sie nicht anschalten: zählt bei „alle Kameras an“ als erfüllt
const hasCamOf = id => id === selfId ? R.stream?.getVideoTracks().length > 0 : R.peers.get(id)?.hasCam !== false
const condOk = (kind, id) => kind === 'mic' ? !micOf(id) : kind === 'cam' ? !camOf(id) : kind === 'camOn' ? camOf(id) || !hasCamOf(id) : !micOf(id) && !camOf(id)
const roleName = r => !r ? '' : r === 'beide' ? Object.values(G.c.roles).map(x => x.name).join(' + ') : G.c.roles[r]?.name || r

/* ---- Kacheln ---- */
const STAGE = () => $('#stage')
function makeTile(p) {
  const t = h('div', {class: 'tile' + (p.self ? ' me' : '') + (p.npc ? ' npc' : '')},
    p.npc ? h('div', {class: 'pic', html: portrait(p.face)}) : h('div', {class: 'face'}, h('span', {class: 'ini'}, (p.name || '?').slice(0, 1).toUpperCase())),
    p.npc ? h('canvas', {class: 'static', width: 96, height: 60}) : h('video', {autoplay: true, playsinline: true, muted: !!p.self}),
    p.npc ? h('div', {class: 'lamp'}) : null,
    h('div', {class: 'label'}, h('span', {class: 'nm'}, p.self ? `${p.name} (du)` : p.name), h('span', {class: 'role'}), h('span', {class: 'mut', title: 'stumm'}, '🔇')),
    p.npc ? h('div', {class: 'sub2'}, h('span', {class: 'camoff'}, 'Kamera aus'), ' · ', p.sub || '') : null
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
  const n = $$('#stage .tile:not(.out)').length
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
      hold: null, timer: null, morse: null, dark: false, lockLeave: false, amb: null, paused: false, chats: [], frags: [], notes: {text: '', by: ''}, strikes: 0}
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
    if (this.isHost() && this.state.phase !== 'lobby') {
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
      rt.queue = (o.say || []).map(x => Array.isArray(x) ? x : [o.npc || st[1], x])
      ;(o.unlock || []).forEach(p => this.unlock(p))
      if (o.set) Object.assign(s.flags, o.set)
      if (o.wrong) { s.strikes++; this.fx('wrong') }
      if (o.goal) this.goal(o.goal)
      if (o.end) rt.endAfter = true
      this.commit()
    } else if (d.t === 'vote' && s.vote && s.vote.options.some(o => o.id === d.v)) {
      s.votes[from] = d.v; this.commit()
    } else if (d.t === 'hold' && s.hold) {
      rt.holders ||= {}; rt.holders[from] = !!d.on
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
    this.rt.until = Date.now() + sayDuration(npc, text) * (SPEED < 1 ? .25 : 1)
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
    for (let guard = 0; guard < 40 && this.step1(s); guard++);
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
      case 'unlock': this.unlock(a); this.next(); break
      case 'fragment': s.frags = [...s.frags, {sym: a, val: b}]; this.fx('fragment', a + ' ' + b); this.next(); break
      case 'dark': s.dark = !!a; this.fx(a ? 'off' : 'right'); this.next(); break
      case 'lockLeave': s.lockLeave = !!a; this.next(); break
      case 'ambience': s.amb = a || null; this.next(); break
      case 'morse': s.morse = a && b ? {npc: a, text: b, unit: st[3] || 260} : null; this.next(); break
      case 'timer': s.timer = a ? {until: now + a * (SPEED < 1 ? .3 : 1), label: b || 'Zeit'} : null; this.next(); break
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
        s.ending = id; s.phase = 'end'; s.endedAt = now; s.npcs = []; s.puzzle = null; s.timer = null; s.morse = null; s.dark = false; s.amb = null; s.lockLeave = false; s.quiet = null; s.ask = null
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
      this.npcTiles.set(id, t)
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
    renderKnock(s); renderCall(s); renderAsk(s); renderVote(s); renderHold(s); renderQuiet(s); renderPause(s); renderNotes(s); renderFrags(s)
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
    // Morse: Lampe auf der Kachel blinkt in Endlosschleife
    const lamp = s?.morse && $(`.tile[data-npc="${s.morse.npc}"] .lamp`)
    $$('.tile .lamp.on').forEach(l => { if (l !== lamp) l.classList.remove('on') })
    if (lamp) lamp.classList.toggle('on', morseAt(s.morse.text, s.morse.unit, Date.now()))
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
const morseCache = new Map()
function morseAt(text, unit, now) {
  let seq = morseCache.get(text)
  if (!seq) {
    seq = []
    for (const w of text.toUpperCase().split(' ')) {
      for (const ch of w) { for (const sym of MORSE[ch] || '') seq.push([1, sym === '.' ? 1 : 3], [0, 1]); seq.push([0, 2]) }
      seq.push([0, 4])
    }
    seq.push([0, 10])  // lange Pause, dann von vorn
    morseCache.set(text, seq)
  }
  const total = seq.reduce((a, [, d]) => a + d, 0)
  let t = Math.floor(now / unit) % total
  for (const [on, d] of seq) { if (t < d) return !!on; t -= d }
  return false
}

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
  $('#lobbyWait').textContent = host ? (ids.length < 2
    ? 'Allein? Öffne den Link auf deinem Handy als zweites Gerät, oder starte allein mit allen Akten.'
    : `${ids.length} in der Leitung. Ihr bekommt verschiedene Akten. Redet miteinander.`)
    : s ? 'Warte, bis die Einsatzleitung beginnt …' : 'Verbinde mit der Leitung …'
  $('#startBtn').textContent = ids.length < 2 ? 'Allein beginnen' : 'Fall beginnen'
  el.hidden = !!s && s.phase !== 'lobby'
}

/* ---- Akte, Notizen, Protokoll ---- */
function renderDossier(s, role) {
  const vis = s.pages.filter(id => { const r = G.c.pages[id]?.role; return !r || role === 'beide' || r === role })
  const fresh = vis.filter(id => !G.seen.pages.has(id))
  if (fresh.length) {
    fresh.forEach(id => G.seen.pages.add(id))
    $('#akteBtn').classList.add('dot')
    if (s.phase === 'play' && G._dossierInit) { SFX.page(); toast(`🗂 Neu in deiner Akte: ${fresh.map(id => G.c.pages[id].title).join(', ')}`) }
    G.activePage = fresh.at(-1)
  }
  G._dossierInit = true
  if (!vis.includes(G.activePage)) G.activePage = vis[0]
  const tabs = $('#tabs'), key = vis.join() + '|' + G.activePage
  if (tabs.dataset.k !== key) {
    tabs.dataset.k = key
    tabs.replaceChildren(...vis.map(id => h('button', {class: 'tab' + (G.c.pages[id].role ? ' own' : ''), 'aria-selected': id === G.activePage,
      onclick: () => { G.activePage = id; renderDossier(G.state, G.state.roles[selfId]) }}, G.c.pages[id].title)))
    const pg = G.c.pages[G.activePage]
    $('#page').innerHTML = pg ? (pg.role ? `<p class="ownnote">Nur in deiner Akte (${roleName(pg.role)}). Die anderen sehen das nicht.</p>` : '') + pg.html : '<p class="note">Noch keine Unterlagen.</p>'
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
}
function mountTape(el, clipId) {
  const clip = G.c.clips?.[clipId]; if (!clip) return
  const m = AU.manifest[akey('clip:' + clipId, clip.text)]
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
    $('#keypad').hidden = p.input !== 'digits'
    $('#hintBtn').classList.remove('pulse')
    setSide('akte')
  }
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
  const what = {mic: 'alle Mikrofone aus', cam: 'alle Kameras aus', both: 'alle Kameras und Mikrofone aus', camOn: 'alle Kameras an'}[q.kind]
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

/* =================== Bedienung =================== */
function bind() {
  $('#micBtn').onclick = () => setMic(!R.mic)
  $('#camBtn').onclick = () => setCam(!R.cam)
  $('#voiceBtn').onclick = () => { voiceOn = !voiceOn; store.set('voice', voiceOn ? '1' : '0'); if (!voiceOn) stopVoice(); syncDock() }
  $('#volIn').value = voiceVol
  $('#volIn').oninput = e => { voiceVol = Number(e.target.value); store.set('vol', voiceVol); if (AU.amb) AU.amb.volume = .3 * voiceVol }
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
