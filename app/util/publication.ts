import type { PublicationStatus } from '~/types/publishing'

/** Calendar fields are explicitly WIB, independent of the browser timezone. */
export function publicationSchedule(date: string, time: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    return null
  }
  const value = new Date(`${date}T${time}:00+07:00`)
  if (!Number.isFinite(value.getTime())) {
    return null
  }
  const calendar = new Date(value.getTime() + 7 * 3600000).toISOString().slice(0, 10)
  return calendar === date ? value.toISOString() : null
}

export function publicationColor(status: PublicationStatus) {
  if (status === 'PUBLISHED') {
    return 'success' as const
  }
  if (status === 'FAILED') {
    return 'error' as const
  }
  if (status === 'UNKNOWN') {
    return 'warning' as const
  }
  if (status === 'CANCELLED') {
    return 'neutral' as const
  }
  return 'primary' as const
}
