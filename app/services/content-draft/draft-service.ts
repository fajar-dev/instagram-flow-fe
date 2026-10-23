import type { ApiResponse } from '~/types/api'
import { apiService } from '../api-service'
import { requestHeaders } from '../shared/request-headers'
import type { Draft } from '~/types/content-draft'

class DraftService {
  async reject(
    draftId: string,
    payload: {
      contentHash: string
      notes: string
    }
  ) {
    return (
      await apiService.client.post<ApiResponse<Draft>>(`/drafts/${draftId}/reject`, payload, {
        headers: requestHeaders()
      })
    ).data
  }
}

export const draftService = new DraftService()
