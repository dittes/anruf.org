// Case “The House by the Weir” (single player), English version. All people, places, firms and companies are fictional.

// Photos from portraits/ with overlaid, easily readable details (the image generator cannot write reliable text)
const img = (id, extra = '') => `<svg viewBox="0 0 960 540" xmlns="http://www.w3.org/2000/svg"><image href="portraits/${id}.webp" width="960" height="540"/>${extra}</svg>`

const SOLO = 'erbe'

export default {
  id: 'erbe',
  title: 'The House by the Weir',
  unit: 'Kessler Estate',
  file: 'Estate 0-HW-0303',
  accent: '#c9a46a',
  chapters: 5,
  solo: true,
  lobby: 'A notary calls: you have inherited a house from a great-aunt you never met. The deadline runs out tonight at midnight. A case for you alone, about 45 to 60 minutes. Headphones help.',
  invite: 'Apparently I have inherited a house and the notary is about to call me on video. Will you listen in?',
  lockText: 'Dr. Hensley: Please stay on the line. We are almost done.',
  roles: {
    erbe: {name: 'Heir', blurb: 'All the documents, all the decisions.'}
  },
  share: {
    text: 'I inherited a house today. {time}. The grandfather clock is running again.',
    tag: '#HouseByTheWeir',
    rows: ['HOUSE BY THE WEIR', '4:10 AM', 'DRAGONFLY'],
    lines: ['Whoever signs before seeing the house', 'does not deserve it.']
  },

  npcs: {
    hensel: {name: 'Dr. K. Hensley', sub: 'Cathedral Square Notary', tts: {pitch: .85, rate: 1.02},
      voice: {model: 'en_joe', pitch: -2, fx: 'video', len: 1.0},
      face: {photo: 'hensel', skin: '#e0b496', age: 2, hair: {style: 'slick', color: '#c9c6c0'}, glasses: 'half', top: {style: 'suit', color: '#2a2c30', accent: '#e8e4da', tie: '#1f4a34'}, mood: 'smile', scene: 'office'}},
    mehmet: {name: 'Mike Aydin', sub: 'Locksmith · Mobile', tts: {pitch: 1, rate: 1.05},
      voice: {model: 'en_bryce', pitch: 0, fx: 'phone', len: 1.0},
      face: {photo: 'mehmet', skin: '#c99272', jaw: .7, hair: {style: 'short', color: '#1c1a18'}, beard: 'full', beardColor: '#1c1a18', top: {style: 'jacket', color: '#1f2a44'}, mood: 'worried', scene: 'storm'}},
    pohl: {name: 'Gladys Pool', sub: 'Neighbor · Tablet', tts: {pitch: 1.05, rate: .95},
      voice: {model: 'en_cori', pitch: -2, fx: 'call', len: 1.04},
      face: {photo: 'pohl', skin: '#ecc9b4', fem: true, age: 2, hair: {style: 'bun', color: '#e6e2dc'}, glasses: 'round', extras: ['mole'], top: {style: 'sweater', color: '#4a5a3a'}, mood: 'smile', scene: 'night'}},
    notariat: {name: 'Cathedral Square Notary', sub: 'Answering machine', look: 'weak', tts: {pitch: 1.1, rate: 1},
      voice: {model: 'en_kristin', fx: 'mailbox', len: 1.0},
      face: {photo: 'notariat', silhouette: true, hair: {style: 'bob'}, top: {style: 'blouse', color: '#333'}, scene: 'office'}}
  },

  faces: {
    sterbebild: {face: {photo: 'irma'}, caption: 'Irma Kessler · Photo for the obituary'}
  },

  photos: {
    // Hausfront: Hochwassermarke, Baujahr und Hausnummer stehen auf kleinen Schildern
    haus: img('haus',
      // Text auf dem leeren Emailleschild links der Tür (die Wasserlinie ist im Foto schon da)
      `<g font-family="Georgia,serif" text-anchor="middle" fill="#2a2622"><text x="333.5" y="257" font-size="6.2" letter-spacing=".6">HIGH WATER</text><text x="333.5" y="268" font-size="6.6">MARCH 12, 1954</text></g>` +
      // ins Türbalken-Holz geschnitzt
      `<text x="522" y="138" font-size="7" font-family="Georgia,serif" text-anchor="middle" fill="#e6d2b0" opacity=".55" letter-spacing="1.5">BUILT · 1781</text>` +
      // blaues Hausnummernschild neben dem Schlüsseltresor
      `<g transform="translate(667 247)"><rect width="30" height="19" rx="2" fill="#1f3f8a" stroke="#fff" stroke-width=".8"/><text x="15" y="7" font-size="3.6" font-family="Arial,sans-serif" text-anchor="middle" fill="#fff">WEIR ROAD</text><text x="15" y="16" font-size="8" font-family="Arial,sans-serif" font-weight="700" text-anchor="middle" fill="#fff">238</text></g>`),
    dachboden: img('dachboden')
  },

  shreds: {
    zettel: {n: 6, order: [3, 5, 1, 4, 0, 2], lines: [
      'FOR THE CHEST:',
      '',
      'HOUSE NUMBER TIMES THREE.',
      'DO NOT WRITE IT DOWN!',
      '                  I.K.'
    ]}
  },

  clips: {
    kassette: {title: 'Cassette from the grandfather clock · “For the heir only. Not for H.”', npc: 'pohl', reverse: true,
      voice: {model: 'en_cori', pitch: -2, fx: 'mailbox', len: 1.04},
      text: 'If you are hearing this, you set the clock. Good. Do not sign anything the notary sends you. My neighbor will help you. Say the word dragonfly to her, then she will know I sent you.'}
  },

  pages: {
    testament: {title: 'Will', role: null, html: `
      <p class="stamp">Copy · opened by Cathedral Square Notary</p>
      <div class="letter">
        <p>My house by the weir goes to whoever understands it.</p>
        <p>The key has been waiting since the water came.</p>
        <p>Whoever goes in first, set the clock to the hour in which I left.</p>
        <p>And: whoever signs before seeing the house does not deserve it.</p>
        <p class="sig">Irma Kessler</p>
      </div>`},
    verzicht: {title: 'Waiver of inheritance', role: null, html: `
      <div class="paper">
        <p class="stamp">Cathedral Square Notary · Declaration</p>
        <p><b>Waiver of inheritance</b></p>
        <p>I hereby disclaim the estate of Ms. Irma Kessler, last residing at Weir Road, on all grounds of succession.</p>
        <p>The property thus falls to the municipality and will be sold to <b>Weirside Power North Ltd</b> .</p>
        <p>Signature: ______________________ (digital face signature)</p>
        <p class="small">Queries: Cathedral Square Notary · Tel. 0571 88 30 11<br>Deadline: today, 12:00 midnight</p>
      </div>`},
    hausfoto: {title: 'Photo: front of the house', role: null, html: `
      <p class="stamp">Mike’s phone camera · Weir Road</p>
      <p>Mike photographed the front of the house. Zoom in: there are small signs on the house.</p>
      <div data-photo="haus"></div>`},
    traueranzeige: {title: 'Obituary', role: null, html: `
      <div class="paper" style="text-align:center">
        <p style="font-family:Georgia,serif;font-size:1.05rem;margin:.2em 0">Irma Kessler</p>
        <p>* May 14, 1946 &nbsp; † March 3, 4:10 a.m.</p>
        <div data-face="sterbebild"></div>
        <p>She left the way she lived: without any fuss.</p>
        <p>In quiet mourning<br><b>Gladys Pool</b>, neighbor and friend</p>
        <p class="small">At the wish of the deceased, no funeral service.</p>
      </div>`},
    kassette: {title: 'Cassette', role: null, html: `
      <p class="stamp">From the grandfather clock · Mike plays it on his phone</p>
      <p>The cassette sounds strange. Something is wrong with the direction it plays.</p>
      <div data-tape="kassette"></div>`},
    sicherungen: {title: 'Note on the fuse box', role: null, html: `
      <div class="letter">
        <p>When it is all dark down here, child:</p>
        <p>1 Hall · 2 Parlor · 3 Pump · 4 Kitchen · 5 Attic</p>
        <p>The pump must run, or the cellar floods.</p>
        <p>Never two neighbors at the same time, the old wiring cannot take it.</p>
        <p>The attic needs light.</p>
        <p>Hall and attic share one phase: never both.</p>
        <p class="sig">I.</p>
      </div>`},
    dachboden: {title: 'Photo: attic', role: null, html: `
      <p class="stamp">Mike’s phone camera · Attic</p>
      <p>The chest, and whatever else is up here. Look closely.</p>
      <div data-photo="dachboden"></div>`},
    zettel: {title: 'Torn note', role: null, html: `
      <p class="stamp">Was lying torn up in the coat by the coat rack</p>
      <div data-shred="zettel"></div>`},
    ab: {title: 'Notary answering machine', role: null, html: `
      <div class="paper">
        <p class="stamp">Transcript · 0571 88 30 11</p>
        <p>“Our office is closed until Monday.”</p>
        <p>“Notary Dr. Conrad Hensley passed away in 2019. There is no Dr. Hensley working with us any more.”</p>
        <p>“If you suspect fraud, please contact the police.”</p>
      </div>`},
    testament2: {title: 'The real will', role: null, html: `
      <div class="letter">
        <p>My last will, written on March 1, two days before my death.</p>
        <p>The house by the weir goes to my niece’s child. Not to the municipality, not to Weirside Power, and certainly not to Mr. Brand, who lately calls himself a notary.</p>
        <p>He was here twice. The second time he brought a form and a camera.</p>
        <p>Whoever reads this has entered my house. Then I am not far.</p>
        <p class="sig">Irma Kessler</p>
      </div>`},
    brief: {title: 'Letter in the chest', role: null, html: `
      <p class="stamp">Envelope · “For the heir. You know the word.”</p>
      <p>Encrypted. Irma liked puzzles. The shift is as long as the word you already know.</p>
      <div data-cipher="R JV WXC MNJM. R JV LUXBNA CQJW HXD CQRWT. BNN HXD BXXW, LQRUM."></div>`}
  },

  puzzles: {
    tuer: {
      q: 'Key safe at the front door: four digits.', ph: 'Code', input: 'digits',
      hash: ['b54de1156a2eb5afc2c750540b230c06c5a11d2291ad6ae6fedcae36d707f90b'],
      near: {'fba7ef71b861d88b23c7ecde10583674de4b3dae714ce5a13e163901acda76df': 'That is the year it was built. When did the water come?', '161f16d808ace2419e95357fbb7b5328daba6976d0f3d6a15c91085972c42a81': 'That is the house number.', '6705d82c12db028d73b96bdd617dedf0b02d7c482d53d5cb222525585d8e54e0': 'Close: just the year.'},
      hints: ['The will says: “The key has been waiting since the water came.”', 'Zoom into the photo of the front of the house, at the wall to the left of the door. There is a line and a sign.', '1954.']
    },
    uhr: {
      q: 'Mike is standing at the grandfather clock. What time should he set it to?', input: 'clock',
      hash: ['a048bb22ac0658da5104562902dfc9b245987475d089d8853d4cef73f01e8595', 'a048bb22ac0658da5104562902dfc9b245987475d089d8853d4cef73f01e8595'],
      near: {'ea8b10431d2708f76024acde919f92dfa5c31a2084722f4a0d4944440eba662b': 'Set the hands, then check.', '364efee2ec6e47eff856f3a7818a67f80f2f529cf67ee35e8f259ce58b0bf8dd': 'That is the date. We want the time of day.'},
      hints: ['“The hour in which I left”: when did Irma die?', 'The obituary gives a time.', '4:10 a.m.: the small hand almost on the four, the big hand on the two.']
    },
    kassette: {
      q: 'Which word should be said to the neighbor?', ph: 'Word',
      hash: ['448f9105ccec91656805e461079f561db9112e380865c2ae9ed00ed055dc48bd'],
      near: {'0b6795b069f279f7b17ea5bb3228e547a3ac5b10f226d10953cdd08f1434e8b5': 'That is still backwards.', '1324397d9ab8f6f00d22a207ec5b2ea1001d6b44e52de57c28fb5f487b495512': 'And which word are you supposed to say to her?', '05b977f7a9dc7ddc3515bf2ca431e57d4b0418a4561d583d2deb5a69ffcc3bdf': 'And which word are you supposed to say to her?', 'db83fb52fbac769cccf9e1f1a36cc0e30697f7258cc9552c84248c9958b50391': 'And which word are you supposed to say to her?'},
      hints: ['The cassette is backwards. Tick “backwards” on the tape player in your file.', 'Play it backwards. Irma says a word that her neighbor knows. A flying creature.', 'The word is “dragonfly”.']
    },
    nummer: {
      q: 'Call the notary’s office. Which number do you dial?', ph: 'Number', input: 'digits',
      hash: ['5c17dc0d87236fa8908f5ac758f8837d5f0cf0e4a9c1b1a6547def341f50362a', 'e05c5968373a4f0dc6dd6abbe8ef35ddf0449ba22d7ed32b8a9d8d386ba93edd'],
      near: {'d1c48506b39361d2e15feee4c1ebabf3cb8a0c80cbea124dde42410a6314aa46': 'The area code is missing.'},
      hints: ['The number is printed small on the form Hensley sent.', 'Waiver of inheritance, at the bottom: “Queries”.', '0571 88 30 11']
    },
    strom: {
      q: 'Fuse box in the cellar: which switches should be on?', input: 'switches', n: 5,
      labels: ['Hall', 'Parlor', 'Pump', 'Kitchen', 'Attic'],
      hash: ['5cd65de66690cc26f02cee4cc909e02cec12d488f88bd9652b6c2e179a8912b6'],
      near: {'32c1a58a979d4ea4310d6c7f32d37cbc9a85150cdaac876818560acd602aa49f': 'The pump runs. But Mike has to go upstairs soon.', '327c3b74868e64d0f0e0fc9331b9dde30ce50901f4ab17016a105b41ffd6d9e0': 'Hall and attic together: the phase trips.', '67d2a09b1d073ca179e56fc99dbf2a3829d87d8002f1e3b06fd478758090fb17': 'Two neighbors on: it blows.', '5a558b598d91f338acca8ab05361c0cf9b3bb633f729d5b4514fc908534220ed': 'Two neighbors on: it blows.'},
      hints: ['Irma’s note has four rules. Start with the safe ones: pump and attic.', 'If 3 and 5 are on, their neighbors 2 and 4 must be off. And the hall?', 'Only pump and attic: off, off, on, off, on.']
    },
    truhe: {
      q: 'The chest has three number wheels.', ph: 'Code', input: 'digits',
      hash: ['c1248a57a9432737e039f3a3dc0a1d147ca737319f33f55b79f9b9a1f3b79b04'],
      near: {'161f16d808ace2419e95357fbb7b5328daba6976d0f3d6a15c91085972c42a81': 'That is the house number. Read the note all the way through.', '7612f1dcd7ca032480aba15b847959fc095a046ce0bf5bd09ab0f75cb6f250cf': 'Times three, not times the year it was built.'},
      hints: ['Put the torn note in your file back together.', 'The note mentions a calculation with the house number. It is on a sign in the photo of the front of the house.', '238 × 3 = 714.']
    },
    wer: {
      q: 'Who is “Gladys Pool” really?', ph: 'Name',
      hash: ['1324397d9ab8f6f00d22a207ec5b2ea1001d6b44e52de57c28fb5f487b495512', '6f48759f3fd3b499a9d9c9eb9d321e39484773c3965e437e92832c4a1d531382', '3022f617eb051e9f4072b9b5b3d7efa3622d273ce797fdbcb07c7057c956c9b7', 'b1d8d6c9f240d65fc47feba971a7a18b59af4b6d14ce24e6025441aa82d24ed8', '9cb1b6a1fdd9b9a42136af335a9ba9d0d75f75dd5e0f160cb170842f32439eb8', 'da46818c6171b87abbf244fa42ed6ee5037821e7c37e399de92497dec6ca42ae', '2d716fd0da547f6529e5d1dbfd7fee41fc4cfcea3cd621f033610aa2b0129371'],
      near: {'106df43e4ea4fb3c3ce8cf6b5d9be205e2e884fb7e63b2e2f7d1e696b947048f': 'Yes, the wig from the attic. But whose is it?', '366f138bc383da0c0791c59f63ce8020b01bbe82e6ad9b5427c997575dd823f1': 'Yes, the wig from the attic. But whose is it?', '4aef13564c04e026f0b96b2be89dbd5d1549d723392f4fcc7890e750c535c029': 'That is what she calls herself.', 'db83fb52fbac769cccf9e1f1a36cc0e30697f7258cc9552c84248c9958b50391': 'That is what she calls herself.', '05b977f7a9dc7ddc3515bf2ca431e57d4b0418a4561d583d2deb5a69ffcc3bdf': 'That is what she calls herself.', 'cfa7e51ace4890fc2b2bee08f3f2fc339fb6b4eb209eba0a53ec7005208ccfca': 'That is what she calls herself.', 'c0bafbee8de07ef34d5071cd8c2381057e4c6019d896e0f6f86fe8f57bac6f63': 'Whose aunt? The name, please.', '6149d78df8a6f56bb3e94e8eb193b04becaea5f59da33fde1a630f50a11def6b': 'Whose aunt? The name, please.', '5bad627effa69428b7ba64839e92642b2147d56907482b02ec45f2c553f7e051': 'Whose aunt? The name, please.'},
            hints: ['Put the picture from the obituary next to Mrs. Pool’s camera image.', 'Mole above the lip, dragonfly brooch. And in the attic: a wig with a bun and a tortoiseshell pair of glasses.', 'Mrs. Pool is Irma Kessler.']
    }
  },

  endings: {
    verzicht: {title: 'Ending: WAIVER', code: 'HW-WAIVER',
      text: 'You sign without having seen the house. Dr. Hensley thanks you most warmly. In spring the house by the weir is demolished, to make way for a hydroelectric plant.',
      epilog: 'A year later a parcel arrives with no sender. Inside, a cassette and a note: “Pity. You would have liked me. I.”'},
    mitternacht: {title: 'Ending: MIDNIGHT', code: 'HW-MIDNIGHT',
      text: 'The grandfather clock strikes twelve. The deadline has passed, the chest stays shut. Without the real will the old one applies, and the false notary’s form is already at the registry.',
      epilog: 'Weeks later Mike sends you a photo: the house is covered in scaffolding. A dragonfly made of wire hangs on the site fence. Nobody knows who put it there.'},
    haus: {title: 'Ending: THE HOUSE', code: 'HW-HOUSE',
      text: 'The false notary is called Rodney Brand and works for Weirside Power. The police pick him up that very night. The real will stands: the house by the weir is yours.',
      epilog: 'On your first visit you set the grandfather clock. The next morning there is an apple pie on the doorstep. Next to it, a dragonfly brooch. Mrs. Pool has gone away, says the mailman. For a long time.'},
    irma: {title: 'Ending: DRAGONFLY', code: 'HW-DRAGONFLY',
      text: 'Gladys Pool takes off her glasses. “Irma. Pleased to finally meet you.” She only faked her death to see who would come: the fraudster or the family. You came.',
      epilog: 'On Sundays you now call your great-aunt. She drinks tea, you tell her things. Sometimes you solve a puzzle together. She wins almost every time.'}
  },
  codes: {'857963b3b99c1c4635f1b20d23d41e1383a34519766a684e40e8831caf769494': 'verzicht', '99e78e7cdddbfc32f74493101fa497d6a226944c8dc1e46954e262b2c3a67196': 'mitternacht', '36c4652f399dae436559fe84f5bdb9cc2e787b25a7af23ba6837b7ed69cd39a7': 'haus', '94210fc909f87cf10f1309fe3c947a5cdbcd3c5a451df13b0419e82dbd536485': 'irma'},

  script: [
    // ---------- Kapitel 1 ----------
    ['chapter', 1, 'Opening of the Will'],
    ['ambience', 'wartemusik'],
    ['goal', 'The notary will dial in shortly.'],
    ['wait', 2500],
    ['join', 'hensel'],
    ['ambience', null],
    ['say', 'hensel', 'Good evening, {me}. Hensley, Cathedral Square Notary. Thank you for taking the time so late.'],
    ['say', 'hensel', 'Before I begin, I need to identify you. Please switch on your camera.'],
    ['goal', 'The notary wants to see you: camera on.'],
    ['quiet', 'camOn', 'hensel', 'Thank you. Very good. That is enough for me.', 'I cannot see you yet. The camera, please.'],
    ['snap'],
    ['fx', 'mirror', {npc: 'hensel', label: 'FACE CAPTURED'}],
    ['say', 'hensel', 'You are the last living relative of Ms. Irma Kessler. Ms. Kessler passed away on the third of March. My condolences.'],
    ['say', 'hensel', 'I will now read out the will. It is … unusually worded.'],
    ['unlock', 'testament'],
    ['goal', 'Read Irma’s will in the file.'],
    ['wait', 6000],
    ['say', 'hensel', 'Ms. Kessler was somewhat eccentric in recent years. Legally it is simple: the house is heavily in debt. I recommend that you disclaim the inheritance.'],
    ['unlock', 'verzicht'],
    ['say', 'hensel', 'I have sent you the form. The deadline ends tonight at midnight. Simply sign, and it is taken care of.'],
    ['goal', 'The notary wants you to sign right away.'],
    ['vote', {id: 'sofort', prompt: 'Dr. Hensley: “Sign now, and you will have no more worries.”', options: [
      {id: 'unterschreiben', label: 'Sign', desc: 'Nobody needs a house in debt.'},
      {id: 'ansehen', label: 'See the house first', desc: 'That is what the will says.'}
    ]}],
    ['branch', s => s.results.sofort === 'ansehen', 'ansehen'],
    ['say', 'hensel', 'A wise decision. I thank you very much.'],
    ['ending', 'verzicht'],

    ['label', 'ansehen'],
    ['say', 'hensel', 'As you wish. I have a locksmith on site so you can see for yourself. I will add him to the call.'],
    ['goal', 'The locksmith is calling.'],
    ['call', 'mehmet', {note: 'Aydin Locksmiths · Mobile'}],
    ['say', 'mehmet', 'Hello? Ah, now. Aydin, locksmith. I am standing in front of the house, it is pouring.'],
    ['say', 'mehmet', 'Let me turn the camera around. There is a key safe next to the door. Four digits. Drilling it open takes an hour. Do you have the code?'],
    ['pose', 'mehmet', 'haus'],
    ['unlock', 'hausfoto'],
    ['goal', 'Find the code for the key safe.'],
    ['solve', 'tuer', {npc: 'hensel', every: 45000, taunts: ['The weather is not getting any better, {me}.', 'You could also just sign.']}],
    ['fx', 'right'],
    ['say', 'mehmet', 'Click! Open. How did you come up with that? Never mind. I am going in.'],
    ['pose', 'mehmet', 'stube'],
    ['ambience', 'hum'],
    ['say', 'mehmet', 'Smells of lavender and dust. There is a big grandfather clock. It is stopped.'],
    ['wait', 1500],

    // ---------- Kapitel 2 ----------
    ['chapter', 2, 'The Grandfather Clock'],
    ['say', 'hensel', 'Here, in case you are interested: the obituary. Placed by the neighbor. There was no funeral.'],
    ['unlock', 'traueranzeige'],
    ['goal', 'The will says: set the clock to the hour in which I left.'],
    ['solve', 'uhr', {npc: 'mehmet', every: 50000, taunts: ['I have the hands in my fingers. Just tell me where to.', 'The clock is nicer than my whole living room.']}],
    ['fx', 'shake'],
    ['say', 'mehmet', 'It strikes! Four times. And at the bottom of the case a flap springs open. There is a cassette inside.'],
    ['say', 'mehmet', 'It says on it: for the heir only. Not for H.'],
    ['say', 'hensel', 'A cassette? Play it, Mr. Aydin. I will listen in.'],
    ['say', 'mehmet', 'One moment, my phone is acting up.'],
    ['chat', 'mehmet', 'I think it is not meant for him. Turn your mic off, I just want to talk to you for a moment.'],
    ['goal', 'Mike does not want the notary to listen in: mic off.'],
    ['quiet', 'mic', 'mehmet', 'Okay. I will send you the recording directly. I will tell the notary the tape is broken.', 'Your mic is still on. I would rather say nothing.'],
    ['unlock', 'kassette'],
    ['say', 'mehmet', 'Doctor? Tape tangle. There is nothing on it.'],
    ['pose', 'hensel', 'hensel-ungeduld'],
    ['say', 'hensel', 'How unfortunate.'],
    ['pose', 'hensel', null],
    ['goal', 'Listen to the cassette. Which word does Irma say?'],
    ['solve', 'kassette'],
    ['wait', 1500],

    // ---------- Kapitel 3 ----------
    ['chapter', 3, 'The Neighbor'],
    ['say', 'mehmet', 'Someone is knocking on the window. An elderly lady with an umbrella. She wants to join the call, I will give her the link.'],
    ['goal', 'Someone is knocking.'],
    ['knock', 'pohl'],
    ['join', 'pohl'],
    ['say', 'pohl', 'Pool. I live next door. I saw a light. Who are you, and what are you doing in Irma’s house?'],
    ['goal', 'Win Mrs. Pool’s trust.'],
    ['ask', 'pohl', {prompt: 'Mrs. Pool studies you over her tablet.', options: [
      {id: 'erbe', label: '“I am Irma’s heir. The notary called me.”',
        say: ['Anyone can say that. The notary has been here twice already. I do not talk to him.']},
      {id: 'libelle', label: '“Dragonfly.”', needs: ['kassette'], set: {vertraut: true}, end: true,
        say: ['Oh. So she really did send you.', 'Good. Listen to me. And do not let the doctor notice that we are talking.']},
      {id: 'irma', label: '“What was Irma like?”',
        say: ['Stubborn. Clever. And she loved puzzles. She stuffed her whole house with them.']}
    ]}],
    ['chat', 'pohl', 'Irma was afraid of this notary. Weirside Power wants to rebuild the weir, the house has to go. Without the heir, no sale.'],
    ['chat', 'pohl', 'Call the notary’s office. The number is on his form. Not the one he tells you.'],
    ['set', 'pohl_erzaehlt', true],
    ['goal', 'Call Cathedral Square Notary.'],
    ['solve', 'nummer'],
    ['fx', 'ring'],
    ['wait', 2500],
    ['join', 'notariat'],
    ['say', 'notariat', 'Cathedral Square Notary, good evening. Our office is closed until Monday.'],
    ['say', 'notariat', 'Please note: Notary Doctor Conrad Hensley passed away in the year twenty nineteen. There is no Doctor Hensley working with us any more.'],
    ['say', 'notariat', 'If you suspect fraud, please contact the police.'],
    ['leave', 'notariat', 'off'],
    ['unlock', 'ab'],
    ['pose', 'hensel', 'hensel-ungeduld'],
    ['say', 'hensel', 'You are making phone calls on the side? With whom, if I may ask?'],
    ['lockLeave', true],
    ['say', 'hensel', 'Enough. Sign now. The digital signature scans your face. Please look straight into the camera.'],
    ['chat', 'pohl', 'DON’T! Cover the camera with your hand! Switching it off is not enough, he did that with Irma too.'],
    ['goal', 'Cover your camera so the false notary cannot scan your face. Keep the camera ON.'],
    ['fx', 'mirror', {npc: 'hensel', label: 'SIGNATURE 64 %'}],
    ['quiet', 'covered', 'pohl', 'Good. With a still image of you he could have signed.', 'He can still see you!'],
    ['say', 'hensel', 'Your camera seems to have problems. No cause for concern. We have until midnight.'],
    ['pose', 'hensel', null],
    ['wait', 1200],

    // ---------- Kapitel 4 ----------
    ['chapter', 4, 'The Cellar'],
    ['fx', 'flash'],
    ['dark', true],
    ['ambience', 'storm'],
    ['say', 'mehmet', 'The lights are out! In the whole house. And something is splashing down in the cellar. I am going down.'],
    ['pose', 'mehmet', 'keller'],
    ['unlock', 'sicherungen'],
    ['say', 'mehmet', 'Old fuse box, five rotary switches. There is a note from your aunt stuck to it.'],
    ['goal', 'In the dark: bring the power back without burning out the old wiring.'],
    ['solve', 'strom', {npc: 'mehmet', every: 40000, taunts: ['The water is already up to my shoes.', 'I am not touching anything until you are sure.']}],
    ['dark', false],
    ['say', 'mehmet', 'Light! And the pump is running. The cellar was already ankle-deep.'],
    ['fx', 'shake'],
    ['say', 'mehmet', 'Damn. The cellar door has slammed shut. It is jammed. Mrs. Pool cannot hear me over her tablet, but she can hear you. Shout as loud as you can!'],
    ['goal', 'Mike is stuck in the cellar. Shout loudly so Mrs. Pool hears it.'],
    ['clap', {label: 'Shout loudly: “Mrs. Pool!”', text: 'Shout or clap so loudly that Mrs. Pool hears it over her tablet. Mic on!'}],
    ['say', 'pohl', 'I heard you! I still have a key from Irma. I am coming over.'],
    ['wait', 3000],
    ['say', 'mehmet', 'Thank you, Mrs. Pool. You really do have a key for everything.'],
    ['say', 'pohl', 'Irma and I had no secrets. Almost none. There is a chest in the attic.'],
    ['ambience', 'hum'],
    ['wait', 1200],

    // ---------- Kapitel 5 ----------
    ['chapter', 5, 'The Attic'],
    ['say', 'hensel', 'It is {time}. May I remind you: at midnight your right expires. Then the form applies.'],
    ['timer', 600000, 'Deadline'],
    ['pose', 'mehmet', 'dachboden'],
    ['unlock', 'dachboden'], ['unlock', 'zettel'],
    ['say', 'mehmet', 'Attic. Here is the chest. Three number wheels. And in the coat by the coat rack there was a torn note, I sent it to you.'],
    ['say', 'mehmet', 'There is all sorts of junk up here. Take a good look at the photo.'],
    ['goal', 'Open the chest before midnight.'],
    ['solve', 'truhe', {npc: 'hensel', every: 50000, onFail: 'mitternacht', taunts: ['The clock is running, {me}.', 'What exactly are you looking for up there?']}],
    ['timer', null],
    ['say', 'mehmet', 'The wheels turn. The lid is heavy, it is jammed. Hold the light steady, I will pry it open.'],
    ['hold', {label: '🔦 Hold down: keep the light steady', ms: 2500}],
    ['say', 'mehmet', 'Open! There are letters inside. A will, with a date. And an envelope: for the heir.'],
    ['unlock', 'testament2'], ['unlock', 'brief'],
    ['goto', 'verhoer'],

    ['label', 'mitternacht'],
    ['fx', 'ring'],
    ['say', 'hensel', 'Midnight. The deadline has passed. I thank you for your time.'],
    ['ending', 'mitternacht'],

    ['label', 'verhoer'],
    ['goal', 'Expose the false notary. You need evidence.'],
    ['ask', 'hensel', {prompt: 'Dr. Hensley is waiting. He is not smiling any more.', options: [
      {id: 'wer', label: '“Who are you really?”', say: ['Doctor Conrad Hensley. It says so on every one of my letters.']},
      {id: 'schulden', label: '“Who does the house owe money to?”', say: ['The savings bank. I will send the documents later.']},
      {id: 'mord', pose: 'hensel-ungeduld', label: '“You killed Irma!”', tag: 'accuse', wrong: true,
        say: ['Excuse me? Ms. Kessler passed away peacefully. It says so in the obituary. Moderate yourself.']},
      {id: 'tot', pose: 'hensel-ungeduld', label: '“The real Dr. Hensley died in 2019.”', tag: 'proof', needs: ['ab'], set: {beweis_ab: true},
        say: ['… A misunderstanding. I am only representing the firm. Temporarily.']},
      {id: 'testament', label: '“I have Irma’s will. It is newer than yours.”', tag: 'proof', needs: ['testament2'], set: {beweis_testament: true},
        say: ['A note from a chest. That would not stand up in any court.']},
      {id: 'weserkraft', pose: 'hensel-ungeduld', label: '“You work for Weirside Power.”', tag: 'proof', needs: ['pohl_erzaehlt', 'beweis_ab'], set: {beweis_firma: true},
        say: ['Who told you that …? The old woman next door. Of course.']},
      {id: 'polizei', label: '“I am calling the police, Mr. … what is your real name?”', tag: 'proof', needs: ['beweis_ab', 'beweis_testament'], end: true,
        say: ['Brand. Rodney Brand. And do not think this is over.']}
    ]}],
    ['lockLeave', false],
    ['fx', 'crash', 2500],
    ['leave', 'hensel', 'off'],
    ['wait', 3000],
    ['say', 'mehmet', 'He is gone. I called the police, they will be here in ten minutes. I will stay until then.'],
    ['say', 'pohl', 'You did well. Irma would be proud of you.'],
    ['goal', 'What do you say to Mrs. Pool?'],
    ['ask', 'pohl', {prompt: 'Mrs. Pool smiles into her teacup.', options: [
      {id: 'danke', label: '“Thank you, Mrs. Pool. Without you I would have signed.”', end: true,
        say: ['Oh, nonsense. I was only paying attention. It is my hobby.']},
      {id: 'durchschaut', label: '“Mrs. Pool … I think you are not Mrs. Pool.”', set: {entlarven: true}, end: true,
        say: ['Is that so? Then who am I supposed to be?']}
    ]}],
    ['branch', s => !s.flags.entlarven, 'ende'],
    ['goal', 'Tell her who she really is.'],
    ['solve', 'wer', {npc: 'pohl', every: 40000, taunts: ['I am waiting, child. I am patient.', 'Look closely. You have Irma’s eyes, after all.']}],
    ['pose', 'pohl', 'pohl-reveal'],
    ['fx', 'flash'],
    ['say', 'pohl', 'Finally. The glasses were pinching me anyway.'],
    ['say', 'pohl', 'I wanted to see who comes when I am gone. The fraudster or the family. You came.'],
    ['say', 'mehmet', 'Wait. You are the dead woman?'],
    ['say', 'pohl', 'The dead woman will make you a cup of tea in a moment, young man. You are soaking wet.'],
    ['ending', 'irma'],

    ['label', 'ende'],
    ['ending', 'haus']
  ]
}
