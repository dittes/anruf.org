// Der Anruf: Verbindung (Trystero), Kacheln, Dock, Chat, Bildschirm teilen.
import {APP_ID, TURN, TURN_FALLBACK} from '../config.mjs'
import {CASES} from './cases/index.mjs'
import {G, renderLobby, startSensors} from './game.mjs'
import {$, $$, LIMIT, RELAYS, cleanName, h, qs, toast} from './core.mjs'
import {SFX, audio, loadAudio, voiceOn} from './sound.mjs'
import {caseId, loadCase, myName, roomKey} from './app.mjs'
import {joinRoom, selfId} from '../vendor/trystero.mjs'
import {lang, t, tr} from './i18n.mjs'
import {portrait} from './portrait.mjs'

/* =================== Anruf =================== */
export const R = {room: null, stream: null, peers: new Map(), mic: true, cam: true, snap: null}
export const peerOf = id => {
  let p = R.peers.get(id)
  if (!p) {
    p = {id, name: '…', mic: true, cam: false, joinedAt: Date.now()}
    p.tile = makeTile(p)
    R.peers.set(id, p)
    layout()
  }
  return p
}
export let iceCache = null
export async function getTurn() {
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
export async function getMedia() {
  if (qs.has('nomedia') || !navigator.mediaDevices?.getUserMedia) return new MediaStream()
  const audioC = {echoCancellation: true, noiseSuppression: true, autoGainControl: true}
  const videoC = {width: {ideal: 640}, height: {ideal: 480}, frameRate: {ideal: 24, max: 30}, facingMode: 'user'}
  try { return await navigator.mediaDevices.getUserMedia({audio: audioC, video: videoC}) } catch {}
  try { return await navigator.mediaDevices.getUserMedia({audio: audioC}) } catch {}
  toast(t('toast.noMedia'), 5000)
  return new MediaStream()
}

export async function enter() {
  document.body.dataset.view = 'room'
  const meta = CASES.find(c => c.id === caseId)
  const [stream, turn, mod] = await Promise.all([getMedia(), getTurn(), loadCase(meta), loadAudio(caseId)])
  G.c = mod.default
  document.documentElement.style.setProperty('--amber', G.c.accent || '#ffb23f')
  $('#caseTitle').textContent = G.c.unit
  $('#caseSub').textContent = '· ' + G.c.title
  document.title = G.c.title + ' — ' + (lang === 'en' ? 'File 0' : 'Akte 0')
  R.stream = stream
  R.mic = stream.getAudioTracks().length > 0
  R.cam = stream.getVideoTracks().length > 0
  R.self = {id: selfId, name: myName, self: true}
  R.self.tile = makeTile(R.self)
  setVideo(R.self, stream)
  syncDock(); layout()

  const room = joinRoom({appId: APP_ID, relayConfig: {urls: RELAYS, warnOnRelayFailure: false}, turnConfig: turn || []}, `fall/${roomKey()}`, {
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
    const n = cleanName(d.n) || t('tile.guest')
    if (p.name === '…') { toast(t('toast.joined', {n})); sysMsg(t('sys.joined', {n})) }
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
    if (R.peers.size >= LIMIT) toast(t('toast.full'))
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
    if (p.name !== '…') { toast(t('toast.left', {n: p.name})); sysMsg(t('toast.left', {n: p.name})) }
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
export function sendMeta(target) {
  try { R.meta?.send({n: myName, mic: R.mic, cam: R.cam, hc: R.stream?.getVideoTracks().length > 0, hm: R.stream?.getAudioTracks().length > 0, cv: !!R.covered}, target ? {target} : undefined)?.catch?.(() => {}) } catch {}
}
export function players() {
  return [selfId, ...[...R.peers.values()].filter(p => p.name !== '…').map(p => p.id)].sort()
}
export const nameOf = id => id === selfId ? myName : (R.peers.get(id)?.name || G.state?.names?.[id] || t('tile.guest'))
export const micOf = id => id === selfId ? R.mic : !!R.peers.get(id)?.mic
export const camOf = id => id === selfId ? R.cam : !!R.peers.get(id)?.cam
// Wer gar keine Kamera hat, kann sie nicht anschalten: zählt bei „alle Kameras an“ als erfüllt
export const hasCamOf = id => id === selfId ? R.stream?.getVideoTracks().length > 0 : R.peers.get(id)?.hasCam !== false
export const hasMicOf = id => id === selfId ? R.stream?.getAudioTracks().length > 0 : R.peers.get(id)?.hasMic !== false
export const coveredOf = id => id === selfId ? !!R.covered : !!R.peers.get(id)?.covered
// covered: Kamera an, aber mit der Hand zugehalten (Helligkeit wird nur im eigenen Browser gemessen)
export const condOk = (kind, id) => kind === 'mic' ? !micOf(id) : kind === 'cam' ? !camOf(id) : kind === 'camOn' ? camOf(id) || !hasCamOf(id)
  : kind === 'covered' ? coveredOf(id) || !hasCamOf(id) : !micOf(id) && !camOf(id)
export const roleName = r => !r ? '' : r === 'beide' ? Object.values(G.c.roles).map(x => x.name).join(' + ') : G.c.roles[r]?.name || r

/* ---- Kacheln ---- */
export const STAGE = () => $('#stage')
export function makeTile(p) {
  const t = h('div', {class: 'tile' + (p.self ? ' me' : '') + (p.npc ? ' npc' : '')},
    p.npc ? h('div', {class: 'pic', html: portrait(p.face, true)}) : h('div', {class: 'face'}, h('span', {class: 'ini'}, (p.name || '?').slice(0, 1).toUpperCase())),
    p.npc ? h('canvas', {class: 'static', width: 96, height: 60}) : h('video', {autoplay: true, playsinline: true, muted: !!p.self}),
    p.npc ? h('div', {class: 'lamp'}) : null,
    p.npc ? h('div', {class: 'signote', hidden: true}) : null,
    h('div', {class: 'label'}, h('span', {class: 'nm'}, p.self ? tr('tile.you', {name: p.name}) : p.name), h('span', {class: 'role'}), h('span', {class: 'mut', title: tr('tile.mutedTitle')}, '🔇')),
    p.npc ? h('div', {class: 'sub2'}, p.face?.photo ? null : h('span', {class: 'camoff'}, tr('tile.camoff')), p.sub || '') : null
  )
  STAGE().append(t)
  requestAnimationFrame(() => t.classList.add('in'))
  return t
}
export function setVideo(p, stream) {
  const v = $('video', p.tile); if (!v) return
  v.srcObject = stream
  if (p.self) v.muted = true
  v.play?.().catch(() => {})
  p.stream = stream
  updateTile(p)
}
export function updateTile(p) {
  const t = p.tile; if (!t) return
  if (!p.self && !t.dataset.renamed) $('.nm', t).textContent = p.name
  const ini = $('.ini', t); if (ini) ini.textContent = (p.name || '?').slice(0, 1).toUpperCase()
  const hasCam = p.self ? R.cam : p.cam && p.stream?.getVideoTracks().length
  t.classList.toggle('nocam', !hasCam)
  t.classList.toggle('muted', p.self ? !R.mic : !p.mic)
  $('.role', t).textContent = G.c ? roleName(G.state?.roles?.[p.self ? selfId : p.id]) : ''
}
export function layout() {
  const n = $$('#stage .tile:not(.out):not(.screen)').length
  const cols = n <= 1 ? 1 : n <= 4 ? 2 : 3
  STAGE().style.setProperty('--cols', innerWidth < 640 && n > 1 ? Math.min(cols, 2) : cols)
}
addEventListener('resize', layout)

/* ---- Dock ---- */
export function syncDock() {
  $('#micBtn').setAttribute('aria-pressed', !R.mic)
  $('#micBtn .lb').textContent = R.mic ? t('dock.mic') : t('dock.muted')
  $('#camBtn').setAttribute('aria-pressed', !R.cam)
  $('#camBtn .lb').textContent = R.cam ? t('dock.cam') : t('dock.camOff')
  $('#screenBtn').hidden = !canScreen
  $('#screenBtn').classList.toggle('live', !!R.screen)
  $('#screenBtn .lb').textContent = R.screen ? t('dock.screenStop') : t('dock.screen')
  $('#voiceBtn').setAttribute('aria-pressed', !voiceOn)
  $('#voiceBtn .lb').textContent = voiceOn ? t('dock.voice') : t('dock.voiceOff')
  updateTile(R.self)
}
export function setMic(on) {
  const tr = R.stream.getAudioTracks()
  if (on && !tr.length) { toast(t('toast.noMic')); return }
  R.mic = on; tr.forEach(t => t.enabled = on); syncDock(); sendMeta(); G.render()
}
export function setCam(on) {
  const tr = R.stream.getVideoTracks()
  if (on && !tr.length) { toast(t('toast.noCam')); return }
  R.cam = on; tr.forEach(t => t.enabled = on); syncDock(); sendMeta(); G.render()
}

/* ---- Chat ---- */
export function addMsg(who, text, kind = 'peer', extra = '') {
  const m = h('div', {class: 'msg ' + kind}, h('b', {}, who), extra ? h('small', {}, ' ' + extra) : null, h('br'), text)
  $('#msgs').append(m); $('#msgs').scrollTop = 1e9
  if (kind !== 'mine' && !document.body.classList.contains('chat-open')) { $('#chatBtn').classList.add('dot'); SFX.chat() }
}
export function sysMsg(text) { $('#msgs').append(h('div', {class: 'msg sys'}, text)); $('#msgs').scrollTop = 1e9 }

/* ---- Bildschirm teilen (eigener Stream neben der Kamera) ---- */
export const canScreen = !!navigator.mediaDevices?.getDisplayMedia && !/Android|iPhone|iPad/i.test(navigator.userAgent)
export function shareScreenTo(id) {
  const sc = R.screen; if (!sc) return
  try { R.scr.send({on: true, sid: sc.stream.id}, id ? {target: id} : undefined)?.catch?.(() => {}) } catch {}
  try { R.room.addStream(sc.stream, id ? {target: id, metadata: {screen: true}} : {metadata: {screen: true}}) } catch {}
}
export async function startScreen() {
  if (!R.room || R.screen) return
  let ds
  try { ds = await navigator.mediaDevices.getDisplayMedia({video: {frameRate: {ideal: 15, max: 30}}, audio: false, selfBrowserSurface: 'include', surfaceSwitching: 'include'}) }
  catch (err) { if (err.name !== 'NotAllowedError' && err.name !== 'AbortError') toast(t('toast.screenFail')); return }
  const vt = ds.getVideoTracks()[0]
  try { vt.contentHint = 'detail' } catch {}
  R.screen = {stream: ds}
  vt.onended = () => stopScreen()
  shareScreenTo()
  syncDock()
  toast(R.peers.size ? t('toast.screenOn') : t('toast.screenWait'), 5000)
}
export function stopScreen() {
  const sc = R.screen; if (!sc) return
  R.screen = null
  sc.stream.getTracks().forEach(t => { t.onended = null; t.stop() })
  try { R.scr.send({on: false})?.catch?.(() => {}) } catch {}
  try { R.room.removeStream(sc.stream) } catch {}
  syncDock()
}
export function addScreen(p, s) {
  if (p.screen?.stream === s) return
  removeScreen(p)
  const v = h('video', {autoplay: true, playsinline: true, muted: true})
  const t = h('div', {class: 'tile screen', title: tr('tile.dblclick')}, v, h('div', {class: 'label'}, h('span', {class: 'nm'}, tr('tile.screen', {name: p.name}))))
  v.muted = true; v.srcObject = new MediaStream(s.getVideoTracks()); v.play?.().catch(() => {})
  t.addEventListener('dblclick', () => document.fullscreenElement ? document.exitFullscreen() : t.requestFullscreen?.())
  STAGE().prepend(t); requestAnimationFrame(() => t.classList.add('in'))
  p.screen = {stream: s, tile: t}
  toast(t('toast.screenPeer', {name: p.name}))
  layout()
}
export function removeScreen(p) {
  const sc = p.screen; if (!sc) return
  p.screen = null
  sc.tile.classList.add('out'); setTimeout(() => { sc.tile.remove(); layout() }, 350)
}
