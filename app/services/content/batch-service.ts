import { apiService } from '../api-service'
import { requestHeaders } from '../shared/request-headers'
import type { ApiResponse } from '~/types/api'
import type { Asset as ContentAsset, Batch, UploadLimits } from '~/types/content'

class BatchService {
  async limits() {
    return (await apiService.client.get<ApiResponse<UploadLimits>>('/batches/limits', { headers: requestHeaders() })).data
  }

  async batch(payload: Omit<Batch, 'id' | 'uploaderId' | 'status' | 'createdAt'>, key: string) {
    return (await apiService.client.post<ApiResponse<Batch>>('/batches', payload, { headers: requestHeaders(key) })).data
  }

  async upload(batchId: string, file: File, onProgress: (percent: number) => void) {
    const form = new FormData()
    form.append('file', file)
    return (await apiService.client.post<ApiResponse<ContentAsset>>(`/batches/${batchId}/assets`, form, { headers: requestHeaders(), onUploadProgress: (event) => {
      if (event.total)
        onProgress(Math.round(event.loaded / event.total * 100))
    } })).data
  }
}
export const batchService = new BatchService()
