import type { InsightReport } from '~/types/analytics'

/** A zero baseline has no percentage change; rates use percentage-point differences. */
export function metricTrend(current: number | null, previous: number | null, rate = false) {
  if (current === null || previous === null) {
    return { direction: 'unavailable', value: null } as const
  }
  const difference = current - previous
  const direction = difference > 0 ? 'up' : difference < 0 ? 'down' : 'flat'
  const value = rate
    ? Math.abs(difference)
    : previous === 0
      ? current === 0
        ? 0
        : null
      : Math.abs((difference / previous) * 100)
  return { direction, value }
}

export function insightValue(report: InsightReport | undefined, name: string): number | null {
  if (!report) {
    return null
  }
  return name === 'engagementRate'
    ? report.engagementRate
    : (report.metrics.find(metric => metric.name === name)?.value ?? null)
}

/** Scale both periods against the same maximum on each spoke; never treat missing data as zero. */
export function radarMetrics(report: InsightReport) {
  return ['reach', 'likes', 'comments', 'saves', 'shares', 'engagementRate'].flatMap((name) => {
    const current = insightValue(report, name)
    const previous = insightValue(report.previous, name)
    if (current === null || previous === null) {
      return []
    }
    const max = Math.max(current, previous)
    return [
      { name, current: max ? (current / max) * 100 : 0, previous: max ? (previous / max) * 100 : 0 }
    ]
  })
}
