import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('renders the app and deploy fallback footer message', () => {
    vi.stubEnv('VITE_DEPLOYED_AT', '')
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Get started' })).toBeVisible()
    expect(screen.getByText('Last deployed: Deploy time unavailable')).toBeVisible()
    fireEvent.click(screen.getByRole('button', { name: 'Count is 0' }))
    expect(screen.getByRole('button', { name: 'Count is 1' })).toBeVisible()
  })

  it('renders a formatted deploy timestamp when metadata is available', () => {
    vi.stubEnv('VITE_DEPLOYED_AT', '2026-04-07T04:20:00Z')
    render(<App />)

    expect(screen.getByText('Last deployed: Apr 7, 2026, 4:20 AM UTC')).toBeVisible()
  })
})
