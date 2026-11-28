# Credits

## Stimmen

Für die deutsche und englische Besetzung der sechs Fälle wurden mit Qwen3-TTS VoiceDesign fiktive Stimmen entworfen. Qwen3-TTS Base spricht die Dialoge und die vertonten Beweise beider Sprachfassungen mit denselben Figurenreferenzen. Die Aufnahmen wurden lokal mit MLX Audio erzeugt und mit ffmpeg für Videoanruf, Telefon, Funk und Band gemischt. Die fertigen Audiodateien liegen in `cases/*/audio/` und `cases/*/audio-en/`. [Qwen3-TTS](https://github.com/QwenLM/Qwen3-TTS) · [MLX Audio](https://github.com/Blaizzy/mlx-audio)

### Frühere Piper-Besetzung und lokales Werkzeug

`tools/voices.py` kann weiterhin Aufnahmen mit [Piper](https://github.com/OHF-Voice/piper1-gpl) erzeugen. Für die frühere deutsche Besetzung wurden folgende Modelle verwendet.

| Stimme | Figuren | Datensatz | Lizenz |
|---|---|---|---|
| de_DE-thorsten-high | Sommer, Teilnehmer 9, Viktor, Jannik, Mehmet Aydın, Ben Okafor, Monsieur Blanc | [Thorsten-Voice](https://github.com/thorstenMueller/Thorsten-Voice) von Thorsten Müller | CC0 |
| de_DE-thorsten_emotional-medium | Möwe, Bernd Ahrens, Tom, Ole Jessen, V. L., Dr. Hensel, Dieter Krause, Horst Wendt | [Thorsten-Voice](https://github.com/thorstenMueller/Thorsten-Voice) (emotional) | CC0 |
| de_DE-kerstin-low | Lena Brandt, Kai Winter, Anrufbeantworter Notariat, Jule Hart, Bieterin 3 | [dataset-voice-kerstin](https://github.com/rhasspy/dataset-voice-kerstin) | CC0 |
| de_DE-eva_k-x_low | Marit Olsen, LUNA, Gisela Pohl, Irmas Kassette, Kranich, Dr. Roth | [M-AILABS Speech Dataset](https://www.caito.de/2019/01/03/the-m-ailabs-speech-dataset/) | siehe Datensatz (Nennung) |

Stimmmodelle: [rhasspy/piper-voices](https://huggingface.co/rhasspy/piper-voices).

### Frühere englische Piper-Besetzung

Modelle der früheren englischen Fassung (`FALL_LANG=en`):

| Stimme | Datensatz | Lizenz |
|---|---|---|
| en_US-joe-medium | [OHF-Voice/voice-datasets](https://github.com/OHF-Voice/voice-datasets) | CC0 |
| en_US-kristin-medium, en_US-norman-medium, en_US-bryce-medium | LibriVox-Aufnahmen, Datensätze von Piper-Mitwirkenden | Public Domain |
| en_GB-cori-high | LibriVox-Aufnahmen | Public Domain |
| en_GB-alba-medium | Alba (Scottish English) | CC BY 4.0 |
| en_GB-northern_english_male-medium | Northern English Male | CC BY-SA 4.0 |

Modelle: [rhasspy/piper-voices](https://huggingface.co/rhasspy/piper-voices).

## Geräusche und Bilder

- Atmosphäre (`audio/*.m4a`: Brummen, Wind, Sturm, Funkrauschen, Wartemusik) ist mit ffmpeg synthetisch erzeugt, ohne fremde Aufnahmen.
- Effekte im Spiel (Klingeln, Klopfen, Glitch) erzeugt der Browser per Web Audio.
- Die fiktionalen Videocall-Porträts und Mimikvarianten in `portraits/` wurden mit OpenAI ImageGen erstellt. Der Browser setzt sie aus lokalen WebP-Bildern zusammen. Das gilt auch für die Figuren und Räume in „Das Haus am Wehr“ (Haus, Stube, Keller, Dachboden) „Nachtprogramm“ (Sendemast) und „Zuschlag“ (das erfundene Gemälde „Die Briefleserin“ und seine Fälschung); die lesbaren Schilder auf den Fotos legt das Spiel als Text darüber. Die gezeichneten Beweisfotos stammen aus den Falldateien.
- Die Zeitmarken in `mouth-cues.json` wurden mit [Rhubarb Lip Sync](https://github.com/DanielSWolf/rhubarb-lip-sync) aus den fertigen Tonspuren erzeugt.
- Wähltöne (DTMF) erzeugt `tools/voices.py` als reine Sinustöne.

Alle Personen, Firmen, Orte und Behörden in den Fällen sind frei erfunden.
