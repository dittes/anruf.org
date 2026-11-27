// Listet alle Sprachaufnahmen, die die Fälle brauchen (JSON auf stdout), für voices.py.
// Zeilen mit {me} bekommen eine Fassung pro Codename und eine ohne Namen.
import {CASES} from '../cases/index.mjs'
import {akey, audioText, CODENAMES, spokenLines} from '../lib.mjs'

const jobs = []
for (const meta of CASES) {
  const c = (await meta.load()).default
  const seen = new Set()
  const add = (npc, text, voice, extra = {}) => {
    const key = akey(npc, text)
    if (seen.has(key)) return
    seen.add(key)
    jobs.push({case: c.id, key, npc, text, voice, ...extra})
  }
  for (const [npc, text] of spokenLines(c)) {
    const v = c.npcs[npc].voice
    add(npc, audioText(text, ''), v)
    if (text.includes('{me}')) for (const n of CODENAMES) add(npc, audioText(text, n), v)
  }
  for (const [id, clip] of Object.entries(c.clips || {})) {
    add('clip:' + id, clip.text || '', clip.voice || null, {reverse: !!clip.reverse, speed: clip.speed || 0, bells: clip.bells || 0, dtmf: clip.dtmf || ''})
  }
}
process.stdout.write(JSON.stringify(jobs, null, 1))
