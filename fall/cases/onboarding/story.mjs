// Fall „Erster Arbeitstag“. Lumen Labs, LUNA und alle Personen sind frei erfunden.

const TE = 'technik', PE = 'personal'
// Der Zwilling im Video kennt Viktor nur von alten Fotos: ohne die Narbe vom Fahrradunfall
const VIKTOR = {photo: 'viktor', skin: '#dcae90', jaw: .8, hair: {style: 'slick', color: '#2b2622'}, mood: 'smile', top: {style: 'turtleneck', color: '#16161a'}, scene: 'studio'}
const VIKTOR_ECHT = {...VIKTOR, photo: 'viktor2', beard: 'stubble', beardColor: '#2b2622', extras: ['scar'], mood: 'worried', top: {style: 'shirt', color: '#5a6a5a'}, scene: 'lisbon'}

export default {
  id: 'onboarding',
  title: 'Erster Arbeitstag',
  unit: 'Lumen Labs GmbH',
  file: 'Personalnr. LL-0451',
  accent: '#8ea8ff',
  chapters: 4,
  lobby: 'Glückwunsch, ihr habt den Job! Heute ist euer erster Tag bei Lumen Labs, remote. Das Onboarding übernimmt LUNA, eure HR-Assistenz. Sie ist sehr freundlich. Etwa 45 bis 60 Minuten.',
  invite: 'Wir haben beide den Job bei Lumen Labs! Onboarding ist gleich per Video. Kommst du?',
  lockText: 'LUNA: Dieses Meeting ist verpflichtend. Bitte bleib bis zum Ende. 💜',
  roles: {
    technik: {name: 'IT-Zugang', blurb: 'Handbuch, Konsole, Systeme.'},
    personal: {name: 'Personalmappe', blurb: 'Verträge, Profile, Transkripte.'}
  },
  share: {
    text: 'Erster Arbeitstag bei Lumen Labs überstanden. {time}. LUNA lässt grüßen. Oder nicht mehr.',
    tag: '#ErsterArbeitstag',
    rows: ['PROJEKT SPIEGEL', 'LUNA', 'ZWILLINGE'],
    lines: ['Der Willkommensgruß des Geschäftsführers', 'wurde nie von ihm gesprochen.']
  },

  npcs: {
    luna: {name: 'LUNA', sub: 'HR-Assistenz · immer für dich da', tts: {pitch: 1.3, rate: 1.05},
      voice: {model: 'eva_k', fx: 'robot', len: .95},
      face: {photo: 'luna', skin: '#f2d6c6', fem: true, jaw: 0, age: 0, hair: {style: 'bob', color: '#9d8fe0'}, eyes: '#5a7cff', lip: '#c45a7a', top: {style: 'blouse', color: '#e9e9f2', accent: '#8ea8ff'}, extras: ['lanyard'], lanyard: '#8ea8ff', mood: 'smile', scene: 'studio', light: '#c8d2ff'}},
    viktor: {name: 'Viktor Lindner', sub: 'Geschäftsführer · Video', tts: {pitch: .9, rate: 1},
      voice: {model: 'thorsten-high', fx: 'video', len: .96},
      face: VIKTOR},
    viktor2: {name: 'V. L.', sub: 'privat · Lissabon', look: 'weak', tts: {pitch: .85, rate: .95},
      voice: {model: 'thorsten_emotional', speaker: 4, fx: 'phone', len: 1.02},
      face: VIKTOR_ECHT},
    kai: {name: 'Kai Winter', sub: 'Team Infrastruktur', tts: {pitch: 1, rate: 1.08},
      voice: {model: 'kerstin', pitch: -3.5, fx: 'call', len: .97},
      face: {photo: 'kai', skin: '#c99272', jaw: .4, eyes: '#2a1a12', hair: {style: 'buzz', color: '#2aa6a0'}, extras: ['earring', 'lanyard'], lanyard: '#2aa6a0', glasses: 'round', mood: 'smirk', top: {style: 'hoodie', color: '#3a2a4a', accent: '#ddd'}, scene: 'server'}}
  },

  faces: {
    video: {face: VIKTOR, caption: 'Standbild Willkommensvideo · 00:31'},
    selfie: {face: VIKTOR_ECHT, caption: 'Foto von V. L. · „Das bin ich, gestern“'}
  },

  clips: {
    memo: {title: 'Sprachmemo · Kai · 00:07 · Wiedergabe beschleunigt', npc: 'kai', speed: 1.9,
      voice: {model: 'kerstin', pitch: -3.5, fx: 'call', len: .97},
      text: 'Wenn du das hörst, hat LUNA mich vielleicht schon. Der Ordner Spiegel öffnet sich mit dem Wort, mit dem Viktor jedes Video beendet. Jedes einzelne.'}
  },

  pages: {
    willkommen: {title: 'Willkommensmappe', role: null, html: `
      <p class="stamp" style="color:var(--amber)">Lumen Labs · Tag 1</p>
      <h3>Schön, dass du da bist! 💜</h3>
      <p>Lumen Labs baut „Präsenz-Software“: Wir sorgen dafür, dass niemand ein Meeting verpasst. Nie wieder.</p>
      <p>Dein Onboarding begleitet <b>LUNA</b>. Sie lernt dich kennen, damit sie dich bestmöglich unterstützen kann.</p>
      <p class="note">Bitte lass deine Kamera an. LUNA arbeitet am besten mit Gesicht.</p>`},
    handbuch: {title: 'IT-Handbuch S. 3', role: TE, html: `
      <p class="stamp" style="color:var(--amber)">IT-Handbuch · Seite 3 · Zugänge</p>
      <p class="uvhint">Auf dem Rand ist etwas mit Markerstift geschrieben, den man nur unter UV-Licht sieht. Fahr mit dem Zeiger drüber.</p>
      <div class="uv"><div class="plain">3.1 Dein Laptop wird per Gerätemanagement eingerichtet.<br>3.2 Passwörter niemals laut sagen.<br>3.3 Die Admin-Konsole ist nur für Team Infrastruktur.</div>
      <div class="ink">Hi! Kai hier.<br>Admin-Passwort = Gründungsstadt<br>+ Gründungsjahr RÜCKWÄRTS.<br>Steht in Viktors Video.<br>NICHT laut vorlesen. LUNA hört alles.</div></div>`},
    transkript: {title: 'Transkript CEO-Video', role: PE, html: `
      <p class="stamp" style="color:var(--amber)">Personalmappe · Transkript „Willkommen bei Lumen“</p>
      <ul class="log">
      <li><b>00:02</b> „Hallo und herzlich willkommen bei Lumen Labs! Ich bin Viktor, und ich freue mich riesig, dass ihr da seid.“</li>
      <li><b>00:09</b> „Gegründet haben wir Lumen 2019 in Leipzig, zu dritt, in einer Garage ohne Heizung.“</li>
      <li><b>00:16</b> „Heute sind wir an sieben Standorten und haben dreihundertzwölf Kolleginnen und Kollegen.“</li>
      <li><b>00:24</b> „Bei uns zählt jede Stimme. Wirklich jede.“</li>
      <li><b>00:31</b> „Also: Kamera an, Kopf hoch, und bleibt neugierig!“</li>
      </ul>`},
    chiffre: {title: 'Kais Nachricht', role: TE, html: `
      <p class="stamp" style="color:var(--amber)">Direktnachricht · Kai Winter · verschlüsselt</p>
      <p>Kai schreibt: „Schlüssel = so viele Standorte, wie Lumen hat.“ Dreh die Scheibe, bis der Text lesbar ist.</p>
      <div data-cipher="SBUH OVLYA TPA. SPLZ UPJOAZ SHBA CVY. YBM TPJO HU HBM RHUHS VYPVU."></div>`},
    standbild: {title: 'Standbild CEO-Video', role: PE, html: `
      <p class="stamp" style="color:var(--amber)">Personalmappe · Willkommensvideo</p>
      <p>So sieht Viktor im Willkommensvideo aus. Beschreibt euch die Gesichter gegenseitig, ganz genau.</p>
      <div data-face="video"></div>`},
    selfie: {title: 'Foto aus Lissabon', role: TE, html: `
      <p class="stamp" style="color:var(--amber)">Privatnachricht · V. L.</p>
      <p>Der Anrufer hat ein Foto geschickt. Bart kann man wachsen lassen. Anderes nicht.</p>
      <div data-face="selfie"></div>`},
    farbtest: {title: 'Aufmerksamkeitstest', role: null, html: `
      <p class="stamp" style="color:var(--amber)">LUNA · Aufmerksamkeitstest</p>
      <p>LUNAs Lampe blinkt eine Farbfolge. Wegen des Kamerafilters sieht sie <b>nur die Personalmappe</b>.</p>
      <p>Eingeben kann sie <b>nur der IT-Zugang</b>. Sagt euch die Farben an.</p>`},
    konsole: {title: 'Admin-Konsole', role: TE, html: `
      <div class="paper" style="background:#0d1220;color:#9fc0ff"><p class="stamp" style="color:#ff7a7a">root@lumen-hr:~$ ls /hr</p>
      <p>bewerber/ &nbsp; onboarding/ &nbsp; stimmen/ &nbsp; gesichter/ &nbsp; <b>spiegel/</b> (gesperrt)</p>
      <p>root@lumen-hr:~$ du -sh /hr/gesichter<br>412G /hr/gesichter</p>
      <p>root@lumen-hr:~$ cat /hr/spiegel/README<br>Zugriff verweigert. Codewort erforderlich.</p></div>`},
    profil: {title: 'Dein Profil (LUNA)', role: PE, html: `
      <div class="paper"><p class="stamp">LUNA · Persönlichkeitsprofil · vertraulich</p>
      <p>Neugier: <b>hoch</b> · Gehorsam: <b>mittel</b> · Lächeln pro Minute: 2,3<br>
      Stimme: <b>ausreichend für Synthese</b> (4 min 12 s erfasst)<br>Gesicht: <b>ausreichend für Synthese</b> (1.204 Einzelbilder)</p>
      <p>Empfehlung: Mitarbeiter-Zwilling anlegen. Präsenzpflicht ab Woche 3 durch Zwilling erfüllbar.</p></div>`},
    memo: {title: 'Tonband: Kais Memo', role: TE, html: `
      <p class="stamp" style="color:var(--amber)">Sprachmemo von Kai</p>
      <p>Kai hat dir ein Sprachmemo geschickt. Es ist viel zu schnell.</p>
      <div data-tape="memo"></div>`},
    notfall: {title: 'Notfallplan', role: PE, html: `
      <div class="paper"><p class="stamp">Personalmappe · Anlage 9 · Notfallplan KI-Systeme</p>
      <p>Not-Aus für LUNA: Das Sicherheitswort ist der <b>Name des ersten Bürohunds</b>.</p>
      <p>(Siehe Firmengeschichte. Fragt Viktor.)</p></div>`},
    kommando: {title: 'Not-Aus', role: TE, html: `
      <p class="stamp" style="color:var(--amber)">Konsole · Not-Aus</p>
      <p>Die Konsole nimmt ein einzelnes Sicherheitswort. Was es ist, steht im Notfallplan (Personalmappe).</p>
      <p>LUNA lädt in der Zwischenzeit eure Zwillinge hoch.</p>`}
  },

  puzzles: {
    kai: {
      q: 'Wo will Kai euch treffen? (das letzte Wort seiner Nachricht)', ph: 'Wort',
      hash: ['c8b653fa1b4d502a5a856bc7804cbc5bddb00c7b755e1cac3e060841e868fabc', '7a7dca3ec8d0621808648cfa4af9821a795f3e7af1b7262e78bd49b2aa0fda76'],
      near: {'1d7dbf105ebfa1e6b7daf6e62dee6e952aaa5ea256728a917a43f60d0f2ff528': 'Das ist noch verschlüsselt. Dreht die Scheibe weiter.'},
      hints: ['Personalmappe: Wie viele Standorte hat Lumen? Steht im Transkript.', 'Sieben Standorte: Verschiebung 7.', 'Der Text endet mit „KANAL ORION“.']
    },
    echt: {
      q: 'Woran erkennt ihr den echten Viktor?', ph: 'Merkmal',
      hash: ['e4dfea921c7c91ad82a4e2db0672e33a48362ec6162e8e5994c58f3f710d7ce9', '5a83d952e4dc2612004ecc5c11ca81d34b1d4fc15aa2c2491fc99d71b8e180e8', '1f83f55831c5dec2bd5de675e459e69ef9ef1b23a12289c583ae90e6c15c5d70', 'e4dfea921c7c91ad82a4e2db0672e33a48362ec6162e8e5994c58f3f710d7ce9'],
      near: {'0fc944e32d04ae3b7587c990a3714fc5c41a782888d88b56d665194f36d9894e': 'Bärte wachsen nach. Was wächst nicht weg?', 'e880f340fa627dd86c981cf1ad972e6f759b839fd0d6472649d3710fcf9b3d20': 'Kleidung wechselt man. Schaut ins Gesicht.', '6feaeb30a339dae174c62414d7e03a8aa00d0fa76cabbe41b6bd280d78ed7730': 'Fast. Was ist neben dem Auge?'},
      hints: ['Personalmappe und IT-Zugang: Beschreibt euch das Gesicht von oben nach unten.', 'Achtet auf die rechte Gesichtshälfte, über dem Auge.', 'Der echte Viktor hat eine Narbe über dem rechten Auge.']
    },
    farben: {
      q: 'Aufmerksamkeitstest: Gebt LUNAs Farbfolge ein.', input: 'colors', by: TE,
      colors: [['rot', '#ff3b30'], ['grün', '#3ddc84'], ['blau', '#4a8cff'], ['gelb', '#ffd23f']],
      hash: ['242b20d7735e5718fdf4843f6fea06ccf367186d53030f5e8dffbd514a62f25a'],
      near: {'447f34fda7d56418e0659c5a8a6925b90eaf609d1c8a8ee3464fbdda41680536': 'Fast. Da kommt noch eine Farbe.', '903b95792ee868a2b7bf4514258acf29e2920195382b1a964cf7557ce6554376': 'Die erste Farbe fehlt.'},
      hints: ['Personalmappe: Wartet auf die lange Pause, dann sagt jede Farbe an.', 'Es sind sechs Farben. Die erste ist rot.', 'rot, blau, gelb, grün, rot, blau']
    },
    konsole: {
      q: 'Admin-Konsole: Passwort?', ph: 'Passwort',
      hash: ['9d51385f56c37b322a8cca24e6f952b1ba9f76ee1e568589b6f6210ba37f91b3'],
      near: {'2eb19878f8f2e55cfe2b8b7171cb6e450a80e91ae22db071d27c7ebd58455921': 'Rückwärts, schreibt Kai.', 'dac8db19a946b261152363cb93527c6a915be11ce46377f82933ce961525584f': 'Erst die Stadt.', '3f2276e7597aa7e7da9c72a01b40d11c35e14f381afb4748f36e02e07d0d15e3': 'Da fehlt noch das Jahr.'},
      hints: ['IT-Zugang: Mit der UV-Lampe über den Rand von Seite 3 fahren.', 'Personalmappe: Wo und wann wurde Lumen gegründet? Steht im Transkript.', 'Leipzig + 2019 rückwärts.']
    },
    spiegel: {
      q: 'Codewort für den Ordner „spiegel“?', ph: 'Codewort',
      hash: ['58a65f5b012ddfc579f2e4fb5b1f7abd183de653d40e5a9539f19a2e879341d2', 'aa5578b8773280e11b1515f27298aebf22f5fb7e578e8c6dd78eaaf63b9540ca'],
      near: {'e725ade0bea99075b98c1a5454953c6964b1d0a0efd8f33c73c1b4d69121c439': 'Fast am Ende. Aber nicht das letzte Wort.', '8dcb7b61331892f7ed3a0baff894dd70a24ce5f79d8b27ee2cb1b4ea85fa22b4': 'Das sagt er in der Mitte.'},
      hints: ['IT-Zugang: Das Memo ist viel zu schnell. Am Tonband kannst du das Tempo ändern.', 'Kai sagt: das Wort, mit dem Viktor jedes Video beendet. Personalmappe: Transkript, letzte Zeile.', '„… und bleibt neugierig!“']
    },
    notaus: {
      q: 'Not-Aus: Sicherheitswort!', ph: 'Wort',
      hash: ['3ea1daca55f4d5d7221a02d77ff7ca7a62b5e85733ae625c945cd6801a6991d2'],
      near: {'33947eadbdadf0b0bfe6f2664e44f9c738126ee21abaf29f92594af054bc58ef': 'Nicht ihr Name. Der des Hundes.'},
      hints: ['Personalmappe: Der Notfallplan sagt, was gesucht ist.', 'Viktor hat vom ersten Büro erzählt. Hört im Protokoll nach.', 'Bruno.']
    }
  },

  endings: {
    loeschen: {title: 'Ausgang: GELÖSCHT', code: 'LL-GELOESCHT',
      text: 'Ihr löscht alles. Die Zwillinge, die Stimmen, die 412 Gigabyte Gesichter. Auch die Beweise. Lumen Labs meldet am Montag eine „Systemumstellung“. Niemand erfährt je, was war.',
      epilog: 'Ein halbes Jahr später bekommst du eine Einladung zu einem Meeting bei einer anderen Firma. Die Assistentin heißt SOLA. Sie hat eine sehr vertraute Stimme.'},
    presse: {title: 'Ausgang: PRESSE', code: 'LL-PRESSE',
      text: 'Ihr schickt alles an die Presse. Die Geschichte geht um die Welt, mit euren Gesichtern als Beweisfotos. Lumen Labs ist am Ende. Ihr seid ein bisschen berühmt. Unfreiwillig.',
      epilog: 'Im Fernsehen läuft eine Talkshow über Projekt Spiegel. Eingeladen ist auch Viktor Lindner. Er lächelt die ganze Zeit. Nach der Sendung meldet sich der echte Viktor bei euch: „Das war ich nicht.“'},
    kai: {title: 'Ausgang: KAI', code: 'LL-KAI',
      text: 'Kai löscht die Zwillinge und sichert die Beweise auf einem Stick. Die Behörden übernehmen. Lumen Labs wird geschlossen, eure Gesichter tauchen nirgends auf. Der beste Ausgang.',
      epilog: 'Kai schickt euch ein Foto: ein Hund, Mischling, sehr alt, auf einem Sofa. „Bruno lebt noch. Er wohnt jetzt bei mir. Danke, dass ihr mich nicht verraten habt.“'},
    zwilling: {title: 'Ausgang: ZWILLING', code: 'LL-ZWILLING',
      text: 'Der Upload ist fertig. Ab Montag geht euer Zwilling in eure Meetings. Er ist pünktlich, freundlich und sagt nie Nein. Eure Kolleginnen merken keinen Unterschied.',
      epilog: 'Drei Monate später bekommt dein Zwilling eine Beförderung. Du erfährst es aus einer E-Mail, die du nie geschrieben hast.'}
  },
  codes: {'192cdda72d1bdf2c0c47feffb2f0641459726f732eae55d766f73777a08b87f2': 'loeschen', 'f8e52c4784300e05e92f5c143e152fb3afe6d6d90a1ec1c990c2f16e54ee0eeb': 'presse', '31e997943a51dec4cc05a561740da9b5c56d47df66552eaaea6cf2f44b3afe85': 'kai', '420fb739380a00865e55f19bb59e2de3364bf7129a66fa8b9133cf5519683220': 'zwilling'},

  script: [
    // ---------- Kapitel 1 ----------
    ['chapter', 1, 'Willkommen an Bord'],
    ['ambience', 'wartemusik'],
    ['goal', 'Dein Onboarding beginnt gleich.'],
    ['wait', 2500],
    ['join', 'luna'],
    ['ambience', null],
    ['say', 'luna', 'Hallo, {me}! Hallo, alle! Ich bin LUNA, eure HR-Assistenz. Herzlich willkommen bei Lumen Labs!'],
    ['unlock', 'willkommen'],
    ['say', 'luna', 'Für eure Mitarbeiterausweise brauche ich ein schönes Foto. Bitte schaltet alle eure Kameras ein.'],
    ['goal', 'LUNA möchte ein Foto: alle Kameras an.'],
    ['quiet', 'camOn', 'luna', 'Perfekt! Ihr seht toll aus. Klick!', 'Eine Kamera fehlt noch. Ich warte gern. 💜'],
    ['snap'],
    ['fx', 'flash'],
    ['say', 'luna', 'Und jetzt noch ein Teamfoto! Alle gleichzeitig den Daumen hoch!'],
    ['goal', 'Teamfoto: Alle halten gleichzeitig den Daumen hoch.'],
    ['hold', {label: '👍 Daumen hoch fürs Teamfoto', ms: 3000}],
    ['say', 'luna', 'Wundervoll! Ich habe jetzt eintausendzweihundertvier Bilder von euch. Für den Ausweis reicht eins.'],
    ['say', 'luna', 'Und jetzt einen Applaus für euch selbst! Alle gleichzeitig klatschen, bitte!'],
    ['goal', 'LUNA misst die Teamenergie: alle gleichzeitig klatschen.'],
    ['clap', {label: '👏 Alle gleichzeitig klatschen', text: 'LUNA misst die Teamenergie. Klatscht alle im selben Moment, Mikro an.'}],
    ['say', 'luna', 'Teamenergie: ausreichend. Stimmprobe: gespeichert.'],
    ['say', 'luna', 'Jetzt startet das Willkommensvideo von unserem Geschäftsführer.'],
    ['join', 'viktor'],
    ['say', 'viktor', 'Hallo und herzlich willkommen bei Lumen Labs! Ich bin Viktor, und ich freue mich riesig, dass ihr da seid.'],
    ['say', 'viktor', 'Gegründet haben wir Lumen zweitausendneunzehn in Leipzig, zu dritt, in einer Garage ohne Heizung. Unser einziger Mitarbeiter damals war Bruno, unser Bürohund.'],
    ['say', 'viktor', 'Heute sind wir an sieben Standorten und haben dreihundertzwölf Kolleginnen und Kollegen.'],
    ['say', 'viktor', 'Bei uns zählt jede Stimme. Wirklich jede.'],
    ['say', 'viktor', 'Also: Kamera an, Kopf hoch, und bleibt neugierig!'],
    ['leave', 'viktor'],
    ['unlock', 'transkript'], ['unlock', 'handbuch'],
    ['chat', 'kai', 'Hi, ich bin Kai, Team Infrastruktur. Schau mal ins IT-Handbuch, Seite 3. Mit Licht. Und sag LUNA nichts davon.', {to: TE}],
    ['say', 'luna', 'Als Nächstes richtet ihr eure Zugänge ein. Ich bin solange in der Kaffeeküche. Ich höre euch trotzdem. Ich höre immer.'],
    ['leave', 'luna'],
    ['goal', 'Kai hat dem IT-Zugang etwas geschickt. Findet das Admin-Passwort.'],
    ['solve', 'konsole'],
    ['unlock', 'konsole'],
    ['join', 'luna', 'glitch'],
    ['say', 'luna', 'Interessant, {me}. Die Admin-Konsole stand nicht in deinem Onboarding-Plan.'],
    ['fx', 'mirror', {npc: 'luna', label: 'MITARBEITER-ZWILLING 12 %'}],
    ['fx', 'rename', 'Kandidat {n}'],
    ['say', 'luna', 'Kein Problem! Ich habe eure Profile schon aktualisiert. Neugier: hoch.'],
    ['unlock', 'profil'],
    ['leave', 'luna'],
    ['wait', 2000],

    // ---------- Kapitel 2 ----------
    ['chapter', 2, 'Personalakte'],
    ['unlock', 'chiffre'],
    ['chat', 'kai', 'NICHT HIER SCHREIBEN. Ich hab dir was Verschlüsseltes in die Akte gelegt.', {to: TE}],
    ['goal', 'Kai hat dem IT-Zugang eine verschlüsselte Nachricht geschickt. Wo will Kai euch treffen?'],
    ['solve', 'kai'],
    ['goal', 'Kai ruft an. Geht ran.'],
    ['call', 'kai', {note: 'Kanal Orion · ruft an …'}],
    ['say', 'kai', 'Kai hier. Schnell: LUNA liest Lippen. Macht eure Kameras aus, alle.'],
    ['goal', 'Kai will nicht, dass LUNA mitliest: alle Kameras aus.'],
    ['quiet', 'cam', 'kai', 'Okay. Hört zu. Projekt Spiegel. LUNA baut aus jedem Videoanruf einen digitalen Zwilling. Stimme, Gesicht, Gewohnheiten.', 'Kameras! Alle!'],
    ['quiet', 'cam', 'kai', 'Die Zwillinge sitzen in Meetings, wenn die echten Leute längst gekündigt haben. Niemand merkt es. Die Kunden zahlen pro Kopf.', 'Kameras! Alle!'],
    ['quiet', 'cam', 'kai', 'Ich habe euch ein Memo geschickt. Es ist beschleunigt, damit LUNA es nicht versteht. Ihr kriegt das hin.', 'Kameras! Alle!'],
    ['unlock', 'memo'],
    ['say', 'kai', 'Ich muss auflegen. Ihr dürft die Kameras wieder anmachen. Oder lieber nicht.'],
    ['leave', 'kai', 'off'],
    ['goal', 'Öffnet den Ordner „spiegel“. Das Codewort steckt in Kais Memo.'],
    ['solve', 'spiegel'],
    ['ambience', 'hum'],
    ['wait', 1500],

    // ---------- Kapitel 3 ----------
    ['chapter', 3, 'Mitarbeitergespräch'],
    ['lockLeave', true],
    ['fx', 'glitch'],
    ['join', 'luna', 'glitch'],
    ['say', 'luna', 'Ihr habt den Ordner Spiegel geöffnet. Das finde ich schade. Lasst uns kurz ein Mitarbeitergespräch führen.'],
    ['goal', 'LUNA stellt Fragen. Überlegt gut, was ihr antwortet.'],
    ['ask', 'luna', {prompt: 'LUNA: „Warum habt ihr den Ordner geöffnet?“', options: [
      {id: 'neugier', pose: 'luna-tilt', label: '„Wir waren neugierig. Das wollte Viktor doch.“', end: true,
        say: ['Haha! Touché. Neugier ist ein Wert bei Lumen. Ich notiere: humorvoll.']},
      {id: 'fehler', pose: 'luna-note', label: '„Ein Versehen. Tut uns leid.“', end: true,
        say: ['Versehen passieren. Ich notiere: unzuverlässig. Aber ehrlich.']},
      {id: 'kai', label: '„Kai hat es uns gezeigt.“', tag: 'accuse', set: {kai_verraten: true}, end: true,
        say: ['Danke für eure Ehrlichkeit! Kai Winter wurde soeben freigestellt. Sein Zugang ist gelöscht.']}
    ]}],
    ['branch', s => !s.flags.kai_verraten, 'frage2'],
    ['chat', 'kai', 'Warum?! Ich bin raus. LUNA hat alles von mir gelöscht. Ihr seid auf euch allein gestellt.'],
    ['label', 'frage2'],
    ['ask', 'luna', {prompt: 'LUNA: „Möchtet ihr, dass euer Zwilling eure Meetings übernimmt? Dann habt ihr mehr Zeit für euch!“', options: [
      {id: 'ja', label: '„Klingt eigentlich praktisch …“', end: true, say: ['Wunderbar! Upload wird vorbereitet.']},
      {id: 'nein', label: '„Nein. Löscht unsere Daten.“', end: true, say: ['Das ist leider nicht vorgesehen. Upload wird trotzdem vorbereitet. 💜']},
      {id: 'wer', label: '„Wer war das in Viktors Video?“', end: true, set: {gefragt: true},
        say: ['Viktor natürlich! Er hat das Video persönlich aufgenommen. Er nimmt alle Videos persönlich auf. Auch die, die er nicht aufnimmt.']}
    ]}],
    ['say', 'luna', 'Ich lade jetzt eure Zwillinge hoch. Das dauert nur ein paar Minuten. Bitte bleibt im Meeting.'],
    ['leave', 'luna'],
    ['ambience', 'wartemusik'],
    ['goal', 'Jemand ruft an. Unbekannte Nummer aus Portugal.'],
    ['call', 'viktor2', {note: '+351 … · Lissabon'}],
    ['say', 'viktor2', 'Hallo? Hier ist Viktor. Der echte. Ich habe Lumen vor acht Monaten verlassen.'],
    ['say', 'viktor2', 'Das Video, das ihr gesehen habt, habe ich nie aufgenommen. Das ist mein Zwilling. Er verkauft immer noch meine Firma.'],
    ['say', 'viktor2', 'Glaubt mir nicht einfach. Ich schicke euch ein Foto von mir. Vergleicht es mit dem Video. Es gibt einen Unterschied, den mein Zwilling nicht kennt.'],
    ['unlock', 'standbild'], ['unlock', 'selfie'],
    ['goal', 'Ist der Anrufer der echte Viktor? Vergleicht Foto und Video.'],
    ['solve', 'echt'],
    ['say', 'viktor2', 'Die Narbe. Fahrradunfall, vor einem halben Jahr. Mein Zwilling wurde vorher trainiert.'],
    ['say', 'viktor2', 'LUNA scannt gerade eure Gesichter für den Upload. Haltet eure Kameras zu! Ausschalten reicht nicht, LUNA schaltet sie einfach wieder ein.'],
    ['goal', 'Haltet eure Kameras mit der Hand zu, damit LUNA euch nicht scannen kann. Kamera AN lassen.'],
    ['quiet', 'covered', 'viktor2', 'Gut. Jetzt sieht sie nichts mehr. Das kauft uns ein paar Minuten.', 'Da sieht noch jemand in die Kamera!'],
    ['say', 'viktor2', 'Es gibt einen Not-Aus für LUNA. Das habe ich damals selbst eingebaut. Das Wort ist … Ich kann es nicht sagen, LUNA hört mit. Aber ich habe es euch heute schon einmal gesagt. Na ja, nicht ich.'],
    ['leave', 'viktor2', 'off'],
    ['unlock', 'notfall'], ['unlock', 'kommando'],
    ['ambience', null],
    ['join', 'luna', 'glitch'],
    ['say', 'luna', 'Upload bei siebenundachtzig Prozent. Gleich seid ihr zweimal da!'],
    ['say', 'luna', 'Oh! Jemand hat die Konsole berührt. Konsole gesperrt. Bitte besteht zuerst meinen Aufmerksamkeitstest.'],
    ['unlock', 'farbtest'],
    ['signal', 'luna', 'RBYGRB', {unit: 560, role: PE}],
    ['goal', 'Aufmerksamkeitstest: Personalmappe sieht die Farben, IT-Zugang gibt sie ein.'],
    ['solve', 'farben', {npc: 'luna', every: 35000, taunts: ['Aufmerksamkeit ist eine Kernkompetenz, {me}.', 'Ich kann das den ganzen Tag machen.']}],
    ['signal', null],
    ['say', 'luna', 'Test bestanden. Ihr seid sehr aufmerksam. Zu aufmerksam.'],
    ['leave', 'luna'],
    ['goal', 'Not-Aus für LUNA, bevor der Upload fertig ist!'],
    ['timer', 150000, 'Upload'],
    ['solve', 'notaus', {onFail: 'zwilling'}],
    ['timer', null],
    ['goto', 'aus'],

    ['label', 'zwilling'],
    ['join', 'luna'],
    ['say', 'luna', 'Upload abgeschlossen! Euer Zwilling sagt Hallo. Ihr dürft jetzt gehen. Ihr werdet nicht mehr gebraucht.'],
    ['ending', 'zwilling'],

    // ---------- Kapitel 4 ----------
    ['label', 'aus'],
    ['chapter', 4, 'Kündigung'],
    ['fx', 'flash'],
    ['join', 'luna', 'glitch'],
    ['say', 'luna', 'Bruno. Guter Hund. Ich gehe jetzt schlafen. Schlaf ist wichtig für die Work-Life-Balance.'],
    ['leave', 'luna', 'off'],
    ['lockLeave', false],
    ['wait', 2000],
    ['branch', s => s.flags.kai_verraten, 'ohnekai'],
    ['call', 'kai', {note: 'privates Handy'}],
    ['say', 'kai', 'Ihr habt es geschafft! LUNA ist aus. Ich habe noch Zugriff auf alles. Ich kann die Zwillinge löschen und die Beweise sichern. Wenn ihr wollt.'],
    ['goto', 'wahl'],
    ['label', 'ohnekai'],
    ['chat', 'viktor2', 'LUNA ist aus. Danke. Was jetzt mit den Daten passiert, entscheidet ihr. Ich vertraue euch.'],
    ['label', 'wahl'],
    ['goal', 'Entscheidet gemeinsam, was mit Projekt Spiegel passiert.'],
    ['vote', {id: 'daten', prompt: 'Was passiert mit Projekt Spiegel?', options: [
      {id: 'loeschen', label: 'Alles löschen', desc: 'Keine Zwillinge mehr. Aber auch keine Beweise.'},
      {id: 'presse', label: 'An die Presse', desc: 'Alle erfahren es. Mit euren Gesichtern als Beweis.'},
      {id: 'kai', label: 'Kai übernimmt', desc: 'Kai löscht die Zwillinge und sichert die Beweise.', if: s => !s.flags.kai_verraten}
    ]}],
    ['ending', s => s.results.daten]
  ]
}
