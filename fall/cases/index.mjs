// Alle Fälle. Jeder Fall liegt in einem eigenen Ordner mit story.mjs und audio/.
// Neuer Fall: Ordner anlegen, hier eintragen, dann `node fall/tools/seal.mjs` und `fall/tools/voices.sh` laufen lassen.

export const CASES = [
  {
    id: 'nachtschicht', file: 'AZ 0-NS-1411', title: 'Der neunte Anrufer', accent: '#ffb23f',
    tagline: 'Eine Journalistin verschwand nach einem Videoanruf. In der Aufnahme sind acht Personen, aber neun Stimmen. Heute Nacht ruft ihr Konto wieder an.',
    players: '2–4', duration: '90–120 min', difficulty: 3,
    cover: {photo: 'neun', silhouette: true, glow: '#ff3b30', hair: {style: 'hood'}, scene: 'void'},
    load: () => import('./nachtschicht/story.mjs')
  },
  {
    id: 'funkstille', file: 'Einsatz KÜ-2611', title: 'Funkstille', accent: '#4fd1c5',
    tagline: 'Orkan über der Nordsee. Die Forschungsstation auf Hallig Graudel meldet: alles in Ordnung. Dann meldet sie es noch einmal. Wortgleich.',
    players: '2–4', duration: '45–60 min', difficulty: 2,
    cover: {photo: 'tom', skin: '#e7b99c', age: 0, jaw: .3, eyes: '#4a7a5a', hair: {style: 'curly', color: '#7a4a2a'}, extras: ['freckles'], top: {style: 'hoodie', color: '#d9a21b', accent: '#333'}, mood: 'worried', look: [1, .5], scene: 'storm'},
    load: () => import('./funkstille/story.mjs')
  },
  {
    id: 'onboarding', file: 'Personalnr. LL-0451', title: 'Erster Arbeitstag', accent: '#8ea8ff',
    tagline: 'Willkommen bei Lumen Labs! Euer Onboarding macht LUNA, die freundliche HR-Assistenz. Sie möchte nur ein paar Fotos. Und eure Stimmen.',
    players: '2–4', duration: '45–60 min', difficulty: 2,
    cover: {photo: 'luna', skin: '#f2d6c6', fem: true, jaw: 0, age: 0, hair: {style: 'bob', color: '#9d8fe0'}, eyes: '#5a7cff', lip: '#c45a7a', top: {style: 'blouse', color: '#e9e9f2', accent: '#8ea8ff'}, extras: ['lanyard'], lanyard: '#8ea8ff', mood: 'smile', scene: 'studio', light: '#c8d2ff'},
    load: () => import('./onboarding/story.mjs')
  },
  {
    id: 'erbe', file: 'Nachlass 0-HW-0303', title: 'Das Haus am Wehr', accent: '#c9a46a', solo: true,
    tagline: 'Ein Notar ruft an: Du hast ein Haus geerbt, von einer Großtante, die du nie getroffen hast. Unterschreib bis Mitternacht, sagt er. Ein Schlüsseldienst steht schon vor der Tür.',
    players: '1 (Solo)', duration: '45–60 min', difficulty: 2,
    cover: {photo: 'haus', scene: 'storm'},
    load: () => import('./erbe/story.mjs')
  }
]
