// Gezeichnete Profilbilder für die Figuren (statt Kamera). Ein Steckbrief → SVG.
// Augen blinzeln per CSS (.eyes), der Mund öffnet sich mit der Lautstärke der Stimme (CSS-Variable --m am Kachel-Element).
//
// spec = {
//   skin, hair: {style, color}, eyes, beard, glasses, top: {style, color, accent}, bg: [innen, außen],
//   age: 0|1|2, extras: ['headset','earring','scarf','freckles','scar','mole'], mood: 'neutral'|'smile'|'worried'|'stern',
//   silhouette: false, glow: null|'#f00', jaw: 0..1
// }
// Frisuren: short, slick, bald, long, bob, bun, curly, beanie, hood, cap, buzz
// Bart: none, stubble, full, mustache, goatee · Brille: none, round, square, aviator · Oberteil: suit, shirt, hoodie, sweater, coat, uniform, jacket

let uid = 0
const shade = (hex, f) => {
  const n = parseInt(hex.slice(1), 16)
  const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f))))
  return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('')
}

export function portrait(spec = {}) {
  const id = 'p' + (++uid)
  const S = {
    skin: '#d9a98a', eyes: '#3b2a1e', beard: 'none', glasses: 'none', age: 1, extras: [], mood: 'neutral', jaw: .5,
    hair: {style: 'short', color: '#2b221c'}, top: {style: 'shirt', color: '#39424e', accent: '#d8d4cc'}, bg: ['#2d3644', '#0d1015'],
    ...spec
  }
  const sil = !!S.silhouette
  const skin = sil ? '#0a0a0c' : S.skin
  const skinD = sil ? '#0a0a0c' : shade(S.skin, -.18)
  const skinL = sil ? '#0a0a0c' : shade(S.skin, .12)
  const hairC = sil ? '#060607' : S.hair.color
  const topC = sil ? '#08080a' : S.top.color
  const acc = sil ? '#0b0b0d' : (S.top.accent || '#ddd')
  const line = sil ? 'transparent' : shade(S.skin, -.45)
  const w = 30 + S.jaw * 6  // halbe Kieferbreite unten
  const head = `M70 90 C70 58 130 58 130 90 L130 106 C130 ${126 + S.jaw * 4} ${100 + w * .55} 147 100 147 C${100 - w * .55} 147 70 ${126 + S.jaw * 4} 70 106 Z`
  const out = []
  // Hintergrund mit unscharfen Lichtern (wie ein Zimmer hinter der Person)
  out.push(`<defs>
    <radialGradient id="${id}bg" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="${S.bg[0]}"/><stop offset="1" stop-color="${S.bg[1]}"/></radialGradient>
    <linearGradient id="${id}sh" x1="0" x2="1"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset=".95" stop-color="#000" stop-opacity=".22"/></linearGradient>
    <clipPath id="${id}face"><path d="${head}"/></clipPath>
    <filter id="${id}blur"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="${id}grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .09 0"/></filter>
    <radialGradient id="${id}vig" cx="50%" cy="45%" r="70%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".65"/></radialGradient>
    <linearGradient id="${id}rim" x1="0" x2="1"><stop offset="0" stop-color="${S.glow || '#9fb4ff'}" stop-opacity=".0"/><stop offset="1" stop-color="${S.glow || '#9fb4ff'}" stop-opacity=".55"/></linearGradient>
  </defs>`)
  out.push(`<rect x="-60" y="0" width="320" height="200" fill="url(#${id}bg)"/>`)
  if (!sil) out.push(`<g filter="url(#${id}blur)" opacity=".5">
    <circle cx="22" cy="42" r="10" fill="${shade(S.bg[0], .45)}"/><circle cx="178" cy="30" r="14" fill="${shade(S.bg[0], .3)}"/>
    <circle cx="160" cy="78" r="6" fill="${shade(S.bg[0], .6)}"/><rect x="-40" y="120" width="70" height="4" fill="${shade(S.bg[0], .25)}"/>
    <rect x="150" y="112" width="90" height="3" fill="${shade(S.bg[0], .2)}"/></g>`)

  const hs = S.hair.style
  // Haare hinten (lange Frisuren, Kapuze)
  if (hs === 'long') out.push(`<path d="M60 92 C52 46 148 46 140 92 L146 164 C128 172 72 172 54 164 Z" fill="${hairC}"/>`)
  if (hs === 'bob') out.push(`<path d="M62 92 C56 48 144 48 138 92 L140 140 C128 146 72 146 60 140 Z" fill="${hairC}"/>`)
  if (hs === 'hood') out.push(`<path d="M50 200 L54 104 C54 40 146 40 146 104 L150 200 Z" fill="${shade(topC, -.1)}"/>`)

  // Oberkörper
  out.push(`<path d="M24 200 C30 166 58 154 86 151 L114 151 C142 154 170 166 176 200 Z" fill="${topC}"/>`)
  out.push(`<path d="M88 128 L112 128 L114 158 C106 164 94 164 86 158 Z" fill="${skinD}"/>`)
  const ts = S.top.style
  if (ts === 'suit') out.push(`<path d="M86 151 L100 186 L114 151 L106 151 L100 162 L94 151 Z" fill="${acc}"/>
    <path d="M97 160 L103 160 L105 196 L100 200 L95 196 Z" fill="${S.top.tie || '#7a2630'}"/>
    <path d="M86 151 L70 160 L92 200 L100 186 Z M114 151 L130 160 L108 200 L100 186 Z" fill="${shade(topC, -.25)}"/>`)
  if (ts === 'shirt') out.push(`<path d="M86 151 L94 166 L100 156 L106 166 L114 151 L106 149 L100 156 L94 149 Z" fill="${shade(topC, .18)}"/>`)
  if (ts === 'hoodie') out.push(`<path d="M74 156 C84 172 116 172 126 156 C118 150 82 150 74 156 Z" fill="${shade(topC, -.2)}"/>
    <path d="M94 168 L92 190 M106 168 L108 190" stroke="${acc}" stroke-width="2" stroke-linecap="round"/>`)
  if (ts === 'sweater') out.push(`<path d="M82 152 C90 162 110 162 118 152" fill="none" stroke="${shade(topC, -.25)}" stroke-width="5"/>`)
  if (ts === 'coat') out.push(`<path d="M80 150 L92 142 L100 170 L108 142 L120 150 L112 200 L88 200 Z" fill="${shade(topC, -.22)}"/>
    <path d="M100 170 L100 200" stroke="${shade(topC, -.4)}" stroke-width="2"/>`)
  if (ts === 'jacket') out.push(`<path d="M86 151 L96 178 L100 160 L104 178 L114 151 Z" fill="${acc}"/>
    <path d="M100 160 L100 200" stroke="${shade(topC, -.35)}" stroke-width="2" stroke-dasharray="3 3"/>`)
  if (ts === 'uniform') out.push(`<path d="M86 151 L100 172 L114 151 Z" fill="${acc}"/>
    <rect x="128" y="172" width="16" height="10" rx="2" fill="${S.top.badge || '#c9a33a'}"/>
    <path d="M44 172 L62 166" stroke="${S.top.badge || '#c9a33a'}" stroke-width="3"/>`)
  if (S.extras.includes('scarf')) out.push(`<path d="M80 146 C90 160 110 160 120 146 L124 156 C110 172 90 172 76 156 Z" fill="${S.scarf || '#8a3b2e'}"/><path d="M110 160 L116 192 L106 192 Z" fill="${shade(S.scarf || '#8a3b2e', -.15)}"/>`)

  // Ohren und Kopf
  out.push(`<ellipse cx="69" cy="104" rx="6" ry="10" fill="${skinD}"/><ellipse cx="131" cy="104" rx="6" ry="10" fill="${skinD}"/>`)
  out.push(`<path d="${head}" fill="${skin}"/>`)
  if (!sil) out.push(`<g clip-path="url(#${id}face)">
      <rect x="60" y="40" width="80" height="120" fill="url(#${id}sh)"/>
      <ellipse cx="82" cy="116" rx="9" ry="6" fill="${S.blush || '#e07a6a'}" opacity="${S.age < 2 ? .12 : .06}"/>
      <ellipse cx="86" cy="78" rx="16" ry="8" fill="${skinL}" opacity=".35"/></g>`)
  if (sil) out.push(`<path d="${head}" fill="none" stroke="url(#${id}rim)" stroke-width="2"/>`)

  if (!sil) {
    const ex = 87, ex2 = 113, ey = 101
    // Falten
    if (S.age >= 2) out.push(`<path d="M80 108 q5 3 10 0 M110 108 q5 3 10 0 M88 80 q12 -3 24 0" fill="none" stroke="${line}" stroke-width=".8" opacity=".5"/>`)
    if (S.extras.includes('freckles')) out.push(`<g fill="${shade(S.skin, -.35)}" opacity=".5">${[[82, 112], [86, 115], [90, 112], [110, 112], [114, 115], [118, 112], [95, 110], [105, 110]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".9"/>`).join('')}</g>`)
    if (S.extras.includes('scar')) out.push(`<path d="M118 86 L124 104" stroke="${shade(S.skin, -.3)}" stroke-width="1.4" stroke-linecap="round"/>`)
    if (S.extras.includes('mole')) out.push(`<circle cx="112" cy="122" r="1.3" fill="${shade(S.skin, -.5)}"/>`)
    // Augen (blinzeln)
    const lookDown = S.mood === 'worried' ? 1 : 0
    out.push(`<g class="eyes" style="transform-origin:100px ${ey}px">
      <ellipse cx="${ex}" cy="${ey}" rx="6" ry="3.6" fill="#f3efe8"/><ellipse cx="${ex2}" cy="${ey}" rx="6" ry="3.6" fill="#f3efe8"/>
      <circle cx="${ex + .6}" cy="${ey + lookDown * .6}" r="2.7" fill="${S.eyes}"/><circle cx="${ex2 + .6}" cy="${ey + lookDown * .6}" r="2.7" fill="${S.eyes}"/>
      <circle cx="${ex + .6}" cy="${ey + lookDown * .6}" r="1.2" fill="#0b0b0b"/><circle cx="${ex2 + .6}" cy="${ey + lookDown * .6}" r="1.2" fill="#0b0b0b"/>
      <circle cx="${ex + 1.6}" cy="${ey - 1}" r=".7" fill="#fff"/><circle cx="${ex2 + 1.6}" cy="${ey - 1}" r=".7" fill="#fff"/>
      <path d="M${ex - 6} ${ey - .5} Q${ex} ${ey - 5.2} ${ex + 6} ${ey - .5} M${ex2 - 6} ${ey - .5} Q${ex2} ${ey - 5.2} ${ex2 + 6} ${ey - .5}" fill="none" stroke="${line}" stroke-width="1.1"/>
    </g>`)
    // Brauen
    const bt = {neutral: [0, 0], smile: [-1, -1], worried: [2, -2], stern: [-2, 2]}[S.mood] || [0, 0]
    const bc = S.brows || hairC
    out.push(`<path d="M79 ${92 + bt[0]} Q87 ${88 + bt[0] * .2} 95 ${92 + bt[1]}" stroke="${bc}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M105 ${92 + bt[1]} Q113 ${88 + bt[0] * .2} 121 ${92 + bt[0]}" stroke="${bc}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`)
    // Nase
    out.push(`<path d="M101 104 Q98 116 96 118 Q100 121 104 118" fill="none" stroke="${line}" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>`)
    // Bart unter dem Mund
    if (S.beard === 'full') out.push(`<path d="M72 110 C72 140 88 152 100 152 C112 152 128 140 128 110 C124 124 116 132 100 133 C84 132 76 124 72 110 Z" fill="${S.beardColor || hairC}"/>`)
    if (S.beard === 'stubble') out.push(`<path d="M72 112 C72 140 88 150 100 150 C112 150 128 140 128 112 C124 126 116 134 100 134 C84 134 76 126 72 112 Z" fill="${S.beardColor || hairC}" opacity=".28"/>`)
    if (S.beard === 'goatee') out.push(`<path d="M92 133 C92 146 108 146 108 133 C104 136 96 136 92 133 Z" fill="${S.beardColor || hairC}"/>`)
    // Mund: Lippe + Öffnung, die mit --m aufgeht
    const smile = {smile: 3, worried: -1.5, stern: -1, neutral: .6}[S.mood] ?? .6
    out.push(`<g class="mouth" style="transform-origin:100px 128px"><ellipse cx="100" cy="128.5" rx="6.5" ry="4.5" fill="#3a1414"/><ellipse cx="100" cy="131" rx="4" ry="1.6" fill="#b04a4a" opacity=".7"/></g>`)
    out.push(`<path d="M91 127 Q100 ${127 + smile} 109 127" fill="none" stroke="${shade(S.lip || '#9a4f4a', -.1)}" stroke-width="1.8" stroke-linecap="round"/>`)
    if (S.beard === 'mustache' || S.beard === 'full' || S.beard === 'goatee') out.push(`<path d="M88 125 C92 119 98 121 100 123 C102 121 108 119 112 125 C108 124 104 125 100 126 C96 125 92 124 88 125 Z" fill="${S.beardColor || hairC}"/>`)
  } else if (S.glow) {
    out.push(`<g class="eyes" style="transform-origin:100px 101px"><ellipse cx="87" cy="101" rx="4" ry="1.6" fill="${S.glow}"/><ellipse cx="113" cy="101" rx="4" ry="1.6" fill="${S.glow}"/></g>
      <g filter="url(#${id}blur)"><ellipse cx="87" cy="101" rx="6" ry="3" fill="${S.glow}" opacity=".7"/><ellipse cx="113" cy="101" rx="6" ry="3" fill="${S.glow}" opacity=".7"/></g>`)
  }

  // Haare vorne
  const H = {
    short: `M67 94 C62 50 138 50 133 94 C130 76 116 66 100 68 C84 66 70 76 67 94 Z`,
    slick: `M67 92 C64 48 138 48 133 92 C128 70 98 62 84 70 C76 74 70 82 67 92 Z`,
    buzz: `M69 90 C66 56 134 56 131 90 C126 74 112 68 100 68 C88 68 74 74 69 90 Z`,
    bald: `M68 100 C66 90 68 84 70 82 L72 98 Z M132 100 C134 90 132 84 130 82 L128 98 Z`,
    long: `M64 104 C58 50 142 50 136 104 C132 80 120 70 104 74 C96 66 80 70 72 80 C68 88 66 96 64 104 Z`,
    bob: `M64 112 C56 50 144 50 136 112 C132 82 118 72 100 76 C84 70 70 80 64 112 Z`,
    bun: `M67 94 C62 50 138 50 133 94 C130 76 116 66 100 68 C84 66 70 76 67 94 Z M88 52 a12 11 0 1 0 24 0 a12 11 0 1 0 -24 0`,
    curly: [...Array(11)].map((_, i) => { const a = Math.PI * (1.02 + i * .096); return `M${100 + Math.cos(a) * 33} ${86 + Math.sin(a) * 30} a9 9 0 1 0 .1 0` }).join(' '),
    beanie: `M64 92 C60 40 140 40 136 92 Z`,
    cap: `M66 88 C64 52 136 52 134 88 Z M60 86 L150 84 L150 92 L64 92 Z`,
    hood: `M58 100 C58 48 142 48 142 100 C134 70 116 62 100 62 C84 62 66 70 58 100 Z`
  }[hs]
  if (H) out.push(`<path d="${H}" fill="${hs === 'beanie' ? (S.hair.hat || '#6b2f2a') : hs === 'cap' ? (S.hair.hat || '#2a3a52') : hs === 'hood' ? shade(topC, -.1) : hairC}"/>`)
  if (hs === 'beanie') out.push(`<rect x="62" y="80" width="76" height="12" rx="4" fill="${shade(S.hair.hat || '#6b2f2a', -.2)}"/>`)
  if (hs === 'curly') out.push(`<path d="M67 92 C64 58 136 58 133 92 C126 76 112 70 100 70 C88 70 74 76 67 92 Z" fill="${hairC}"/>`)
  if (S.age >= 2 && !sil && hs !== 'bald' && hs !== 'beanie' && hs !== 'cap' && hs !== 'hood') out.push(`<path d="M70 86 C76 70 90 64 100 66" stroke="${shade(hairC, .5)}" stroke-width="2" fill="none" opacity=".6"/>`)

  // Brille
  if (!sil && S.glasses !== 'none') {
    const fr = S.glassColor || '#1b1b1b'
    if (S.glasses === 'round') out.push(`<g fill="${'#bcd'}" fill-opacity=".08" stroke="${fr}" stroke-width="1.8"><circle cx="87" cy="101" r="9"/><circle cx="113" cy="101" r="9"/></g><path d="M96 100 Q100 97 104 100 M78 99 L70 97 M122 99 L130 97" stroke="${fr}" stroke-width="1.6" fill="none"/>`)
    if (S.glasses === 'square') out.push(`<g fill="#bcd" fill-opacity=".08" stroke="${fr}" stroke-width="2"><rect x="76" y="94" width="21" height="14" rx="3"/><rect x="103" y="94" width="21" height="14" rx="3"/></g><path d="M97 100 L103 100 M76 99 L70 97 M124 99 L130 97" stroke="${fr}" stroke-width="1.8"/>`)
    if (S.glasses === 'aviator') out.push(`<g fill="#3a4a3a" fill-opacity=".45" stroke="${fr}" stroke-width="1.4"><path d="M76 96 L97 96 L95 108 Q86 114 78 106 Z"/><path d="M103 96 L124 96 L122 106 Q114 114 105 108 Z"/></g><path d="M97 97 L103 97" stroke="${fr}" stroke-width="1.4"/>`)
    out.push(`<path d="M80 96 l4 -2 M106 96 l4 -2" stroke="#fff" stroke-width="1.2" opacity=".5"/>`)
  }
  // Extras
  if (!sil && S.extras.includes('earring')) out.push(`<circle cx="69" cy="116" r="2.2" fill="${S.earring || '#d8b45a'}"/><circle cx="131" cy="116" r="2.2" fill="${S.earring || '#d8b45a'}"/>`)
  if (S.extras.includes('headset')) out.push(`<path d="M64 102 C60 40 140 40 136 102" fill="none" stroke="#151515" stroke-width="4"/>
    <rect x="58" y="94" width="10" height="18" rx="4" fill="#202020"/><rect x="132" y="94" width="10" height="18" rx="4" fill="#202020"/>
    <path d="M63 110 C66 128 78 134 90 132" fill="none" stroke="#202020" stroke-width="2.4"/><circle cx="91" cy="132" r="3" fill="#333"/>`)

  out.push(`<rect x="-60" y="0" width="320" height="200" fill="url(#${id}vig)"/>`)
  out.push(`<rect x="-60" y="0" width="320" height="200" filter="url(#${id}grain)" opacity=".9"/>`)
  return `<svg class="portrait" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${out.join('')}</svg>`
}
