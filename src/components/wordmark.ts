/**
 * Lya Code wordmark — ANSI Shadow block font with box-drawing characters.
 * Rendered in the Studio CodeAI orange gradient by StartupScreen.ts.
 *
 * Font style: FigFont "ANSI Shadow" (same style as the broader CLI ecosystem).
 * Characters: full blocks (█) for the letter body, box-drawing chars (╔═╗║╚╝)
 * for the outline — together they produce the thick-stroke 3D appearance.
 *
 * Layout: "LYA CODE" on a single 6-row block (71 chars wide).
 * Each letter is 6 rows tall with consistent 2-space letter gaps and
 * 3-space word gap between LYA and CODE.
 */

export const LYACODE_STARTUP_WORDMARK = [
  '██╗       ██╗   ██╗   █████╗     ██████╗   ██████╗   ██████╗   ███████╗',
  '██║       ╚██╗ ██╔╝  ██╔══██╗   ██╔════╝  ██╔═══██╗  ██╔══██╗  ██╔════╝',
  '██║        ╚████╔╝   ███████║   ██║       ██║   ██║  ██║  ██║  █████╗  ',
  '██║         ╚██╔╝    ██╔══██║   ██║       ██║   ██║  ██║  ██║  ██╔══╝  ',
  '███████╗    ██║      ██║  ██║   ╚██████╗  ╚██████╔╝  ██████╔╝  ███████╗',
  '╚══════╝    ╚═╝      ╚═╝  ╚═╝    ╚═════╝   ╚═════╝   ╚═════╝   ╚══════╝',
] as const

// 7-row × 5-col bitmaps — kept for preview scripts and compact variants.
// '#' = filled cell. Renderer in StartupScreen converts '#' to ANSI-colored spans.
const FONT_7: Record<string, string[]> = {
  L: ['#    ', '#    ', '#    ', '#    ', '#    ', '#    ', '#####'],
  Y: ['#   #', '#   #', ' # # ', '  #  ', '  #  ', '  #  ', '  #  '],
  A: [' ### ', '#   #', '#   #', '#####', '#   #', '#   #', '#   #'],
  C: [' ####', '#    ', '#    ', '#    ', '#    ', '#    ', ' ####'],
  O: [' ### ', '#   #', '#   #', '#   #', '#   #', '#   #', ' ### '],
  U: ['#   #', '#   #', '#   #', '#   #', '#   #', '#   #', ' ### '],
  D: ['#### ', '#   #', '#   #', '#   #', '#   #', '#   #', '#### '],
  N: ['#   #', '##  #', '# # #', '# # #', '#  ##', '#   #', '#   #'],
  ' ': ['     '],
  '.': [' ', ' ', ' ', ' ', ' ', ' ', '##'],
}

const ROWS = 7
const GAP = 1

export function renderWordmark7(text: string): string[] {
  const lines: string[][] = Array.from({ length: ROWS }, () => [])
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    const upper = ch === ch.toUpperCase() ? ch : ch.toUpperCase()
    const bitmap = FONT_7[upper] ?? FONT_7[ch] ?? FONT_7[' ']
    for (let r = 0; r < ROWS; r++) {
      lines[r].push(bitmap[r])
      if (i < text.length - 1) {
        lines[r].push(' '.repeat(GAP))
      }
    }
  }
  return lines.map(row => row.join(''))
}

/** Single-line wordmark fallback (used in narrow contexts). */
export const LYACODE_WORDMARK_INLINE = '  Lya Code'
