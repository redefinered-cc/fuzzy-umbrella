import test from 'node:test'
import assert from 'node:assert/strict'
import { DeployFooter } from './DeployFooter.js'
import { DEPLOY_TIME_UNAVAILABLE_TEXT } from './deployTime.js'

function getDeployLabelFromElement(element) {
  assert.equal(element.type, 'footer')
  assert.equal(element.props.id, 'app-footer')

  const paragraph = element.props.children
  assert.equal(paragraph.type, 'p')

  const children = paragraph.props.children
  assert.equal(children[0], 'Last deployed: ')
  assert.equal(children[1].type, 'span')

  return children[1].props.children
}

test('renders formatted deploy timestamp when metadata is available', () => {
  const footerElement = DeployFooter({ deployedAt: '2026-04-07T10:30:00.000Z' })
  const deployLabel = getDeployLabelFromElement(footerElement)

  assert.equal(deployLabel.includes('UTC'), true)
  assert.equal(deployLabel.includes('Apr'), true)
})

test('renders fallback text when deploy metadata is unavailable', () => {
  const footerElement = DeployFooter({ deployedAt: undefined })
  const deployLabel = getDeployLabelFromElement(footerElement)

  assert.equal(deployLabel, DEPLOY_TIME_UNAVAILABLE_TEXT)
})
