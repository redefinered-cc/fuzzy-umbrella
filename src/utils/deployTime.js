export const DEPLOY_TIME_UNAVAILABLE = 'Deploy time unavailable'

const isValidTimestamp = (value) => {
  if (typeof value !== 'string' || value.trim() === '') {
    return false
  }

  const timestamp = Date.parse(value)
  return !Number.isNaN(timestamp)
}

const formatUtcDate = (date) => {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`
}

export const getDeployTimeDisplay = (rawDeployTime) => {
  if (!isValidTimestamp(rawDeployTime)) {
    return DEPLOY_TIME_UNAVAILABLE
  }

  const deployDate = new Date(rawDeployTime)
  return formatUtcDate(deployDate)
}

export const getDeployFooterText = (rawDeployTime) => {
  return `Last deployed: ${getDeployTimeDisplay(rawDeployTime)}`
}
