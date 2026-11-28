// Fall „Nachtprogramm“ (allein, schwer). Radio Hafenwelle, Kranich und alle Personen sind frei erfunden.
// Rätselkette: Morse am Sendemast → Schlüsselblatt → Zahlengruppen (Einmalschlüssel) → FALTER → Vigenère → SENDERCHEF.

const img = id => `<svg viewBox="0 0 960 540" xmlns="http://www.w3.org/2000/svg"><image href="portraits/${id}.webp" width="960" height="540"/></svg>`

// Schlüsselblätter aus Wendts Mappe (Blatt 7 ist das richtige)
const BLAETTER = ['730158264490', '115902736648', '906341287750', '258830619427', '641175098326', '397264150083', '482719503361', '019486327715', '563027841962']

export default {
  id: 'nachtprogramm',
  title: 'Nachtprogramm',
  unit: 'Radio Hafenwelle · Regie',
  file: 'Sendeprotokoll 0-NP-0300',
  accent: '#ff5d73',
  chapters: 5,
  solo: true,
  lobby: 'Du sitzt nachts allein in der Regie von Radio Hafenwelle. Um drei Uhr übernimmt eine fremde Stimme eure Frequenz und liest Zahlen vor. Ein schwerer Fall für dich allein, etwa 60 bis 90 Minuten. Papier und Stift helfen. Kopfhörer auch.',
  invite: 'Ich sitze nachts in einer Radioregie und eine fremde Stimme liest Zahlen auf unserer Frequenz. Hörst du mit?',
  lockText: 'Jule: Du kannst jetzt nicht gehen. Wir sind auf Sendung.',
  roles: {
    regie: {name: 'Regie', blurb: 'Alle Unterlagen, alle Entscheidungen.'}
  },
  share: {
    text: 'Heute Nacht, {time}, auf 97,4: Achtung, Kranich. Ich habe mitgeschrieben.',
    tag: '#Nachtprogramm',
    rows: ['4428 2170 3879', 'BLATT SIEBEN', 'NACHTFALTER'],
    lines: ['Manche Sender schweigen 35 Jahre.', 'Dann schalten sie sich wieder ein.']
  },

  npcs: {
    jule: {name: 'Jule Hart', sub: 'Studio 1 · ON AIR', tts: {pitch: .95, rate: 1},
      voice: {model: 'kerstin', fx: 'video', len: 1.0},
      face: {photo: 'jule', skin: '#e3b89c', fem: true, hair: {style: 'long', color: '#1e1a1a'}, extras: ['earring'], top: {style: 'turtleneck', color: '#141414'}, extrasColor: '#ccc', mood: 'neutral', scene: 'radio'}},
    kranich: {helps: false, name: 'Kranich', sub: 'Fremdeinspeisung · 97,4 MHz', look: 'void glitchy', tts: {pitch: .6, rate: .8},
      voice: {model: 'eva_k', pitch: -1, fx: 'radio', len: 1.12},
      face: {photo: 'kranich', silhouette: true, glow: '#ff5d73', hair: {style: 'short'}, scene: 'void'}},
    krause: {helps: false, name: 'Dieter Krause', sub: 'Senderchef · privat', tts: {pitch: .8, rate: 1.05},
      voice: {model: 'thorsten_emotional', speaker: 1, pitch: -2, fx: 'phone', len: 1.0},
      face: {photo: 'krause', skin: '#e0ae92', age: 2, hair: {style: 'short', color: '#a8a39c'}, glasses: 'square', top: {style: 'coat', color: '#1f2a44'}, mood: 'stern', scene: 'office'}},
    ben: {name: 'Ben Okafor', sub: 'Sendetechnik · Mast Süllberg', tts: {pitch: 1, rate: 1.08},
      voice: {model: 'thorsten-high', pitch: 1.5, fx: 'phone', len: .98},
      face: {photo: 'ben', skin: '#6b4330', hair: {style: 'curly', color: '#111'}, top: {style: 'jacket', color: '#ff7a1a'}, mood: 'worried', scene: 'storm'}},
    wendt: {name: 'Horst Wendt', sub: 'Hörertelefon', tts: {pitch: .75, rate: .9},
      voice: {model: 'thorsten_emotional', speaker: 5, pitch: -3, fx: 'call', len: 1.06},
      face: {photo: 'wendt', skin: '#e6c0a8', age: 2, hair: {style: 'slick', color: '#e8e6e2'}, top: {style: 'sweater', color: '#5a5a54'}, mood: 'smile', scene: 'radio'}}
  },

  photos: {
    mast: img('mast')
  },

  clips: {
    gruppen: {title: 'Mitschnitt 03:00 · 97,4 MHz · „Kranich“', npc: 'kranich',
      voice: {model: 'eva_k', pitch: -1, fx: 'radio', len: 1.12},
      text: 'Achtung. Kranich ruft Nachtfalter. Achtung. Kranich ruft Nachtfalter. Drei Gruppen. Vier. Vier. Zwo. Acht. Pause. Zwo. Eins. Sieben. Null. Pause. Drei. Acht. Sieben. Neun. Wiederhole. Vier. Vier. Zwo. Acht. Zwo. Eins. Sieben. Null. Drei. Acht. Sieben. Neun. Ende.'},
    fernwahl: {title: 'Fernwirk-Modem Mast Süllberg · Einwahl 02:57', dtmf: '04215573'},
    buchstaben: {title: 'Kranich auf neuer Frequenz', npc: 'kranich',
      voice: {model: 'eva_k', pitch: -1, fx: 'radio', len: 1.12},
      text: 'Kranich. Zweite Nachricht. Buchstaben. Xanthippe. Emil. Ypsilon. Wilhelm. Ida. Ida. Heinrich. Heinrich. Paula. Ypsilon. Schlüssel ist die erste Nachricht. Ende.'}
  },

  pages: {
    sendeplan: {title: 'Sendeplan', role: null, html: `
      <div class="paper">
        <p class="stamp">Radio Hafenwelle 97,4 · Nacht</p>
        <p>00:00–04:00 <b>Nachtfalter</b> · Hörertelefon mit Jule Hart (live)</p>
        <p>Regie: du · Sendetechnik in Bereitschaft: Ben Okafor</p>
        <p>Senderchef: Dieter Krause (nur im Notfall anrufen!)</p>
      </div>`},
    mast: {title: 'Mastkamera', role: null, html: `
      <p class="stamp">Ben · Handykamera · Mast Süllberg</p>
      <p>Die rote Flugbefeuerung oben am Mast sollte ruhig leuchten. Sie tut es nicht. Bens Kachel zeigt sie live, darunter schreibt der Streifen mit.</p>
      <div data-photo="mast"></div>
      <p class="note">Morsezeichen nachschlagen: Seite „Morsetafel“.</p>`},
    morsetafel: {title: 'Morsetafel', role: null, html: `
      <p class="stamp">Sendetechnik · Aushang am Mast</p>
      <p>Kurz = · (ein Takt), lang = – (drei Takte). Kurze Pause zwischen Buchstaben, lange zwischen Wörtern.</p>
      <div data-morsetable></div>`},
    mappe: {title: 'Wendts Mappe', role: null, html: `
      <p class="stamp">Per Mail vom Hörertelefon · „Abschrift, alles aus dem Gedächtnis“</p>
      <p>Wendt hat 1989 bei der Funkaufklärung mitgeschrieben. Er sagt, das hier sind die Schlüsselblätter von Kranich. Er sagt nicht, warum er sie noch hat.</p>
      <table><thead><tr><th>Blatt</th><th>Schlüssel</th></tr></thead><tbody>
      ${BLAETTER.map((b, i) => `<tr><td>${i + 1}</td><td class="mono">${b.match(/..../g).join(' ')}</td></tr>`).join('')}
      </tbody></table>
      <div class="paper">
        <p class="stamp">Kranich · Verfahren</p>
        <p>1. Zahlengruppen mitschreiben.</p>
        <p>2. Schlüssel des Blatts darunter schreiben. Jede Ziffer: <b>Nachricht minus Schlüssel</b>. Wird es negativ, zehn dazu (7 − 9 → 8). Kein Übertrag.</p>
        <p>3. Je zwei Ziffern ergeben einen Buchstaben: 01 = A, 02 = B … 26 = Z.</p>
      </div>`},
    mitschnitt: {title: 'Mitschnitt 03:00', role: null, html: `
      <p class="stamp">Regie · automatische Aufzeichnung</p>
      <p>Die fremde Stimme, wie sie über euren Sender ging. Langsamer abspielen hilft beim Mitschreiben.</p>
      <div data-tape="gruppen"></div>`},
    modem: {title: 'Fernwirk-Modem', role: null, html: `
      <p class="stamp">Ben · Logbuch der Maststeuerung</p>
      <p>Um 02:57 hat sich jemand per Telefon in die Maststeuerung eingewählt. Das Modem hat die Tastentöne aufgezeichnet: acht Tasten, die Rufnummer des Anrufers.</p>
      <div data-tape="fernwahl" data-spectrum></div>
      <table><thead><tr><th></th><th>1209 Hz</th><th>1336 Hz</th><th>1477 Hz</th></tr></thead><tbody>
      <tr><td>697 Hz</td><td>1</td><td>2</td><td>3</td></tr>
      <tr><td>770 Hz</td><td>4</td><td>5</td><td>6</td></tr>
      <tr><td>852 Hz</td><td>7</td><td>8</td><td>9</td></tr>
      <tr><td>941 Hz</td><td>✱</td><td>0</td><td>#</td></tr>
      </tbody></table>
      <p class="note">Jede Taste = ein tiefer + ein hoher Ton. Normales Tempo, sonst verschieben sich die Töne.</p>`},
    empfaenger: {title: 'Suchempfänger', role: null, html: `
      <p class="stamp">Regie · Kontrollempfänger UKW</p>
      <p>Kranich hat die Frequenz gewechselt. Irgendwo zwischen 87,5 und 108 MHz. Dreh, bis die Stimme klar ist.</p>
      <div data-tuner="buchstaben" data-target="101.7" data-min="87.5" data-max="108"></div>`},
    tafel: {title: 'Buchstabentafel', role: null, html: `
      <p class="stamp">Kranich · zweites Verfahren (aus Wendts Mappe)</p>
      <p>Buchstaben werden mit einem Schlüsselwort verschoben, das sich wiederholt. Zum Entschlüsseln: Zeile des Schlüsselbuchstabens suchen, darin den Geheimbuchstaben finden, oben ablesen.</p>
      <p>Kürzer gerechnet: <b>Klartext = Geheim minus Schlüssel</b> (A = 0, B = 1 … Z = 25; negativ: 26 dazu).</p>
      <div class="vig">${(() => { const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        return `<table class="vigtab"><thead><tr><th></th>${[...A].map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${
          [...A].map((r, i) => `<tr><th>${r}</th>${[...A].map((_, j) => `<td>${A[(i + j) % 26]}</td>`).join('')}</tr>`).join('')}</tbody></table>` })()}</div>`},
    festschrift: {title: 'Festschrift 30 Jahre', role: null, html: `
      <div class="paper">
        <p class="stamp">Radio Hafenwelle · 30 Jahre · Seite 4</p>
        <p><b>Dieter Krause, Senderchef seit 1991</b></p>
        <p>Geboren 1964 in Rostock. Nach der Lehre Funker im Seefunkdienst Warnemünde, bis zur Wende. „Ich war immer nachts wach. Die Kollegen nannten mich nur den Nachtschwärmer.“</p>
        <p>1991 Gründung von Radio Hafenwelle. Erste Sendung: das Nachtprogramm. Den Namen der Sendung hat er selbst ausgesucht.</p>
      </div>`},
    schalttafel: {title: 'Schalttafel Mast', role: null, html: `
      <div class="paper">
        <p class="stamp">Sendetechnik · Notbetrieb · Mast Süllberg</p>
        <p>1 Flugbefeuerung · 2 Hauptsender · 3 Reservesender · 4 Antenne Nord · 5 Antenne Süd · 6 Kühlung · 7 Fremdeinspeisung · 8 Notstrom</p>
        <p>a) Die Flugbefeuerung bleibt immer an (Luftfahrtrecht).</p>
        <p>b) Die Fremdeinspeisung muss aus. Darüber sendet Kranich.</p>
        <p>c) Genau ein Sender läuft: Haupt- oder Reservesender.</p>
        <p>d) Der Hauptsender strahlt nur über Antenne Nord ab, der Reservesender nur über Antenne Süd. Die jeweils andere Antenne bleibt aus.</p>
        <p>e) Kühlung genau dann an, wenn ein Sender läuft.</p>
        <p>f) Der Reservesender hat kein eigenes Netzteil und braucht Notstrom. Der Hauptsender verträgt keinen Notstrom.</p>
      </div>
      <p class="note">Ben: „Antenne Nord hat der Sturm verbogen. Die kriegt heute keinen Strom mehr.“</p>`}
  },

  puzzles: {
    blatt: {
      q: 'Was blinkt die Flugbefeuerung am Mast?', ph: 'Wort(e)',
      hash: ['da87dbea6c78838395ae407dcb0ef300184680d30b8805d962cb869d68be9fbb', '7ffae4208eafbcfbf9558760469df5a32448f17b0c7bc50a9cef561cf810602c', '607f183ffca46a249796cb0bde89c0cace6cd441da6c83416714fdbbd81221c7', '2ab03db4aa61f435047f2b1a2cfcc4db0444d7cb51806b551b36fd2e88a10cda'],
      near: {'48f126ef99c254ca458a3667a7babdb6c6c5b6afadd6cedc4191a76e78530bf9': 'Richtig, und welches Blatt? Es kommt noch ein Wort.', 'eff58d278def4e16841067beab7e8ddce865d0c0d243e9c2733a7be341c094b0': 'Fast. Zählt die Buchstaben noch einmal.'},
      hints: ['Die Lampe sendet zwei Wörter. Achtet auf die lange Pause zwischen den Wörtern und die sehr lange vor dem Neubeginn.', 'Mit der Morsetafel mitschreiben: · und – antippen, „Buchstabe ✓“ drücken. Das erste Wort fängt mit B an.', 'BLATT SIEBEN.']
    },
    gruppen: {
      q: 'Kranich ruft Nachtfalter. Wie lautet die erste Nachricht im Klartext?', ph: 'Wort',
      hash: ['122d95b3183572f6ab45858aaeaa3531b7139b2a11a53a8e08d2c0606a7eb097'],
      near: {'0346cfe31218f8e7359d728eddc2a4aded65a1daca0ecbeaa26037c69609e861': 'Das sind die Zahlen, wie sie gesendet wurden. Jetzt den Schlüssel von Blatt 7 abziehen.', '985db5eb5f1ac594efdf326e6ace48beeaa68a7e580248a22817d8125bc4d79c': 'Fast! Jetzt je zwei Ziffern in einen Buchstaben umwandeln.', '298c63e5862d7d4e0c0335f5c28f4cb40a9ab49b5604918e1848589b8b398a8a': 'So ruft Kranich. Die Nachricht selbst ist kürzer.'},
      hints: ['Spielt den Mitschnitt in der Akte langsamer ab und schreibt die drei Vierergruppen auf. Den Schlüssel liefert Wendts Mappe, welches Blatt, wisst ihr vom Mast.', 'Gruppen 4428 2170 3879, Schlüssel Blatt 7. Ziffer für Ziffer abziehen, ohne Übertrag (4 − 8 → 14 − 8 = 6), dann je zwei Ziffern zu einem Buchstaben.', '06 01 12 20 05 18 = FALTER.']
    },
    fernwahl: {
      q: 'Wer hat sich in den Mast eingewählt? Die Rufnummer:', ph: 'Nummer', input: 'digits',
      hash: ['0900d34e7d5281f8dcc40ae40bed479f2f6440f43fb0796d79b6cbe01b827543'],
      near: {'7c1f9df441cb93c4c10c64e8056290dd583b9da3a22d8bd58d50f002efd9693e': 'Die erste Taste fehlt.', '47985817fc3228225ad16538b0419cf585875fd4cd15cafb668e4b579a440499': 'Es sind acht Tasten.'},
      hints: ['Spiel das Modem in normalem Tempo ab und lies unter dem Band beide Töne jeder Taste ab.', 'Tiefer Ton = Zeile, hoher Ton = Spalte. 941 + 1336 Hz ist die 0.', '0421 5573.']
    },
    klartext: {
      q: 'Kranichs zweite Nachricht im Klartext:', ph: 'Wort',
      hash: ['d8f0b88dee6089fb271669bc7d17f0f6471361eb3b462358c010f824d3fb3281', '69a0e046708fb76344fde5b3ac30e0ec7a0e0a280ea7ad1f307d4dc010ac15b8'],
      near: {'2e5a8bcb200931aa7b3535df3c46dc3cd27bc51a249cabf12f79420718a56e7e': 'Das ist noch verschlüsselt. Schlüssel ist die erste Nachricht.', '83b781cd65c8a4622dd51795e5125268d9e7414d7705cf4c4997a2f1f4759a54': 'Genau der. Aber die Nachricht nennt ihn anders.'},
      hints: ['Suchempfänger in der Akte: Dreht langsam, bis die Stimme klar ist, und schreibt die Buchstaben mit (Anton = A, Berta = B …).', 'Geheimtext X E Y W I I H H P Y, Schlüssel FALTER immer wiederholt. Geheim minus Schlüssel: X − F = S, E − A = E …', 'SENDERCHEF.']
    },
    schalter: {
      q: 'Schalttafel am Mast: Kranich abklemmen, eigenes Programm weitersenden.', input: 'switches', n: 8,
      labels: ['Licht', 'Haupt', 'Reserve', 'Nord', 'Süd', 'Kühlung', 'Fremd', 'Notstrom'],
      hash: ['83df09e0643b158d62c442db8bc2f26b11184ad65321e446358f4bc870a36681'],
      near: {'5a1452e59aa1b19beb9e252a3d827f50efa3c26d67d43f17f94bb6b0c4368ff4': 'So wäre es richtig, wenn Antenne Nord heil wäre. Ist sie aber nicht.', '9a56b3045fe8817185bf41b62c1bf0f1bd9645036778fc5c31d185ea47cbed9b': 'Der Reservesender hat kein eigenes Netzteil.', 'ed17103e836770a3f7c682d159f524de59dcdfff71517622f8e782763b7a09fa': 'Über die Fremdeinspeisung sendet Kranich weiter.', 'c01321ea53a4f7b63e2652d0377bdc03f124d1ad7502fef11a41dc7e1161c36d': 'Die Flugbefeuerung muss immer an sein.', '7ab78a35409ee2dabae8851d263d3824c858ca5faf2a7aadcb12282c81f182fb': 'Ohne Kühlung brennt der Sender durch.'},
      hints: ['Fangt mit dem Sicheren an: Licht an, Fremdeinspeisung aus. Antenne Nord ist kaputt, also aus.', 'Ohne Antenne Nord kein Hauptsender. Also Reservesender über Antenne Süd. Was braucht der noch?', 'An: Licht, Reserve, Süd, Kühlung, Notstrom. Aus: Haupt, Nord, Fremd.']
    },
    kranich: {
      q: 'Wer ist Kranich?', ph: 'Name',
      hash: ['22b7e6824e9b682683467da475be834dc63e94431b16e88b762a494be283f763', '3002d5e9973628b9a267bd0fbcb19847fda966d26a3bae1244a254b9c686b2d2', 'e4b5e0491e70c869173fb88e711192b374b2568621c2fb8d5ffa6e9bfda52bad'],
      near: {'83b781cd65c8a4622dd51795e5125268d9e7414d7705cf4c4997a2f1f4759a54': 'Krause ist Nachtfalter. Kranich ruft ihn.', 'e0a15cb0fc555c4e8ffea8afb0ebe38b4b1ac3c2e17ecad67e8596b5d6c850c2': 'Krause ist Nachtfalter. Kranich ruft ihn.', 'fed70c3b770b940e291e8cfddd398915c3d61a19e3b20ed74f0fa9fd70409c4d': 'Jule war 1989 vier Jahre alt.', '80d9c618ee94314d9e507690246b637d30ab0950c54616d02225d8a2f9ea40a5': 'Jule war 1989 vier Jahre alt.', 'c60ed8215a6582bd57aaee4ad4cb2cfcd66b26c6ad89d95870bf3a899f15e6e1': 'Ben war da noch nicht geboren.'},
      hints: ['Wer hat noch die Schlüsselblätter, die längst vernichtet sein müssten?', 'Wessen Telefon klingelte, als ihr die Nummer aus dem Modem gewählt habt? Und was steht in Wendts Zimmer hinter ihm?', 'Horst Wendt.']
    }
  },

  endings: {
    live: {title: 'Ausgang: LIVE', code: 'NP-LIVE',
      text: 'Krauses Geständnis läuft live über 97,4. Um 7 Uhr öffnet das Archiv, um 8 Uhr stehen die neun Namen im Netz, um 9 Uhr ist Krause zurückgetreten. Radio Hafenwelle sendet weiter. Mit dir in der Regie.',
      epilog: 'Ein Jahr später bekommt die Sendung einen neuen Namen. Jule darf ihn aussuchen. Sie nennt sie „Regie“. Weil da jemand saß, der zugehört hat.'},
    aus: {title: 'Ausgang: FUNKSTILLE', code: 'NP-AUS',
      text: 'Du ziehst den Regler runter. Stille auf 97,4. Krause bedankt sich, Jule sagt nichts mehr. Am Morgen öffnet das Archiv, aber niemand sucht nach einem Nachtschwärmer.',
      epilog: 'Krause schickt dir zu Weihnachten eine Flasche Wein. Auf der Karte steht: „Gute Regie ist, wenn man nichts hört.“ Du trinkst sie nicht.'},
    stoerung: {title: 'Ausgang: ABGESCHALTET', code: 'NP-STOERUNG',
      text: 'Die Bundesnetzagentur schaltet den Mast ab, bevor du die Schalttafel geschafft hast. Kranich verstummt, Radio Hafenwelle auch. Was Kranich noch sagen wollte, hört niemand mehr.',
      epilog: 'Monate später, nachts, ein Kurzwellenradio auf dem Flohmarkt. Du drehst am Knopf. Irgendwo zählt eine Stimme. Vier. Vier. Zwo. Acht.'},
    kranich: {title: 'Ausgang: KRANICH', code: 'NP-KRANICH',
      text: 'Horst Wendt nimmt die Hörgeräte heraus und lächelt. „Kranich. Fünfunddreißig Jahre nicht gesagt.“ Er hat 1989 die Nachrichten gesendet, die Krause verraten haben, und heute Nacht ein letztes Mal. Damit Krause es selbst sagt. Live.',
      epilog: 'Wendt schickt dir eine Postkarte ohne Text. Nur Zahlen: 4228 2361 38. Mit Blatt 7 ergibt das ein Wort. Du weißt schon, welches.'}
  },
  codes: {'cbe435051e87f63a2212712ce6b2cd43c410551cfe3edd46c01d02570eea3447': 'live', 'b828930416803c0136128ecc104803678900eb9085cb2fb4b04fcc8c33cdbce3': 'aus', '5aa11e3d77f5d1a42db1442ab72bcd33a89655d15a68fd3d3ef617b66733c527': 'stoerung', '994b01f9fabd307ddc5c3aca851628eacfd30d2b1309c6f6cd0f4a3ac021b6ac': 'kranich'},

  script: [
    // ---------- Kapitel 1 ----------
    ['chapter', 1, 'Drei Uhr'],
    ['ambience', 'hum'],
    ['goal', 'Nachtfalter läuft. Du bist in der Regie.'],
    ['unlock', 'sendeplan'],
    ['join', 'jule'],
    ['say', 'jule', 'Zwei Uhr achtundfünfzig, das ist der Nachtfalter auf Radio Hafenwelle. Gleich drei Uhr, gleich Nachrichten. Regie, {me}, hörst du mich?'],
    ['say', 'jule', 'Dein Mikro ist auf meinen Kopfhörer geschaltet. Und manchmal auch auf den Sender. Mach es lieber aus, solange ich moderiere.'],
    ['goal', 'Jule ist live auf Sendung: Mikro aus.'],
    ['quiet', 'mic', 'jule', 'Danke. Und jetzt, kurz vor drei: die Zeitansage.', 'Ich hör dich auf dem Sender! Mikro aus!'],
    ['fx', 'static'],
    ['ambience', 'radio'],
    ['join', 'kranich', 'glitch'],
    ['say', 'kranich', 'Achtung. Kranich ruft Nachtfalter. Achtung. Kranich ruft Nachtfalter.'],
    ['say', 'kranich', 'Drei Gruppen. Vier. Vier. Zwo. Acht. Zwo. Eins. Sieben. Null. Drei. Acht. Sieben. Neun.'],
    ['leave', 'kranich', 'glitch'],
    ['unlock', 'mitschnitt'],
    ['say', 'jule', 'Was war das? Das kam nicht von uns. Das lief über unseren Sender!'],
    ['goal', 'Jemand hat eure Frequenz übernommen. Wer weiß Bescheid?'],
    ['call', 'krause', {note: 'Senderchef · privat'}],
    ['say', 'krause', 'Krause hier. Ich höre gerade mein eigenes Programm im Bett, und da liest eine Frau Zahlen vor? Was ist bei euch los?'],
    ['say', 'krause', 'Wenn das noch einmal passiert, verlieren wir die Lizenz. Holt Okafor an den Mast. Sofort.'],
    ['call', 'ben', {note: 'Sendetechnik · Mast'}],
    ['say', 'ben', 'Ben hier, ich bin schon oben am Süllberg. Der Sender läuft normal. Aber die Flugbefeuerung spinnt. Ich dreh mal die Kamera um.'],
    ['pose', 'ben', 'mast'],
    ['unlock', 'mast'], ['unlock', 'morsetafel'],
    ['morse', 'ben', 'BLATT SIEBEN', 380],
    ['say', 'ben', 'Die rote Lampe sollte ruhig leuchten. Die blinkt aber. Das ist doch Morse, oder? Kannst du das lesen?'],
    ['goal', 'Lies das Signal der Flugbefeuerung. Morsetafel und Mitschreibstreifen helfen.'],
    ['solve', 'blatt', {npc: 'krause', every: 60000, taunts: ['Wer blinkt da an meinem Mast?', 'Ich will in zehn Minuten eine Erklärung.']}],
    ['morse', null],
    ['pose', 'ben', null],
    ['say', 'ben', 'Blatt sieben? Was soll das heißen?'],
    ['wait', 1200],

    // ---------- Kapitel 2 ----------
    ['chapter', 2, 'Hörertelefon'],
    ['say', 'jule', 'Das Hörertelefon klingelt. Um die Uhrzeit ruft nur einer an. Ich stell ihn zu dir durch.'],
    ['call', 'wendt', {note: 'Hörertelefon · Leitung 2'}],
    ['say', 'wendt', 'Wendt hier. Ich höre den Nachtfalter jede Nacht. Und gerade eben habe ich etwas gehört, das ich seit fünfunddreißig Jahren nicht gehört habe.'],
    ['say', 'wendt', 'Kranich. Ein Zahlensender aus dem Osten. Ich war damals bei der Funkaufklärung, ich habe jede Nacht mitgeschrieben.'],
    ['say', 'wendt', 'Ich habe noch eine Abschrift der Schlüsselblätter. Ich schicke sie Ihnen. Fragen Sie mich nicht, warum ich die noch habe.'],
    ['unlock', 'mappe'],
    ['goal', 'Entschlüssele die Zahlengruppen aus dem Mitschnitt mit dem richtigen Schlüsselblatt.'],
    ['solve', 'gruppen', {npc: 'wendt', every: 70000, taunts: ['Nachricht minus Schlüssel. Ziffer für Ziffer. Wir haben das damals mit Bleistift gemacht.', 'Lassen Sie sich Zeit. Kranich hat Zeit.']}],
    ['say', 'wendt', 'Falter. Kranich ruft Nachtfalter, und die Nachricht heißt Falter. Er meint jemanden, der weiß, dass er gemeint ist.'],
    ['say', 'krause', 'Nachtfalter? So heißt Jules Sendung! Jule, was hast du damit zu tun?'],
    ['goal', 'Krause verdächtigt Jule. Sprich mit ihr.'],
    ['ask', 'jule', {prompt: 'Jule schiebt den Regler runter, damit es keiner hört.', options: [
      {id: 'name', label: '„Warum heißt deine Sendung Nachtfalter?“', set: {name_krause: true},
        say: ['Den Namen gibt es seit neunzehnhunderteinundneunzig. Lange vor mir. Krause hat ihn ausgesucht. Er hat darauf bestanden.']},
      {id: 'kennt', label: '„Sagt dir Kranich etwas?“',
        say: ['Nein. Ich war neunzehnhundertneunundachtzig vier Jahre alt.']},
      {id: 'du', label: '„Bist du Nachtfalter?“', tag: 'accuse', wrong: true,
        say: ['Spinnst du? Ich war vier! Ich konnte nicht mal meinen Namen schreiben.']},
      {id: 'weiter', label: '„Okay. Machen wir weiter.“', needs: ['name_krause'], end: true,
        say: ['Und such in der Festschrift im Archivordner. Krause hat da viel über sich erzählt.']}
    ]}],
    ['unlock', 'festschrift'],
    ['say', 'ben', 'Ich hab was! Die Maststeuerung hat ein Fernwirk-Modem. Um zwei Uhr siebenundfünfzig hat sich da jemand per Telefon eingewählt. Die Tastentöne sind im Log.'],
    ['unlock', 'modem'],
    ['goal', 'Wer hat sich in die Maststeuerung eingewählt? Lies die Tastentöne.'],
    ['solve', 'fernwahl', {npc: 'ben', every: 60000, taunts: ['Acht Tasten. Ich hör sie auch, aber ich kann keine Töne lesen.', 'Die Tabelle steht unter dem Band.']}],
    ['say', 'ben', 'Null, vier, zwei, eins: Bremen. Ich ruf die Nummer mal an.'],
    ['fx', 'ring'],
    ['wait', 1800],
    ['fx', 'ring'],
    ['say', 'wendt', 'Oh, entschuldigen Sie. Mein anderes Telefon klingelt. Um diese Uhrzeit. Ich lasse es klingeln.'],
    ['wait', 1500],
    ['say', 'ben', 'Keiner geht ran. Aber es klingelt durch.'],
    ['set', 'klingeln', true],
    ['wait', 1200],

    // ---------- Kapitel 3 ----------
    ['chapter', 3, 'Frequenzwechsel'],
    ['fx', 'static'],
    ['say', 'ben', 'Er ist von unserem Sender runter! Kranich sendet jetzt woanders. Irgendwo auf UKW, mit eigenem Gerät.'],
    ['unlock', 'empfaenger'], ['unlock', 'tafel'],
    ['goal', 'Finde Kranich auf dem Suchempfänger und entschlüssele die zweite Nachricht.'],
    ['solve', 'klartext', {npc: 'krause', every: 70000, taunts: ['Ich zahle euch nicht fürs Rätselraten!', 'Macht den Sender aus. Einfach aus.']}],
    ['say', 'wendt', 'Senderchef. Kranich ruft also nicht Jule. Kranich ruft den Senderchef.'],
    ['say', 'krause', 'Unsinn! Völliger Unsinn. Okafor, schalten Sie den Mast ab. Ganz.'],
    ['say', 'ben', 'Das darf ich nicht. Wenn wir ohne Meldung abschalten, kommt die Bundesnetzagentur. Und die hat schon angerufen.'],
    ['wait', 1200],

    // ---------- Kapitel 4 ----------
    ['chapter', 4, 'Notbetrieb'],
    ['fx', 'flash'],
    ['dark', true],
    ['say', 'ben', 'Kranich ist wieder auf unserem Mast! Über die Fremdeinspeisung. Und der Sturm hat Antenne Nord verbogen. Ich muss auf Notbetrieb schalten, und du sagst mir, wie.'],
    ['say', 'ben', 'Die Netzagentur gibt uns acht Minuten. Dann schalten die uns ab.'],
    ['unlock', 'schalttafel'],
    ['timer', 480000, 'Netzagentur'],
    ['goal', 'Notbetrieb am Mast: Kranich abklemmen, aber weiter senden. Vor Ablauf der Frist.'],
    ['solve', 'schalter', {npc: 'ben', every: 50000, onFail: 'stoerung', taunts: ['Mir frieren die Finger ab, sag mir einfach, welche Schalter.', 'Antenne Nord ist hin, vergiss das nicht.']}],
    ['timer', null],
    ['say', 'ben', 'Gut. Halt mal den Freigabeknopf in deiner Regie gedrückt, sonst springt das Relais zurück.'],
    ['hold', {label: '⏻ Freigabe gedrückt halten', ms: 3000}],
    ['dark', false],
    ['say', 'ben', 'Läuft. Reservesender, Antenne Süd, Kranich ist raus. Wir senden wieder.'],
    ['goto', 'verhoer'],

    ['label', 'stoerung'],
    ['fx', 'crash', 2500],
    ['say', 'ben', 'Zu spät. Die Netzagentur hat uns vom Netz genommen. Alles still.'],
    ['ending', 'stoerung'],

    // ---------- Kapitel 5 ----------
    ['label', 'verhoer'],
    ['chapter', 5, 'Nachtfalter'],
    ['lockLeave', true],
    ['say', 'jule', 'Herr Krause, bleiben Sie bitte dran. Die Regie hat noch ein paar Fragen.'],
    ['goal', 'Wer ist Nachtfalter? Stell Krause zur Rede.'],
    ['ask', 'krause', {prompt: 'Krause atmet schwer ins Telefon.', options: [
      {id: 'wer', label: '„Wer ist Nachtfalter?“', say: ['Woher soll ich das wissen? Ein Funkname. Vor fünfunddreißig Jahren.']},
      {id: 'jule', label: '„Jule war 1989 vier Jahre alt.“', say: ['Und? Ich habe nie gesagt, dass sie es war. Ich habe nur gefragt.']},
      {id: 'name', label: '„Sie haben den Namen der Sendung ausgesucht.“', tag: 'proof', needs: ['name_krause'], set: {p_name: true},
        say: ['Ein schöner Name. Nachts wach, das Licht suchen. Das ist Radio.']},
      {id: 'chef', label: '„Kranich ruft den Senderchef.“', tag: 'proof', needs: ['klartext'], set: {p_chef: true},
        say: ['Ein Zahlensender aus einem Land, das es nicht mehr gibt. Das ist kein Beweis.']},
      {id: 'schwaermer', label: '„Ihre Kollegen nannten Sie den Nachtschwärmer. Seefunk Warnemünde, bis zur Wende.“', tag: 'proof', needs: ['festschrift', 'p_chef'], set: {p_schwaermer: true},
        say: ['… Das steht in einer Festschrift. Das war ein Witz.']},
      {id: 'drohen', label: '„Sie gehören ins Gefängnis!“', tag: 'accuse', wrong: true,
        say: ['Passen Sie auf, was Sie sagen. Ich bin immer noch Ihr Chef.']},
      {id: 'geständnis', label: '„Sie sind Nachtfalter.“', tag: 'proof', needs: ['p_name', 'p_chef', 'p_schwaermer'], end: true,
        say: ['… Ja. Ich habe Namen weitergegeben. Neun Namen. Leute, die rüber wollten. Ich war fünfundzwanzig.', 'Und morgen früh öffnet das Archiv. Das weiß Kranich. Deshalb heute Nacht.']}
    ]}],
    ['say', 'jule', 'Dieter. Du bist live. Seit drei Minuten. Ich habe das Hörertelefon auf den Sender gelegt.'],
    ['say', 'krause', 'Jule! Regie! Sofort runter damit!'],
    ['say', 'wendt', 'Danke. Mehr wollte ich nicht.'],
    ['goal', 'Bevor du entscheidest: Willst du Wendt noch etwas sagen?'],
    ['ask', 'wendt', {prompt: 'Wendt ist noch in der Leitung.', options: [
      {id: 'nichts', label: '„Danke für Ihre Hilfe, Herr Wendt.“', end: true, say: ['Gern. Gute Nacht, Regie.']},
      {id: 'blatt', label: '„Woher haben Sie Blatt sieben, wenn die Blätter vernichtet wurden?“',
        say: ['Man vergisst nichts, was man jede Nacht gelesen hat.']},
      {id: 'weiss', label: '„Ich weiß, wer Kranich ist.“', set: {entlarven: true}, end: true,
        say: ['So? Dann sagen Sie es. Laut. Wir sind ja auf Sendung.']}
    ]}],
    ['branch', s => !s.flags.entlarven, 'wahl'],
    ['goal', 'Wer ist Kranich?'],
    ['solve', 'kranich', {npc: 'wendt', every: 50000, taunts: ['Ich warte. Ich habe fünfunddreißig Jahre gewartet.', 'Schauen Sie, was hinter mir steht.']}],
    ['fx', 'flash'],
    ['say', 'wendt', 'Kranich. Fünfunddreißig Jahre hat mich niemand so genannt.'],
    ['say', 'wendt', 'Ich habe damals die Zahlen gesendet. Nachtfalter hat neun Leute verraten. Zwei davon waren meine Freunde. Heute Nacht sollte er es selbst sagen.'],
    ['ending', 'kranich'],

    ['label', 'wahl'],
    ['goal', 'Krause ist live auf Sendung. Du hast den Regler in der Hand.'],
    ['vote', {id: 'regler', prompt: 'Lässt du Krauses Geständnis weiterlaufen?', options: [
      {id: 'live', label: 'Weiter senden', desc: 'Alle sollen es hören.'},
      {id: 'aus', label: 'Regler runter', desc: 'Der Sender, die Lizenz, die Leute hier. Und Krause.'}
    ]}],
    ['ending', s => s.results.regler]
  ]
}
