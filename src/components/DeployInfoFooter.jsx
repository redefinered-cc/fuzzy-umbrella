import PropTypes from 'prop-types'
import { getLastDeployedMessage } from '../utils/deployTime'

function DeployInfoFooter({ deployedAt }) {
  return <p className="deploy-info">{getLastDeployedMessage(deployedAt)}</p>
}

DeployInfoFooter.propTypes = {
  deployedAt: PropTypes.string,
}

export default DeployInfoFooter
