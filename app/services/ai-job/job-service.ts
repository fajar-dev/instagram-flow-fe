import { apiService } from '../api-service'
import { requestHeaders } from '../shared/request-headers'
import type { ApiResponse } from '~/types/api'
import type { JobDetails } from '~/types/ai-job'

class JobService {
  async details(jobId: string) {
    return (
      await apiService.client.get<ApiResponse<JobDetails>>(`/jobs/${encodeURIComponent(jobId)}`, {
        headers: requestHeaders()
      })
    ).data
  }

  async process(batchId: string, output: 'feed' | 'story', key: string) {
    return (
      await apiService.client.post<
        ApiResponse<{
          jobId: string
        }>
      >(`/batches/${batchId}/process`, { output }, { headers: requestHeaders(key) })
    ).data
  }

  async retry(jobId: string, key: string) {
    return (
      await apiService.client.post<
        ApiResponse<{
          jobId: string
        }>
      >(`/jobs/${jobId}/retry`, {}, { headers: requestHeaders(key) })
    ).data
  }
}

export const jobService = new JobService()
