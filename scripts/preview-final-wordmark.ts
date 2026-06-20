/**
 * Print Lya Cloud wordmark as it will appear in the CLI.
 * Run: bun scripts/preview-final-wordmark.ts
 */

const PALETTE: ReadonlyArray<[number, number, number]> = [
  [255, 122, 26],
  [220, 100, 20],
  [180, 70, 10],
]

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t)
}

function gradient(t: number): [number, number, number] {
  if (t < 0.5) {
    const u = t * 2
    return [
      lerp(PALETTE[0][0], PALETTE[1][0], u),
      lerp(PALETTE[0][1], PALETTE[1][1], u),
      lerp(PALETTE[0][2], PALETTE[1][2], u),
    ]
  }
  const u = (t - 0.5) * 2
  return [
    lerp(PALETTE[1][0], PALETTE[2][0], u),
    lerp(PALETTE[1][1], PALETTE[2][1], u),
    lerp(PALETTE[1][2], PALETTE[2][2], u),
  ]
}

const ANSI_RESET = '\x1b[0m'
const BOLD = '\x1b[1m'
function rgb(r: number, g: number, b: number): string {
  return `\x1b[38;2;${r};${g};${b}m`
}

const FONT_7: Record<string, string[]> = {
  L: ['#      ', '#      ', '#      ', '#      ', '#      ', '#      ', '#######'],
  l: ['  #    ', ' ##    ', ' ##    ', '  #    ', '  #    ', '  #    ', '#####  '],
  Y: ['#     #', ' #   # ', '  # #  ', '   #   ', '   #   ', '   #   ', '   #   '],
  y: ['#     #', ' #   # ', '  # #  ', '   #   ', '   #   ', '  ##   ', '  #    '],
  A: ['  ###  ', ' #   # ', '#     #', '#     #', '#######', '#     #', '#     #'],
  a: [' ####  ', '#     #', ' ####  ', '#     #', '#   # #', '#    # ', ' #### #'],
  C: [' ##### ', '#       ', '#       ', '#       ', '#       ', '#       ', ' ##### '],
  c: ['  #### ', '#     #', '#       ', '#       ', '#       ', '#     #', '  #### '],
  O: ['  ###  ', ' #   # ', '#     #', '#     #', '#     #', ' #   # ', '  ###  '],
  o: ['  ###  ', ' #   # ', '#     #', '#     #', '#     #', ' #   # ', '  ###  '],
  U: ['#     #', '#     #', '#     #', '#     #', '#     #', ' #   # ', '  ###  '],
  u: ['#     #', '#     #', '#     #', '#     #', '#   # #', ' #   # ', '  ### #'],
  D: ['###### ', '#     #', '#     #', '#     #', '#     #', '#     #', '###### '],
  d: ['#     #', '#     #', '#     #', '#######', '      #', '#     #', '  ### #'],
  N: ['#     #', '##    #', '# #   #', '#  #  #', '#   # #', '#    ##', '#     #'],
  n: ['#     #', '##    #', '# #   #', '#  #  #', '#   # #', '#    ##', '#     #'],
  ' ': ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
}

const ROWS = 7
const GAP = 1

function render(text: string): string[] {
  const lines: string[][] = Array.from({ length: ROWS }, () => [])
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    const bitmap = FONT_7[ch] ?? FONT_7[' ']
    for (let r = 0; r < ROWS; r++) {
      lines[r].push(bitmap[r])
      if (i < text.length - 1) lines[r].push(' '.repeat(GAP))
    }
  }
  return lines.map(row => row.join(''))
}

function colorize(row: string): string {
  let out = ''
  const width = row.length
  for (let i = 0; i < width; i++) {
    const ch = row[i]
    if (ch === '#') {
      const t = width > 1 ? i / (width - 1) : 0
      const [r, g, b] = gradient(t)
      out += rgb(r, g, b) + ch
    } else {
      out += ch
    }
  }
  return out + ANSI_RESET
}

console.log('')
console.log('Lya Cloud wordmark — 7-row bold, Lya Cloud (sem ponto)')
console.log('Studio CodeAI orange gradient (#FF7A1A → #B4460A)')
console.log('')
for (const line of render('Lya Cloud')) {
  console.log(BOLD + colorize(line) + ANSI_RESET)
}
console.log('')
console.log(`(rows: ${ROWS}, cols: ${render('Lya Cloud')[0]?.length ?? 0})`)
