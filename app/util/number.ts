export function formatMetric(value: number | null, locale: string) {
  return value === null ? '—' : new Intl.NumberFormat(locale).format(value)
}

export function formatRate(value: number | null | undefined, locale: string) {
  return value == null
    ? '—'
    : new Intl.NumberFormat(locale, {
        style: 'percent',
        maximumFractionDigits: 2
      }).format(value / 100)
}
