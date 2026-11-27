# Akte 0 — Exit-Games im Videoanruf (`/fall`)

Mehrere Fälle zum gemeinsamen Lösen im Videoanruf, auf Basis von anruf.org (gleiches Signaling über `../config.mjs`, eigene Räume `fall/<fall>/<name>`). Link-Format: `anruf.org/fall/#<fall>/<raum>`.

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite (Fallauswahl, Codename, Fortsetzen, Epilog-Codes) und Anruf-Oberfläche |
| `app.mjs` | Anruf + Spiel-Engine (Host arbeitet das Skript ab, schickt den ganzen Spielstand an alle) |
| `portrait.mjs` | Gezeichnete Profilbilder der Figuren (SVG, blinzeln, Mund folgt der Stimme) |
| `lib.mjs` | Gemeinsame Helfer (Audio-Schlüssel, Codenamen, Normalisierung, Hash) |
| `cases/index.mjs` | Liste der Fälle |
| `cases/<fall>/story.mjs` | Ein Fall: Figuren, Akten, Rätsel, Enden, Skript |
| `cases/<fall>/audio/` | Sprachaufnahmen + `manifest.json` (Schlüssel → Datei, Dauer) |
| `audio/` | Atmosphäre-Schleifen |
| `tools/` | `seal.mjs` (Lösungen hashen), `lines.mjs` + `voices.py` (Stimmen erzeugen) |

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
| `['morse', npc, text, takt, rolle?]` | Lampe auf der Kachel blinkt Morsecode (bis `['morse', null]`), wahlweise nur für eine Rolle sichtbar |
| `['signal', npc, 'RGBY…', {unit, role}]` | Lampe blinkt eine Farbfolge (R, G, B, Y, W, V), wahlweise nur für eine Rolle |
| `['clap', {label, text, window}]` | Alle klatschen/rufen gleichzeitig (Lautstärke wird nur im eigenen Browser gemessen; ohne Mikro zählt man automatisch) |
| `['timer', ms, label]` | Countdown oben |
| `['dark', true]` | Licht aus, Taschenlampe folgt dem Zeiger |
| `['lockLeave', true]` | Auflegen klappt beim ersten Versuch nicht (`lockText`) |
| `['ambience', name]` | Atmosphäre-Schleife aus `audio/` |
| `['fx', art, arg]` | `glitch`, `flash`, `shake`, `static`, `ring`, `crash` (falscher Verbindungsabbruch), `mirror` (eigenes Kamerabild, bleibt lokal), `rename` (Kachelnamen), `toast` |
| `['fragment', symbol, wert]` | Sammelstück oben in der Ziel-Leiste |
| `['set', flag, wert]` · `['label', x]` · `['goto', x]` · `['branch', s => …, x]` | Verzweigungen |
| `['vote', {id, prompt, options}]` · `['ending', id oder s => id]` | Abstimmung, Ende |

Rätsel: `{q, ph, hash, near, hints, input, by}`. `input`: Text (Standard), `digits` (Tastenfeld), `switches` (mit `n`: Kippschalter, Lösung als 0/1-Folge), `colors` (mit `colors: [[name, farbe]]`: Farbtasten, Lösung als Namen mit Leerzeichen). `by: rolle` = nur diese Rolle kann eingeben.

Seiten können außerdem enthalten: `<div data-tape="clip" data-spectrum></div>` (Tonband mit Frequenzanzeige, z. B. für Wähltöne: Clip mit `dtmf: '0712289'`), `<div data-tuner="clip" data-target="156.625" data-min data-max></div>` (Funkempfänger: Stimme taucht aus dem Rauschen auf), `<div data-cipher="GEHEIMTEXT"></div>` (Chiffrierscheibe), `<div data-photo="id"></div>` (Beweisfoto aus `photos`, mit Zoom und Verschieben), `<div data-face="id"></div>` (Profilbild aus `faces`, z. B. zum Vergleichen), `<div data-shred="id"></div>` (Aktenvernichter-Streifen aus `shreds` zum Sortieren).

Seiten können enthalten: `<div class="uv">…<div class="ink">verborgen</div></div>` (UV-Lampe), `<div data-tape="clip"></div>` (Tonband mit Tempo und rückwärts), `<div data-widget="name"></div>` (Live-Anzeige aus `widgets` des Falls).

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

Testen: `http://localhost:8080/fall/?nomedia&fast` in zwei Tabs (`nomedia` ohne Kamera/Mikro, `fast` verkürzt Wartezeiten, `debug` macht `G` in der Konsole verfügbar, `G.jump(schritt)` springt).
