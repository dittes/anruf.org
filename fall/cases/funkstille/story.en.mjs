// Case “Radio Silence”, English version. All people, places, companies and agencies are fictional (Graudel Hallig does not exist).

const FU = 'funk', KA = 'karte'

export default {
  id: 'funkstille',
  title: 'Radio Silence',
  unit: 'Coastal Control',
  file: 'Incident CC-2611',
  accent: '#4fd1c5',
  chapters: 4,
  lobby: 'Storm “Elin” over the North Sea. You are on night duty at Coastal Control. A research station with four people sits on Graudel Hallig. Since 21:40 it has been silent. About 45 to 60 minutes.',
  invite: 'Stormy night. I need you at Coastal Control. Now, on a video call.',
  roles: {
    funk: {name: 'Radio', blurb: 'Radio messages, buoy data, readings.'},
    karte: {name: 'Chart', blurb: 'Maps, tide table, station log.'}
  },
  share: {
    text: 'Incident CC-2611 closed. {time}. The station said the same thing twice. Now we know why.',
    tag: '#RadioSilence',
    rows: ['RESCUED', 'GRAUDEL STATION', 'CELLAR'],
    lines: ['Radio message 1 and radio message 2 are word for word identical.', 'There are 43 minutes between them.']
  },

  npcs: {
    jannik: {name: 'Jake Fenton', sub: 'Coastal Control · Shift supervisor', tts: {pitch: 1, rate: 1.05},
      voice: {model: 'en_norman', pitch: 1, fx: 'call', len: .95},
      face: {photo: 'jannik', skin: '#ebc0a4', eyes: '#3a6a8a', hair: {style: 'short', color: '#b5652e'}, beard: 'full', beardColor: '#a85a28', extras: ['headset'], mood: 'smile', jaw: .7, top: {style: 'hoodie', color: '#1f3346', accent: '#ccc'}, scene: 'radio'}},
    marit: {helps: false, name: 'Dr. Marit Olsen', sub: 'Graudel Station · Satellite', look: 'weak', tts: {pitch: 1.05, rate: 1},
      voice: {model: 'en_alba', fx: 'radio', len: 1},
      face: {photo: 'marit', skin: '#efcbb4', fem: true, jaw: .3, eyes: '#4a6a7a', hair: {style: 'bob', color: '#cbb896'}, glasses: 'round', age: 2, mood: 'stern', top: {style: 'coat', color: '#8a2e2a'}, extras: ['earring'], scene: 'storm'}},
    tom: {name: 'Unknown', sub: 'Graudel Station · Mobile', look: 'weak', tts: {pitch: 1.2, rate: 1.1},
      voice: {model: 'en_bryce', pitch: 1, fx: 'radio', len: .98},
      face: {photo: 'tom', skin: '#e7b99c', age: 0, jaw: .3, eyes: '#4a7a5a', hair: {style: 'curly', color: '#7a4a2a'}, extras: ['freckles'], top: {style: 'hoodie', color: '#d9a21b', accent: '#333'}, mood: 'worried', look: [1, .5], scene: 'storm'}},
    ole: {name: 'Captain Olly Jessop', afterVote: {id: 'fahrt', pose: 'ole-radio'}, sub: 'Lifeboat “Harriet”', tts: {pitch: .8, rate: .95},
      voice: {model: 'en_nem', pitch: -2, fx: 'radio', len: 1.05},
      face: {photo: 'ole', skin: '#c98f6c', eyes: '#3a5a7a', hair: {style: 'cap', color: '#ddd', hat: '#1b2a3a'}, beard: 'full', beardColor: '#e8e4dc', age: 2, jaw: 1, mood: 'stern', top: {style: 'coat', color: '#c8501f'}, scene: 'storm'}}
  },

  photos: {
    keller: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="kw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3d3a"/><stop offset="1" stop-color="#1c1e1c"/></linearGradient><radialGradient id="kl" cx="50%" cy="10%" r="70%"><stop offset="0" stop-color="#fff3c0" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs><rect width="400" height="300" fill="url(#kw)"/><path d="M0 40 H400" stroke="#2c2e2c" stroke-width="1"/><path d="M0 62 H400" stroke="#2c2e2c" stroke-width="1"/><path d="M0 84 H400" stroke="#2c2e2c" stroke-width="1"/><path d="M0 106 H400" stroke="#2c2e2c" stroke-width="1"/><path d="M0 128 H400" stroke="#2c2e2c" stroke-width="1"/><path d="M0 150 H400" stroke="#2c2e2c" stroke-width="1"/><path d="M0 172 H400" stroke="#2c2e2c" stroke-width="1"/><rect y="236" width="400" height="64" fill="#161816"/><ellipse cx="200" cy="268" rx="190" ry="14" fill="#1f2a30" opacity=".8"/><path d="M40 262 q30 -4 60 0 t60 0 t60 0 t60 0 t60 0" stroke="#5a7a8a" stroke-width=".8" fill="none" opacity=".6"/><g transform="translate(40 150)"><rect x="0" y="0" width="44" height="92" rx="5" fill="#2f4a3a"/><rect x="0" y="14" width="44" height="3" fill="#1d2e24"/><rect x="0" y="74" width="44" height="3" fill="#1d2e24"/><rect x="7" y="36" width="30" height="16" fill="#e8d84a"/><path d="M22 38 l5 8 h-10 z" fill="#111"/><text x="22" y="50.6" font-size="3.2" font-family="monospace" text-anchor="middle" fill="#111">GK-3317</text><ellipse cx="22" cy="2" rx="22" ry="3" fill="#41604c"/></g><g transform="translate(92 156)"><rect x="0" y="0" width="44" height="92" rx="5" fill="#34503f"/><rect x="0" y="14" width="44" height="3" fill="#1d2e24"/><rect x="0" y="74" width="44" height="3" fill="#1d2e24"/><rect x="7" y="36" width="30" height="16" fill="#e8d84a"/><path d="M22 38 l5 8 h-10 z" fill="#111"/><text x="22" y="50.6" font-size="3.2" font-family="monospace" text-anchor="middle" fill="#111">GK-3317</text><ellipse cx="22" cy="2" rx="22" ry="3" fill="#41604c"/></g><g transform="translate(144 150)"><rect x="0" y="0" width="44" height="92" rx="5" fill="#2b4436"/><rect x="0" y="14" width="44" height="3" fill="#1d2e24"/><rect x="0" y="74" width="44" height="3" fill="#1d2e24"/><rect x="7" y="36" width="30" height="16" fill="#e8d84a"/><path d="M22 38 l5 8 h-10 z" fill="#111"/><text x="22" y="50.6" font-size="3.2" font-family="monospace" text-anchor="middle" fill="#111">GK-3317</text><ellipse cx="22" cy="2" rx="22" ry="3" fill="#41604c"/></g><g transform="translate(196 156)"><rect x="0" y="0" width="44" height="92" rx="5" fill="#2f4a3a"/><rect x="0" y="14" width="44" height="3" fill="#1d2e24"/><rect x="0" y="74" width="44" height="3" fill="#1d2e24"/><rect x="7" y="36" width="30" height="16" fill="#e8d84a"/><path d="M22 38 l5 8 h-10 z" fill="#111"/><text x="22" y="50.6" font-size="3.2" font-family="monospace" text-anchor="middle" fill="#111">GK-3317</text><ellipse cx="22" cy="2" rx="22" ry="3" fill="#41604c"/></g><g transform="translate(248 150)"><rect x="0" y="0" width="44" height="92" rx="5" fill="#34503f"/><rect x="0" y="14" width="44" height="3" fill="#1d2e24"/><rect x="0" y="74" width="44" height="3" fill="#1d2e24"/><rect x="7" y="36" width="30" height="16" fill="#e8d84a"/><path d="M22 38 l5 8 h-10 z" fill="#111"/><text x="22" y="50.6" font-size="3.2" font-family="monospace" text-anchor="middle" fill="#111">GK-3317</text><ellipse cx="22" cy="2" rx="22" ry="3" fill="#41604c"/></g><g transform="translate(300 156)"><rect x="0" y="0" width="44" height="92" rx="5" fill="#2b4436"/><rect x="0" y="14" width="44" height="3" fill="#1d2e24"/><rect x="0" y="74" width="44" height="3" fill="#1d2e24"/><rect x="7" y="36" width="30" height="16" fill="#e8d84a"/><path d="M22 38 l5 8 h-10 z" fill="#111"/><text x="22" y="50.6" font-size="3.2" font-family="monospace" text-anchor="middle" fill="#111">GK-3317</text><ellipse cx="22" cy="2" rx="22" ry="3" fill="#41604c"/></g><path d="M300 246 q8 10 26 12 q-10 6 -30 4 z" fill="#3a3a2a" opacity=".9"/><g transform="translate(330 70)"><circle r="18" fill="#e8e4da" stroke="#333" stroke-width="2"/><path d="M0 0 L0 -12 M0 0 L10 6" stroke="#111" stroke-width="1.6"/><circle r="1.5" fill="#111"/></g><g transform="translate(44 56)"><rect width="88" height="30" fill="#c22"/><rect x="2" y="2" width="84" height="26" fill="none" stroke="#fff" stroke-width="1"/><text x="44" y="13" font-size="6" font-family="sans-serif" fill="#fff" text-anchor="middle" font-weight="700">ACCESS ONLY</text><text x="44" y="22" font-size="6" font-family="sans-serif" fill="#fff" text-anchor="middle" font-weight="700">WITH PERMIT</text></g><g transform="translate(160 92)"><rect width="56" height="40" fill="#8a6a42"/><rect x="4" y="4" width="48" height="10" fill="#efe9d8"/><text x="28" y="11" font-size="3.2" font-family="monospace" text-anchor="middle" fill="#111">GK-1102 · EMPTY</text></g><g transform="translate(236 104)"><rect width="34" height="22" fill="#efe9d8" transform="rotate(4)"/><text x="4" y="8" font-size="2.6" font-family="monospace" fill="#222" transform="rotate(4)">Delivery note</text><text x="4" y="13" font-size="2.6" font-family="monospace" fill="#222" transform="rotate(4)">40 barrels · at night</text><text x="4" y="18" font-size="2.6" font-family="monospace" fill="#222" transform="rotate(4)">Collection: never</text></g><rect width="400" height="300" fill="url(#kl)"/><text x="10" y="18" font-size="10" font-family="monospace" fill="#fff" opacity=".85">CAM 2 · CELLAR · 22:58:14</text><circle cx="388" cy="14" r="4" fill="#f33"/></svg>`
  },

  clips: {
    notruf: {title: 'Emergency channel', npc: 'tom', voice: {model: 'en_bryce', pitch: 1, fx: 'radio', len: .98},
      text: 'Graudel here. Can anyone hear me? If you can hear this: the password for Coastal Control is Beacon. Beacon. I am trying to get through to you.'},
    funk1: {title: 'Recording of radio message 1 · Graudel Station · 22:31', npc: 'marit', bells: 9,
      voice: {model: 'en_alba', fx: 'radio', len: 1},
      text: 'This is Graudel Station, Olsen. Everything is fine with us. The generator is giving us trouble, but we are safe. Do not send anyone out in this weather.'}
  },

  pages: {
    lage: {title: 'Situation', role: null, html: `
      <p class="stamp">Coastal Control · Incident CC-2611</p>
      <h3>Graudel Hallig Research Station</h3>
      <p>Four people according to the roster: <b>Dr. Marit Olsen</b> (head), <b>Dr. Axel Brink</b>, <b>Hannah Voss</b>, <b>Nils Carson</b>.</p>
      <p>Storm “Elin”, force 11. Last regular contact: <b>21:40</b>. Since then: nothing.</p>
      <p>The only rescue vessel within reach: lifeboat <b>“Harriet”</b>. Helicopters do not fly in this wind.</p>`},
    boje: {title: 'Buoy data', role: FU, html: `
      <p class="stamp">Radio · Emergency buoy GRD-7</p>
      <p>The station’s emergency buoy has been transmitting since <b>22:15</b>. It is only triggered when someone throws it into the water.</p>
      <table><tbody>
      <tr><td>Start square</td><td><b>C3</b> (22:15)</td></tr>
      <tr><td>Drift</td><td>per hour <b>1 square east</b> and <b>1 square south</b></td></tr>
      <tr><td>Now</td><td><b>00:15</b> (two hours later)</td></tr>
      <tr><td>Signal</td><td>strong, position unchanged since 23:15</td></tr>
      </tbody></table>
      <p class="note">The chart knows what is in the water.</p>`},
    karte: {title: 'Chart', role: KA, html: `
      <p class="stamp">Chart · Graudel Deep</p>
      <p>Columns A–F from west to east, rows 1–6 from north to south.</p>
      <div class="grid" style="--n:7">
      <span></span><span>A</span><span>B</span><span>C</span><span>D</span><span>E</span><span>F</span>
      <span>1</span><span>~</span><span>~</span><span>~</span><span>~</span><span>~</span><span>~</span>
      <span>2</span><span>~</span><span>🏠</span><span>~</span><span>~</span><span>~</span><span>~</span>
      <span>3</span><span>~</span><span>~</span><span>~</span><span>~</span><span>~</span><span>~</span>
      <span>4</span><span>~</span><span>~</span><span>~</span><span>▒</span><span>~</span><span>~</span>
      <span>5</span><span>~</span><span>~</span><span>~</span><span>~</span><span>▒</span><span>~</span>
      <span>6</span><span>~</span><span>~</span><span>~</span><span>~</span><span>~</span><span>~</span>
      </div>
      <p>🏠 Graudel Hallig (B2) · ▒ <b>Graudel Sands</b> (D4, E5): sandbank. Whatever drifts in there <b>stays put</b>.</p>`},
    stationsbuch: {title: 'Station log', role: KA, html: `
      <div class="paper"><p class="stamp">Graudel Station · Station log (excerpt)</p>
      <p>The tower clock strikes the hour number on the hour (1 to 12 strokes).</p>
      <p>Chime <b>switched off from 22:00</b> (night quiet), back on from 07:00.</p>
      <p>Today: station staffed since 12:30 (ferry). Empty before that.</p></div>`},
    mitschnitt: {title: 'Tape: radio message 1', role: FU, html: `
      <p class="stamp">Radio · Recording</p>
      <p>Radio message 1 came at 22:31, radio message 2 at 23:14. Word for word identical. Listen closely, to the background too.</p>
      <div data-tape="funk1"></div>`},
    webcam: {title: 'Cellar camera', role: FU, html: `
      <p class="stamp">Radio · Station network, CAM 2</p>
      <p>The last image from the cellar camera before it failed. It is small. Zoom in and read everything you find.</p>
      <div data-photo="keller"></div>`},
    gefahrgut: {title: 'Hazardous goods list', role: KA, html: `
      <p class="stamp">Chart · Hazardous goods labeling (coastal protection)</p>
      <table><thead><tr><th>ID</th><th>Substance</th></tr></thead><tbody>
      <tr><td>GK-1102</td><td>Waste oil</td></tr><tr><td>GK-2210</td><td>Copper sulfate</td></tr>
      <tr><td>GK-3137</td><td>Milk of lime</td></tr><tr><td>GK-3317</td><td>Lead sludge</td></tr>
      <tr><td>GK-3371</td><td>Arsenic sludge</td></tr><tr><td>GK-4410</td><td>Chlorine bleach</td></tr>
      <tr><td>GK-7031</td><td>Diesel</td></tr>
      </tbody></table>`},
    funkplan: {title: 'Radio plan', role: KA, html: `
      <div class="paper"><p class="stamp">Graudel Station · Radio plan</p>
      <p>Channel 16 (156.800 MHz): distress and calling channel, <b>currently jammed</b></p>
      <p>Channel 69 (156.475 MHz): Husum harbor operations</p>
      <p>Channel 72 (156.625 MHz): <b>station-internal emergency channel</b></p>
      <p>Channel 77 (156.875 MHz): recreational boating</p></div>`},
    empfaenger: {title: 'VHF receiver', role: FU, html: `
      <p class="stamp">Radio · Receiver</p>
      <p>Somewhere on VHF someone is calling. Turn the receiver through the band until the voice emerges from the noise. The chart knows which channel it is.</p>
      <div data-tuner="notruf" data-target="156.625" data-min="156" data-max="157.4"></div>`},
    tide: {title: 'Tide table', role: KA, html: `
      <p class="stamp">Chart · Tide table Graudel Deep</p>
      <p>The <b>Graudel Sands</b> lie <b>0.90 m above Husum gauge zero</b>. Water above the sandbank = Husum gauge − 0.90 m.</p>
      <p>High water tonight around 02:10, after that the water falls quickly.</p>`},
    pegel: {title: 'Gauge live', role: FU, html: `
      <p class="stamp">Radio · Live data</p>
      <div data-widget="pegel"></div>
      <p><b>Lifeboat “Harriet”:</b> Draft 1.60 m. Regulation: at least 0.50 m of water under the keel.</p>`},
    morse: {title: 'Morse chart', role: KA, html: `
      <p class="stamp">Chart · Appendix light signals</p>
      <div data-morsetable></div>
      <p class="note">Word gap = longer darkness.</p>`}
  },

  widgets: {
    // Pegel steigt langsam mit der Spielzeit (reine Stimmung, die Lösung ist eine Rechnung)
    pegel(el, {elapsed}) {
      const v = 2.31 + Math.min(.6, elapsed / 3.6e6 * .4) + Math.sin(Date.now() / 900) * .015
      el.innerHTML = `<div class="net" style="display:block;position:static"><p>Husum gauge · live</p><div class="row"><span>Water level</span><b>${v.toFixed(2)} m</b><i>rising · high water approx. 02:10</i></div></div>`
    }
  },

  puzzles: {
    boje: {
      q: 'In which square is the emergency buoy now?', ph: 'Square, e.g. A1',
      hash: ['57a6cdee47cb7705db8e9342c427fa943e893a76b92b6110b5e59a3cc6691708'],
      near: {'97a4e860916ee5f3c15bc408b57cce559940eed515e0681df9dab4fc72b8d5be': 'Work it out hour by hour. What happens on a sandbank?', 'c1bfa0635fe073face4b938ab65fc513df025c32363eef833c0d802ee2b0adf6': 'That is the start. It drifts.'},
      hints: ['Radio: read out the start square and drift. Chart: move the buoy across the map hour by hour.', 'After one hour: D4. What is in D4?', 'D4 is a sandbank. It stays there.']
    },
    echo: {
      q: 'At what time was radio message 1 really recorded? (full hour)', ph: 'Time',
      hash: ['e5d9f8653c92390bfeba1bfc2399b30dd0623ec96709a736e7e45bd2c474d75c', '425c2f010544828fe0b8258ad9a30656c1678c64356cae273ce057771252b38d', '87e92e918efabb69b004ff97231f66f126b02ea50bf9deb3e2afe69584bd0a6c', 'd78cb44d11b1d3d8cb32bc698f50afeb9b75b694f8884232e9c89e9223d05fa7', '4cb67874a0bcb1d84a7c14de3ca8362a11809d6e4125df29deb68c55be03af58', '15e94c18301f50e50b2b631ee3e7a3366b66e0abdfe4dbbce13b0e236cb4cb87', 'bd57d9d1eaecc7e9eafcb111418ceed18275dbd6dca549dac499d88171bcc4fb', '6283af9fa7ce22df0c2d991f62082dad0e09e09fa1c8a3d8cfbb5755cd6ab4d7', '7536d764a4349f066fad8406437814e900d131b280515ec9f48057227cd72fc6'],
      near: {'39c98bbba4750bfb495c9a53149249ae6084baf312d62030577180f93e814c26': 'Nine strokes, yes. But was anyone at the station in the morning?', '02e1465a910f1ce9943af61912eb2566dd581abf09e2e1bc0551bb9586f518c3': 'Nine strokes, yes. But was anyone at the station in the morning?', '2e0413dd079e03f51fa3fcf2f3ab75e957ae724a79e2f2f5a2e61a74750e99ed': 'At 22:00 no bell would have struck.', 'a5edba51fb49497879869d5e1f9c95093e55403be63ec8642fd084ad5920d251': 'At 22:00 no bell would have struck.', 'a0deaa0cc32f5871f82d671ccb1ec55901c5b7b30b943449209171829e5206f7': 'At 22:00 no bell would have struck.', 'fe038700bad0b244b88f829aa2ab6bdad738cec253808c1c6c2742c00e8b55bf': 'That is when it was sent. It was recorded earlier.', 'cc0f0119157b1ca38d776cf1fa45fc609f9dc641a2a2130fc86e33028093e3d3': 'That is when it was sent. It was recorded earlier.'},
      hints: ['Radio: play the tape and listen to the background. Count along.', 'It strikes nine times. Chart: what does the station log say about the bell and the staffing?', 'Nine strokes, station staffed only from 12:30, bell off after 22:00: 21:00.']
    },
    fass: {
      q: 'What is stored in the station’s cellar?', ph: 'Substance',
      hash: ['a7d8ab1e97a51b2527c5eb9539bdee25959f44cdd407967b68edcfdfc7c8530c', 'f74fc5862b10ca6297ad74b051f23618eb45020b22030229dcce64eda23c4835', 'a7d8ab1e97a51b2527c5eb9539bdee25959f44cdd407967b68edcfdfc7c8530c'],
      near: {'d19ddca9bea577d60ab6de2b8575c15273aa51a4a23c210508bb0bcb73e1a6e4': 'Read the ID on the barrels again, digit by digit.', '1efd51ae71007cfad988199f1d1c9fa726581f2b1394f4d5874f742193cdb670': 'Read the ID on the barrels again, digit by digit.', 'fab92e6838252581fa16df8a7e4ab4e06c3d3d5ead350d06c013c9c76e4c60de': 'Read the ID on the barrels again, digit by digit.', '6b21df2d990e93ecdcdd30abecc3f924c0640b5b3cd32bdca292afb4743e88a8': 'Read the ID on the barrels again, digit by digit.', '922c4d60e744a5a2cc6ab33d4784192a594d606ff984e93c366f6ac1360165d0': 'That is the empty crate. What is written on the barrels?', '4c56dba16112779e63276429b88e0bd353acaaea6160eacb2cc1616e7e9a1382': 'That is the empty crate. What is written on the barrels?', 'ce090863abf17da32868afe1a7cb8a5a55af871251fc9b9f1f12578ebdd955da': 'That is the ID. What does it mean?', '0aefaf9a7a241b5513bec0a0fdd7df79f2e14681d147d0e2d61a4d455e0b15b9': 'That is the ID. What does it mean?'},
      hints: ['Radio: zoom into the image with ＋ or the mouse wheel, move it by dragging. The yellow labels on the barrels.', 'The barrels say GK-3317. Chart: look it up in the list. Careful, similar numbers.', 'GK-3317 is lead sludge.']
    },
    kanal: {
      q: 'Which password does the voice on the emergency channel say?', ph: 'Password',
      hash: ['4604985cac3c99e15f877e50a0e264d9a2f85ea61035bbfec9e16999b20d46ef'],
      near: {'bc08946e6ace500ab5171cf001574432e6042adaa2c5e619af15c9de0801b33e': 'That is the channel. What does the voice say there?', '1e656faaee85714e6b1d498b86b704a47913e8006646f9c93e80bfe9df8e6273': 'That is the channel. What does the voice say there?', '833faeaacc059294c6a4a60634dd67d31ee006b721c12245204498dc73d8c68e': 'That is the channel. What does the voice say there?', '9d37981651fd286801d72a06df613d97a8585d1650c2cc71497f1aa8a832067a': 'That is the frequency. What does the voice say there?', '91a1e617de9a4abf8bf29d6de3e1ed60d5f7670f1f27005940bd36e89c9aac0e': 'That is the frequency. What does the voice say there?'},
      hints: ['Chart: the radio plan lists the station’s emergency channel. Radio: switch the receiver on and tune to it.', 'Channel 72 is 156.625 MHz. Fine-tune with − and +.', 'The voice says “Beacon”.']
    },
    pegel: {
      q: 'From which Husum gauge level (in meters) can the “Harriet” safely cross Graudel Sands?', ph: 'Meters',
      hash: ['215cf45db6cf8dd7c9d91d98e14cf072915b640468c058985499a54ab7d49c85', 'f26ba04b7e82597e55123f17302c7b2a5cae93b12e4fd5a17ff81e94a6859713', '3eb759ca74b9377341fc4954b03ffcccbf2cacd6a14a7020bb2da6784c98eb2c', 'abced44afb5313ac8906f0b7b04e1c15f940fab3aa5b613d0d492d8391d82747', '04ea0c7213ea74344610be7cf41c2d7acdac072db8285ecbd12134674cf3f025', '4665b62096647892de5c1a9d59bc2c5eed14d09c700d4f3a16b315fc41f6beb6', '867c86fb70d909b7700037638b76b6a94c78186b1114a1e807cac6bea058f3fc', '4a4d7aaacd6fb5be584d2d363e30297d4dd53ab32275dc82a2597e07a72c1598', 'ef8dd267aaf69623c5824d70ec965031c992bea773533f7f88b9344609d4a152'],
      near: {'e5d9f8653c92390bfeba1bfc2399b30dd0623ec96709a736e7e45bd2c474d75c': 'That is only what the ship needs. The sandbank is higher than gauge zero.', 'fe19c7a265026d95506a4dd46310b08b7045ef2ee7c2840828b44cbe40e654d4': 'That is only what the ship needs. The sandbank is higher than gauge zero.', '42efb1f82e5c4bb80c06e4d21b9a8d3dc57f2b4f07cfe58be7bd659771ad6b50': 'That is only what the ship needs. The sandbank is higher than gauge zero.', '7e83e7b35a15ea8896fbac725b9eb1b6b2bdc0cfb296c76bf67ae8f128a137f8': 'That is only what the ship needs. The sandbank is higher than gauge zero.', '2e0be923c8d2f915fe26d2d5f669bff6852c2e5acdbfa12e45cab9a330c647ca': 'Close. Add the safety margin.', '1290fa6ca2375e306120c65bb8dab51701085a39dc907d988bece95c7a1ab5e0': 'Close. Add the safety margin.', 'f66d8c16d1f4fafab2b900a218b0842ecbc9ea628672557f3380eba9c148494d': 'Close. Add the safety margin.', '057a57254ac182ed089c2c2a0f52eff983aa39d99f6925db96ce764c9cc785c9': 'Close. Add the safety margin.'},
      hints: ['Radio: draft and regulation. Chart: height of the sandbank.', 'The ship needs 1.60 + 0.50 = 2.10 m of water above the sandbank.', '2.10 m + 0.90 m height of the sandbank = gauge 3.00 m.']
    },
    licht: {
      q: 'What is the lamp on the dinghy flashing?', ph: 'Message',
      hash: ['cf3901aa4ef5b89e568b8791e1b4965e956a1a4b42150b31665f4e16b14e521b', '1e2a3732e747a9a151052854b9edf7eb60e5e7f4a7b90fe75baa769cdc09844b', 'bb8547b3f43351f875cdce21b84f4faac3dfedff4e299385fd13cb73c5963d50', '31d06f1e3d2929760a7c03467e9362cd57c7e94a871f77bc0b3b4f6dad768be9'],
      near: {'aa4e89e640e107e64b4600c13cbb239e2ac781a74e27136e7faab0f8e9aaaba2': 'There is more after the pause.', '759298226aea51d4c5ce4376b4d07fb20719eed01ec8f79dfe9ea14c1edfe003': 'That came before. Now they are flashing something else.'},
      hints: ['Radio: call out every flash. Chart: the table.', 'Two words. The first is ––– –· ·–·· –·–– .', 'ONLY TWO.']
    }
  },

  endings: {
    boot: {title: 'Ending: SEA', code: 'CC-SEA',
      text: 'The “Harriet” finds the dinghy at dawn. Hannah Voss and Nils Carson are alive. On the hallig Tom, Marit and Axel hold out until noon. The barrels in the cellar are gone. Washed into the sea.',
      epilog: 'Three months later: dead mussels in Graudel Deep, by the ton. The samples show a substance that officially does not exist. Marit Olsen testifies before the committee. Her first sentence: “I lied to Coastal Control.”'},
    warft: {title: 'Ending: MOUND', code: 'CC-MOUND',
      text: 'The “Harriet” picks up Tom, Marit and the injured Axel from the hallig. With them: samples from the cellar. The dinghy is only found at noon. Hannah and Nils are hypothermic, but alive. Barely.',
      epilog: 'The samples go to a lab in Kiel. Result: legacy waste from an arms manufacturer, illegally stored, with the knowledge of the station. Hannah Voss resigns. She writes: “You chose the truth. I would have done the same. I think.”'},
    ebbe: {title: 'Ending: EBB TIDE', code: 'CC-EBB',
      text: 'The tide has turned. The “Harriet” can no longer cross Graudel Sands. A helicopter takes off at dawn. Everyone survives, but only just, and the barrels are gone.',
      epilog: 'Captain Jessop sends a postcard to Coastal Control: a lighthouse, and underneath “Faster next time. We will go out again anyway. O. J.”'}
  },
  codes: {'64ef22e77e3c9eba3adbb669b113a4c126411e59c84553c2bcac5b95ce971e45': 'boot', '40bf6615d34e5c1aa25215932950cc5f23d79f80641e360b256c6eb2bbbf4954': 'warft', '7e397803506ef57e770d3ac7bf62920c2bb95af5a5dde2dee76f3878c774d15b': 'ebbe'},

  script: [
    // ---------- Kapitel 1 ----------
    ['chapter', 1, 'Storm Surge'],
    ['ambience', 'storm'],
    ['goal', 'Jake takes the situation briefing.'],
    ['wait', 2500],
    ['snap'],
    ['join', 'jannik'],
    ['wait', 800],
    ['say', 'jannik', 'Evening. Good that you are here. It is a rough night.'],
    ['say', 'jannik', 'Graudel Hallig, research station, four people. Last contact at twenty-one forty. Radio silence since.'],
    ['unlock', 'lage'], ['unlock', 'karte'], ['unlock', 'boje'],
    ['say', 'jannik', 'I am sending you the situation. Radio has the buoy data, Chart has the map. Hold on, something is coming in.'],
    ['goal', 'The station is calling. Pick up.'],
    ['call', 'marit', {note: 'Satellite phone · Graudel Station', timeout: 30000}],
    ['say', 'marit', 'This is Graudel Station, Olsen. Everything is fine with us. The generator is giving us trouble, but we are safe. Do not send anyone out in this weather.'],
    ['fx', 'static'],
    ['leave', 'marit', 'off'],
    ['say', 'jannik', 'Well then. All clear? Only strange: the station’s emergency buoy is transmitting. Since twenty-two fifteen. It only goes off when someone throws it in the water.'],
    ['goal', 'Find out where the emergency buoy is now.'],
    ['solve', 'boje'],
    ['say', 'jannik', 'D4. On Graudel Sands. Someone threw it toward the open sea in the storm. That makes no sense if everything is fine.'],
    ['wait', 2500],

    // ---------- Kapitel 2 ----------
    ['chapter', 2, 'Echo'],
    ['goal', 'The station is calling again.'],
    ['call', 'marit', {note: 'Satellite phone · Graudel Station', timeout: 30000}],
    ['say', 'marit', 'This is Graudel Station, Olsen. Everything is fine with us. The generator is giving us trouble, but we are safe. Do not send anyone out in this weather.'],
    ['leave', 'marit', 'off'],
    ['fx', 'shake'],
    ['say', 'jannik', 'Wait. That was word for word. Exactly the same words, the same intonation. As if it were a recording.'],
    ['unlock', 'mitschnitt'], ['unlock', 'stationsbuch'],
    ['say', 'jannik', 'I sent you the recording. When was that really recorded?'],
    ['goal', 'Find out when radio message 1 was recorded.'],
    ['solve', 'echo'],
    ['say', 'jannik', 'Twenty-one hundred. That means the message is over three hours old. Someone is playing it to us. So that we do not send anyone out.'],
    ['unlock', 'webcam'], ['unlock', 'gefahrgut'],
    ['say', 'jannik', 'The station has a cellar camera on the network. The last image is from twenty-two fifty-eight. What is down there?'],
    ['goal', 'Find out what is stored in the station’s cellar.'],
    ['solve', 'fass'],
    ['say', 'jannik', 'Lead sludge. Forty barrels. That must not even come near a hallig. And the tide is rising.'],
    ['wait', 2500],

    // ---------- Kapitel 3 ----------
    ['chapter', 3, 'The Fifth'],
    ['unlock', 'funkplan'], ['unlock', 'empfaenger'],
    ['say', 'jannik', 'Something has been hissing on VHF for minutes. Channel sixteen is jammed. Radio, find the station’s emergency channel.'],
    ['goal', 'Search the noise for the station’s emergency channel. What does the voice say?'],
    ['solve', 'kanal'],
    ['say', 'jannik', 'Beacon. A password. Whoever it is, they want to get through to us.'],
    ['goal', 'Someone is knocking. From the station.'],
    ['knock', 'tom'],
    ['join', 'tom'],
    ['say', 'tom', 'Hello? Can anyone hear me? Please, I do not have much battery.'],
    ['say', 'tom', 'Turn your mics off. If she hears that I am talking to you …'],
    ['goal', 'The caller is whispering. All microphones off.'],
    ['quiet', 'mic', 'tom', 'I am Tom. Intern at the station. I am on no list, I only started on Monday.', 'Please! Mics off!'],
    ['quiet', 'mic', 'tom', 'The others went out in the dinghy at half past ten. Dr. Olsen sent them. She stayed behind herself. And Axel.', 'Please! Mics off!'],
    ['quiet', 'mic', 'tom', 'She is playing you the old message so that nobody comes. There are barrels in the cellar. Forty of them. Nobody is supposed to see them.', 'Please! Mics off!'],
    ['quiet', 'mic', 'tom', 'I threw the emergency buoy. That was me. You can talk again.', 'Please! Mics off!'],
    ['set', 'tom', true],
    ['say', 'jannik', 'Okay. We will send the “Harriet”. But it only gets over Graudel Sands with enough water. Work out the gauge level for me.'],
    ['unlock', 'tide'], ['unlock', 'pegel'],
    ['goal', 'Mics on. From which gauge level does the “Harriet” get over the sandbank?'],
    ['solve', 'pegel', {npc: 'tom', every: 45000, taunts: ['Are you still there?', 'The water is rising. It is already at the fence.']}],
    ['say', 'jannik', 'Three meters. The gauge is at two point five and rising. That will be enough in just under an hour.'],
    ['say', 'tom', 'My battery is almost dead. The connection is dropping …'],
    ['goal', 'Tom’s connection is dropping. Hold it together.'],
    ['hold', {label: 'Hold the connection to Tom', ms: 3500}],
    ['say', 'tom', 'Thank you. From the mound I can see the dinghy. They are flashing with the lamp. I am pointing the phone at it.'],
    ['wait', 1000],

    // ---------- Kapitel 4 ----------
    ['chapter', 4, 'Beacon Light'],
    ['ambience', 'radio'],
    ['call', 'ole', {note: 'VHF channel 16 · Lifeboat “Harriet”'}],
    ['say', 'ole', 'Harriet here, Jessop. We leave as soon as the gauge is right. I only have one window of time, then the tide turns.'],
    ['say', 'ole', 'Tell me what the dinghy is flashing. Where I go depends on it.'],
    ['unlock', 'morse'],
    ['morse', 'tom', 'ONLY TWO', 300],
    ['goal', 'Read the dinghy’s light signal before the tide turns.'],
    ['timer', 240000, 'Tide'],
    ['solve', 'licht', {npc: 'ole', every: 50000, onFail: 'ebbe', taunts: ['The window is getting smaller.', 'Control, I need an answer.']}],
    ['timer', null],
    ['morse', null],
    ['say', 'ole', 'Only two in the boat? There were three. And they cannot see us in the rain.'],
    ['say', 'tom', 'I am holding the phone into the wind. All of you shout at the same time, as loud as you can. Maybe they will hear you.'],
    ['goal', 'Give the dinghy a signal: everyone shout loudly at once.'],
    ['clap', {label: 'Everyone shout “HERE!” together', text: 'Tom holds the phone over the mound. Shout or clap all at the same moment. Mic on!'}],
    ['say', 'tom', 'They heard it! They are flashing back! They are heading for the mound.'],
    ['say', 'ole', 'Good. Where is the third?'],
    ['call', 'marit', {note: 'Satellite phone · Graudel Station · live'}],
    ['say', 'marit', 'Olsen here. This time for real. I lied to you. I am sorry.'],
    ['say', 'marit', 'Axel swam back to get me. He is here. He is injured. And down in the cellar water is running into the barrels.'],
    ['say', 'marit', 'If you do not get the samples, the evidence will be in the sea tonight. But out there Hannah and Nils are drifting.'],
    ['leave', 'marit', 'off'],
    ['say', 'ole', 'I can make one trip. Only one. Control, where to?'],
    ['goal', 'Decide together: where does the “Harriet” go?'],
    ['vote', {id: 'fahrt', prompt: 'Where does the “Harriet” go?', options: [
      {id: 'boot', label: 'To the dinghy', desc: 'Hannah and Nils are drifting out to open sea. The hallig will hold until tomorrow.'},
      {id: 'warft', label: 'To the hallig', desc: 'The injured Axel, Tom, Marit and the samples from the cellar.'}
    ]}],
    ['say', 'ole', 'Understood. Harriet is heading out.'],
    ['ending', s => s.results.fahrt],
    ['label', 'ebbe'],
    ['morse', null],
    ['say', 'ole', 'Too late. The tide has turned. We cannot get across any more.'],
    ['ending', 'ebbe']
  ]
}
