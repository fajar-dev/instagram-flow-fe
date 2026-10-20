import { buildListQuery } from '../util/query'
import { requestHeaders } from './shared/request-headers'
import { apiService } from './api-service'
import type { User, UserPayload } from '../types/user'
import type { ApiResponse } from '../types/api'
import type { SortOrder } from '../types/query'

export class UserService {
  private get authHeaders() {
    return { headers: requestHeaders() }
  }

  async getAll(
    page = 1,
    perPage = 10,
    q = '',
    isActive = '',
    sortBy = '',
    order: SortOrder = 'DESC'
  ): Promise<ApiResponse<User[]>> {
    const params = buildListQuery({ page, perPage, q, sortBy, order })
    if (isActive !== '') {
      params.set('isActive', isActive)
    }
    const response = await apiService.client.get<ApiResponse<User[]>>(
      `/user?${params.toString()}`,
      this.authHeaders
    )
    return response.data
  }

  async getById(id: number): Promise<ApiResponse<User>> {
    const response = await apiService.client.get<ApiResponse<User>>(`/user/${id}`, this.authHeaders)
    return response.data
  }

  async create(payload: UserPayload): Promise<ApiResponse<User>> {
    const response = await apiService.client.post<ApiResponse<User>>(
      `/user`,
      payload,
      this.authHeaders
    )
    return response.data
  }

  async update(id: number, payload: UserPayload): Promise<ApiResponse<User>> {
    const response = await apiService.client.put<ApiResponse<User>>(
      `/user/${id}`,
      payload,
      this.authHeaders
    )
    return response.data
  }

  async delete(id: number): Promise<ApiResponse<null>> {
    const response = await apiService.client.delete<ApiResponse<null>>(
      `/user/${id}`,
      this.authHeaders
    )
    return response.data
  }

  async uploadPhoto(file: File): Promise<ApiResponse<{ path: string }>> {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiService.client.post<ApiResponse<{ path: string }>>(
      `/upload`,
      formData,
      {
        headers: {
          ...requestHeaders(),
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data
  }
}

export const userService = new UserService()
