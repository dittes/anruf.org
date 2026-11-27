// Fall „Der neunte Anrufer“ (Nachtschicht). Alle Personen, Firmen und Behörden sind frei erfunden.
// Lösungen stehen nur als SHA-256 im Fall (Werkzeug: fall/tools/seal.mjs). Aufbau der Schritte: siehe fall/README.md.

const F = 'forensik', A = 'archiv'

export default {
  id: 'nachtschicht',
  title: 'Der neunte Anrufer',
  unit: 'Dezernat 0',
  file: 'AZ 0-NS-1411',
  accent: '#ffb23f',
  chapters: 6,
  lobby: 'Ihr seid die Nachtschicht von Dezernat 0, einer Ermittlungseinheit, die sich nur per Videoanruf trifft. Heute wird ein drei Jahre alter Fall wieder geöffnet. Plant 90 bis 120 Minuten ein. Ihr könnt jederzeit pausieren und später weitermachen.',
  invite: 'Ich brauche deine Hilfe. Heute Nacht, nur wir, per Videoanruf. Sag niemandem davon.',
  lockText: 'Teilnehmer 9: Ihr bleibt schön hier.',
  roles: {
    forensik: {name: 'Forensik', blurb: 'Technische Auswertungen: Stimmen, Tonbänder, Netzmessungen.'},
    archiv: {name: 'Archiv', blurb: 'Akten: Listen, Abschriften, Karten, Tabellen.'}
  },
  share: {
    text: 'Akte 0-NS-1411 geschlossen. {time}. Wir wissen jetzt, wer der neunte Anrufer ist. Ihr nicht.',
    tag: '#DerNeunteAnrufer',
    rows: ['VERBLEIB L. B.', 'TEILNEHMER 9', 'AUSGANG'],
    lines: ['Die Aufnahme vom 14.11.2023 enthält neun Stimmen.', 'Eine davon war nie eingeladen.']
  },

  npcs: {
    sommer: {name: 'KHK H. Sommer', sub: 'Dezernat 0 · Leitung', tts: {pitch: .85, rate: 1.04},
      voice: {model: 'thorsten-high', fx: 'call', len: 1.02},
      face: {skin: '#d6a486', hair: {style: 'short', color: '#8f8b86'}, beard: 'stubble', beardColor: '#8f8b86', glasses: 'square', age: 2, mood: 'stern', top: {style: 'suit', color: '#262c36', accent: '#d9d6cf', tie: '#5a2630'}, bg: ['#3a4150', '#0e1116']}},
    geist: {name: 'Lena Brandt', sub: 'Konto seit 2023 inaktiv', look: 'ghost',
      face: {skin: '#e8bea2', hair: {style: 'bob', color: '#2a1d16'}, extras: ['freckles'], mood: 'neutral', top: {style: 'sweater', color: '#3a4a4a'}, bg: ['#2c3a46', '#0a0f14']}},
    moewe: {name: 'Unbekannt', sub: 'Rufnummer unterdrückt', look: 'weak', tts: {pitch: .45, rate: .86},
      voice: {model: 'thorsten_emotional', speaker: 7, fx: 'whisper', len: 1.08},
      face: {silhouette: true, hair: {style: 'hood'}, bg: ['#1b2a36', '#04070a']}},
    bernd: {name: 'Bernd Ahrens', sub: 'Mobil · München', tts: {pitch: .8, rate: .95},
      voice: {model: 'thorsten_emotional', speaker: 4, pitch: -2.5, fx: 'phone', len: 1.08},
      face: {skin: '#e3ad90', hair: {style: 'bald', color: '#9a948c'}, beard: 'mustache', beardColor: '#8a8178', age: 2, mood: 'worried', top: {style: 'jacket', color: '#46553a', accent: '#e8e2d6'}, bg: ['#4a3f33', '#120e0a']}},
    neun: {name: 'Teilnehmer 9', sub: 'nicht eingeladen', look: 'void glitchy', tts: {pitch: .1, rate: .78}, widget: 'ping',
      voice: {model: 'thorsten-high', fx: 'demon', len: 1.15},
      face: {silhouette: true, glow: '#ff3b30', hair: {style: 'hood'}, bg: ['#2a0606', '#000000']}},
    lena: {name: 'Lena Brandt', sub: 'Wetterwarte · Notstrom', look: 'weak', tts: {pitch: 1.1, rate: .96},
      voice: {model: 'kerstin', fx: 'radio', len: 1.0},
      face: {skin: '#e8bea2', hair: {style: 'beanie', color: '#2a1d16', hat: '#7a3a2a'}, extras: ['freckles', 'scarf'], scarf: '#3a5a6a', mood: 'worried', top: {style: 'coat', color: '#2f3b3a'}, bg: ['#26343e', '#080c10']}}
  },

  clips: {
    mailbox: {title: 'Mailbox L. Brandt · 14.11.2023 · 21:41', npc: 'lena', reverse: true,
      voice: {model: 'kerstin', fx: 'mailbox', len: 1.05},
      text: 'Falls mir etwas passiert. Das Schließfach im Bahnhof Lindau, Nummer siebzehn. Der Code ist mein Geburtstag. Tag und Monat. Aber rückwärts.'}
  },

  pages: {
    fall: {title: 'Der Fall', role: null, html: `
      <p class="stamp">Wiederaufnahme · AZ 0-NS-1411</p>
      <h3>Lena Brandt, 34, Investigativjournalistin</h3>
      <p>Am <b>14.11.2023</b> leitete Lena Brandt einen Videoanruf mit acht Personen. Thema: Hinweise auf gefälschte
      Studien zum Medikament <b>VX-12</b> der Velmont AG. Um 21:38 brach der Anruf ab. Seitdem ist Lena verschwunden.</p>
      <p>Die Aufnahme des Anrufs liegt uns vor. Die alte Auswertung fand nichts.</p>
      <p><b>Heute, 22:47 Uhr:</b> Lenas Konto war wieder online. Zum ersten Mal seit drei Jahren.</p>`},
    dienst: {title: 'Dienstanweisung', role: null, html: `
      <div class="paper"><p class="stamp">Dezernat 0 · Dienstanweisung Nachtschicht</p>
      <p>1. Jede Person hat andere Unterlagen. Gestrichelte Reiter sieht nur ihr. Lest vor, beschreibt, fragt nach.</p>
      <p>2. Zeugen lügen. Glaubt nichts, was ihr nicht belegen könnt.</p>
      <p>3. Wer anklopft, ist nicht eingeladen. Entscheidet gemeinsam, wen ihr reinlasst.</p>
      <p>4. Jede gelöste Spur ergibt ein <b>Fragment</b> (Symbol + Ziffer, oben neben dem Ziel). Hebt sie auf. Bei Kompromittierung der Leitung braucht ihr sie für die Notabschaltung.</p>
      <p>5. Wird es dunkel: Taschenlampe. Den Zeiger bewegen.</p></div>`},
    stimmen: {title: 'Stimmanalyse', role: F, html: `
      <p class="stamp">Forensik · Aufnahme 14.11.2023</p>
      <p>Die Software hat 12 Redebeiträge ausgeschnitten: Uhrzeit, Grundfrequenz der Stimme, Merkmale.
      Wer gesprochen hat, wurde damals nicht ausgewertet. Was gesagt wurde, steht in der Abschrift (Archiv).</p>
      <table><thead><tr><th>Beitrag</th><th>Zeit</th><th>Tonhöhe</th><th>Merkmale</th></tr></thead><tbody>
      <tr><td>S01</td><td>21:02:11</td><td>212 Hz</td><td>norddeutsch, Hamburger Färbung</td></tr>
      <tr><td>S02</td><td>21:04:40</td><td>104 Hz</td><td>rheinisch</td></tr>
      <tr><td>S03</td><td>21:07:02</td><td>188 Hz</td><td>berlinerisch</td></tr>
      <tr><td>S04</td><td>21:09:55</td><td>131 Hz</td><td>Standarddeutsch</td></tr>
      <tr><td>S05</td><td>21:12:30</td><td>167 Hz</td><td>schwäbisch</td></tr>
      <tr><td>S06</td><td>21:14:07</td><td>98 Hz</td><td>alemannisch (Schweiz), Hall, Wind</td></tr>
      <tr><td>S07</td><td>21:16:48</td><td>219 Hz</td><td>schwedischer Akzent</td></tr>
      <tr><td>S08</td><td>21:19:21</td><td>141 Hz</td><td>bairisch</td></tr>
      <tr><td>S09</td><td>21:23:05</td><td>122 Hz</td><td>norddeutsch</td></tr>
      <tr><td>S10</td><td>21:27:44</td><td>209 Hz</td><td>norddeutsch, Hamburger Färbung</td></tr>
      <tr><td>S11</td><td>21:31:16</td><td>106 Hz</td><td>rheinisch, schnell</td></tr>
      <tr><td>S12</td><td>21:37:59</td><td>211 Hz</td><td>norddeutsch, Verbindung bricht ab</td></tr>
      </tbody></table>`},
    liste: {title: 'Teilnehmerliste', role: A, html: `
      <p class="stamp">Archiv · Anruf 14.11.2023, 21:00–21:38</p>
      <p>Acht Personen waren eingeladen und eingeloggt. Stimmen laut Zeugenaussagen:</p>
      <table><thead><tr><th>Name</th><th>Rolle</th><th>Stimme</th></tr></thead><tbody>
      <tr><td>Lena Brandt</td><td>Journalistin, Gastgeberin</td><td>hoch, Hamburgerin</td></tr>
      <tr><td>Dr. Jonas Kessler</td><td>Pharmakologe</td><td>sehr tief, aus Köln</td></tr>
      <tr><td>Mara Voss</td><td>Anwältin</td><td>eher hoch, Berlinerin</td></tr>
      <tr><td>Tarek Haddad</td><td>Datenanalyst</td><td>mittel, kein Dialekt</td></tr>
      <tr><td>Ilse Brenner</td><td>Ex-Mitarbeiterin Velmont</td><td>eher tief für eine Frau, aus Stuttgart</td></tr>
      <tr><td>Sofia Lindqvist</td><td>Übersetzerin</td><td>hoch, Schwedin</td></tr>
      <tr><td>Bernd Ahrens</td><td>Informant, Kamera aus</td><td>mittel, aus München</td></tr>
      <tr><td>Paul Jansen</td><td>Fotograf</td><td>mittel, aus Bremen</td></tr>
      </tbody></table>`},
    abschrift: {title: 'Abschrift', role: A, html: `
      <p class="stamp">Archiv · Abschrift ohne Sprecherzuordnung</p>
      <ul class="log">
      <li><b>21:02:11</b> „Danke, dass ihr alle da seid. Was wir heute besprechen, verlässt diesen Anruf nicht.“</li>
      <li><b>21:04:40</b> „Die Studie zu VX-12 wurde zweimal umgeschrieben. Ich habe beide Fassungen.“</li>
      <li><b>21:07:02</b> „Rechtlich ist das eindeutig. Aber nur, wenn die Originale auftauchen.“</li>
      <li><b>21:09:55</b> „Die Metadaten passen nicht. Jemand hat die Dateien am Wochenende geändert.“</li>
      <li><b>21:12:30</b> „Ich war elf Jahre bei Velmont. Ich weiß, wer die Freigabe unterschrieben hat.“</li>
      <li><b>21:14:07</b> „Wenn alles schiefgeht: Der Leuchtturm brennt noch. Sie weiß, was das heißt.“</li>
      <li><b>21:16:48</b> „Ich übersetze die schwedischen Protokolle bis Freitag.“</li>
      <li><b>21:19:21</b> „Seid vorsichtig. Die wissen schon von diesem Treffen.“</li>
      <li><b>21:23:05</b> „Ich habe Fotos vom Labor in Basel. Nachtschicht, ohne Genehmigung.“</li>
      <li><b>21:27:44</b> „Bernd, woher weißt du das?“</li>
      <li><b>21:31:16</b> „Wir sollten auflegen. Sofort.“</li>
      <li><b>21:37:59</b> „Da ist noch jemand in der Lei–“</li>
      </ul>`},
    mailbox: {title: 'Tonband: Mailbox', role: F, html: `
      <p class="stamp">Forensik · Asservat 7 · Mailbox-Mitschnitt</p>
      <p>Die Möwe hat uns eine Sprachnachricht geschickt, die Lena in der Nacht ihres Verschwindens hinterlassen hat. Sie klingt … falsch.</p>
      <div data-tape="mailbox"></div>
      <p class="note">Das Bandgerät kann langsamer, schneller und rückwärts.</p>`},
    personalakte: {title: 'Personalakte L. B.', role: A, html: `
      <div class="paper"><p class="stamp">Melderegister · Auszug</p>
      <p><b>Brandt, Lena Marie</b><br>geboren 17.04.1989 in Hamburg-Altona<br>Journalistin (freiberuflich)<br>
      letzte Meldeadresse: Holstenstraße 112, Hamburg<br>Fahrzeug: keins · Bahncard 100 (seit 2021)</p>
      <p>Auffällig: Am 14.11.2023 um 16:02 eine Schließfachbuchung, DB-Schließfachanlage Lindau-Insel.</p></div>`},
    notizbuch: {title: 'Lenas Notizbuch', role: A, html: `
      <p class="stamp">Archiv · Asservat 8 · Notizbuch aus Schließfach 17</p>
      <p class="uvhint">Die Seite scheint fast leer. Fahrt mit der UV-Lampe (Zeiger oder Finger) darüber.</p>
      <div class="uv"><div class="plain">Seite 14<br><br>Einkaufen: Brot, Batterien, 2 Filme (s/w)<br>Paul anrufen wg. Labor</div>
      <div class="ink">B. ruft während des Treffens jemanden an. 21:20.<br>Ich weiß es seit Montag. Ich lasse ihn.<br>Wer zuhört, verrät sich.<br><br>Plan: M. holt mich raus.<br>Ich gehe dahin, wo das Licht oben ist.</div></div>`},
    telefon: {title: 'Verbindungsnachweis', role: F, html: `
      <p class="stamp">Forensik · Mobilfunk Bernd Ahrens · 14.11.2023</p>
      <table><thead><tr><th>Zeit</th><th>Richtung</th><th>Nummer</th><th>Dauer</th></tr></thead><tbody>
      <tr><td>18:12</td><td>ein</td><td>+49 89 …</td><td>4:12</td></tr>
      <tr><td>20:55</td><td>aus</td><td>Daten (Videoanruf)</td><td>43:10</td></tr>
      <tr><td>21:20:03</td><td>aus</td><td>+41 71 ··· ·· ·· (Schweiz)</td><td>0:38</td></tr>
      <tr><td>22:40</td><td>ein</td><td>+41 71 ··· ·· ··</td><td>0:09</td></tr>
      </tbody></table>
      <p class="note">Während des Videoanrufs hat Ahrens nebenher telefoniert.</p>`},
    ping: {title: 'Signal orten', role: F, html: `
      <p class="stamp">Forensik · Live-Messung</p>
      <p>Teilnehmer 9 läuft über drei unserer Netzknoten. Öffne die <b>Verbindungsdetails</b> auf seiner Kachel
      (das <b>i</b> oben rechts). Dort siehst du laufend die Laufzeit (Ping) zu jedem Knoten.</p>
      <p>Die Werte schwanken. Gib deinem Team die Zahlen durch. Wie daraus ein Ort wird, weiß das Archiv.</p>`},
    knoten: {title: 'Netzknoten', role: A, html: `
      <p class="stamp">Archiv · Netztopologie Dezernat 0</p>
      <p><b>Faustregel:</b> Pro 50 km Entfernung kommt etwa 1 ms Laufzeit dazu, plus 3 ms Grundlast im Knoten.
      Schwankungen kommen immer <i>obendrauf</i>: Nur die niedrigsten Messwerte zählen.</p>
      <table><thead><tr><th>Ort</th><th>Zürich</th><th>München</th><th>Stuttgart</th></tr></thead><tbody>
      <tr><td>Konstanz</td><td>60 km</td><td>190 km</td><td>130 km</td></tr>
      <tr><td>Lindau</td><td>100 km</td><td>150 km</td><td>160 km</td></tr>
      <tr><td>St. Gallen</td><td>65 km</td><td>180 km</td><td>165 km</td></tr>
      <tr><td>Basel</td><td>75 km</td><td>320 km</td><td>200 km</td></tr>
      <tr><td>Chur</td><td>95 km</td><td>210 km</td><td>230 km</td></tr>
      </tbody></table>`},
    morse: {title: 'Morsetafel', role: A, html: `
      <p class="stamp">Archiv · Funk-Handbuch, Anhang C</p>
      <p>Kurz = · (ein Takt Licht), lang = – (drei Takte). Zwischen Buchstaben kurze Pause, am Ende des Worts lange Pause.</p>
      <div class="grid" style="--n:4">
      <span>A ·–</span><span>B –···</span><span>C –·–·</span><span>D –··</span><span>E ·</span><span>F ··–·</span><span>G ––·</span><span>H ····</span>
      <span>I ··</span><span>J ·–––</span><span>K –·–</span><span>L ·–··</span><span>M ––</span><span>N –·</span><span>O –––</span><span>P ·––·</span>
      <span>Q ––·–</span><span>R ·–·</span><span>S ···</span><span>T –</span><span>U ··–</span><span>V ···–</span><span>W ·––</span><span>X –··–</span>
      <span>Y –·––</span><span>Z ––··</span></div>
      <p class="note">Die Forensik sieht das Licht genauso wie ihr. Lasst euch kurz und lang ansagen.</p>`},
    licht: {title: 'Lichtsignal', role: F, html: `
      <p class="stamp">Forensik · Hinweis</p>
      <p>Lenas Mikrofon ist tot, aber ihre Kamera-Lampe blinkt. Das Signal wiederholt sich nach einer langen Pause.</p>
      <p>Sag deinem Team jedes Zeichen an: <b>kurz</b> oder <b>lang</b>, und wann eine Pause kommt. Das Archiv hat die Tafel.</p>`},
    notfall: {title: 'Notfallkarte', role: A, html: `
      <div class="paper"><p class="stamp">Dezernat 0 · Notabschaltung · Verschlusssache</p>
      <p>Wird eine Leitung zurückverfolgt, trennt die Notabschaltung alle Knoten. Der Code besteht aus den Ziffern der Fragmente,
      geordnet nach dieser Reihenfolge der Symbole:</p>
      <p class="big" style="text-align:center">△ ☾ ◯ ⚓ ✶</p></div>`},
    abschaltung: {title: 'Notabschaltung', role: F, html: `
      <p class="stamp">Forensik · Schaltpult</p>
      <p>Das Pult nimmt <b>fünf Ziffern</b>. Die Ziffern kennt ihr: Es sind die Fragmente, die ihr gesammelt habt (oben neben dem Ziel).</p>
      <p>Die Reihenfolge steht auf der Notfallkarte. Die hat das Archiv.</p>`}
  },

  widgets: {
    // Laufzeit-Minima bei Teilnehmer 9 (= St. Gallen: 3 + km/50); nur die Forensik kann sie lesen
    ping(el, {role}) {
      if (role !== F && role !== 'beide') { el.innerHTML = '<p>Messdaten verschlüsselt. Nur die Forensik kann sie lesen.</p>'; return }
      const nodes = [['Zürich ZH-1', 4.3], ['München M-2', 6.6], ['Stuttgart S-3', 6.3]]
      el._h ??= nodes.map(() => [])
      el.innerHTML = '<p>Laufzeit zu den Knoten</p>' + nodes.map(([name, min], i) => {
        const v = min + (Math.random() < .22 ? 0 : .3 + Math.random() * Math.random() * 5)
        const hist = el._h[i]; hist.push(v); if (hist.length > 8) hist.shift()
        const f = x => x.toFixed(1).replace('.', ',')
        return `<div class="row"><span>${name}</span><b>${f(v)} ms</b><i>${hist.slice(0, -1).map(f).join(' · ')}</i></div>`
      }).join('')
    }
  },

  puzzles: {
    stimme: {
      q: 'Wer nicht auf der Liste steht, hat trotzdem gesprochen. Welches Schlüsselwort hat die neunte Stimme genannt?', ph: 'Schlüsselwort',
      hash: ['dee8f9937e3486f39b7abc15fdb5acf4b981b7984712765b457ccff12032231f', '9ad0665173053b380eed9511c167957530305c4b3254041214479d256a46711d', '2436407c6362e8a2c92308e1a24833ad39cf333be1fca651a96b35d7f4bbdfc1'],
      near: {'1709e7a3d20cfdcd3993d1e907101c11da99579374933dbbb02e8fd179a9b482': 'Das war Paul, der Fotograf aus Bremen.', '63412a4211f20e08f10c45bb82a00d49a09bc29381213f76d9ef2cbdd2964e28': 'Ein Name, kein Schlüsselwort. Aber merkt ihn euch.'},
      hints: [
        'Forensik: Lies dem Archiv Tonhöhe und Dialekt vor. Archiv: Ordnet jedem Beitrag eine Person zu.',
        'Ein Beitrag passt zu niemandem auf der Liste: sehr tief und Schweizer Dialekt. Welche Uhrzeit hat er?',
        'Beitrag S06 um 21:14:07. Was steht in der Abschrift zu dieser Zeit?'
      ]
    },
    fach: {
      q: 'Welcher Code öffnet Lenas Schließfach?', ph: 'Code', input: 'digits',
      hash: ['499b69cef8e3b86c67508105e251bb27e424bc36bd1ae07f837cf4e3dc16d7c3'],
      near: {'955fc478f291f6e65c41bc0aadc37caffa3fd25abee4c8de5a1a22e44e3480f1': 'Fast. Hört die Nachricht noch einmal bis zum Ende.', '0a397d4c78f8b08b9ef9a2708e5984addf3f3d674899ecb778c5e06013bdfeb9': 'Nur Tag und Monat.', '87bd88ec018f1020cc236bee1d6305e72eaf917bc3d444018880ed3f186a62a4': 'Nur Tag und Monat.'},
      hints: [
        'Forensik: Die Mailbox klingt rückwärts. Am Tonband gibt es einen Schalter dafür.',
        'Lena sagt: Geburtstag, Tag und Monat, aber rückwärts. Archiv: Der Geburtstag steht in der Personalakte.',
        '17.04. → 1704 → rückwärts gelesen.'
      ]
    },
    ping: {
      q: 'Wo sitzt Teilnehmer 9?', ph: 'Ort',
      hash: ['3bf4aeb0a9d0849e7086ddb4d64b46bc00d0469d045ab51a446e7cf1fb6c756e', '0ef02af721f118d4dd5f3e980e11931e5bb11e381b33ef2c46963c11a80a3ba3', '785fa5761daaa61db47ca19ff384755599cfc2196b657ba24b505837dfb5000a'],
      near: {'6ad465e29180b5bb25cc0bbbf183d534598c9c918c82754057a66d11704133a3': 'Knapp daneben. Schaut euch Stuttgart noch einmal an.', '287a19774ca8c66c05712c21df2b0051c2d2a34a64694ee0506617fbc113d602': 'Zürich passt nicht.', 'd0c73ba8ab39538aeaf0845191de0656dd12cc19e49455c6d2020844097b3ec1': 'Das ist ein Knoten, kein Ort aus der Liste.'},
      hints: [
        'Forensik: Beobachte die Werte eine Weile und merk dir pro Knoten den niedrigsten.',
        'Archiv: Rechne für jeden Ort 3 + Entfernung ÷ 50. Beispiel Konstanz–Zürich: 3 + 60 ÷ 50 = 4,2 ms.',
        'Die Minima sind etwa 4,3 / 6,6 / 6,3 ms. Welcher Ort passt zu allen drei?'
      ]
    },
    morse: {
      q: 'Was blinkt Lenas Lampe?', ph: 'Wort',
      hash: ['7036d9e15087769838e2d76126a67ce83ca28fb183d52a3616d053f8aacd01ee', '1f1e7b6651e24c8b861245dc2883118cf1a2c21cf188aabf4fce8ce2d4becd0f', '8c89eac7deeeaa035a4f2b103a62fa207202cf1abdaf194d762a31b3dd28e58d'],
      near: {'da72c325045b8e85ee8ea02bc0e64d796b0ba236ea9152ab5a889789fd57155b': 'Das Wort ist länger. Wartet auf die lange Pause.', '90c263ae168c85932a5609230f60637783b34d008bb8adbce5a7676ecf9d552e': 'Nein, kein Notruf. Ein Ort.'},
      hints: [
        'Forensik: Sag jedes Aufleuchten an, „kurz“ oder „lang“. Archiv: schreibt mit und schlagt nach.',
        'Es ist ein Wort mit sieben Zeichen. Es beginnt mit ··· (S).',
        '··· ·– · –· – ·· ··· — ein Berg in der Ostschweiz.'
      ]
    },
    abschaltung: {
      q: 'Notabschaltung: fünfstelliger Code. Schnell!', ph: 'Code', input: 'digits',
      hash: ['7fb2edb334d0e61bd8dc91299a097cfd08aa46917fe3ce6f3779a0ebe70e431f'],
      near: {'88d1270cd7f7784b4e65cf5cb9a458a7baf022b2dd5703601a0ff0e849c55c5d': 'Das ist die Reihenfolge, in der ihr sie gefunden habt. Die Karte sagt etwas anderes.'},
      hints: [
        'Die Ziffern sind die fünf Fragmente oben neben dem Ziel.',
        'Archiv: Lies die Reihenfolge der Symbole von der Notfallkarte vor.',
        '△ 4, ☾ 9, ◯ 1, ⚓ 7, ✶ 2.'
      ]
    }
  },

  endings: {
    licht: {title: 'Ausgang: LICHT', code: 'N9-LICHT',
      text: 'Ihr habt veröffentlicht. Die Originale zu VX-12 sind draußen, die Velmont AG steht still. Lena ist wieder verschwunden. Diesmal mit Absicht.',
      epilog: 'Drei Wochen später kommt ein Paket ohne Absender ins Dezernat. Darin: ein Leuchtturm aus Holz, kaum größer als ein Daumen. Im Sockel ein Zettel: „Danke. Es gibt noch einen zehnten.“'},
    still: {title: 'Ausgang: STILL', code: 'N9-STILL',
      text: 'Ihr habt geschwiegen. Lena ist in Sicherheit, die Originale bleiben versiegelt. Die Velmont AG macht weiter, als wäre nichts gewesen.',
      epilog: 'Ein Jahr später ruft eine unterdrückte Nummer im Dezernat an. Niemand spricht. Nur Wind, und sehr weit weg ein Nebelhorn. Dann eine tiefe Stimme: „Er weiß jetzt, wer ihr seid.“'},
    leuchtturm: {title: 'Ausgang: LEUCHTTURM', code: 'N9-LEUCHTTURM',
      text: 'Bernd Ahrens sagt aus. Mit seinem Geständnis und Lenas Originalen kommt der Sicherheitschef von Velmont in Haft. Lena kann nach Hause. Der seltenste Ausgang.',
      epilog: 'Lena schreibt die Geschichte zu Ende. Der letzte Satz ihres Artikels: „Danke an die Nachtschicht. Ihr wart die neunte Stimme, die ich gebraucht habe.“'},
    verloren: {title: 'Ausgang: VERLOREN', code: 'N9-VERLOREN',
      text: 'Die Rückverfolgung lief durch. Teilnehmer 9 kennt jetzt Lenas Versteck und eure Leitung. Am nächsten Morgen ist die Wetterwarte leer.',
      epilog: 'Auf dem Schreibtisch in der Wetterwarte liegt nur eine Notiz, in Lenas Schrift: „Ich bin nicht böse. Ihr wart nah dran. Versucht es noch einmal.“'}
  },
  codes: {'47558c17739edc11d7e3fa29bf4c49891a12c5cb8c944cf6e156fb1f5f37c0a5': 'licht', 'b00ae7e7108f4b5d9ea30d17980b53b7f36e36e86e66bdbacf1fb9668563a80d': 'still', '27e2cd89736a7124b4121a13a3ad6e81dfe93fd1b6545cae6bee0f0a4e503af7': 'leuchtturm', '2b294b1db61701e304cec8154af231d8e3317e4f836c802e2771320e66ffccfb': 'verloren'},

  script: [
    // ---------- Kapitel 1 ----------
    ['chapter', 1, 'Wiederaufnahme'],
    ['ambience', 'hum'],
    ['goal', 'Wartet auf KHK Sommer.'],
    ['wait', 3000],
    ['snap'],
    ['join', 'sommer'],
    ['wait', 1200],
    ['say', 'sommer', 'Guten Abend, Nachtschicht. Danke, dass ihr so schnell da seid.'],
    ['say', 'sommer', 'Ich mache es kurz. Vor drei Jahren ist die Journalistin Lena Brandt nach einem Videoanruf verschwunden. Wir haben die Aufnahme. Die alte Auswertung fand nichts.'],
    ['say', 'sommer', 'Heute um zweiundzwanzig Uhr siebenundvierzig war ihr Konto wieder online. Zum ersten Mal seit drei Jahren.'],
    ['unlock', 'fall'], ['unlock', 'dienst'], ['unlock', 'stimmen'], ['unlock', 'liste'], ['unlock', 'abschrift'],
    ['say', 'sommer', 'Ich schicke euch die Unterlagen. Jeder bekommt andere. Ihr müsst sie zusammenlegen. Lest die Dienstanweisung.'],
    ['say', 'sommer', 'In der Aufnahme sind acht Personen. Ich glaube, es haben neun gesprochen. Findet heraus, was die neunte Stimme gesagt hat.'],
    ['fx', 'ring'],
    ['say', 'sommer', 'Moment, das ist das Präsidium. Ich muss rangehen. Ihr schafft das.'],
    ['leave', 'sommer'],
    ['goal', 'Findet heraus, was die neunte Stimme in der Aufnahme gesagt hat.'],
    ['wait', 9000],
    ['join', 'geist', 'glitch'],
    ['fx', 'toast', 'Lena Brandt ist dem Anruf beigetreten.'],
    ['wait', 4200],
    ['leave', 'geist', 'glitch'],
    ['chat', 'sommer', 'Habt ihr das gesehen?! Lenas Konto war gerade in eurem Anruf. Macht weiter, ich lasse das prüfen.'],
    ['solve', 'stimme'],
    ['fragment', '☾', '9'],
    ['chat', 'sommer', '„Der Leuchtturm brennt noch.“ Das klingt wie ein Codewort zwischen zwei Menschen. Wer war die Stimme? Bleibt wach.'],
    ['wait', 3000],

    // ---------- Kapitel 2 ----------
    ['chapter', 2, 'Die Möwe'],
    ['ambience', 'wind'],
    ['goal', 'Jemand klopft an. Entscheidet, ob ihr reinlasst.'],
    ['knock', 'moewe'],
    ['join', 'moewe'],
    ['wait', 1500],
    ['say', 'moewe', 'Ihr habt den Leuchtturm gefunden. Dann hört mir jetzt genau zu.'],
    ['goal', 'Die Möwe will nicht gesehen werden: Kameras aus.'],
    ['say', 'moewe', 'Erst die Kameras. Alle. Ich will nicht, dass jemand sieht, mit wem ihr redet.'],
    ['quiet', 'cam', 'moewe', 'Gut. Keiner sieht uns.', 'Eine Kamera läuft noch. Ich warte.'],
    ['goal', 'Die Möwe redet nur, wenn niemand mithört: Mikrofone aus.'],
    ['say', 'moewe', 'Jetzt die Mikrofone. Ich rede nur, wenn keiner mithört.'],
    ['quiet', 'mic', 'moewe', 'Ich war die neunte Stimme. Ich war nie eingeladen. Ich habe nur zugehört, um Lena zu schützen.', 'Jemand hört mit. Mikrofone aus.'],
    ['quiet', 'mic', 'moewe', 'Der Leuchtturm brennt noch hieß: Sie lebt, und sie ist bereit. Ich habe sie in dieser Nacht rausgebracht.', 'Jemand hört mit. Mikrofone aus.'],
    ['quiet', 'mic', 'moewe', 'Einer der acht hat sie verraten. Und wer auch immer ihn bezahlt hat, hört heute wieder mit.', 'Jemand hört mit. Mikrofone aus.'],
    ['quiet', 'mic', 'moewe', 'Lena hat in der Nacht eine Nachricht hinterlassen. Ich schicke sie euch. Hört genau hin. Ihr dürft wieder reden.', 'Jemand hört mit. Mikrofone aus.'],
    ['unlock', 'mailbox'], ['unlock', 'personalakte'],
    ['say', 'moewe', 'Ich muss los. Die Leitung ist nicht sicher.'],
    ['leave', 'moewe'],
    ['goal', 'Mikros wieder an. Findet den Code für Lenas Schließfach.'],
    ['solve', 'fach'],
    ['fragment', '⚓', '7'],
    ['chat', 'moewe', 'Fach 17 war nicht leer. Lenas Notizbuch. Ich habe euch Seite 14 geschickt. Man sieht nichts? Dann braucht ihr anderes Licht.'],
    ['unlock', 'notizbuch'],
    ['wait', 2500],

    // ---------- Kapitel 3 ----------
    ['chapter', 3, 'Der Informant'],
    ['ambience', 'hum'],
    ['chat', 'sommer', 'Ich habe den Verbindungsnachweis von Bernd Ahrens besorgt. Nur für die Forensik. Er ruft euch gleich zurück. Seid freundlich. Erst mal.', {to: F}],
    ['unlock', 'telefon'],
    ['goal', 'Bernd Ahrens ruft an. Geht ran.'],
    ['call', 'bernd', {note: 'Mobil · München · ruft an …', again: 'ruft noch einmal an. Er klingt ungeduldig.'}],
    ['wait', 800],
    ['say', 'bernd', 'Ahrens hier. Sie haben mich angeschrieben? Ich habe nicht viel Zeit.'],
    ['goal', 'Verhört Bernd Ahrens. Er lügt. Findet die Lüge und beweist sie.'],
    ['ask', 'bernd', {prompt: 'Was fragt ihr Bernd Ahrens?', options: [
      {id: 'wo', label: 'Wo waren Sie am Abend des 14. November?', say: ['Zuhause in München. Im Anruf, wie alle anderen. Kamera aus, wie immer.']},
      {id: 'kamera', label: 'Warum hatten Sie die Kamera aus?', say: ['Quellenschutz. Ich war zwanzig Jahre im Werkschutz bei Velmont. Wenn mich da einer erkennt, bin ich erledigt.']},
      {id: 'lena', label: 'Wann haben Sie Lena zuletzt gesprochen?', say: ['Am Tag davor. Sie war nervös. Sie hat gesagt, jemand folgt ihr. Ich habe ihr gesagt, sie soll vorsichtig sein.']},
      {id: 'telefon', label: 'Haben Sie während des Treffens telefoniert?', set: {gelogen: true}, say: ['Nein. Ich habe zugehört. Sonst nichts. Wieso fragen Sie das?']},
      {id: 'anklage', label: 'Sie haben Lena entführt.', tag: 'accuse', wrong: true, say: ['Wie bitte? Ich habe sie gewarnt! Noch so ein Satz, und ich lege auf.']},
      {id: 'beweis', label: 'Ihr Verbindungsnachweis: 21:20 Uhr, 38 Sekunden, eine Nummer in der Schweiz.', tag: 'proof', needs: ['telefon', 'gelogen'], set: {bernd_gestanden: true},
        say: ['Woher haben Sie das? … Na gut. Ich habe angerufen.', 'Man hatte mir die Nummer gegeben. Ich sollte nur durchsagen, wann das Treffen läuft. Ich dachte, es geht um Geld. Nicht um Lena.']},
      {id: 'notiz', label: 'Lena wusste von Ihrem Anruf. Es steht in ihrem Notizbuch.', tag: 'proof', needs: ['bernd_gestanden', 'notizbuch'], set: {bernd_zeuge: true}, end: true,
        say: ['Sie wusste es? Und hat mich trotzdem reden lassen.', 'Der Mann am Telefon nannte sich nur Neun. Wenn ihr ihn kriegt, sage ich aus. Vor jedem Gericht.']},
      {id: 'genug', label: 'Danke. Das reicht uns.', tag: 'leave', needs: ['bernd_gestanden'], end: true,
        say: ['Dann lassen Sie mich jetzt in Ruhe.']}
    ]}],
    ['say', 'bernd', 'Er wird wissen, dass ich mit euch geredet habe. Er weiß immer alles.'],
    ['leave', 'bernd', 'glitch'],
    ['fragment', '✶', '2'],
    ['branch', s => s.flags.bernd_zeuge, 'zeuge'],
    ['chat', 'sommer', 'Ahrens hat gestanden. Aber als Zeuge haben wir ihn nicht. Schade. Vielleicht hätte er mehr gesagt, wenn er gewusst hätte, was Lena wusste.'],
    ['goto', 'k4'],
    ['label', 'zeuge'],
    ['chat', 'sommer', 'Ahrens sagt aus?! Das ist Gold wert. Gute Arbeit.'],

    // ---------- Kapitel 4 ----------
    ['label', 'k4'],
    ['wait', 3000],
    ['chapter', 4, 'Teilnehmer 9'],
    ['ambience', null],
    ['fx', 'glitch'],
    ['wait', 900],
    ['join', 'neun', 'glitch'],
    ['wait', 1200],
    ['say', 'neun', 'Guten Abend, {me}. Es ist {time} bei dir. Spät für einen Anruf.'],
    ['fx', 'mirror', {npc: 'neun', label: 'ICH SEHE DICH'}],
    ['say', 'neun', 'Du sahst vorhin anders aus. Kamera an, Kamera aus. Ich habe alles.'],
    ['fx', 'rename', 'SPITZEL {n}'],
    ['say', 'neun', 'Ihr sucht Lena. Ich auch. Danke, dass ihr ihre alte Leitung geöffnet habt.'],
    ['unlock', 'ping'], ['unlock', 'knoten'],
    ['goal', 'Ortet Teilnehmer 9. Forensik: das i auf seiner Kachel.'],
    ['solve', 'ping', {npc: 'neun', every: 40000, taunts: [
      'Ihr seid langsam, {me}.',
      'Ich bin näher an ihr als ihr an mir.',
      'Weißt du eigentlich, wer bei dir gerade mithört?',
      'Die Möwe hat euch nicht alles erzählt.'
    ]}],
    ['say', 'neun', 'Sankt Gallen. Gut gemacht. Dann wisst ihr jetzt auch, wie nah ich ihr bin.'],
    ['fx', 'crash', 4500],
    ['leave', 'neun'],
    ['wait', 5000],
    ['fragment', '△', '4'],
    ['chat', 'sommer', 'St. Gallen?! Ich habe die Schweizer Kollegen informiert. Aber das dauert. Haltet die Leitung offen.'],
    ['wait', 3000],

    // ---------- Kapitel 5 ----------
    ['chapter', 5, 'Funkfeuer'],
    ['dark', true],
    ['wait', 1500],
    ['chat', 'sommer', 'Stromausfall im ganzen Präsidium. Notstrom läuft. Nehmt die Taschenlampe: Zeiger bewegen.'],
    ['join', 'lena', 'static'],
    ['fx', 'toast', 'Lena Brandt ist dem Anruf beigetreten. Ihr Mikrofon sendet nichts.'],
    ['unlock', 'morse'], ['unlock', 'licht'],
    ['morse', 'lena', 'SAENTIS', 300],
    ['goal', 'Lenas Mikrofon ist tot, aber ihre Lampe blinkt. Lest das Signal.'],
    ['solve', 'morse'],
    ['morse', null],
    ['fragment', '◯', '1'],
    ['dark', false],
    ['goal', 'Lenas Verbindung ist zu schwach. Haltet sie gemeinsam.'],
    ['hold', {label: 'Leitung zu Lena stabilisieren', ms: 3500}],
    ['ambience', 'wind'],
    ['say', 'lena', 'Hier ist Lena. Endlich. Bitte legt nicht auf.'],
    ['say', 'lena', 'Ich sitze in der alten Wetterwarte unter dem Säntis. Die Möwe hat mich vor drei Jahren hergebracht. Dahin, wo das Licht oben ist.'],
    ['say', 'lena', 'Ich habe die Originale der VX-12-Studie. Und ich weiß, wer Neun ist: der Sicherheitschef von Velmont. Er sucht mich seit drei Jahren.'],
    ['say', 'lena', 'Ihr habt ihn heute in Sankt Gallen geortet. Das ist eine Stunde von hier.'],
    ['wait', 1500],

    // ---------- Kapitel 6 ----------
    ['chapter', 6, 'Gegenspur'],
    ['ambience', null],
    ['fx', 'glitch'],
    ['join', 'neun', 'glitch'],
    ['say', 'neun', 'Danke, Lena. Danke, {me}. Jetzt höre ich auch, wo du bist.'],
    ['lockLeave', true],
    ['unlock', 'notfall'], ['unlock', 'abschaltung'],
    ['chat', 'sommer', 'Er verfolgt eure Leitung zurück! Notabschaltung, sofort! Fünf Ziffern. Die Fragmente!'],
    ['goal', 'Notabschaltung! Fünf Ziffern aus euren Fragmenten, bevor die Rückverfolgung durch ist.'],
    ['timer', 150000, 'Rückverfolgung'],
    ['solve', 'abschaltung', {npc: 'neun', every: 25000, onFail: 'zweite', taunts: [
      'Zürich. München. Stuttgart. Ich komme näher.',
      'Tick. Tack, {me}.',
      'Sie hat Angst. Ich höre es.'
    ]}],
    ['goto', 'geschafft'],

    ['label', 'zweite'],
    ['fx', 'shake'],
    ['join', 'moewe', 'static'],
    ['say', 'moewe', 'Ich habe seinen Knoten in Zürich gekappt. Ihr habt noch eine Minute. Beeilt euch.'],
    ['leave', 'moewe'],
    ['timer', 75000, 'Letzte Chance'],
    ['solve', 'abschaltung', {npc: 'neun', every: 20000, onFail: 'verloren', taunts: ['Die Möwe. Natürlich.', 'Gleich.']}],
    ['goto', 'geschafft'],

    ['label', 'verloren'],
    ['say', 'neun', 'Zu spät. Ich sehe sie.'],
    ['fx', 'crash', 3000],
    ['ending', 'verloren'],

    ['label', 'geschafft'],
    ['timer', null],
    ['fx', 'flash'],
    ['say', 'neun', 'Nein. Nein!'],
    ['leave', 'neun', 'glitch'],
    ['lockLeave', false],
    ['ambience', 'wind'],
    ['wait', 2000],
    ['say', 'lena', 'Die Leitung ist sauber. Er hat mich nicht. Noch nicht.'],
    ['say', 'lena', 'Wenn ihr die Originale veröffentlicht, weiß jeder, was Velmont getan hat. Aber dann bin ich nirgends mehr sicher. Wenn ihr schweigt, bin ich sicher, und alles war umsonst.'],
    ['branch', s => !s.flags.bernd_zeuge, 'wahl'],
    ['say', 'lena', 'Und Bernd will aussagen? Dann gibt es vielleicht einen dritten Weg.'],
    ['label', 'wahl'],
    ['goal', 'Entscheidet gemeinsam.'],
    ['vote', {id: 'final', prompt: 'Was passiert mit den Originalen?', options: [
      {id: 'licht', label: 'Veröffentlichen', desc: 'Die Wahrheit kommt raus. Lena muss wieder verschwinden.'},
      {id: 'still', label: 'Schweigen', desc: 'Lena ist sicher. Velmont macht weiter.'},
      {id: 'leuchtturm', label: 'Veröffentlichen, mit Bernd als Zeugen', desc: 'Nur möglich, weil Ahrens aussagt.', if: s => !!s.flags.bernd_zeuge}
    ]}],
    ['ending', s => s.results.final]
  ]
}
