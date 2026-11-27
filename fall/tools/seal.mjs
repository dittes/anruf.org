// Ersetzt Klartext-Lösungen '@@wort' in den Fällen durch ihren SHA-256 (Salz = Fall-ID).
// So stehen Lösungen und Codes nicht lesbar im Quelltext.  Aufruf: node fall/tools/seal.mjs
import {readFileSync, writeFileSync, readdirSync} from 'node:fs'
import {join, dirname} from 'node:path'
import {fileURLToPath} from 'node:url'
import {createHash} from 'node:crypto'
import {norm} from '../lib.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'cases')
for (const id of readdirSync(root, {withFileTypes: true}).filter(d => d.isDirectory()).map(d => d.name)) {
  const f = join(root, id, 'story.mjs')
  let src = readFileSync(f, 'utf8'), n = 0
  src = src.replace(/'@@([^']+)'/g, (_, w) => { n++; return `'${createHash('sha256').update(id + ':' + norm(w)).digest('hex')}'` })
  if (n) { writeFileSync(f, src); console.log(`${id}: ${n} Lösungen versiegelt`) }
}
