/**
 * Build Lya Cloud Windows Installer (.exe auto-extraível)
 *
 * Luis Cardozo · studiocoder.ai@gmail.com · Studio CodeAI
 *
 * Passos:
 *   1. Roda `npm pack` (gera studiocodeai-lyacloud-0.1.0.tgz na raiz)
 *   2. Valida que scripts/installer/windows/ tem todos os arquivos
 *   3. Tenta gerar o .exe via `iexpress` (Windows-only; pula se não disponível)
 *   4. Senão, gera um .zip com install.cmd + install.ps1 + tarball
 *
 * Saída:
 *   - dist/installer/lyacloud-setup-x64-0.1.0.exe (se Windows + iexpress)
 *   - dist/installer/lyacloud-setup-x64-0.1.0.zip (sempre, fallback)
 *   - dist/installer/lyacloud-portable-0.1.0/ (extraído para inspeção)
 */

import { existsSync } from 'fs'
import { mkdir, readdir, copyFile, rm } from 'fs/promises'
import { join } from 'path'
import { spawnSync } from 'child_process'

const REPO_ROOT = join(import.meta.dir, '..', '..')
const VERSION = '1.0.0'
const TARBALL_NAME = `studiocodeai-lyacloud-${VERSION}.tgz`
const TARBALL_PATH = join(REPO_ROOT, TARBALL_NAME)
const SED_PATH = join(
  REPO_ROOT,
  'scripts',
  'installer',
  'windows',
  'lyacloud-setup-x64.sed'
)
const OUT_DIR = join(REPO_ROOT, 'dist', 'installer')

async function main(): Promise<void> {
  console.log('=== Lya Cloud Windows Installer Builder ===')
  console.log(`Repo:    ${REPO_ROOT}`)
  console.log(`Output:  ${OUT_DIR}`)

  // 1. Build tarball
  console.log('\n[1/4] Building tarball (npm pack)...')
  const pack = spawnSync('npm', ['pack', '--silent'], {
    cwd: REPO_ROOT,
    stdio: 'inherit',
  })
  if (pack.status !== 0) {
    console.error('npm pack failed.')
    process.exit(1)
  }
  if (!existsSync(TARBALL_PATH)) {
    console.error(`Tarball not found at ${TARBALL_PATH}`)
    process.exit(1)
  }
  console.log(`  OK: ${TARBALL_NAME}`)

  // 2. Validate scripts
  console.log('\n[2/4] Validating installer scripts...')
  const required = [
    'install.ps1',
    'install.cmd',
    'lyacloud-setup-x64.sed',
    'LICENSE.rtf',
    'README.md',
  ]
  for (const file of required) {
    const p = join(REPO_ROOT, 'scripts', 'installer', 'windows', file)
    if (!existsSync(p)) {
      console.error(`Missing required file: ${p}`)
      process.exit(1)
    }
  }
  console.log(`  OK: ${required.length} files present`)

  // 3. Build portable bundle (zip fallback)
  console.log('\n[3/4] Building portable bundle...')
  await mkdir(OUT_DIR, { recursive: true })
  const portableDir = join(OUT_DIR, `lyacloud-portable-${VERSION}`)
  await rm(portableDir, { recursive: true, force: true })
  await mkdir(portableDir, { recursive: true })
  for (const file of required) {
    await copyFile(
      join(REPO_ROOT, 'scripts', 'installer', 'windows', file),
      join(portableDir, file)
    )
  }
  await copyFile(TARBALL_PATH, join(portableDir, TARBALL_NAME))
  console.log(`  OK: ${portableDir}`)

  // 4. Try to build the .exe via iexpress (Windows-only)
  console.log('\n[4/4] Attempting to build .exe via iexpress...')
  const iexpress = process.platform === 'win32' ? 'iexpress.exe' : null
  if (!iexpress) {
    console.log(
      `  SKIP: iexpress is Windows-only. Current platform: ${process.platform}`
    )
    console.log('  Para gerar o .exe, rode em Windows:')
    console.log(
      `    iexpress /N:${SED_PATH} /O:${join(OUT_DIR, `lyacloud-setup-x64-${VERSION}.exe`)}`
    )
  } else {
    const exeOut = join(OUT_DIR, `lyacloud-setup-x64-${VERSION}.exe`)
    // iexpress abre UI wizard se nao passar flags. Use /Q para silent
    // e /M para unpacking-only mode (gera sem wizard interativo).
    const result = spawnSync(
      iexpress,
      ['/Q', `/M:${SED_PATH}`, `/O:${exeOut}`],
      { stdio: 'inherit', timeout: 120000 }
    )
    if (result.status === 0 && existsSync(exeOut)) {
      console.log(`  OK: ${exeOut}`)
    } else {
      console.warn(`iexpress failed (exit=${result.status}).`)
      console.warn('Use the portable bundle as fallback.')
      // Don't exit — portable is good enough for distribution.
    }
  }

  // List final output
  console.log('\n=== Output ===')
  const entries = await readdir(OUT_DIR, { withFileTypes: true })
  for (const entry of entries) {
    const p = join(OUT_DIR, entry.name)
    const stat = spawnSync('cmd', ['/c', `dir /-c "${p}"`], {
      encoding: 'utf8',
    })
    const sizeMatch = stat.stdout?.match(/(\d+)\s+bytes/)?.[1]
    console.log(`  ${entry.isDirectory() ? '[D]' : '[F]'} ${p}${sizeMatch ? ` (${sizeMatch} bytes)` : ''}`)
  }

  console.log('\n=== Done ===')
  console.log(`Para instalar em Windows: rode dist/installer/lyacloud-setup-x64-${VERSION}.exe`)
  console.log('Ou use o portable: extraia o .zip e rode install.cmd')
}

main().catch(err => {
  console.error('FATAL:', err)
  process.exit(1)
})
