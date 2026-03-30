import { getDeployFooterText } from '../utils/deployTime.js'

function DeployInfoFooter({ deployedAt }) {
  return (
    <footer id="deploy-info" aria-live="polite">
      <p>{getDeployFooterText(deployedAt)}</p>
    </footer>
  )
}

export default DeployInfoFooter
