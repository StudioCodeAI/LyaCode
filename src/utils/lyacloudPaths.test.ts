import { afterAll, afterEach, beforeAll, describe, expect, mock, test } from 'bun:test'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs'
import * as fsPromises from 'fs/promises'
import * as realOs from 'os'
import { homedir, tmpdir } from 'os'
import { join } from 'path'
import { restoreOsMock } from '../test/osMock.js'
import { acquireEnvMutex, releaseEnvMutex } from '../entrypoints/sdk/shared.js'

const originalEnv = { ...process.env }
const originalArgv = [...process.argv]

async function importFreshEnvUtils() {
  return import(`./envUtils.ts?ts=${Date.now()}-${Math.random()}`)
}

async function importFreshSettings() {
  return import(`./settings/settings.ts?ts=${Date.now()}-${Math.random()}`)
}

async function importFreshLocalInstaller() {
  return import(`./localInstaller.ts?ts=${Date.now()}-${Math.random()}`)
}

async function importFreshPlans() {
  return import(`./plans.ts?ts=${Date.now()}-${Math.random()}`)
}

afterEach(() => {
  try {
    process.env = { ...originalEnv }
    process.argv = [...originalArgv]
    mock.restore()
    // Always restore real os.homedir() after a test that mocked os,
    // so subsequent suites and tests don't observe a stale temp path.
    mock.module('os', () => realOs)
    mock.module('node:os', () => realOs)
  } finally {
    releaseEnvMutex()
  }
})

afterAll(() => {
  // Final defensive cleanup so this suite leaves the process with the
  // real os module in place.
  mock.restore()
  mock.module('os', () => realOs)
  mock.module('node:os', () => realOs)
})

beforeAll(() => {
  // Clear any leftover os.homedir() override from a prior suite.
  restoreOsMock()
})

describe('Lya Cloud paths', () => {
  test('defaults user config home to ~/.lyacloud', async () => {
    await acquireEnvMutex()
    delete process.env.LYACLOUD_CONFIG_DIR
    delete process.env.CLAUDE_CONFIG_DIR
    const { resolveClaudeConfigHomeDir } = await importFreshEnvUtils()

    expect(
      resolveClaudeConfigHomeDir({
        homeDir: homedir(),
      }),
    ).toBe(join(homedir(), '.lyacloud'))
  })

  test('hard-cuts user config home to ~/.lyacloud by default', async () => {
    await acquireEnvMutex()
    delete process.env.LYACLOUD_CONFIG_DIR
    delete process.env.CLAUDE_CONFIG_DIR
    const { resolveClaudeConfigHomeDir } = await importFreshEnvUtils()

    expect(
      resolveClaudeConfigHomeDir({
        homeDir: homedir(),
      }),
    ).toBe(join(homedir(), '.lyacloud'))
  })

  test('migrates legacy config home and global config files to .lyacloud', async () => {
    await acquireEnvMutex()
    const tempHome = mkdtempSync(join(tmpdir(), 'lyacloud-paths-test-'))
    try {
      mkdirSync(join(tempHome, '.claude', 'skills', 'legacy-skill'), {
        recursive: true,
      })
      writeFileSync(
        join(tempHome, '.claude', 'skills', 'legacy-skill', 'SKILL.md'),
        'legacy skill',
      )
      writeFileSync(join(tempHome, '.claude', 'settings.json'), '{}')
      writeFileSync(join(tempHome, '.claude.json'), '{"legacy":true}')
      writeFileSync(
        join(tempHome, '.claude-custom-oauth.json'),
        '{"custom":true}',
      )

      const { migrateLegacyClaudeConfigHome } = await importFreshEnvUtils()

      expect(migrateLegacyClaudeConfigHome({ homeDir: tempHome })).toBe(true)
      expect(
        readFileSync(
          join(tempHome, '.lyacloud', 'skills', 'legacy-skill', 'SKILL.md'),
          'utf8',
        ),
      ).toBe('legacy skill')
      expect(existsSync(join(tempHome, '.lyacloud', 'settings.json'))).toBe(
        true,
      )
      expect(readFileSync(join(tempHome, '.lyacloud.json'), 'utf8')).toBe(
        '{"legacy":true}',
      )
      expect(
        readFileSync(join(tempHome, '.lyacloud-custom-oauth.json'), 'utf8'),
      ).toBe('{"custom":true}')
    } finally {
      rmSync(tempHome, { recursive: true, force: true })
    }
  })

  test('migration preserves existing .lyacloud data while copying missing legacy data', async () => {
    await acquireEnvMutex()
    const tempHome = mkdtempSync(join(tmpdir(), 'lyacloud-paths-test-'))
    try {
      mkdirSync(join(tempHome, '.claude', 'skills', 'legacy-skill'), {
        recursive: true,
      })
      mkdirSync(join(tempHome, '.lyacloud', 'skills'), { recursive: true })
      writeFileSync(join(tempHome, '.claude', 'settings.json'), 'legacy')
      writeFileSync(join(tempHome, '.lyacloud', 'settings.json'), 'current')
      writeFileSync(
        join(tempHome, '.claude', 'skills', 'legacy-skill', 'SKILL.md'),
        'legacy skill',
      )

      const { migrateLegacyClaudeConfigHome } = await importFreshEnvUtils()

      expect(migrateLegacyClaudeConfigHome({ homeDir: tempHome })).toBe(true)
      expect(
        readFileSync(join(tempHome, '.lyacloud', 'settings.json'), 'utf8'),
      ).toBe('current')
      expect(
        readFileSync(
          join(tempHome, '.lyacloud', 'skills', 'legacy-skill', 'SKILL.md'),
          'utf8',
        ),
      ).toBe('legacy skill')
    } finally {
      rmSync(tempHome, { recursive: true, force: true })
    }
  })

  test('migration skips explicit CLAUDE_CONFIG_DIR overrides', async () => {
    await acquireEnvMutex()
    const tempHome = mkdtempSync(join(tmpdir(), 'lyacloud-paths-test-'))
    try {
      mkdirSync(join(tempHome, '.claude'), { recursive: true })
      writeFileSync(join(tempHome, '.claude', 'settings.json'), 'legacy')

      const { migrateLegacyClaudeConfigHome } = await importFreshEnvUtils()

      expect(
        migrateLegacyClaudeConfigHome({
          configDirEnv: join(tempHome, 'custom-config'),
          homeDir: tempHome,
        }),
      ).toBe(true)
      expect(existsSync(join(tempHome, '.lyacloud'))).toBe(false)
    } finally {
      rmSync(tempHome, { recursive: true, force: true })
    }
  })

  test('migration fails closed when .lyacloud collides with a non-directory', async () => {
    await acquireEnvMutex()
    const tempHome = mkdtempSync(join(tmpdir(), 'lyacloud-paths-test-'))
    try {
      writeFileSync(join(tempHome, '.lyacloud'), 'not a directory')
      mkdirSync(join(tempHome, '.claude'), { recursive: true })
      writeFileSync(join(tempHome, '.claude', 'settings.json'), 'legacy')

      const { migrateLegacyClaudeConfigHome } = await importFreshEnvUtils()

      expect(migrateLegacyClaudeConfigHome({ homeDir: tempHome })).toBe(false)
    } finally {
      rmSync(tempHome, { recursive: true, force: true })
    }
  })

  test('migration ignores non-directory legacy config homes', async () => {
    await acquireEnvMutex()
    const tempHome = mkdtempSync(join(tmpdir(), 'lyacloud-paths-test-'))
    try {
      writeFileSync(join(tempHome, '.claude'), 'not a directory')

      const { migrateLegacyClaudeConfigHome } = await importFreshEnvUtils()

      expect(migrateLegacyClaudeConfigHome({ homeDir: tempHome })).toBe(true)
      expect(existsSync(join(tempHome, '.lyacloud'))).toBe(false)
    } finally {
      rmSync(tempHome, { recursive: true, force: true })
    }
  })

  test('config home falls back to legacy when migration fails on a non-directory .lyacloud collision', async () => {
    await acquireEnvMutex()
    const tempHome = mkdtempSync(join(tmpdir(), 'lyacloud-paths-test-'))
    try {
      writeFileSync(join(tempHome, '.lyacloud'), 'not a directory')
      mkdirSync(join(tempHome, '.claude'), { recursive: true })
      delete process.env.LYACLOUD_CONFIG_DIR
      delete process.env.CLAUDE_CONFIG_DIR

      const { getClaudeConfigHomeDir } = await importFreshEnvUtils()

      expect(getClaudeConfigHomeDir(tempHome)).toBe(join(tempHome, '.claude'))
    } finally {
      rmSync(tempHome, { recursive: true, force: true })
    }
  })

  test('default plans directory uses ~/.lyacloud/plans', async () => {
    await acquireEnvMutex()
    delete process.env.LYACLOUD_CONFIG_DIR
    delete process.env.CLAUDE_CONFIG_DIR
    const { getDefaultPlansDirectory } = await importFreshPlans()

    expect(getDefaultPlansDirectory({ homeDir: homedir() })).toBe(
      join(homedir(), '.lyacloud', 'plans'),
    )
  })

  test('default plans directory respects explicit CLAUDE_CONFIG_DIR', async () => {
    await acquireEnvMutex()
    const { getDefaultPlansDirectory } = await importFreshPlans()

    expect(
      getDefaultPlansDirectory({ configDirEnv: '/tmp/custom-lyacloud' }),
    ).toBe(join('/tmp/custom-lyacloud', 'plans'))
  })

  test('default plans directory respects LYACLOUD_CONFIG_DIR', async () => {
    await acquireEnvMutex()
    process.env.LYACLOUD_CONFIG_DIR = '/tmp/preferred-lyacloud'
    delete process.env.CLAUDE_CONFIG_DIR
    const { getDefaultPlansDirectory } = await importFreshPlans()

    expect(getDefaultPlansDirectory()).toBe(
      join('/tmp/preferred-lyacloud', 'plans'),
    )
  })

  test('LYACLOUD_CONFIG_DIR wins for default plans directory', async () => {
    await acquireEnvMutex()
    process.env.LYACLOUD_CONFIG_DIR = '/tmp/preferred-lyacloud'
    process.env.CLAUDE_CONFIG_DIR = '/tmp/legacy-lyacloud'
    const { getDefaultPlansDirectory } = await importFreshPlans()

    expect(getDefaultPlansDirectory()).toBe(
      join('/tmp/preferred-lyacloud', 'plans'),
    )
  })

  test('default plans directory normalizes generated path to NFC', async () => {
    await acquireEnvMutex()
    const { getDefaultPlansDirectory } = await importFreshPlans()

    expect(
      getDefaultPlansDirectory({ homeDir: '/tmp/cafe\u0301' }),
    ).toBe(join('/tmp/caf\u00e9', '.lyacloud', 'plans'))
  })

  test('default plans directory normalizes explicit CLAUDE_CONFIG_DIR to NFC', async () => {
    await acquireEnvMutex()
    const { getDefaultPlansDirectory } = await importFreshPlans()

    expect(
      getDefaultPlansDirectory({ configDirEnv: '/tmp/cafe\u0301-lyacloud' }),
    ).toBe(join('/tmp/caf\u00e9-lyacloud', 'plans'))
  })

  test('uses CLAUDE_CONFIG_DIR override when provided (legacy)', async () => {
    await acquireEnvMutex()
    delete process.env.LYACLOUD_CONFIG_DIR
    process.env.CLAUDE_CONFIG_DIR = '/tmp/custom-lyacloud'
    const { getClaudeConfigHomeDir, resolveClaudeConfigHomeDir } =
      await importFreshEnvUtils()

    expect(getClaudeConfigHomeDir()).toBe('/tmp/custom-lyacloud')
    expect(
      resolveClaudeConfigHomeDir({
        configDirEnv: '/tmp/custom-lyacloud',
      }),
    ).toBe('/tmp/custom-lyacloud')
  })

  test('LYACLOUD_CONFIG_DIR overrides the default (issue #454)', async () => {
    await acquireEnvMutex()
    delete process.env.CLAUDE_CONFIG_DIR
    process.env.LYACLOUD_CONFIG_DIR = '/tmp/lyacloud-config-only'
    const { getClaudeConfigHomeDir } = await importFreshEnvUtils()

    expect(getClaudeConfigHomeDir()).toBe('/tmp/lyacloud-config-only')
  })

  test('LYACLOUD_CONFIG_DIR wins when both env vars are set with different values', async () => {
    await acquireEnvMutex()
    process.env.LYACLOUD_CONFIG_DIR = '/tmp/lyacloud-wins'
    process.env.CLAUDE_CONFIG_DIR = '/tmp/legacy-loses'
    const { getClaudeConfigHomeDir } = await importFreshEnvUtils()

    expect(getClaudeConfigHomeDir()).toBe('/tmp/lyacloud-wins')
  })

  test('CLAUDE_CONFIG_DIR is still honored when LYACLOUD_CONFIG_DIR is unset', async () => {
    await acquireEnvMutex()
    delete process.env.LYACLOUD_CONFIG_DIR
    process.env.CLAUDE_CONFIG_DIR = '/tmp/legacy-only'
    const { getClaudeConfigHomeDir } = await importFreshEnvUtils()

    expect(getClaudeConfigHomeDir()).toBe('/tmp/legacy-only')
  })

  test('empty LYACLOUD_CONFIG_DIR falls through to CLAUDE_CONFIG_DIR', async () => {
    await acquireEnvMutex()
    process.env.LYACLOUD_CONFIG_DIR = ''
    process.env.CLAUDE_CONFIG_DIR = '/tmp/legacy-fallback'
    const { getClaudeConfigHomeDir } = await importFreshEnvUtils()

    expect(getClaudeConfigHomeDir()).toBe('/tmp/legacy-fallback')
  })

  test('resolveConfigDirEnv prefers LYACLOUD over CLAUDE and warns on conflict', async () => {
    await acquireEnvMutex()
    const { resolveConfigDirEnv, __resetConfigDirEnvWarningForTesting } =
      await importFreshEnvUtils()
    __resetConfigDirEnvWarningForTesting()

    const warnings: string[] = []
    const result = resolveConfigDirEnv({
      lyaCloudConfigDir: '/a',
      legacyConfigDir: '/b',
      warn: m => warnings.push(m),
    })

    expect(result).toBe('/a')
    expect(warnings.length).toBe(1)
    expect(warnings[0]).toContain('LYACLOUD_CONFIG_DIR=/a')
    expect(warnings[0]).toContain('CLAUDE_CONFIG_DIR=/b')

    resolveConfigDirEnv({
      lyaCloudConfigDir: '/x',
      legacyConfigDir: '/y',
      warn: m => warnings.push(m),
    })
    expect(warnings.length).toBe(1)
  })

  test('resolveConfigDirEnv silent callers do not consume the conflict warning', async () => {
    await acquireEnvMutex()
    const { resolveConfigDirEnv, __resetConfigDirEnvWarningForTesting } =
      await importFreshEnvUtils()
    __resetConfigDirEnvWarningForTesting()

    expect(
      resolveConfigDirEnv({
        lyaCloudConfigDir: '/silent-lya',
        legacyConfigDir: '/silent-legacy',
      }),
    ).toBe('/silent-lya')

    const warnings: string[] = []
    expect(
      resolveConfigDirEnv({
        lyaCloudConfigDir: '/warn-lya',
        legacyConfigDir: '/warn-legacy',
        warn: m => warnings.push(m),
      }),
    ).toBe('/warn-lya')
    expect(warnings.length).toBe(1)
    expect(warnings[0]).toContain('LYACLOUD_CONFIG_DIR=/warn-lya')
    expect(warnings[0]).toContain('CLAUDE_CONFIG_DIR=/warn-legacy')
  })

  test('resolveConfigDirEnv does not warn when both env vars agree', async () => {
    await acquireEnvMutex()
    const { resolveConfigDirEnv, __resetConfigDirEnvWarningForTesting } =
      await importFreshEnvUtils()
    __resetConfigDirEnvWarningForTesting()

    const warnings: string[] = []
    const result = resolveConfigDirEnv({
      lyaCloudConfigDir: '/same',
      legacyConfigDir: '/same',
      warn: m => warnings.push(m),
    })

    expect(result).toBe('/same')
    expect(warnings).toEqual([])
  })

  test('resolveConfigDirEnv returns undefined when neither env var is set', async () => {
    await acquireEnvMutex()
    const { resolveConfigDirEnv } = await importFreshEnvUtils()

    expect(
      resolveConfigDirEnv({
        lyaCloudConfigDir: undefined,
        legacyConfigDir: undefined,
      }),
    ).toBeUndefined()
  })

  test('project and local settings paths use .lyacloud', async () => {
    await acquireEnvMutex()
    const { getRelativeSettingsFilePathForSource } = await importFreshSettings()

    expect(getRelativeSettingsFilePathForSource('projectSettings')).toBe(
      '.lyacloud/settings.json',
    )
    expect(getRelativeSettingsFilePathForSource('localSettings')).toBe(
      '.lyacloud/settings.local.json',
    )
  })

  test('local installer uses lyacloud wrapper path', async () => {
    await acquireEnvMutex()
    // Force .lyacloud config home so the test doesn't fall back to
    // ~/.claude when ~/.lyacloud doesn't exist on this machine.
    process.env.CLAUDE_CONFIG_DIR = join(homedir(), '.lyacloud')
    const { getLocalClaudePath } = await importFreshLocalInstaller()

    expect(getLocalClaudePath()).toBe(
      join(homedir(), '.lyacloud', 'local', 'lyacloud'),
    )
  })

  test('local installation detection matches .lyacloud path', async () => {
    await acquireEnvMutex()
    const { isManagedLocalInstallationPath } =
      await importFreshLocalInstaller()

    expect(
      isManagedLocalInstallationPath(
        `${join(homedir(), '.lyacloud', 'local')}/node_modules/.bin/lyacloud`,
      ),
    ).toBe(true)
  })

  test('local installation detection still matches legacy .claude path', async () => {
    await acquireEnvMutex()
    const { isManagedLocalInstallationPath } =
      await importFreshLocalInstaller()

    expect(
      isManagedLocalInstallationPath(
        `${join(homedir(), '.claude', 'local')}/node_modules/.bin/lyacloud`,
      ),
    ).toBe(true)
  })

  test('candidate local install dirs include both lyacloud and legacy claude paths', async () => {
    await acquireEnvMutex()
    const { getCandidateLocalInstallDirs } = await importFreshLocalInstaller()

    expect(
      getCandidateLocalInstallDirs({
        configHomeDir: join(homedir(), '.lyacloud'),
        homeDir: homedir(),
      }),
    ).toEqual([
      join(homedir(), '.lyacloud', 'local'),
      join(homedir(), '.claude', 'local'),
    ])
  })

  test('legacy local installs are detected when they still expose the claude binary', async () => {
    await acquireEnvMutex()
    mock.module('fs/promises', () => ({
      ...fsPromises,
      access: async (path: string) => {
        if (
          path === join(homedir(), '.claude', 'local', 'node_modules', '.bin', 'claude')
        ) {
          return
        }
        throw Object.assign(new Error('ENOENT'), { code: 'ENOENT' })
      },
    }))

    const { getDetectedLocalInstallDir, localInstallationExists } =
      await importFreshLocalInstaller()

    expect(await localInstallationExists()).toBe(true)
    expect(await getDetectedLocalInstallDir()).toBe(
      join(homedir(), '.claude', 'local'),
    )
  })
})
