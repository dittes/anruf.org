// Alle Fälle. Jeder Fall liegt in einem eigenen Ordner mit story.mjs und audio/.
// Neuer Fall: Ordner anlegen, hier eintragen, dann `node fall/tools/seal.mjs` und `fall/tools/voices.sh` laufen lassen.

export const CASES = [
  {
    id: 'nachtschicht', file: 'AZ 0-NS-1411', title: 'Der neunte Anrufer', accent: '#ffb23f',
    tagline: 'Eine Journalistin verschwand nach einem Videoanruf. In der Aufnahme sind acht Personen, aber neun Stimmen. Heute Nacht ruft ihr Konto wieder an.',
    players: '2–4', duration: '90–120 min', difficulty: 3,
    cover: {photo: 'neun', silhouette: true, glow: '#ff3b30', hair: {style: 'hood'}, scene: 'void'},
    load: () => import('./nachtschicht/story.mjs'),
    loadEn: () => import('./nachtschicht/story.en.mjs'),
    en: {file: 'File 0-NS-1411', title: 'The Ninth Caller', tagline: 'A journalist vanished after a video call. The recording has eight people on it, but nine voices. Tonight her account is calling again.', players: '2–4', duration: '90–120 min'}
  },
  {
    id: 'funkstille', file: 'Einsatz KÜ-2611', title: 'Funkstille', accent: '#4fd1c5',
    tagline: 'Orkan über der Nordsee. Die Forschungsstation auf Hallig Graudel meldet: alles in Ordnung. Dann meldet sie es noch einmal. Wortgleich.',
    players: '2–4', duration: '45–60 min', difficulty: 2,
    cover: {photo: 'tom', skin: '#e7b99c', age: 0, jaw: .3, eyes: '#4a7a5a', hair: {style: 'curly', color: '#7a4a2a'}, extras: ['freckles'], top: {style: 'hoodie', color: '#d9a21b', accent: '#333'}, mood: 'worried', look: [1, .5], scene: 'storm'},
    load: () => import('./funkstille/story.mjs'),
    loadEn: () => import('./funkstille/story.en.mjs'),
    en: {file: 'Incident CC-2611', title: 'Radio Silence', tagline: 'Storm over the North Sea. The research station on Graudel Hallig reports: all is well. Then it reports it again. Word for word.', players: '2–4', duration: '45–60 min'}
  },
  {
    id: 'onboarding', file: 'Personalnr. LL-0451', title: 'Erster Arbeitstag', accent: '#8ea8ff',
    tagline: 'Willkommen bei Lumen Labs! Euer Onboarding macht LUNA, die freundliche HR-Assistenz. Sie möchte nur ein paar Fotos. Und eure Stimmen.',
    players: '2–4', duration: '45–60 min', difficulty: 2,
    cover: {photo: 'luna', skin: '#f2d6c6', fem: true, jaw: 0, age: 0, hair: {style: 'bob', color: '#9d8fe0'}, eyes: '#5a7cff', lip: '#c45a7a', top: {style: 'blouse', color: '#e9e9f2', accent: '#8ea8ff'}, extras: ['lanyard'], lanyard: '#8ea8ff', mood: 'smile', scene: 'studio', light: '#c8d2ff'},
    load: () => import('./onboarding/story.mjs'),
    loadEn: () => import('./onboarding/story.en.mjs'),
    en: {file: 'Staff no. LL-0451', title: 'First Day', tagline: 'Welcome to Lumen Labs! Your onboarding is run by LUNA, the friendly HR assistant. She only wants a few photos. And your voices.', players: '2–4', duration: '45–60 min'}
  },
  {
    id: 'zuschlag', file: 'Los 1 · AZ 0-ZS-1664', title: 'Zuschlag', accent: '#e3c27a',
    tagline: 'Ein gestohlenes Gemälde wird heute Nacht versteigert, per Videoanruf an anonyme Bieter. Ihr seid Bieter 7. Ihr habt kein Geld. Ihr habt nur Fragen.',
    players: '2–4', duration: '50–70 min', difficulty: 2,
    cover: {photo: 'blanc', silhouette: true, glow: '#e3c27a', scene: 'office'},
    load: () => import('./zuschlag/story.mjs'),
    loadEn: () => import('./zuschlag/story.en.mjs'),
    en: {file: 'Lot 1 · Ref. 0-ZS-1664', title: 'Hammer Price', tagline: 'A stolen painting is being auctioned tonight, by video call, to anonymous bidders. You are Bidder 7. You have no money. You only have questions.', players: '2–4', duration: '50–70 min'}
  },
  {
    id: 'erbe', file: 'Nachlass 0-HW-0303', title: 'Das Haus am Wehr', accent: '#c9a46a', solo: true,
    tagline: 'Ein Notar ruft an: Du hast ein Haus geerbt, von einer Großtante, die du nie getroffen hast. Unterschreib bis Mitternacht, sagt er. Ein Schlüsseldienst steht schon vor der Tür.',
    players: '1 (Solo)', duration: '45–60 min', difficulty: 2,
    cover: {photo: 'haus', scene: 'storm'},
    load: () => import('./erbe/story.mjs'),
    loadEn: () => import('./erbe/story.en.mjs'),
    en: {file: 'Estate 0-HW-0303', title: 'The House by the Weir', tagline: 'A notary calls: you have inherited a house from a great-aunt you never met. Sign by midnight, he says. A locksmith is already standing at the door.', players: '1 (solo)', duration: '45–60 min'}
  },
  {
    id: 'nachtprogramm', file: 'Sendeprotokoll 0-NP-0300', title: 'Nachtprogramm', accent: '#ff5d73', solo: true,
    tagline: 'Drei Uhr nachts, du allein in der Regie eines Lokalradios. Eine fremde Stimme übernimmt eure Frequenz und liest Zahlen vor. Sie ruft jemanden, der seit 35 Jahren schweigt.',
    players: '1 (Solo)', duration: '60–90 min', difficulty: 3,
    cover: {photo: 'jule', scene: 'radio'},
    load: () => import('./nachtprogramm/story.mjs'),
    loadEn: () => import('./nachtprogramm/story.en.mjs'),
    en: {file: 'Broadcast log 0-NP-0300', title: 'Night Programme', tagline: 'Three in the morning, you alone in the control room of a local radio station. A strange voice takes over your frequency and reads out numbers. It is calling someone who has been silent for 35 years.', players: '1 (solo)', duration: '60–90 min'}
  }
]
