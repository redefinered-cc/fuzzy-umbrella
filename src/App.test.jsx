import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the app and deploy fallback footer message', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Get started' })).toBeVisible()
    expect(screen.getByText('Last deployed: Deploy time unavailable')).toBeVisible()
  })
})
