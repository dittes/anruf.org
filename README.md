# anruf.org

Ruf einfach an. Anrufe mit Audio, Video, Text-Chat, Dateien und Bildschirmfreigabe direkt von Browser zu Browser (WebRTC), ohne Konto, ohne App und ohne eigenen Server. Die Seite ist rein statisch und läuft auf GitHub Pages.

## So funktioniert es

- **Medien:** Audio und Video laufen per WebRTC direkt zwischen den Browsern und sind Ende-zu-Ende verschlüsselt (DTLS-SRTP).
- **Verbindungsaufbau:** [Trystero](https://github.com/dmotz/trystero) 0.25.4 übernimmt das Signaling über Nostr. Die Library liegt gebündelt in `vendor/trystero.mjs`. Derzeit laufen nur öffentliche Nostr-Relays; der eigene Verbindungsserver (siehe unten) ist abgeschaltet.
- **Chat:** Textnachrichten laufen über den verschlüsselten WebRTC-Datenkanal und werden nicht gespeichert. Pro Anruf sind maximal 8 Personen erlaubt (Mesh-Topologie).
- **Dateien & Bilder:** Über die Büroklammer im Chat, per Drag & Drop oder per Einfügen (Strg/Cmd+V). Bilder erscheinen als Vorschau, alles andere als Datei zum Speichern. Maximal 25 MB pro Datei, bis zu 5 Dateien auf einmal. Die Übertragung läuft über den Datenkanal, nichts wird zwischengespeichert.
- **Bildschirm teilen:** Ganzer Bildschirm, einzelnes Fenster oder Tab, wahlweise mit oder ohne Ton. Es präsentiert immer nur eine Person. Die Präsentation wird groß angezeigt, die Teilnehmenden rücken in einen Streifen daneben. Der Button erscheint nur in Browsern mit `getDisplayMedia` (Desktop-Chrome, Edge, Firefox, Safari; Smartphones meist nicht).
- **Vollbild:** Knopf im Dock, Taste `F` oder Doppelklick auf eine Präsentation. Im Vollbild ist die Kopfzeile (mit dem (i)) ausgeblendet, die Steuerung unten blendet sich nach 3,5 Sekunden aus und kommt bei Bewegung oder Tipp zurück. Wo der Browser kein Element-Vollbild kann (iPhone-Safari), nutzt die Seite ein Vollbild-Layout.
- **Verbindungsdetails:** Das (i) neben Teilnehmerzahl und Zeit (Hover oder Klick) zeigt, ob der Anruf direkt (P2P) oder über Relay läuft, Ping, eine Live-Grafik der Datenrate, den Gesamtverkehr, Verlust, Jitter und die Video-Auflösung pro Teilnehmer. Die Werte kommen aus `RTCPeerConnection.getStats()` und bleiben im Browser.
- **Vorschau vor dem Anruf:** Wer einen Anruf startet oder einen Link öffnet, sieht zuerst sich selbst mit Mikrofon-Pegel, kann Kamera/Mikro an- und ausschalten, den Namen ändern und unter „Mikrofon, Kamera, Lautsprecher“ Geräte wählen und den Ton testen. Lautsprecher-Wahl nur, wo der Browser `setSinkId` kann.
- **Eigener Raumname:** Auf der Startseite unter dem Knopf „Eigenen Raumnamen wählen“. Aus „Familie Müller“ wird `#familie-mueller`. Wer denselben Namen eingibt, landet im selben Raum (also erratbar, für Vertrauliches lieber den Zufallsnamen nehmen).
- **Hintergrund:** Unscharf, vier gezeichnete Hintergründe oder ein eigenes Bild (wird nur im Browser gespeichert). Wählbar in der Vorschau und im Anruf über den Funkel-Knopf auf dem eigenen Bild. Die Segmentierung macht [MediaPipe Tasks Vision](https://www.npmjs.com/package/@mediapipe/tasks-vision) 1.2.3 (Apache-2.0) mit dem Modell `selfie_segmenter.tflite`, beides liegt in `vendor/mediapipe/` und wird erst geladen, wenn jemand einen Effekt einschaltet (ca. 15 MB, danach im Cache). Die Gegenseite bekommt nur das fertige Bild (Canvas-Stream). Die Bildverarbeitung läuft in WebGL2: zeitlich geglättete Maske, kantenbewusstes Hochskalieren (Joint Bilateral, geführt vom Kamerabild), beim Unscharf-Effekt ein gewichteter Gauß nur über Hintergrund-Pixel (keine verwischte Silhouette, kein Halo), beim Bild-Hintergrund eine Kanten-Entfärbung gegen Reste des alten Hintergrunds. Einstellungen in `FX_CFG`. Mit `?fxdebug` erscheinen FPS und Rechenzeit, die Tasten 0–6 zeigen die Zwischenstufen (Kamera, Maske roh/verfeinert, Blur-Ausschluss, Hintergrund, entfärbter Vordergrund).
- **Umbenennen:** Tipp im Anruf auf das eigene Namensschild.
- **Stumm reden:** Wer stummgeschaltet ist und spricht, bekommt einen Hinweis mit „Mikro an“. Gemessen wird über eine lokale Kopie des Mikro-Tracks, gesendet wird nichts.
- **Tastenkürzel:** Leertaste halten = sprechen, solange man stumm ist. `M` Mikrofon, `V` Kamera, `F` Vollbild, `P` Bild-im-Bild.
- **Reaktionen & Hand heben:** Smiley-Knopf im Dock. Emojis fliegen kurz über das eigene Bild, die Hand bleibt sichtbar, bis man sie senkt.
- **Anruf abschließen:** Im „Einladen“-Dialog. Wer danach den Link öffnet, bekommt weder Bild noch Ton und klopft an. Alle im Anruf sehen eine Karte mit „Reinlassen“ / „Ablehnen“. Ohne Server setzen die Browser der Teilnehmenden das durch, es ist also eine Höflichkeits-Sperre und kein Schutz gegen manipulierte Clients.
- **Bild-im-Bild:** In Chrome/Edge (Document Picture-in-Picture) schwebt der Anruf automatisch in einem Mini-Fenster weiter, wenn man den Tab wechselt (oder Taste `P`). Mit Mikro, Kamera und Auflegen.
- **Schwache Verbindung:** Ist die Qualität 8 Sekunden lang „Schlecht“, schlägt die Seite vor, die Kamera auszuschalten, und bietet sie wieder an, sobald es 30 Sekunden lang gut läuft.
- **Töne:** Ein gut hörbarer Dreiklang, wenn jemand dazukommt, und ein Klopfen beim Anklopfen.
- **Keine externen Ressourcen:** Es werden keine Web-Fonts geladen (nur Systemschriften), die Libraries liegen im Repo. Das ist gut für die DSGVO.
  - In `vendor/mediapipe/vision_bundle.mjs` ist die eingebaute Telemetrie von MediaPipe (`odml.pa.googleapis.com/v1/log`) abgeschaltet: `flush()` ist ein No-op. Beim Aktualisieren der Library diesen Patch wiederholen.

## Links

- Anruf: `https://anruf.org/#blaue-moewe-x7k2p`

## Eigener Verbindungsserver (`signal/`)

Ein minimaler Nostr-Relay als Cloudflare Worker mit Durable Object (WebSocket-Hibernation), damit Firmen- und Behördennetze nur eine Adresse freigeben müssen. Er nimmt nur flüchtige Events an (kind 20000–29999, so wie Trystero sie sendet), leitet sie an passende Abos weiter und speichert nichts. Schutz: nur Origins `anruf.org` und `localhost`, max. 64 KB pro Nachricht, 20 Abos und 80 Events pro 10 Sekunden je Verbindung, keine Request-Logs.

```sh
cd signal
npx wrangler@4 dev       # lokal auf :8787, App dann mit ?relay=ws://127.0.0.1:8787 testen
npx wrangler@4 deploy    # nach Cloudflare
```

Derzeit nicht in Betrieb (`OWN_RELAYS` in `config.mjs` ist leer). Zum Reaktivieren die Worker-Adresse dort eintragen und `datenschutz.html` (Abschnitt 5) wieder um Cloudflare ergänzen. Für `signal.anruf.org` müsste die DNS-Zone von anruf.org zu Cloudflare umziehen; dann in `wrangler.jsonc` eine `routes`-Zeile mit `custom_domain: true` ergänzen und die Adresse in `config.mjs` tauschen.

## Verbindungstest (`/check`)

`check/` (anruf.org/check) prüft ohne Kamera und Mikrofon, ob Anrufe aus dem aktuellen Netz klappen: WebSocket zu den Nostr-Relays (Verbindungsaufbau), STUN über UDP (direkter Weg), TURN-Zugangsdaten und TURN einzeln über UDP 80, UDP 443, TCP 80 und TLS 443. Am Ende steht ein Urteil, eine Freigabe-Liste für die IT und „Bericht kopieren“. Die App verlinkt den Test im Footer, in der Vorschau und automatisch, wenn eine Verbindung nach 20 Sekunden nicht steht.

## Konfiguration

| Konstante | Zweck |
|---|---|
| `DEFAULT_RELAYS` (`config.mjs`) | Nostr-Relays für das Signaling. Bei Änderungen auch `datenschutz.html` anpassen. |
| `TURN` / `TURN_FALLBACK` / `STUN` (`config.mjs`) | Open Relay / Metered: App-Domain und API-Key sowie statische Zugangsdaten als Fallback. Werden beim Beitreten abgeholt, der Relay wird aber nur genutzt, wenn direkt nichts geht. |
| `TURN_AFTER_MS` | Wie lange eine abgerissene Verbindung im Aufbau hängen darf, bevor ICE neu startet. |
| `LIMIT` | Maximale Teilnehmerzahl pro Anruf. |

### TURN (Relay, wenn direkt nichts geht)

Beim Beitreten holt die Seite kurzlebige Zugangsdaten über die Metered-REST-API (Fallback: die statischen Zugangsdaten in `TURN_FALLBACK`) und gibt sie Trystero als `turnConfig` mit. WebRTC bevorzugt trotzdem den direkten Weg und nutzt den Relay nur, wenn direkt nichts klappt. Nachträglich eintragen reicht nicht: Trystero liefert in `getPeers()` nur schon verbundene Peers, eine hängende Erstverbindung wäre so nie erreichbar. Fällt eine bestehende Verbindung zurück in den Aufbau und hängt länger als `TURN_AFTER_MS` (6 Sekunden), startet ICE einmal neu; nur eine Seite (die mit der kleineren ID) sofort, die andere 6 Sekunden später. Beides darf öffentlich im Frontend stehen.

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

## Exit-Games „Akte 0“ (`/fall`)

Exit-Games im Videoanruf (anruf.org/fall) für 2–4 Personen, mit gleichem Verbindungsaufbau wie der Anruf (Trystero, `config.mjs`) in eigenen Räumen `fall/<fall>/<name>`. Drei Fälle: „Der neunte Anrufer“ (6 Kapitel, 90–120 min), „Funkstille“ und „Erster Arbeitstag“ (je 4 Kapitel, 45–60 min).

Figuren rufen an, klopfen an, schicken Nachrichten an einzelne Rollen, lassen sich verhören und stellen Bedingungen (alle Mikros aus, alle Kameras an …). Dazu Tonbänder (Tempo, rückwärts, Frequenzanzeige für Wähltöne), Funkempfänger, Chiffrierscheibe, Beweisfotos mit Zoom, Gesichtervergleich, Aktenvernichter-Streifen, Sicherungskasten, Farbsignale, die nur eine Rolle sieht, Eingaben, die nur eine Rolle machen darf, UV-Lampe, Morse-Lampe, gemeinsames Gedrückthalten und Klatschen, Kameras zuhalten, Countdown, Licht aus, Verzweigungen und mehrere Enden. Hilfen: geteilte Notizen, Protokoll zum Nachhören, gestufte Hinweise, Pause mit Speicherstand.

Die Stimmen sind mit Piper lokal erzeugte Audiodateien (CC0-Stimmen, siehe `fall/CREDITS.md`), die Figuren verwenden lokal gespeicherte, animierte Fotoporträts. Der Kamera-Schnappschuss für den „Spiegel“-Effekt bleibt im Browser. Aufbau, Skript-Schritte und wie man einen neuen Fall baut: `fall/README.md`.

Testen: `http://localhost:8080/fall/?nomedia&fast` in zwei Tabs (`nomedia` = ohne Kamera/Mikro, `fast` = kürzere Wartezeiten).
