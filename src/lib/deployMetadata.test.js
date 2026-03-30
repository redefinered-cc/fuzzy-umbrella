import { describe, expect, it } from 'vitest'
import {
  DEPLOY_TIME_UNAVAILABLE,
  formatDeployTimestamp,
  getDeployTimeDisplay,
} from './deployMetadata'

describe('deployMetadata', () => {
  it('formats a valid timestamp in UTC', () => {
    const result = formatDeployTimestamp('2026-03-30T10:45:00.000Z')

    expect(result).toBe('2026-03-30 10:45 UTC')
  })

  it('returns null for invalid timestamp input', () => {
    const result = formatDeployTimestamp('not-a-date')

    expect(result).toBeNull()
  })

  it('returns null for empty timestamp input', () => {
    const result = formatDeployTimestamp('   ')

    expect(result).toBeNull()
  })

  it('returns unavailable label when timestamp is missing', () => {
    const result = getDeployTimeDisplay(undefined)

    expect(result).toBe(DEPLOY_TIME_UNAVAILABLE)
  })
})
