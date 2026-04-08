import { describe, expect, it } from 'vitest'
import {
  FALLBACK_DEPLOY_MESSAGE,
  formatDeployTime,
  getLastDeployedMessage,
} from './deployTime'

describe('deployTime utilities', () => {
  it('formats valid deployed time in UTC', () => {
    expect(formatDeployTime('2026-04-07T04:20:00Z')).toBe('Apr 7, 2026, 4:20 AM')
  })

  it('returns null for empty or whitespace-only deployed time', () => {
    expect(formatDeployTime('')).toBeNull()
    expect(formatDeployTime('   ')).toBeNull()
  })

  it('returns null for invalid deployed time', () => {
    expect(formatDeployTime('not-a-date')).toBeNull()
  })

  it('returns fallback message for missing, invalid, and whitespace values', () => {
    expect(getLastDeployedMessage(undefined)).toBe(FALLBACK_DEPLOY_MESSAGE)
    expect(getLastDeployedMessage('not-a-date')).toBe(FALLBACK_DEPLOY_MESSAGE)
    expect(getLastDeployedMessage('   ')).toBe(FALLBACK_DEPLOY_MESSAGE)
  })

  it('returns formatted message suffix for valid deployed time', () => {
    expect(getLastDeployedMessage('2026-04-07T04:20:00Z')).toBe(
      'Last deployed: Apr 7, 2026, 4:20 AM UTC',
    )
  })
})
