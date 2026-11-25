// anruf.org Verbindungsserver: ein minimaler Nostr-Relay (NIP-01) nur für flüchtige Events.
//
// Trystero (vendor/trystero.mjs) findet die Teilnehmenden eines Anrufs über Nostr:
//   ["EVENT", {kind: 20000–29999, tags: [["x", <Thema>]], content: <verschlüsselt>, …}]
//   ["REQ", <subId>, {kinds: [...], "#x": [<Themen>], since}]   ["CLOSE", <subId>]
// Dieser Relay leitet jedes EVENT an alle passenden Abos weiter und speichert nichts.
// Inhalte sind schon im Browser mit einem Schlüssel aus dem Raumnamen verschlüsselt.
// Ein einziges Durable Object hält alle WebSockets (Hibernation: kostet nichts, solange niemand sendet).
import {DurableObject} from 'cloudflare:workers'

const ALLOWED_ORIGINS = [/^https:\/\/(www\.)?anruf\.org$/, /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/]
const MAX_MESSAGE = 64 * 1024      // Bytes pro Nachricht
const MAX_SUBS = 20                // Abos pro Verbindung
const MAX_TOPICS = 300             // Themen pro Filter
const RATE_EVENTS = 80             // EVENTs pro Verbindung …
const RATE_WINDOW = 10_000         // … in 10 Sekunden
const MAX_SKEW = 15 * 60           // erlaubte Uhrabweichung in Sekunden
const HEX = /^[0-9a-f]+$/

const INFO = {
  name: 'anruf.org',
  description: 'Verbindungsserver für anruf.org. Leitet nur flüchtige, verschlüsselte Verbindungsdaten weiter und speichert nichts.',
  supported_nips: [1, 11],
  software: 'https://github.com/dittes/anruf.org',
  limitation: {max_message_length: MAX_MESSAGE, max_subscriptions: MAX_SUBS, restricted_writes: true}
}
const CORS = {'Access-Control-Allow-Origin': '*'}

export default {
  async fetch(req, env) {
    if (req.headers.get('Upgrade')?.toLowerCase() !== 'websocket') {
      if (req.headers.get('Accept')?.includes('application/nostr+json')) return Response.json(INFO, {headers: CORS})
      return new Response('anruf.org Verbindungsserver. Funktioniert, wenn du das hier lesen kannst.\n', {headers: {'content-type': 'text/plain; charset=utf-8', ...CORS}})
    }
    const origin = req.headers.get('Origin')
    if (origin && !ALLOWED_ORIGINS.some(r => r.test(origin))) return new Response('Origin nicht erlaubt', {status: 403})
    return env.RELAY.get(env.RELAY.idFromName('main')).fetch(req)
  }
}

const validEvent = ev => ev && typeof ev === 'object'
  && typeof ev.id === 'string' && ev.id.length === 64 && HEX.test(ev.id)
  && typeof ev.pubkey === 'string' && ev.pubkey.length === 64 && HEX.test(ev.pubkey)
  && typeof ev.sig === 'string' && ev.sig.length === 128 && HEX.test(ev.sig)
  && Number.isInteger(ev.kind) && ev.kind >= 20000 && ev.kind < 30000          // nur flüchtige Events
  && Number.isInteger(ev.created_at) && Math.abs(ev.created_at - Date.now() / 1000) < MAX_SKEW
  && typeof ev.content === 'string'
  && Array.isArray(ev.tags) && ev.tags.length <= 10 && ev.tags.every(t => Array.isArray(t) && t.every(v => typeof v === 'string' && v.length <= 256))

const cleanFilter = f => ({
  kinds: Array.isArray(f.kinds) ? f.kinds.filter(Number.isInteger).slice(0, 50) : null,
  x: Array.isArray(f['#x']) ? f['#x'].filter(s => typeof s === 'string' && s.length <= 256).slice(0, MAX_TOPICS) : null
})
// "since" wird bewusst ignoriert: Es wird nichts gespeichert, und so stört eine falsch gehende Uhr nicht.
const matches = (f, ev, xs) => (!f.kinds || f.kinds.includes(ev.kind)) && (!f.x || xs.some(x => f.x.includes(x)))

export class Relay extends DurableObject {
  async fetch() {
    const [client, server] = Object.values(new WebSocketPair())
    this.ctx.acceptWebSocket(server)
    server.serializeAttachment({subs: {}, n: 0, t: 0})
    return new Response(null, {status: 101, webSocket: client})
  }

  webSocketMessage(ws, raw) {
    if (typeof raw !== 'string') return
    if (raw.length > MAX_MESSAGE) return this.send(ws, ['NOTICE', 'invalid: message too large'])
    let m; try { m = JSON.parse(raw) } catch { return this.send(ws, ['NOTICE', 'invalid: not json']) }
    if (!Array.isArray(m)) return
    const st = ws.deserializeAttachment() || {subs: {}, n: 0, t: 0}

    if (m[0] === 'REQ') {
      const [, id, ...filters] = m
      if (typeof id !== 'string' || !id || id.length > 64) return this.send(ws, ['NOTICE', 'invalid: subscription id'])
      if (!(id in st.subs) && Object.keys(st.subs).length >= MAX_SUBS) return this.send(ws, ['CLOSED', id, 'error: too many subscriptions'])
      st.subs[id] = filters.filter(f => f && typeof f === 'object').slice(0, 5).map(cleanFilter)
      ws.serializeAttachment(st)
      return this.send(ws, ['EOSE', id])   // keine gespeicherten Events
    }
    if (m[0] === 'CLOSE') {
      if (typeof m[1] === 'string' && m[1] in st.subs) { delete st.subs[m[1]]; ws.serializeAttachment(st) }
      return this.send(ws, ['CLOSED', m[1], ''])
    }
    if (m[0] === 'EVENT') {
      const ev = m[1]
      if (!validEvent(ev)) return this.send(ws, ['OK', ev?.id ?? '', false, 'invalid: only ephemeral events for anruf.org'])
      const now = Date.now()
      if (now - st.t > RATE_WINDOW) { st.t = now; st.n = 0 }
      st.n++
      ws.serializeAttachment(st)
      if (st.n > RATE_EVENTS) return this.send(ws, ['OK', ev.id, false, 'rate-limited: slow down'])
      const xs = ev.tags.filter(t => t[0] === 'x' && t[1]).map(t => t[1])
      const evJson = JSON.stringify(ev)
      for (const peer of this.ctx.getWebSockets()) {
        const subs = peer.deserializeAttachment()?.subs
        if (!subs) continue
        for (const [sid, fs] of Object.entries(subs)) {
          if (fs.some(f => matches(f, ev, xs))) { try { peer.send(`["EVENT",${JSON.stringify(sid)},${evJson}]`) } catch {} }
        }
      }
      return this.send(ws, ['OK', ev.id, true, ''])
    }
    this.send(ws, ['NOTICE', 'unsupported: ' + String(m[0]).slice(0, 20)])
  }

  webSocketClose(ws, code) { try { ws.close(code === 1005 ? 1000 : code, 'bye') } catch {} }
  webSocketError(ws) { try { ws.close(1011, 'error') } catch {} }
  send(ws, msg) { try { ws.send(JSON.stringify(msg)) } catch {} }
}
