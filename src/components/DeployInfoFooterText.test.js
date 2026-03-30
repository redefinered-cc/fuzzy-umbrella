import test from 'node:test'
import assert from 'node:assert/strict'
import { getDeployFooterText } from '../utils/deployTime.js'

test('footer text includes formatted deploy timestamp when metadata is available', () => {
  assert.equal(
    getDeployFooterText('2026-03-30T09:30:45Z'),
    'Last deployed: 2026-03-30 09:30:45 UTC',
  )
})

test('footer text includes fallback when metadata is unavailable', () => {
  assert.equal(
    getDeployFooterText(undefined),
    'Last deployed: Deploy time unavailable',
  )
})
