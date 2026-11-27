// Gezeichnete Profilbilder der Figuren (statt Kamera). Steckbrief → SVG.
// Licht von links oben, Hautschattierung, Augen mit Lidern und Iris, Lippen, Haarsträhnen, Hintergrund-Szene mit Tiefenunschärfe.
// Animation per CSS: Augen blinzeln (.eyes), Kopf wiegt sich leicht (.head), Mund folgt der Stimme (--m am Kachel-Element).
//
// spec = {
//   skin, eyes, lip, fem: bool, age: 0|1|2, jaw: 0..1, mood: neutral|smile|worried|stern|smirk, look: [dx, dy],
//   hair: {style, color, hat}, beard: none|stubble|full|mustache|goatee, beardColor, brows,
//   glasses: none|round|square|aviator|half, glassColor,
//   top: {style: suit|shirt|hoodie|sweater|coat|uniform|jacket|turtleneck|blouse, color, accent, tie, badge},
//   extras: ['headset','earring','scarf','freckles','scar','mole','bandage','pen','lanyard'],
//   scene: office|police|night|radio|storm|server|hut|studio|lisbon|void|plain, light: Farbe des Bildschirmlichts,
//   bg: [innen, außen] (für plain), silhouette: bool, glow: Augenfarbe für Silhouetten
// }
// Frisuren: short, slick, buzz, bald, long, bob, bun, ponytail, curly, beanie, hood, cap

let uid = 0
const clamp = v => Math.max(0, Math.min(255, Math.round(v)))
export const shade = (hex, f) => {
  const n = parseInt(hex.slice(1), 16)
  const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => clamp(f < 0 ? v * (1 + f) : v + (255 - v) * f))
  return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('')
}
const mix = (a, b, t) => {
  const x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16)
  const c = [16, 8, 0].map(s => clamp(((x >> s) & 255) * (1 - t) + ((y >> s) & 255) * t))
  return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('')
}
// kleiner deterministischer Zufall für Szenen
const rnd = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647

/* ---------- Hintergründe ---------- */
function scene(name, id, S) {
  const r = rnd(7 + name.length * 31)
  const wide = (x, y, w, h, fill, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`
  switch (name) {
    case 'police': {  // Büro mit Jalousien und Pinnwand mit roten Fäden
      let s = wide(-60, 0, 320, 200, '#2a2e35')
      for (let y = 6; y < 120; y += 7) s += wide(118, y, 120, 4, '#a9b4c2', 'opacity=".35"')
      s += wide(-40, 26, 110, 80, '#6b5338') + wide(-36, 30, 102, 72, '#8a6c48')
      const pins = [[-20, 40], [10, 52], [40, 38], [-8, 80], [28, 86], [52, 70]]
      pins.forEach(([x, y], i) => { s += wide(x - 9, y - 7, 18, 14, ['#e8e4d8', '#d8cfa8', '#f0eee6'][i % 3], `transform="rotate(${(r() - .5) * 14} ${x} ${y})"`) })
      s += `<path d="M-20 40 L10 52 L40 38 M10 52 L28 86 L52 70 M-8 80 L28 86" stroke="#c0262d" stroke-width="1.2" fill="none"/>`
      s += pins.map(([x, y]) => `<circle cx="${x}" cy="${y - 5}" r="1.8" fill="#d33"/>`).join('')
      s += wide(-60, 150, 320, 50, '#1d2026')
      return s
    }
    case 'office': {
      let s = wide(-60, 0, 320, 200, '#3a3f48')
      for (let row = 0; row < 3; row++) {
        const y = 18 + row * 36
        s += wide(-50, y + 30, 120, 4, '#5a4a36')
        for (let x = -48; x < 66; x += 4 + Math.floor(r() * 4)) s += wide(x, y + 30 - (18 + r() * 10), 3 + r() * 3, 30, ['#7a3a32', '#2f5470', '#c79a3a', '#3e6b4a', '#d8d2c4', '#5a3e66'][Math.floor(r() * 6)])
      }
      s += `<ellipse cx="190" cy="120" rx="22" ry="30" fill="#2f5a3a"/><rect x="180" y="140" width="20" height="24" fill="#8a5a3a"/>`
      s += wide(140, 30, 40, 30, '#d8d2c4') + wide(143, 33, 34, 24, '#6b8aa8')
      return s
    }
    case 'night': {  // Fenster mit Stadtlichtern und Regen
      let s = wide(-60, 0, 320, 200, '#141a24') + wide(110, 10, 140, 120, '#0a0e18')
      for (let i = 0; i < 60; i++) s += `<circle cx="${112 + r() * 136}" cy="${70 + r() * 58}" r="${.6 + r() * 1.4}" fill="${['#ffcf7a', '#ffe6a8', '#9fd0ff', '#ff9a6a'][Math.floor(r() * 4)]}" opacity="${.4 + r() * .6}"/>`
      for (let i = 0; i < 30; i++) { const x = 112 + r() * 136, y = 12 + r() * 110; s += `<path d="M${x} ${y} l-2 9" stroke="#9fb4d0" stroke-width=".6" opacity=".35"/>` }
      s += wide(106, 6, 4, 128, '#2a2f38') + wide(176, 6, 4, 128, '#2a2f38') + wide(106, 66, 148, 4, '#2a2f38')
      s += `<circle cx="-20" cy="60" r="26" fill="#ffd28a" opacity=".25"/>`
      return s
    }
    case 'radio': {  // Funkraum: Geräte mit LEDs und Skalen
      let s = wide(-60, 0, 320, 200, '#1e2a30')
      for (let i = 0; i < 4; i++) {
        const x = -50 + i * 70 + (i > 1 ? 80 : 0), y = 30 + (i % 2) * 40
        if (x > 70 && x < 120) continue
        s += wide(x, y, 56, 30, '#2e3a40', 'rx="3"') + wide(x + 4, y + 4, 30, 10, '#0d1a12')
        s += `<path d="M${x + 6} ${y + 10} q6 -6 12 0 t12 0" stroke="#3ddc84" stroke-width="1" fill="none" opacity=".8"/>`
        for (let k = 0; k < 4; k++) s += `<circle cx="${x + 40 + (k % 2) * 8}" cy="${y + 8 + Math.floor(k / 2) * 10}" r="2" fill="${['#ff3b30', '#3ddc84', '#ffb23f', '#3ddc84'][k]}"/>`
        s += `<circle cx="${x + 14}" cy="${y + 22}" r="4" fill="#556"/><circle cx="${x + 26}" cy="${y + 22}" r="4" fill="#556"/>`
      }
      s += wide(-60, 150, 320, 50, '#141c20')
      return s
    }
    case 'storm': {  // Bullauge mit Sturm und Leuchtturm
      let s = wide(-60, 0, 320, 200, '#2a3236')
      s += `<circle cx="180" cy="62" r="46" fill="#3a4448"/><circle cx="180" cy="62" r="40" fill="#1a2328"/>`
      s += `<path d="M140 80 Q160 70 180 78 T222 74 L222 102 L140 102 Z" fill="#26343a"/>`
      s += `<rect x="196" y="40" width="6" height="34" fill="#cfcfcf"/><path d="M199 44 L250 30 L250 52 Z" fill="#fff3b0" opacity=".25"/>`
      for (let i = 0; i < 18; i++) { const x = 144 + r() * 72, y = 26 + r() * 70; s += `<path d="M${x} ${y} l-4 8" stroke="#aac" stroke-width=".7" opacity=".5"/>` }
      s += `<circle cx="180" cy="62" r="43" fill="none" stroke="#8a7a5a" stroke-width="5"/>`
      for (let a = 0; a < 8; a++) s += `<circle cx="${180 + Math.cos(a * Math.PI / 4) * 43}" cy="${62 + Math.sin(a * Math.PI / 4) * 43}" r="1.8" fill="#5a4a3a"/>`
      s += wide(-50, 40, 50, 70, '#ffcf3a', 'opacity=".18"')
      return s
    }
    case 'server': {
      let s = wide(-60, 0, 320, 200, '#0e1422')
      for (let c = 0; c < 5; c++) {
        const x = -55 + c * 68
        if (x > 60 && x < 110) continue
        s += wide(x, 0, 46, 200, '#161e30') + wide(x + 2, 0, 42, 200, '#1a2338')
        for (let y = 8; y < 190; y += 9) { s += wide(x + 4, y, 38, 6, '#212b44'); if (r() > .3) s += `<circle cx="${x + 8 + r() * 30}" cy="${y + 3}" r="1" fill="${r() > .7 ? '#ff6a6a' : r() > .5 ? '#7aa8ff' : '#6aff9a'}"/>` }
      }
      return s
    }
    case 'hut': {  // Holzwand, Fenster mit Bergen und Schnee
      let s = wide(-60, 0, 320, 200, '#4a3424')
      for (let x = -60; x < 260; x += 16) s += wide(x, 0, 1.5, 200, '#2e2016', 'opacity=".6"')
      s += wide(124, 18, 92, 70, '#c9d6e4') + `<path d="M124 70 L150 44 L166 58 L186 34 L216 66 L216 88 L124 88 Z" fill="#7d8ea3"/><path d="M180 40 L186 34 L192 41 L186 44 Z" fill="#fff"/>`
      for (let i = 0; i < 25; i++) s += `<circle cx="${126 + r() * 88}" cy="${20 + r() * 66}" r=".9" fill="#fff" opacity=".8"/>`
      s += `<rect x="124" y="18" width="92" height="70" fill="none" stroke="#2e2016" stroke-width="4"/><path d="M170 18 L170 88 M124 53 L216 53" stroke="#2e2016" stroke-width="3"/>`
      s += `<circle cx="-30" cy="140" r="30" fill="#ff9a3a" opacity=".25"/>`
      return s
    }
    case 'studio': {  // heller Start-up-Look mit Logo
      let s = wide(-60, 0, 320, 200, '#2c3a70')
      s += `<circle cx="176" cy="60" r="30" fill="none" stroke="#a8b8ff" stroke-width="6" opacity=".5"/><circle cx="176" cy="60" r="12" fill="#a8b8ff" opacity=".5"/>`
      s += `<rect x="-40" y="120" width="80" height="60" rx="6" fill="#3a4a86"/><ellipse cx="0" cy="110" rx="18" ry="24" fill="#3e8a5a"/>`
      for (let i = 0; i < 8; i++) s += `<circle cx="${r() * 240 - 30}" cy="${r() * 100}" r="${4 + r() * 8}" fill="#fff" opacity="${.05 + r() * .08}"/>`
      return s
    }
    case 'lisbon': {  // Balkon, warmes Abendlicht, Dächer
      let s = wide(-60, 0, 320, 200, '#e8a86a') + `<circle cx="180" cy="50" r="22" fill="#fff2c4" opacity=".8"/>`
      s += `<path d="M-60 120 L-20 96 L10 110 L40 90 L70 104 L120 92 L150 108 L190 94 L260 112 L260 200 L-60 200 Z" fill="#b8643a"/>`
      for (let i = 0; i < 14; i++) s += wide(-50 + i * 22, 110 + r() * 10, 8, 10, '#f3e2c0', 'opacity=".8"')
      s += `<path d="M-60 150 L260 150" stroke="#2a1a10" stroke-width="3"/>` + [...Array(16)].map((_, i) => `<path d="M${-55 + i * 20} 150 L${-55 + i * 20} 200" stroke="#2a1a10" stroke-width="2"/>`).join('')
      return s
    }
    case 'void': {
      let s = wide(-60, 0, 320, 200, '#050505')
      for (let i = 0; i < 40; i++) s += wide(r() * 320 - 60, r() * 200, 1 + r() * 30, 1, '#ff2a2a', `opacity="${r() * .25}"`)
      return s
    }
    case 'dark': return wide(-60, 0, 320, 200, '#05070a') + `<circle cx="100" cy="60" r="60" fill="#1b2a36" opacity=".5"/>`
    default: return wide(-60, 0, 320, 200, `url(#${id}bg)`)
  }
}

/* ---------- Frisuren ---------- */
function hairBack(st, c, S, id) {
  const d = shade(c, -.25)
  switch (st) {
    case 'long': return `<path d="M58 96 C52 46 148 46 142 96 L148 172 C128 180 72 180 52 172 Z" fill="${d}"/>`
    case 'bob': return `<path d="M61 98 C55 48 145 48 139 98 L142 142 C130 150 70 150 58 142 Z" fill="${d}"/>`
    case 'ponytail': return `<path d="M128 80 C150 90 152 130 140 160 C136 140 132 120 124 100 Z" fill="${d}"/>`
    case 'bun': return `<circle cx="100" cy="50" r="15" fill="${c}"/><path d="M90 46 q10 -8 20 0" stroke="${shade(c, .25)}" stroke-width="1.4" fill="none"/>`
    case 'curly': return [...Array(9)].map((_, i) => { const a = Math.PI * (1.05 + i * .1); return `<circle cx="${100 + Math.cos(a) * 36}" cy="${94 + Math.sin(a) * 38}" r="11" fill="${d}"/>` }).join('')
    case 'hood': return `<path d="M44 200 L48 102 C48 34 152 34 152 102 L156 200 Z" fill="${shade(S.topC, -.15)}"/><path d="M56 200 L60 106 C60 52 140 52 140 106 L144 200 Z" fill="${shade(S.topC, -.45)}"/>`
    default: return ''
  }
}
function hairFront(st, c, S) {
  const hl = shade(c, .28), dk = shade(c, -.2)
  const strands = (ps, w = 1) => ps.map(p => `<path d="${p}" stroke="${hl}" stroke-width="${w}" fill="none" stroke-linecap="round" opacity=".55"/>`).join('')
  switch (st) {
    case 'short': return `<path d="M67.5 90 C66.5 99 67.5 106 70 111 L72.5 111 C72 102 73 95 75.5 88 Z M132.5 90 C133.5 99 132.5 106 130 111 L127.5 111 C128 102 127 95 124.5 88 Z" fill="${c}"/>` + `<path d="M67 98 C62 64 78 48 100 48 C122 48 138 62 133 98 C131 84 127 74 119 69 C109 75 90 73 80 71 C73 78 69 87 67 98 Z" fill="${c}"/>` +
      strands(['M80 58 Q92 52 108 54', 'M84 64 Q98 58 116 62', 'M118 58 Q126 64 129 76'])
    case 'slick': return `<path d="M67.5 90 C66.5 99 67.5 106 70 111 L72.5 111 C72 102 73 95 75.5 88 Z M132.5 90 C133.5 99 132.5 106 130 111 L127.5 111 C128 102 127 95 124.5 88 Z" fill="${c}"/>` + `<path d="M67 94 C64 60 82 46 102 46 C123 46 136 60 133 92 C128 74 116 63 100 63 C85 63 73 74 67 94 Z" fill="${c}"/><path d="M90 48 Q86 56 80 64" stroke="${dk}" stroke-width="1.5" fill="none"/>` +
      strands(['M94 50 Q112 50 126 64', 'M96 56 Q114 56 128 72', 'M88 54 Q78 60 72 76'])
    case 'buzz': return `<path d="M70 92 C69 64 84 52 100 52 C116 52 131 64 130 92 C125 76 115 66 100 66 C85 66 75 76 70 92 Z" fill="${c}" opacity=".85"/>`
    case 'bald': return `<path d="M68 106 C66 94 69 86 73 82 L75 100 Z M132 106 C134 94 131 86 127 82 L125 100 Z" fill="${c}"/><ellipse cx="90" cy="66" rx="14" ry="6" fill="#fff" opacity=".18"/>`
    case 'long': return `<path d="M65 112 C58 30 142 30 135 112 C132 84 120 72 104 74 C96 68 82 70 74 80 C69 88 66 100 65 112 Z" fill="${c}"/>` +
      strands(['M74 80 Q66 110 64 140', 'M128 84 Q136 110 138 146', 'M100 62 Q86 64 78 76', 'M104 62 Q120 66 128 80'])
    case 'bob': return `<path d="M64 112 C58 32 142 32 136 112 L134 92 C126 84 112 81 100 83 C86 81 74 85 66 92 Z" fill="${c}"/>` +
      strands(['M80 60 Q100 52 122 60', 'M74 70 Q96 64 120 70', 'M86 84 Q90 76 98 72'])
    case 'bun': case 'ponytail': return `<path d="M68 96 C64 62 80 50 100 50 C120 50 136 62 132 96 C128 76 116 64 100 64 C84 64 72 76 68 96 Z" fill="${c}"/>` +
      strands(['M80 62 Q100 54 120 62', 'M76 72 Q90 62 102 62', 'M124 70 Q118 62 104 60'])
    case 'curly': return [...Array(12)].map((_, i) => { const a = Math.PI * (1.03 + i * .085); return `<circle cx="${100 + Math.cos(a) * 32}" cy="${90 + Math.sin(a) * 32}" r="9" fill="${i % 2 ? c : shade(c, .08)}"/><path d="M${100 + Math.cos(a) * 32 - 4} ${90 + Math.sin(a) * 32} q4 -5 8 0" stroke="${hl}" stroke-width=".9" fill="none" opacity=".6"/>` }).join('') +
      `<path d="M68 94 C64 40 136 40 132 94 C126 78 114 72 100 72 C86 72 74 78 68 94 Z" fill="${c}"/>`
    case 'beanie': {
      const hat = S.hair.hat || '#6b2f2a'
      return `<path d="M70 100 L68 112 M130 100 L132 112" stroke="${c}" stroke-width="6" stroke-linecap="round"/>` +
        `<path d="M63 92 C58 38 142 38 137 92 Z" fill="${hat}"/>` + [...Array(9)].map((_, i) => `<path d="M${72 + i * 7} 52 L${70 + i * 7.4} 82" stroke="${shade(hat, -.25)}" stroke-width="1.3" opacity=".6"/>`).join('') +
        `<rect x="60" y="80" width="80" height="14" rx="5" fill="${shade(hat, -.15)}"/>` + [...Array(14)].map((_, i) => `<path d="M${63 + i * 5.5} 81 v12" stroke="${shade(hat, -.35)}" stroke-width="1"/>`).join('')
    }
    case 'cap': {
      const hat = S.hair.hat || '#1b2a3a'
      return `<path d="M66 90 C64 36 136 36 134 90 Z" fill="${hat}"/><path d="M60 88 C90 80 130 82 152 92 C140 98 90 96 64 96 Z" fill="${shade(hat, -.25)}"/>` +
        `<path d="M100 54 L100 88" stroke="${shade(hat, .15)}" stroke-width="1"/><rect x="88" y="66" width="24" height="10" rx="2" fill="${S.hair.badge || '#c9a33a'}" opacity=".9"/>`
    }
    case 'hood': return `<path d="M56 108 C52 28 148 28 144 108 C136 70 118 58 100 58 C82 58 64 70 56 108 Z" fill="${shade(S.topC, -.1)}"/>`
    default: return ''
  }
}

/* ---------- Kleidung ---------- */
function clothes(st, c, acc, S) {
  const dk = shade(c, -.3), lt = shade(c, .15)
  const body = `<path d="M22 200 C26 170 52 154 84 150 L116 150 C148 154 174 170 178 200 Z" fill="${c}"/>` +
    `<path d="M40 200 C44 182 52 172 62 166" stroke="${dk}" stroke-width="2" fill="none" opacity=".6"/><path d="M160 200 C156 182 148 172 138 166" stroke="${dk}" stroke-width="2" fill="none" opacity=".6"/>` +
    `<path d="M22 200 C26 170 52 154 84 150 L90 150 C64 160 46 176 40 200 Z" fill="${lt}" opacity=".35"/>`
  switch (st) {
    case 'suit': return body + `<path d="M86 150 L100 186 L114 150 L106 149 L100 160 L94 149 Z" fill="${acc}"/>` +
      `<path d="M97 160 L103 160 L106 198 L100 204 L94 198 Z" fill="${S.top.tie || '#7a2630'}"/><path d="M97 160 L103 160 L101.5 166 L98.5 166 Z" fill="${shade(S.top.tie || '#7a2630', -.3)}"/>` +
      `<path d="M86 150 L68 160 L92 204 L100 186 Z M114 150 L132 160 L108 204 L100 186 Z" fill="${dk}"/><path d="M68 160 L80 170 M132 160 L120 170" stroke="${shade(c, -.5)}" stroke-width="1"/>`
    case 'shirt': return body + `<path d="M86 150 L93 168 L100 156 L107 168 L114 150 L106 147 L100 156 L94 147 Z" fill="${lt}"/><circle cx="100" cy="172" r="1.3" fill="${dk}"/><circle cx="100" cy="186" r="1.3" fill="${dk}"/>`
    case 'blouse': return body + `<path d="M84 150 Q100 172 116 150 Q100 162 84 150 Z" fill="${shade(c, -.15)}"/><path d="M90 152 Q100 166 110 152" stroke="${acc}" stroke-width="1.2" fill="none"/>`
    case 'hoodie': return body + `<path d="M72 156 C82 174 118 174 128 156 C120 148 80 148 72 156 Z" fill="${dk}"/><path d="M80 158 C88 168 112 168 120 158" stroke="${shade(c, -.5)}" stroke-width="1.5" fill="none"/>` +
      `<path d="M93 168 L91 192 M107 168 L109 192" stroke="${acc}" stroke-width="2" stroke-linecap="round"/><circle cx="91" cy="193" r="1.5" fill="${acc}"/><circle cx="109" cy="193" r="1.5" fill="${acc}"/>`
    case 'sweater': return body + `<path d="M82 151 C90 161 110 161 118 151" fill="none" stroke="${dk}" stroke-width="5"/>` + [...Array(6)].map((_, i) => `<path d="M${50 + i * 20} 180 l4 6 l4 -6" stroke="${dk}" stroke-width="1" fill="none" opacity=".5"/>`).join('')
    case 'turtleneck': return body + `<path d="M84 138 L116 138 L118 156 C110 160 90 160 82 156 Z" fill="${c}"/>` + [...Array(4)].map((_, i) => `<path d="M85 ${142 + i * 4} Q100 ${144 + i * 4} 115 ${142 + i * 4}" stroke="${dk}" stroke-width=".8" fill="none"/>`).join('')
    case 'coat': return body + `<path d="M78 146 L92 140 L100 170 L108 140 L122 146 L114 204 L86 204 Z" fill="${dk}"/><path d="M100 170 L100 204" stroke="${shade(c, -.5)}" stroke-width="2"/>` +
      `<circle cx="94" cy="182" r="2" fill="${shade(c, -.5)}"/><circle cx="94" cy="195" r="2" fill="${shade(c, -.5)}"/><path d="M76 146 L92 140 L88 156 Z M124 146 L108 140 L112 156 Z" fill="${shade(c, .1)}"/>`
    case 'jacket': return body + `<path d="M86 150 L95 178 L100 160 L105 178 L114 150 Z" fill="${acc}"/><path d="M100 160 L100 204" stroke="${dk}" stroke-width="2" stroke-dasharray="3 3"/>` +
      `<path d="M84 150 L72 158 L90 176 Z M116 150 L128 158 L110 176 Z" fill="${shade(c, -.15)}"/><rect x="118" y="176" width="16" height="3" fill="${dk}"/>`
    case 'uniform': return body + `<path d="M86 150 L100 172 L114 150 Z" fill="${acc}"/><rect x="126" y="172" width="18" height="10" rx="2" fill="${S.top.badge || '#c9a33a'}"/>` +
      `<path d="M128 175 h14 M128 179 h10" stroke="${shade(S.top.badge || '#c9a33a', -.4)}" stroke-width="1"/><path d="M42 172 L64 164" stroke="${S.top.badge || '#c9a33a'}" stroke-width="3"/>`
    default: return body
  }
}

export function portrait(spec = {}) {
  const id = 'p' + (++uid)
  const S = {
    skin: '#d9a98a', eyes: '#3b2a1e', beard: 'none', glasses: 'none', age: 1, extras: [], mood: 'neutral', jaw: .5, fem: false, look: [0, 0],
    hair: {style: 'short', color: '#2b221c'}, top: {style: 'shirt', color: '#39424e', accent: '#d8d4cc'}, bg: ['#2d3644', '#0d1015'],
    scene: 'plain', light: null,
    ...spec
  }
  S.hair = {style: 'short', color: '#2b221c', ...S.hair}
  S.top = {style: 'shirt', color: '#39424e', accent: '#d8d4cc', ...S.top}
  const sil = !!S.silhouette
  S.topC = sil ? '#0a0a0c' : S.top.color
  const skin = S.skin, sD = shade(skin, -.22), sDD = shade(skin, -.4), sL = shade(skin, .16)
  const hairC = S.hair.color
  const line = shade(skin, -.55)
  const lip = S.lip || mix(skin, S.fem ? '#b0444c' : '#9a4f4a', S.fem ? .6 : .45)
  const light = S.light || {police: '#9fc4ff', night: '#7aa8ff', radio: '#6affb8', storm: '#9fc4ff', server: '#7aa8ff', hut: '#ffb26a', studio: '#c8d2ff', lisbon: '#ffc48a', office: '#ffe2b0'}[S.scene] || '#ffffff'
  const j = S.jaw, fem = S.fem
  const cx = fem ? 3 : 0
  const head = `M100 56 C122 56 131 72 131 94 C131 106 ${129 - cx} 116 ${125 - cx + j * 3} 127 C${119 - cx} ${140 - j * 2} ${109 - cx * .3} ${149 + j} 100 ${149 + j} C${91 + cx * .3} ${149 + j} ${81 + cx} ${140 - j * 2} ${75 + cx - j * 3} 127 C${71 + cx} 116 69 106 69 94 C69 72 78 56 100 56 Z`
  const o = []
  o.push(`<defs>
    <radialGradient id="${id}bg" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="${S.bg[0]}"/><stop offset="1" stop-color="${S.bg[1]}"/></radialGradient>
    <radialGradient id="${id}sk" cx="38%" cy="36%" r="70%"><stop offset="0" stop-color="${sL}"/><stop offset=".55" stop-color="${skin}"/><stop offset="1" stop-color="${sD}"/></radialGradient>
    <linearGradient id="${id}sh" x1="0" x2="1"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>
    <linearGradient id="${id}lt" x1="0" x2="1" y1="0" y2=".4"><stop offset="0" stop-color="${light}" stop-opacity=".35"/><stop offset=".6" stop-color="${light}" stop-opacity="0"/></linearGradient>
    <radialGradient id="${id}ir" cx="45%" cy="40%" r="60%"><stop offset="0" stop-color="${shade(S.eyes, .45)}"/><stop offset=".7" stop-color="${S.eyes}"/><stop offset="1" stop-color="${shade(S.eyes, -.5)}"/></radialGradient>
    <radialGradient id="${id}neck" cx="50%" cy="0%" r="80%"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <clipPath id="${id}face"><path d="${head}"/></clipPath>
    <filter id="${id}dof" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.4"/></filter>
    <filter id="${id}soft"><feGaussianBlur stdDeviation="1.2"/></filter>
    <filter id="${id}glow"><feGaussianBlur stdDeviation="3"/></filter>
    <filter id="${id}grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .08 0"/></filter>
    <radialGradient id="${id}vig" cx="50%" cy="45%" r="72%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".62"/></radialGradient>
    <linearGradient id="${id}rim" x1="0" x2="1"><stop offset="0" stop-color="${S.glow || '#9fb4ff'}" stop-opacity=".0"/><stop offset="1" stop-color="${S.glow || '#9fb4ff'}" stop-opacity=".6"/></linearGradient>
  </defs>`)
  // Szene im Hintergrund, unscharf wie bei einer Webcam
  o.push(`<g filter="url(#${id}dof)" opacity="${sil ? .45 : 1}">${scene(S.scene, id, S)}</g>`)

  o.push(`<g class="head" style="transform-origin:100px 190px">`)
  o.push(hairBack(S.hair.style, sil ? '#060607' : hairC, S, id))
  // Oberkörper
  o.push(sil ? `<path d="M22 200 C26 170 52 154 84 150 L116 150 C148 154 174 170 178 200 Z" fill="#08080a"/>` : clothes(S.top.style, S.top.color, S.top.accent, S))
  // Hals mit Schatten unter dem Kinn
  o.push(`<path d="M86 128 L114 128 L115 158 C108 165 92 165 85 158 Z" fill="${sil ? '#0a0a0c' : sD}"/>`)
  if (!sil) o.push(`<ellipse cx="100" cy="136" rx="18" ry="12" fill="url(#${id}neck)"/>`)
  if (!sil && S.extras.includes('scarf')) o.push(`<path d="M78 146 C90 162 110 162 122 146 L126 158 C112 174 88 174 74 158 Z" fill="${S.scarf || '#8a3b2e'}"/><path d="M110 162 L118 196 L106 196 Z" fill="${shade(S.scarf || '#8a3b2e', -.15)}"/>` + [...Array(5)].map((_, i) => `<path d="M${80 + i * 9} 152 l3 10" stroke="${shade(S.scarf || '#8a3b2e', -.3)}" stroke-width="1"/>`).join(''))
  if (!sil && S.extras.includes('lanyard')) o.push(`<path d="M86 150 L96 186 M114 150 L104 186" stroke="${S.lanyard || '#8ea8ff'}" stroke-width="2.4"/><rect x="92" y="184" width="16" height="12" rx="1.5" fill="#f2f2f6"/><rect x="94" y="186" width="5" height="6" fill="${S.lanyard || '#8ea8ff'}"/>`)

  // Ohren
  const ear = x => `<path d="M${x} 94 C${x + (x < 100 ? -9 : 9)} 90 ${x + (x < 100 ? -10 : 10)} 110 ${x + (x < 100 ? -3 : 3)} 116 C${x + (x < 100 ? -1 : 1)} 118 ${x} 116 ${x} 112 Z" fill="${sil ? '#0a0a0c' : sD}"/>` +
    (sil ? '' : `<path d="M${x + (x < 100 ? -2 : 2)} 98 C${x + (x < 100 ? -6 : 6)} 98 ${x + (x < 100 ? -6 : 6)} 108 ${x + (x < 100 ? -2 : 2)} 111" stroke="${sDD}" stroke-width="1" fill="none" opacity=".6"/>`)
  o.push(ear(70), ear(130))
  // Kopf
  o.push(`<path d="${head}" fill="${sil ? '#0a0a0c' : `url(#${id}sk)`}"/>`)
  if (sil) {
    o.push(`<path d="${head}" fill="none" stroke="url(#${id}rim)" stroke-width="2"/>`)
    if (S.glow) o.push(`<g class="eyes" style="transform-origin:100px 101px"><ellipse cx="87" cy="101" rx="4.2" ry="1.6" fill="${S.glow}"/><ellipse cx="113" cy="101" rx="4.2" ry="1.6" fill="${S.glow}"/></g>
      <g filter="url(#${id}glow)"><ellipse cx="87" cy="101" rx="7" ry="3.5" fill="${S.glow}" opacity=".75"/><ellipse cx="113" cy="101" rx="7" ry="3.5" fill="${S.glow}" opacity=".75"/></g>`)
  } else {
    // Licht und Schatten auf dem Gesicht
    o.push(`<g clip-path="url(#${id}face)">
      <rect x="60" y="40" width="80" height="120" fill="url(#${id}sh)"/>
      <rect x="60" y="40" width="80" height="120" fill="url(#${id}lt)" style="mix-blend-mode:soft-light"/>
      <ellipse cx="86" cy="98" rx="11" ry="6" fill="${sDD}" opacity=".18" filter="url(#${id}soft)"/>
      <ellipse cx="114" cy="98" rx="11" ry="6" fill="${sDD}" opacity=".22" filter="url(#${id}soft)"/>
      <ellipse cx="81" cy="117" rx="8" ry="5" fill="${S.blush || '#e0706a'}" opacity="${fem ? .22 : .1}" filter="url(#${id}soft)"/>
      <ellipse cx="119" cy="117" rx="8" ry="5" fill="${S.blush || '#e0706a'}" opacity="${fem ? .18 : .08}" filter="url(#${id}soft)"/>
      <path d="M78 128 C84 140 94 147 100 148" stroke="${sDD}" stroke-width="3" opacity=".12" fill="none" filter="url(#${id}soft)"/>
      <ellipse cx="88" cy="72" rx="14" ry="7" fill="#fff" opacity=".12" filter="url(#${id}soft)"/>
    </g>`)
    const [lx, ly] = S.look
    const ex = 87, ex2 = 113, ey = 101
    // Falten, Sommersprossen, Narben
    if (S.age >= 2) o.push(`<g stroke="${line}" stroke-width=".7" fill="none" opacity=".45"><path d="M80 106 q6 3 12 0 M108 106 q6 3 12 0"/><path d="M86 78 q14 -3 28 0 M88 82 q12 -2 24 0"/><path d="M85 120 q-3 7 1 13 M115 120 q3 7 -1 13"/></g>`)
    else if (S.age === 1 && !fem) o.push(`<path d="M86 120 q-2 6 1 11 M114 120 q2 6 -1 11" stroke="${line}" stroke-width=".6" fill="none" opacity=".14"/>`)
    if (S.extras.includes('freckles')) o.push(`<g fill="${shade(skin, -.38)}" opacity=".55">${[[80, 112], [84, 115], [88, 111], [91, 114], [109, 114], [112, 111], [116, 115], [120, 112], [96, 109], [104, 109], [86, 118], [114, 118]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".85"/>`).join('')}</g>`)
    if (S.extras.includes('scar')) o.push(`<path d="M118 84 L124 104" stroke="${shade(skin, -.3)}" stroke-width="1.6" stroke-linecap="round"/><path d="M119 90 l3 -1 M121 96 l3 -1" stroke="${shade(skin, -.3)}" stroke-width=".8"/>`)
    if (S.extras.includes('mole')) o.push(`<circle cx="113" cy="121" r="1.3" fill="${shade(skin, -.55)}"/>`)
    if (S.extras.includes('bandage')) o.push(`<rect x="114" y="74" width="14" height="6" rx="2" fill="#efe3cf" transform="rotate(-18 121 77)"/>`)
    // Augen
    o.push(`<g class="eyes" style="transform-origin:100px ${ey}px">`)
    for (const x of [ex, ex2]) {
      o.push(`<path d="M${x - 7} ${ey} Q${x} ${ey - 6} ${x + 7} ${ey} Q${x} ${ey + 4.2} ${x - 7} ${ey} Z" fill="#f4f0ea"/>
        <circle cx="${x + .5 + lx}" cy="${ey + .2 + ly}" r="3.2" fill="url(#${id}ir)"/>
        <circle cx="${x + .5 + lx}" cy="${ey + .2 + ly}" r="1.35" fill="#0b0b0b"/>
        <circle cx="${x + 1.6 + lx}" cy="${ey - .9 + ly}" r=".85" fill="#fff"/>
        <path d="M${x - 7.4} ${ey + .2} Q${x} ${ey - 6.6} ${x + 7.4} ${ey - .2}" stroke="${shade(line, -.2)}" stroke-width="${fem ? 1.7 : 1.3}" fill="none" stroke-linecap="round"/>
        <path d="M${x - 5} ${ey + 2.8} Q${x} ${ey + 4.6} ${x + 5} ${ey + 2.8}" stroke="${line}" stroke-width=".5" fill="none" opacity=".5"/>`)
      if (fem) o.push(`<path d="M${x + (x < 100 ? -7 : 7)} ${ey - .3} l${x < 100 ? -2 : 2} -1.6" stroke="${shade(line, -.3)}" stroke-width="1"/>`)
      if (S.age >= 2) o.push(`<path d="M${x - 5} ${ey + 5.5} Q${x} ${ey + 8} ${x + 5} ${ey + 5.5}" stroke="${line}" stroke-width=".6" fill="none" opacity=".4"/>`)
    }
    o.push(`</g>`)
    // Augenbrauen
    const bt = {neutral: [0, 0], smile: [-1, -1], worried: [2.4, -2.2], stern: [-1.5, 2.2], smirk: [0, -1.5]}[S.mood] || [0, 0]
    const bc = S.brows || shade(hairC, -.1), bw = fem ? .75 : 1
    o.push(`<path d="M78 ${93 + bt[0]} Q86 ${87.5 + bt[0] * .3} 95 ${91 + bt[1]} Q86 ${89 + bt[0] * .3 + bw * 1.6} 78 ${94.5 + bt[0]} Z" fill="${bc}"/>
      <path d="M122 ${93 + bt[0]} Q114 ${87.5 + bt[0] * .3} 105 ${91 + bt[1] + (S.mood === 'smirk' ? -2 : 0)} Q114 ${89 + bt[0] * .3 + bw * 1.6} 122 ${94.5 + bt[0]} Z" fill="${bc}"/>`)
    // Nase
    o.push(`<path d="M97 102 C96 108 95 112 94.5 115" stroke="${sDD}" stroke-width="2.4" fill="none" opacity=".14" stroke-linecap="round" filter="url(#${id}soft)"/>
      <path d="M103.5 103 C104 108 105 112 105.5 115" stroke="${sL}" stroke-width="1.4" fill="none" opacity=".35"/>
      <path d="M94 117.5 Q96.5 120.6 100 120.3 Q103.5 120.6 106 117.5" stroke="${sDD}" stroke-width="1.1" fill="none" opacity=".55"/>
      <ellipse cx="96.5" cy="118.6" rx="1.6" ry=".9" fill="${sDD}" opacity=".8"/><ellipse cx="103.5" cy="118.6" rx="1.6" ry=".9" fill="${sDD}" opacity=".8"/>
      <ellipse cx="100" cy="116" rx="2.2" ry="1.4" fill="#fff" opacity=".18"/>
      <path d="M100 121 L100 124.5" stroke="${sDD}" stroke-width="2" opacity=".18"/>`)
    // Bart unten
    const bcol = S.beardColor || hairC
    if (S.beard === 'full') o.push(`<path d="M71 106 C71 140 88 155 100 155 C112 155 129 140 129 106 C126 122 118 134 100 135 C82 134 74 122 71 106 Z" fill="${bcol}"/>` + [...Array(10)].map((_, i) => `<path d="M${76 + i * 5} ${126 + Math.abs(4.5 - i) * -1.5} l${(i - 4.5) * .3} 6" stroke="${shade(bcol, .25)}" stroke-width=".7" opacity=".6"/>`).join(''))
    if (S.beard === 'stubble') o.push(`<path d="M72 110 C72 140 88 152 100 152 C112 152 128 140 128 110 C125 126 117 135 100 136 C83 135 75 126 72 110 Z" fill="${bcol}" opacity=".26"/>`)
    if (S.beard === 'goatee') o.push(`<path d="M91 133 C91 147 109 147 109 133 C105 136 95 136 91 133 Z" fill="${bcol}"/>`)
    // Mund: Öffnung (geht mit --m auf), Unterlippe rutscht mit, Oberlippe
    const sm = {smile: 2.6, worried: -1.6, stern: -1.1, smirk: 1.2, neutral: .5}[S.mood] ?? .5
    o.push(`<g class="mouth" style="transform-origin:100px 127.5px"><path d="M91 127.5 Q100 ${126.5} 109 127.5 Q100 135 91 127.5 Z" fill="#2a0e10"/><path d="M93 127.6 Q100 127 107 127.6 L106 129 Q100 128.4 94 129 Z" fill="#efe9e0"/></g>`)
    o.push(`<g class="lowlip"><path d="M90.5 ${127.3} Q100 ${132.6} 109.5 ${127.3} Q100 ${129.4} 90.5 127.3 Z" fill="${lip}"/><ellipse cx="100" cy="130.2" rx="3.6" ry=".8" fill="#fff" opacity=".22"/></g>`)
    o.push(`<path d="M${90 - sm * .4} ${127 - sm} Q94 124.2 100 125.4 Q106 124.2 ${110 + sm * .4} ${127 - sm} Q100 128 ${90 - sm * .4} ${127 - sm} Z" fill="${shade(lip, -.2)}"/>`)
    if (S.mood === 'smirk') o.push(`<path d="M109 126 q2 -1 3 -3" stroke="${sDD}" stroke-width=".8" fill="none"/>`)
    if (['mustache', 'full', 'goatee'].includes(S.beard)) o.push(`<path d="M87 125 C91 118 98 120 100 122.4 C102 120 109 118 113 125 C108 123.6 104 124.2 100 125 C96 124.2 92 123.6 87 125 Z" fill="${bcol}"/>`)
  }

  // Haare vorne
  o.push(hairFront(S.hair.style, sil ? '#060607' : hairC, S))
  if (S.age >= 2 && !sil && !['bald', 'beanie', 'cap', 'hood', 'buzz'].includes(S.hair.style)) o.push(`<path d="M72 84 C78 68 90 60 100 60 M128 84 C124 70 114 62 104 61" stroke="${shade(hairC, .55)}" stroke-width="1.6" fill="none" opacity=".55"/>`)

  // Brille
  if (!sil && S.glasses !== 'none') {
    const fr = S.glassColor || '#1b1b1b'
    if (S.glasses === 'round') o.push(`<g fill="#cde" fill-opacity=".08" stroke="${fr}" stroke-width="1.8"><circle cx="87" cy="101" r="9.4"/><circle cx="113" cy="101" r="9.4"/></g><path d="M96.4 100 Q100 97 103.6 100 M77.6 99 L70 96 M122.4 99 L130 96" stroke="${fr}" stroke-width="1.6" fill="none"/>`)
    if (S.glasses === 'square') o.push(`<g fill="#cde" fill-opacity=".08" stroke="${fr}" stroke-width="2.2"><rect x="76" y="94" width="22" height="14.5" rx="3"/><rect x="102" y="94" width="22" height="14.5" rx="3"/></g><path d="M98 99.5 L102 99.5 M76 98 L70 96 M124 98 L130 96" stroke="${fr}" stroke-width="2"/>`)
    if (S.glasses === 'half') o.push(`<path d="M76 101 L98 101 L96 108 Q87 112 78 108 Z M102 101 L124 101 L122 108 Q113 112 104 108 Z" fill="#cde" fill-opacity=".1" stroke="${fr}" stroke-width="1.5"/><path d="M98 101 L102 101" stroke="${fr}" stroke-width="1.5"/>`)
    if (S.glasses === 'aviator') o.push(`<g fill="#2a3a2a" fill-opacity=".5" stroke="${fr}" stroke-width="1.4"><path d="M75 96 L98 96 L96 108 Q86 115 78 107 Z"/><path d="M102 96 L125 96 L122 107 Q114 115 104 108 Z"/></g><path d="M98 97 L102 97 M75 97 L70 96 M125 97 L130 96" stroke="${fr}" stroke-width="1.4"/>`)
    o.push(`<path d="M80 96 l5 -2 M106 96 l5 -2" stroke="#fff" stroke-width="1.3" opacity=".5"/><rect x="76" y="94" width="48" height="16" fill="${light}" opacity=".06"/>`)
  }
  if (!sil && S.extras.includes('earring')) o.push(`<circle cx="66" cy="117" r="2.2" fill="${S.earring || '#d8b45a'}"/><circle cx="134" cy="117" r="2.2" fill="${S.earring || '#d8b45a'}"/><circle cx="65.4" cy="116.3" r=".7" fill="#fff" opacity=".7"/>`)
  if (S.extras.includes('headset')) o.push(`<path d="M63 104 C58 38 142 38 137 104" fill="none" stroke="#151515" stroke-width="4.5"/>
    <rect x="57" y="94" width="11" height="20" rx="5" fill="#202020"/><rect x="132" y="94" width="11" height="20" rx="5" fill="#202020"/>
    <path d="M62 112 C65 130 78 136 90 133" fill="none" stroke="#202020" stroke-width="2.4"/><rect x="88" y="130" width="7" height="5" rx="2.5" fill="#333"/>`)
  if (S.extras.includes('pen')) o.push(`<path d="M128 84 L140 70" stroke="#2a4a8a" stroke-width="2.5" stroke-linecap="round"/>`)
  o.push(`</g>`)

  // Bildschirmlicht von vorn, Vignette, Korn
  if (!sil) o.push(`<rect x="-60" y="0" width="320" height="200" fill="${light}" opacity=".05" style="mix-blend-mode:screen"/>`)
  o.push(`<rect x="-60" y="0" width="320" height="200" fill="url(#${id}vig)"/>`)
  o.push(`<rect x="-60" y="0" width="320" height="200" filter="url(#${id}grain)"/>`)
  return `<svg class="portrait" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${o.join('')}</svg>`
}
