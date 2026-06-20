import assert from 'node:assert/strict'
import test from 'node:test'

import { extractGitHubRepoSlug } from './repoSlug.ts'

test('keeps owner/repo input as-is', () => {
  assert.equal(extractGitHubRepoSlug('StudioCodeAI/lyacode'), 'StudioCodeAI/lyacode')
})

test('extracts slug from https GitHub URLs', () => {
  assert.equal(
    extractGitHubRepoSlug('https://github.com/StudioCodeAI/lyacode'),
    'StudioCodeAI/lyacode',
  )
  assert.equal(
    extractGitHubRepoSlug('https://www.github.com/StudioCodeAI/lyacode.git'),
    'StudioCodeAI/lyacode',
  )
})

test('extracts slug from ssh GitHub URLs', () => {
  assert.equal(
    extractGitHubRepoSlug('git@github.com:StudioCodeAI/lyacode.git'),
    'StudioCodeAI/lyacode',
  )
  assert.equal(
    extractGitHubRepoSlug('ssh://git@github.com/StudioCodeAI/lyacode'),
    'StudioCodeAI/lyacode',
  )
})

test('rejects malformed or non-GitHub URLs', () => {
  assert.equal(extractGitHubRepoSlug('https://gitlab.com/StudioCodeAI/lyacode'), null)
  assert.equal(extractGitHubRepoSlug('https://github.com/Gitlawb'), null)
  assert.equal(extractGitHubRepoSlug('not actually github.com/StudioCodeAI/lyacode'), null)
  assert.equal(
    extractGitHubRepoSlug('https://evil.example/?next=github.com/StudioCodeAI/lyacode'),
    null,
  )
  assert.equal(
    extractGitHubRepoSlug('https://github.com.evil.example/StudioCodeAI/lyacode'),
    null,
  )
  assert.equal(
    extractGitHubRepoSlug('https://example.com/github.com/StudioCodeAI/lyacode'),
    null,
  )
})
