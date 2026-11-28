// „Akte 0“ — Exit-Games im Videoanruf, auf Basis von anruf.org.
// Anruf: Trystero (Signaling über Nostr), Medien direkt zwischen den Browsern, wie in ../index.html.
// Spiel: Ein Host arbeitet das Skript des Falls ab und schickt nach jeder Änderung den ganzen Spielstand an alle.
// Alle anderen zeigen nur an. Legt der Host auf, übernimmt die Person mit der kleinsten ID ab demselben Schritt.
// Der Host speichert den Stand im Browser: Ein langer Fall lässt sich später über denselben Link fortsetzen.

import {AU, SFX, actx, ambLevel, audio, setVoiceOn, setVoiceVol, stopVoice, tone, voiceOn, voiceVol} from './sound.mjs'
import {CASES} from './cases/index.mjs'
import {G, holding, setHolding, setNotesDirty, setSide} from './game.mjs'
import {R, addMsg, enter, setCam, setMic, startScreen, stopScreen, syncDock} from './call.mjs'
import {ROOM_RE, applyStatic, lang, setLang, t} from './i18n.mjs'
import {$, $$, cleanName, h, qs, randomSlug, sess, store, toast} from './core.mjs'
import {norm, sha} from './lib.mjs'
import {portrait} from './portrait.mjs'

export let myName = cleanName(store.get('name', ''))

/* =================== Startseite =================== */
export let caseId = '', slug = ''
{
  const m = location.hash.slice(1).match(ROOM_RE)
  if (m && CASES.some(c => c.id === m[2])) { caseId = m[2]; slug = m[3].toLowerCase() }
}
// Raumname: englische Räume tragen `en/` davor, damit nie zwei Sprachfassungen im selben Anruf landen
export const roomKey = () => (lang === 'en' ? 'en/' : '') + caseId + '/' + slug
const loc = c => lang === 'en' ? {...c, ...c.en} : c
export const loadCase = c => lang === 'en' ? c.loadEn() : c.load()
function setupHome() {
  const invited = !!slug
  document.body.dataset.invited = invited ? '1' : ''
  $('#nameIn').value = myName
  $('#nameIn').addEventListener('input', () => $('#nameIn').classList.remove('need'))
  let picked = caseId || store.get('case', CASES[0].id)
  if (!CASES.some(c => c.id === picked)) picked = CASES[0].id
  const renderCases = () => {
    $('#cases').replaceChildren(...CASES.filter(c => !invited || c.id === caseId).map(loc).map(c => h('button', {
      class: 'casecard' + (c.id === picked ? ' on' : ''), type: 'button', style: `--a:${c.accent}`,
      onclick: () => { if (invited) return; picked = c.id; store.set('case', c.id); renderCases() }
    },
    h('div', {class: 'cover', html: portrait(c.cover)}),
    h('div', {class: 'cbody'},
      h('div', {class: 'mono'}, c.file, c.solo ? h('span', {class: 'solotag'}, 'Solo') : null),
      h('h3', {}, c.title),
      h('p', {}, c.tagline),
      h('div', {class: 'meta'}, h('span', {}, '👥 ' + c.players), h('span', {}, '⏱ ' + c.duration), h('span', {title: t('home.difficulty')}, '◆'.repeat(c.difficulty) + '◇'.repeat(3 - c.difficulty)))
    ))))
  }
  const renderSaves = () => {
    const saves = []
    try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k?.startsWith('fall.save.')) saves.push([k.slice(10), JSON.parse(localStorage.getItem(k))]) } } catch {}
    saves.sort((a, b) => b[1].at - a[1].at)
    const mine = saves.filter(([room]) => room.startsWith('en/') === (lang === 'en'))
    $('#saves').hidden = !mine.length || invited
    $('#saveList').replaceChildren(...mine.slice(0, 5).map(([room, sv]) => h('li', {},
      h('a', {href: '#' + room, onclick: () => sess.set('host.' + room, '1')}, `${sv.title} · ${t('home.chapter', {n: sv.chapter || 1})}`),
      h('small', {}, ' ' + new Date(sv.at).toLocaleString(t('locale'), {dateStyle: 'short', timeStyle: 'short'})),
      h('button', {class: 'x', title: t('home.delete'), type: 'button', onclick: e => { e.preventDefault(); store.del('save.' + room); e.target.closest('li').remove() }}, '×'))))
  }
  const renderHome = () => {
    applyStatic()
    document.title = lang === 'en' ? 'File 0 — escape games on a video call' : 'Akte 0 — Exit-Games im Videoanruf'
    $$('.langsw button').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang))
    renderCases(); renderSaves()
    $('#goBtn').textContent = invited ? t('home.join') : t('home.go')
    $('#homeLead').textContent = invited ? t('home.leadInvited') : t('home.lead')
  }
  $$('.langsw button').forEach(b => b.addEventListener('click', () => { if (b.dataset.lang !== lang) { setLang(b.dataset.lang); renderHome() } }))
  renderHome()
  $('#goBtn').addEventListener('click', () => {
    const nm = cleanName($('#nameIn').value)
    if (!nm) { $('#nameIn').classList.add('need'); $('#nameIn').focus(); toast(t('home.needName')); return }
    myName = nm; store.set('name', myName)
    audio()
    if (!slug) { caseId = picked; slug = randomSlug(); sess.set('host.' + roomKey(), '1'); history.replaceState(null, '', '#' + roomKey()) }
    enter()
  })
  $('#codeForm').addEventListener('submit', async e => {
    e.preventDefault()
    const code = norm($('#codeIn').value)
    // Codes aus beiden Sprachfassungen werden erkannt; der Epilog erscheint in der gewählten Sprache
    for (const meta of CASES) {
      const c = (await loadCase(meta)).default, other = (await (lang === 'en' ? meta.load() : meta.loadEn())).default
      const hash = await sha(c.id, code)
      const k = c.codes?.[hash] || other.codes?.[hash]
      if (k) { const en = c.endings[k]; $('#codeOut').replaceChildren(h('b', {}, `${c.title} · ${en.title}`), h('br'), en.epilog); return }
    }
    $('#codeOut').textContent = t('home.codeBad')
  })
}
window.addEventListener('hashchange', () => location.reload())

/* =================== Bedienung =================== */
function bind() {
  $('#micBtn').onclick = () => setMic(!R.mic)
  $('#camBtn').onclick = () => setCam(!R.cam)
  $('#screenBtn').onclick = () => R.screen ? stopScreen() : startScreen()
  $('#voiceBtn').onclick = () => { setVoiceOn(!voiceOn); if (!voiceOn) stopVoice(); syncDock() }
  $('#volIn').value = voiceVol
  $('#volIn').oninput = e => { setVoiceVol(Number(e.target.value)); if (AU.amb) AU.amb.gain.gain.setTargetAtTime(ambLevel(), actx.currentTime, .05) }
  $('#akteBtn').onclick = () => setSide(document.body.classList.contains('akte-open') ? null : ($('#akte').dataset.seg || 'akte'))
  $('#chatBtn').onclick = () => setSide(document.body.classList.contains('chat-open') ? null : 'chat')
  $$('#akteSeg button').forEach(b => b.onclick = () => setSide(b.dataset.seg))
  $$('.close').forEach(b => b.onclick = () => setSide(null))
  $('#pauseBtn').onclick = () => G.send({t: 'pause', on: !G.state?.paused})
  $('#resumeBtn').onclick = () => { audio(); G.send({t: 'pause', on: false}) }
  let leaveTried = false
  $('#leaveBtn').onclick = () => {
    if (G.state?.lockLeave && !leaveTried) { leaveTried = true; SFX.glitch(); toast(G.c.lockText || t('leave.locked'), 4500, 'npcmsg'); return }
    if (confirm(t('leave.confirm'))) { R.room?.leave(); location.href = location.pathname }
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
  $('#copyLink').onclick = () => navigator.clipboard?.writeText(location.origin + location.pathname + '#' + roomKey()).then(() => toast(t('toast.linkCopied')))
  $('#inviteBtn').onclick = async () => {
    const text = (G.c?.invite || t('invite.default')) + '\n' + location.origin + location.pathname + '#' + roomKey()
    if (navigator.share) { try { await navigator.share({text}) } catch {} }
    else navigator.clipboard?.writeText(text).then(() => toast(t('toast.inviteCopied')))
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
    setHolding(on); $('#holdBtn').classList.toggle('on', on)
    if (on) tone(220, 0, .1, 'sine', .08)
    G.send({t: 'hold', on})
  }
  $('#holdBtn').addEventListener('pointerdown', e => { e.preventDefault(); hold(true) })
  for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) $('#holdBtn').addEventListener(ev, () => hold(false))
  addEventListener('keydown', e => { if (e.code === 'Space' && G.state?.hold && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName)) { e.preventDefault(); hold(true) } })
  addEventListener('keyup', e => { if (e.code === 'Space') hold(false) })
  let nt = 0
  $('#notesIn').oninput = () => { setNotesDirty(1); clearTimeout(nt); nt = setTimeout(() => { setNotesDirty(0); G.send({t: 'notes', text: $('#notesIn').value}) }, 500) }
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
