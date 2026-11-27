// Kleine Helfer für alle Module: DOM, Speicher, Hinweise, URL-Schalter.
import {DEFAULT_RELAYS} from '../config.mjs'
import {myName, slug} from './app.mjs'
import qrcode from '../vendor/qrcode.mjs'
import {t} from './i18n.mjs'

export const $ = (s, el = document) => el.querySelector(s)
export const $$ = (s, el = document) => [...el.querySelectorAll(s)]
export const h = (tag, attrs = {}, ...kids) => {
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
export const qs = new URLSearchParams(location.search)
export const RELAYS = qs.get('relay') ? [qs.get('relay')] : DEFAULT_RELAYS
export const LIMIT = 8
// ?fast: Wartezeiten ×0,1 zum Ausprobieren · ?test: ×0,02 und stumm, für den automatischen Durchlauf (tools/test.html)
export const TEST = qs.has('test')
export const SPEED = TEST ? .02 : qs.has('fast') ? .1 : 1
export const store = {
  get: (k, d) => { try { return localStorage.getItem('fall.' + k) ?? d } catch { return d } },
  set: (k, v) => { try { localStorage.setItem('fall.' + k, v) } catch {} },
  del: k => { try { localStorage.removeItem('fall.' + k) } catch {} }
}
export const sess = {
  get: k => { try { return sessionStorage.getItem('fall.' + k) } catch { return null } },
  set: (k, v) => { try { sessionStorage.setItem('fall.' + k, v) } catch {} }
}
export const cleanName = s => String(s || '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 24)
export const randomSlug = () => {
  const a = t('slug.a').split(','), b = t('slug.b').split(',')
  const r = n => n[Math.floor(Math.random() * n.length)]
  return `${r(a)}-${r(b)}-${Math.random().toString(36).slice(2, 7)}`
}

export function toast(text, ms = 3400, cls = '') {
  const t = h('div', {class: 'toast ' + cls}, text)
  $('#toasts').append(t)
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400) }, ms)
}
export const fmtClock = ms => {
  const s = Math.max(0, Math.floor(ms / 1000)), hh = Math.floor(s / 3600)
  return (hh ? hh + ':' : '') + `${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
export const fill = text => String(text).replace(/\{me\}/g, myName)
  .replace(/\{time\}/g, new Date().toLocaleTimeString(t('locale'), {hour: '2-digit', minute: '2-digit'}) + t('time.suffix'))

export function qrSvg(text) {
  const q = qrcode(0, 'M'); q.addData(text); q.make()
  const n = q.getModuleCount(); let d = ''
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`
  return `<svg viewBox="-2 -2 ${n + 4} ${n + 4}" shape-rendering="crispEdges"><rect x="-2" y="-2" width="${n + 4}" height="${n + 4}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`
}
