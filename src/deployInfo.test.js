import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'
import {
  DEPLOY_TIME_FALLBACK,
  formatDeployTimeUtc,
  getDeployTimeDisplay,
} from './deployInfo.js'

describe('formatDeployTimeUtc', () => {
  it('formats a valid ISO timestamp in UTC', () => {
    const formatted = formatDeployTimeUtc('2026-03-31T12:34:56Z')
    assert.equal(formatted, 'Mar 31, 2026, 12:34:56 UTC')
  })

  it('returns null for missing or invalid timestamps', () => {
    assert.equal(formatDeployTimeUtc(), null)
    assert.equal(formatDeployTimeUtc(''), null)
    assert.equal(formatDeployTimeUtc('not-a-date'), null)
  })
})

describe('getDeployTimeDisplay', () => {
  it('returns prefixed deploy text when metadata is available', () => {
    const display = getDeployTimeDisplay('2026-03-31T12:34:56Z')
    assert.equal(display, 'Last deployed: Mar 31, 2026, 12:34:56 UTC')
  })

  it('returns a clear fallback when metadata is unavailable', () => {
    assert.equal(getDeployTimeDisplay(undefined), DEPLOY_TIME_FALLBACK)
    assert.equal(getDeployTimeDisplay('   '), DEPLOY_TIME_FALLBACK)
  })
})
