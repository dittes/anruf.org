// Gemeinsame Helfer für Spiel (Browser) und Werkzeuge (Node).

// Kurzer Schlüssel für eine Sprachaufnahme (FNV-1a über Figur + gesprochenen Text)
export function akey(npc, text) {
  let h = 0x811c9dc5
  const s = npc + '|' + text
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0 }
  return h.toString(16).padStart(8, '0')
}

// Was tatsächlich gesprochen wird: Den echten Namen ({me}) kennt nur der Untertitel, {time} wird „schon spät“
export function audioText(text) {
  return String(text)
    .replace(/,?\s*\{me\}/g, '')
    .replace(/\{time\}/g, 'schon spät')
    .replace(/^,\s*/, '')
}

export const norm = s => String(s).toLowerCase()
  .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
  .replace(/[^a-z0-9]/g, '')

export async function sha(salt, s) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + ':' + s))
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('')
}

// Alle Zeilen eines Falls, die gesprochen werden (für das Sprach-Werkzeug)
export function spokenLines(c) {
  const out = []
  const add = (npc, text) => { if (npc && text && c.npcs[npc]?.voice) out.push([npc, text]) }
  for (const st of c.script) {
    const [k, a, b, d] = st
    if (k === 'say') add(a, b)
    if (k === 'quiet') add(b, d)
    if (k === 'solve' && b?.taunts) b.taunts.forEach(t => add(b.npc, t))
    if (k === 'ask') for (const o of b.options) (o.say || []).forEach(t => Array.isArray(t) ? add(t[0], t[1]) : add(o.npc || a, t))
    if (k === 'quiet' && st[4]) add(b, st[4])
  }
  return out
}
