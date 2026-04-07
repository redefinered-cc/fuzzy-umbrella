import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import DeployInfoFooter from './DeployInfoFooter'

describe('DeployInfoFooter', () => {
  it('shows a UTC last deployed value when metadata is available', () => {
    render(<DeployInfoFooter deployedAt="2026-04-07T04:20:00Z" />)

    expect(screen.getByText(/^Last deployed:/)).toHaveTextContent(
      'Last deployed: Apr 7, 2026, 4:20 AM UTC',
    )
  })

  it('shows fallback text when metadata is missing', () => {
    render(<DeployInfoFooter deployedAt={undefined} />)

    expect(screen.getByText('Last deployed: Deploy time unavailable')).toBeVisible()
  })

  it('shows fallback text when metadata is invalid', () => {
    render(<DeployInfoFooter deployedAt="not-a-date" />)

    expect(screen.getByText('Last deployed: Deploy time unavailable')).toBeVisible()
  })
})
