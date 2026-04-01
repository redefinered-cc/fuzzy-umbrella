import React from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'
import { DEPLOY_TIME_UNAVAILABLE } from './deployInfo'

describe('App footer deploy timestamp', () => {
  it('renders footer with formatted deploy timestamp when available', () => {
    render(<App deployTimestamp="2026-03-30T11:22:33.000Z" />)

    expect(screen.getByText('Last deployed:')).toBeInTheDocument()
    expect(screen.getByText('Mar 30, 2026, 11:22:33 UTC')).toBeInTheDocument()
  })

  it('renders footer fallback when deploy timestamp is unavailable', () => {
    render(<App deployTimestamp="" />)

    expect(screen.getByText('Last deployed:')).toBeInTheDocument()
    expect(screen.getByText(DEPLOY_TIME_UNAVAILABLE)).toBeInTheDocument()
  })
})
