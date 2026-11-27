// Fall „Das Haus am Wehr“ (allein spielbar). Alle Personen, Orte, Kanzleien und Firmen sind frei erfunden.

// Fotos aus portraits/ mit eingeblendeten, gut lesbaren Details (der Bildgenerator schreibt keine verlässliche Schrift)
const img = (id, extra = '') => `<svg viewBox="0 0 960 540" xmlns="http://www.w3.org/2000/svg"><image href="portraits/${id}.webp" width="960" height="540"/>${extra}</svg>`

const SOLO = 'erbe'

export default {
  id: 'erbe',
  title: 'Das Haus am Wehr',
  unit: 'Nachlasssache Kessler',
  file: 'Nachlass 0-HW-0303',
  accent: '#c9a46a',
  chapters: 5,
  solo: true,
  lobby: 'Ein Notar ruft an: Du hast ein Haus geerbt, von einer Großtante, die du nie getroffen hast. Die Frist läuft heute um Mitternacht ab. Ein Fall für dich allein, etwa 45 bis 60 Minuten. Kopfhörer helfen.',
  invite: 'Ich habe angeblich ein Haus geerbt und der Notar ruft gleich per Video an. Hörst du mit?',
  lockText: 'Dr. Hensel: Bitte bleiben Sie in der Leitung. Wir sind gleich fertig.',
  roles: {
    erbe: {name: 'Erbin / Erbe', blurb: 'Alle Unterlagen, alle Entscheidungen.'}
  },
  share: {
    text: 'Ich habe heute ein Haus geerbt. {time}. Die Standuhr läuft wieder.',
    tag: '#HausAmWehr',
    rows: ['HAUS AM WEHR', '4:10 UHR', 'LIBELLE'],
    lines: ['Wer unterschreibt, bevor er das Haus gesehen hat,', 'hat es nicht verdient.']
  },

  npcs: {
    hensel: {name: 'Dr. K. Hensel', sub: 'Notariat am Domplatz', tts: {pitch: .85, rate: 1.02},
      voice: {model: 'thorsten_emotional', speaker: 4, pitch: -1.5, fx: 'video', len: 1.0},
      face: {photo: 'hensel', skin: '#e0b496', age: 2, hair: {style: 'slick', color: '#c9c6c0'}, glasses: 'half', top: {style: 'suit', color: '#2a2c30', accent: '#e8e4da', tie: '#1f4a34'}, mood: 'smile', scene: 'office'}},
    mehmet: {name: 'Mehmet Aydın', sub: 'Schlüsseldienst · Handy', tts: {pitch: 1, rate: 1.05},
      voice: {model: 'thorsten-high', pitch: 1, fx: 'phone', len: 1.0},
      face: {photo: 'mehmet', skin: '#c99272', jaw: .7, hair: {style: 'short', color: '#1c1a18'}, beard: 'full', beardColor: '#1c1a18', top: {style: 'jacket', color: '#1f2a44'}, mood: 'worried', scene: 'storm'}},
    pohl: {name: 'Gisela Pohl', sub: 'Nachbarin · Tablet', tts: {pitch: 1.05, rate: .95},
      voice: {model: 'eva_k', pitch: -2, fx: 'call', len: 1.04},
      face: {photo: 'pohl', skin: '#ecc9b4', fem: true, age: 2, hair: {style: 'bun', color: '#e6e2dc'}, glasses: 'round', extras: ['mole'], top: {style: 'sweater', color: '#4a5a3a'}, mood: 'smile', scene: 'night'}},
    notariat: {name: 'Notariat am Domplatz', sub: 'Anrufbeantworter', look: 'weak', tts: {pitch: 1.1, rate: 1},
      voice: {model: 'kerstin', fx: 'mailbox', len: 1.0},
      face: {photo: 'notariat', silhouette: true, hair: {style: 'bob'}, top: {style: 'blouse', color: '#333'}, scene: 'office'}}
  },

  faces: {
    sterbebild: {face: {photo: 'irma'}, caption: 'Irma Kessler · Foto für die Traueranzeige'}
  },

  photos: {
    // Hausfront: Hochwassermarke, Baujahr und Hausnummer stehen auf kleinen Schildern
    haus: img('haus',
      // Text auf dem leeren Emailleschild links der Tür (die Wasserlinie ist im Foto schon da)
      `<g font-family="Georgia,serif" text-anchor="middle" fill="#2a2622"><text x="333.5" y="257" font-size="6.2" letter-spacing=".6">HOCHWASSER</text><text x="333.5" y="268" font-size="6.6">12. MÄRZ 1954</text></g>` +
      // ins Türbalken-Holz geschnitzt
      `<text x="522" y="138" font-size="7" font-family="Georgia,serif" text-anchor="middle" fill="#e6d2b0" opacity=".55" letter-spacing="1.5">ERBAUT · 1781</text>` +
      // blaues Hausnummernschild neben dem Schlüsseltresor
      `<g transform="translate(667 247)"><rect width="30" height="19" rx="2" fill="#1f3f8a" stroke="#fff" stroke-width=".8"/><text x="15" y="7" font-size="3.6" font-family="Arial,sans-serif" text-anchor="middle" fill="#fff">AM WEHR</text><text x="15" y="16" font-size="8" font-family="Arial,sans-serif" font-weight="700" text-anchor="middle" fill="#fff">238</text></g>`),
    dachboden: img('dachboden')
  },

  shreds: {
    zettel: {n: 6, order: [3, 5, 1, 4, 0, 2], lines: [
      'FÜR DIE TRUHE:',
      '',
      'HAUSNUMMER MAL DREI.',
      'NICHT AUFSCHREIBEN!',
      '                  I.K.'
    ]}
  },

  clips: {
    kassette: {title: 'Kassette aus der Standuhr · „Nur für die Erbin. Nicht für H.“', npc: 'pohl', reverse: true,
      voice: {model: 'eva_k', pitch: -2, fx: 'mailbox', len: 1.04},
      text: 'Wenn du das hörst, hast du die Uhr gestellt. Gut. Unterschreib nichts, was dir der Notar schickt. Meine Nachbarin hilft dir. Sag ihr das Wort Libelle, dann weiß sie, dass ich dich schicke.'}
  },

  pages: {
    testament: {title: 'Testament', role: null, html: `
      <p class="stamp">Abschrift · eröffnet durch Notariat am Domplatz</p>
      <div class="letter">
        <p>Mein Haus am Wehr bekommt, wer es versteht.</p>
        <p>Der Schlüssel wartet, seit das Wasser kam.</p>
        <p>Wer zuerst hineingeht, stelle die Uhr auf die Stunde, in der ich ging.</p>
        <p>Und: Wer unterschreibt, bevor er das Haus gesehen hat, hat es nicht verdient.</p>
        <p class="sig">Irma Kessler</p>
      </div>`},
    verzicht: {title: 'Erbausschlagung', role: null, html: `
      <div class="paper">
        <p class="stamp">Notariat am Domplatz · Erklärung</p>
        <p><b>Erbausschlagung</b></p>
        <p>Hiermit schlage ich die Erbschaft nach Frau Irma Kessler, zuletzt wohnhaft Am Wehr, aus allen Berufungsgründen aus.</p>
        <p>Das Grundstück fällt damit an die Gemeinde und wird an die <b>Weserkraft Nord GmbH</b> veräußert.</p>
        <p>Unterschrift: ______________________ (digitale Gesichtssignatur)</p>
        <p class="small">Rückfragen: Notariat am Domplatz · Tel. 0571 88 30 11<br>Frist: heute, 24:00 Uhr</p>
      </div>`},
    hausfoto: {title: 'Foto: Hausfront', role: null, html: `
      <p class="stamp">Mehmets Handykamera · Am Wehr</p>
      <p>Mehmet hat die Hausfront fotografiert. Zoomt hinein: Am Haus hängen kleine Schilder.</p>
      <div data-photo="haus"></div>`},
    traueranzeige: {title: 'Traueranzeige', role: null, html: `
      <div class="paper" style="text-align:center">
        <p style="font-family:Georgia,serif;font-size:1.05rem;margin:.2em 0">Irma Kessler</p>
        <p>* 14. Mai 1946 &nbsp; † 3. März, 4:10 Uhr</p>
        <div data-face="sterbebild"></div>
        <p>Sie ging, wie sie lebte: ohne Aufhebens.</p>
        <p>In stiller Trauer<br><b>Gisela Pohl</b>, Nachbarin und Freundin</p>
        <p class="small">Auf Wunsch der Verstorbenen keine Trauerfeier.</p>
      </div>`},
    kassette: {title: 'Kassette', role: null, html: `
      <p class="stamp">Aus der Standuhr · Mehmet spielt sie am Handy ab</p>
      <p>Die Kassette klingt seltsam. Irgendetwas stimmt mit der Laufrichtung nicht.</p>
      <div data-tape="kassette"></div>`},
    sicherungen: {title: 'Zettel am Sicherungskasten', role: null, html: `
      <div class="letter">
        <p>Wenn hier unten alles dunkel ist, Kind:</p>
        <p>1 Diele · 2 Stube · 3 Pumpe · 4 Küche · 5 Dachboden</p>
        <p>Die Pumpe muss laufen, sonst steht der Keller unter Wasser.</p>
        <p>Nie zwei Nachbarn gleichzeitig, die alte Leitung verträgt das nicht.</p>
        <p>Der Dachboden braucht Licht.</p>
        <p>Diele und Dachboden hängen an einer Phase: nie beide.</p>
        <p class="sig">I.</p>
      </div>`},
    dachboden: {title: 'Foto: Dachboden', role: null, html: `
      <p class="stamp">Mehmets Handykamera · Dachboden</p>
      <p>Die Truhe, und was sonst noch hier oben steht. Schaut genau hin.</p>
      <div data-photo="dachboden"></div>`},
    zettel: {title: 'Zerrissener Zettel', role: null, html: `
      <p class="stamp">Lag zerrissen im Mantel an der Garderobe</p>
      <div data-shred="zettel"></div>`},
    ab: {title: 'Anrufbeantworter Notariat', role: null, html: `
      <div class="paper">
        <p class="stamp">Mitschrift · 0571 88 30 11</p>
        <p>„Unser Büro ist bis Montag geschlossen.“</p>
        <p>„Notar Dr. Konrad Hensel ist im Jahr 2019 verstorben. Ein Dr. Hensel ist bei uns nicht mehr tätig.“</p>
        <p>„Bei Betrugsverdacht wenden Sie sich bitte an die Polizei.“</p>
      </div>`},
    testament2: {title: 'Das echte Testament', role: null, html: `
      <div class="letter">
        <p>Mein letzter Wille, geschrieben am 1. März, zwei Tage vor meinem Tod.</p>
        <p>Das Haus am Wehr geht an das Kind meiner Nichte. Nicht an die Gemeinde, nicht an die Weserkraft, und schon gar nicht an Herrn Brand, der sich neuerdings Notar nennt.</p>
        <p>Er war zweimal hier. Beim zweiten Mal hatte er ein Formular dabei und eine Kamera.</p>
        <p>Wer das liest, hat mein Haus betreten. Dann bin ich nicht weit.</p>
        <p class="sig">Irma Kessler</p>
      </div>`},
    brief: {title: 'Brief in der Truhe', role: null, html: `
      <p class="stamp">Briefumschlag · „Für die Erbin. Das Wort kennst du.“</p>
      <p>Verschlüsselt. Irma mochte Rätsel. Die Verschiebung ist so lang wie das Wort, das du schon kennst.</p>
      <div data-cipher="PJO IPU UPJOA AVA. PJO IPU KPY UHLOLY, HSZ KB KLURZA. IPZ NSLPJO, RPUK."></div>`}
  },

  puzzles: {
    tuer: {
      q: 'Schlüsseltresor an der Haustür: vier Ziffern.', ph: 'Code', input: 'digits',
      hash: ['b54de1156a2eb5afc2c750540b230c06c5a11d2291ad6ae6fedcae36d707f90b'],
      near: {'fba7ef71b861d88b23c7ecde10583674de4b3dae714ce5a13e163901acda76df': 'Das ist das Baujahr. Wann kam das Wasser?', '161f16d808ace2419e95357fbb7b5328daba6976d0f3d6a15c91085972c42a81': 'Das ist die Hausnummer.', '6705d82c12db028d73b96bdd617dedf0b02d7c482d53d5cb222525585d8e54e0': 'Fast: Nur das Jahr.'},
      near: {'0763242057b573a7a0e8674f46dbe60bad49f14cc815db37913517c631b13c00': 'Das ist noch rückwärts.', '837065869affbe340e67842f88b157fc6d836e35351695b7723ab081cdecdce0': 'Und welches Wort soll man ihr sagen?'},
      hints: ['Im Testament steht: „Der Schlüssel wartet, seit das Wasser kam.“', 'Zoomt im Foto der Hausfront an die Wand links neben der Tür. Da ist eine Linie und ein Schild.', '1954.']
    },
    uhr: {
      q: 'Mehmet steht an der Standuhr. Auf welche Zeit soll er sie stellen?', input: 'clock',
      hash: ['a048bb22ac0658da5104562902dfc9b245987475d089d8853d4cef73f01e8595', 'a048bb22ac0658da5104562902dfc9b245987475d089d8853d4cef73f01e8595'],
      near: {'ea8b10431d2708f76024acde919f92dfa5c31a2084722f4a0d4944440eba662b': 'Stellt die Zeiger, dann prüfen.', '364efee2ec6e47eff856f3a7818a67f80f2f529cf67ee35e8f259ce58b0bf8dd': 'Das ist das Datum. Gesucht ist die Uhrzeit.'},
      hints: ['„Die Stunde, in der ich ging“: Wann ist Irma gestorben?', 'Die Traueranzeige nennt eine Uhrzeit.', '4:10 Uhr: kleiner Zeiger fast auf der Vier, großer Zeiger auf der Zwei.']
    },
    kassette: {
      q: 'Welches Wort soll man der Nachbarin sagen?', ph: 'Wort',
      hash: ['28263ba72b6f54f209d2b390209e06048648ac61b49b67efb2471d8df3035522'],
      hints: ['Die Kassette ist rückwärts. In der Akte beim Tonband „rückwärts“ ankreuzen.', 'Rückwärts abspielen. Irma nennt ein Wort, das ihre Nachbarin kennt. Ein Tier.', 'Das Wort ist „Libelle“.']
    },
    nummer: {
      q: 'Ruf beim Notariat an. Welche Nummer wählst du?', ph: 'Nummer', input: 'digits',
      hash: ['5c17dc0d87236fa8908f5ac758f8837d5f0cf0e4a9c1b1a6547def341f50362a', 'e05c5968373a4f0dc6dd6abbe8ef35ddf0449ba22d7ed32b8a9d8d386ba93edd'],
      near: {'d1c48506b39361d2e15feee4c1ebabf3cb8a0c80cbea124dde42410a6314aa46': 'Die Vorwahl fehlt.'},
      hints: ['Die Nummer steht klein auf dem Formular, das Hensel geschickt hat.', 'Erbausschlagung, unten: „Rückfragen“.', '0571 88 30 11']
    },
    strom: {
      q: 'Sicherungskasten im Keller: Welche Schalter sollen an sein?', input: 'switches', n: 5,
      labels: ['Diele', 'Stube', 'Pumpe', 'Küche', 'Dach'],
      hash: ['5cd65de66690cc26f02cee4cc909e02cec12d488f88bd9652b6c2e179a8912b6'],
      near: {'32c1a58a979d4ea4310d6c7f32d37cbc9a85150cdaac876818560acd602aa49f': 'Die Pumpe läuft. Aber Mehmet muss gleich nach oben.', '327c3b74868e64d0f0e0fc9331b9dde30ce50901f4ab17016a105b41ffd6d9e0': 'Diele und Dachboden zusammen: Die Phase fliegt raus.', '67d2a09b1d073ca179e56fc99dbf2a3829d87d8002f1e3b06fd478758090fb17': 'Zwei Nachbarn an: Es knallt.', '5a558b598d91f338acca8ab05361c0cf9b3bb633f729d5b4514fc908534220ed': 'Zwei Nachbarn an: Es knallt.'},
      hints: ['Irmas Zettel hat vier Regeln. Fangt mit den sicheren an: Pumpe und Dachboden.', 'Wenn 3 und 5 an sind, müssen ihre Nachbarn 2 und 4 aus. Und die Diele?', 'Nur Pumpe und Dachboden: aus, aus, an, aus, an.']
    },
    truhe: {
      q: 'Die Truhe hat drei Zahlenräder.', ph: 'Code', input: 'digits',
      hash: ['c1248a57a9432737e039f3a3dc0a1d147ca737319f33f55b79f9b9a1f3b79b04'],
      near: {'161f16d808ace2419e95357fbb7b5328daba6976d0f3d6a15c91085972c42a81': 'Das ist die Hausnummer. Lest den Zettel ganz.', '7612f1dcd7ca032480aba15b847959fc095a046ce0bf5bd09ab0f75cb6f250cf': 'Mal drei, nicht mal Baujahr.'},
      hints: ['Setzt den zerrissenen Zettel aus der Akte zusammen.', 'Der Zettel nennt eine Rechnung mit der Hausnummer. Die steht auf einem Schild auf dem Foto der Hausfront.', '238 × 3 = 714.']
    },
    wer: {
      q: 'Wer ist „Gisela Pohl“ wirklich?', ph: 'Name',
      hash: ['1324397d9ab8f6f00d22a207ec5b2ea1001d6b44e52de57c28fb5f487b495512', '6f48759f3fd3b499a9d9c9eb9d321e39484773c3965e437e92832c4a1d531382', '51afc56ceed440566b47555b2850e42819f4e776b414be6f6a3b4d9fe8bcd2d2', '451e3f9d01f43d5a33bc315bb6282b03a26dbc373da396f2c80a2504af65bf5a', '3022f617eb051e9f4072b9b5b3d7efa3622d273ce797fdbcb07c7057c956c9b7'],
      near: {'d57aa9c491327cfff0e5508fa9f04bf57af7bc5b7890d70775a59263556aeb7f': 'Ja, die Perücke vom Dachboden. Aber wem gehört sie?', 'aead285661af00cd960bfd4f80724784384664e71c9389cb2ab64e7d5218e955': 'Ja, die Perücke vom Dachboden. Aber wem gehört sie?', '185ca30f648ede603b98095ec23b60e1f478fde6d7eec37a12cf0e4e3a298d16': 'So nennt sie sich.', 'd28b4a5d562e196323d95dd5dcb657ea62022909f2f427776d7ecea07c381857': 'So nennt sie sich.', 'c39460eef77c372e3f0d49a57f2c0c8bc150433c986cc99fbf3d2c9c71907dc9': 'Wessen Tante? Den Namen bitte.'},
      hints: ['Legt das Bild aus der Traueranzeige neben Frau Pohls Kamerabild.', 'Leberfleck über der Lippe, Libellenbrosche. Und auf dem Dachboden: Perücke mit Dutt und eine Schildpattbrille.', 'Frau Pohl ist Irma Kessler.']
    }
  },

  endings: {
    verzicht: {title: 'Ausgang: VERZICHT', code: 'HW-VERZICHT',
      text: 'Du unterschreibst, ohne das Haus gesehen zu haben. Dr. Hensel bedankt sich sehr herzlich. Im Frühjahr wird das Haus am Wehr abgerissen, für ein Wasserkraftwerk.',
      epilog: 'Ein Jahr später kommt ein Päckchen ohne Absender. Darin eine Kassette und ein Zettel: „Schade. Du hättest mich gemocht. I.“'},
    mitternacht: {title: 'Ausgang: MITTERNACHT', code: 'HW-MITTERNACHT',
      text: 'Die Standuhr schlägt zwölf. Die Frist ist um, die Truhe bleibt zu. Ohne das echte Testament gilt das alte, und das Formular des falschen Notars liegt schon beim Amt.',
      epilog: 'Mehmet schickt dir Wochen später ein Foto: Das Haus ist eingerüstet. Am Bauzaun hängt eine Libelle aus Draht. Niemand weiß, wer sie aufgehängt hat.'},
    haus: {title: 'Ausgang: DAS HAUS', code: 'HW-HAUS',
      text: 'Der falsche Notar heißt Rüdiger Brand und arbeitet für die Weserkraft. Die Polizei holt ihn noch in der Nacht ab. Das echte Testament gilt: Das Haus am Wehr gehört dir.',
      epilog: 'Beim ersten Besuch stellst du die Standuhr. Am nächsten Morgen steht ein Apfelkuchen vor der Tür. Daneben eine Libellenbrosche. Frau Pohl ist verreist, sagt der Briefträger. Für länger.'},
    irma: {title: 'Ausgang: LIBELLE', code: 'HW-LIBELLE',
      text: 'Gisela Pohl nimmt die Brille ab. „Irma. Freut mich, dich endlich kennenzulernen.“ Sie hat ihren Tod nur erfunden, um zu sehen, wer kommt: der Betrüger oder die Familie. Du bist gekommen.',
      epilog: 'Sonntags rufst du jetzt bei deiner Großtante an. Sie trinkt Tee, du erzählst. Manchmal löst ihr zusammen ein Rätsel. Sie gewinnt fast immer.'}
  },
  codes: {'7d671e3446e248b84ef16bdc09f327a4b6d727cb6bbcad7d9ef58722bda0d72c': 'verzicht', 'd2555b7ba9fdb8156d931869cb89edadf1f0f90c2b1d2cfd2b7cdbe30e32dc70': 'mitternacht', '20dc9fb6c8c989d431e16b8852121450f8579577ade655d0cd1b9260a2c4d6aa': 'haus', '159ed00b3549022ee75ceb3613d823478fd73798f343d0587f58970aeb4fa79c': 'irma'},

  script: [
    // ---------- Kapitel 1 ----------
    ['chapter', 1, 'Testamentseröffnung'],
    ['ambience', 'wartemusik'],
    ['goal', 'Das Notariat wählt sich gleich ein.'],
    ['wait', 2500],
    ['join', 'hensel'],
    ['ambience', null],
    ['say', 'hensel', 'Guten Abend, {me}. Hensel, Notariat am Domplatz. Danke, dass Sie sich so spät noch Zeit nehmen.'],
    ['say', 'hensel', 'Bevor ich beginne, muss ich Sie identifizieren. Bitte schalten Sie Ihre Kamera ein.'],
    ['goal', 'Der Notar will dich sehen: Kamera an.'],
    ['quiet', 'camOn', 'hensel', 'Danke. Sehr gut. Das genügt mir.', 'Ich sehe Sie noch nicht. Die Kamera, bitte.'],
    ['snap'],
    ['fx', 'mirror', {npc: 'hensel', label: 'GESICHT ERFASST'}],
    ['say', 'hensel', 'Sie sind die letzte lebende Verwandte von Frau Irma Kessler. Frau Kessler ist am dritten März verstorben. Mein Beileid.'],
    ['say', 'hensel', 'Ich verlese das Testament. Es ist … ungewöhnlich formuliert.'],
    ['unlock', 'testament'],
    ['goal', 'Lies Irmas Testament in der Akte.'],
    ['wait', 6000],
    ['say', 'hensel', 'Frau Kessler war in den letzten Jahren etwas eigen. Rechtlich ist es einfach: Das Haus ist hoch verschuldet. Ich empfehle Ihnen, das Erbe auszuschlagen.'],
    ['unlock', 'verzicht'],
    ['say', 'hensel', 'Ich habe Ihnen das Formular geschickt. Die Frist endet heute um Mitternacht. Unterschreiben Sie einfach, dann ist es erledigt.'],
    ['goal', 'Der Notar will, dass du sofort unterschreibst.'],
    ['vote', {id: 'sofort', prompt: 'Dr. Hensel: „Unterschreiben Sie jetzt, dann haben Sie keine Sorgen mehr.“', options: [
      {id: 'unterschreiben', label: 'Unterschreiben', desc: 'Ein verschuldetes Haus braucht niemand.'},
      {id: 'ansehen', label: 'Erst das Haus sehen', desc: 'So steht es im Testament.'}
    ]}],
    ['branch', s => s.results.sofort === 'ansehen', 'ansehen'],
    ['say', 'hensel', 'Eine weise Entscheidung. Ich danke Ihnen sehr.'],
    ['ending', 'verzicht'],

    ['label', 'ansehen'],
    ['say', 'hensel', 'Wie Sie meinen. Ich habe einen Schlüsseldienst vor Ort, damit Sie sich überzeugen können. Ich schalte ihn dazu.'],
    ['goal', 'Der Schlüsseldienst ruft an.'],
    ['call', 'mehmet', {note: 'Schlüsseldienst Aydın · Handy'}],
    ['say', 'mehmet', 'Hallo? Ah, jetzt. Aydın, Schlüsseldienst. Ich stehe vor dem Haus, es schüttet.'],
    ['say', 'mehmet', 'Ich dreh mal die Kamera um. Da ist ein Schlüsseltresor neben der Tür. Vier Ziffern. Aufbohren dauert eine Stunde. Haben Sie den Code?'],
    ['pose', 'mehmet', 'haus'],
    ['unlock', 'hausfoto'],
    ['goal', 'Finde den Code für den Schlüsseltresor.'],
    ['solve', 'tuer', {npc: 'hensel', every: 45000, taunts: ['Das Wetter wird nicht besser, {me}.', 'Sie können auch einfach unterschreiben.']}],
    ['fx', 'right'],
    ['say', 'mehmet', 'Klick! Offen. Wie kommen Sie da drauf? Egal. Ich geh rein.'],
    ['pose', 'mehmet', 'stube'],
    ['ambience', 'hum'],
    ['say', 'mehmet', 'Riecht nach Lavendel und Staub. Da ist eine große Standuhr. Die steht.'],
    ['wait', 1500],

    // ---------- Kapitel 2 ----------
    ['chapter', 2, 'Die Standuhr'],
    ['say', 'hensel', 'Hier, falls es Sie interessiert: die Traueranzeige. Von der Nachbarin aufgegeben. Eine Beerdigung gab es nicht.'],
    ['unlock', 'traueranzeige'],
    ['goal', 'Im Testament steht: Stelle die Uhr auf die Stunde, in der ich ging.'],
    ['solve', 'uhr', {npc: 'mehmet', every: 50000, taunts: ['Ich hab die Zeiger in der Hand. Sagen Sie mir einfach, wohin.', 'Die Uhr ist schöner als mein ganzes Wohnzimmer.']}],
    ['fx', 'shake'],
    ['say', 'mehmet', 'Sie schlägt! Vier Mal. Und unten am Gehäuse springt eine Klappe auf. Da liegt eine Kassette.'],
    ['say', 'mehmet', 'Da steht drauf: Nur für die Erbin. Nicht für H.'],
    ['say', 'hensel', 'Eine Kassette? Spielen Sie sie ab, Herr Aydın. Ich höre mit.'],
    ['say', 'mehmet', 'Moment, mein Handy spinnt.'],
    ['chat', 'mehmet', 'Ich glaube, die ist nicht für ihn. Mach dein Mikro aus, ich will kurz nur mit dir reden.'],
    ['goal', 'Mehmet will nicht, dass der Notar mithört: Mikro aus.'],
    ['quiet', 'mic', 'mehmet', 'Okay. Ich schick dir die Aufnahme direkt. Dem Notar sag ich, das Band ist kaputt.', 'Dein Mikro ist noch an. Ich sag lieber nichts.'],
    ['unlock', 'kassette'],
    ['say', 'mehmet', 'Herr Doktor? Bandsalat. Da ist nichts drauf.'],
    ['pose', 'hensel', 'hensel-ungeduld'],
    ['say', 'hensel', 'Wie bedauerlich.'],
    ['pose', 'hensel', null],
    ['goal', 'Hör dir die Kassette an. Welches Wort nennt Irma?'],
    ['solve', 'kassette'],
    ['wait', 1500],

    // ---------- Kapitel 3 ----------
    ['chapter', 3, 'Die Nachbarin'],
    ['say', 'mehmet', 'Da klopft jemand an die Scheibe. Eine ältere Dame mit Regenschirm. Sie will in den Anruf, ich geb ihr den Link.'],
    ['goal', 'Jemand klopft an.'],
    ['knock', 'pohl'],
    ['join', 'pohl'],
    ['say', 'pohl', 'Pohl. Ich wohne nebenan. Ich habe Licht gesehen. Wer sind Sie, und was machen Sie in Irmas Haus?'],
    ['goal', 'Gewinne Frau Pohls Vertrauen.'],
    ['ask', 'pohl', {prompt: 'Frau Pohl mustert dich über ihr Tablet.', options: [
      {id: 'erbe', label: '„Ich bin Irmas Erbin. Der Notar hat mich angerufen.“',
        say: ['Das kann jeder sagen. Der Notar war schon zweimal hier. Mit dem rede ich nicht.']},
      {id: 'libelle', label: '„Libelle.“', needs: ['kassette'], set: {vertraut: true}, end: true,
        say: ['Ach. Dann hat sie dich wirklich geschickt.', 'Gut. Hör mir zu. Und lass den Herrn Doktor nicht merken, dass wir reden.']},
      {id: 'irma', label: '„Wie war Irma so?“',
        say: ['Stur. Klug. Und sie hat Rätsel geliebt. Sie hat ihr ganzes Haus damit vollgestopft.']}
    ]}],
    ['chat', 'pohl', 'Irma hatte Angst vor diesem Notar. Die Weserkraft will das Wehr umbauen, das Haus muss weg. Ohne die Erbin kein Verkauf.'],
    ['chat', 'pohl', 'Ruf beim Notariat an. Die Nummer steht auf seinem Formular. Nicht die, die er dir sagt.'],
    ['set', 'pohl_erzaehlt', true],
    ['goal', 'Ruf beim Notariat am Domplatz an.'],
    ['solve', 'nummer'],
    ['fx', 'ring'],
    ['wait', 2500],
    ['join', 'notariat'],
    ['say', 'notariat', 'Notariat am Domplatz, guten Abend. Unser Büro ist bis Montag geschlossen.'],
    ['say', 'notariat', 'Bitte beachten Sie: Notar Doktor Konrad Hensel ist im Jahr zweitausendneunzehn verstorben. Ein Doktor Hensel ist bei uns nicht mehr tätig.'],
    ['say', 'notariat', 'Bei Betrugsverdacht wenden Sie sich bitte an die Polizei.'],
    ['leave', 'notariat', 'off'],
    ['unlock', 'ab'],
    ['pose', 'hensel', 'hensel-ungeduld'],
    ['say', 'hensel', 'Sie telefonieren nebenher? Mit wem denn, wenn ich fragen darf?'],
    ['lockLeave', true],
    ['say', 'hensel', 'Genug. Unterschreiben Sie jetzt. Die digitale Signatur scannt Ihr Gesicht. Bitte direkt in die Kamera sehen.'],
    ['chat', 'pohl', 'NICHT! Halt die Kamera mit der Hand zu! Ausschalten reicht nicht, das hat er bei Irma auch so gemacht.'],
    ['goal', 'Halte deine Kamera zu, damit der falsche Notar dein Gesicht nicht scannen kann. Kamera AN lassen.'],
    ['fx', 'mirror', {npc: 'hensel', label: 'SIGNATUR 64 %'}],
    ['quiet', 'covered', 'pohl', 'Gut so. Mit einem Standbild von dir hätte er unterschreiben können.', 'Er sieht dich noch!'],
    ['say', 'hensel', 'Ihre Kamera hat offenbar Probleme. Kein Grund zur Sorge. Wir haben Zeit bis Mitternacht.'],
    ['pose', 'hensel', null],
    ['wait', 1200],

    // ---------- Kapitel 4 ----------
    ['chapter', 4, 'Der Keller'],
    ['fx', 'flash'],
    ['dark', true],
    ['ambience', 'storm'],
    ['say', 'mehmet', 'Licht ist aus! Im ganzen Haus. Und unten im Keller plätschert was. Ich geh runter.'],
    ['pose', 'mehmet', 'keller'],
    ['unlock', 'sicherungen'],
    ['say', 'mehmet', 'Alter Sicherungskasten, fünf Drehschalter. Da klebt ein Zettel von deiner Tante dran.'],
    ['goal', 'Im Dunkeln: Bring den Strom zurück, ohne dass die alte Leitung durchbrennt.'],
    ['solve', 'strom', {npc: 'mehmet', every: 40000, taunts: ['Das Wasser steht mir schon an den Schuhen.', 'Ich fass da nichts an, bevor du sicher bist.']}],
    ['dark', false],
    ['say', 'mehmet', 'Licht! Und die Pumpe läuft. Der Keller stand schon knöcheltief.'],
    ['fx', 'shake'],
    ['say', 'mehmet', 'Mist. Die Kellertür ist zugefallen. Die klemmt. Frau Pohl hört mich über ihr Tablet nicht, aber dich. Ruf so laut du kannst!'],
    ['goal', 'Mehmet sitzt im Keller fest. Ruf laut, damit Frau Pohl es hört.'],
    ['clap', {label: 'Laut rufen: „Frau Pohl!“', text: 'Ruf oder klatsch so laut, dass Frau Pohl es über ihr Tablet hört. Mikro an!'}],
    ['say', 'pohl', 'Ich hab dich gehört! Ich hab noch einen Schlüssel von Irma. Ich gehe rüber.'],
    ['wait', 3000],
    ['say', 'mehmet', 'Danke, Frau Pohl. Sie haben ja wirklich einen Schlüssel für alles.'],
    ['say', 'pohl', 'Irma und ich, wir hatten keine Geheimnisse. Fast keine. Auf dem Dachboden steht eine Truhe.'],
    ['ambience', 'hum'],
    ['wait', 1200],

    // ---------- Kapitel 5 ----------
    ['chapter', 5, 'Der Dachboden'],
    ['say', 'hensel', 'Es ist {time}. Ich darf Sie daran erinnern: Um Mitternacht verfällt Ihr Recht. Dann gilt das Formular.'],
    ['timer', 600000, 'Frist'],
    ['pose', 'mehmet', 'dachboden'],
    ['unlock', 'dachboden'], ['unlock', 'zettel'],
    ['say', 'mehmet', 'Dachboden. Hier ist die Truhe. Drei Zahlenräder. Und im Mantel an der Garderobe lag ein zerrissener Zettel, den hab ich dir geschickt.'],
    ['say', 'mehmet', 'Hier oben steht noch allerhand Kram. Schau dir das Foto ruhig genau an.'],
    ['goal', 'Öffne die Truhe vor Mitternacht.'],
    ['solve', 'truhe', {npc: 'hensel', every: 50000, onFail: 'mitternacht', taunts: ['Die Uhr läuft, {me}.', 'Was suchen Sie da oben eigentlich?']}],
    ['timer', null],
    ['say', 'mehmet', 'Die Räder drehen sich. Der Deckel ist schwer, der klemmt. Halt mal das Licht ruhig, ich hebel ihn auf.'],
    ['hold', {label: '🔦 Gedrückt halten: Licht ruhig halten', ms: 2500}],
    ['say', 'mehmet', 'Auf! Da liegen Briefe. Ein Testament, mit Datum. Und ein Umschlag: Für die Erbin.'],
    ['unlock', 'testament2'], ['unlock', 'brief'],
    ['goto', 'verhoer'],

    ['label', 'mitternacht'],
    ['fx', 'ring'],
    ['say', 'hensel', 'Mitternacht. Die Frist ist verstrichen. Ich danke Ihnen für Ihre Zeit.'],
    ['ending', 'mitternacht'],

    ['label', 'verhoer'],
    ['goal', 'Überführe den falschen Notar. Du brauchst Beweise.'],
    ['ask', 'hensel', {prompt: 'Dr. Hensel wartet. Er lächelt nicht mehr.', options: [
      {id: 'wer', label: '„Wer sind Sie wirklich?“', say: ['Doktor Konrad Hensel. Das steht auf jedem meiner Schreiben.']},
      {id: 'schulden', label: '„Wem schuldet das Haus Geld?“', say: ['Der Sparkasse. Die Unterlagen reiche ich nach.']},
      {id: 'mord', pose: 'hensel-ungeduld', label: '„Sie haben Irma umgebracht!“', tag: 'accuse', wrong: true,
        say: ['Wie bitte? Frau Kessler ist friedlich eingeschlafen. Das steht in der Traueranzeige. Mäßigen Sie sich.']},
      {id: 'tot', pose: 'hensel-ungeduld', label: '„Der echte Dr. Hensel ist 2019 gestorben.“', tag: 'proof', needs: ['ab'], set: {beweis_ab: true},
        say: ['… Ein Missverständnis. Ich vertrete die Kanzlei nur. Kommissarisch.']},
      {id: 'testament', label: '„Ich habe Irmas Testament. Es ist neuer als Ihres.“', tag: 'proof', needs: ['testament2'], set: {beweis_testament: true},
        say: ['Ein Zettel aus einer Truhe. Das hält vor keinem Gericht.']},
      {id: 'weserkraft', pose: 'hensel-ungeduld', label: '„Sie arbeiten für die Weserkraft.“', tag: 'proof', needs: ['pohl_erzaehlt', 'beweis_ab'], set: {beweis_firma: true},
        say: ['Wer hat Ihnen das …? Die Alte von nebenan. Natürlich.']},
      {id: 'polizei', label: '„Ich rufe die Polizei, Herr … wie heißen Sie wirklich?“', tag: 'proof', needs: ['beweis_ab', 'beweis_testament'], end: true,
        say: ['Brand. Rüdiger Brand. Und glauben Sie nicht, dass das hier vorbei ist.']}
    ]}],
    ['lockLeave', false],
    ['fx', 'crash', 2500],
    ['leave', 'hensel', 'off'],
    ['wait', 3000],
    ['say', 'mehmet', 'Er ist weg. Ich hab die Polizei angerufen, die sind in zehn Minuten hier. Ich bleib so lange.'],
    ['say', 'pohl', 'Das hast du gut gemacht. Irma wäre stolz auf dich.'],
    ['goal', 'Was sagst du Frau Pohl?'],
    ['ask', 'pohl', {prompt: 'Frau Pohl lächelt in ihre Teetasse.', options: [
      {id: 'danke', label: '„Danke, Frau Pohl. Ohne Sie hätte ich unterschrieben.“', end: true,
        say: ['Ach was. Ich hab nur aufgepasst. Das ist mein Hobby.']},
      {id: 'durchschaut', label: '„Frau Pohl … ich glaube, Sie sind nicht Frau Pohl.“', set: {entlarven: true}, end: true,
        say: ['So? Wer soll ich denn sonst sein?']}
    ]}],
    ['branch', s => !s.flags.entlarven, 'ende'],
    ['goal', 'Sag ihr, wer sie wirklich ist.'],
    ['solve', 'wer', {npc: 'pohl', every: 40000, taunts: ['Ich warte, Kind. Ich bin geduldig.', 'Schau genau hin. Du hast doch Irmas Augen.']}],
    ['pose', 'pohl', 'pohl-reveal'],
    ['fx', 'flash'],
    ['say', 'pohl', 'Na endlich. Die Brille hat mich ohnehin gedrückt.'],
    ['say', 'pohl', 'Ich wollte sehen, wer kommt, wenn ich weg bin. Der Betrüger oder die Familie. Du bist gekommen.'],
    ['say', 'mehmet', 'Moment. Sie sind die Tote?'],
    ['say', 'pohl', 'Die Tote macht Ihnen gleich einen Tee, junger Mann. Sie sind ja ganz nass.'],
    ['ending', 'irma'],

    ['label', 'ende'],
    ['ending', 'haus']
  ]
}
