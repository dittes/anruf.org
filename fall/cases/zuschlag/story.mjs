// Fall „Zuschlag“ (Gruppe). Museum, Gemälde, Maler, Versicherung und alle Personen sind frei erfunden.

const GU = 'gutachten', OR = 'ortung'
const img = (id, extra = '') => `<svg viewBox="0 0 960 540" xmlns="http://www.w3.org/2000/svg"><image href="portraits/${id}.webp" width="960" height="540"/>${extra}</svg>`
// kleines Straßenschild, beim Zoomen lesbar
const sign = (x, y, text, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot})" opacity=".9"><rect width="${text.length * 3.1 + 8}" height="9" rx="1.5" fill="#1d3f7a" stroke="#fff" stroke-width=".7"/><text x="4" y="6.6" font-size="5.6" font-family="Arial,sans-serif" fill="#fff">${text}</text></g>`

export default {
  id: 'zuschlag',
  title: 'Zuschlag',
  unit: 'Museum Haus Ebersbach · Sonderermittlung',
  file: 'Los 1 · AZ 0-ZS-1664',
  accent: '#e3c27a',
  chapters: 4,
  lobby: 'Vor drei Wochen wurde „Die Briefleserin“ aus dem Museum Haus Ebersbach gestohlen. Heute Nacht wird sie versteigert, per Videoanruf, an anonyme Bieter. Ihr seid Bieter 7. Etwa 50 bis 70 Minuten.',
  invite: 'Ich bin heute Nacht bei einer geheimen Kunstauktion. Per Video. Ich brauche jemanden, der sich mit Bildern auskennt. Kommst du?',
  lockText: 'Monsieur Blanc: Wer während der Auktion geht, verliert seine Kaution.',
  roles: {
    gutachten: {name: 'Gutachten', blurb: 'Museumskatalog, Versicherung, Stadtführer.'},
    ortung: {name: 'Ortung', blurb: 'Live-Bild, Standbilder, Papierkorb.'}
  },
  share: {
    text: 'Heute Nacht, {time}: Zuschlag für Bieter 7. Wir haben nicht bezahlt.',
    tag: '#Zuschlag',
    rows: ['LOS 1', 'BIETER 7', 'KAPELLENSTRASSE'],
    lines: ['Das Original hat nie', 'das Haus verlassen.']
  },

  npcs: {
    blanc: {name: 'Monsieur Blanc', sub: 'Auktionator · verschlüsselt', tts: {pitch: .9, rate: .98},
      voice: {model: 'thorsten-high', pitch: -1, fx: 'video', len: 1.03},
      face: {photo: 'blanc', silhouette: true, glow: '#e3c27a', hair: {style: 'slick'}, scene: 'office'}},
    vasquez: {name: 'Bieterin 3', sub: 'Madrid · anonym', tts: {pitch: .9, rate: 1},
      voice: {model: 'kerstin', pitch: -1.5, fx: 'call', len: 1.0},
      face: {photo: 'vasquez', skin: '#d8a888', fem: true, age: 1, hair: {style: 'bun', color: '#2a2424'}, extras: ['earring'], top: {style: 'blouse', color: '#111'}, mood: 'smirk', scene: 'studio'}},
    roth: {name: 'Dr. Margarete Roth', sub: 'Direktorin · Museum Haus Ebersbach', tts: {pitch: 1.05, rate: 1.02},
      voice: {model: 'eva_k', pitch: -1, fx: 'call', len: 1.0},
      face: {photo: 'roth', skin: '#eac6b0', fem: true, age: 2, hair: {style: 'short', color: '#e8dcc0'}, glasses: 'square', top: {style: 'jacket', color: '#222'}, mood: 'worried', scene: 'office'}}
  },

  photos: {
    katalog: img('gemaelde'),
    los: img('gemaelde-falsch'),
    // Blancs Videobild: durchs Fenster ein Kirchturm, unten am Fenster ein Straßenschild
    salon: img('blanc', sign(774, 318, 'Kapellenstr.', -1)),
    buero: img('roth')
  },

  shreds: {
    mail: {n: 7, order: [4, 1, 6, 2, 0, 5, 3], lines: [
      'VON: m.roth@haus-ebersbach.de',
      'AN:  blanc@protonmail.example',
      '',
      'KOPIEN NACH MADRID UND ZUERICH.',
      'DAS ORIGINAL BLEIBT HIER.',
      'VERSICHERUNG ZAHLT IM JUNI.     M.'
    ]}
  },

  pages: {
    einladung: {title: 'Einladung', role: null, html: `
      <div class="paper">
        <p class="stamp">Privatauktion · nur auf Einladung</p>
        <p>Los 1: Pieter van Hoorn, „Die Briefleserin“, Öl auf Leinwand, 1664.</p>
        <p>Beginn 23:00 Uhr. Kameras bleiben aus. Gebote nur per Handzeichen auf Aufforderung.</p>
        <p>Sie sind: <b>Bieter 7</b>.</p>
      </div>
      <p class="note">Dr. Roth hat euch die Einladung besorgt. Ihr sollt herausfinden, wer hinter der Auktion steckt und wo das Bild ist.</p>`},
    katalog: {title: 'Museumskatalog', role: GU, html: `
      <p class="stamp">Bestandskatalog Haus Ebersbach · Inv.-Nr. 1664/3</p>
      <p>So hing die Briefleserin bis vor drei Wochen im Saal 2. Ortung sieht das Bild aus der Auktion. Beschreibt es euch gegenseitig, Stück für Stück.</p>
      <div data-photo="katalog"></div>`},
    los: {title: 'Los 1 · Live-Bild', role: OR, html: `
      <p class="stamp">Auktionsstream · Los 1 · Kamera 2</p>
      <p>Das Bild, das Blanc gerade anbietet. Gutachten hat das Foto aus dem Museumskatalog.</p>
      <div data-photo="los"></div>`},
    standbild: {title: 'Standbild Blanc', role: OR, html: `
      <p class="stamp">Ortung · Bildschirmfoto aus Blancs Videobild</p>
      <p>Blanc sitzt am Fenster. Zoomt hinein: Was sieht man draußen?</p>
      <div data-photo="salon"></div>`},
    stadtfuehrer: {title: 'Stadtführer', role: GU, html: `
      <div class="paper">
        <p class="stamp">Stadtführer · Kirchen der Altstadt</p>
        <p><b>Dom St. Petri</b> am Domplatz. Zwei Türme, kein Zifferblatt.</p>
        <p><b>St. Marien</b> am Marktplatz, Ecke Brückenstraße. Barocke Haube, goldenes Zifferblatt.</p>
        <p><b>St. Jakobi</b> an der Kapellenstraße. Spitzer gotischer Turm, beleuchtete Turmuhr.</p>
        <p><b>Liebfrauen</b> am Wall. Turm 1944 zerstört, nie wieder aufgebaut.</p>
        <p><b>St. Johannis</b> in der Neustadt, Am Kapellenberg. Spitzer Turm, beleuchtete Turmuhr.</p>
      </div>`},
    police: {title: 'Versicherungspolice', role: GU, html: `
      <p class="stamp">Von Bieterin 3 · Hanseatische Kunstversicherung · vertraulich</p>
      <p>Die Police für die Briefleserin. Auf dem Original ist ein Prüfvermerk mit Sicherheitstinte. Mit der UV-Lampe darüberfahren.</p>
      <div class="uv"><div class="paper">
        <p class="stamp">Police KV-1664-03</p>
        <p>Objekt: van Hoorn, Die Briefleserin, 1664</p>
        <p>Versicherungsnehmer: Museum Haus Ebersbach</p>
        <p>Versicherungssumme: 14.000.000 €</p>
        <p>Diebstahl gemeldet: 21. Mai</p>
        <div class="ink">Summe erhöht von 4 auf 14 Mio. € am 02.05.<br>Antrag gestellt und unterschrieben: Dr. M. Roth</div>
      </div></div>`},
    papierkorb: {title: 'Papierkorb', role: OR, html: `
      <p class="stamp">Von Bieterin 3 · „Aus einem Papierkorb in Ebersbach. Fragt nicht.“</p>
      <div data-shred="mail"></div>`},
    buero: {title: 'Standbild Roth', role: OR, html: `
      <p class="stamp">Ortung · Bildschirmfoto aus Roths Videobild</p>
      <p>Hinter Dr. Roth lehnt etwas an der Wand. Zoomt hinein.</p>
      <div data-photo="buero"></div>`}
  },

  puzzles: {
    echt: {
      q: 'Ist Los 1 echt? Markiert alles, was sich vom Museumskatalog unterscheidet.', input: 'switches', n: 8,
      labels: ['Fenster', 'Vogel', 'Ring', 'Haarband', 'Zitrone', 'Brief', 'Jacke', 'Rahmen'],
      hash: ['49a5b06af13d318fe6662a2f0d4cf7bfaeaa3abd8c46bbff3de17146f8db56f5'],
      near: {'d1a8cf8567f7e96f07b74fe1d9f037e8c7f20b2cf5cd2e0280d655466cb73285': 'Zwei habt ihr. Schaut auf ihre Hände.', '358b9f5e69ff8359e36178fe5dc585597ba2681061fd27a0f943632ebb8bc01b': 'Zwei habt ihr. Was ist im Fenster?', 'a889cde342fe507dce6795cecc92b27fd100e80472764f25036eef88a31933be': 'Zwei habt ihr. Zählt die Scheiben.', '07f9063040012513237b378c207b4ed69c083a56a0ce05ce3ea365bf4403a0e1': 'Eins stimmt. Es sind drei.', '8b2319fd759d1781707cd72e214b27533cbfff86817a837710e805f96c6be784': 'Eins stimmt. Es sind drei.', '92978151eaeab0d801ad55f3cba49609fbac402ef1d42a4fee3ce469cdc91890': 'Eins stimmt. Es sind drei.'},
      hints: ['Gutachten und Ortung: Beschreibt euch die Bilder von links nach rechts. Oder legt eines auf den Arbeitstisch.', 'Geht Stück für Stück vor: Fenster, Käfig, Hände, Haar, Tisch. Zählt alles, was man zählen kann.', 'Fenster, Vogel und Ring sind anders.']
    },
    ort: {
      q: 'Von wo sendet Blanc? An welcher Kirche sitzt er?', ph: 'Kirche',
      hash: ['ffc5128d2dad2054ed712bcd510e40707bc433e14e179a801269eb51fa44baa1', 'a628e23fa82a967fbf68b848c8a29e1814dcd7000d253cb907e0778b181a7877', 'd1e26a336f61af89a508f2e4664ae57b628eaea4ca4cb3384564a4ad9858ea5e', '71d05396060a6a43db770206dbab5fe1565df9cffdaa137fa0d75f7cc258654c', '800b66530a053f8ce2a471d81a0d2d0f9682d464792aad00573da42f3115bf3a'],
      near: {'60ee57fa88bcbcd89c5372f5a272f50224bd826933af1fa51486ba8b72346237': 'Kapellenberg oder Kapellenstraße? Lest das Schild genau.', '2055ba48fb0c700f8c7d221ee1f7216343e49e584b8c0dc4b0296808e444345e': 'Johannis liegt am Kapellenberg, nicht an der Kapellenstraße.', 'e77d5c9ae919d57221859bb97a228a7bdc2c4f6e331ab07f56eb8d7f63ee700d': 'Johannis liegt am Kapellenberg, nicht an der Kapellenstraße.', 'd0f246bf508e5862374a0f9bcddeff6bd75ec9f657278cd0aa866801233f8187': 'Hat der Turm im Bild eine barocke Haube?', '0bb7c087fed3e54eb9826fbeb353661e6c4e2c7870ad5d74ed027d1c49e345d2': 'Hat der Turm im Bild eine barocke Haube?', 'af7e7d08053d90fefc5ea0a091869080c83bef5c2d1bac5a1cfa55ee3be2fa7f': 'Seht ihr zwei Türme?'},
      hints: ['Ortung: Zoomt in Blancs Standbild, unten am Fenster und draußen. Gutachten: Der Stadtführer kennt die Kirchen.', 'Am Fenster hängt ein Straßenschild. Welche Kirche steht an dieser Straße?', 'St. Jakobi, Kapellenstraße.']
    },
    erhoehung: {
      q: 'Wann wurde die Versicherungssumme erhöht? (TTMM)', ph: 'TTMM', input: 'digits', by: GU,
      hash: ['0b9e9198799dd933ceefdc1ec8e2942194b32bd6659ada2eb13d965edaf4e40c', '4768da20195aef6efd10953533b3a89e6dadeb32bd32d2f6f3e8c9e186f1dab8'],
      near: {'75cac39b149e16c4228a3446061fbad35a9d3ff2908a1ad32394f596a3714ab3': 'Das ist der Tag des Diebstahls. Die Erhöhung war vorher.'},
      hints: ['Gutachten: Fahrt mit dem Zeiger über die Police. Die Sicherheitstinte leuchtet nur unter der UV-Lampe.', 'Der leuchtende Vermerk steht unter der Versicherungssumme. Das Datum als Tag und Monat eingeben.', '02.05., also 0205.']
    },
    mail: {
      q: 'Was schreibt „M.“ an Blanc über das Original?', ph: 'Wo?',
      hash: ['53390ac50d99fe638efd20e3b43dda8f69b9499c158542d21011d42517c95628', '56b529db783b459d56c76390b009a0749e5b45cf5521571d29a6dc46ba2f9e79', '28127e8c63bd00182bf5abeed1e03a5ec5680d982c225f27d213de2118d1a0e6', '269b56c13b225673fe3af8c327e9c8a8a0eaf7a1784696e6f90ef764b3092acf'],
      near: {'d02b3ae96f1313979f9dd9c00ab8312a2a8a9aaa72e74088b696363f36a558cb': 'Dahin gehen die Kopien.', 'cb776c9ba0bc17130410d5bcb43fa393916c5b0d3c0b26be9b257913ef57e3ea': 'Dahin gehen die Kopien.', '592646ab79024ce4538e8015e28005dbae2b05014facc4d6caf4fc800a30da5c': 'Das ist, wann die Versicherung zahlt.'},
      hints: ['Ortung: Setzt die Streifen im Papierkorb zusammen. Gutachten kann mitlesen, wenn ihr sie auf den Tisch legt.', 'Die Zeile mit ORIGINAL.', '„Das Original bleibt hier.“']
    }
  },

  endings: {
    polizei: {title: 'Ausgang: ZUSCHLAG', code: 'ZS-ZUSCHLAG',
      text: 'Die Polizei holt Blanc aus seinem Salon an der Kapellenstraße und Dr. Roth aus ihrem Büro. Unter dem grauen Tuch: die Briefleserin, mit Vogel, Ring und sechs Fensterscheiben. Am Montag hängt sie wieder im Saal 2.',
      epilog: 'Auf dem Schild neben dem Bild steht jetzt eine neue Zeile: „1664 gemalt, zweimal gestohlen, einmal versteigert, nie verkauft.“'},
    deal: {title: 'Ausgang: STILLSCHWEIGEN', code: 'ZS-STILL',
      text: 'Ihr nehmt Roths Angebot an. Blanc wird verhaftet, Roth bleibt Direktorin. Die Briefleserin taucht „anonym zurückgegeben“ wieder auf. Die Versicherung zahlt nichts, das Museum bleibt pleite. Aber es bleibt offen.',
      epilog: 'Ein Jahr später bekommt ihr eine Einladung zur Wiedereröffnung von Saal 2. Ehrengast: Bieter 7. Ihr geht nicht hin.'},
    verkauft: {title: 'Ausgang: VERKAUFT', code: 'ZS-VERKAUFT',
      text: 'Zum Dritten. Bieterin 3 bekommt den Zuschlag, Blanc ist offline, bevor die Polizei die Straße kennt. Die Versicherung zahlt vierzehn Millionen an ein Museum, das sein Bild nie verloren hat.',
      epilog: 'Zwei Jahre später hängt in einer Madrider Villa eine Briefleserin ohne Vogel. Die Besitzerin weiß es. Sie hat sie trotzdem behalten.'}
  },
  codes: {'5c2480f847551d914e3225ad0e449aee418f4e765662cec6e5d3a9d393713948': 'polizei', '9827d995d764048b7fc5873e595cc1067ae400219d09c7a1d22e754309a316d5': 'deal', 'fb7f73546289a9474b6ca570d1d91a96d00378c08c2f1c0a56a82f01b2192143': 'verkauft'},

  script: [
    // ---------- Kapitel 1 ----------
    ['chapter', 1, 'Einlass'],
    ['ambience', 'wartemusik'],
    ['unlock', 'einladung'],
    ['chat', 'roth', 'Hier Roth. Danke, dass ihr das macht. Ihr seid Bieter 7. Blanc darf nicht merken, wer ihr seid. Ich bin per Chat bei euch.'],
    ['goal', 'Die Auktion beginnt gleich. Ihr seid Bieter 7.'],
    ['wait', 3000],
    ['join', 'blanc'],
    ['ambience', null],
    ['say', 'blanc', 'Guten Abend, meine Damen und Herren. Willkommen zu einer sehr kleinen, sehr diskreten Auktion.'],
    ['say', 'blanc', 'Diskretion heißt: Kameras aus. Bei allen. Sonst beginne ich nicht.'],
    ['goal', 'Blanc beginnt erst, wenn alle Kameras aus sind.'],
    ['quiet', 'cam', 'blanc', 'Wunderbar. Ich sehe niemanden, niemand sieht mich. So mag ich das.', 'Bieter sieben, ich sehe da noch eine Kamera.'],
    ['say', 'blanc', 'Los eins. Pieter van Hoorn, die Briefleserin, sechzehnhundertvierundsechzig. Bis vor drei Wochen in einem kleinen Museum, das sie nicht zu schätzen wusste.'],
    ['unlock', 'katalog'], ['unlock', 'los'],
    ['chat', 'roth', 'Vergleicht das Bild mit unserem Katalog. Ich kenne jeden Pinselstrich. Wenn da etwas nicht stimmt, will ich es wissen.'],
    ['goal', 'Vergleicht Los 1 mit dem Museumskatalog. Gutachten hat den Katalog, Ortung das Live-Bild.'],
    ['solve', 'echt', {npc: 'blanc', every: 55000, taunts: ['Nehmen Sie sich Zeit. Schönheit läuft nicht weg.', 'Ein Meisterwerk, nicht wahr? Jeder Vogel, jede Scheibe.']}],
    ['chat', 'roth', 'Eine Fälschung?! Dann verkauft er Kopien. Und das Original hat er noch. Findet heraus, wo er sitzt.'],
    ['wait', 1500],

    // ---------- Kapitel 2 ----------
    ['chapter', 2, 'Bietgefecht'],
    ['say', 'blanc', 'Eine weitere Bieterin klopft an. Madame, bitte.'],
    ['knock', 'vasquez'],
    ['join', 'vasquez'],
    ['say', 'vasquez', 'Buenas noches. Entschuldigen Sie die Verspätung. Ich biete, was nötig ist.'],
    ['say', 'blanc', 'Wir beginnen bei zwei Millionen. Bieter, die bieten wollen, heben die Hand. Alle gleichzeitig, bitte, ich zähle nur einmal.'],
    ['goal', 'Bleibt im Rennen: Hebt alle gleichzeitig die Hand.'],
    ['hold', {label: '✋ Alle gleichzeitig: Hand heben', ms: 2500}],
    ['say', 'blanc', 'Zwei Millionen, Bieter sieben. Madame?'],
    ['say', 'vasquez', 'Drei.'],
    ['unlock', 'standbild'], ['unlock', 'stadtfuehrer'],
    ['chat', 'roth', 'Haltet ihn hin! Ortung: Ich habe euch ein Standbild aus seinem Video geschickt. Gutachten: Der Stadtführer liegt in eurer Akte. Woher sendet er?'],
    ['goal', 'Findet heraus, von wo Blanc sendet, bevor der Hammer fällt.'],
    ['timer', 360000, 'Zum Dritten'],
    ['solve', 'ort', {npc: 'blanc', every: 45000, onFail: 'verkauft', taunts: ['Drei Millionen zum Ersten.', 'Bieter sieben, Sie zögern? Das sieht man selten.', 'Drei Millionen zum Zweiten.']}],
    ['timer', null],
    ['chat', 'roth', 'St. Jakobi, Kapellenstraße. Ich rufe die Polizei. Haltet ihn noch ein paar Minuten in der Leitung!'],
    ['say', 'blanc', 'Bieter sieben, letzte Gelegenheit. Hand hoch, alle.'],
    ['hold', {label: '✋ Alle gleichzeitig: Hand heben, vier Millionen', ms: 2500}],
    ['say', 'blanc', 'Vier Millionen. Madame?'],
    ['say', 'vasquez', 'Lassen Sie ihn. Ich bin raus.'],
    ['say', 'blanc', 'Zuschlag an Bieter sieben! Applaus, bitte. Die Zahlungsdaten folgen.'],
    ['clap', {label: '👏 Alle gleichzeitig klatschen: Zuschlag!', text: 'Blanc will Applaus. Klatscht alle im selben Moment, Mikro an.'}],
    ['leave', 'blanc'],
    ['wait', 1500],

    // ---------- Kapitel 3 ----------
    ['chapter', 3, 'Bieterin 3'],
    ['goal', 'Bieterin 3 ruft privat an.'],
    ['call', 'vasquez', {note: 'Bieterin 3 · privat'}],
    ['say', 'vasquez', 'Glückwunsch, Bieter sieben. Ich bin keine Sammlerin. Hanseatische Kunstversicherung, Abteilung Schadensbetrug.'],
    ['say', 'vasquez', 'Wir sollen vierzehn Millionen für das Bild zahlen. Vor einem Monat waren es noch vier. Komisch, oder? Ich schicke Ihnen die Police.'],
    ['unlock', 'police'],
    ['goal', 'Gutachten: Wann wurde die Versicherungssumme erhöht? Und von wem?'],
    ['solve', 'erhoehung'],
    ['say', 'vasquez', 'Zweiter Mai. Drei Wochen vor dem Diebstahl. Und beantragt hat es die Direktorin selbst.'],
    ['say', 'vasquez', 'Ich habe noch etwas. Aus einem Papierkorb in Ebersbach. Fragen Sie nicht, wie.'],
    ['unlock', 'papierkorb'],
    ['goal', 'Ortung: Setzt die Mail aus dem Papierkorb zusammen. Was schreibt M. über das Original?'],
    ['solve', 'mail', {npc: 'vasquez', every: 60000, taunts: ['Papier lügt nicht. Menschen schon.', 'Lesen Sie die Zeile mit dem Original.']}],
    ['say', 'vasquez', 'Das Original bleibt hier. Hier, in Ebersbach. Es hat das Museum nie verlassen.'],
    ['leave', 'vasquez'],
    ['join', 'blanc', 'glitch'],
    ['say', 'blanc', 'Bieter sieben. Vor der Übergabe möchte ich sehen, mit wem ich Geschäfte mache. Kameras an. Gesichter in die Kamera.'],
    ['chat', 'roth', 'NICHT zeigen! Kamera an, aber haltet sie mit der Hand zu. Dann denkt er, es ist dunkel bei euch.'],
    ['goal', 'Blanc will eure Gesichter sehen: Kamera an, aber mit der Hand zuhalten.'],
    ['quiet', 'covered', 'blanc', 'Wie ungezogen. Aber gut. Dunkle Räume, dunkle Geschäfte.', 'Da sehe ich jemanden. Hallo.'],
    ['say', 'blanc', 'Moment. Es klingelt bei mir. Unten. Zwei Herren in Uniform. Bieter sieben, das war nicht nett.'],
    ['fx', 'crash', 2500],
    ['leave', 'blanc', 'off'],
    ['wait', 1500],

    // ---------- Kapitel 4 ----------
    ['chapter', 4, 'Saal 2'],
    ['goal', 'Dr. Roth will euch sehen.'],
    ['call', 'roth', {note: 'Museum Haus Ebersbach · Büro'}],
    ['say', 'roth', 'Die Polizei hat Blanc! Ihr wart großartig. Das Bild war leider nicht bei ihm. Aber wir finden es.'],
    ['unlock', 'buero'],
    ['lockLeave', true],
    ['goal', 'Stellt Dr. Roth zur Rede. Ihr braucht Beweise.'],
    ['ask', 'roth', {prompt: 'Dr. Roth lächelt müde in die Kamera.', options: [
      {id: 'danke', label: '„Wie geht es jetzt weiter?“', say: ['Die Versicherung zahlt, wir kaufen Sicherheitstechnik, und irgendwann taucht sie wieder auf. So läuft das.']},
      {id: 'blanc', label: '„Sie arbeiten mit Blanc zusammen!“', tag: 'accuse', wrong: true, say: ['Wie bitte? Ich habe euch zu ihm geschickt! Überlegt, was ihr sagt.']},
      {id: 'summe', label: '„Sie haben die Versicherung am 2. Mai auf 14 Millionen erhöht.“', tag: 'proof', needs: ['erhoehung'], set: {p_summe: true},
        say: ['Der Wert war gestiegen. Das ist Routine.']},
      {id: 'mail', label: '„Das Original bleibt hier. M.“ Ihre Mail an Blanc.', tag: 'proof', needs: ['mail'], set: {p_mail: true},
        say: ['M. ist ein häufiger Buchstabe.']},
      {id: 'tuch', label: '„Was steht hinter Ihnen unter dem Tuch? Ich sehe einen Vogelkäfig. Mit Vogel.“', tag: 'proof', needs: ['buero', 'echt'], set: {p_tuch: true},
        say: ['… Ein Rahmen. Leer. Lagerbestand.']},
      {id: 'original', label: '„Das Original steht in Ihrem Büro. Die Fälschung hat keinen Vogel.“', tag: 'proof', needs: ['p_summe', 'p_mail', 'p_tuch'], end: true,
        say: ['… Das Museum ist pleite. Noch ein Jahr, dann schließen wir. Vierzehn Millionen hätten alles gerettet. Und niemand hätte etwas verloren.',
          'Ich mache euch ein Angebot. Blanc geht ins Gefängnis, das hat er verdient. Ich gebe das Bild anonym zurück. Und ihr vergesst diesen Abend.']}
    ]}],
    ['lockLeave', false],
    ['goal', 'Entscheidet gemeinsam: Was passiert mit Dr. Roth?'],
    ['vote', {id: 'roth', prompt: 'Dr. Roths Angebot', options: [
      {id: 'polizei', label: 'Polizei rufen', desc: 'Roth und Blanc, beide.'},
      {id: 'deal', label: 'Angebot annehmen', desc: 'Das Bild kommt zurück, das Museum bleibt offen.'}
    ]}],
    ['ending', s => s.results.roth],

    ['label', 'verkauft'],
    ['say', 'blanc', 'Drei Millionen zum Dritten. Zuschlag an Madame. Gute Nacht, Bieter sieben.'],
    ['ending', 'verkauft']
  ]
}
