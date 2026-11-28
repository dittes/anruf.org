// Service Worker: macht anruf.org installierbar und die Oberfläche offlinefähig.
// Gespräche selbst brauchen weiter Netz. Es werden nur Dateien von anruf.org gecacht, keine Anrufdaten.
// Bei Änderungen an den Dateien unten VERSION erhöhen.
const VERSION = 'v3'
const CACHE = 'anruf-' + VERSION
const SHELL = [
  './', 'index.html', 'config.mjs', 'vendor/trystero.mjs', 'vendor/qrcode.mjs',
  'favicon.svg', 'manifest.webmanifest', 'icons/icon-any-192.png', 'icons/apple-touch-icon.png',
  'datenschutz.html', 'impressum.html', 'check/'
]

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('anruf-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  const req = e.request
  const url = new URL(req.url)
  if (req.method !== 'GET' || url.origin !== location.origin) return
  if (req.headers.has('range') || url.pathname.endsWith('.mp4')) return // Video direkt aus dem Netz

  if (req.mode === 'navigate') {
    // Seiten: erst Netz (immer aktuell), offline aus dem Cache
    e.respondWith(
      fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)) }
        return res
      }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
    )
    return
  }
  // Dateien: aus dem Cache, im Hintergrund aktualisieren (auch das große MediaPipe-Modell nach erster Nutzung)
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)) }
        return res
      }).catch(() => hit)
      return hit || net
    })
  )
})
