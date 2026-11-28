// Das Spiel: Zustandsmaschine G (Host arbeitet das Skript ab), Anzeige, Signale, Akte, Overlays, Sensoren.
import {R, STAGE, addMsg, condOk, hasMicOf, layout, makeTile, nameOf, players, roleName, sendMeta, updateTile} from './call.mjs'
import {SFX, audio, deVoice, lineMeta, sayDuration, setAmbience, speak, stopVoice, tone} from './sound.mjs'
import {$, $$, SPEED, TEST, fill, fmtClock, h, qrSvg, sess, store, toast} from './core.mjs'
import {buildInput, mountPage} from './widgets.mjs'
import {caseId, roomKey} from './app.mjs'
import {norm, sha} from './lib.mjs'
import {portrait} from './portrait.mjs'
import {selfId} from '../vendor/trystero.mjs'
import {t, tr} from './i18n.mjs'

/* =================== Spiel =================== */
export const G = {
  c: null,          // geladener Fall
  state: null,      // letzter Spielstand (vom Host)
  rt: {},           // Laufzeit des aktuellen Schritts (nur Host)
  seen: {sub: 0, fx: 0, init: false, pages: new Set(), chats: 0},
  npcTiles: new Map(),
  log: [],
  timer: 0,
  room() { return roomKey() },

  isHost() { return this.state?.host === selfId },
  init() {
    let saved = null
    try { saved = JSON.parse(store.get('save.' + this.room(), 'null')) } catch {}
    if (sess.get('host.' + this.room())) {
      if (saved?.state?.phase === 'play') {
        this.state = {...saved.state, host: selfId, paused: true, pausedAt: Date.now(), pausedBy: '', v: saved.state.v + 1}
        this.assignRoles()   // neue Verbindungs-ID nach dem Neuladen: Rollen neu verteilen
        toast(t('toast.loaded'), 6000)
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
      hold: null, clap: null, timer: null, morse: null, dark: false, lockLeave: false, amb: null, paused: false, chats: [], frags: [], notes: {text: '', by: ''}, strikes: 0, table: [], poses: {}, level: 'normal', stats: {}}
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
      if (players()[0] === selfId) { this.claimHost(); toast(t('toast.hostLeft'), 4500) }
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
        const stat = s.stats?.[d.p]
        if (stat) { if (ok) stat.end ||= Date.now(); else stat.wrong++ }
        this.fx(ok ? 'right' : near ? 'near' : 'wrong')
        s.tries = [...s.tries.slice(-5), {by: nameOf(from), a, ok, near: near || ''}]
        this.commit()
      })
    } else if (d.t === 'level' && s.phase === 'lobby' && from === s.host && LEVELS[d.v]) {
      s.level = d.v; this.commit()
    } else if (d.t === 'hint' && s.puzzle === d.p) {
      const n = s.hints[d.p] || 0
      if (n < hintMax(s, d.p)) { s.hints[d.p] = n + 1; this.commit() }
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
        for (const st of Object.values(s.stats || {})) if (!st.end) st.start += dt
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
      case 'timer': s.timer = a ? {until: now + a * lvl(s).timer * (SPEED < 1 ? SPEED * 3 : 1), label: b || t('game.timer')} : null; this.next(); break
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
          this.say(b, st[4] || t('game.quietWarn')); rt.until = 0
        }
        break
      }
      case 'puzzle': s.puzzle = a; s.puzzleAt = now; this.next(); break
      case 'solve': {   // ['solve', id, {taunts, every, npc, onFail}]
        const o = b || {}
        if (s.solved.includes(a)) { s.puzzle = null; this.next(); break }
        if (s.puzzle !== a) { s.puzzle = a; s.puzzleAt = now; s.tries = [] }
        const stat = (s.stats ||= {})[a] ||= {start: now, end: 0, wrong: 0, nudged: 0}
        // Hängt das Team fest, schickt eine Figur den nächsten Hinweis per Chat (nach Schwierigkeit, „schwer“: nie)
        const due = lvl(s).nudge.filter(ms => now - stat.start > ms * (SPEED < 1 ? SPEED : 1)).length, have = s.hints[a] || 0
        if (due > stat.nudged && have < hintMax(s, a)) {
          stat.nudged = due; s.hints[a] = have + 1
          // Helfen tun nur Verbündete (Figuren mit helps: false, z. B. Täter, nie); sonst kommt der Hinweis aus der Akte
          const helper = [o.npc, ...s.npcs].find(n => n && s.npcs.includes(n) && this.c.npcs[n].helps !== false) || ''
          s.chats = [...s.chats.slice(-40), {id: (s.chats.at(-1)?.id || 0) + 1, npc: helper, text: t('nudge.say', {hint: this.c.puzzles[a].hints[have]}), to: null}]
        }
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
        if (!s.call && (!rt.retryAt || now > rt.retryAt)) { s.call = {npc: a, at: now, note: rt.declined ? (o.again || t('call.again')) : (o.note || t('call.rings'))}; rt.ringAt = now }
        if (s.call && now - rt.ringAt > (o.timeout || 25000)) { s.call = null; rt.retryAt = now + 5000; rt.declined = (rt.declined || 0) + 1; this.fx('off') }
        break
      }
      case 'ask': {   // Verhör: Team wählt Fragen, Figur antwortet
        if (!s.ask || s.ask.step !== s.step) s.ask = {step: s.step, npc: a, prompt: b.prompt || t('game.askDefault'), used: [], busy: false, last: ''}
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
    $('#roleChip').textContent = role ? roleName(role) : t('room.lobbyChip')
    $('#chapterChip').textContent = s.chapter ? t('game.chapterOf', {n: s.chapter.n, total: this.c.chapters}) : ''
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
      if (n.widget) t.append(h('button', {class: 'info', title: tr('tile.netInfo'), onclick: () => t.classList.toggle('show-net')}, 'i'), h('div', {class: 'net', 'data-widget': n.widget}))
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
      addMsg(n?.name || m.npc || this.c.file, fill(m.text), 'npc', m.to ? t('chat.onlyFor', {role: roleName(m.to)}) : '')
      toast(`💬 ${n?.name || m.npc || this.c.file}${m.to ? t('toast.onlyYou') : ''}: ${fill(m.text).slice(0, 90)}${m.text.length > 90 ? '…' : ''}`, 6000, 'npcmsg')
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
    if (kind === 'rename') return renameAll(arg || t('game.rename'))
    if (kind === 'fragment') { SFX.right(); toast(t('toast.fragment', {arg}), 4000); return }
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
  }
}

/* ---- Morse ---- */
export const MORSE = {A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.'}
// Signalfolge als Liste [an?, Dauer in Takten, Zeichen]: Morse (· — mit Buchstaben- und Wortpausen) oder Farben
export const seqCache = new Map()
export function signalSeq(mode, text) {
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
export function signalAt(mode, text, unit, now) {
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
export let sigBeep = store.get('beep', '') === '1', sigLast = -1, sigCb = store.get('cb', '') === '1'
const cbLabel = c => c ? t('color.' + c) : ''
export function signalLoop() {
  requestAnimationFrame(signalLoop)
  const s = G.state, sm = s?.phase === 'play' && !s.paused ? s.morse : null, myRole = s?.roles?.[selfId]
  const canSee = sm && (!sm.role || myRole === sm.role || myRole === 'beide')
  const tile = canSee && $(`.tile[data-npc="${sm.npc}"]`), lamp = tile && $('.lamp', tile)
  $$('.tile .lamp.on').forEach(l => { if (l !== lamp) l.classList.remove('on') })
  $$('.tile .sigstrip').forEach(x => { if (x.closest('.tile') !== tile) x.remove() })
  $$('.tile .signote').forEach(n => {
    const show = !!(sm && !canSee && n.closest('.tile').dataset.npc === sm.npc)
    n.hidden = !show
    if (show) n.textContent = t('sig.note', {role: roleName(sm.role)})
  })
  if (!lamp) { sigLast = -1; return }
  const st = signalAt(sm.mode, sm.text, sm.unit, Date.now()), col = sm.mode === 'colors'
  lamp.classList.toggle('col', col)
  if (col) lamp.style.setProperty('--lc', st.lamp || 'transparent')
  lamp.classList.toggle('on', !!st.lamp)
  // Mitschreibstreifen unten auf der Kachel (auf „schwer“ nur Lampe und Ton, kein Mitschreiben)
  const full = lvl(s).strip
  let strip = $('.sigstrip', tile)
  if (!strip) {
    strip = h('div', {class: 'sigstrip'}, h('span', {class: 'bulb'}), h('span', {class: 'syms'}),
      col ? h('button', {type: 'button', class: 'cb', title: t('sig.cb'), onclick: () => { sigCb = !sigCb; store.set('cb', sigCb ? '1' : ''); strip.dataset.k = '' }}, '◐') : null,
      h('button', {type: 'button', class: 'beep', title: t('sig.beep'), onclick: () => { sigBeep = !sigBeep; store.set('beep', sigBeep ? '1' : ''); strip.dataset.k = '' }}))
    tile.append(strip)
  }
  strip.classList.toggle('lit', !!st.lamp); strip.style.setProperty('--lc', col ? st.lamp || 'transparent' : '#ffe9a8')
  strip.classList.toggle('cbon', col && sigCb)
  $('.bulb', strip).textContent = col && sigCb ? cbLabel(st.cur) : ''
  const key = st.idx + '|' + st.restart + '|' + sigBeep + '|' + sigCb + '|' + full
  if (strip.dataset.k !== key) {
    strip.dataset.k = key
    $('.beep', strip).textContent = sigBeep ? '🔊' : '🔈'
    $('.cb', strip)?.setAttribute('aria-pressed', sigCb)
    const syms = $('.syms', strip)
    if (st.restart) syms.replaceChildren(h('span', {class: 'restart'}, t('sig.restart')))
    else if (!full) syms.replaceChildren(h('span', {class: 'restart'}, t('sig.hard')))
    else if (col) syms.replaceChildren(...st.done.filter(x => x !== ' ' && x !== '/').map(c => h('i', {class: 'chip', style: `--c:${COLORS[c]}`}, sigCb ? cbLabel(c) : '')),
      st.cur ? h('i', {class: 'chip now', style: `--c:${COLORS[st.cur]}`}, sigCb ? cbLabel(st.cur) : '') : '')
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
export function takeSnap() {
  const v = $('video', R.self.tile)
  if (!R.cam || !v?.videoWidth) return
  const c = document.createElement('canvas'); c.width = 320; c.height = Math.round(320 * v.videoHeight / v.videoWidth)
  const x = c.getContext('2d'); x.translate(c.width, 0); x.scale(-1, 1); x.drawImage(v, 0, 0, c.width, c.height)
  R.snap = c.toDataURL('image/jpeg', .7)   // bleibt im Browser, wird nie gesendet
}
export function showMirror(arg) {
  SFX.glitch()
  const t = $(`.tile[data-npc="${arg?.npc || ''}"]`) || [...G.npcTiles.values()].at(-1)
  if (!t) return
  if (R.snap) { const img = h('img', {class: 'mirror', src: R.snap, alt: ''}); t.append(img); setTimeout(() => img.remove(), 3600) }
  if (arg?.label) { const l = h('div', {class: 'mirrorlabel'}, fill(arg.label)); t.append(l); setTimeout(() => l.remove(), 3600) }
}
export function showChapter(arg) {
  if (!arg) return
  SFX.chapter()
  const c = $('#chapterCard')
  $('#chNum').textContent = t('game.chapter', {n: arg.n}); $('#chTitle').textContent = arg.title
  c.hidden = false; c.classList.remove('go'); void c.offsetWidth; c.classList.add('go')
  clearTimeout(c._t); c._t = setTimeout(() => { c.hidden = true }, 3800)
}
export function fakeCrash(ms) {
  SFX.glitch(); stopVoice()
  const o = $('#crash'); o.hidden = false
  setTimeout(() => { o.hidden = true; SFX.join() }, ms)
}
export function renameAll(text) {
  SFX.glitch()
  $$('#stage .tile:not(.npc)').forEach((t, i) => {
    if (t.dataset.renamed) return
    t.dataset.renamed = '1'; const nm = $('.nm', t), old = nm.textContent
    nm.textContent = fill(text).replace('{n}', i + 1); nm.classList.add('evil')
    setTimeout(() => { nm.textContent = old; nm.classList.remove('evil'); delete t.dataset.renamed }, 7000)
  })
}

/* ---- Arbeitstisch: geteilte Unterlagen als eigene Kachel ---- */
export const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c])
export function renderTable(s) {
  const table = s.phase === 'play' ? s.table || [] : []
  let t = $('#tableTile')
  if (!table.length) { if (t) { t.id = ''; t.classList.add('out'); setTimeout(() => { t.remove(); layout() }, 350) } return }
  if (!t) {
    t = h('div', {class: 'tile desk', id: 'tableTile'}, h('div', {class: 'cards'}), h('div', {class: 'label'}, h('span', {class: 'nm'}, tr('tile.desk'))))
    STAGE().append(t); requestAnimationFrame(() => t.classList.add('in')); layout()
  }
  const key = table.map(x => x.page + x.by).join()
  if (t.dataset.k === key) return
  t.dataset.k = key
  $('.cards', t).replaceChildren(...table.map((x, i) => h('button', {class: 'card', type: 'button', style: `--r:${((i * 37) % 9) - 4}deg`,
    onclick: () => { G.activePage = x.page; $('#tabs').dataset.k = ''; setSide('akte'); renderDossier(G.state, G.state.roles[selfId]) }},
    h('b', {}, G.c.pages[x.page]?.title || x.page), h('small', {}, tr('tile.deskBy', {by: x.by})))))
}

/* ---- Lobby ---- */
// Schwierigkeit: wann Figuren mit Hinweisen helfen, wie viele Hinweise es gibt, wie lang Countdowns laufen
export const LEVELS = {
  leicht: {timer: 1.5, nudge: [150000, 300000], maxHints: 9, strip: true},
  normal: {timer: 1, nudge: [300000], maxHints: 9, strip: true},
  schwer: {timer: .8, nudge: [], maxHints: 2, strip: false}
}
export const lvl = s => LEVELS[s?.level] || LEVELS.normal
const hintMax = (s, p) => Math.min(G.c.puzzles[p].hints.length, lvl(s).maxHints)

export function renderLobby() {
  const s = G.state, el = $('#lobby')
  const link = location.origin + location.pathname + '#' + roomKey()
  $('#lobbyLink').textContent = link.replace(/^https?:\/\//, '')
  if ($('#lobbyQr').dataset.for !== link) { $('#lobbyQr').innerHTML = qrSvg(link); $('#lobbyQr').dataset.for = link }
  const ids = R.self ? players() : []
  $('#lobbyPlayers').replaceChildren(...ids.map(id => h('li', {}, nameOf(id), id === selfId ? t('lobby.you') : '', s?.host === id ? h('small', {}, t('lobby.leads')) : '')))
  const host = G.isHost()
  $('#startBtn').hidden = !host
  $('#claimBtn').hidden = host || !!s || !G.waitedLong
  $('#lobbyTitle').textContent = G.c ? G.c.title : ''
  $('#lobbyIntro').textContent = G.c ? G.c.lobby : ''
  $('#lobbyWait').textContent = host && G.c?.solo ? t('lobby.waitSolo') : host ? (ids.length < 2
    ? t('lobby.waitAlone')
    : t('lobby.waitMany', {n: ids.length}))
    : s ? t('lobby.waitHost') : t('lobby.connecting')
  $('#startBtn').textContent = G.c?.solo ? t('lobby.startSolo') : ids.length < 2 ? t('lobby.startAlone') : t('lobby.start')
  $('#claimBtn').textContent = t('lobby.claim')
  const box = $('#levelBox'), level = s?.level || 'normal'
  box.hidden = !s
  if (box.dataset.k !== level + host) {
    box.dataset.k = level + host
    $('#levelBtns').replaceChildren(...Object.keys(LEVELS).map(id => h('button', {type: 'button', class: 'chipbtn' + (id === level ? ' on' : ''), disabled: !host,
      'aria-pressed': id === level, onclick: () => G.send({t: 'level', v: id})}, t('level.' + id))))
    $('#levelDesc').textContent = t('level.d.' + level) + (host ? '' : ' ' + t('level.hostOnly'))
  }
  el.hidden = !!s && s.phase !== 'lobby'
}

/* ---- Akte, Notizen, Protokoll ---- */
export function renderDossier(s, role) {
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
      if (mine.length) toast(t('toast.newFile', {list: mine.map(id => G.c.pages[id].title).join(', ')}))
      for (const id of put) toast(t('toast.pinned', {by: onTable(id).by, title: G.c.pages[id].title}), 4500)
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
      title: onTable(id) ? tr('dossier.table') : '',
      onclick: () => { G.activePage = id; renderDossier(G.state, G.state.roles[selfId]) }}, (onTable(id) ? '📌 ' : '') + G.c.pages[id].title)))
    const id = G.activePage, pg = G.c.pages[id], t = onTable(id)
    $$('.tuner', $('#page')).forEach(t => t._cleanup?.())
    const note = !pg ? '' : t && !own(id) ? `<p class="ownnote tbl">${esc(tr('dossier.tableNote', {by: t.by}))}</p>`
      : pg.role && role !== 'beide' ? `<p class="ownnote">${esc(tr('dossier.own', {role: roleName(pg.role)}))}</p>` : ''
    $('#page').innerHTML = pg ? note + pg.html : `<p class="note">${esc(tr('dossier.none'))}</p>`
    // Auf den Tisch legen: nur sinnvoll, wenn noch jemand da ist und die anderen die Seite nicht ohnehin haben
    if (pg && many && (pg.role || t)) $('#page').prepend(h('button', {class: 'btn tablebtn', type: 'button', onclick: () => G.send({t: 'table', page: id, on: !t})},
      t ? tr('dossier.takeBack') : tr('dossier.putOn')))
    mountPage($('#page'))
  }
  $('#doneList').replaceChildren(...(s.done || []).map(d => h('li', {}, fill(d))))
  $('#doneBox').hidden = !(s.done || []).length
}
export function renderLog() {
  $('#logList').replaceChildren(...G.log.slice().reverse().map(l => h('li', {},
    l.npc && (lineMeta(l.npc, l.raw) || deVoice) ? h('button', {class: 'replay', title: t('log.replay'), type: 'button', onclick: () => speak(l.npc, l.raw, G.npcTiles.get(l.npc), true)}, '▶') : null,
    h('b', {}, l.who + ': '), l.text)))
}
export let notesDirty = 0
export function setNotesDirty(v) { notesDirty = v }
export function renderNotes(s) {
  const ta = $('#notesIn')
  if (document.activeElement !== ta && !notesDirty && ta.value !== s.notes.text) ta.value = s.notes.text
  $('#notesBy').textContent = s.notes.by ? t('notes.by', {by: s.notes.by}) : t('notes.default')
}
export function renderFrags(s) {
  const f = s.frags || []
  $('#frags').hidden = !f.length
  $('#frags').replaceChildren(h('span', {class: 'mono'}, t('frags')), ...f.map(x => h('span', {class: 'frag'}, h('i', {}, x.sym), ' ', x.val)))
}
export function renderPuzzle(s) {
  const box = $('#puzzle'), p = s.puzzle && G.c.puzzles[s.puzzle]
  box.hidden = !p || s.phase !== 'play'
  $('#akteBtn').classList.toggle('task', !!p)
  if (!p) { box.dataset.id = ''; return }
  if (box.dataset.id !== s.puzzle) {
    box.dataset.id = s.puzzle
    $('#pq').textContent = fill(p.q); $('#pa').placeholder = p.ph || t('puz.answer'); $('#pa').value = ''
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
  $('#pby').textContent = locked ? t('puz.only', {role: roleName(p.by)}) : p.by ? t('puz.onlyYou', {role: roleName(p.by)}) : ''
  const n = s.hints[s.puzzle] || 0, max = hintMax(s, s.puzzle)
  $('#hints').replaceChildren(...p.hints.slice(0, n).map((x, i) => h('li', {}, h('b', {}, t('puz.hintN', {n: i + 1})), x)))
  $('#hintBtn').hidden = n >= max
  $('#hintBtn').textContent = t('puz.hintBtn', {n, total: max})
  $('#tries').replaceChildren(...s.tries.slice(-3).map(t => h('li', {class: t.ok ? 'ok' : t.near ? 'near' : ''}, `${t.by}: „${t.a}“ ${t.ok ? '✓' : t.near ? '≈ ' + t.near : '✗'}`)))
}
export function renderKnock(s) {
  $('#knock').hidden = !s.knock
  if (s.knock) $('#knockText').textContent = t('knock.text', {name: G.c.npcs[s.knock].name})
}
export let ringT = 0
export function renderCall(s) {
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
export function renderAsk(s) {
  const box = $('#ask')
  box.hidden = !s.ask || s.phase !== 'play'
  if (!s.ask) return
  $('#askWho').textContent = G.c.npcs[s.ask.npc]?.name || ''
  $('#askPrompt').textContent = s.ask.busy ? t('game.asked', {q: s.ask.last}) : s.ask.prompt
  const key = JSON.stringify([s.ask.opts, s.ask.busy])
  if (box.dataset.k === key) return
  box.dataset.k = key
  $('#askOpts').replaceChildren(...(s.ask.opts || []).map(o => h('button', {
    class: 'askbtn' + (o.used ? ' used' : '') + (o.tag ? ' tag-' + o.tag : ''), type: 'button', disabled: s.ask.busy || (o.used && !o.repeat),
    onclick: () => G.send({t: 'ask', id: o.id})
  }, o.tag === 'accuse' ? '⚠ ' : o.tag === 'proof' ? '🗂 ' : o.tag === 'leave' ? '⏎ ' : '', o.label)))
}
export function renderVote(s) {
  const v = $('#vote')
  v.hidden = !s.vote
  if (!s.vote) return
  $('#voteTitle').textContent = s.vote.prompt
  $('#voteText').textContent = s.vote.text || t('vote.default')
  const mine = s.votes[selfId], key = s.vote.id + mine
  if (v.dataset.k !== key) {
    v.dataset.k = key
    $('#voteOpts').replaceChildren(...s.vote.options.map(o => h('button', {class: 'opt', type: 'button', 'aria-pressed': o.id === mine, onclick: () => G.send({t: 'vote', v: o.id})}, h('b', {}, o.label), h('span', {}, o.desc || ''))))
  }
  const ids = players()
  $('#voteCount').textContent = t('vote.count', {n: ids.filter(id => s.votes[id]).length, total: ids.length})
}
export let holding = false
export function setHolding(v) { holding = v }
export function renderHold(s) {
  $('#hold').hidden = !s.hold
  if (!s.hold) { holding = false; return }
  $('#holdLabel').textContent = s.hold.label
  $('#holdCount').textContent = t('hold.count', {count: s.hold.count, need: s.hold.need})
  $('#holdBtn').classList.toggle('on', holding)
  $('#hold').classList.toggle('all', s.hold.count >= s.hold.need)
}
export function renderQuiet(s) {
  const q = s.quiet
  $('#quiet').hidden = !q || s.phase !== 'play'
  if (!q) return
  const what = t('quiet.' + q.kind)
  const ids = players(), ok = ids.filter(id => condOk(q.kind, id)).length
  $('#quietText').textContent = t('quiet.waits', {name: G.c.npcs[q.npc]?.name || t('game.someone'), what})
  $('#quietCount').textContent = `${ok}/${ids.length}`
  $('#quiet').classList.toggle('ok', ok >= ids.length)
}
export function renderPause(s) {
  $('#paused').hidden = !s.paused || s.phase !== 'play'
  if (s.paused) { $('#pausedBy').textContent = s.pausedBy ? t('pause.by', {by: s.pausedBy}) : t('pause.saved'); stopVoice() }
  $('#pauseBtn').hidden = s.phase !== 'play'
}
export function setSide(which) {
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
export function renderEnd(s) {
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
  $('#endStats').textContent = t('end.stats', {time, hints, level: t('level.' + (s.level || 'normal')), n: Object.keys(G.c.endings).length})
  renderReport(s, time)
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
  $('#copyBtn').onclick = () => navigator.clipboard?.writeText(text).then(() => toast(t('end.copied')), () => toast(t('end.copyFail')))
}
// Verlauf pro Rätsel: Zeit, Hinweise, Fehlversuche. Bleibt im Browser; wer mag, kopiert ihn als Text.
function renderReport(s, time) {
  const rows = Object.entries(s.stats || {}).filter(([p]) => G.c.puzzles[p]).sort((a, b) => a[1].start - b[1].start)
    .map(([p, st]) => ({p, q: fill(G.c.puzzles[p].q), ms: Math.max(0, (st.end || s.endedAt) - st.start), hints: s.hints[p] || 0, wrong: st.wrong || 0, done: !!st.end}))
  $('#endReport').hidden = !rows.length
  if (!rows.length) return
  const longest = rows.reduce((a, b) => b.ms > a.ms ? b : a)
  $('#reportRows').replaceChildren(...rows.map(r => h('tr', {class: r === longest ? 'long' : ''},
    h('td', {}, r.q.length > 52 ? r.q.slice(0, 50) + '…' : r.q), h('td', {}, fmtClock(r.ms) + (r === longest ? ' ⏱' : '')),
    h('td', {}, String(r.hints)), h('td', {}, String(r.wrong)), h('td', {}, r.done ? '✓' : '–'))))
  const text = [`${G.c.title} · ${G.c.endings[s.ending]?.title || ''} · ${time} · ${t('level.' + (s.level || 'normal'))} · ${Object.keys(s.names).length} ${t('report.people')}`,
    ...rows.map(r => `${fmtClock(r.ms)}  ${t('report.hints')} ${r.hints}  ${t('report.wrong')} ${r.wrong}  ${r.done ? '✓' : '–'}  ${r.q}`)].join('\n')
  $('#reportBtn').onclick = () => navigator.clipboard?.writeText(text).then(() => toast(t('end.copied')), () => toast(t('end.copyFail')))
}
export function downloadBlob(blob) {
  const a = h('a', {href: URL.createObjectURL(blob), download: `akte-${G.c.id}.png`}); a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 5000)
}
// Geschwärzte Akte als Bild (1080 × 1350). Verrät nichts über die Lösung; der Code öffnet den Epilog.
export function drawFile({team, time, code, hints}) {
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
  const rows = [[t('end.status'), t('end.solved')], [t('end.duration'), time], [t('end.hintsRow'), String(hints)], [t('end.team'), team.join(', ').toUpperCase().slice(0, 34)], ...c0.share.rows.map(r => [r, null])]
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
  x.strokeRect(-170, -62, 340, 124); x.font = `800 50px ${mono}`; x.textAlign = 'center'; x.fillText(t('end.conf'), 0, 18)
  x.restore()
  x.fillStyle = '#1a1814'; x.font = `600 30px ${mono}`
  x.fillText(t('end.code') + code, 80, 1240)
  x.fillStyle = '#5b554a'; x.font = `500 26px ${mono}`
  x.fillText(t('end.foot'), 80, 1288)
  return c
}


/* =================== Sensoren (bleiben im Browser) =================== */
// Helligkeit der eigenen Kamera: „zugehalten“, wenn die Kamera an ist und das Bild fast schwarz.
// Lautstärke des eigenen Mikros: beim gemeinsamen Klatschen meldet der Browser nur „laut“, keine Töne.
export function startSensors() {
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
export function renderClap(s) {
  $('#clap').hidden = !s.clap
  if (!s.clap) return
  $('#clapLabel').textContent = s.clap.label
  $('#clapText').textContent = s.clap.text || t('clap.default')
  $('#clapCount').textContent = t('clap.count', {count: s.clap.count, need: s.clap.need})
  $('#clapMic').hidden = R.mic || !R.stream?.getAudioTracks().length
}
export function renderClapLive() {
  if ($('#clap').hidden) return
  $('#clapBar').style.width = Math.min(100, (R.level || 0) * 200) + '%'
  $('#clapBar').classList.toggle('hot', (R.level || 0) > .5)
}

/* =================== Farbsignal =================== */
export const COLORS = {R: '#ff3b30', G: '#3ddc84', B: '#4a8cff', Y: '#ffd23f', W: '#ffffff', V: '#b98cff'}
