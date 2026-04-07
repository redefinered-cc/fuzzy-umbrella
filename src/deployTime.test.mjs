import test from 'node:test'
import assert from 'node:assert/strict'
import { DEPLOY_TIME_UNAVAILABLE_TEXT, formatDeployTime } from './deployTime.js'

test('formats valid ISO timestamps in UTC', () => {
  const value = formatDeployTime('2026-04-07T10:30:00.000Z')

  assert.equal(value.endsWith(' UTC'), true)
  assert.equal(value.includes('Apr'), true)
  assert.equal(value.includes('2026'), true)
})

test('returns fallback text for missing timestamps', () => {
  assert.equal(formatDeployTime(undefined), DEPLOY_TIME_UNAVAILABLE_TEXT)
  assert.equal(formatDeployTime(''), DEPLOY_TIME_UNAVAILABLE_TEXT)
})

test('returns fallback text for invalid timestamps', () => {
  assert.equal(formatDeployTime('not-a-date'), DEPLOY_TIME_UNAVAILABLE_TEXT)
})
