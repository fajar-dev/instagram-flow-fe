import { apiService } from '../api-service'
import { requestHeaders } from '../shared/request-headers'
import type { ApiResponse } from '~/types/api'
import type { Settings } from '~/types/settings'

class SettingsService {
  async settings() {
    return (
      await apiService.client.get<ApiResponse<Settings>>('/settings', { headers: requestHeaders() })
    ).data
  }

  async updateSettings(dispatchEnabled: boolean) {
    return (
      await apiService.client.patch<ApiResponse<Settings>>(
        '/settings',
        { dispatchEnabled },
        { headers: requestHeaders() }
      )
    ).data
  }
}

export const settingsService = new SettingsService()
