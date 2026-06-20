/**
 * Build Lya Code Windows Installer (.exe + .zip + .tgz)
 *
 * Luis Cardozo Ãƒâ€šÃ‚Â· studiocoder.ai@gmail.com Ãƒâ€šÃ‚Â· Studio CodeAI
 *
 * Passos:
 *   1. Roda `npm pack` (gera studiocodeai-lyacode-${VERSION}.tgz na raiz)
 *   2. Valida que scripts/installer/windows/ tem todos os arquivos
 *   3. Gera pasta portable
 *   4. Gera .zip do portable (sempre)
 *   5. Tenta gerar o .exe via `iexpress` (Windows-only; pula se nÃƒÆ’Ã‚Â£o disponÃƒÆ’Ã‚Â­vel)
 *
 * SaÃƒÆ’Ã‚Â­da em dist/installer/:
 *   - lyacode-portable-${VERSION}/      (pasta extraÃƒÆ’Ã‚Â­da)
 *   - lyacode-portable-${VERSION}.zip   (sempre, fallback robusto)
 *   - lyacode-setup-x64-${VERSION}.exe  (se Windows + iexpress funcionar)
 */

import { existsSync } from 'fs'
import { mkdir, readdir, copyFile, rm } from 'fs/promises'
import { join } from 'path'
import { spawnSync } from 'child_process'

const REPO_ROOT = join(import.meta.dir, '..', '..')
const VERSION = '1.0.7'
const TARBALL_NAME = `studiocodeai-lyacode-${VERSION}.tgz`
const TARBALL_PATH = join(REPO_ROOT, TARBALL_NAME)
const SED_PATH = join(
  REPO_ROOT,
  'scripts',
  'installer',
  'windows',
  'lyacode-setup-x64.sed'
)
const OUT_DIR = join(REPO_ROOT, 'dist', 'installer')

async function main(): Promise<void> {
  console.log('=== Lya Code Windows Installer Builder ===')
  console.log(`Repo:    ${REPO_ROOT}`)
  console.log(`Output:  ${OUT_DIR}`)
  console.log(`Version: ${VERSION}`)

  // 1. Build tarball
  console.log('\n[1/5] Building tarball (npm pack)...')
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
  console.log('\n[2/5] Validating installer scripts...')
  const required = [
    'install.ps1',
    'install.cmd',
    'lyacode-setup-x64.sed',
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

  // 3. Build portable folder
  console.log('\n[3/5] Building portable folder...')
  await mkdir(OUT_DIR, { recursive: true })
  const portableDir = join(OUT_DIR, `lyacode-portable-${VERSION}`)
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

  // 4. Zip portable bundle (works on Windows via PowerShell, Linux/Mac via zip)
  console.log('\n[4/5] Zipping portable bundle...')
  const zipOut = join(OUT_DIR, `lyacode-portable-${VERSION}.zip`)
  await rm(zipOut, { force: true })

  let zipOk = false
  if (process.platform === 'win32') {
    // Use PowerShell Compress-Archive (built-in Windows)
    const psResult = spawnSync(
      'powershell.exe',
      [
        '-NoProfile',
        '-NonInteractive',
        '-Command',
        `Compress-Archive -Path "${portableDir}\\*" -DestinationPath "${zipOut}" -Force`,
      ],
      { stdio: 'inherit', timeout: 60000 }
    )
    zipOk = psResult.status === 0 && existsSync(zipOut)
  } else {
    // Use zip (Linux/Mac)
    const zipResult = spawnSync(
      'zip',
      ['-r', zipOut, `lyacode-portable-${VERSION}`],
      { cwd: OUT_DIR, stdio: 'inherit', timeout: 60000 }
    )
    zipOk = zipResult.status === 0 && existsSync(zipOut)
  }

  if (zipOk) {
    console.log(`  OK: ${zipOut}`)
  } else {
    console.warn('  WARN: zip generation failed (portable folder still works as fallback)')
  }

  // 5. Try to build the .exe via iexpress (Windows-only)
  console.log('\n[5/5] Attempting to build .exe via iexpress...')
  const iexpress = process.platform === 'win32' ? 'iexpress.exe' : null
  if (!iexpress) {
    console.log(
      `  SKIP: iexpress is Windows-only. Current platform: ${process.platform}`
    )
  } else {
    const exeOut = join(OUT_DIR, `lyacode-setup-x64-${VERSION}.exe`)
    await rm(exeOut, { force: true })
    // iexpress requires the SED to be in the same dir as referenced files
    // OR have correct absolute paths. We pass the SED with /N and let it
    // resolve files relative to its location. The repo-root tarball is
    // referenced via SourceFiles0 with SourceFilesPath=\\ which iexpress
    // interprets oddly. Best effort here ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â if it fails, .zip is enough.
    const result = spawnSync(
      iexpress,
      ['/Q', `/N:${SED_PATH}`, `/O:${exeOut}`],
      { stdio: 'inherit', timeout: 120000 }
    )
    if (result.status === 0 && existsSync(exeOut)) {
      console.log(`  OK: ${exeOut}`)
    } else {
      console.warn(`  WARN: iexpress failed (exit=${result.status}).`)
      console.warn('  Use the .zip or .tgz instead ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â they work everywhere.')
    }
  }

  // List final output
  console.log('\n=== Output ===')
  const entries = await readdir(OUT_DIR, { withFileTypes: true })
  for (const entry of entries) {
    const p = join(OUT_DIR, entry.name)
    console.log(`  ${entry.isDirectory() ? '[D]' : '[F]'} ${p}`)
  }

  console.log('\n=== Done ===')
  console.log('\nDistribution artifacts:')
  console.log(`  1. ${TARBALL_NAME}                          (npm tarball, multi-platform)`)
  if (zipOk) console.log(`  2. lyacode-portable-${VERSION}.zip          (portable Windows zip)`)
  const exePath = join(OUT_DIR, `lyacode-setup-x64-${VERSION}.exe`)
  if (existsSync(exePath)) console.log(`  3. lyacode-setup-x64-${VERSION}.exe         (Windows installer)`)
  console.log('\nInstall (multi-platform via npm):')
  console.log(`  npm install -g ${TARBALL_PATH}`)
}

main().catch(err => {
  console.error('FATAL:', err)
  process.exit(1)
})
