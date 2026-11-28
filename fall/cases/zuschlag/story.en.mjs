// Case “Hammer Price”, English version. All people, places, companies and agencies are fictional.

const GU = 'gutachten', OR = 'ortung'
const img = (id, extra = '') => `<svg viewBox="0 0 960 540" xmlns="http://www.w3.org/2000/svg"><image href="portraits/${id}.webp" width="960" height="540"/>${extra}</svg>`
// kleines Straßenschild, beim Zoomen lesbar
const sign = (x, y, text, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot})" opacity=".9"><rect width="${text.length * 3.1 + 8}" height="9" rx="1.5" fill="#1d3f7a" stroke="#fff" stroke-width=".7"/><text x="4" y="6.6" font-size="5.6" font-family="Arial,sans-serif" fill="#fff">${text}</text></g>`

export default {
  id: 'zuschlag',
  title: 'Hammer Price',
  unit: 'Ebersbach House Museum · Special investigation',
  file: 'Lot 1 · Ref. 0-ZS-1664',
  accent: '#e3c27a',
  chapters: 4,
  lobby: 'Three weeks ago “The Letter Reader” was stolen from Ebersbach House Museum. Tonight it is being auctioned, by video call, to anonymous bidders. You are Bidder 7. About 50 to 70 minutes.',
  invite: 'I am at a secret art auction tonight. On video. I need someone who knows about paintings. Are you in?',
  lockText: 'Monsieur Blanc: Whoever leaves during the auction forfeits their deposit.',
  roles: {
    gutachten: {name: 'Appraisal', blurb: 'Museum catalog, insurance, city guide.'},
    ortung: {name: 'Tracking', blurb: 'Live image, still images, wastepaper basket.'}
  },
  share: {
    text: 'Tonight, {time}: knocked down to Bidder 7. We did not pay.',
    tag: '#HammerPrice',
    rows: ['LOT 1', 'BIDDER 7', 'CHAPEL STREET'],
    lines: ['The original never', 'left the house.']
  },

  npcs: {
    blanc: {name: 'Monsieur Blanc', sub: 'Auctioneer · encrypted', tts: {pitch: .9, rate: .98},
      voice: {model: 'en_nem', pitch: -2, fx: 'video', len: 1.03},
      face: {photo: 'blanc', silhouette: true, glow: '#e3c27a', hair: {style: 'slick'}, scene: 'office'}},
    vasquez: {name: 'Bidder 3', sub: 'Madrid · anonymous', tts: {pitch: .9, rate: 1},
      voice: {model: 'en_alba', pitch: -1, fx: 'call', len: 1.0},
      face: {photo: 'vasquez', skin: '#d8a888', fem: true, age: 1, hair: {style: 'bun', color: '#2a2424'}, extras: ['earring'], top: {style: 'blouse', color: '#111'}, mood: 'smirk', scene: 'studio'}},
    roth: {name: 'Dr. Margaret Roth', sub: 'Director · Ebersbach House Museum', tts: {pitch: 1.05, rate: 1.02},
      voice: {model: 'en_cori', fx: 'call', len: 1.0},
      face: {photo: 'roth', skin: '#eac6b0', fem: true, age: 2, hair: {style: 'short', color: '#e8dcc0'}, glasses: 'square', top: {style: 'jacket', color: '#222'}, mood: 'worried', scene: 'office'}}
  },

  photos: {
    katalog: img('gemaelde'),
    los: img('gemaelde-falsch'),
    // Blancs Videobild: durchs Fenster ein Kirchturm, unten am Fenster ein Straßenschild
    salon: img('blanc', sign(774, 318, 'Chapel St.', -1)),
    buero: img('roth')
  },

  shreds: {
    mail: {n: 7, order: [4, 1, 6, 2, 0, 5, 3], lines: [
      'FROM: m.roth@ebersbach-house.example',
      'TO:   blanc@protonmail.example',
      '',
      'COPIES TO MADRID AND ZURICH.',
      'THE ORIGINAL STAYS HERE.',
      'INSURANCE PAYS IN JUNE.     M.'
    ]}
  },

  pages: {
    einladung: {title: 'Invitation', role: null, html: `
      <div class="paper">
        <p class="stamp">Private auction · by invitation only</p>
        <p>Lot 1: Pieter van Hoorn, “The Letter Reader”, oil on canvas, 1664.</p>
        <p>Starts at 23:00. Cameras stay off. Bids only by show of hands when called.</p>
        <p>You are: <b>Bidder 7</b>.</p>
      </div>
      <p class="note">Dr. Roth got you the invitation. You are to find out who is behind the auction and where the painting is.</p>`},
    katalog: {title: 'Museum catalog', role: GU, html: `
      <p class="stamp">Collection catalog Ebersbach House · Inv. no. 1664/3</p>
      <p>This is how The Letter Reader hung in Hall 2 until three weeks ago. Tracking sees the painting from the auction. Describe it to each other, piece by piece.</p>
      <div data-photo="katalog"></div>`},
    los: {title: 'Lot 1 · Live image', role: OR, html: `
      <p class="stamp">Auction stream · Lot 1 · Camera 2</p>
      <p>The painting Blanc is offering right now. Appraisal has the photo from the museum catalog.</p>
      <div data-photo="los"></div>`},
    standbild: {title: 'Still of Blanc', role: OR, html: `
      <p class="stamp">Tracking · Screenshot from Blanc’s video image</p>
      <p>Blanc is sitting at the window. Zoom in: what can you see outside?</p>
      <div data-photo="salon"></div>`},
    stadtfuehrer: {title: 'City guide', role: GU, html: `
      <div class="paper">
        <p class="stamp">City guide · Churches of the Old Town</p>
        <p><b>St. Peter’s Cathedral</b> on Cathedral Square. Two towers, no clock face.</p>
        <p><b>St. Mary’s</b> on Market Square, corner of Bridge Street. Baroque cap, golden clock face.</p>
        <p><b>St. James’s</b> on Chapel Street. Pointed Gothic tower, illuminated tower clock.</p>
        <p><b>Our Lady’s</b> on the Rampart. Tower destroyed in 1944, never rebuilt.</p>
        <p><b>St. John’s</b> in the New Town, on Chapel Hill. Pointed tower, illuminated tower clock.</p>
      </div>`},
    police: {title: 'Insurance policy', role: GU, html: `
      <p class="stamp">From Bidder 3 · Hanseatic Art Insurance · confidential</p>
      <p>The policy for The Letter Reader. On the original there is a check mark in security ink. Run the UV lamp over it.</p>
      <div class="uv"><div class="paper">
        <p class="stamp">Policy KV-1664-03</p>
        <p>Object: van Hoorn, The Letter Reader, 1664</p>
        <p>Policyholder: Ebersbach House Museum</p>
        <p>Sum insured: €14,000,000</p>
        <p>Theft reported: 21 May</p>
        <div class="ink">Sum raised from €4 to €14 million on 2 May.<br>Application filed and signed by: Dr. M. Roth</div>
      </div></div>`},
    papierkorb: {title: 'Wastepaper basket', role: OR, html: `
      <p class="stamp">From Bidder 3 · “From a wastepaper basket in Ebersbach. Do not ask.”</p>
      <div data-shred="mail"></div>`},
    buero: {title: 'Still of Roth', role: OR, html: `
      <p class="stamp">Tracking · Screenshot from Roth’s video image</p>
      <p>Something is leaning against the wall behind Dr. Roth. Zoom in.</p>
      <div data-photo="buero"></div>`}
  },

  puzzles: {
    echt: {
      q: 'Is Lot 1 genuine? Mark everything that differs from the museum catalog.', input: 'switches', n: 8,
      labels: ['Window', 'Bird', 'Ring', 'Hairband', 'Lemon', 'Letter', 'Jacket', 'Frame'],
      hash: ['49a5b06af13d318fe6662a2f0d4cf7bfaeaa3abd8c46bbff3de17146f8db56f5'],
      near: {'d1a8cf8567f7e96f07b74fe1d9f037e8c7f20b2cf5cd2e0280d655466cb73285': 'You have two. Look at her hands.', '358b9f5e69ff8359e36178fe5dc585597ba2681061fd27a0f943632ebb8bc01b': 'You have two. What is in the window?', 'a889cde342fe507dce6795cecc92b27fd100e80472764f25036eef88a31933be': 'You have two. Count the panes.', '07f9063040012513237b378c207b4ed69c083a56a0ce05ce3ea365bf4403a0e1': 'One is right. There are three.', '8b2319fd759d1781707cd72e214b27533cbfff86817a837710e805f96c6be784': 'One is right. There are three.', '92978151eaeab0d801ad55f3cba49609fbac402ef1d42a4fee3ce469cdc91890': 'One is right. There are three.'},
      hints: ['Appraisal and Tracking: describe the pictures to each other from left to right. Or put one on the desk.', 'Go piece by piece: window, cage, hands, hair, table. Count everything that can be counted.', 'Window, bird and ring are different.']
    },
    ort: {
      q: 'Where is Blanc broadcasting from? Which church is he sitting at?', ph: 'Church',
      hash: ['752eb0d2103fa1c895ec09a2c43f4793f6635fad18d0300448a42ddf464ae8b3', '7a856a75ae61daa0127f922d6bbfbf0bf4616d08435f08409f85acf915a8f6f9', 'bdf7a69bf37dc50f23a7a2e012bac1f6bb7968674f14c9fbbe9e87e1459f7a59', 'd17b0885064041b86a07cce7ebdc058d393a93eab255d96b4262ae362d49ce32', '131389df482b847bc5b1e4c9ea259d478e4f067fc736c139ef2a79e421113f4e', 'dd2baf68a3f7c2e684a661b0cc5f27a41c45e0fff52f9e815dc118e6827a0664', '8f92a8dce31ed645adac51ef599308cfdd13b6b5eed17d3a2bc72bbb400b4d06', 'dd2baf68a3f7c2e684a661b0cc5f27a41c45e0fff52f9e815dc118e6827a0664', 'a2efc1280445e84465a70f4ccde5789bad23532a741226f0ccd98b18c1acd2c2', '454074f9d446b8b44b281e902fa780e8660d6224c8f8d1178870f72bf7c5e8dc'],
      near: {'c5029ed6011b7dee0166b388c0a0467b086098bb735a7c781d4acdfcdffd34c6': 'Chapel Hill or Chapel Street? Read the sign carefully.', 'a8f8721943a1ef99f24547ea26459119c6a0d73c73886a5ae0ec26876fcaac7b': 'Chapel Hill or Chapel Street? Read the sign carefully.', '5a72e7eebea8d942a4e7f118f64fdda513681e57de82001600f25accc38b2289': 'St. John’s is on Chapel Hill, not on Chapel Street.', 'd9cfb7ec554ee52707f9ff7321c04dca032134dada571e4aba91890d3cb1dd75': 'St. John’s is on Chapel Hill, not on Chapel Street.', '4f91c1aa60dc6e999eecf92f504370a6f3bfad8272bebf1918f0685194df43f0': 'St. John’s is on Chapel Hill, not on Chapel Street.', 'da78ae868f4955aa7a3508b5d13fa9e2f86e51839f4adbbd766f270b41e95ccb': 'Does the tower in the picture have a baroque cap?', '3ca1bef32be447757fe86849e976ca5acee8fa65370c8e5fcfed9dca04f161b7': 'Does the tower in the picture have a baroque cap?', '8478e02746489e5bc347f33d8c5efab0de0ee73defdd71a0321e25f08af578ba': 'Does the tower in the picture have a baroque cap?', 'a379438e296530418c27d3100c16cdd90823ef87b4b9166a9e30ed06a251a44b': 'Do you see two towers?', '4ebfd35fcdea6801e891a690f240ca59e552f830de188358d9956ae1517708bd': 'Do you see two towers?', 'c9f865653818276f1eb6e6d56cb4fc4ff414282c54c428ad3b758367edbc300d': 'Do you see two towers?'},
      hints: ['Tracking: zoom into Blanc’s still, at the bottom by the window and outside. Appraisal: the city guide knows the churches.', 'There is a street sign on the window. Which church is on this street?', 'St. James’s, Chapel Street.']
    },
    erhoehung: {
      q: 'When was the sum insured raised? (DDMM)', ph: 'DDMM', input: 'digits', by: GU,
      hash: ['0b9e9198799dd933ceefdc1ec8e2942194b32bd6659ada2eb13d965edaf4e40c', '4768da20195aef6efd10953533b3a89e6dadeb32bd32d2f6f3e8c9e186f1dab8'],
      near: {'75cac39b149e16c4228a3446061fbad35a9d3ff2908a1ad32394f596a3714ab3': 'That is the day of the theft. The increase was before that.'},
      hints: ['Appraisal: run the pointer over the policy. The security ink only glows under the UV lamp.', 'The glowing note is below the sum insured. Enter the date as day and month.', '2 May, so 0205.']
    },
    mail: {
      q: 'What does “M.” write to Blanc about the original?', ph: 'Where?',
      hash: ['c5bb4cdcce12c5257ed4ba6c53392dd75c13681c8a59896cf77cb364af6ed75a', '1129a2536f0a423c933ad45c6483fac70704524d2a5ddd27c7ff3c22dea4903c', '00de50ca5959ee5796743afb878b90281f4226595bf7dab24c580508dd0818eb', 'bcf6d8c4058b1f79d37afc2bb4a005e3b410227eec05b200fc5ed2664c10333e', 'f0156116299477312f884165c87fab52ce3c167e912d9365aa461d4baf05fb95', 'e1ad6577dc0568c2541756bc4934fabb4d7d9bc53c8ca41cd26fd0644aeb786b', '1205004d06b7ce6ab00bbfccd51bbb8194b0136bf516fc8f2b4958439cdc4d6c'],
      near: {'d02b3ae96f1313979f9dd9c00ab8312a2a8a9aaa72e74088b696363f36a558cb': 'That is where the copies go.', '7f4bfe7590b8ed575529b8c07d724fa87b23f895df50af949904d7f66afacb8f': 'That is where the copies go.', '37310ad57a084e206b87eb24403b4d034386c4047c49ff3c77500ffd1b4211a9': 'That is where the copies go.', '800c62eb147822c6ee12b22f5851e96eea685eedf46187e35a5b408263f812db': 'That is when the insurance pays.', '3d8ff5ba75714b31535d3b93942ab903154daa6747c4c8b537f219d25e770989': 'That is when the insurance pays.'},
      hints: ['Tracking: put the strips from the wastepaper basket back together. Appraisal can read along if you put them on the desk.', 'The line with ORIGINAL.', '“The original stays here.”']
    }
  },

  endings: {
    polizei: {title: 'Ending: HAMMER PRICE', code: 'ZS-HAMMER',
      text: 'The police pick up Blanc from his salon on Chapel Street and Dr. Roth from her office. Under the gray cloth: The Letter Reader, with the bird, the ring and six window panes. On Monday she hangs in Hall 2 again.',
      epilog: 'On the plaque next to the painting there is now a new line: “Painted 1664, stolen twice, auctioned once, never sold.”'},
    deal: {title: 'Ending: SILENCE', code: 'ZS-SILENCE',
      text: 'You accept Roth’s offer. Blanc is arrested, Roth stays director. The Letter Reader reappears “returned anonymously”. The insurer pays nothing, the museum stays broke. But it stays open.',
      epilog: 'A year later you get an invitation to the reopening of Hall 2. Guest of honor: Bidder 7. You do not go.'},
    verkauft: {title: 'Ending: SOLD', code: 'ZS-SOLD',
      text: 'Going thrice. Bidder 3 gets the hammer, Blanc is offline before the police know the street. The insurer pays fourteen million to a museum that never lost its painting.',
      epilog: 'Two years later a Letter Reader without a bird hangs in a Madrid villa. The owner knows. She kept it anyway.'}
  },
  codes: {'1d01087b21fe58b3e4386976e1176d7446afaf9782980a26ae70330b9959de7d': 'polizei', 'd42ee5c7db6d3f4eeabe4fe6f0850d5a884ceec8e77a06968100554b104df370': 'deal', 'd21555adfa2970996c8f23e8b1e09206705f1ca29bd78b543ebfdbf35ea0ad9e': 'verkauft'},

  script: [
    // ---------- Kapitel 1 ----------
    ['chapter', 1, 'Admission'],
    ['ambience', 'wartemusik'],
    ['unlock', 'einladung'],
    ['chat', 'roth', 'Roth here. Thank you for doing this. You are Bidder 7. Blanc must not notice who you are. I am with you in the chat.'],
    ['goal', 'The auction begins shortly. You are Bidder 7.'],
    ['wait', 3000],
    ['join', 'blanc'],
    ['ambience', null],
    ['say', 'blanc', 'Good evening, ladies and gentlemen. Welcome to a very small, very discreet auction.'],
    ['say', 'blanc', 'Discretion means: cameras off. Everyone’s. Otherwise I do not begin.'],
    ['goal', 'Blanc only begins when all cameras are off.'],
    ['quiet', 'cam', 'blanc', 'Wonderful. I see nobody, nobody sees me. That is how I like it.', 'Bidder seven, I still see a camera there.'],
    ['say', 'blanc', 'Lot one. Pieter van Hoorn, The Letter Reader, sixteen sixty-four. Until three weeks ago in a small museum that did not appreciate her.'],
    ['unlock', 'katalog'], ['unlock', 'los'],
    ['chat', 'roth', 'Compare the painting with our catalog. I know every brushstroke. If something is not right, I want to know.'],
    ['goal', 'Compare Lot 1 with the museum catalog. Appraisal has the catalog, Tracking the live image.'],
    ['solve', 'echt', {npc: 'blanc', every: 55000, taunts: ['Take your time. Beauty does not run away.', 'A masterpiece, is it not? Every bird, every pane.']}],
    ['chat', 'roth', 'A forgery?! Then he is selling copies. And he still has the original. Find out where he is sitting.'],
    ['wait', 1500],

    // ---------- Kapitel 2 ----------
    ['chapter', 2, 'Bidding war'],
    ['say', 'blanc', 'Another bidder is knocking. Madame, please.'],
    ['knock', 'vasquez'],
    ['join', 'vasquez'],
    ['say', 'vasquez', 'Buenas noches. Forgive me for being late. I bid what is necessary.'],
    ['say', 'blanc', 'We begin at two million. Bidders who wish to bid raise a hand. All at the same time, please, I count only once.'],
    ['goal', 'Stay in the race: everyone raise a hand at the same time.'],
    ['hold', {label: '✋ Everyone at the same time: raise a hand', ms: 2500}],
    ['say', 'blanc', 'Two million, Bidder seven. Madame?'],
    ['say', 'vasquez', 'Three.'],
    ['unlock', 'standbild'], ['unlock', 'stadtfuehrer'],
    ['chat', 'roth', 'Stall him! Tracking: I sent you a still from his video. Appraisal: the city guide is in your file. Where is he broadcasting from?'],
    ['goal', 'Find out where Blanc is broadcasting from before the hammer falls.'],
    ['timer', 360000, 'Going thrice'],
    ['solve', 'ort', {npc: 'blanc', every: 45000, onFail: 'verkauft', taunts: ['Three million going once.', 'Bidder seven, you hesitate? One rarely sees that.', 'Three million going twice.']}],
    ['timer', null],
    ['chat', 'roth', 'St. James’s, Chapel Street. I am calling the police. Keep him on the line for a few more minutes!'],
    ['say', 'blanc', 'Bidder seven, last chance. Hands up, everyone.'],
    ['hold', {label: '✋ Everyone at the same time: raise a hand, four million', ms: 2500}],
    ['say', 'blanc', 'Four million. Madame?'],
    ['say', 'vasquez', 'Let him have it. I am out.'],
    ['say', 'blanc', 'Knocked down to Bidder seven! Applause, please. Payment details to follow.'],
    ['clap', {label: '👏 Everyone clap at the same time: hammer price!', text: 'Blanc wants applause. Everyone clap at the same moment, mic on.'}],
    ['leave', 'blanc'],
    ['wait', 1500],

    // ---------- Kapitel 3 ----------
    ['chapter', 3, 'Bidder 3'],
    ['goal', 'Bidder 3 is calling privately.'],
    ['call', 'vasquez', {note: 'Bidder 3 · private'}],
    ['say', 'vasquez', 'Congratulations, Bidder seven. I am not a collector. Hanseatic Art Insurance, fraud claims department.'],
    ['say', 'vasquez', 'We are supposed to pay fourteen million for the painting. A month ago it was only four. Odd, is it not? I am sending you the policy.'],
    ['unlock', 'police'],
    ['goal', 'Appraisal: when was the sum insured raised? And by whom?'],
    ['solve', 'erhoehung'],
    ['say', 'vasquez', 'The second of May. Three weeks before the theft. And it was the director herself who applied for it.'],
    ['say', 'vasquez', 'I have something else. From a wastepaper basket in Ebersbach. Do not ask how.'],
    ['unlock', 'papierkorb'],
    ['goal', 'Tracking: put the mail from the wastepaper basket back together. What does M. write about the original?'],
    ['solve', 'mail', {npc: 'vasquez', every: 60000, taunts: ['Paper does not lie. People do.', 'Read the line with the original.']}],
    ['say', 'vasquez', 'The original stays here. Here, in Ebersbach. It never left the museum.'],
    ['leave', 'vasquez'],
    ['join', 'blanc', 'glitch'],
    ['say', 'blanc', 'Bidder seven. Before the handover I want to see who I am doing business with. Cameras on. Faces into the camera.'],
    ['chat', 'roth', 'Do NOT show them! Camera on, but cover it with your hand. Then he thinks it is dark where you are.'],
    ['goal', 'Blanc wants to see your faces: camera on, but cover it with your hand.'],
    ['quiet', 'covered', 'blanc', 'How naughty. But fine. Dark rooms, dark deals.', 'I can see someone there. Hello.'],
    ['say', 'blanc', 'One moment. My doorbell is ringing. Downstairs. Two gentlemen in uniform. Bidder seven, that was not nice.'],
    ['fx', 'crash', 2500],
    ['leave', 'blanc', 'off'],
    ['wait', 1500],

    // ---------- Kapitel 4 ----------
    ['chapter', 4, 'Hall 2'],
    ['goal', 'Dr. Roth wants to see you.'],
    ['call', 'roth', {note: 'Ebersbach House Museum · Office'}],
    ['say', 'roth', 'The police have Blanc! You were magnificent. The painting was sadly not with him. But we will find it.'],
    ['unlock', 'buero'],
    ['lockLeave', true],
    ['goal', 'Confront Dr. Roth. You need evidence.'],
    ['ask', 'roth', {prompt: 'Dr. Roth smiles wearily into the camera.', options: [
      {id: 'danke', label: '“What happens now?”', say: ['The insurer pays, we buy security technology, and sometime it turns up again. That is how it goes.']},
      {id: 'blanc', label: '“You are working with Blanc!”', tag: 'accuse', wrong: true, say: ['Excuse me? I sent you to him! Think about what you say.']},
      {id: 'summe', label: '“You raised the insurance to 14 million on 2 May.”', tag: 'proof', needs: ['erhoehung'], set: {p_summe: true},
        say: ['The value had gone up. That is routine.']},
      {id: 'mail', label: '“The original stays here. M.” Your mail to Blanc.', tag: 'proof', needs: ['mail'], set: {p_mail: true},
        say: ['M. is a common letter.']},
      {id: 'tuch', label: '“What is behind you under the cloth? I see a bird cage. With a bird.”', tag: 'proof', needs: ['buero', 'echt'], set: {p_tuch: true},
        say: ['… A frame. Empty. Stock.']},
      {id: 'original', label: '“The original is in your office. The forgery has no bird.”', tag: 'proof', needs: ['p_summe', 'p_mail', 'p_tuch'], end: true,
        say: ['… The museum is broke. One more year, then we close. Fourteen million would have saved everything. And nobody would have lost anything.',
          'I will make you an offer. Blanc goes to prison, he deserves it. I give the painting back anonymously. And you forget this evening.']}
    ]}],
    ['lockLeave', false],
    ['goal', 'Decide together: what happens to Dr. Roth?'],
    ['vote', {id: 'roth', prompt: 'Dr. Roth’s offer', options: [
      {id: 'polizei', label: 'Call the police', desc: 'Roth and Blanc, both.'},
      {id: 'deal', label: 'Accept the offer', desc: 'The painting comes back, the museum stays open.'}
    ]}],
    ['ending', s => s.results.roth],

    ['label', 'verkauft'],
    ['say', 'blanc', 'Three million going thrice. Knocked down to Madame. Good night, Bidder seven.'],
    ['ending', 'verkauft']
  ]
}
