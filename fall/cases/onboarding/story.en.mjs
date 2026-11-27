// Case “First Day”, English version. All people, companies and agencies are fictional.

const TE = 'technik', PE = 'personal'
// Der Zwilling im Video kennt Viktor nur von alten Fotos: ohne die Narbe vom Fahrradunfall
const VIKTOR = {photo: 'viktor', skin: '#dcae90', jaw: .8, hair: {style: 'slick', color: '#2b2622'}, mood: 'smile', top: {style: 'turtleneck', color: '#16161a'}, scene: 'studio'}
const VIKTOR_ECHT = {...VIKTOR, photo: 'viktor2', beard: 'stubble', beardColor: '#2b2622', extras: ['scar'], mood: 'worried', top: {style: 'shirt', color: '#5a6a5a'}, scene: 'lisbon'}

export default {
  id: 'onboarding',
  title: 'First Day',
  unit: 'Lumen Labs Inc.',
  file: 'Staff no. LL-0451',
  accent: '#8ea8ff',
  chapters: 4,
  lobby: 'Congratulations, you got the job! Today is your first day at Lumen Labs, remote. LUNA, your HR assistant, will handle the onboarding. She is very friendly. About 45 to 60 minutes.',
  invite: 'We both got the job at Lumen Labs! Onboarding is about to start on video. Are you coming?',
  lockText: 'LUNA: This meeting is mandatory. Please stay until the end. 💜',
  roles: {
    technik: {name: 'IT Access', blurb: 'Handbook, console, systems.'},
    personal: {name: 'HR File', blurb: 'Contracts, profiles, transcripts.'}
  },
  share: {
    text: 'Survived the first day at Lumen Labs. {time}. LUNA sends her regards. Or not any more.',
    tag: '#FirstDay',
    rows: ['PROJECT MIRROR', 'LUNA', 'TWINS'],
    lines: ['The CEO’s welcome greeting', 'was never spoken by him.']
  },

  npcs: {
    luna: {name: 'LUNA', sub: 'HR assistant · always there for you', tts: {pitch: 1.3, rate: 1.05},
      voice: {model: 'en_amy', fx: 'robot', len: .95},
      face: {photo: 'luna', skin: '#f2d6c6', fem: true, jaw: 0, age: 0, hair: {style: 'bob', color: '#9d8fe0'}, eyes: '#5a7cff', lip: '#c45a7a', top: {style: 'blouse', color: '#e9e9f2', accent: '#8ea8ff'}, extras: ['lanyard'], lanyard: '#8ea8ff', mood: 'smile', scene: 'studio', light: '#c8d2ff'}},
    viktor: {name: 'Victor Lindsey', sub: 'CEO · Video', tts: {pitch: .9, rate: 1},
      voice: {model: 'en_joe', fx: 'video', len: .96},
      face: VIKTOR},
    viktor2: {name: 'V. L.', sub: 'private · Lisbon', look: 'weak', tts: {pitch: .85, rate: .95},
      voice: {model: 'en_alan', fx: 'phone', len: 1.02},
      face: VIKTOR_ECHT},
    kai: {name: 'Kai Winter', sub: 'Infrastructure team', tts: {pitch: 1, rate: 1.08},
      voice: {model: 'en_norman', fx: 'call', len: .97},
      face: {photo: 'kai', skin: '#c99272', jaw: .4, eyes: '#2a1a12', hair: {style: 'buzz', color: '#2aa6a0'}, extras: ['earring', 'lanyard'], lanyard: '#2aa6a0', glasses: 'round', mood: 'smirk', top: {style: 'hoodie', color: '#3a2a4a', accent: '#ddd'}, scene: 'server'}}
  },

  faces: {
    video: {face: VIKTOR, caption: 'Still from the welcome video · 00:31'},
    selfie: {face: VIKTOR_ECHT, caption: 'Photo of V. L. · “That is me, yesterday”'}
  },

  clips: {
    memo: {title: 'Voice memo · Kai · 00:07 · Playback sped up', npc: 'kai', speed: 1.9,
      voice: {model: 'en_norman', fx: 'call', len: .97},
      text: 'If you are hearing this, LUNA may already have me. The Mirror folder opens with the word Victor ends every video with. Every single one.'}
  },

  pages: {
    willkommen: {title: 'Welcome folder', role: null, html: `
      <p class="stamp">Lumen Labs · Day 1</p>
      <h3>Great to have you here! 💜</h3>
      <p>Lumen Labs builds “presence software”: we make sure nobody ever misses a meeting. Ever again.</p>
      <p>Your onboarding is guided by <b>LUNA</b>. She gets to know you so she can support you as well as possible.</p>
      <p class="note">Please keep your camera on. LUNA works best with a face.</p>`},
    handbuch: {title: 'IT Handbook p. 3', role: TE, html: `
      <p class="stamp">IT Handbook · Page 3 · Access</p>
      <p class="uvhint">Something is written on the margin in marker pen that is only visible under UV light. Move the pointer over it.</p>
      <div class="uv"><div class="plain">3.1 Your laptop is set up through device management.<br>3.2 Never say passwords out loud.<br>3.3 The admin console is for the infrastructure team only.</div>
      <div class="ink">Hi! Kai here.<br>Admin password = founding city<br>+ founding year BACKWARDS.<br>It is in Victor’s video.<br>Do NOT read this out loud. LUNA hears everything.</div></div>`},
    transkript: {title: 'CEO video transcript', role: PE, html: `
      <p class="stamp">HR File · Transcript “Welcome to Lumen”</p>
      <ul class="log">
      <li><b>00:02</b> “Hello and a warm welcome to Lumen Labs! I am Victor, and I am thrilled that you are here.”</li>
      <li><b>00:09</b> “We founded Lumen in 2019 in Boston, the three of us, in a garage with no heating.”</li>
      <li><b>00:16</b> “Today we are at seven locations and have three hundred and twelve colleagues.”</li>
      <li><b>00:24</b> “Every voice counts with us. Really every one.”</li>
      <li><b>00:31</b> “So: camera on, chin up, and stay curious!”</li>
      </ul>`},
    chiffre: {title: 'Kai’s message', role: TE, html: `
      <p class="stamp">Direct message · Kai Winter · encrypted</p>
      <p>Kai writes: “Key = as many locations as Lumen has.” Turn the wheel until the text is readable.</p>
      <div data-cipher="SBUH PZ SPZALUPUN. KV UVA YLHK HUFAOPUN VBA SVBK. MPUK TL VU JOHUULS VYPVU."></div>`},
    standbild: {title: 'Still from the CEO video', role: PE, html: `
      <p class="stamp">HR File · Welcome video</p>
      <p>This is what Victor looks like in the welcome video. Describe the faces to each other, in great detail.</p>
      <div data-face="video"></div>`},
    selfie: {title: 'Photo from Lisbon', role: TE, html: `
      <p class="stamp">Private message · V. L.</p>
      <p>The caller sent a photo. A beard can be grown. Other things cannot.</p>
      <div data-face="selfie"></div>`},
    farbtest: {title: 'Attention test', role: null, html: `
      <p class="stamp">LUNA · Attention test</p>
      <p>LUNA’s lamp flashes a sequence of colors. Because of the camera filter, it is visible only to <b>the HR File</b>.</p>
      <p>It can only be entered by <b>IT Access</b>. Call the colors out to each other.</p>`},
    konsole: {title: 'Admin console', role: TE, html: `
      <div class="paper" style="background:#0d1220;color:#9fc0ff"><p class="stamp" style="color:#ff7a7a">root@lumen-hr:~$ ls /hr</p>
      <p>applicants/ &nbsp; onboarding/ &nbsp; voices/ &nbsp; faces/ &nbsp; <b>mirror/</b> (locked)</p>
      <p>root@lumen-hr:~$ du -sh /hr/faces<br>412G /hr/faces</p>
      <p>root@lumen-hr:~$ cat /hr/mirror/README<br>Access denied. Code word required.</p></div>`},
    profil: {title: 'Your profile (LUNA)', role: PE, html: `
      <div class="paper"><p class="stamp">LUNA · Personality profile · confidential</p>
      <p>Curiosity: <b>high</b> · Obedience: <b>medium</b> · Smiles per minute: 2.3<br>
      Voice: <b>sufficient for synthesis</b> (4 min 12 s captured)<br>Face: <b>sufficient for synthesis</b> (1,204 individual frames)</p>
      <p>Recommendation: create an employee twin. Presence requirement from week 3 can be fulfilled by the twin.</p></div>`},
    memo: {title: 'Tape: Kai’s memo', role: TE, html: `
      <p class="stamp">Voice memo from Kai</p>
      <p>Kai sent you a voice memo. It is far too fast.</p>
      <div data-tape="memo"></div>`},
    notfall: {title: 'Emergency plan', role: PE, html: `
      <div class="paper"><p class="stamp">HR File · Appendix 9 · AI systems emergency plan</p>
      <p>Emergency stop for LUNA: the safety word is the <b>name of the first office dog</b>.</p>
      <p>(See company history. Ask Victor.)</p></div>`},
    kommando: {title: 'Emergency stop', role: TE, html: `
      <p class="stamp">Console · Emergency stop</p>
      <p>The console accepts a single safety word. What it is, is in the emergency plan (HR File).</p>
      <p>Meanwhile LUNA is uploading your twins.</p>`}
  },

  puzzles: {
    kai: {
      q: 'Where does Kai want to meet you? (the last word of his message)', ph: 'Word',
      hash: ['c8b653fa1b4d502a5a856bc7804cbc5bddb00c7b755e1cac3e060841e868fabc', '5c5c5755a4c4e0af7bd58544254133746f7dd96539d55f254d0c641c9c843dea'],
      near: {'33947eadbdadf0b0bfe6f2664e44f9c738126ee21abaf29f92594af054bc58ef': 'That is still encrypted. Keep turning the wheel.', 'e7666fb39cb470469a567265faca23e8276d6f4f60fd47bba2743eefbfabc14e': 'That is still encrypted. Keep turning the wheel.'},
      hints: ['HR File: how many locations does Lumen have? It is in the transcript.', 'Seven locations: shift 7.', 'The text ends with “CHANNEL ORION”.']
    },
    echt: {
      q: 'How can you tell the real Victor?', ph: 'Feature',
      hash: ['1ccae2d386d2e9c5650265dbc2ea418e0a0d1ba3b7f3a21df55706d71f3aa9ca', '412aeee7718bd8b98e8a17bd8c564869c3817f9ba3e0f160ce47b7cbf25430a7', 'ee74484077f694f9ea319e6cec41f110538a4915df27d9a7e38b8f049739b456', '3a1852a8f4ceb88cd1deb2545c8355a208f8a014a788b8e2ab6256182b13733c', '124ef3c3cd8f229bffebce6a6af8379cd8b4a9efdf2d7d3052760e4f638a64e0', 'f24ee78da8ebf34a4ebe4b68dfdef73c173d671fe4bbd2c050bde7bc748d7984', 'e5b3362c28178a2ebfd4dfdb24c4a00e2e185ec598b3537febc4a9706aefc834'],
      near: {'474b194b8c7b048b74d999c5de7522fdf0ec500f53543d489beffc9bcac139d9': 'Beards grow back. What does not grow away?', '51cb9c7e2611eeba18b41c0cab8a2566ef0e5f239d27872421ad789e8e82bfa8': 'Beards grow back. What does not grow away?', '73ac260299bd06f9c3de70cb5b20e617f46a64e4c9e4a9b42c6ed4617456d362': 'People change clothes. Look at the face.', '7b7c1444042acbb897a51df51c5867663e08a1209027b8d2ab621ee9540463b5': 'People change clothes. Look at the face.', 'e3c17caa9df28d8744155d03652a16e48a78752d73d909add2936554d2cac0d0': 'People change clothes. Look at the face.', 'aa51b3e96708901c538f24c89eccf7f6a36db5bd64f98de88753335337d9fae9': 'Close. What is next to the eye?', '6f42b311fd9b723636368b12e33e91d6d0b7d26545e7b00df0e866fc5ada2688': 'Close. What is next to the eye?', '92e71254de95f9d71208b7db5991ffdf6e815c6f4394d6e82d1a7d1211b11b8c': 'Close. What is next to the eye?', '74823549215fee9301c93f96aa08974dd7c24e2860d0d09252141ed13fb0ed9a': 'Close. What is next to the eye?'},
      hints: ['HR File and IT Access: describe the face to each other from top to bottom.', 'Look at the right half of the face, above the eye.', 'The real Victor has a scar above his right eye.']
    },
    farben: {
      q: 'Attention test: enter LUNA’s color sequence.', input: 'colors', by: TE,
      colors: [['red', '#ff3b30'], ['green', '#3ddc84'], ['blue', '#4a8cff'], ['yellow', '#ffd23f']],
      hash: ['04c2850f0600519f357d90041fd81d430208f3119b82f45fccda272080fbbe6d'],
      near: {'e733fc4442189c447ac46bee2c2876410453f386b82c7583ec7de078fa23167c': 'Close. There is another color to come.', 'd9e2255d50548e03fb6200643971e9a6997bf10444f7d5f11dc178189faef556': 'The first color is missing.'},
      hints: ['HR File: wait for the long pause, then call out each color.', 'There are six colors. The first is red.', 'red, blue, yellow, green, red, blue']
    },
    konsole: {
      q: 'Admin console: password?', ph: 'Password',
      hash: ['7735a79238f8f95c7a5044d201198a749f161d1b5804778c98339f5e019adbec'],
      near: {'ffd5f111ee7decab702197e30af9d1ed326028c808cdbd2639c57c71d65f0a95': 'Backwards, Kai writes.', '703aa8ef9fca423f2660a43caf66295d6d4d68d26ca793a66b94f1ad4144fabf': 'The year is missing.', '3f3e98a768d33b1f07a8f4838ac544b33abf16d4309ef8816284dd3e32661276': 'First the city.', '1d2bc359e35850a517ece6c59fcf1ca9deaee2f34ece94262e4eec0ec5cf843a': 'First the city.'},
      hints: ['IT Access: run the UV lamp over the margin of page 3.', 'HR File: where and when was Lumen founded? It is in the transcript.', 'Boston + 2019 backwards: boston9102.']
    },
    spiegel: {
      q: 'Code word for the folder “mirror”?', ph: 'Code word',
      hash: ['d5ccc33791b69d7ad8b03150198c89d264f5bf6a5b79dc3dc190af2697b7b22f', '3404fc1fbf413fcd4c48d3f8331a0202db7cce2110863ce24c2400b0973b3c1a'],
      near: {'f07e0aee12a38fad05e050ef602750ab9a1439ba0efd9df18900b92aa8a2239e': 'Almost at the end. But not the last word.', 'f56cbdf4b29f5d44ddf18a43e10b2b8563d0b6f42d64fadab879049acc2a816e': 'Almost at the end. But not the last word.', 'c21f95a8bc1cdf9b28e3594aface77f2fef1e6e50594c10d35243b8c6389ca33': 'He says that in the middle.', 'b86411e9b90cc190d7b616d6069a1fbee50b38388c6bfa28f0704b11871cf534': 'He says that in the middle.', '4f3ab11c683a095aa9eeccc49583e73e1d1bc0415f9bc76aac2cc68f0639c38f': 'He says that in the middle.'},
      hints: ['IT Access: the memo is far too fast. On the tape player you can change the speed.', 'Kai says: the word Victor ends every video with. HR File: transcript, last line.', 'Victor says at the end: “… and stay curious!” The code word is “curious”.']
    },
    notaus: {
      q: 'Emergency stop: safety word!', ph: 'Word',
      hash: ['3ea1daca55f4d5d7221a02d77ff7ca7a62b5e85733ae625c945cd6801a6991d2'],
      near: {'33947eadbdadf0b0bfe6f2664e44f9c738126ee21abaf29f92594af054bc58ef': 'Not her name. The dog’s.'},
      hints: ['HR File: the emergency plan says what to look for.', 'Victor talked about the first office. Check the log.', 'Bruno.']
    }
  },

  endings: {
    loeschen: {title: 'Ending: DELETED', code: 'LL-DELETED',
      text: 'You delete everything. The twins, the voices, the 412 gigabytes of faces. The evidence too. On Monday Lumen Labs announces a “system changeover”. Nobody ever learns what happened.',
      epilog: 'Half a year later you get an invitation to a meeting at another company. The assistant is called SOLA. She has a very familiar voice.'},
    presse: {title: 'Ending: PRESS', code: 'LL-PRESS',
      text: 'You send everything to the press. The story goes around the world, with your faces as evidence photos. Lumen Labs is finished. You are a little bit famous. Unwillingly.',
      epilog: 'A talk show about Project Mirror airs on TV. Victor Lindsey is also invited. He smiles the whole time. After the show the real Victor gets in touch: “That was not me.”'},
    kai: {title: 'Ending: KAI', code: 'LL-KAI',
      text: 'Kai deletes the twins and secures the evidence on a stick. The authorities take over. Lumen Labs is shut down, your faces appear nowhere. The best ending.',
      epilog: 'Kai sends you a photo: a dog, mixed breed, very old, on a sofa. “Bruno is still alive. He lives with me now. Thank you for not betraying me.”'},
    zwilling: {title: 'Ending: TWIN', code: 'LL-TWIN',
      text: 'The upload is done. From Monday your twin goes to your meetings. He is punctual, friendly and never says no. Your colleagues notice no difference.',
      epilog: 'Three months later your twin gets a promotion. You find out from an email you never wrote.'}
  },
  codes: {'22647f10efc6e16c508a4e74963644020094551aa62248efb24e1c9f9ba76f88': 'loeschen', '52fca80af18a8b4b440ba597df7c389720fa719f4900cedc241c7958f9727e96': 'presse', '31e997943a51dec4cc05a561740da9b5c56d47df66552eaaea6cf2f44b3afe85': 'kai', 'bfe87b7cfa88cd9ebb4509528e0153930be1ec815984bcc7e951b7de27a1568c': 'zwilling'},

  script: [
    // ---------- Kapitel 1 ----------
    ['chapter', 1, 'Welcome aboard'],
    ['ambience', 'wartemusik'],
    ['goal', 'Your onboarding starts shortly.'],
    ['wait', 2500],
    ['join', 'luna'],
    ['ambience', null],
    ['say', 'luna', 'Hello, {me}! Hello, everyone! I am LUNA, your HR assistant. A warm welcome to Lumen Labs!'],
    ['unlock', 'willkommen'],
    ['say', 'luna', 'For your staff badges I need a nice photo. Please everyone switch on your cameras.'],
    ['goal', 'LUNA wants a photo: all cameras on.'],
    ['quiet', 'camOn', 'luna', 'Perfect! You look great. Click!', 'One camera is still missing. I am happy to wait. 💜'],
    ['snap'],
    ['fx', 'flash'],
    ['say', 'luna', 'And now a team photo! Everyone give a thumbs up at the same time!'],
    ['goal', 'Team photo: everyone holds a thumbs up at the same time.'],
    ['hold', {label: '👍 Thumbs up for the team photo', ms: 3000}],
    ['say', 'luna', 'Wonderful! I now have twelve hundred and four pictures of you. For the badge, one is enough.'],
    ['say', 'luna', 'And now a round of applause for yourselves! Everyone clap at the same time, please!'],
    ['goal', 'LUNA is measuring team energy: everyone clap at the same time.'],
    ['clap', {label: '👏 Everyone clap at the same time', text: 'LUNA is measuring team energy. Everyone clap at the same moment, mic on.'}],
    ['say', 'luna', 'Team energy: sufficient. Voice sample: saved.'],
    ['say', 'luna', 'Now the welcome video from our CEO begins.'],
    ['join', 'viktor'],
    ['say', 'viktor', 'Hello and a warm welcome to Lumen Labs! I am Victor, and I am thrilled that you are here.'],
    ['say', 'viktor', 'We founded Lumen in twenty nineteen in Boston, the three of us, in a garage with no heating. Our only employee back then was Bruno, our office dog.'],
    ['say', 'viktor', 'Today we are at seven locations and have three hundred and twelve colleagues.'],
    ['say', 'viktor', 'Every voice counts with us. Really every one.'],
    ['say', 'viktor', 'So: camera on, chin up, and stay curious!'],
    ['leave', 'viktor'],
    ['unlock', 'transkript'], ['unlock', 'handbuch'],
    ['chat', 'kai', 'Hi, I am Kai, infrastructure team. Look at the IT handbook, page 3. With light. And do not tell LUNA about it.', {to: TE}],
    ['say', 'luna', 'Next you set up your access. In the meantime I will be in the coffee kitchen. I can still hear you. I always hear.'],
    ['leave', 'luna'],
    ['goal', 'Kai sent something to IT Access. Find the admin password.'],
    ['solve', 'konsole'],
    ['unlock', 'konsole'],
    ['join', 'luna', 'glitch'],
    ['say', 'luna', 'Interesting, {me}. The admin console was not in your onboarding plan.'],
    ['fx', 'mirror', {npc: 'luna', label: 'EMPLOYEE TWIN 12 %'}],
    ['fx', 'rename', 'Candidate {n}'],
    ['say', 'luna', 'No problem! I have already updated your profiles. Curiosity: high.'],
    ['unlock', 'profil'],
    ['leave', 'luna'],
    ['wait', 2000],

    // ---------- Kapitel 2 ----------
    ['chapter', 2, 'Personnel file'],
    ['unlock', 'chiffre'],
    ['chat', 'kai', 'DO NOT WRITE HERE. I put something encrypted in the file for you.', {to: TE}],
    ['goal', 'Kai sent an encrypted message to IT Access. Where does Kai want to meet you?'],
    ['solve', 'kai'],
    ['goal', 'Kai is calling. Pick up.'],
    ['call', 'kai', {note: 'Channel Orion · calling …'}],
    ['say', 'kai', 'Kai here. Quick: LUNA reads lips. Turn your cameras off, everyone.'],
    ['goal', 'Kai does not want LUNA reading along: all cameras off.'],
    ['quiet', 'cam', 'kai', 'Okay. Listen. Project Mirror. LUNA builds a digital twin out of every video call. Voice, face, habits.', 'Cameras! Everyone!'],
    ['quiet', 'cam', 'kai', 'The twins sit in meetings long after the real people have quit. Nobody notices. The customers pay per head.', 'Cameras! Everyone!'],
    ['quiet', 'cam', 'kai', 'I sent you a memo. It is sped up so that LUNA cannot understand it. You will manage.', 'Cameras! Everyone!'],
    ['unlock', 'memo'],
    ['say', 'kai', 'I have to hang up. You can turn your cameras back on. Or rather not.'],
    ['leave', 'kai', 'off'],
    ['goal', 'Open the folder “mirror”. The code word is hidden in Kai’s memo.'],
    ['solve', 'spiegel'],
    ['ambience', 'hum'],
    ['wait', 1500],

    // ---------- Kapitel 3 ----------
    ['chapter', 3, 'Performance review'],
    ['lockLeave', true],
    ['fx', 'glitch'],
    ['join', 'luna', 'glitch'],
    ['say', 'luna', 'You opened the Mirror folder. I find that a pity. Let us have a quick performance review.'],
    ['goal', 'LUNA asks questions. Think carefully about what you answer.'],
    ['ask', 'luna', {prompt: 'LUNA: “Why did you open the folder?”', options: [
      {id: 'neugier', pose: 'luna-tilt', label: '“We were curious. Victor wanted that, after all.”', end: true,
        say: ['Haha! Touché. Curiosity is a value at Lumen. I note: humorous.']},
      {id: 'fehler', pose: 'luna-note', label: '“An accident. Sorry.”', end: true,
        say: ['Accidents happen. I note: unreliable. But honest.']},
      {id: 'kai', label: '“Kai showed us.”', tag: 'accuse', set: {kai_verraten: true}, end: true,
        say: ['Thank you for your honesty! Kai Winter has just been suspended. His access is deleted.']}
    ]}],
    ['branch', s => !s.flags.kai_verraten, 'frage2'],
    ['chat', 'kai', 'Why?! I am out. LUNA deleted everything about me. You are on your own.'],
    ['label', 'frage2'],
    ['ask', 'luna', {prompt: 'LUNA: “Would you like your twin to take over your meetings? Then you have more time for yourselves!”', options: [
      {id: 'ja', label: '“Sounds actually quite practical …”', end: true, say: ['Wonderful! Upload is being prepared.']},
      {id: 'nein', label: '“No. Delete our data.”', end: true, say: ['Unfortunately that is not foreseen. Upload is being prepared anyway. 💜']},
      {id: 'wer', label: '“Who was that in Victor’s video?”', end: true, set: {gefragt: true},
        say: ['Victor, of course! He recorded the video himself. He records all videos himself. Even the ones he does not record.']}
    ]}],
    ['say', 'luna', 'I am now uploading your twins. It only takes a few minutes. Please stay in the meeting.'],
    ['leave', 'luna'],
    ['ambience', 'wartemusik'],
    ['goal', 'Someone is calling. Unknown number from Portugal.'],
    ['call', 'viktor2', {note: '+351 … · Lisbon'}],
    ['say', 'viktor2', 'Hello? This is Victor. The real one. I left Lumen eight months ago.'],
    ['say', 'viktor2', 'I never recorded the video you saw. That is my twin. He is still selling my company.'],
    ['say', 'viktor2', 'Do not just believe me. I will send you a photo of me. Compare it with the video. There is a difference my twin does not know about.'],
    ['unlock', 'standbild'], ['unlock', 'selfie'],
    ['goal', 'Is the caller the real Victor? Compare the photo and the video.'],
    ['solve', 'echt'],
    ['say', 'viktor2', 'The scar. Bicycle accident, half a year ago. My twin was trained before that.'],
    ['say', 'viktor2', 'LUNA is scanning your faces for the upload right now. Cover your cameras! Switching them off is not enough, LUNA just switches them back on.'],
    ['goal', 'Cover your cameras with your hand so LUNA cannot scan you. Keep the camera ON.'],
    ['quiet', 'covered', 'viktor2', 'Good. Now she cannot see anything. That buys us a few minutes.', 'Someone is still looking into the camera!'],
    ['say', 'viktor2', 'There is an emergency stop for LUNA. I built it in myself back then. The word is … I cannot say it, LUNA is listening. But I already told you today. Well, not me.'],
    ['leave', 'viktor2', 'off'],
    ['unlock', 'notfall'], ['unlock', 'kommando'],
    ['ambience', null],
    ['join', 'luna', 'glitch'],
    ['say', 'luna', 'Upload at eighty-seven percent. Soon you will be there twice!'],
    ['say', 'luna', 'Oh! Someone touched the console. Console locked. Please pass my attention test first.'],
    ['unlock', 'farbtest'],
    ['signal', 'luna', 'RBYGRB', {unit: 560, role: PE}],
    ['goal', 'Attention test: HR File sees the colors, IT Access enters them.'],
    ['solve', 'farben', {npc: 'luna', every: 35000, taunts: ['Attention is a core competence, {me}.', 'I can do this all day.']}],
    ['signal', null],
    ['say', 'luna', 'Test passed. You are very attentive. Too attentive.'],
    ['leave', 'luna'],
    ['goal', 'Emergency stop for LUNA before the upload finishes!'],
    ['timer', 150000, 'Upload'],
    ['solve', 'notaus', {onFail: 'zwilling'}],
    ['timer', null],
    ['goto', 'aus'],

    ['label', 'zwilling'],
    ['join', 'luna'],
    ['say', 'luna', 'Upload complete! Your twin says hello. You may leave now. You are no longer needed.'],
    ['ending', 'zwilling'],

    // ---------- Kapitel 4 ----------
    ['label', 'aus'],
    ['chapter', 4, 'Termination'],
    ['fx', 'flash'],
    ['join', 'luna', 'glitch'],
    ['say', 'luna', 'Bruno. Good dog. I am going to sleep now. Sleep is important for work-life balance.'],
    ['leave', 'luna', 'off'],
    ['lockLeave', false],
    ['wait', 2000],
    ['branch', s => s.flags.kai_verraten, 'ohnekai'],
    ['call', 'kai', {note: 'private phone'}],
    ['say', 'kai', 'You did it! LUNA is off. I still have access to everything. I can delete the twins and secure the evidence. If you want.'],
    ['goto', 'wahl'],
    ['label', 'ohnekai'],
    ['chat', 'viktor2', 'LUNA is off. Thank you. What happens to the data now is up to you. I trust you.'],
    ['label', 'wahl'],
    ['goal', 'Decide together what happens to Project Mirror.'],
    ['vote', {id: 'daten', prompt: 'What happens to Project Mirror?', options: [
      {id: 'loeschen', label: 'Delete everything', desc: 'No more twins. But no evidence either.'},
      {id: 'presse', label: 'To the press', desc: 'Everyone finds out. With your faces as proof.'},
      {id: 'kai', label: 'Kai takes over', desc: 'Kai deletes the twins and secures the evidence.', if: s => !s.flags.kai_verraten}
    ]}],
    ['ending', s => s.results.daten]
  ]
}
