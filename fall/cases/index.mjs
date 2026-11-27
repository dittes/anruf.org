// Alle Fälle. Jeder Fall liegt in einem eigenen Ordner mit story.mjs und audio/.
// Neuer Fall: Ordner anlegen, hier eintragen, dann `node fall/tools/seal.mjs` und `fall/tools/voices.sh` laufen lassen.

export const CASES = [
  {
    id: 'nachtschicht', file: 'AZ 0-NS-1411', title: 'Der neunte Anrufer', accent: '#ffb23f',
    tagline: 'Eine Journalistin verschwand nach einem Videoanruf. In der Aufnahme sind acht Personen, aber neun Stimmen. Heute Nacht ruft ihr Konto wieder an.',
    players: '2–4', duration: '90–120 min', difficulty: 3,
    cover: {silhouette: true, glow: '#ff3b30', hair: {style: 'hood'}, bg: ['#3a1010', '#050505']},
    load: () => import('./nachtschicht/story.mjs')
  },
  {
    id: 'funkstille', file: 'Einsatz KÜ-2611', title: 'Funkstille', accent: '#4fd1c5',
    tagline: 'Orkan über der Nordsee. Die Forschungsstation auf Hallig Graudel meldet: alles in Ordnung. Dann meldet sie es noch einmal. Wortgleich.',
    players: '2–4', duration: '45–60 min', difficulty: 2,
    cover: {skin: '#e7b99c', hair: {style: 'curly', color: '#7a4a2a'}, extras: ['freckles'], top: {style: 'hoodie', color: '#d9a21b', accent: '#333'}, mood: 'worried', bg: ['#244a55', '#071418']},
    load: () => import('./funkstille/story.mjs')
  },
  {
    id: 'onboarding', file: 'Personalnr. LL-0451', title: 'Erster Arbeitstag', accent: '#8ea8ff',
    tagline: 'Willkommen bei Lumen Labs! Euer Onboarding macht LUNA, die freundliche HR-Assistenz. Sie möchte nur ein paar Fotos. Und eure Stimmen.',
    players: '2–4', duration: '45–60 min', difficulty: 2,
    cover: {skin: '#f2d6c6', hair: {style: 'bob', color: '#cfc8ea'}, eyes: '#5a7cff', top: {style: 'uniform', color: '#e9e9f2', accent: '#8ea8ff', badge: '#8ea8ff'}, mood: 'smile', bg: ['#3a4a86', '#0b0f22']},
    load: () => import('./onboarding/story.mjs')
  }
]
