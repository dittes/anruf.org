# Credits

## Stimmen

Die Sprachaufnahmen in `cases/*/audio/` sind mit [Piper](https://github.com/OHF-Voice/piper1-gpl) lokal erzeugt und mit ffmpeg nachbearbeitet (Telefon, Funk, Flüstern …). Piper selbst ist nur Werkzeug und nicht Teil der Seite.

| Stimme | Figuren | Datensatz | Lizenz |
|---|---|---|---|
| de_DE-thorsten-high | Sommer, Teilnehmer 9, Viktor, Jannik, Mehmet Aydın | [Thorsten-Voice](https://github.com/thorstenMueller/Thorsten-Voice) von Thorsten Müller | CC0 |
| de_DE-thorsten_emotional-medium | Möwe, Bernd Ahrens, Tom, Ole Jessen, V. L., Dr. Hensel | [Thorsten-Voice](https://github.com/thorstenMueller/Thorsten-Voice) (emotional) | CC0 |
| de_DE-kerstin-low | Lena Brandt, Kai Winter, Anrufbeantworter Notariat | [dataset-voice-kerstin](https://github.com/rhasspy/dataset-voice-kerstin) | CC0 |
| de_DE-eva_k-x_low | Marit Olsen, LUNA, Gisela Pohl, Irmas Kassette | [M-AILABS Speech Dataset](https://www.caito.de/2019/01/03/the-m-ailabs-speech-dataset/) | siehe Datensatz (Nennung) |

Stimmmodelle: [rhasspy/piper-voices](https://huggingface.co/rhasspy/piper-voices).

## Geräusche und Bilder

- Atmosphäre (`audio/*.m4a`: Brummen, Wind, Sturm, Funkrauschen, Wartemusik) ist mit ffmpeg synthetisch erzeugt, ohne fremde Aufnahmen.
- Effekte im Spiel (Klingeln, Klopfen, Glitch) erzeugt der Browser per Web Audio.
- Die fiktionalen Videocall-Porträts und Mimikvarianten in `portraits/` wurden mit OpenAI ImageGen erstellt. Der Browser setzt sie aus lokalen WebP-Bildern zusammen. Das gilt auch für die Figuren und Räume in „Das Haus am Wehr“ (Haus, Stube, Keller, Dachboden); die lesbaren Schilder auf den Fotos legt das Spiel als Text darüber. Die gezeichneten Beweisfotos stammen aus den Falldateien.
- Wähltöne (DTMF) erzeugt `tools/voices.py` als reine Sinustöne.

Alle Personen, Firmen, Orte und Behörden in den Fällen sind frei erfunden.
