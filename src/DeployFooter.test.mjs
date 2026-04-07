import test from 'node:test'
import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'
import { DeployFooter } from './DeployFooter'
import { DEPLOY_TIME_UNAVAILABLE_TEXT } from './deployTime'

test('renders formatted deploy timestamp when metadata is available', () => {
  const html = renderToStaticMarkup(
    DeployFooter({ deployedAt: '2026-04-07T10:30:00.000Z' }),
  )

  assert.equal(html.includes('Last deployed:'), true)
  assert.equal(html.includes('UTC'), true)
  assert.equal(html.includes('Apr'), true)
})

test('renders fallback text when deploy metadata is unavailable', () => {
  const html = renderToStaticMarkup(DeployFooter({ deployedAt: undefined }))

  assert.equal(html.includes('Last deployed:'), true)
  assert.equal(html.includes(DEPLOY_TIME_UNAVAILABLE_TEXT), true)
})
