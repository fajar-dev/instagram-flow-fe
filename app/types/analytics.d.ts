export type AnalyticsPeriod = 'today' | 'this_week' | 'this_month' | 'last_7_days' | 'last_30_days'

export interface InsightMetric {
  name: string
  value: number | null
}

export interface InstagramMedia {
  id: string
  caption: string
  type: string
  product: string
  timestamp: string
  permalink: string | null
}

export interface InsightReport {
  previous?: InsightReport
  range?: { since: number, until: number }
  engagementRate: number | null
  metrics: InsightMetric[]
  fetchedAt: string
  media?: InstagramMedia
}

export interface TopPostsReport {
  items: (InsightReport & { media: InstagramMedia })[]
  sampled: number
  unavailable: number
  limit: number
  after: string | null
  fetchedAt: string
}
