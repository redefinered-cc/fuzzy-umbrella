import { getLastDeployedMessage } from '../utils/deployTime'

function DeployInfoFooter({ deployedAt }) {
  return <p className="deploy-info">{getLastDeployedMessage(deployedAt)}</p>
}

export default DeployInfoFooter
