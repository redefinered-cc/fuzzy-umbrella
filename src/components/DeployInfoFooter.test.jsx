import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DeployInfoFooter } from './DeployInfoFooter'

describe('DeployInfoFooter', () => {
  it('shows formatted deploy time when metadata is available', () => {
    render(<DeployInfoFooter deployedAt="2026-03-30T10:45:00.000Z" />)

    expect(
      screen.getByText('Last deployed: 2026-03-30 10:45 UTC'),
    ).toBeInTheDocument()
  })

  it('shows fallback text when metadata is unavailable', () => {
    render(<DeployInfoFooter deployedAt={undefined} />)

    expect(screen.getByText('Last deployed: Deploy time unavailable')).toBeInTheDocument()
  })
})
