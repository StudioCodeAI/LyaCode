/**
 * Lya Code wordmark — large block letters rendered with ANSI colors
 * and the Studio CodeAI gradient.
 *
 * The official product wordmark is title case: "Lya Code".
 * Do not replace it with all-caps "LYA CODE" in user-facing surfaces.
 *
 * The startup banner uses a hand-tuned 5-row title-case drawing. The
 * bitmap renderer below remains available for previews and future compact
 * variants.
 *
 * Bitmaps use '#' for filled cells and ' ' for empty. The renderer
 * in StartupScreen converts '#' to ANSI-colored spans.
 *
 * The font is "ANSI Shadow" style (https://en.wikipedia.org/wiki/ANSI_art)
 * because the Studio CodeAI palette is warm/orange and that style
 * reads cleanly in a dark terminal.
 *
 * We keep the bitmaps as a single const so the bundle picks them up
 * via tree-shaking exactly once.
 */

export const LYACODE_STARTUP_WORDMARK = [
  '██                             ██████                ██           ',
  '██      ██   ██   ██████      ██        █████    ██████   █████   ',
  '██      ██   ██  ██   ██      ██       ██   ██  ██   ██  ███████  ',
  '███████  ██████   ██████       ██████   █████    ██████   ██████  ',
  '             ██                                                   ',
] as const

// 7-row × 5-col bitmaps. Each row is a 5-char string where '#'
// is filled. Letters are joined left-to-right with a 1-col gap.
const FONT_7: Record<string, string[]> = {
  L: ['#    ', '#    ', '#    ', '#    ', '#    ', '#    ', '#####'],
  Y: ['#   #', '#   #', ' # # ', '  #  ', '  #  ', '  #  ', '  #  '],
  A: [' ### ', '#   #', '#   #', '#####', '#   #', '#   #', '#   #'],
  C: [' ####', '#    ', '#    ', '#    ', '#    ', '#    ', ' ####'],
  O: [' ### ', '#   #', '#   #', '#   #', '#   #', '#   #', ' ### '],
  U: ['#   #', '#   #', '#   #', '#   #', '#   #', '#   #', ' ### '],
  D: ['#### ', '#   #', '#   #', '#   #', '#   #', '#   #', '#### '],
  N: ['#   #', '##  #', '# # #', '# # #', '#  ##', '#   #', '#   #'],
  // ' ' (space) is a single-column spacer
  ' ': ['     '],
  // '.' for optional dotted variants, 1-col wide
  '.': [' ', ' ', ' ', ' ', ' ', ' ', '##'],
}

const ROWS = 7
const COLS = 5
const GAP = 1

/**
 * Render text using the 7-row font. Returns an array of ROWS strings,
 * each fully padded to `width` columns. Empty cells are ' '.
 */
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
