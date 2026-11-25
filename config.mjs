// Gemeinsame Netzwerk-Konfiguration für den Anruf (index.html) und den Verbindungstest (check.html).
// Bei Änderungen an Relays oder TURN auch datenschutz.html anpassen.

export const APP_ID = 'anruf.org'

// Eigener Verbindungsserver (Cloudflare Worker, Code in signal/). Für Firmen- und Behördennetze
// reicht es, diese eine Adresse freizugeben. Die öffentlichen Relays bleiben als Ersatz, falls er ausfällt.
export const OWN_RELAYS = [
  'wss://anruf-signal.broken-surf-06ef.workers.dev'
]
// Öffentliche Nostr-Relays, nur für den Verbindungsaufbau (keine Medien, kein Chat).
export const PUBLIC_RELAYS = [
  'wss://nos.lol',
  'wss://relay.mostr.pub',
  'wss://nostr-01.yakihonne.com',
  'wss://yabu.me/v2',
  'wss://nostr-01.uid.ovh',
  'wss://purplerelay.com'
]
export const DEFAULT_RELAYS = [...OWN_RELAYS, ...PUBLIC_RELAYS]

// STUN-Server, die Trystero standardmäßig nutzt (nur zum Ermitteln der öffentlichen Adresse).
export const STUN = [
  'stun:stun.l.google.com:19302',
  'stun:stun1.l.google.com:19302',
  'stun:stun2.l.google.com:19302',
  'stun:stun.cloudflare.com:3478'
]

// TURN (Open Relay / Metered) für Netze, in denen keine direkte Verbindung möglich ist.
export const TURN = {domain: 'anruf.metered.live', apiKey: 'aa9f1d5405b919c510d0922d31e47b46c542'}
// Fallback, falls der Credential-Abruf scheitert (statische Open-Relay-Zugangsdaten).
export const TURN_FALLBACK = [
  {urls: 'turn:standard.relay.metered.ca:80', username: 'e5d3ea1b1eb5062f5be48e74', credential: 'Hcx7wJ4kTNrZjpXI'},
  {urls: 'turn:standard.relay.metered.ca:80?transport=tcp', username: 'e5d3ea1b1eb5062f5be48e74', credential: 'Hcx7wJ4kTNrZjpXI'},
  {urls: 'turn:standard.relay.metered.ca:443', username: 'e5d3ea1b1eb5062f5be48e74', credential: 'Hcx7wJ4kTNrZjpXI'},
  {urls: 'turns:standard.relay.metered.ca:443?transport=tcp', username: 'e5d3ea1b1eb5062f5be48e74', credential: 'Hcx7wJ4kTNrZjpXI'}
]
