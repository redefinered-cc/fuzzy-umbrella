import { formatDeployTime } from './deployTime'

export function DeployFooter({ deployedAt }) {
  const deployTimeLabel = formatDeployTime(deployedAt)

  return (
    <footer id="app-footer">
      <p>
        Last deployed: <span>{deployTimeLabel}</span>
      </p>
    </footer>
  )
}
