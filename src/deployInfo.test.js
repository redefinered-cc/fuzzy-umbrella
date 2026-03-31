import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DEPLOY_TIME_UNAVAILABLE,
  formatDeployTimestamp,
  getDeployFooterText,
} from './deployInfo.js'

test('formatDeployTimestamp formats a valid ISO timestamp in UTC', () => {
  assert.equal(
    formatDeployTimestamp('2026-03-30T11:22:33.000Z'),
    'Mar 30, 2026, 11:22:33 UTC',
  )
})

test('formatDeployTimestamp returns null when timestamp is missing', () => {
  assert.equal(formatDeployTimestamp(undefined), null)
  assert.equal(formatDeployTimestamp(''), null)
  assert.equal(formatDeployTimestamp('   '), null)
})

test('formatDeployTimestamp returns null when timestamp is invalid', () => {
  assert.equal(formatDeployTimestamp('not-a-date'), null)
})

test('getDeployFooterText returns formatted text when timestamp is valid', () => {
  assert.equal(
    getDeployFooterText('2026-03-30T11:22:33.000Z'),
    'Last deployed: Mar 30, 2026, 11:22:33 UTC',
  )
})

test('getDeployFooterText returns fallback text when timestamp is unavailable', () => {
  assert.equal(
    getDeployFooterText(undefined),
    `Last deployed: ${DEPLOY_TIME_UNAVAILABLE}`,
  )
})
