// Case “The Ninth Caller” (Night Shift), English version. All people, companies and agencies are fictional.
// Solutions are stored only as SHA-256 in the case (tool: fall/tools/seal.mjs). Step reference: see fall/README.md.

const F = 'forensik', A = 'archiv'

export default {
  id: 'nachtschicht',
  title: 'The Ninth Caller',
  unit: 'Division 0',
  file: 'Case 0-NS-1411',
  accent: '#ffb23f',
  chapters: 6,
  lobby: 'You are the night shift of Division 0, an investigation unit that only meets by video call. Tonight a three-year-old case is being reopened. Allow 90 to 120 minutes. You can pause at any time and carry on later.',
  invite: 'I need your help. Tonight, just us, on a video call. Do not tell anyone.',
  lockText: 'Participant 9: You are staying right here.',
  roles: {
    forensik: {name: 'Forensics', blurb: 'Technical analyses: voices, tapes, network measurements.'},
    archiv: {name: 'Archive', blurb: 'Files: lists, transcripts, maps, tables.'}
  },
  share: {
    text: 'File 0-NS-1411 closed. {time}. We now know who the ninth caller is. You do not.',
    tag: '#TheNinthCaller',
    rows: ['WHEREABOUTS L. B.', 'PARTICIPANT 9', 'ENDING'],
    lines: ['The recording of 14.11.2023 contains nine voices.', 'One of them was never invited.']
  },

  npcs: {
    sommer: {name: 'DCI H. Summers', sub: 'Division 0 · Head', tts: {pitch: .85, rate: 1.04},
      voice: {model: 'en_joe', pitch: -1, fx: 'call', len: 1.02},
      face: {photo: 'sommer', skin: '#d6a486', hair: {style: 'short', color: '#8f8b86'}, beard: 'stubble', beardColor: '#8f8b86', glasses: 'half', age: 2, mood: 'stern', jaw: .8, top: {style: 'suit', color: '#262c36', accent: '#d9d6cf', tie: '#5a2630'}, scene: 'police'}},
    geist: {name: 'Lena Brandt', sub: 'Account inactive since 2023', look: 'ghost',
      face: {photo: 'geist', skin: '#e8bea2', fem: true, jaw: .2, hair: {style: 'bob', color: '#2a1d16'}, extras: ['freckles', 'earring'], mood: 'smile', top: {style: 'sweater', color: '#3a4a4a'}, scene: 'night'}},
    moewe: {name: 'Unknown', sub: 'Number withheld', look: 'weak', tts: {pitch: .45, rate: .86},
      voice: {model: 'en_bryce', pitch: -2, fx: 'whisper', len: 1.08},
      face: {photo: 'moewe', silhouette: true, hair: {style: 'hood'}, top: {style: 'coat', color: '#111'}, scene: 'storm'}},
    bernd: {name: 'Bernard Ahrens', sub: 'Mobile · Munich', tts: {pitch: .8, rate: .95},
      voice: {model: 'en_nem', pitch: -1.5, fx: 'phone', len: 1.08},
      face: {photo: 'bernd', skin: '#e3ad90', hair: {style: 'bald', color: '#9a948c'}, beard: 'mustache', beardColor: '#8a8178', age: 2, jaw: .9, mood: 'worried', look: [-1.2, .4], glasses: 'square', glassColor: '#6a5a3a', top: {style: 'jacket', color: '#46553a', accent: '#e8e2d6'}, scene: 'office'}},
    neun: {name: 'Participant 9', sub: 'not invited', look: 'void glitchy', tts: {pitch: .1, rate: .78}, widget: 'ping',
      voice: {model: 'en_norman', fx: 'demon', len: 1.15},
      face: {photo: 'neun', silhouette: true, glow: '#ff3b30', hair: {style: 'hood'}, scene: 'void'}},
    lena: {name: 'Lena Brandt', sub: 'Weather station · Emergency power', look: 'weak', tts: {pitch: 1.1, rate: .96},
      voice: {model: 'en_kristin', fx: 'radio', len: 1.0},
      face: {photo: 'lena', skin: '#e8bea2', fem: true, jaw: .2, age: 1, hair: {style: 'beanie', color: '#2a1d16', hat: '#7a3a2a'}, extras: ['freckles', 'scarf', 'bandage'], scarf: '#3a5a6a', mood: 'worried', top: {style: 'coat', color: '#2f3b3a'}, scene: 'hut'}}
  },

  clips: {
    dtmf: {title: 'Hands-free recording · Ahrens’ phone · 14.11.2023 · 21:20', dtmf: '0712289'},
    mailbox: {title: 'Mailbox L. Brandt · 14.11.2023 · 21:41', npc: 'lena', reverse: true,
      voice: {model: 'en_kristin', fx: 'mailbox', len: 1.05},
      text: 'In case something happens to me. The locker at Lindau station, number seventeen. The code is my birthday. Day and month. But backwards.'}
  },

  shreds: {
    fax: {n: 8, order: [5, 2, 7, 0, 3, 6, 1, 4], lines: [
      'VELMONT CORP  ·  CORPORATE SECURITY',
      'INTERNAL  ·  DO NOT FORWARD',
      '',
      'HEAD: A. KRELL (CODE NAME NINE)',
      'OFFICE ST. GALLEN  071 228 9',
      'ASSIGNMENT 14.11.: LISTEN TO SOURCE B.',
      'TARGET: L. BRANDT  ·  URGENT'
    ]}
  },

  pages: {
    fall: {title: 'The Case', role: null, html: `
      <p class="stamp">Reopening · File 0-NS-1411</p>
      <h3>Lena Brandt, 34, investigative journalist</h3>
      <p>On <b>14.11.2023</b> Lena Brandt hosted a video call with eight people. Subject: indications of falsified studies on the drug <b>VX-12</b> by Velmont Corp. At 21:38 the call dropped. Lena has been missing ever since.</p>
      <p>We have the recording of the call. The old analysis found nothing.</p>
      <p><b>Today, 22:47:</b> Lena’s account was online again. For the first time in three years.</p>`},
    dienst: {title: 'Standing orders', role: null, html: `
      <div class="paper"><p class="stamp">Division 0 · Night shift standing orders</p>
      <p>1. Everyone has different documents. Dashed tabs are visible only to you. Read things out, describe, ask questions.</p>
      <p>2. Witnesses lie. Believe nothing you cannot prove.</p>
      <p>3. Whoever knocks is not invited. Decide together whom to let in.</p>
      <p>4. Every solved lead yields a <b>fragment</b> (symbol + digit, at the top next to the goal). Keep them. If the line is compromised you need them for the emergency shutdown.</p>
      <p>5. If it goes dark: flashlight. Move the pointer.</p></div>`},
    stimmen: {title: 'Voice analysis', role: F, html: `
      <p class="stamp">Forensics · Recording 14.11.2023</p>
      <p>The software cut out 12 contributions: time, fundamental frequency of the voice, features. Who spoke was not evaluated back then. What was said is in the transcript (Archive).</p>
      <table><thead><tr><th>Contribution</th><th>Time</th><th>Pitch</th><th>Features</th></tr></thead><tbody>
      <tr><td>S01</td><td>21:02:11</td><td>212 Hz</td><td>Northern German, Hamburg tinge</td></tr>
      <tr><td>S02</td><td>21:04:40</td><td>104 Hz</td><td>Rhineland accent</td></tr>
      <tr><td>S03</td><td>21:07:02</td><td>188 Hz</td><td>Berlin accent</td></tr>
      <tr><td>S04</td><td>21:09:55</td><td>131 Hz</td><td>Standard German</td></tr>
      <tr><td>S05</td><td>21:12:30</td><td>167 Hz</td><td>Swabian accent</td></tr>
      <tr><td>S06</td><td>21:14:07</td><td>98 Hz</td><td>Alemannic (Swiss), echo, wind</td></tr>
      <tr><td>S07</td><td>21:16:48</td><td>219 Hz</td><td>Swedish accent</td></tr>
      <tr><td>S08</td><td>21:19:21</td><td>141 Hz</td><td>Bavarian accent</td></tr>
      <tr><td>S09</td><td>21:23:05</td><td>122 Hz</td><td>Northern German</td></tr>
      <tr><td>S10</td><td>21:27:44</td><td>209 Hz</td><td>Northern German, Hamburg tinge</td></tr>
      <tr><td>S11</td><td>21:31:16</td><td>106 Hz</td><td>Rhineland accent, fast</td></tr>
      <tr><td>S12</td><td>21:37:59</td><td>211 Hz</td><td>Northern German, connection breaks off</td></tr>
      </tbody></table>`},
    liste: {title: 'Participant list', role: A, html: `
      <p class="stamp">Archive · Call 14.11.2023, 21:00–21:38</p>
      <p>Eight people were invited and logged in. Voices according to witness statements:</p>
      <table><thead><tr><th>Name</th><th>Role</th><th>Voice</th></tr></thead><tbody>
      <tr><td>Lena Brandt</td><td>Journalist, host</td><td>high, from Hamburg</td></tr>
      <tr><td>Dr. Jonathan Kessler</td><td>Pharmacologist</td><td>very deep, from Cologne</td></tr>
      <tr><td>Mara Voss</td><td>Lawyer</td><td>rather high, from Berlin</td></tr>
      <tr><td>Tarek Haddad</td><td>Data analyst</td><td>medium, no dialect</td></tr>
      <tr><td>Elsie Brenner</td><td>Former Velmont employee</td><td>rather deep for a woman, from Stuttgart</td></tr>
      <tr><td>Sofia Lindqvist</td><td>Translator</td><td>high, Swedish</td></tr>
      <tr><td>Bernard Ahrens</td><td>Informant, camera off</td><td>medium, from Munich</td></tr>
      <tr><td>Paul Jansen</td><td>Photographer</td><td>medium, from Bremen</td></tr>
      </tbody></table>`},
    abschrift: {title: 'Transcript', role: A, html: `
      <p class="stamp">Archive · Transcript without speaker attribution</p>
      <ul class="log">
      <li><b>21:02:11</b> “Thank you all for being here. What we discuss today does not leave this call.”</li>
      <li><b>21:04:40</b> “The VX-12 study was rewritten twice. I have both versions.”</li>
      <li><b>21:07:02</b> “Legally it is clear-cut. But only if the originals turn up.”</li>
      <li><b>21:09:55</b> “The metadata do not match. Someone changed the files over the weekend.”</li>
      <li><b>21:12:30</b> “I was at Velmont for eleven years. I know who signed off the approval.”</li>
      <li><b>21:14:07</b> “If everything goes wrong: the lighthouse is still burning. She knows what that means.”</li>
      <li><b>21:16:48</b> “I will translate the Swedish minutes by Friday.”</li>
      <li><b>21:19:21</b> “Be careful. They already know about this meeting.”</li>
      <li><b>21:23:05</b> “I have photos of the lab in Basel. Night shift, without a permit.”</li>
      <li><b>21:27:44</b> “Bernard, how do you know that?”</li>
      <li><b>21:31:16</b> “We should hang up. Right now.”</li>
      <li><b>21:37:59</b> “There is someone else on the li–”</li>
      </ul>`},
    mailbox: {title: 'Tape: Mailbox', role: F, html: `
      <p class="stamp">Forensics · Exhibit 7 · Mailbox recording</p>
      <p>The Gull sent us a voice message that Lena left on the night she disappeared. It sounds … wrong.</p>
      <div data-tape="mailbox"></div>
      <p class="note">The tape player can go slower, faster and backwards.</p>`},
    personalakte: {title: 'Personnel file L. B.', role: A, html: `
      <div class="paper"><p class="stamp">Residents’ register · Extract</p>
      <p><b>Brandt, Lena Marie</b><br>born 17 April 1989 in Hamburg-Altona<br>Journalist (freelance)<br>
      last registered address: Holstenstraße 112, Hamburg<br>Vehicle: none · Rail card 100 (since 2021)</p>
      <p>Noteworthy: on 14.11.2023 at 16:02 a locker booking, rail locker facility Lindau Island.</p></div>`},
    notizbuch: {title: 'Lena’s notebook', role: A, html: `
      <p class="stamp">Archive · Exhibit 8 · Notebook from locker 17</p>
      <p class="uvhint">The page seems almost empty. Move the UV lamp (pointer or finger) over it.</p>
      <div class="uv"><div class="plain">Page 14<br><br>Shopping: bread, batteries, 2 films (b/w)<br>Call Paul re: lab</div>
      <div class="ink">B. will call someone during the meeting. 21:20.<br>I have known since Monday. I am letting him.<br>Whoever listens gives themself away.<br><br>Plan: M. gets me out.<br>I am going where the light is up high.</div></div>`},
    telefon: {title: 'Call records', role: F, html: `
      <p class="stamp">Forensics · Mobile network Bernard Ahrens · 14.11.2023</p>
      <table><thead><tr><th>Time</th><th>Direction</th><th>Number</th><th>Duration</th></tr></thead><tbody>
      <tr><td>18:12</td><td>in</td><td>+49 89 …</td><td>4:12</td></tr>
      <tr><td>20:55</td><td>out</td><td>Data (video call)</td><td>43:10</td></tr>
      <tr><td>21:20:03</td><td>out</td><td>+41 71 ··· ·· ·· (Switzerland)</td><td>0:38</td></tr>
      <tr><td>22:40</td><td>in</td><td>+41 71 ··· ·· ··</td><td>0:09</td></tr>
      </tbody></table>
      <p class="note">During the video call Ahrens was also on the phone.</p>`},
    waehltoene: {title: 'Tape: Dial tones', role: F, html: `
      <p class="stamp">Forensics · Exhibit 11</p>
      <p>Ahrens’ phone ran in hands-free mode on 14.11. At 21:20 you can hear him dial a number: seven keys.</p>
      <p>Every key on a phone plays <b>two tones at once</b>. The frequency display under the tape shows them to you. Play it at normal speed: slower shifts the tones.</p>
      <div data-tape="dtmf" data-spectrum></div>`},
    dtmf: {title: 'Key tones', role: A, html: `
      <p class="stamp">Archive · Technical manual, tone dialing (DTMF)</p>
      <p>Each key = one low tone (row) + one high tone (column):</p>
      <table><thead><tr><th></th><th>1209 Hz</th><th>1336 Hz</th><th>1477 Hz</th></tr></thead><tbody>
      <tr><td>697 Hz</td><td>1</td><td>2</td><td>3</td></tr>
      <tr><td>770 Hz</td><td>4</td><td>5</td><td>6</td></tr>
      <tr><td>852 Hz</td><td>7</td><td>8</td><td>9</td></tr>
      <tr><td>941 Hz</td><td>✱</td><td>0</td><td>#</td></tr>
      </tbody></table>
      <p class="note">Forensics reads the tones. You translate.</p>`},
    fax: {title: 'Fax from Ahrens', role: F, html: `
      <p class="stamp">Forensics · Fax received 23:51</p>
      <p>Ahrens faxed you something. Before that he ran it through the shredder. Habit, he says.</p>
      <div data-shred="fax"></div>`},
    sicherungen: {title: 'Fuse box', role: F, html: `
      <p class="stamp">Forensics · Cellar, emergency power distribution</p>
      <p>You are standing in front of the box. Eight toggle switches, labeled from left to right:</p>
      <div class="grid" style="--n:4"><span>S1 Heating</span><span>S2 Server</span><span>S3 Elevator</span><span>S4 Radio</span><span>S5 Light</span><span>S6 Alarm</span><span>S7 Camera</span><span>S8 Hallway</span></div>
      <p class="note">Only you can flip the switches. What may be on is in the Archive’s power plan.</p>`},
    stromplan: {title: 'Power plan', role: A, html: `
      <div class="paper"><p class="stamp">Facility management · Emergency power plan headquarters</p>
      <p>1. Emergency power carries <b>at most five</b> circuits.</p>
      <p>2. <b>Radio</b> and <b>Camera</b> we need for the operation.</p>
      <p>3. Without <b>Server</b> no <b>Light</b>. Without light the <b>Camera</b> camera does not work (low-light sensor).</p>
      <p>4. <b>Heating</b> and <b>Elevator</b> draw too much: off.</p>
      <p>5. The <b>Alarm</b> restarts everything on emergency power: leave it off.</p>
      <p>6. <b>Hallway</b> and light are on the same circuit: both the same.</p></div>`},
    ping: {title: 'Locate signal', role: F, html: `
      <p class="stamp">Forensics · Live measurement</p>
      <p>Participant 9 runs through three of our network nodes. Open the <b>connection details</b> on his tile
(the <b>i</b> at the top right). There you continuously see the round-trip time (ping) to each node.</p>
      <p>The values fluctuate. Pass the numbers on to your team. The Archive knows how to turn them into a place.</p>`},
    knoten: {title: 'Network nodes', role: A, html: `
      <p class="stamp">Archive · Network topology Division 0</p>
      <p><b>Rule of thumb:</b> For every 50 km of distance add about 1 ms round-trip time, plus 3 ms base load in the node. Fluctuations always come <i>on top</i>: only the lowest readings count.</p>
      <table><thead><tr><th>Place</th><th>Zurich</th><th>Munich</th><th>Stuttgart</th></tr></thead><tbody>
      <tr><td>Constance</td><td>60 km</td><td>190 km</td><td>130 km</td></tr>
      <tr><td>Lindau</td><td>100 km</td><td>150 km</td><td>160 km</td></tr>
      <tr><td>St. Gallen</td><td>65 km</td><td>180 km</td><td>165 km</td></tr>
      <tr><td>Basel</td><td>75 km</td><td>320 km</td><td>200 km</td></tr>
      <tr><td>Chur</td><td>95 km</td><td>210 km</td><td>230 km</td></tr>
      </tbody></table>`},
    morse: {title: 'Morse chart', role: A, html: `
      <p class="stamp">Archive · Radio manual, Appendix C</p>
      <p>Short = · (one beat of light), long = – (three beats). Short pause between letters, long pause at the end of the word.</p>
      <div data-morsetable></div>
      <p class="note">Forensics sees the light just like you. Have them call out short and long.</p>`},
    licht: {title: 'Light signal', role: F, html: `
      <p class="stamp">Forensics · Note</p>
      <p>Lena’s microphone is dead, but her camera lamp is blinking. The signal repeats after a long pause.</p>
      <p>Call out every sign to your team: <b>short</b> or <b>long</b>, and when a pause comes. The Archive has the chart.</p>`},
    notfall: {title: 'Emergency card', role: A, html: `
      <div class="paper"><p class="stamp">Division 0 · Emergency shutdown · Classified</p>
      <p>If a line is being traced back, the emergency shutdown disconnects all nodes. The code is made up of the digits of the fragments,
ordered by this sequence of the symbols:</p>
      <p class="big" style="text-align:center">△ ☾ ◯ ⚓ ✶</p></div>`},
    abschaltung: {title: 'Emergency shutdown', role: F, html: `
      <p class="stamp">Forensics · Control panel</p>
      <p>The panel takes <b>five digits</b>. You know the digits: they are the fragments you collected (at the top next to the goal).</p>
      <p>The order is on the emergency card. The Archive has it.</p>`}
  },

  widgets: {
    // Laufzeit-Minima bei Teilnehmer 9 (= St. Gallen: 3 + km/50); nur die Forensik kann sie lesen
    ping(el, {role}) {
      if (role !== F && role !== 'beide') { el.innerHTML = '<p>Measurement data encrypted. Only Forensics can read it.</p>'; return }
      const nodes = [['Zurich ZH-1', 4.3], ['Munich M-2', 6.6], ['Stuttgart S-3', 6.3]]
      el._h ??= nodes.map(() => [])
      el.innerHTML = '<p>Round-trip time to the nodes</p>' + nodes.map(([name, min], i) => {
        const v = min + (Math.random() < .22 ? 0 : .3 + Math.random() * Math.random() * 5)
        const hist = el._h[i]; hist.push(v); if (hist.length > 8) hist.shift()
        const f = x => x.toFixed(1)
        return `<div class="row"><span>${name}</span><b>${f(v)} ms</b><i>${hist.slice(0, -1).map(f).join(' · ')}</i></div>`
      }).join('')
    }
  },

  puzzles: {
    stimme: {
      q: 'Whoever is not on the list spoke anyway. Which keyword did the ninth voice say?', ph: 'Keyword',
      hash: ['5f386947eea28e23b2fda9bf9d33a76a192ca85a6c43e2fc1467aca13be2f5e7', '5947632388c0c88a4e4e60fb58c8dc86313bf31eba2e53e0af0caf83c5659d78', 'aa102eb795fe4d2e562f39bb50c9f4223b932c5d9b692a5ef4e122797104604c'],
      near: {'aa015223ba13b71cc922e3e4b63be1ead9dcd7284aa28f79cd77e44d18f8269d': 'That was Paul, the photographer from Bremen.', '745be56a07faec87eba2da48b92944fc3c5d5c06704fe80d6e3a603e29ec87ca': 'That was Paul, the photographer from Bremen.', '5b1999b3bf579cb716691fb28d6da0854450585a4fb258531a66c694cebf793c': 'That was Paul, the photographer from Bremen.', 'be13e090067c1ca5130a178947977a2112f50bb7873ecb3896837d264d863f82': 'A name, not a keyword. But remember it.', '9bc2ee4ac70ac97537748e81c659b23071fb8675d13c658e8ef92d5b2b3c3c2e': 'A name, not a keyword. But remember it.', '1d4157dea7b97cf1fa8927970fd69964fdb01fb1e8c6a25ba17108c7ef4967f8': 'A name, not a keyword. But remember it.', '1210165572d0e17f6c274d82f2f899b3630a622c5a534edf81a5585bada0b462': 'A name, not a keyword. But remember it.'},
      hints: [
        'Forensics: read the pitch and dialect out to the Archive. Archive: assign a person to each contribution.',
        'One contribution fits nobody on the list: very deep and Swiss dialect. What time is it?',
        'Contribution S06 at 21:14:07. The transcript says there: “lighthouse”.'
      ]
    },
    fach: {
      q: 'Which code opens Lena’s locker?', ph: 'Code', input: 'digits',
      hash: ['499b69cef8e3b86c67508105e251bb27e424bc36bd1ae07f837cf4e3dc16d7c3'],
      near: {'955fc478f291f6e65c41bc0aadc37caffa3fd25abee4c8de5a1a22e44e3480f1': 'Close. Listen to the message again all the way to the end.', '0a397d4c78f8b08b9ef9a2708e5984addf3f3d674899ecb778c5e06013bdfeb9': 'Only day and month.', '87bd88ec018f1020cc236bee1d6305e72eaf917bc3d444018880ed3f186a62a4': 'Only day and month.'},
      hints: [
        'Forensics: the mailbox sounds backwards. The tape player has a switch for that.',
        'Lena says: birthday, day and month, but backwards. Archive: the birthday is in the personnel file.',
        '17 April → 1704 → backwards: 4071.'
      ]
    },
    nummer: {
      q: 'Which number did Ahrens dial at 21:20? (all seven digits)', ph: 'Number', input: 'digits',
      hash: ['f927528def5555384a3b287c9ea8b04de40b2b064a0fe0678cec758072e920ac'],
      near: {'2e63339015bdbc4d7b51dec6553634e1aefef917d2da07d4946be51031b8b7ed': 'The first key is missing.', '360e01b9f521e36df2013a3fd6724b879822e087c69413e971aa0d943323a233': 'There is more to come. Listen to the end.'},
      hints: [
        'Forensics: play the tape at normal speed and read out the two frequencies for each key.',
        'Archive: low tone = row, high tone = column. 941 + 1336 is the 0.',
        '0 · 7 · 1 · 2 · 2 · 8 · 9'
      ]
    },
    krell: {
      q: 'Who is Participant 9? (last name)', ph: 'Name',
      hash: ['26d4eca60264f65e4b994b4e8920c02d757fbc7b72d55c74dfd303207609f8c6', '44a94e46ab66ed674bf7e9cd73b85673e770346f5193a8c08a38bb1c85a6eb88'],
      near: {'eb7be0be48f1a2c300b2a48a0cdfe5bfb8bcd8cff65bbac89b69466f6dbbae05': 'That is his call name. What is his real name?', '4dd6b77695b8e4a9d38857ca2fcc278757824b9a51a58f1e928f1345cf0d4f41': 'That is his call name. What is his real name?', '8f595de60f7d1382634e74a3529a6e6acf7d48b676b90c411812c370b950a85a': 'The company. We want the man.', '13ff95cafd900d4eda2b987df5d43bd929b864ce85b31a688bd9459bf9522a93': 'The company. We want the man.'},
      hints: ['Forensics: tap two strips in turn to swap them. Make sure that words continue across the edges.', 'The first line begins with VELMONT. Look for the strip with “VE” and build on from there.', 'HEAD: A. KRELL.']
    },
    strom: {
      q: 'Which fuses must be on?', input: 'switches', n: 8, by: F,
      hash: ['f9b3f3b45fa23b2125ed9f58683bef880e3e2dc7ea628c66ba77d5bede1dec6d'],
      near: {'d6e6edb0a7c8cb80745b41630c387c11b74bd8e2746902dcd0dc6bd831b1d3fd': 'Close. How are hallway and light connected?', '7b5f9394a33a0e367f44a65377fffe160451d0bd9402481b0426a1b860cf7b7d': 'The heating draws too much.', '5e4fd11c7185fff6f2b159609be735f474ce2e3bda8466387443d725ced13068': 'The alarm restarts everything.', '5936c645cda55cb3e8f867e9ad6c4e2997661f9658afda933f415c87c3b5d54e': 'No light, no camera.', '67c3f75124c65c36ad2558f59a52b9ab5968261e4eccf9c1e749734425ba1a6b': 'No light, no camera.'},
      hints: ['Archive: read out the rules. Forensics: say which switch is for what.', 'Two switches are certain: Radio (S4) and Camera (S7). Go on from there rule by rule.', 'S2, S4, S5, S7, S8 on. Everything else off.']
    },
    ping: {
      q: 'Where is Participant 9 sitting?', ph: 'Place',
      hash: ['3bf4aeb0a9d0849e7086ddb4d64b46bc00d0469d045ab51a446e7cf1fb6c756e', 'a0bb713d4ac8e604b508be3b89d1054c4260a679663b8e029cfc3098f7b50395', 'be297c5a73c6e09493751897335a85a24f97feda415aa62003d7d63569589ecb', '001154db4cc3bd9b32993bc7c645173e85b6519885ebc20c388a6cda56ac6398', '0ef02af721f118d4dd5f3e980e11931e5bb11e381b33ef2c46963c11a80a3ba3', '8d87768ef9efd8b66fb7177957317f91219508d660b7d4cbbafa980a66be39ba', '3c65aacaef325838c79222543a84faa2ea207f824ba590af7ec3631cd18d8795'],
      near: {'4e454499600d22f10b02495beb542233f11c2ee664f0535b415d8187935cb82d': 'Very close. Take another look at Stuttgart.', '6ad465e29180b5bb25cc0bbbf183d534598c9c918c82754057a66d11704133a3': 'Very close. Take another look at Stuttgart.', '287a19774ca8c66c05712c21df2b0051c2d2a34a64694ee0506617fbc113d602': 'Zurich does not fit.', '6c779a507d75b562c1ef1d55929381bb95774d460d9292cb4d5baaabceb95e40': 'That is a node, not a place from the list.', 'f36d677822e311a178c69aceccb365f56ecdedbd6e8c13632ef6250d7b0861e0': 'That is a node, not a place from the list.', 'acd8dda8b8898af416fd80243533cf6cf78682c8b12571e04e62ebef4c9d1886': 'That is a node, not a place from the list.'},
      hints: [
        'Forensics: watch the values for a while and remember the lowest one per node.',
        'Archive: for each place calculate 3 + distance ÷ 50. Example Constance–Zurich: 3 + 60 ÷ 50 = 4.2 ms.',
        'The minima are about 4.3 / 6.6 / 6.3 ms. Only St. Gallen fits all three.'
      ]
    },
    morse: {
      q: 'What is Lena’s lamp flashing?', ph: 'Word',
      hash: ['7036d9e15087769838e2d76126a67ce83ca28fb183d52a3616d053f8aacd01ee', '1f1e7b6651e24c8b861245dc2883118cf1a2c21cf188aabf4fce8ce2d4becd0f', '8c89eac7deeeaa035a4f2b103a62fa207202cf1abdaf194d762a31b3dd28e58d'],
      near: {'da72c325045b8e85ee8ea02bc0e64d796b0ba236ea9152ab5a889789fd57155b': 'The word is longer. Wait for the long pause.', '90c263ae168c85932a5609230f60637783b34d008bb8adbce5a7676ecf9d552e': 'No, not a distress call. A place.'},
      hints: [
        'Forensics: call out every flash, “short” or “long”. Archive: write along and look it up.',
        'It is a word with seven characters. It begins with ··· (S).',
        '··· ·– · –· – ·· ··· = SÄNTIS (spelled SAENTIS), a mountain in eastern Switzerland.'
      ]
    },
    abschaltung: {
      q: 'Emergency shutdown: five-digit code. Quick!', ph: 'Code', input: 'digits',
      hash: ['7fb2edb334d0e61bd8dc91299a097cfd08aa46917fe3ce6f3779a0ebe70e431f'],
      near: {'88d1270cd7f7784b4e65cf5cb9a458a7baf022b2dd5703601a0ff0e849c55c5d': 'That is the order in which you found them. The card says something different.'},
      hints: [
        'The digits are the five fragments at the top next to the goal.',
        'Archive: read out the order of the symbols from the emergency card.',
        '△ 4, ☾ 9, ◯ 1, ⚓ 7, ✶ 2: code 49172.'
      ]
    }
  },

  endings: {
    licht: {title: 'Ending: LIGHT', code: 'N9-LIGHT',
      text: 'You published. The originals on VX-12 are out, Velmont Corp stands still. Lena has disappeared again. This time on purpose.',
      epilog: 'Three weeks later a parcel with no sender arrives at the division. Inside: a wooden lighthouse, barely bigger than a thumb. In the base a note: “Thank you. There is a tenth.”'},
    still: {title: 'Ending: SILENT', code: 'N9-SILENT',
      text: 'You kept quiet. Lena is safe, the originals stay sealed. Velmont Corp carries on as if nothing had happened.',
      epilog: 'A year later a withheld number calls the division. Nobody speaks. Only wind, and very far away a foghorn. Then a deep voice: “He knows who you are now.”'},
    leuchtturm: {title: 'Ending: LIGHTHOUSE', code: 'N9-LIGHTHOUSE',
      text: 'Bernard Ahrens testifies. With his confession and Lena’s originals the head of security at Velmont is taken into custody. Lena can go home. The rarest ending.',
      epilog: 'Lena finishes writing the story. The last sentence of her article: “Thanks to the night shift. You were the ninth voice I needed.”'},
    verloren: {title: 'Ending: LOST', code: 'N9-LOST',
      text: 'The trace went through. Participant 9 now knows Lena’s hiding place and your line. The next morning the weather station is empty.',
      epilog: 'On the desk in the weather station there is only a note, in Lena’s handwriting: “I am not angry. You were close. Try again.”'}
  },
  codes: {'3771f6b0b6ff3fcdfa76c432dc34ce18ddfb47959fec30fe5ad32cd75298eee7': 'licht', '41fe52c8a299210388bb4981dce9e5bca0c1907ae97eb30c834c73a69c3206e2': 'still', '064a9dc7723608e8775d47021b4502ee2a3c1e89d133088bf7b8a0584386e7df': 'leuchtturm', '41066492e0e33c12026c52ced96cb600d768d709e818c10e6712ac038e756854': 'verloren'},

  script: [
    // ---------- Kapitel 1 ----------
    ['chapter', 1, 'Reopening'],
    ['ambience', 'hum'],
    ['goal', 'Waiting for DCI Summers.'],
    ['wait', 3000],
    ['snap'],
    ['join', 'sommer'],
    ['wait', 1200],
    ['say', 'sommer', 'Good evening, night shift. Thank you for getting here so fast.'],
    ['say', 'sommer', 'I will keep it short. Three years ago the journalist Lena Brandt disappeared after a video call. We have the recording. The old analysis found nothing.'],
    ['say', 'sommer', 'Today at twenty-two forty-seven her account was online again. For the first time in three years.'],
    ['unlock', 'fall'], ['unlock', 'dienst'], ['unlock', 'stimmen'], ['unlock', 'liste'], ['unlock', 'abschrift'],
    ['say', 'sommer', 'I am sending you the documents. Everyone gets different ones. You have to put them together. Read the standing orders.'],
    ['say', 'sommer', 'There are eight people in the recording. I believe nine spoke. Find out what the ninth voice said.'],
    ['fx', 'ring'],
    ['say', 'sommer', 'One moment, that is headquarters. I have to take this. You can do it.'],
    ['leave', 'sommer'],
    ['goal', 'Find out what the ninth voice in the recording said.'],
    ['wait', 9000],
    ['join', 'geist', 'glitch'],
    ['fx', 'toast', 'Lena Brandt has joined the call.'],
    ['wait', 4200],
    ['leave', 'geist', 'glitch'],
    ['chat', 'sommer', 'Did you see that?! Lena’s account was just in your call. Carry on, I will have it checked.'],
    ['solve', 'stimme'],
    ['fragment', '☾', '9'],
    ['chat', 'sommer', '“The lighthouse is still burning.” That sounds like a code word between two people. Who was the voice? Stay awake.'],
    ['wait', 3000],

    // ---------- Kapitel 2 ----------
    ['chapter', 2, 'The Gull'],
    ['ambience', 'wind'],
    ['goal', 'Someone is knocking. Decide whether you let them in.'],
    ['knock', 'moewe'],
    ['join', 'moewe'],
    ['wait', 1500],
    ['say', 'moewe', 'You found the lighthouse. Then listen to me carefully now.'],
    ['goal', 'The Gull does not want to be seen: cameras off.'],
    ['say', 'moewe', 'Cameras first. All of them. I do not want anyone to see whom you are talking to.'],
    ['quiet', 'cam', 'moewe', 'Good. Nobody sees us.', 'One camera is still running. I will wait.'],
    ['goal', 'The Gull only talks when nobody is listening: microphones off.'],
    ['say', 'moewe', 'Now the microphones. I only talk when nobody is listening.'],
    ['quiet', 'mic', 'moewe', 'I was the ninth voice. I was never invited. I only listened to protect Lena.', 'Someone is listening in. Microphones off.'],
    ['quiet', 'mic', 'moewe', 'The lighthouse is still burning meant: she is alive, and she is ready. I got her out that night.', 'Someone is listening in. Microphones off.'],
    ['quiet', 'mic', 'moewe', 'One of the eight betrayed her. And whoever paid him is listening again today.', 'Someone is listening in. Microphones off.'],
    ['quiet', 'mic', 'moewe', 'Lena left a message that night. I am sending it to you. Listen closely. You can talk again.', 'Someone is listening in. Microphones off.'],
    ['unlock', 'mailbox'], ['unlock', 'personalakte'],
    ['say', 'moewe', 'I have to go. The line is not safe.'],
    ['leave', 'moewe'],
    ['goal', 'Mics back on. Find the code for Lena’s locker.'],
    ['solve', 'fach'],
    ['fragment', '⚓', '7'],
    ['chat', 'moewe', 'Locker 17 was not empty. Lena’s notebook. I sent you page 14. You cannot see anything? Then you need a different light.'],
    ['unlock', 'notizbuch'],
    ['wait', 2500],

    // ---------- Kapitel 3 ----------
    ['chapter', 3, 'The Informant'],
    ['ambience', 'hum'],
    ['chat', 'sommer', 'I got Bernard Ahrens’ call records. For Forensics only. He will call you back shortly. Be friendly. For now.', {to: F}],
    ['unlock', 'telefon'], ['unlock', 'waehltoene'], ['unlock', 'dtmf'],
    ['goal', 'Ahrens was on the phone during the meeting. Find out which number he dialed.'],
    ['solve', 'nummer'],
    ['chat', 'sommer', '0 71 – that is the area code of St. Gallen. And Ahrens is calling back right now.'],
    ['goal', 'Bernard Ahrens is calling. Pick up.'],
    ['call', 'bernd', {note: 'Mobile · Munich · calling …', again: 'is calling again. He sounds impatient.'}],
    ['wait', 800],
    ['say', 'bernd', 'Ahrens here. You wrote to me? I do not have much time.'],
    ['goal', 'Interrogate Bernard Ahrens. He is lying. Find the lie and prove it.'],
    ['ask', 'bernd', {prompt: 'What do you ask Bernard Ahrens?', options: [
      {id: 'wo', label: 'Where were you on the evening of 14 November?', say: ['At home in Munich. On the call, like everyone else. Camera off, as always.']},
      {id: 'kamera', label: 'Why was your camera off?', say: ['Source protection. I was in plant security at Velmont for twenty years. If anyone recognizes me there, I am finished.']},
      {id: 'lena', label: 'When did you last speak to Lena?', say: ['The day before. She was nervous. She said someone was following her. I told her to be careful.']},
      {id: 'telefon', label: 'Did you make a phone call during the meeting?', set: {gelogen: true}, say: ['No. I listened. Nothing else. Why do you ask?']},
      {id: 'anklage', pose: 'bernd-accuse', label: 'You kidnapped Lena.', tag: 'accuse', wrong: true, say: ['Excuse me? I warned her! One more sentence like that and I hang up.']},
      {id: 'beweis', pose: 'bernd-proof', label: 'At 21:20 you dialed 071 228 9. A number in St. Gallen.', tag: 'proof', needs: ['nummer', 'gelogen'], set: {bernd_gestanden: true},
        say: ['Where did you get that? … Fine. I made the call.', 'They had given me the number. I was only supposed to report when the meeting was on. I thought it was about money. Not about Lena.']},
      {id: 'notiz', pose: 'bernd-proof', label: 'Lena knew about your call. It is in her notebook.', tag: 'proof', needs: ['bernd_gestanden', 'notizbuch'], set: {bernd_zeuge: true}, end: true,
        say: ['She knew? And still let me talk.', 'The man on the phone called himself only Nine. If you get him, I will testify. In any court.']},
      {id: 'genug', label: 'Thank you. That is enough for us.', tag: 'leave', needs: ['bernd_gestanden'], end: true,
        say: ['Then leave me alone now.']}
    ]}],
    ['say', 'bernd', 'He will know that I talked to you. He always knows everything.'],
    ['leave', 'bernd', 'glitch'],
    ['fragment', '✶', '2'],
    ['wait', 2500],
    ['fx', 'ring'],
    ['chat', 'bernd', 'I sent you a fax. So you know who you are dealing with. I shredded it first. Habit.'],
    ['unlock', 'fax'],
    ['goal', 'Put Ahrens’ shredded fax back together. Who is Nine?'],
    ['solve', 'krell'],
    ['chat', 'sommer', 'Andrew Krell, corporate security Velmont. A professional. If he shows himself, be careful.'],
    ['branch', s => s.flags.bernd_zeuge, 'zeuge'],
    ['chat', 'sommer', 'Ahrens confessed. But we do not have him as a witness. A pity. Maybe he would have said more if he had known what Lena knew.'],
    ['goto', 'k4'],
    ['label', 'zeuge'],
    ['chat', 'sommer', 'Ahrens testifies?! That is worth gold. Good work.'],

    // ---------- Kapitel 4 ----------
    ['label', 'k4'],
    ['wait', 3000],
    ['chapter', 4, 'Participant 9'],
    ['ambience', null],
    ['fx', 'glitch'],
    ['wait', 900],
    ['join', 'neun', 'glitch'],
    ['wait', 1200],
    ['say', 'neun', 'Good evening, {me}. It is {time} where you are. Late for a call.'],
    ['fx', 'mirror', {npc: 'neun', label: 'I SEE YOU'}],
    ['say', 'neun', 'You looked different earlier. Camera on, camera off. I have it all.'],
    ['fx', 'rename', 'SNITCH {n}'],
    ['say', 'neun', 'You are looking for Lena. So am I. Thank you for opening her old line.'],
    ['say', 'neun', 'And go ahead and switch your cameras off. I can still see everything.'],
    ['goal', 'Participant 9 sees you. Cover your cameras with your hand. Keep the camera ON, or he will switch it on himself.'],
    ['quiet', 'covered', 'neun', 'Dark. How brave. I can still hear you.', 'I still see you, {me}.'],
    ['unlock', 'ping'], ['unlock', 'knoten'],
    ['goal', 'Locate Participant 9. Forensics: the i on his tile.'],
    ['solve', 'ping', {npc: 'neun', every: 40000, taunts: [
      'You are slow, {me}.',
      'I am closer to her than you are to me.',
      'Do you actually know who is listening in on you right now?',
      'The Gull did not tell you everything.'
    ]}],
    ['say', 'neun', 'Saint Gall. Well done. Then you also know how close I am to her.'],
    ['fx', 'crash', 4500],
    ['leave', 'neun'],
    ['wait', 5000],
    ['fragment', '△', '4'],
    ['chat', 'sommer', 'St. Gallen?! I have informed the Swiss colleagues. But that takes time. Keep the line open.'],
    ['wait', 3000],

    // ---------- Kapitel 5 ----------
    ['chapter', 5, 'Beacon'],
    ['dark', true],
    ['wait', 1500],
    ['chat', 'sommer', 'Power failure in the whole headquarters! Take the flashlight: move the pointer. Forensics, down to the cellar to the fuse box.'],
    ['unlock', 'sicherungen'], ['unlock', 'stromplan'],
    ['goal', 'Bring the emergency power back: Forensics at the fuse box, Archive with the power plan.'],
    ['solve', 'strom'],
    ['fx', 'flash'],
    ['chat', 'sommer', 'Radio and cameras are running. We keep the light off, that saves emergency power. One moment … someone is coming in.'],
    ['join', 'lena', 'static'],
    ['fx', 'toast', 'Lena Brandt has joined the call. Her microphone sends nothing.'],
    ['unlock', 'morse'], ['unlock', 'licht'],
    ['morse', 'lena', 'SAENTIS', 300],
    ['goal', 'Lena’s microphone is dead, but her lamp is blinking. Read the signal.'],
    ['solve', 'morse'],
    ['morse', null],
    ['fragment', '◯', '1'],
    ['dark', false],
    ['goal', 'Lena’s connection is too weak. Hold it together.'],
    ['hold', {label: 'Stabilize the line to Lena', ms: 3500}],
    ['ambience', 'wind'],
    ['say', 'lena', 'This is Lena. Finally. Please do not hang up.'],
    ['say', 'lena', 'I am in the old weather station below the Säntis. The Gull brought me here three years ago. To where the light is up high.'],
    ['say', 'lena', 'I have the originals of the VX-12 study. And I know who Nine is: the head of security at Velmont. He has been looking for me for three years.'],
    ['say', 'lena', 'You located him in Saint Gall today. That is an hour from here.'],
    ['wait', 1500],

    // ---------- Kapitel 6 ----------
    ['chapter', 6, 'Counter-trace'],
    ['ambience', null],
    ['fx', 'glitch'],
    ['join', 'neun', 'glitch'],
    ['say', 'neun', 'Thank you, Lena. Thank you, {me}. Now I can hear where you are too.'],
    ['lockLeave', true],
    ['unlock', 'notfall'], ['unlock', 'abschaltung'],
    ['chat', 'sommer', 'He is tracing your line back! Emergency shutdown, now! Five digits. The fragments!'],
    ['goal', 'Emergency shutdown! Five digits from your fragments before the trace is complete.'],
    ['timer', 150000, 'Trace-back'],
    ['solve', 'abschaltung', {npc: 'neun', every: 25000, onFail: 'zweite', taunts: [
      'Zurich. Munich. Stuttgart. I am getting closer.',
      'Tick. Tock, {me}.',
      'She is afraid. I can hear it.'
    ]}],
    ['goto', 'geschafft'],

    ['label', 'zweite'],
    ['fx', 'shake'],
    ['join', 'moewe', 'static'],
    ['say', 'moewe', 'I have cut his node in Zurich. You have one minute left. Hurry.'],
    ['leave', 'moewe'],
    ['timer', 75000, 'Last chance'],
    ['solve', 'abschaltung', {npc: 'neun', every: 20000, onFail: 'verloren', taunts: ['The Gull. Of course.', 'Soon.']}],
    ['goto', 'geschafft'],

    ['label', 'verloren'],
    ['say', 'neun', 'Too late. I see her.'],
    ['fx', 'crash', 3000],
    ['ending', 'verloren'],

    ['label', 'geschafft'],
    ['timer', null],
    ['fx', 'flash'],
    ['say', 'neun', 'No. No!'],
    ['leave', 'neun', 'glitch'],
    ['lockLeave', false],
    ['ambience', 'wind'],
    ['wait', 2000],
    ['say', 'lena', 'The line is clean. He does not have me. Not yet.'],
    ['say', 'lena', 'If you publish the originals, everyone knows what Velmont did. But then I am no longer safe anywhere. If you stay silent, I am safe, and it was all for nothing.'],
    ['branch', s => !s.flags.bernd_zeuge, 'wahl'],
    ['say', 'lena', 'And Bernard wants to testify? Then maybe there is a third way.'],
    ['label', 'wahl'],
    ['goal', 'Decide together.'],
    ['vote', {id: 'final', prompt: 'What happens to the originals?', options: [
      {id: 'licht', label: 'Publish', desc: 'The truth comes out. Lena has to disappear again.'},
      {id: 'still', label: 'Stay silent', desc: 'Lena is safe. Velmont carries on.'},
      {id: 'leuchtturm', label: 'Publish, with Bernard as witness', desc: 'Only possible because Ahrens testifies.', if: s => !!s.flags.bernd_zeuge}
    ]}],
    ['ending', s => s.results.final]
  ]
}
