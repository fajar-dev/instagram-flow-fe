import { apiService } from '../api-service'
import { requestHeaders } from '../shared/request-headers'
import type { ApiResponse } from '~/types/api'
import type { Publication, PublicationPayload } from '~/types/publishing'

class PublicationService {
  async list(draftId: string) {
    return (await apiService.client.get<ApiResponse<Publication[]>>(`/drafts/${encodeURIComponent(draftId)}/publications`, { headers: requestHeaders() })).data
  }

  async create(draftId: string, payload: PublicationPayload, key: string) {
    return (await apiService.client.post<ApiResponse<Publication>>(`/drafts/${encodeURIComponent(draftId)}/publications`, payload, { headers: requestHeaders(key) })).data
  }

  async cancel(id: string) {
    return (await apiService.client.post<ApiResponse<Publication>>(`/publications/${encodeURIComponent(id)}/cancel`, {}, { headers: requestHeaders() })).data
  }

  async retry(id: string) {
    return (await apiService.client.post<ApiResponse<Publication>>(`/publications/${encodeURIComponent(id)}/retry`, {}, { headers: requestHeaders() })).data
  }
}
export const publicationService = new PublicationService()
