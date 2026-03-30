export const DEPLOY_TIME_UNAVAILABLE = 'Deploy time unavailable'

function padTwoDigits(value) {
  return String(value).padStart(2, '0')
}

export function formatDeployTimestamp(rawDeployTimestamp) {
  if (typeof rawDeployTimestamp !== 'string') {
    return null
  }

  const trimmedTimestamp = rawDeployTimestamp.trim()
  if (!trimmedTimestamp) {
    return null
  }

  const parsedDate = new Date(trimmedTimestamp)
  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  const year = parsedDate.getUTCFullYear()
  const month = padTwoDigits(parsedDate.getUTCMonth() + 1)
  const day = padTwoDigits(parsedDate.getUTCDate())
  const hours = padTwoDigits(parsedDate.getUTCHours())
  const minutes = padTwoDigits(parsedDate.getUTCMinutes())

  return `${year}-${month}-${day} ${hours}:${minutes} UTC`
}

export function getDeployTimeDisplay(rawDeployTimestamp) {
  return formatDeployTimestamp(rawDeployTimestamp) ?? DEPLOY_TIME_UNAVAILABLE
}
