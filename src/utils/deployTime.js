export const FALLBACK_DEPLOY_MESSAGE = 'Last deployed: Deploy time unavailable'

function isEmpty(value) {
  return typeof value !== 'string' || value.trim().length === 0
}

export function formatDeployTime(deployedAt) {
  if (isEmpty(deployedAt)) {
    return null
  }

  const parsed = new Date(deployedAt)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(parsed)
}

export function getLastDeployedMessage(deployedAt) {
  const formatted = formatDeployTime(deployedAt)
  if (!formatted) {
    return FALLBACK_DEPLOY_MESSAGE
  }

  return `Last deployed: ${formatted} UTC`
}
