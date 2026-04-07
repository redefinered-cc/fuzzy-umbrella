export const DEPLOY_TIME_UNAVAILABLE_TEXT = 'Deploy time unavailable'

const DEPLOY_TIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'medium',
  timeZone: 'UTC',
})

export function formatDeployTime(deployedAt) {
  if (typeof deployedAt !== 'string' || deployedAt.trim() === '') {
    return DEPLOY_TIME_UNAVAILABLE_TEXT
  }

  const parsedDate = new Date(deployedAt)
  if (Number.isNaN(parsedDate.getTime())) {
    return DEPLOY_TIME_UNAVAILABLE_TEXT
  }

  return `${DEPLOY_TIME_FORMATTER.format(parsedDate)} UTC`
}
