export type DateInput = string | number | Date | null | undefined

const dateOptions: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
}

/** Empty or invalid dates use the same placeholder throughout the UI. */
export function formatDate(value: DateInput, locale = 'en-US', options: Intl.DateTimeFormatOptions = {}): string {
  if (value == null || value === '') return '-'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat(locale, { ...dateOptions, ...options }).format(date)
}

export function formatDateTime(value: DateInput, locale = 'en-US', options: Intl.DateTimeFormatOptions = {}): string {
  return formatDate(value, locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    ...options
  })
}
