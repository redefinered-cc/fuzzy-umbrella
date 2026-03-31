export const DEPLOY_TIME_FALLBACK = 'Deploy time unavailable'

const DEPLOY_TIME_PREFIX = 'Last deployed: '
const DEPLOY_TIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'UTC',
})

export function formatDeployTimeUtc(rawTimestamp) {
  if (typeof rawTimestamp !== 'string') {
    return null
  }

  const normalizedTimestamp = rawTimestamp.trim()
  if (!normalizedTimestamp) {
    return null
  }

  const parsedDate = new Date(normalizedTimestamp)
  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  return `${DEPLOY_TIME_FORMATTER.format(parsedDate)} UTC`
}

export function getDeployTimeDisplay(rawTimestamp) {
  const formattedDeployTime = formatDeployTimeUtc(rawTimestamp)
  if (!formattedDeployTime) {
    return DEPLOY_TIME_FALLBACK
  }

  return `${DEPLOY_TIME_PREFIX}${formattedDeployTime}`
}
