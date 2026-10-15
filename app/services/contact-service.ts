import { buildListQuery } from '../util/query'
import { authService } from './auth-service'
import { apiService } from './api-service'
import type { Contact, ContactPayload } from '../types/contact'
import type { SortOrder } from '../types/query'
import type { ApiResponse } from '../types/api'

export class ContactService {
  private get authHeaders() {
    return { headers: { Authorization: `Bearer ${authService.token.value}` } }
  }

  async getAll(page = 1, perPage = 10, q = '', sortBy = '', order: SortOrder = 'DESC'): Promise<ApiResponse<Contact[]>> {
    const params = buildListQuery({ page, perPage, q, sortBy, order })
    const response = await apiService.client.get<ApiResponse<Contact[]>>(
      `/contact?${params.toString()}`,
      this.authHeaders
    )
    return response.data
  }

  async getById(id: number): Promise<ApiResponse<Contact>> {
    const response = await apiService.client.get<ApiResponse<Contact>>(
      `/contact/${id}`,
      this.authHeaders
    )
    return response.data
  }

  async create(payload: ContactPayload): Promise<ApiResponse<Contact>> {
    const response = await apiService.client.post<ApiResponse<Contact>>(
      `/contact`,
      payload,
      this.authHeaders
    )
    return response.data
  }

  async update(id: number, payload: ContactPayload): Promise<ApiResponse<Contact>> {
    const response = await apiService.client.put<ApiResponse<Contact>>(
      `/contact/${id}`,
      payload,
      this.authHeaders
    )
    return response.data
  }

  async delete(id: number): Promise<ApiResponse<null>> {
    const response = await apiService.client.delete<ApiResponse<null>>(
      `/contact/${id}`,
      this.authHeaders
    )
    return response.data
  }
}

export const contactService = new ContactService()
