import { apiService } from '../api-service'
import { requestHeaders } from '../shared/request-headers'
import type { ApiResponse } from '~/types/api'
import type { InsightReport, TopPostsReport, AnalyticsPeriod } from '~/types/analytics'

class AnalyticsService {
  private async get<T>(path: string, params: Record<string, string | number> = {}) {
    return (
      await apiService.client.get<ApiResponse<T>>(path, { params, headers: requestHeaders() })
    ).data
  }

  account(key: string, period: AnalyticsPeriod) {
    return this.get<InsightReport>(`/instagram/accounts/${encodeURIComponent(key)}/insights`, {
      period
    })
  }

  topPosts(key: string, after?: string) {
    return this.get<TopPostsReport>(
      `/instagram/accounts/${encodeURIComponent(key)}/top-posts`,
      after ? { after } : {}
    )
  }

  publication(id: string) {
    return this.get<InsightReport>(`/publications/${encodeURIComponent(id)}/insights`)
  }
}

export const analyticsService = new AnalyticsService()
