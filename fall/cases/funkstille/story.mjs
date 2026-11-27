// Fall „Funkstille“. Alle Personen, Orte, Firmen und Behörden sind frei erfunden (Hallig Graudel gibt es nicht).

const FU = 'funk', KA = 'karte'

export default {
  id: 'funkstille',
  title: 'Funkstille',
  unit: 'Leitstelle Küste',
  file: 'Einsatz KÜ-2611',
  accent: '#4fd1c5',
  chapters: 4,
  lobby: 'Orkan „Elin“ über der Nordsee. Ihr habt Nachtdienst in der Leitstelle Küste. Auf Hallig Graudel sitzt eine Forschungsstation mit vier Leuten. Seit 21:40 Uhr ist es still. Etwa 45 bis 60 Minuten.',
  invite: 'Sturmnacht. Ich brauche dich in der Leitstelle. Jetzt, per Videoanruf.',
  roles: {
    funk: {name: 'Funk', blurb: 'Funksprüche, Bojen-Daten, Messwerte.'},
    karte: {name: 'Seekarte', blurb: 'Karten, Tidenkalender, Stationsbuch.'}
  },
  share: {
    text: 'Einsatz KÜ-2611 abgeschlossen. {time}. Die Station hat zweimal dasselbe gesagt. Wir wissen jetzt, warum.',
    tag: '#Funkstille',
    rows: ['GERETTET', 'STATION GRAUDEL', 'KELLER'],
    lines: ['Funkspruch 1 und Funkspruch 2 sind wortgleich.', 'Zwischen ihnen liegen 43 Minuten.']
  },

  npcs: {
    jannik: {name: 'Jannik Feddersen', sub: 'Leitstelle Küste · Schichtleitung', tts: {pitch: 1, rate: 1.05},
      voice: {model: 'thorsten-high', pitch: 2, fx: 'call', len: .94},
      face: {photo: 'jannik', skin: '#ebc0a4', eyes: '#3a6a8a', hair: {style: 'short', color: '#b5652e'}, beard: 'full', beardColor: '#a85a28', extras: ['headset'], mood: 'smile', jaw: .7, top: {style: 'hoodie', color: '#1f3346', accent: '#ccc'}, scene: 'radio'}},
    marit: {name: 'Dr. Marit Olsen', sub: 'Station Graudel · Satellit', look: 'weak', tts: {pitch: 1.05, rate: 1},
      voice: {model: 'eva_k', fx: 'radio', len: 1},
      face: {photo: 'marit', skin: '#efcbb4', fem: true, jaw: .3, eyes: '#4a6a7a', hair: {style: 'bob', color: '#cbb896'}, glasses: 'round', age: 2, mood: 'stern', top: {style: 'coat', color: '#8a2e2a'}, extras: ['earring'], scene: 'storm'}},
    tom: {name: 'Unbekannt', sub: 'Station Graudel · Handy', look: 'weak', tts: {pitch: 1.2, rate: 1.1},
      voice: {model: 'thorsten_emotional', speaker: 7, fx: 'radio', len: .98},
      face: {photo: 'tom', skin: '#e7b99c', age: 0, jaw: .3, eyes: '#4a7a5a', hair: {style: 'curly', color: '#7a4a2a'}, extras: ['freckles'], top: {style: 'hoodie', color: '#d9a21b', accent: '#333'}, mood: 'worried', look: [1, .5], scene: 'storm'}},
    ole: {name: 'Kapitän Ole Jessen', afterVote: {id: 'fahrt', pose: 'ole-radio'}, sub: 'Seenotkreuzer „Hinrich“', tts: {pitch: .8, rate: .95},
      voice: {model: 'thorsten_emotional', speaker: 4, fx: 'radio', len: 1.05},
      face: {photo: 'ole', skin: '#c98f6c', eyes: '#3a5a7a', hair: {style: 'cap', color: '#ddd', hat: '#1b2a3a'}, beard: 'full', beardColor: '#e8e4dc', age: 2, jaw: 1, mood: 'stern', top: {style: 'coat', color: '#c8501f'}, scene: 'storm'}}
  },

  photos: {
    keller: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="kw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3d3a"/><stop offset="1" stop-color="#1c1e1c"/></linearGradient><radialGradient id="kl" cx="50%" cy="10%" r="70%"><stop offset="0" stop-color="#fff3c0" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs><rect width="400" height="300" fill="url(#kw)"/><path d="M0 40 H400" stroke="#2c2e2c" stroke-width="1"/><path d="M0 62 H400" stroke="#2c2e2c" stroke-width="1"/><path d="M0 84 H400" stroke="#2c2e2c" stroke-width="1"/><path d="M0 106 H400" stroke="#2c2e2c" stroke-width="1"/><path d="M0 128 H400" stroke="#2c2e2c" stroke-width="1"/><path d="M0 150 H400" stroke="#2c2e2c" stroke-width="1"/><path d="M0 172 H400" stroke="#2c2e2c" stroke-width="1"/><rect y="236" width="400" height="64" fill="#161816"/><ellipse cx="200" cy="268" rx="190" ry="14" fill="#1f2a30" opacity=".8"/><path d="M40 262 q30 -4 60 0 t60 0 t60 0 t60 0 t60 0" stroke="#5a7a8a" stroke-width=".8" fill="none" opacity=".6"/><g transform="translate(40 150)"><rect x="0" y="0" width="44" height="92" rx="5" fill="#2f4a3a"/><rect x="0" y="14" width="44" height="3" fill="#1d2e24"/><rect x="0" y="74" width="44" height="3" fill="#1d2e24"/><rect x="7" y="36" width="30" height="16" fill="#e8d84a"/><path d="M22 38 l5 8 h-10 z" fill="#111"/><text x="22" y="50.6" font-size="3.2" font-family="monospace" text-anchor="middle" fill="#111">GK-3317</text><ellipse cx="22" cy="2" rx="22" ry="3" fill="#41604c"/></g><g transform="translate(92 156)"><rect x="0" y="0" width="44" height="92" rx="5" fill="#34503f"/><rect x="0" y="14" width="44" height="3" fill="#1d2e24"/><rect x="0" y="74" width="44" height="3" fill="#1d2e24"/><rect x="7" y="36" width="30" height="16" fill="#e8d84a"/><path d="M22 38 l5 8 h-10 z" fill="#111"/><text x="22" y="50.6" font-size="3.2" font-family="monospace" text-anchor="middle" fill="#111">GK-3317</text><ellipse cx="22" cy="2" rx="22" ry="3" fill="#41604c"/></g><g transform="translate(144 150)"><rect x="0" y="0" width="44" height="92" rx="5" fill="#2b4436"/><rect x="0" y="14" width="44" height="3" fill="#1d2e24"/><rect x="0" y="74" width="44" height="3" fill="#1d2e24"/><rect x="7" y="36" width="30" height="16" fill="#e8d84a"/><path d="M22 38 l5 8 h-10 z" fill="#111"/><text x="22" y="50.6" font-size="3.2" font-family="monospace" text-anchor="middle" fill="#111">GK-3317</text><ellipse cx="22" cy="2" rx="22" ry="3" fill="#41604c"/></g><g transform="translate(196 156)"><rect x="0" y="0" width="44" height="92" rx="5" fill="#2f4a3a"/><rect x="0" y="14" width="44" height="3" fill="#1d2e24"/><rect x="0" y="74" width="44" height="3" fill="#1d2e24"/><rect x="7" y="36" width="30" height="16" fill="#e8d84a"/><path d="M22 38 l5 8 h-10 z" fill="#111"/><text x="22" y="50.6" font-size="3.2" font-family="monospace" text-anchor="middle" fill="#111">GK-3317</text><ellipse cx="22" cy="2" rx="22" ry="3" fill="#41604c"/></g><g transform="translate(248 150)"><rect x="0" y="0" width="44" height="92" rx="5" fill="#34503f"/><rect x="0" y="14" width="44" height="3" fill="#1d2e24"/><rect x="0" y="74" width="44" height="3" fill="#1d2e24"/><rect x="7" y="36" width="30" height="16" fill="#e8d84a"/><path d="M22 38 l5 8 h-10 z" fill="#111"/><text x="22" y="50.6" font-size="3.2" font-family="monospace" text-anchor="middle" fill="#111">GK-3317</text><ellipse cx="22" cy="2" rx="22" ry="3" fill="#41604c"/></g><g transform="translate(300 156)"><rect x="0" y="0" width="44" height="92" rx="5" fill="#2b4436"/><rect x="0" y="14" width="44" height="3" fill="#1d2e24"/><rect x="0" y="74" width="44" height="3" fill="#1d2e24"/><rect x="7" y="36" width="30" height="16" fill="#e8d84a"/><path d="M22 38 l5 8 h-10 z" fill="#111"/><text x="22" y="50.6" font-size="3.2" font-family="monospace" text-anchor="middle" fill="#111">GK-3317</text><ellipse cx="22" cy="2" rx="22" ry="3" fill="#41604c"/></g><path d="M300 246 q8 10 26 12 q-10 6 -30 4 z" fill="#3a3a2a" opacity=".9"/><g transform="translate(330 70)"><circle r="18" fill="#e8e4da" stroke="#333" stroke-width="2"/><path d="M0 0 L0 -12 M0 0 L10 6" stroke="#111" stroke-width="1.6"/><circle r="1.5" fill="#111"/></g><g transform="translate(44 56)"><rect width="88" height="30" fill="#c22"/><rect x="2" y="2" width="84" height="26" fill="none" stroke="#fff" stroke-width="1"/><text x="44" y="13" font-size="6" font-family="sans-serif" fill="#fff" text-anchor="middle" font-weight="700">ZUTRITT NUR</text><text x="44" y="22" font-size="6" font-family="sans-serif" fill="#fff" text-anchor="middle" font-weight="700">MIT GENEHMIGUNG</text></g><g transform="translate(160 92)"><rect width="56" height="40" fill="#8a6a42"/><rect x="4" y="4" width="48" height="10" fill="#efe9d8"/><text x="28" y="11" font-size="3.2" font-family="monospace" text-anchor="middle" fill="#111">GK-1102 · LEER</text></g><g transform="translate(236 104)"><rect width="34" height="22" fill="#efe9d8" transform="rotate(4)"/><text x="4" y="8" font-size="2.6" font-family="monospace" fill="#222" transform="rotate(4)">Lieferschein</text><text x="4" y="13" font-size="2.6" font-family="monospace" fill="#222" transform="rotate(4)">40 Fass · nachts</text><text x="4" y="18" font-size="2.6" font-family="monospace" fill="#222" transform="rotate(4)">Abholung: nie</text></g><rect width="400" height="300" fill="url(#kl)"/><text x="10" y="18" font-size="10" font-family="monospace" fill="#fff" opacity=".85">CAM 2 · KELLER · 22:58:14</text><circle cx="388" cy="14" r="4" fill="#f33"/></svg>`
  },

  clips: {
    notruf: {title: 'Notkanal', npc: 'tom', voice: {model: 'thorsten_emotional', speaker: 7, fx: 'radio', len: .98},
      text: 'Hier Graudel. Hört mich jemand? Wenn ihr das hört: Das Kennwort für die Leitstelle ist Pricke. Pricke. Ich versuche, zu euch durchzukommen.'},
    funk1: {title: 'Mitschnitt Funkspruch 1 · Station Graudel · 22:31', npc: 'marit', bells: 9,
      voice: {model: 'eva_k', fx: 'radio', len: 1},
      text: 'Hier Station Graudel, Olsen. Alles in Ordnung bei uns. Der Generator macht Ärger, aber wir sind sicher. Schickt niemanden raus bei dem Wetter.'}
  },

  pages: {
    lage: {title: 'Lage', role: null, html: `
      <p class="stamp">Leitstelle Küste · Einsatz KÜ-2611</p>
      <h3>Forschungsstation Hallig Graudel</h3>
      <p>Vier Personen laut Dienstplan: <b>Dr. Marit Olsen</b> (Leitung), <b>Dr. Aksel Brink</b>, <b>Hanne Vogt</b>, <b>Nils Carstens</b>.</p>
      <p>Orkan „Elin“, Windstärke 11. Letzter regulärer Kontakt: <b>21:40 Uhr</b>. Danach: nichts.</p>
      <p>Einziges Rettungsmittel in Reichweite: Seenotkreuzer <b>„Hinrich“</b>. Hubschrauber fliegen bei diesem Wind nicht.</p>`},
    boje: {title: 'Bojen-Daten', role: FU, html: `
      <p class="stamp">Funk · Notboje GRD-7</p>
      <p>Die Notboje der Station sendet seit <b>22:15 Uhr</b>. Sie wird nur ausgelöst, wenn sie jemand ins Wasser wirft.</p>
      <table><tbody>
      <tr><td>Startfeld</td><td><b>C3</b> (22:15)</td></tr>
      <tr><td>Drift</td><td>pro Stunde <b>1 Feld nach Osten</b> und <b>1 Feld nach Süden</b></td></tr>
      <tr><td>Jetzt</td><td><b>00:15</b> (zwei Stunden später)</td></tr>
      <tr><td>Signal</td><td>stark, Position unverändert seit 23:15</td></tr>
      </tbody></table>
      <p class="note">Die Seekarte weiß, was im Wasser liegt.</p>`},
    karte: {title: 'Seekarte', role: KA, html: `
      <p class="stamp">Seekarte · Graudeltief</p>
      <p>Spalten A–F von West nach Ost, Zeilen 1–6 von Nord nach Süd.</p>
      <div class="grid" style="--n:7">
      <span></span><span>A</span><span>B</span><span>C</span><span>D</span><span>E</span><span>F</span>
      <span>1</span><span>~</span><span>~</span><span>~</span><span>~</span><span>~</span><span>~</span>
      <span>2</span><span>~</span><span>🏠</span><span>~</span><span>~</span><span>~</span><span>~</span>
      <span>3</span><span>~</span><span>~</span><span>~</span><span>~</span><span>~</span><span>~</span>
      <span>4</span><span>~</span><span>~</span><span>~</span><span>▒</span><span>~</span><span>~</span>
      <span>5</span><span>~</span><span>~</span><span>~</span><span>~</span><span>▒</span><span>~</span>
      <span>6</span><span>~</span><span>~</span><span>~</span><span>~</span><span>~</span><span>~</span>
      </div>
      <p>🏠 Hallig Graudel (B2) · ▒ <b>Graudelsand</b> (D4, E5): Sandbank. Was dort antreibt, <b>bleibt liegen</b>.</p>`},
    stationsbuch: {title: 'Stationsbuch', role: KA, html: `
      <div class="paper"><p class="stamp">Station Graudel · Stationsbuch (Auszug)</p>
      <p>Die Turmuhr schlägt zur vollen Stunde die Stundenzahl (1 bis 12 Schläge).</p>
      <p>Läutwerk ab <b>22:00 Uhr abgeschaltet</b> (Nachtruhe), ab 07:00 wieder an.</p>
      <p>Heute: Station seit 12:30 Uhr besetzt (Fähre). Vorher leer.</p></div>`},
    mitschnitt: {title: 'Tonband: Funkspruch 1', role: FU, html: `
      <p class="stamp">Funk · Mitschnitt</p>
      <p>Funkspruch 1 kam um 22:31, Funkspruch 2 um 23:14. Wortgleich. Hört genau hin, auch auf den Hintergrund.</p>
      <div data-tape="funk1"></div>`},
    webcam: {title: 'Kellerkamera', role: FU, html: `
      <p class="stamp">Funk · Stationsnetz, CAM 2</p>
      <p>Das letzte Bild der Kellerkamera, bevor sie ausfiel. Es ist klein. Zoomt hinein und lest alles, was ihr findet.</p>
      <div data-photo="keller"></div>`},
    gefahrgut: {title: 'Gefahrgut-Liste', role: KA, html: `
      <p class="stamp">Seekarte · Gefahrgut-Kennzeichnung (Küstenschutz)</p>
      <table><thead><tr><th>Kennung</th><th>Stoff</th></tr></thead><tbody>
      <tr><td>GK-1102</td><td>Altöl</td></tr><tr><td>GK-2210</td><td>Kupfersulfat</td></tr>
      <tr><td>GK-3137</td><td>Kalkmilch</td></tr><tr><td>GK-3317</td><td>Bleischlamm</td></tr>
      <tr><td>GK-3371</td><td>Arsenschlamm</td></tr><tr><td>GK-4410</td><td>Chlorbleiche</td></tr>
      <tr><td>GK-7031</td><td>Diesel</td></tr>
      </tbody></table>`},
    funkplan: {title: 'Funkplan', role: KA, html: `
      <div class="paper"><p class="stamp">Station Graudel · Funkplan</p>
      <p>Kanal 16 (156,800 MHz): Not- und Anrufkanal, <b>derzeit gestört</b></p>
      <p>Kanal 69 (156,475 MHz): Hafenbetrieb Husum</p>
      <p>Kanal 72 (156,625 MHz): <b>stationsinterner Notkanal</b></p>
      <p>Kanal 77 (156,875 MHz): Sportschifffahrt</p></div>`},
    empfaenger: {title: 'UKW-Empfänger', role: FU, html: `
      <p class="stamp">Funk · Empfänger</p>
      <p>Irgendwo auf UKW ruft jemand. Dreh den Empfänger durch, bis die Stimme aus dem Rauschen kommt. Welcher Kanal es ist, weiß die Seekarte.</p>
      <div data-tuner="notruf" data-target="156.625" data-min="156" data-max="157.4"></div>`},
    tide: {title: 'Tidenkalender', role: KA, html: `
      <p class="stamp">Seekarte · Tidenkalender Graudeltief</p>
      <p>Der <b>Graudelsand</b> liegt <b>0,90 m über Pegelnull Husum</b>. Wasser über der Sandbank = Pegel Husum − 0,90 m.</p>
      <p>Hochwasser heute Nacht gegen 02:10 Uhr, danach fällt das Wasser schnell.</p>`},
    pegel: {title: 'Pegel live', role: FU, html: `
      <p class="stamp">Funk · Live-Daten</p>
      <div data-widget="pegel"></div>
      <p><b>Seenotkreuzer „Hinrich“:</b> Tiefgang 1,60 m. Vorschrift: mindestens 0,50 m Wasser unter dem Kiel.</p>`},
    morse: {title: 'Morsetafel', role: KA, html: `
      <p class="stamp">Seekarte · Anhang Lichtsignale</p>
      <div data-morsetable></div>
      <p class="note">Wortpause = längere Dunkelheit.</p>`}
  },

  widgets: {
    // Pegel steigt langsam mit der Spielzeit (reine Stimmung, die Lösung ist eine Rechnung)
    pegel(el, {elapsed}) {
      const v = 2.31 + Math.min(.6, elapsed / 3.6e6 * .4) + Math.sin(Date.now() / 900) * .015
      el.innerHTML = `<div class="net" style="display:block;position:static"><p>Pegel Husum · live</p><div class="row"><span>Wasserstand</span><b>${v.toFixed(2).replace('.', ',')} m</b><i>steigend · Hochwasser ca. 02:10</i></div></div>`
    }
  },

  puzzles: {
    boje: {
      q: 'In welchem Feld liegt die Notboje jetzt?', ph: 'Feld, z. B. A1',
      hash: ['57a6cdee47cb7705db8e9342c427fa943e893a76b92b6110b5e59a3cc6691708'],
      near: {'97a4e860916ee5f3c15bc408b57cce559940eed515e0681df9dab4fc72b8d5be': 'Rechnet Stunde für Stunde. Was passiert auf einer Sandbank?', 'c1bfa0635fe073face4b938ab65fc513df025c32363eef833c0d802ee2b0adf6': 'Das ist der Start. Sie treibt.'},
      hints: ['Funk: Lies Startfeld und Drift vor. Seekarte: Zieht die Boje Stunde für Stunde über die Karte.', 'Nach einer Stunde: D4. Was liegt in D4?', 'D4 ist Sandbank. Dort bleibt sie liegen.']
    },
    echo: {
      q: 'Um wie viel Uhr wurde Funkspruch 1 wirklich aufgenommen? (volle Stunde)', ph: 'Uhrzeit',
      hash: ['e5d9f8653c92390bfeba1bfc2399b30dd0623ec96709a736e7e45bd2c474d75c', '425c2f010544828fe0b8258ad9a30656c1678c64356cae273ce057771252b38d', '9799c835d7a188ecab2394de821f578c49795a653172dfceec55fb3161cb5393', '240b5aa89a46fbe78af152d4c39a1ef4f1b94fe067e2ff77d7cab0c982fbd329', '220445301034e858a2a5c54d30bdcfec66784851de78d19b01803d62468e73d6', '4d0177804220fe30f483d05751b724743430e926b5c0543fb193f9184cfcfb4c'],
      near: {'4cb67874a0bcb1d84a7c14de3ca8362a11809d6e4125df29deb68c55be03af58': 'Neun Schläge, ja. Aber war vormittags schon jemand auf der Station?', 'c634b5abb7a1e0984ef6670b6bbdcf234cf9cad1d3330b6ddf1c48dc0238e678': 'Neun Schläge, ja. Aber war vormittags schon jemand auf der Station?', '2e0413dd079e03f51fa3fcf2f3ab75e957ae724a79e2f2f5a2e61a74750e99ed': 'Um 22 Uhr hätte keine Glocke geschlagen.', 'fe038700bad0b244b88f829aa2ab6bdad738cec253808c1c6c2742c00e8b55bf': 'So wurde er gesendet. Aufgenommen wurde er früher.'},
      hints: ['Funk: Spiel das Band ab und hör auf den Hintergrund. Zählt mit.', 'Es schlägt neunmal. Seekarte: Was sagt das Stationsbuch über die Glocke und die Besetzung?', 'Neun Schläge, Station erst ab 12:30 besetzt, Glocke nach 22 Uhr aus: 21 Uhr.']
    },
    fass: {
      q: 'Was lagert im Keller der Station?', ph: 'Stoff',
      hash: ['d5e8c227106125d2247095f3ec5aa8666d1a82f085baefa657a14f29687d06ae'],
      near: {'5106ed565075c04dcbbe400c5b1ad61e0c88551c1f25bba0f985d2bc289fdace': 'Lest die Kennung auf den Fässern noch einmal Ziffer für Ziffer.', '9bd0a8b5f3f9d499931e96d4c3f1f17af02c169c4531026865cb729005877fb7': 'Lest die Kennung auf den Fässern noch einmal Ziffer für Ziffer.', '82d331993533a442454b76a7fdd668fc900fbd173db03a183f27f4a2b9a10e57': 'Das ist die leere Kiste. Was steht auf den Fässern?', 'ce090863abf17da32868afe1a7cb8a5a55af871251fc9b9f1f12578ebdd955da': 'Das ist die Kennung. Was bedeutet sie?'},
      hints: ['Funk: Mit ＋ oder dem Mausrad in das Bild zoomen, mit Ziehen verschieben. Die gelben Etiketten auf den Fässern.', 'Auf den Fässern steht GK-3317. Seekarte: Schaut in der Liste nach. Vorsicht, ähnliche Nummern.', 'GK-3317 ist Bleischlamm.']
    },
    kanal: {
      q: 'Welches Kennwort sagt die Stimme auf dem Notkanal?', ph: 'Kennwort',
      hash: ['552303b9df1ee4999f8cdf518aa85faedd08830e20d6161bf3f0c9820f24a655'],
      near: {'7d3e851cda39305ae007fd9b70c616841739c3abb311a4c165cff4dc34e95397': 'Das ist der Kanal. Was sagt die Stimme dort?', '9d37981651fd286801d72a06df613d97a8585d1650c2cc71497f1aa8a832067a': 'Das ist die Frequenz. Was sagt die Stimme dort?'},
      hints: ['Seekarte: Im Funkplan steht der Notkanal der Station. Funk: Empfänger an und hindrehen.', 'Kanal 72 ist 156,625 MHz. Mit − und + fein einstellen.', 'Die Stimme sagt „Pricke“.']
    },
    pegel: {
      q: 'Ab welchem Pegel Husum (in Metern) kommt die „Hinrich“ sicher über den Graudelsand?', ph: 'Meter',
      hash: ['215cf45db6cf8dd7c9d91d98e14cf072915b640468c058985499a54ab7d49c85', '3eb759ca74b9377341fc4954b03ffcccbf2cacd6a14a7020bb2da6784c98eb2c', 'abced44afb5313ac8906f0b7b04e1c15f940fab3aa5b613d0d492d8391d82747', '4665b62096647892de5c1a9d59bc2c5eed14d09c700d4f3a16b315fc41f6beb6', '97fbf4e7b3fe1276f65ecd5dc25fc9f764e3e667466953a68a6f93e4046fcd9d', 'f26ba04b7e82597e55123f17302c7b2a5cae93b12e4fd5a17ff81e94a6859713', 'ef8dd267aaf69623c5824d70ec965031c992bea773533f7f88b9344609d4a152', 'a1cd83aee672a139c43eece0c9387ac2d4b4ec2b7ceb2778398a494549c21d66', '04ea0c7213ea74344610be7cf41c2d7acdac072db8285ecbd12134674cf3f025'],
      near: {'fe19c7a265026d95506a4dd46310b08b7045ef2ee7c2840828b44cbe40e654d4': 'Das ist nur, was das Schiff braucht. Die Sandbank liegt höher als Pegelnull.', 'e5d9f8653c92390bfeba1bfc2399b30dd0623ec96709a736e7e45bd2c474d75c': 'Das ist nur, was das Schiff braucht. Die Sandbank liegt höher als Pegelnull.', '1290fa6ca2375e306120c65bb8dab51701085a39dc907d988bece95c7a1ab5e0': 'Fast. Rechnet die Sicherheit dazu.', '2e0be923c8d2f915fe26d2d5f669bff6852c2e5acdbfa12e45cab9a330c647ca': 'Fast. Rechnet die Sicherheit dazu.'},
      hints: ['Funk: Tiefgang und Vorschrift. Seekarte: Höhe der Sandbank.', 'Das Schiff braucht 1,60 + 0,50 = 2,10 m Wasser über der Sandbank.', '2,10 m + 0,90 m Höhe der Sandbank = Pegel 3,00 m.']
    },
    licht: {
      q: 'Was blinkt die Lampe vom Schlauchboot?', ph: 'Nachricht',
      hash: ['06fbf92b8e8818d5632b6da18a6995dc83e9d1c22e14b43c44fb9e73e8cb162c', 'acede5e3706760f44dd3ad6d210b2741a4748d621894170009f2ade581a4ca64', 'dbc6d5cd93a6355bae9cdd7915a6e9dfbeb941b8ca21f309727edee7700a5bdd', '31d06f1e3d2929760a7c03467e9362cd57c7e94a871f77bc0b3b4f6dad768be9'],
      near: {'ac3e37900373cff9743f4e98f64de586ada0267615659d76ceecd30c55b2cc1d': 'Da kommt noch etwas nach der Pause.', 'f255816e413a602abc2bdc369a4b70c837c0fce4e4e9b8a2b82c33c687dfca09': 'Das kam vorher. Jetzt blinken sie etwas anderes.'},
      hints: ['Funk: Sag jedes Aufleuchten an. Seekarte: Tafel.', 'Zwei Wörter. Das erste ist –· ··– ·–· .', 'NUR ZWEI.']
    }
  },

  endings: {
    boot: {title: 'Ausgang: SEE', code: 'KU-SEE',
      text: 'Die „Hinrich“ findet das Schlauchboot im Morgengrauen. Hanne Vogt und Nils Carstens leben. Auf der Hallig halten Tom, Marit und Aksel bis zum Mittag durch. Die Fässer im Keller sind weg. Ins Meer gespült.',
      epilog: 'Drei Monate später: tote Muscheln am Graudeltief, tonnenweise. Die Proben zeigen einen Stoff, den es offiziell nicht gibt. Marit Olsen sagt vor dem Ausschuss aus. Ihr erster Satz: „Ich habe die Leitstelle belogen.“'},
    warft: {title: 'Ausgang: WARFT', code: 'KU-WARFT',
      text: 'Die „Hinrich“ holt Tom, Marit und den verletzten Aksel von der Hallig. Mit ihnen: Proben aus dem Keller. Das Schlauchboot wird erst am Mittag gefunden. Hanne und Nils sind unterkühlt, aber am Leben. Knapp.',
      epilog: 'Die Proben gehen an ein Labor in Kiel. Ergebnis: Altlasten eines Rüstungsbetriebs, illegal eingelagert, mit Wissen der Station. Hanne Vogt kündigt. Sie schreibt: „Ihr habt euch für die Wahrheit entschieden. Ich hätte es auch getan. Glaube ich.“'},
    ebbe: {title: 'Ausgang: EBBE', code: 'KU-EBBE',
      text: 'Die Tide ist gekippt. Die „Hinrich“ kommt nicht mehr über den Graudelsand. Ein Hubschrauber startet im Morgengrauen. Alle überleben, aber nur knapp, und die Fässer sind fort.',
      epilog: 'Kapitän Jessen schickt eine Postkarte in die Leitstelle: ein Leuchtturm, darunter „Nächstes Mal schneller. Wir fahren trotzdem wieder raus. O. J.“'}
  },
  codes: {'fde58edd36aa3a169fb2850b6bfbfb4868726464ebd076f853b96fa536a6eeb5': 'boot', '15723132915b93906cf76e078447b378f7563f06246a31bad796a029a515666a': 'warft', 'fa934f126aa01d171f536963176547342ad12af23829d07ec808dcfb5bb75ba6': 'ebbe'},

  script: [
    // ---------- Kapitel 1 ----------
    ['chapter', 1, 'Sturmflut'],
    ['ambience', 'storm'],
    ['goal', 'Jannik übernimmt die Lagebesprechung.'],
    ['wait', 2500],
    ['snap'],
    ['join', 'jannik'],
    ['wait', 800],
    ['say', 'jannik', 'Moin. Schön, dass ihr da seid. Es ist eine üble Nacht.'],
    ['say', 'jannik', 'Hallig Graudel, Forschungsstation, vier Leute. Letzter Kontakt um einundzwanzig Uhr vierzig. Seitdem Funkstille.'],
    ['unlock', 'lage'], ['unlock', 'karte'], ['unlock', 'boje'],
    ['say', 'jannik', 'Ich schick euch die Lage. Funk hat die Bojen-Daten, die Seekarte hat die Karte. Moment, da kommt was rein.'],
    ['goal', 'Die Station ruft an. Geht ran.'],
    ['call', 'marit', {note: 'Satellitentelefon · Station Graudel', timeout: 30000}],
    ['say', 'marit', 'Hier Station Graudel, Olsen. Alles in Ordnung bei uns. Der Generator macht Ärger, aber wir sind sicher. Schickt niemanden raus bei dem Wetter.'],
    ['fx', 'static'],
    ['leave', 'marit', 'off'],
    ['say', 'jannik', 'Na dann. Entwarnung? Nur komisch: Die Notboje der Station sendet. Seit zweiundzwanzig Uhr fünfzehn. Die geht nur an, wenn sie jemand ins Wasser wirft.'],
    ['goal', 'Findet heraus, wo die Notboje jetzt liegt.'],
    ['solve', 'boje'],
    ['say', 'jannik', 'D4. Auf dem Graudelsand. Jemand hat sie bei Sturm in Richtung offene See geworfen. Das ergibt keinen Sinn, wenn alles in Ordnung ist.'],
    ['wait', 2500],

    // ---------- Kapitel 2 ----------
    ['chapter', 2, 'Echo'],
    ['goal', 'Die Station ruft wieder an.'],
    ['call', 'marit', {note: 'Satellitentelefon · Station Graudel', timeout: 30000}],
    ['say', 'marit', 'Hier Station Graudel, Olsen. Alles in Ordnung bei uns. Der Generator macht Ärger, aber wir sind sicher. Schickt niemanden raus bei dem Wetter.'],
    ['leave', 'marit', 'off'],
    ['fx', 'shake'],
    ['say', 'jannik', 'Moment. Das war wortgleich. Genau dieselben Worte, dieselbe Betonung. Als wäre es eine Aufnahme.'],
    ['unlock', 'mitschnitt'], ['unlock', 'stationsbuch'],
    ['say', 'jannik', 'Ich hab euch den Mitschnitt geschickt. Wann wurde das wirklich aufgenommen?'],
    ['goal', 'Findet heraus, wann Funkspruch 1 aufgenommen wurde.'],
    ['solve', 'echo'],
    ['say', 'jannik', 'Einundzwanzig Uhr. Das heißt: Die Nachricht ist über drei Stunden alt. Jemand spielt sie uns vor. Damit wir niemanden rausschicken.'],
    ['unlock', 'webcam'], ['unlock', 'gefahrgut'],
    ['say', 'jannik', 'Die Station hat eine Kellerkamera im Netz. Das letzte Bild ist von zweiundzwanzig Uhr achtundfünfzig. Was steht da unten?'],
    ['goal', 'Findet heraus, was im Keller der Station lagert.'],
    ['solve', 'fass'],
    ['say', 'jannik', 'Bleischlamm. Vierzig Fässer. So etwas darf nicht mal in die Nähe einer Hallig. Und die Flut steigt.'],
    ['wait', 2500],

    // ---------- Kapitel 3 ----------
    ['chapter', 3, 'Der Fünfte'],
    ['unlock', 'funkplan'], ['unlock', 'empfaenger'],
    ['say', 'jannik', 'Auf UKW rauscht seit Minuten etwas. Kanal sechzehn ist gestört. Funk, such den Notkanal der Station.'],
    ['goal', 'Sucht im Rauschen den Notkanal der Station. Was sagt die Stimme?'],
    ['solve', 'kanal'],
    ['say', 'jannik', 'Pricke. Ein Kennwort. Wer immer das ist, er will zu uns durch.'],
    ['goal', 'Jemand klopft an. Von der Station.'],
    ['knock', 'tom'],
    ['join', 'tom'],
    ['say', 'tom', 'Hallo? Hört mich jemand? Bitte, ich habe nicht viel Akku.'],
    ['say', 'tom', 'Macht eure Mikros aus. Wenn sie hört, dass ich mit euch rede …'],
    ['goal', 'Der Anrufer flüstert. Alle Mikrofone aus.'],
    ['quiet', 'mic', 'tom', 'Ich bin Tom. FSJ auf der Station. Ich stehe auf keiner Liste, ich bin erst seit Montag hier.', 'Bitte! Mikros aus!'],
    ['quiet', 'mic', 'tom', 'Die anderen sind um halb elf mit dem Schlauchboot raus. Dr. Olsen hat sie geschickt. Sie selbst ist hiergeblieben. Und Aksel.', 'Bitte! Mikros aus!'],
    ['quiet', 'mic', 'tom', 'Sie spielt euch die alte Nachricht vor, damit niemand kommt. Im Keller stehen Fässer. Vierzig Stück. Die soll niemand sehen.', 'Bitte! Mikros aus!'],
    ['quiet', 'mic', 'tom', 'Ich habe die Notboje geworfen. Das war ich. Ihr dürft wieder reden.', 'Bitte! Mikros aus!'],
    ['set', 'tom', true],
    ['say', 'jannik', 'Okay. Wir schicken die „Hinrich“. Aber sie kommt nur bei genug Wasser über den Graudelsand. Rechnet mir den Pegel aus.'],
    ['unlock', 'tide'], ['unlock', 'pegel'],
    ['goal', 'Mikros an. Ab welchem Pegel kommt die „Hinrich“ über die Sandbank?'],
    ['solve', 'pegel', {npc: 'tom', every: 45000, taunts: ['Seid ihr noch da?', 'Das Wasser steigt. Es ist schon am Zaun.']}],
    ['say', 'jannik', 'Drei Meter. Der Pegel steht bei zwei Komma fünf und steigt. Das reicht in einer knappen Stunde.'],
    ['say', 'tom', 'Mein Akku ist fast leer. Die Verbindung bricht weg …'],
    ['goal', 'Toms Verbindung bricht weg. Haltet sie gemeinsam.'],
    ['hold', {label: 'Verbindung zu Tom halten', ms: 3500}],
    ['say', 'tom', 'Danke. Von der Warft sehe ich das Schlauchboot. Sie blinken mit der Lampe. Ich halte das Handy drauf.'],
    ['wait', 1000],

    // ---------- Kapitel 4 ----------
    ['chapter', 4, 'Leuchtfeuer'],
    ['ambience', 'radio'],
    ['call', 'ole', {note: 'UKW Kanal 16 · Seenotkreuzer „Hinrich“'}],
    ['say', 'ole', 'Hinrich hier, Jessen. Wir laufen aus, sobald der Pegel stimmt. Ich habe nur ein Zeitfenster, dann kippt die Tide.'],
    ['say', 'ole', 'Sagt mir, was das Schlauchboot blinkt. Davon hängt ab, wohin ich fahre.'],
    ['unlock', 'morse'],
    ['morse', 'tom', 'NUR ZWEI', 300],
    ['goal', 'Lest das Lichtsignal des Schlauchboots, bevor die Tide kippt.'],
    ['timer', 240000, 'Tide'],
    ['solve', 'licht', {npc: 'ole', every: 50000, onFail: 'ebbe', taunts: ['Das Fenster wird kleiner.', 'Leitstelle, ich brauche eine Antwort.']}],
    ['timer', null],
    ['morse', null],
    ['say', 'ole', 'Nur zwei im Boot? Es waren drei. Und sie sehen uns nicht im Regen.'],
    ['say', 'tom', 'Ich halte das Handy in den Wind. Ruft alle gleichzeitig, so laut ihr könnt. Vielleicht hören sie euch.'],
    ['goal', 'Gebt dem Schlauchboot ein Zeichen: alle gleichzeitig laut rufen.'],
    ['clap', {label: 'Alle gleichzeitig „HIER!“ rufen', text: 'Tom hält das Handy über die Warft. Ruft oder klatscht alle im selben Moment. Mikro an!'}],
    ['say', 'tom', 'Sie haben es gehört! Sie blinken zurück! Sie halten auf die Warft zu.'],
    ['say', 'ole', 'Gut. Wo ist der Dritte?'],
    ['call', 'marit', {note: 'Satellitentelefon · Station Graudel · live'}],
    ['say', 'marit', 'Hier Olsen. Diesmal wirklich. Ich habe euch belogen. Es tut mir leid.'],
    ['say', 'marit', 'Aksel ist zurückgeschwommen, um mich zu holen. Er ist hier. Er ist verletzt. Und unten im Keller läuft Wasser in die Fässer.'],
    ['say', 'marit', 'Wenn ihr die Proben nicht holt, sind die Beweise heute Nacht im Meer. Aber draußen treiben Hanne und Nils.'],
    ['leave', 'marit', 'off'],
    ['say', 'ole', 'Ich schaffe eine Fahrt. Nur eine. Leitstelle, wohin?'],
    ['goal', 'Entscheidet gemeinsam: Wohin fährt die „Hinrich“?'],
    ['vote', {id: 'fahrt', prompt: 'Wohin fährt die „Hinrich“?', options: [
      {id: 'boot', label: 'Zum Schlauchboot', desc: 'Hanne und Nils treiben auf die offene See. Die Hallig hält bis morgen.'},
      {id: 'warft', label: 'Zur Hallig', desc: 'Der verletzte Aksel, Tom, Marit und die Proben aus dem Keller.'}
    ]}],
    ['say', 'ole', 'Verstanden. Hinrich läuft aus.'],
    ['ending', s => s.results.fahrt],
    ['label', 'ebbe'],
    ['morse', null],
    ['say', 'ole', 'Zu spät. Die Tide ist gekippt. Wir kommen nicht mehr rüber.'],
    ['ending', 'ebbe']
  ]
}
