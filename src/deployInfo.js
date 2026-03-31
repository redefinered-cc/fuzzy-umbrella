export const DEPLOY_TIME_UNAVAILABLE = 'Deploy time unavailable'

const deployDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'UTC',
})

export function formatDeployTimestamp(rawTimestamp) {
  if (typeof rawTimestamp !== 'string' || rawTimestamp.trim().length === 0) {
    return null
  }

  const deployDate = new Date(rawTimestamp)
  if (Number.isNaN(deployDate.getTime())) {
    return null
  }

  return `${deployDateFormatter.format(deployDate)} UTC`
}

export function getDeployFooterText(rawTimestamp) {
  const formatted = formatDeployTimestamp(rawTimestamp)
  const deployValue = formatted ?? DEPLOY_TIME_UNAVAILABLE
  return `Last deployed: ${deployValue}`
}
