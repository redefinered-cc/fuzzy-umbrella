import { createElement } from 'react'
import { formatDeployTime } from './deployTime'

export function DeployFooter({ deployedAt }) {
  const deployTimeLabel = formatDeployTime(deployedAt)

  return createElement(
    'footer',
    { id: 'app-footer' },
    createElement(
      'p',
      null,
      'Last deployed: ',
      createElement('span', null, deployTimeLabel),
    ),
  )
}
