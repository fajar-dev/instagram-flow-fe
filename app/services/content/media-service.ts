import type { ApiResponse } from '~/types/api'
import { apiService } from '../api-service'
import { requestHeaders } from '../shared/request-headers'

class MediaService {
  async previews(assetId: string) {
    return (
      await apiService.client.get<ApiResponse<{ previewUrl: string, thumbnailUrl: string }>>(
        `/assets/${assetId}/previews`,
        { headers: requestHeaders() }
      )
    ).data
  }

  async file(path: string) {
    return (
      await apiService.client.get<Blob>(`/${path}`, {
        headers: requestHeaders(),
        responseType: 'blob'
      })
    ).data
  }

  async archive(assetId: string) {
    return (
      await apiService.client.delete<ApiResponse<null>>(`/assets/${assetId}`, {
        headers: requestHeaders()
      })
    ).data
  }
}

export const mediaService = new MediaService()
