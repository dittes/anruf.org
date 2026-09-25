# anruf.org

Ruf einfach an. Anrufe mit Audio, Video und Text-Chat direkt von Browser zu Browser (WebRTC), ohne Konto, ohne App und ohne eigenen Server. Die Seite ist rein statisch und läuft auf GitHub Pages.

## So funktioniert es

- **Medien:** Audio und Video laufen per WebRTC direkt zwischen den Browsern und sind Ende-zu-Ende verschlüsselt (DTLS-SRTP).
- **Verbindungsaufbau:** [Trystero](https://github.com/dmotz/trystero) 0.25.4 übernimmt das Signaling über öffentliche Nostr-Relays. Die Library liegt gebündelt in `vendor/trystero.mjs`.
- **Chat:** Textnachrichten laufen über den verschlüsselten WebRTC-Datenkanal und werden nicht gespeichert. Pro Anruf sind maximal 8 Personen erlaubt (Mesh-Topologie).
- **Umbenennen:** Tipp im Anruf auf das eigene Namensschild.
- **Keine externen Ressourcen:** Es werden keine Web-Fonts geladen (nur Systemschriften), die Libraries liegen im Repo. Das ist gut für die DSGVO.

## Links

- Anruf: `https://anruf.org/#blaue-moewe-x7k2p`

## Konfiguration (oben im `<script>` von `index.html`)

| Konstante | Zweck |
|---|---|
| `DEFAULT_RELAYS` | Nostr-Relays für das Signaling. Bei Änderungen auch `datenschutz.html` anpassen. |
| `TURN` / `TURN_FALLBACK` | Open Relay / Metered: App-Domain und API-Key sowie statische Zugangsdaten als Fallback. |
| `LIMIT` | Maximale Teilnehmerzahl pro Anruf. |

### TURN

TURN ist über Metered Open Relay eingerichtet (`anruf.metered.live`, 20 GB pro Monat frei). Die Seite holt beim Start eines Anrufs kurzlebige Zugangsdaten über die REST-API. Scheitert das, nutzt sie die statischen Zugangsdaten in `TURN_FALLBACK`. Beides darf öffentlich im Frontend stehen.

Den Verbrauch im Blick behalten: <https://dashboard.metered.ca>

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
