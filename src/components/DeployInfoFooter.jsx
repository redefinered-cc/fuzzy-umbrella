import { getLastDeployedMessage } from '../utils/deployTime'

function DeployInfoFooter({ deployedAt }) {
  return <p>{getLastDeployedMessage(deployedAt)}</p>
}

export default DeployInfoFooter
