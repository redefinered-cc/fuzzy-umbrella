import { describe, expect, it } from 'vitest'
import {
  DEPLOY_TIME_UNAVAILABLE,
  formatDeployTimestamp,
  getDeployTimeValue,
} from './deployInfo.js'

describe('formatDeployTimestamp', () => {
  it('formats a valid ISO timestamp in UTC', () => {
    expect(formatDeployTimestamp('2026-03-30T11:22:33.000Z')).toBe(
      'Mar 30, 2026, 11:22:33 UTC',
    )
  })

  it('returns null when timestamp is missing', () => {
    expect(formatDeployTimestamp(undefined)).toBeNull()
    expect(formatDeployTimestamp('')).toBeNull()
    expect(formatDeployTimestamp('   ')).toBeNull()
  })

  it('returns null when timestamp is invalid', () => {
    expect(formatDeployTimestamp('not-a-date')).toBeNull()
  })
})

describe('getDeployTimeValue', () => {
  it('returns formatted value when timestamp is valid', () => {
    expect(getDeployTimeValue('2026-03-30T11:22:33.000Z')).toBe(
      'Mar 30, 2026, 11:22:33 UTC',
    )
  })

  it('returns fallback value when timestamp is unavailable', () => {
    expect(getDeployTimeValue(undefined)).toBe(DEPLOY_TIME_UNAVAILABLE)
  })
})
