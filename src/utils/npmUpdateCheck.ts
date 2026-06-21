/**
 * npmUpdateCheck — verifica nova versão no npm e pergunta ao usuário se quer atualizar.
 *
 * Fluxo:
 *  1. Lê a versão instalada atualmente (MACRO.VERSION do bundle).
 *  2. Consulta o npm registry (cached 24h em globalConfig para não bloquear).
 *  3. Se há versão mais nova, exibe prompt sim/não ANTES do REPL Ink iniciar.
 *  4. Se "sim": roda npm install -g e sai (o usuário relança com a nova versão).
 *  5. Se "não": segue normalmente.
 *
 * Condicional: só roda em TTY interativo, fora de CI, e se o auto-updater não
 * estiver desabilitado.
 */

import { createInterface } from 'readline'
import { execFileSync } from 'child_process'
import { getGlobalConfig, saveGlobalConfig } from './config.js'
import { isAutoUpdaterDisabled } from './config.js'
import { ansiRgb, ANSI_RESET } from './terminalAnsi.js'
import { logForDebugging } from './debug.js'

declare const MACRO: { VERSION: string }

const PKG_NAME = '@studiocodeai/lyacode'
const NPM_REGISTRY_URL = `https://registry.npmjs.org/${PKG_NAME}/latest`
const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000 // 24h

const ORANGE: [number, number, number] = [255, 122, 26]
const GREEN: [number, number, number] = [34, 197, 94]
const DIM = '\x1b[2m'
const RESET = ANSI_RESET
const BOLD = '\x1b[1m'

function semverGt(a: string, b: string): boolean {
  const parse = (v: string) => v.replace(/^v/, '').split('.').map(Number)
  const [am, an, ap] = parse(a)
  const [bm, bn, bp] = parse(b)
  if (am !== bm) return am > bm
  if (an !== bn) return an > bn
  return ap > bp
}

async function fetchLatestNpmVersion(): Promise<string | null> {
  try {
    const res = await fetch(NPM_REGISTRY_URL, {
      signal: AbortSignal.timeout(4000),
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return null
    const data = (await res.json()) as { version?: string }
    return data.version ?? null
  } catch {
    return null
  }
}

async function promptYesNo(question: string): Promise<boolean> {
  return new Promise(resolve => {
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    rl.question(question, answer => {
      rl.close()
      const a = answer.trim().toLowerCase()
      resolve(a === 's' || a === 'sim' || a === 'y' || a === 'yes')
    })
  })
}

export async function checkNpmUpdateAndPrompt(): Promise<void> {
  // Só roda em sessão interativa
  if (!process.stdout.isTTY || process.env.CI || process.env.NODE_ENV === 'test') return
  if (isAutoUpdaterDisabled()) return

  const config = getGlobalConfig()
  const now = Date.now()
  const lastCheck = (config as Record<string, unknown>).lastNpmUpdateCheckTs as number | undefined
  const cachedLatest = (config as Record<string, unknown>).lastNpmUpdateVersion as string | undefined

  // Usa cache se for < 24h
  let latestVersion = cachedLatest ?? null
  if (!lastCheck || now - lastCheck > CHECK_INTERVAL_MS) {
    logForDebugging('npmUpdateCheck: buscando versao no npm...')
    latestVersion = await fetchLatestNpmVersion()
    if (latestVersion) {
      saveGlobalConfig({
        ...config,
        lastNpmUpdateCheckTs: now,
        lastNpmUpdateVersion: latestVersion,
      } as Parameters<typeof saveGlobalConfig>[0])
    }
  }

  if (!latestVersion) return

  const current = MACRO.VERSION
  if (!semverGt(latestVersion, current)) return

  // Há versão mais nova — mostrar prompt
  const accent = ansiRgb(...ORANGE)
  const green = ansiRgb(...GREEN)

  process.stdout.write('\n')
  process.stdout.write(
    `  ${accent}✦${RESET} ${BOLD}Nova versão disponível:${RESET} ` +
    `${DIM}v${current}${RESET} → ${green}${BOLD}v${latestVersion}${RESET}\n`
  )
  process.stdout.write(
    `  ${DIM}Notas: https://github.com/StudioCodeAI/LyaCode-installers/releases/tag/v${latestVersion}${RESET}\n`
  )
  process.stdout.write('\n')

  const yes = await promptYesNo(
    `  ${accent}?${RESET} Atualizar agora? ${DIM}[s/N]${RESET} `
  )

  if (!yes) {
    process.stdout.write(`  ${DIM}Atualize quando quiser: npm install -g ${PKG_NAME}@latest${RESET}\n\n`)
    return
  }

  process.stdout.write(`\n  ${accent}→${RESET} Atualizando ${PKG_NAME}@${latestVersion}...\n\n`)
  try {
    execFileSync('npm', ['install', '-g', `${PKG_NAME}@${latestVersion}`], {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })
    process.stdout.write(
      `\n  ${green}✓${RESET} ${BOLD}Lya Code v${latestVersion} instalado!${RESET}\n`
    )
    process.stdout.write(`  Reinicie o terminal e rode ${accent}lya${RESET} para usar a nova versão.\n\n`)
    process.exit(0)
  } catch {
    process.stdout.write(
      `\n  Falha ao atualizar. Tente manualmente:\n  ${DIM}npm install -g ${PKG_NAME}@latest${RESET}\n\n`
    )
  }
}
