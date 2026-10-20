import { apiService } from '../api-service'
import { requestHeaders } from '../shared/request-headers'
import type { ApiResponse } from '~/types/api'
import type { InstagramAccount } from '~/types/publishing'

class InstagramService {
  async accounts() {
    return (
      await apiService.client.get<ApiResponse<InstagramAccount[]>>('/instagram/accounts', {
        headers: requestHeaders()
      })
    ).data
  }

  async verify(key: string) {
    return (
      await apiService.client.post<ApiResponse<{ id: string, username: string }>>(
        `/instagram/accounts/${encodeURIComponent(key)}/verify`,
        {},
        { headers: requestHeaders() }
      )
    ).data
  }
}

export const instagramService = new InstagramService()
