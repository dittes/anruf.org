# anruf.org

Ruf einfach an. Anrufe und offene Sprachkanäle direkt von Browser zu Browser (WebRTC), ohne Konto, ohne App und ohne eigenen Server. Die Seite ist rein statisch und läuft auf GitHub Pages.

## So funktioniert es

- **Medien:** Audio und Video laufen per WebRTC direkt zwischen den Browsern und sind Ende-zu-Ende verschlüsselt (DTLS-SRTP).
- **Verbindungsaufbau:** [Trystero](https://github.com/dmotz/trystero) 0.25.4 übernimmt das Signaling über öffentliche Nostr-Relays. Die Library liegt gebündelt in `vendor/trystero.mjs`.
- **Offene Kanäle:** Teilnehmende senden alle 25 Sekunden ein flüchtiges Nostr-Event mit Kanal, Name und Zufalls-ID. Die Startseite liest nur mit. Pro Kanal sind maximal 10 Personen erlaubt, pro Anruf 8 (Mesh-Topologie).
- **Keine Drittanbieter-CDNs:** Schriften (Bricolage Grotesque, Geist Mono, OFL) und Libraries werden selbst gehostet. Das ist gut für die DSGVO.

## Links

- Anruf: `https://anruf.org/#blaue-moewe-x7k2p`
- Kanal: `https://anruf.org/#kanal/berlin`

## Konfiguration (oben im `<script>` von `index.html`)

| Konstante | Zweck |
|---|---|
| `DEFAULT_RELAYS` | Nostr-Relays für Signaling und Präsenz. Bei Änderungen auch `datenschutz.html` anpassen. |
| `TURN` | Open Relay / Metered: `domain` (z. B. `anruf.metered.live`) und `apiKey`. Leer bedeutet: nur STUN. |
| `LIMIT` | Maximale Teilnehmerzahl pro Anruf und Kanal. |
| `CHANNELS` | Fest angezeigte Kanäle (ohne Umlaute). |

### TURN einrichten (empfohlen)

Etwa 10–20 % der Verbindungen, etwa im Mobilfunk oder in Firmennetzen, brauchen einen TURN-Server.

1. Kostenlos registrieren: <https://www.metered.ca/tools/openrelay/> (20 GB pro Monat frei).
2. Im Dashboard die App-Domain (`xyz.metered.live`) und den API-Key kopieren.
3. Beides in `index.html` bei `const TURN = {domain: '', apiKey: ''}` eintragen.

Der API-Key darf öffentlich im Frontend stehen, er gibt nur kurzlebige TURN-Zugangsdaten aus.

## Deployment

1. Im Repository unter Settings → Pages die Quelle „Deploy from a branch“ wählen, Branch `main`, Ordner `/ (root)`.
2. Custom domain `anruf.org` ist über die Datei `CNAME` gesetzt. Beim Domain-Anbieter A-Records auf `185.199.108.153`, `.109.153`, `.110.153` und `.111.153` setzen (optional AAAA), für `www` einen CNAME auf `dittes.github.io`.
3. Danach „Enforce HTTPS“ aktivieren. Ohne HTTPS geben Browser Mikrofon und Kamera nicht frei.

## Lokal testen

```sh
python3 -m http.server 8080
# http://localhost:8080 — zwei Browserfenster öffnen
```

Mit einem lokalen Nostr-Relay geht es auch ganz ohne Internet: `http://localhost:8080/?relay=ws://localhost:7777`.
