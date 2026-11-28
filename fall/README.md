# Akte 0 — Exit-Games im Videoanruf (`/fall`)

Mehrere Fälle zum gemeinsamen Lösen im Videoanruf, auf Basis von anruf.org (gleiches Signaling über `../config.mjs`, eigene Räume `fall/<fall>/<name>`). Link-Format: `anruf.org/fall/#<fall>/<raum>`.

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite (Fallauswahl, eigener Name, Fortsetzen, Epilog-Codes) und Anruf-Oberfläche |
| `app.mjs` | Einstieg: Startseite (Fall, Name, Fortsetzen, Codes), Bedienknöpfe, Start |
| `core.mjs` | Kleine Helfer für alle Module: DOM (`$`, `h`), Speicher, Hinweise, URL-Schalter (`?fast`, `?test`, `?debug`) |
| `sound.mjs` | Töne, Stimmen (Aufnahmen oder Sprachausgabe), Mundbewegung, Atmosphäre |
| `call.mjs` | Anruf: Verbindung (Trystero), Kacheln, Dock, Chat, Bildschirm teilen |
| `game.mjs` | Spiel-Engine `G` (Host arbeitet das Skript ab, schickt den ganzen Spielstand an alle), Signale, Akte, Arbeitstisch, Overlays, Sensoren |
| `widgets.mjs` | Werkzeuge in der Akte (Tonband, Empfänger, Chiffre, Foto, Aktenvernichter, Morsetafel) und Rätsel-Eingaben |
| `portrait.mjs` | Fotoporträts aus `portraits/` mit Blinzeln, zeitlich an die deutsche Aufnahme angepassten Mundformen und szenischen Reaktionen. Figuren ohne Foto nutzen die SVG-Zeichnung. |
| `lib.mjs` | Gemeinsame Helfer (Audio-Schlüssel, Normalisierung, Hash) |
| `cases/index.mjs` | Liste der Fälle |
| `cases/<fall>/story.mjs` | Ein Fall: Figuren, Akten, Rätsel, Enden, Skript |
| `cases/<fall>/audio/` | Sprachaufnahmen + `manifest.json` (Schlüssel → Datei, Dauer) |
| `audio/` | Atmosphäre-Schleifen |
| `tools/` | `test.html` + `plays.mjs` (automatischer Durchlauf aller Fälle), `seal.mjs` (Lösungen hashen), `lines.mjs` + `voices.py` (Stimmen erzeugen), `portraits/` (Fotos zu Kacheln mit Blinzeln und Mund packen) |

## Sprachen (Deutsch / English)

Oben rechts auf der Startseite schaltet **DE | EN** um (gemerkt in `localStorage`, Vorgabe: Browsersprache). Die Sprache gehört zum Raum: Englische Räume heißen `#en/<fall>/<raum>`, deutsche wie bisher `#<fall>/<raum>`. Beide Fassungen sind getrennte Anrufräume, so landen nie Leute mit verschiedenen Texten im selben Anruf.

| Datei | Inhalt |
|---|---|
| `i18n.mjs` | Sprachwahl, Wörterbuch der Oberfläche (`t('schlüssel')`), statische Texte per `data-t`/`data-th`/`data-tp`/`data-ta`/`data-tt` in `index.html` |
| `cases/<fall>/story.en.mjs` | Englische Fassung des Falls (gleiche Schritte, Rätsel-IDs und Skriptlänge, andere Namen, Texte und Lösungen) |
| `cases/<fall>/audio-en/` | Englische Sprachaufnahmen + `manifest.json` (+ optional `mouth-cues.json`) |
| `cases/index.mjs` | pro Fall `loadEn` und `en: {file, title, tagline, players, duration}` |

Werkzeuge mit Umgebungsvariable `FALL_LANG=en`: `node fall/tools/lines.mjs > /tmp/jobs.json`, `python fall/tools/voices.py /tmp/jobs.json`, `python fall/tools/mouth_cues.py`. `node fall/tools/seal.mjs` versiegelt auch `story.en.mjs`. Ohne `mouth-cues.json` bewegt sich der Mund nach der Lautstärke. `tools/test.html?lang=en` spielt nur die englischen Durchläufe (`PLAYS_EN` in `plays.mjs`).

Beim Übersetzen eines Falls müssen Rätsel, deren Lösung vom Wortlaut abhängt (Chiffren, Morse, Wortlösungen), neu gebaut werden. Beispiel: „Libelle“ → „dragonfly“ mit Verschiebung 9, „Falter“ → „CANDLE“ als Einmalschlüssel.

## Spielmechaniken (Schritte im Skript)

| Schritt | Wirkung |
|---|---|
| `['chapter', n, titel]` · `['goal', text]` | Kapitelkarte, Ziel-Leiste oben (alte Ziele landen unter „Bisher geschafft“) |
| `['join', npc, fx?]` · `['leave', npc, fx?]` | Figur kommt in den Anruf / geht |
| `['say', npc, text]` | Figur spricht (Aufnahme oder lokale Sprachausgabe, immer mit Untertitel) |
| `['call', npc, {note, timeout}]` | Eingehender Anruf, jemand muss annehmen (sonst klingelt es erneut) |
| `['knock', npc]` | Anklopfen, jemand muss reinlassen |
| `['quiet', 'mic'/'cam'/'both'/'camOn'/'covered', npc, text, warn]` | Figur spricht nur, wenn alle Mikros/Kameras aus (bzw. an) sind; `covered` = Kamera an, aber mit der Hand zugehalten (Helligkeit wird lokal gemessen) |
| `['chat', npc, text, {to: rolle}]` | Nachricht im Chat, wahlweise nur für eine Rolle |
| `['unlock', seite]` | Seite in die Akte (mit `role` nur für eine Rolle) |
| `['solve', rätsel, {npc, taunts, every, onFail}]` | Rätsel öffnen und warten; Sticheleien; bei abgelaufenem Timer Sprung |
| `['ask', npc, {prompt, options}]` | Verhör/Gespräch: Team wählt Fragen. Optionen: `say`, `needs`, `set`, `wrong`, `end`, `unlock`, `tag` |
| `['hold', {label, ms}]` | Alle halten gleichzeitig einen Knopf |
| `['morse', npc, text, takt, rolle?]` | Lampe auf der Kachel blinkt Morsecode (bis `['morse', null]`), wahlweise nur für eine Rolle sichtbar. Takt mindestens 340 ms. Unter der Lampe schreibt ein Streifen · und – mit (mit Buchstaben- und Wortlücken), 🔈 schaltet einen Piepton dazu |
| `['signal', npc, 'RGBY…', {unit, role}]` | Lampe blinkt eine Farbfolge (R, G, B, Y, W, V), wahlweise nur für eine Rolle; der Streifen zeigt die bisherigen Farben als Kästchen |
| `['clap', {label, text, window}]` | Alle klatschen/rufen gleichzeitig (Lautstärke wird nur im eigenen Browser gemessen; ohne Mikro zählt man automatisch) |
| `['timer', ms, label]` | Countdown oben |
| `['dark', true]` | Licht aus, Taschenlampe folgt dem Zeiger |
| `['lockLeave', true]` | Auflegen klappt beim ersten Versuch nicht (`lockText`) |
| `['ambience', name]` | Atmosphäre-Schleife aus `audio/` |
| `['pose', npc, bild]` | Figur zeigt ein anderes Foto aus `portraits/` (z. B. dreht die Handykamera um), `null` = wieder das Gesicht |
| `['fx', art, arg]` | `glitch`, `flash`, `shake`, `static`, `ring`, `crash` (falscher Verbindungsabbruch), `mirror` (eigenes Kamerabild, bleibt lokal), `rename` (Kachelnamen), `toast` |
| `['fragment', symbol, wert]` | Sammelstück oben in der Ziel-Leiste |
| `['set', flag, wert]` · `['label', x]` · `['goto', x]` · `['branch', s => …, x]` | Verzweigungen |
| `['vote', {id, prompt, options}]` · `['ending', id oder s => id]` | Abstimmung, Ende |

Rätsel: `{q, ph, hash, near, hints, input, by}`. `input`: Text (Standard), `digits` (Tastenfeld), `switches` (mit `n`: Kippschalter, Lösung als 0/1-Folge), `colors` (mit `colors: [[name, farbe]]`: Farbtasten, Lösung als Namen mit Leerzeichen), `clock` (Zeiger stellen, Lösung als „4:10“). `by: rolle` = nur diese Rolle kann eingeben.

Seiten können außerdem enthalten: `<div data-tape="clip" data-spectrum></div>` (Tonband mit Frequenzanzeige, z. B. für Wähltöne: Clip mit `dtmf: '0712289'`), `<div data-tuner="clip" data-target="156.625" data-min data-max></div>` (Funkempfänger: Stimme taucht aus dem Rauschen auf), `<div data-cipher="GEHEIMTEXT"></div>` (Chiffrierscheibe), `<div data-photo="id"></div>` (Beweisfoto aus `photos`, mit Zoom und Verschieben; ein SVG, das auch ein Foto aus `portraits/` per `<image>` einbinden und Schilder darüberlegen kann), `<div data-face="id"></div>` (Profilbild aus `faces`, z. B. zum Vergleichen), `<div data-shred="id"></div>` (Aktenvernichter-Streifen aus `shreds` zum Sortieren), `<div data-morsetable></div>` (Morsetafel nach Zeichenzahl sortiert, mit Mitschreib-Decoder).

Seiten können enthalten: `<div class="uv">…<div class="ink">verborgen</div></div>` (UV-Lampe), `<div data-tape="clip"></div>` (Tonband mit Tempo und rückwärts), `<div data-widget="name"></div>` (Live-Anzeige aus `widgets` des Falls).

Gemeinsam ansehen: Jede Seite der eigenen Akte lässt sich mit „📌 Auf den Arbeitstisch legen“ für alle sichtbar machen (eigene Kachel „Arbeitstisch“ mit den Karten, wieder wegnehmen geht auch). Am Computer kann man außerdem den Bildschirm teilen; der erscheint bei den anderen als breite Kachel.

Solo-Fälle: `solo: true` im Fall und in `cases/index.mjs`. Es gibt nur eine Rolle, die Lobby startet mit „Anruf annehmen“. Beispiele: `cases/erbe`, `cases/nachtprogramm` (schwer).

Hilfen für Spielende: geteilte Notizen, Protokoll aller Sätze (mit ▶ nochmal hören), Hinweise in drei Stufen, „fast richtig“-Rückmeldungen (`near`), Pause mit Speicherstand (Fortsetzen über denselben Link), Kurzanleitung.

## Neuen Fall bauen

1. Ordner `cases/<id>/` mit `story.mjs` anlegen (Vorlage: einer der bestehenden Fälle), in `cases/index.mjs` eintragen.
2. Lösungen als `'@@klartext'` schreiben, dann `node fall/tools/seal.mjs` (ersetzt sie durch Hashes).
3. Stimmen erzeugen:
   ```sh
   python3 -m venv .venv && .venv/bin/pip install piper-tts
   # Stimmen nach ~/.cache/piper laden (siehe CREDITS.md), espeak-ng-data dorthin verlinken, wenn der venv-Pfad lang ist
   node fall/tools/lines.mjs > /tmp/jobs.json
   .venv/bin/python fall/tools/voices.py /tmp/jobs.json
   ```
   Ohne Aufnahmen läuft der Fall trotzdem: Dann spricht die lokale Sprachausgabe des Browsers.

Figuren ansehen: `fall/tools/gallery.html` zeigt alle Profilbilder (`?big`, `?only=id1,id2`).

Neue Fotos für Figuren: 16:9-Bild der Person plus ein bearbeitetes Bild mit geschlossenen Augen und offenem Mund (gleiche Pose). Dann `fall/tools/portraits/landmarks.swift` (Gesichtspunkte, lokal mit Apple Vision) und `pack.py` laufen lassen, siehe Kopf von `pack.py`. In der Figur `face: {photo: 'id'}` setzen.

Automatischer Durchlauf: `http://localhost:8080/fall/tools/test.html` spielt jeden Fall und jeden Ausgang im Testtempo durch (`?only=erbe` für einen Fall, `?auto` startet sofort). Die Durchläufe stehen in `tools/plays.mjs` (Achtung: alle Lösungen im Klartext). Neuer Fall oder neuer Ausgang: dort eintragen.

Von Hand testen: `http://localhost:8080/fall/?nomedia&fast` in zwei Tabs (`nomedia` ohne Kamera/Mikro, `fast` verkürzt Wartezeiten, `relay=ws://…` nutzt einen eigenen Nostr-Relay, `debug` macht `G` in der Konsole verfügbar, `G.jump(schritt)` springt).

Nach Änderungen an Sprachaufnahmen erzeugt `python3 fall/tools/mouth_cues.py [fall-id]` die Lippen-Zeitmarken neu (ffmpeg und Rhubarb Lip Sync im PATH). `--rhubarb` nimmt einen expliziten Programmpfad an.
