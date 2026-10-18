import { apiService } from '../api-service'
import { requestHeaders } from '../shared/request-headers'
import type { ApiResponse } from '~/types/api'

class ReportingService {
  async list<T>(resource: string, params: Record<string, string | number> = {}) {
    return (await apiService.client.get<ApiResponse<T[]>>(`/${resource}`, { headers: requestHeaders(), params })).data
  }

  async contentCounts(days: number) {
    return (await apiService.client.get<ApiResponse<Record<string, number>>>('/content/counts', { headers: requestHeaders(), params: { days } })).data
  }

  async overview(days: number) {
    return (await apiService.client.get<ApiResponse<Record<string, number>>>('/overview', { headers: requestHeaders(), params: { days } })).data
  }
}
export const reportingService = new ReportingService()
