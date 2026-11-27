// Rhubarb cue pairs [centiseconds, shape, ...] use the clock of the playing audio.
export function cueAt(cues, seconds) {
  let lo = 0, hi = cues.length / 2
  const at = seconds * 100
  while (lo < hi) {
    const mid = (lo + hi) >>> 1
    if (cues[mid * 2] <= at) lo = mid + 1
    else hi = mid
  }
  return lo ? cues[lo * 2 - 1] : 'X'
}
export function setMouth(tile, shape, level = 0) {
  if (!tile) return
  if (shape) {
    if (tile.dataset.viseme !== shape) tile.dataset.viseme = shape
  } else if (tile.hasAttribute('data-viseme')) delete tile.dataset.viseme
  // Also drives the existing drawn portraits and the unanalysed-audio fallback.
  const amount = shape ? ({A:0,B:.16,C:.48,D:.85,E:.46,F:.23,G:.13,H:.35,X:0}[shape] || 0) : level
  const value = amount.toFixed(2)
  if (tile.style.getPropertyValue('--m') !== value) tile.style.setProperty('--m', value)
}

// Browser TTS supplies word boundaries on supported voices. Estimate the
// shapes inside each word, restarting at the browser's actual boundary.
export function textCues(text, rate = 1) {
  const pattern = /sch|tsch|ch|ei|ai|eu|äu|au|ie|[\s\S]/giu
  const cues = [], offsets = []
  let t = 0
  for (const token of text.toLowerCase().matchAll(pattern)) {
    const s = token[0]
    const shape = /^[bmp]$/.test(s) ? 'A' : /^(o|ö|u|ü|au|eu|äu)$/.test(s) ? 'F'
      : /^(i|ie|e|ä|ei|ai)$/.test(s) ? 'B' : s === 'a' ? 'D' : /^[fvwsz]$/.test(s) ? 'G'
      : /\p{L}/u.test(s) ? 'C' : 'X'
    offsets[token.index] = t
    cues.push(t,shape)
    t += (/[.!?;,]/.test(s) ? 19 : s === ' ' ? 4 : shape === 'C' ? 5 : 9) / rate
  }
  cues.push(t,'X')
  return {cues, offsets}
}
