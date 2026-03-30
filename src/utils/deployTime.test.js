import {
  DEPLOY_TIME_UNAVAILABLE,
  getDeployTimeDisplay,
  getDeployFooterText,
} from './deployTime.js'
import test from 'node:test'
import assert from 'node:assert/strict'

test('deployTime utils: formats valid timestamps in UTC', () => {
  assert.equal(
    getDeployTimeDisplay('2026-03-30T09:10:11Z'),
    '2026-03-30 09:10:11 UTC',
  )
})

test('deployTime utils: returns fallback for missing timestamps', () => {
  assert.equal(getDeployTimeDisplay(), DEPLOY_TIME_UNAVAILABLE)
  assert.equal(getDeployTimeDisplay(''), DEPLOY_TIME_UNAVAILABLE)
})

test('deployTime utils: returns fallback for invalid timestamps', () => {
  assert.equal(getDeployTimeDisplay('not-a-date'), DEPLOY_TIME_UNAVAILABLE)
})

test('deployTime utils: builds footer text for available metadata', () => {
  assert.equal(
    getDeployFooterText('2026-03-30T09:10:11Z'),
    'Last deployed: 2026-03-30 09:10:11 UTC',
  )
})

test('deployTime utils: builds footer text for unavailable metadata', () => {
  assert.equal(
    getDeployFooterText('not-a-date'),
    `Last deployed: ${DEPLOY_TIME_UNAVAILABLE}`,
  )
})
