import type { ApiResponse } from '~/types/api'
import { apiService } from '../api-service'
import { requestHeaders } from '../shared/request-headers'
import type { Draft, Revision } from '~/types/content-review'

class DraftService {
  async edit(draftId: string, payload: Pick<Revision, 'primaryAssetId' | 'title' | 'caption' | 'hashtags' | 'location' | 'activity'> & {
    expectedRevisionId: string
  }) {
    return (await apiService.client.patch<ApiResponse<Revision>>(`/drafts/${draftId}`, payload, { headers: requestHeaders() })).data
  }

  async review(draftId: string, payload: {
    revisionId: string
    contentHash: string
    decision: string
    notes: string
  }) {
    return (await apiService.client.post<ApiResponse<Draft>>(`/drafts/${draftId}/review`, payload, { headers: requestHeaders() })).data
  }
}
export const draftService = new DraftService()
