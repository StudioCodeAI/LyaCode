import { mock } from 'bun:test'
import * as realOs from 'os'
import * as realNodeOs from 'node:os'

/**
 * Reset os.homedir() to the real implementation.
 *
 * Several test suites temporarily mock `os.homedir()` (or
 * `node:os.homedir()`) to redirect filesystem paths. Bun's
 * `mock.restore()` does not always reset these mocks across sibling
 * modules in the same test process, so a later suite can inherit a
 * stale `homedir` override and observe temp-directory paths in
 * production code that reads from `os.homedir()` or
 * `process.env.HOME`.
 *
 * Call this at the start of every suite that depends on the real
 * `os.homedir()` (or its absence) so leftover overrides from prior
 * suites cannot poison expectations. Re-installs the real module
 * for both `os` and `node:os` aliases.
 */
export function restoreOsMock(): void {
  // Wipe ALL active mocks first. `mock.restore()` only restores the
  // most-recent registration on each module; multiple suites mocking
  // os/node:os leave layers that need clearing.
  try {
    mock.restore()
  } catch {
    // ignore — nothing to restore
  }
  // Then re-pin both `os` and `node:os` to the real implementations
  // so any cached import that captured a mocked version is reset.
  mock.module('os', () => realOs)
  mock.module('node:os', () => realNodeOs)
}
