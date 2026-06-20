import { beforeAll, describe, expect, test } from 'bun:test'
import { homedir } from 'os'
import {
  resetClaudeConfigHomeDirCacheForTesting,
  setClaudeConfigHomeDirForTesting,
} from '../envUtils.js'
import { hookSourceDescriptionDisplayString } from './hooksSettings.js'
import { restoreOsMock } from '../../test/osMock.js'

describe('hookSourceDescriptionDisplayString', () => {
  beforeAll(() => {
    // Reset the memoized getClaudeConfigHomeDir() override that other
    // suites may have left behind, so this test reads the canonical
    // ~/.lyacode path from homedir().
    setClaudeConfigHomeDirForTesting(undefined)
    // Also restore any LYACODE_CONFIG_DIR / CLAUDE_CONFIG_DIR overrides
    // left behind by prior suites so the memo key matches the real env.
    delete process.env.LYACODE_CONFIG_DIR
    delete process.env.CLAUDE_CONFIG_DIR
    // Force the real os.homedir() in case a prior suite mocked it
    // without fully restoring.
    restoreOsMock()
    // Wipe the memo cache so the next call resolves against the
    // restored env (some suites set the override without clearing).
    resetClaudeConfigHomeDirCacheForTesting()
  })

  test('uses the canonical Lya Code plugin path for plugin hooks', () => {
    const realHome = homedir()
    const description = hookSourceDescriptionDisplayString('pluginHook')

    // Accept either POSIX or Windows separators. The redaction helper
    // preserves the native separator on Windows because users on
    // Windows expect to see their native paths in /status output.
    const expectedPosix =
      'Plugin hooks (~/.lyacode/plugins/*/hooks/hooks.json)'
    const expectedWindows =
      'Plugin hooks (~\\.lyacode\\plugins\\*\\hooks\\hooks.json)'
    expect(description).toBe(
      process.platform === 'win32' ? expectedWindows : expectedPosix,
    )
    expect(description).not.toContain('~/.claude/')
    // Defensive: if a prior suite mocked os.homedir() to a temp dir,
    // the path leaks. This guards against silent side-effects.
    expect(description).not.toContain(realHome.slice(0, 3))
  })
})
