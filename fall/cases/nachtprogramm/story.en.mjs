// Case “Night Programme” (single player, hard), English version. Radio Harbor Wave, Crane and all people are fictional.
// Puzzle chain: Morse at the mast → key sheet → number groups (one-time pad) → CANDLE → Vigenère → STATIONCHIEF.

const img = id => `<svg viewBox="0 0 960 540" xmlns="http://www.w3.org/2000/svg"><image href="portraits/${id}.webp" width="960" height="540"/></svg>`

// Schlüsselblätter aus Wendts Mappe (Blatt 7 ist das richtige)
const BLAETTER = ['730158264490', '115902736648', '906341287750', '258830619427', '641175098326', '397264150083', '482719503361', '019486327715', '563027841962']

export default {
  id: 'nachtprogramm',
  title: 'Night Programme',
  unit: 'Radio Harbor Wave · Control room',
  file: 'Broadcast log 0-NP-0300',
  accent: '#ff5d73',
  chapters: 5,
  solo: true,
  lobby: 'You are sitting alone in the control room of Radio Harbor Wave at night. At three o’clock a strange voice takes over your frequency and reads out numbers. A hard case for you alone, about 60 to 90 minutes. Pen and paper help. So do headphones.',
  invite: 'I am sitting in a radio control room at night and a strange voice is reading numbers on our frequency. Will you listen in?',
  lockText: 'Julie: You cannot leave now. We are on air.',
  roles: {
    regie: {name: 'Control room', blurb: 'All the documents, all the decisions.'}
  },
  share: {
    text: 'Tonight, {time}, on 97.4: Attention, Crane. I took notes.',
    tag: '#NightProgramme',
    rows: ['4128 2354 4566', 'SHEET SEVEN', 'NIGHT MOTH'],
    lines: ['Some transmitters stay silent for 35 years.', 'Then they switch themselves back on.']
  },

  npcs: {
    jule: {name: 'Julie Hart', sub: 'Studio 1 · ON AIR', tts: {pitch: .95, rate: 1},
      voice: {model: 'en_kristin', fx: 'video', len: 1.0},
      face: {photo: 'jule', skin: '#e3b89c', fem: true, hair: {style: 'long', color: '#1e1a1a'}, extras: ['earring'], top: {style: 'turtleneck', color: '#141414'}, extrasColor: '#ccc', mood: 'neutral', scene: 'radio'}},
    kranich: {helps: false, name: 'Crane', sub: 'External feed · 97.4 MHz', look: 'void glitchy', tts: {pitch: .6, rate: .8},
      voice: {model: 'en_alba', pitch: -2, fx: 'radio', len: 1.1},
      face: {photo: 'kranich', silhouette: true, glow: '#ff5d73', hair: {style: 'short'}, scene: 'void'}},
    krause: {helps: false, name: 'Dennis Crowe', sub: 'Station chief · private', tts: {pitch: .8, rate: 1.05},
      voice: {model: 'en_norman', pitch: -2, fx: 'phone', len: 1.0},
      face: {photo: 'krause', skin: '#e0ae92', age: 2, hair: {style: 'short', color: '#a8a39c'}, glasses: 'square', top: {style: 'coat', color: '#1f2a44'}, mood: 'stern', scene: 'office'}},
    ben: {name: 'Ben Okafor', sub: 'Broadcast engineering · Sullberg mast', tts: {pitch: 1, rate: 1.08},
      voice: {model: 'en_joe', pitch: 1.5, fx: 'phone', len: .98},
      face: {photo: 'ben', skin: '#6b4330', hair: {style: 'curly', color: '#111'}, top: {style: 'jacket', color: '#ff7a1a'}, mood: 'worried', scene: 'storm'}},
    wendt: {name: 'Horace Wendt', sub: 'Listener hotline', tts: {pitch: .75, rate: .9},
      voice: {model: 'en_nem', pitch: -3, fx: 'call', len: 1.06},
      face: {photo: 'wendt', skin: '#e6c0a8', age: 2, hair: {style: 'slick', color: '#e8e6e2'}, top: {style: 'sweater', color: '#5a5a54'}, mood: 'smile', scene: 'radio'}}
  },

  photos: {
    mast: img('mast')
  },

  clips: {
    gruppen: {title: 'Recording 03:00 · 97.4 MHz · “Crane”', npc: 'kranich',
      voice: {model: 'en_alba', pitch: -2, fx: 'radio', len: 1.1},
      text: 'Attention. Crane calling Night Moth. Attention. Crane calling Night Moth. Three groups. Four. One. Two. Eight. Pause. Two. Three. Five. Four. Pause. Four. Five. Six. Six. I repeat. Four. One. Two. Eight. Two. Three. Five. Four. Four. Five. Six. Six. End.'},
    fernwahl: {title: 'Remote-control modem Sullberg mast · Dial-in 02:57', dtmf: '04215573'},
    buchstaben: {title: 'Crane on a new frequency', npc: 'kranich',
      voice: {model: 'en_alba', pitch: -2, fx: 'radio', len: 1.1},
      text: 'Crane. Second message. Letters. Uniform. Tango. November. Whiskey. Tango. Sierra. Papa. Charlie. Uniform. Lima. Papa. Juliett. Key is the first message. End.'}
  },

  pages: {
    sendeplan: {title: 'Schedule', role: null, html: `
      <div class="paper">
        <p class="stamp">Radio Harbor Wave 97.4 · Night</p>
        <p>00:00–04:00 <b>Night Moth</b> · Listener hotline with Julie Hart (live)</p>
        <p>Control room: you · Broadcast engineering on standby: Ben Okafor</p>
        <p>Station chief: Dennis Crowe (call only in an emergency!)</p>
      </div>`},
    mast: {title: 'Mast camera', role: null, html: `
      <p class="stamp">Ben · Phone camera · Sullberg mast</p>
      <p>The red aircraft warning light at the top of the mast should shine steadily. It does not. Ben’s tile shows it live, the strip below writes along.</p>
      <div data-photo="mast"></div>
      <p class="note">Look up Morse signs: page “Morse chart”.</p>`},
    morsetafel: {title: 'Morse chart', role: null, html: `
      <p class="stamp">Broadcast engineering · Notice at the mast</p>
      <p>Short = · (one beat), long = – (three beats). Short pause between letters, long between words.</p>
      <div data-morsetable></div>`},
    mappe: {title: 'Wendt’s folder', role: null, html: `
      <p class="stamp">By mail from the listener hotline · “Transcript, all from memory”</p>
      <p>In 1989 Wendt took notes in radio intelligence. He says these are Crane’s key sheets. He does not say why he still has them.</p>
      <table><thead><tr><th>Sheet</th><th>Key</th></tr></thead><tbody>
      ${BLAETTER.map((b, i) => `<tr><td>${i + 1}</td><td class="mono">${b.match(/..../g).join(' ')}</td></tr>`).join('')}
      </tbody></table>
      <div class="paper">
        <p class="stamp">Crane · Procedure</p>
        <p>1. Write down the number groups.</p>
        <p>2. Write the key of the sheet underneath. For each digit: <b>message minus key</b>. If it goes negative, add ten (7 − 9 → 8). No carrying.</p>
        <p>3. Every two digits make a letter: 01 = A, 02 = B … 26 = Z.</p>
      </div>`},
    mitschnitt: {title: 'Recording 03:00', role: null, html: `
      <p class="stamp">Control room · automatic recording</p>
      <p>The strange voice as it went out over your transmitter. Playing it more slowly helps with writing it down.</p>
      <div data-tape="gruppen"></div>`},
    modem: {title: 'Remote-control modem', role: null, html: `
      <p class="stamp">Ben · Log of the mast control</p>
      <p>At 02:57 someone dialed into the mast control by phone. The modem recorded the key tones: eight keys, the caller’s phone number.</p>
      <div data-tape="fernwahl" data-spectrum></div>
      <table><thead><tr><th></th><th>1209 Hz</th><th>1336 Hz</th><th>1477 Hz</th></tr></thead><tbody>
      <tr><td>697 Hz</td><td>1</td><td>2</td><td>3</td></tr>
      <tr><td>770 Hz</td><td>4</td><td>5</td><td>6</td></tr>
      <tr><td>852 Hz</td><td>7</td><td>8</td><td>9</td></tr>
      <tr><td>941 Hz</td><td>✱</td><td>0</td><td>#</td></tr>
      </tbody></table>
      <p class="note">Each key = one low + one high tone. Normal speed, otherwise the tones shift.</p>`},
    empfaenger: {title: 'Scanning receiver', role: null, html: `
      <p class="stamp">Control room · Monitor receiver FM</p>
      <p>Crane has changed frequency. Somewhere between 87.5 and 108 MHz. Turn until the voice is clear.</p>
      <div data-tuner="buchstaben" data-target="101.7" data-min="87.5" data-max="108"></div>`},
    tafel: {title: 'Letter table', role: null, html: `
      <p class="stamp">Crane · second procedure (from Wendt’s folder)</p>
      <p>Letters are shifted with a keyword that repeats. To decrypt: find the row of the key letter, find the secret letter in it, read off the top.</p>
      <p>Shorter calculation: <b>Plaintext = secret minus key</b> (A = 0, B = 1 … Z = 25; if negative, add 26).</p>
      <div class="vig">${(() => { const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        return `<table class="vigtab"><thead><tr><th></th>${[...A].map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${
          [...A].map((r, i) => `<tr><th>${r}</th>${[...A].map((_, j) => `<td>${A[(i + j) % 26]}</td>`).join('')}</tr>`).join('')}</tbody></table>` })()}</div>`},
    festschrift: {title: 'Anniversary booklet 30 years', role: null, html: `
      <div class="paper">
        <p class="stamp">Radio Harbor Wave · 30 years · Page 4</p>
        <p><b>Dennis Crowe, station chief since 1991</b></p>
        <p>Born in 1964 in Rostock. After his apprenticeship a radio operator in the Warnemünde maritime radio service, until reunification. “I was always awake at night. My colleagues just called me the Night Moth.”</p>
        <p>1991 founding of Radio Harbor Wave. First broadcast: the night programme. He chose the name of the show himself.</p>
      </div>`},
    schalttafel: {title: 'Switchboard mast', role: null, html: `
      <div class="paper">
        <p class="stamp">Broadcast engineering · Emergency operation · Sullberg mast</p>
        <p>1 Aircraft light · 2 Main transmitter · 3 Reserve transmitter · 4 Antenna North · 5 Antenna South · 6 Cooling · 7 External feed · 8 Emergency power</p>
        <p>a) The aircraft light always stays on (aviation law).</p>
        <p>b) The external feed must be off. Crane broadcasts through it.</p>
        <p>c) Exactly one transmitter runs: main or reserve.</p>
        <p>d) The main transmitter radiates only through Antenna North, the reserve transmitter only through Antenna South. The other antenna stays off.</p>
        <p>e) Cooling on exactly when a transmitter runs.</p>
        <p>f) The reserve transmitter has no power supply of its own and needs emergency power. The main transmitter cannot take emergency power.</p>
      </div>
      <p class="note">Ben: “The storm bent Antenna North. It will not get any power today.”</p>`}
  },

  puzzles: {
    blatt: {
      q: 'What is the aircraft warning light on the mast flashing?', ph: 'Word(s)',
      hash: ['288db45412aa20a2dff4c80479f844369023b5249e96d5560e4c60daf9a9ae20', '06962306cbc9358f63a8ae8464016da455a5546bbb7968d0074d37f722913d4e', '06962306cbc9358f63a8ae8464016da455a5546bbb7968d0074d37f722913d4e', '288db45412aa20a2dff4c80479f844369023b5249e96d5560e4c60daf9a9ae20'],
      near: {'2a3cbf25fcd244054cd15df25702774b9adc0faf8993d6e143d162dad7e63f14': 'Right, and which sheet? There is another word to come.', '72b7b099604343a4ae0518c09f640d5539442df3059dbe43a413aca75fe84416': 'Close. Count the letters again.', '96ed04743374119395297d3a4dfdf58931971afd2d125e8176b8f366e9f6d091': 'Close. Count the letters again.', '182c2194e0eac3171bed3d41cc5ed3a8ff2b031be8dbbd0ae4f928699252bb7c': 'Close. Count the letters again.', '34ad57af826a48584dbbffc6358fd21554af02f946ddd3ddb1b4c7b57fca5b05': 'Close. Count the letters again.'},
      hints: ['The lamp sends two words. Watch for the long pause between the words and the very long one before it starts over.', 'Write along with the Morse chart: tap · and –, press “Letter ✓”. The first word begins with S.', 'SHEET SEVEN.']
    },
    gruppen: {
      q: 'Crane is calling Night Moth. What is the first message in plain text?', ph: 'Word',
      hash: ['b05bdd70b75ca31010b92141b624ab3cd0c165de8189cfd34d95360f20d19f3a'],
      near: {'82d9fa5847344686a24425755181c27029b299d627847893ed85f50601f7017a': 'Those are the numbers as they were sent. Now subtract the key from sheet 7.', '02af854f1375918f58589be70c9309f8754998500af951ab9f8bc0cd63f7cff2': 'Close! Now turn every two digits into a letter.', '85748596ec443d533d858c2926624c2e81f61062a9be1e73b316a05a9df6e882': 'That is how Crane calls. The message itself is shorter.', '0413829a9098417a9fa6367328d2b6c82a1e6a771a79ddd40679df2e429270ff': 'That is how Crane calls. The message itself is shorter.'},
      hints: ['Play the recording in your file more slowly and write down the three groups of four. Wendt’s folder has the key, you know the sheet from the mast.', 'Groups 4128 2354 4566, key sheet 7. Subtract digit by digit, without carrying (1 − 8 → 11 − 8 = 3), then turn every two digits into a letter.', '03 01 14 04 12 05 = CANDLE.']
    },
    fernwahl: {
      q: 'Who dialed into the mast? The phone number:', ph: 'Number', input: 'digits',
      hash: ['0900d34e7d5281f8dcc40ae40bed479f2f6440f43fb0796d79b6cbe01b827543'],
      near: {'7c1f9df441cb93c4c10c64e8056290dd583b9da3a22d8bd58d50f002efd9693e': 'The first key is missing.', '47985817fc3228225ad16538b0419cf585875fd4cd15cafb668e4b579a440499': 'There are eight keys.'},
      hints: ['Play the modem at normal speed and read both tones of each key under the tape.', 'Low tone = row, high tone = column. 941 + 1336 Hz is the 0.', '0421 5573.']
    },
    klartext: {
      q: 'Crane’s second message in plain text:', ph: 'Word',
      hash: ['a06a68999df0612305fe76156c4ddf13644e8cb05de36c55678a2201a8ba96ff', 'bc03fdb872dad09dad86c0563ed7a6fb8b3b7f4a1ae579ee35f5c1a0d547c919', '6aaa137cd6721d0d61ba8d330fe16441d52a567f009fc4166e20dbc28545c5fa'],
      near: {'32a2a82c0f198f9b0883ff421a9fd4c5c9640b311e2ae23ccd2f947c322e5f6e': 'That is still encrypted. The key is the first message.', '31ca998c4c7e5666dc95b1eee9404f32cc5df1a19b1a7e393e983f24ef9acfa9': 'Exactly him. But the message calls him something else.', '79f3d5a72af4fc0bc58460281968d8d591868c33a3b4b6a5efd0190a1d6790e7': 'Exactly him. But the message calls him something else.', '1f640e36db0c08d6399abe13eb3ae65a39920052ce838a7a11a20642ec49da36': 'Exactly him. But the message calls him something else.'},
      hints: ['Scanning receiver in the file: turn slowly until the voice is clear, and write down the letters (Alfa = A, Bravo = B …).', 'Ciphertext U T N W T S P C U L P J, key CANDLE repeated. Secret minus key: U − C = S, T − A = T …', 'STATIONCHIEF.']
    },
    schalter: {
      q: 'Switchboard at the mast: cut off Crane, keep broadcasting your own programme.', input: 'switches', n: 8,
      labels: ['Light', 'Main', 'Reserve', 'North', 'South', 'Cooling', 'Ext. feed', 'Emergency'],
      hash: ['83df09e0643b158d62c442db8bc2f26b11184ad65321e446358f4bc870a36681'],
      near: {'5a1452e59aa1b19beb9e252a3d827f50efa3c26d67d43f17f94bb6b0c4368ff4': 'That would be right if Antenna North were intact. But it is not.', '9a56b3045fe8817185bf41b62c1bf0f1bd9645036778fc5c31d185ea47cbed9b': 'The reserve transmitter has no power supply of its own.', 'ed17103e836770a3f7c682d159f524de59dcdfff71517622f8e782763b7a09fa': 'Crane keeps broadcasting through the external feed.', 'c01321ea53a4f7b63e2652d0377bdc03f124d1ad7502fef11a41dc7e1161c36d': 'The aircraft light must always be on.', '7ab78a35409ee2dabae8851d263d3824c858ca5faf2a7aadcb12282c81f182fb': 'Without cooling the transmitter burns out.'},
      hints: ['Start with the sure things: light on, external feed off. Antenna North is broken, so off.', 'Without Antenna North there is no main transmitter. So the reserve transmitter via Antenna South. What else does it need?', 'On: Light, Reserve, South, Cooling, Emergency. Off: Main, North, Ext. feed.']
    },
    kranich: {
      q: 'Who is Crane?', ph: 'Name',
      hash: ['22b7e6824e9b682683467da475be834dc63e94431b16e88b762a494be283f763', '9ba6aac11d79ae3e7dfa10cb8d87240c0e0e4871fad7bd890d62565257e75e3b', 'e8058bf381a42c19e6d4ceb21926af598f422e5965102b882e7c72b7e1b9a704', '0cc35483f4e1b1ed8d5d90f8362a54abab0599749ce7f185f03b4b5dca124837'],
      near: {'31ca998c4c7e5666dc95b1eee9404f32cc5df1a19b1a7e393e983f24ef9acfa9': 'Crowe is Night Moth. Crane calls him.', '79f3d5a72af4fc0bc58460281968d8d591868c33a3b4b6a5efd0190a1d6790e7': 'Crowe is Night Moth. Crane calls him.', 'bcd86a244c7e7c765f642b1b2187b598a35358ad5d85d40276bafabda285ab8a': 'Julie was four years old in 1989.', '7ac48d09cff094fa69a8e72791a30cead9028f0ee186027e204bf013b2096a51': 'Julie was four years old in 1989.', 'c60ed8215a6582bd57aaee4ad4cb2cfcd66b26c6ad89d95870bf3a899f15e6e1': 'Ben was not even born then.', 'd873f45fdd15cc8e45dcb89f55116aff6801a801a5c248f45b87bb164b94d8d9': 'Ben was not even born then.'},
      hints: ['Who still has the key sheets that should have been destroyed long ago?', 'Whose phone rang when you dialed the number from the modem? And what is standing behind him in Wendt’s room?', 'Horace Wendt.']
    }
  },

  endings: {
    live: {title: 'Ending: LIVE', code: 'NP-LIVE',
      text: 'Crowe’s confession runs live on 97.4. At 7 the archive opens, at 8 the nine names are online, at 9 Crowe has resigned. Radio Harbor Wave keeps broadcasting. With you in the control room.',
      epilog: 'A year later the show gets a new name. Julie gets to pick it. She calls it “Control Room”. Because someone sat there who listened.'},
    aus: {title: 'Ending: RADIO SILENCE', code: 'NP-SILENCE',
      text: 'You pull the fader down. Silence on 97.4. Crowe thanks you, Julie says nothing more. In the morning the archive opens, but nobody is looking for a night moth.',
      epilog: 'For Christmas Crowe sends you a bottle of wine. The card says: “Good direction is when you hear nothing.” You do not drink it.'},
    stoerung: {title: 'Ending: SHUT DOWN', code: 'NP-SHUTDOWN',
      text: 'The regulator switches the mast off before you have managed the switchboard. Crane falls silent, Radio Harbor Wave too. Nobody will ever hear what Crane still wanted to say.',
      epilog: 'Months later, at night, a shortwave radio at the flea market. You turn the knob. Somewhere a voice is counting. Four. One. Two. Eight.'},
    kranich: {title: 'Ending: CRANE', code: 'NP-CRANE',
      text: 'Horace Wendt takes out his hearing aids and smiles. “Crane. Not said for thirty-five years.” In 1989 he sent the messages that betrayed Crowe, and tonight one last time. So that Crowe says it himself. Live.',
      epilog: 'Wendt sends you a postcard with no text. Only numbers: 6825 1064 4470. With sheet 7 that makes a word. You already know which.'}
  },
  codes: {'cbe435051e87f63a2212712ce6b2cd43c410551cfe3edd46c01d02570eea3447': 'live', '65d7eed90e36bf3b2a3d410c8913cc805e02186184e75a1ae8bec81b4726f34b': 'aus', 'fdb85aed15d5916e8b83bdcb3f0e122cab160df60db98ec4ba4342da321e4547': 'stoerung', '859352fe08d857f9106a54b5389702ed0184c7be4cd25a7350f993ec30012466': 'kranich'},

  script: [
    // ---------- Kapitel 1 ----------
    ['chapter', 1, 'Three o’clock'],
    ['ambience', 'hum'],
    ['goal', 'Night Moth is running. You are in the control room.'],
    ['unlock', 'sendeplan'],
    ['join', 'jule'],
    ['say', 'jule', 'Two fifty-eight, this is the Night Moth on Radio Harbor Wave. Soon three o’clock, soon the news. Control room, {me}, can you hear me?'],
    ['say', 'jule', 'Your mic is patched to my headphones. And sometimes to the transmitter too. Better turn it off while I am presenting.'],
    ['goal', 'Julie is live on air: mic off.'],
    ['quiet', 'mic', 'jule', 'Thank you. And now, shortly before three: the time check.', 'I can hear you on the transmitter! Mic off!'],
    ['fx', 'static'],
    ['ambience', 'radio'],
    ['join', 'kranich', 'glitch'],
    ['say', 'kranich', 'Attention. Crane calling Night Moth. Attention. Crane calling Night Moth.'],
    ['say', 'kranich', 'Three groups. Four. One. Two. Eight. Two. Three. Five. Four. Four. Five. Six. Six.'],
    ['leave', 'kranich', 'glitch'],
    ['unlock', 'mitschnitt'],
    ['say', 'jule', 'What was that? That did not come from us. That went out over our transmitter!'],
    ['goal', 'Someone has taken over your frequency. Who knows what is going on?'],
    ['call', 'krause', {note: 'Station chief · private'}],
    ['say', 'krause', 'Crowe here. I am listening to my own programme in bed and a woman is reading out numbers? What is going on over there?'],
    ['say', 'krause', 'If this happens again we lose the license. Get Okafor to the mast. Immediately.'],
    ['call', 'ben', {note: 'Broadcast engineering · Mast'}],
    ['say', 'ben', 'Ben here, I am already up on Sullberg. The transmitter runs normally. But the aircraft light is acting up. I will turn the camera around.'],
    ['pose', 'ben', 'mast'],
    ['unlock', 'mast'], ['unlock', 'morsetafel'],
    ['morse', 'ben', 'SHEET SEVEN', 380],
    ['say', 'ben', 'The red lamp should shine steadily. But it is blinking. That is Morse, is it not? Can you read it?'],
    ['goal', 'Read the signal of the aircraft warning light. The Morse chart and the notes strip help.'],
    ['solve', 'blatt', {npc: 'krause', every: 60000, taunts: ['Who is blinking at my mast?', 'I want an explanation in ten minutes.']}],
    ['morse', null],
    ['pose', 'ben', null],
    ['say', 'ben', 'Sheet seven? What is that supposed to mean?'],
    ['wait', 1200],

    // ---------- Kapitel 2 ----------
    ['chapter', 2, 'Listener hotline'],
    ['say', 'jule', 'The listener hotline is ringing. At this hour only one person calls. I will put him through to you.'],
    ['call', 'wendt', {note: 'Listener hotline · Line 2'}],
    ['say', 'wendt', 'Wendt here. I listen to the Night Moth every night. And just now I heard something I have not heard for thirty-five years.'],
    ['say', 'wendt', 'Crane. A numbers station from the East. I was in radio intelligence back then, I took notes every night.'],
    ['say', 'wendt', 'I still have a transcript of the key sheets. I am sending it to you. Do not ask me why I still have it.'],
    ['unlock', 'mappe'],
    ['goal', 'Decrypt the number groups from the recording with the right key sheet.'],
    ['solve', 'gruppen', {npc: 'wendt', every: 70000, taunts: ['Message minus key. Digit by digit. We did it with a pencil back then.', 'Take your time. Crane has time.']}],
    ['say', 'wendt', 'Candle. Crane calls Night Moth, and the message is Candle. He means someone who knows they are meant.'],
    ['say', 'krause', 'Night Moth? That is Julie’s show! Julie, what do you have to do with it?'],
    ['goal', 'Crowe suspects Julie. Talk to her.'],
    ['ask', 'jule', {prompt: 'Julie pushes the fader down so nobody hears.', options: [
      {id: 'name', label: '“Why is your show called Night Moth?”', set: {name_krause: true},
        say: ['The name has existed since nineteen ninety-one. Long before me. Crowe picked it. He insisted on it.']},
      {id: 'kennt', label: '“Does Crane mean anything to you?”',
        say: ['No. I was four years old in nineteen eighty-nine.']},
      {id: 'du', label: '“Are you Night Moth?”', tag: 'accuse', wrong: true,
        say: ['Are you kidding? I was four! I could not even write my name.']},
      {id: 'weiter', label: '“Okay. Let us continue.”', needs: ['name_krause'], end: true,
        say: ['And look in the anniversary booklet in the archive folder. Crowe told a lot about himself in it.']}
    ]}],
    ['unlock', 'festschrift'],
    ['say', 'ben', 'I have something! The mast control has a remote-control modem. At two fifty-seven someone dialed in by phone. The key tones are in the log.'],
    ['unlock', 'modem'],
    ['goal', 'Who dialed into the mast control? Read the key tones.'],
    ['solve', 'fernwahl', {npc: 'ben', every: 60000, taunts: ['Eight keys. I hear them too, but I cannot read tones.', 'The table is under the tape.']}],
    ['say', 'ben', 'Zero, four, two, one: Bremen. I will call the number.'],
    ['fx', 'ring'],
    ['wait', 1800],
    ['fx', 'ring'],
    ['say', 'wendt', 'Oh, excuse me. My other phone is ringing. At this hour. I will let it ring.'],
    ['wait', 1500],
    ['say', 'ben', 'Nobody picks up. But it rings through.'],
    ['set', 'klingeln', true],
    ['wait', 1200],

    // ---------- Kapitel 3 ----------
    ['chapter', 3, 'Frequency change'],
    ['fx', 'static'],
    ['say', 'ben', 'He is off our transmitter! Crane is now broadcasting elsewhere. Somewhere on FM, with their own equipment.'],
    ['unlock', 'empfaenger'], ['unlock', 'tafel'],
    ['goal', 'Find Crane on the scanning receiver and decrypt the second message.'],
    ['solve', 'klartext', {npc: 'krause', every: 70000, taunts: ['I do not pay you to guess riddles!', 'Switch the transmitter off. Just off.']}],
    ['say', 'wendt', 'Station chief. So Crane is not calling Julie. Crane is calling the station chief.'],
    ['say', 'krause', 'Nonsense! Complete nonsense. Okafor, switch the mast off. Completely.'],
    ['say', 'ben', 'I am not allowed to. If we switch off without notice, the regulator comes. And they have already called.'],
    ['wait', 1200],

    // ---------- Kapitel 4 ----------
    ['chapter', 4, 'Emergency operation'],
    ['fx', 'flash'],
    ['dark', true],
    ['say', 'ben', 'Crane is back on our mast! Through the external feed. And the storm bent Antenna North. I have to switch to emergency operation, and you tell me how.'],
    ['say', 'ben', 'The regulator gives us eight minutes. Then they switch us off.'],
    ['unlock', 'schalttafel'],
    ['timer', 480000, 'Regulator'],
    ['goal', 'Emergency operation at the mast: cut off Crane, but keep broadcasting. Before the deadline.'],
    ['solve', 'schalter', {npc: 'ben', every: 50000, onFail: 'stoerung', taunts: ['My fingers are freezing off, just tell me which switches.', 'Antenna North is gone, do not forget that.']}],
    ['timer', null],
    ['say', 'ben', 'Good. Hold the release button in your control room down, or the relay snaps back.'],
    ['hold', {label: '⏻ Hold the release', ms: 3000}],
    ['dark', false],
    ['say', 'ben', 'Running. Reserve transmitter, Antenna South, Crane is out. We are broadcasting again.'],
    ['goto', 'verhoer'],

    ['label', 'stoerung'],
    ['fx', 'crash', 2500],
    ['say', 'ben', 'Too late. The regulator has taken us off the grid. All quiet.'],
    ['ending', 'stoerung'],

    // ---------- Kapitel 5 ----------
    ['label', 'verhoer'],
    ['chapter', 5, 'Night Moth'],
    ['lockLeave', true],
    ['say', 'jule', 'Mr. Crowe, please stay on the line. The control room has a few more questions.'],
    ['goal', 'Who is Night Moth? Confront Crowe.'],
    ['ask', 'krause', {prompt: 'Crowe breathes heavily into the phone.', options: [
      {id: 'wer', label: '“Who is Night Moth?”', say: ['How should I know? A radio call sign. Thirty-five years ago.']},
      {id: 'jule', label: '“Julie was four years old in 1989.”', say: ['So? I never said it was her. I only asked.']},
      {id: 'name', label: '“You picked the name of the show.”', tag: 'proof', needs: ['name_krause'], set: {p_name: true},
        say: ['A lovely name. Awake at night, looking for the light. That is radio.']},
      {id: 'chef', label: '“Crane calls the station chief.”', tag: 'proof', needs: ['klartext'], set: {p_chef: true},
        say: ['A numbers station from a country that no longer exists. That is no proof.']},
      {id: 'schwaermer', label: '“Your colleagues called you the Night Moth. Warnemünde maritime radio, until reunification.”', tag: 'proof', needs: ['festschrift', 'p_chef'], set: {p_schwaermer: true},
        say: ['… That is in an anniversary booklet. That was a joke.']},
      {id: 'drohen', label: '“You belong in prison!”', tag: 'accuse', wrong: true,
        say: ['Careful what you say. I am still your boss.']},
      {id: 'geständnis', label: '“You are Night Moth.”', tag: 'proof', needs: ['p_name', 'p_chef', 'p_schwaermer'], end: true,
        say: ['… Yes. I passed on names. Nine names. People who wanted to cross over. I was twenty-five.', 'And tomorrow morning the archive opens. Crane knows that. That is why tonight.']}
    ]}],
    ['say', 'jule', 'Dennis. You are live. For three minutes now. I put the listener hotline on the air.'],
    ['say', 'krause', 'Julie! Control room! Off that, now!'],
    ['say', 'wendt', 'Thank you. That is all I wanted.'],
    ['goal', 'Before you decide: do you want to say something to Wendt?'],
    ['ask', 'wendt', {prompt: 'Wendt is still on the line.', options: [
      {id: 'nichts', label: '“Thank you for your help, Mr. Wendt.”', end: true, say: ['My pleasure. Good night, control room.']},
      {id: 'blatt', label: '“Where did you get sheet seven if the sheets were destroyed?”',
        say: ['You do not forget what you read every night.']},
      {id: 'weiss', label: '“I know who Crane is.”', set: {entlarven: true}, end: true,
        say: ['Do you? Then say it. Out loud. We are on air, after all.']}
    ]}],
    ['branch', s => !s.flags.entlarven, 'wahl'],
    ['goal', 'Who is Crane?'],
    ['solve', 'kranich', {npc: 'wendt', every: 50000, taunts: ['I am waiting. I have waited thirty-five years.', 'Look at what is standing behind me.']}],
    ['fx', 'flash'],
    ['say', 'wendt', 'Crane. For thirty-five years nobody has called me that.'],
    ['say', 'wendt', 'Back then I sent the numbers. Night Moth betrayed nine people. Two of them were my friends. Tonight he was supposed to say it himself.'],
    ['ending', 'kranich'],

    ['label', 'wahl'],
    ['goal', 'Crowe is live on air. You have the fader in your hand.'],
    ['vote', {id: 'regler', prompt: 'Do you let Crowe’s confession keep running?', options: [
      {id: 'live', label: 'Keep broadcasting', desc: 'Everyone should hear it.'},
      {id: 'aus', label: 'Fader down', desc: 'The transmitter, the license, the people here. And Crowe.'}
    ]}],
    ['ending', s => s.results.regler]
  ]
}
