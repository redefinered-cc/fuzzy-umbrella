import React from 'react'
import { getDeployTimeDisplay } from '../lib/deployMetadata'

export function DeployInfoFooter({ deployedAt }) {
  const deployTimeDisplay = getDeployTimeDisplay(deployedAt)

  return React.createElement(
    'footer',
    {
      className: 'deploy-footer',
      'aria-live': 'polite',
    },
    `Last deployed: ${deployTimeDisplay}`,
  )
}
