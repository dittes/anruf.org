# anruf.org

Ruf einfach an. Anrufe mit Audio, Video, Text-Chat, Dateien und Bildschirmfreigabe direkt von Browser zu Browser (WebRTC), ohne Konto, ohne App und ohne eigenen Server. Die Seite ist rein statisch und läuft auf GitHub Pages.

## So funktioniert es

- **Medien:** Audio und Video laufen per WebRTC direkt zwischen den Browsern und sind Ende-zu-Ende verschlüsselt (DTLS-SRTP).
- **Verbindungsaufbau:** [Trystero](https://github.com/dmotz/trystero) 0.25.4 übernimmt das Signaling über öffentliche Nostr-Relays. Die Library liegt gebündelt in `vendor/trystero.mjs`.
- **Chat:** Textnachrichten laufen über den verschlüsselten WebRTC-Datenkanal und werden nicht gespeichert. Pro Anruf sind maximal 8 Personen erlaubt (Mesh-Topologie).
- **Dateien & Bilder:** Über die Büroklammer im Chat, per Drag & Drop oder per Einfügen (Strg/Cmd+V). Bilder erscheinen als Vorschau, alles andere als Datei zum Speichern. Maximal 25 MB pro Datei, bis zu 5 Dateien auf einmal. Die Übertragung läuft über den Datenkanal, nichts wird zwischengespeichert.
- **Bildschirm teilen:** Ganzer Bildschirm, einzelnes Fenster oder Tab, wahlweise mit oder ohne Ton. Es präsentiert immer nur eine Person. Die Präsentation wird groß angezeigt, die Teilnehmenden rücken in einen Streifen daneben. Der Button erscheint nur in Browsern mit `getDisplayMedia` (Desktop-Chrome, Edge, Firefox, Safari; Smartphones meist nicht).
- **Vollbild:** Knopf im Dock, Taste `F` oder Doppelklick auf eine Präsentation. Im Vollbild ist die Kopfzeile (mit dem (i)) ausgeblendet, die Steuerung unten blendet sich nach 3,5 Sekunden aus und kommt bei Bewegung oder Tipp zurück. Wo der Browser kein Element-Vollbild kann (iPhone-Safari), nutzt die Seite ein Vollbild-Layout.
- **Verbindungsdetails:** Das (i) neben Teilnehmerzahl und Zeit (Hover oder Klick) zeigt, ob der Anruf direkt (P2P) oder über Relay läuft, Ping, eine Live-Grafik der Datenrate, den Gesamtverkehr, Verlust, Jitter und die Video-Auflösung pro Teilnehmer. Die Werte kommen aus `RTCPeerConnection.getStats()` und bleiben im Browser.
- **Umbenennen:** Tipp im Anruf auf das eigene Namensschild.
- **Keine externen Ressourcen:** Es werden keine Web-Fonts geladen (nur Systemschriften), die Libraries liegen im Repo. Das ist gut für die DSGVO.

## Links

- Anruf: `https://anruf.org/#blaue-moewe-x7k2p`

## Konfiguration (oben im `<script>` von `index.html`)

| Konstante | Zweck |
|---|---|
| `DEFAULT_RELAYS` | Nostr-Relays für das Signaling. Bei Änderungen auch `datenschutz.html` anpassen. |
| `TURN` / `TURN_FALLBACK` | Open Relay / Metered: App-Domain und API-Key sowie statische Zugangsdaten als Fallback. Wird nur im Notfall benutzt. |
| `TURN_AFTER_MS` | Wie lange der direkte Weg versucht wird, bevor TURN dazukommt. |
| `LIMIT` | Maximale Teilnehmerzahl pro Anruf. |

### TURN (nur als Fallback)

Jede Verbindung startet **ohne** TURN, nur mit STUN, also direkt von Browser zu Browser. Hängt der Verbindungsaufbau länger als `TURN_AFTER_MS` (6 Sekunden) fest, trägt die Seite die TURN-Server nachträglich in die Verbindung ein und startet ICE neu. Erst dann holt sie kurzlebige Zugangsdaten über die Metered-REST-API (Fallback: die statischen Zugangsdaten in `TURN_FALLBACK`). Nur eine Seite (die mit der kleineren ID) startet sofort, die andere erst 6 Sekunden später, damit beide nicht gleichzeitig neu verhandeln. Beides darf öffentlich im Frontend stehen.

Ob eine Verbindung direkt oder über Relay läuft, zeigt das (i) oben rechts im Anruf.

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
