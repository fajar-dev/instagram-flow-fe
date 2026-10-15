import { readonly, ref } from 'vue'
import { apiService } from './api-service'
import type { AuthResponse, User } from '../types/auth'
import type { ApiResponse } from '../types/api'
import type { UpdatePasswordPayload, UpdateProfilePayload } from '../types/profile'

export class AuthService {
  private readonly userState = ref<User | null>(null)
  private readonly tokenState = ref<string | null>(null)
  readonly user = readonly(this.userState)
  readonly token = readonly(this.tokenState)
  private sessionVersion = 0

  async initialize() {
    if (typeof window === 'undefined') return
    this.tokenState.value = localStorage.getItem('accessToken')
    if (!this.token.value) return
    try {
      const stored = localStorage.getItem('user')
      if (stored) this.userState.value = JSON.parse(stored)
    } catch {
      this.clearSession()
      return
    }
    const version = this.sessionVersion
    try {
      const response = await apiService.client.get<ApiResponse<User>>('/auth/me', {
        headers: { Authorization: `Bearer ${this.token.value}` }
      })
      if (!this.token.value || (version !== this.sessionVersion && this.user.value?.id !== response.data.data.id)) return
      this.userState.value = response.data.data
      localStorage.setItem('user', JSON.stringify(response.data.data))
    } catch {
      // The interceptor expires rejected credentials; transient outages keep the session.
    }
  }

  clearSession() {
    this.sessionVersion++
    this.tokenState.value = null
    this.userState.value = null
    if (typeof window === 'undefined') return
    for (const key of ['accessToken', 'refreshToken', 'user']) localStorage.removeItem(key)
  }

  async refreshToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) return null
    const version = this.sessionVersion
    const response = await apiService.client.post<AuthResponse>('/auth/refresh', { refreshToken })
    if (version !== this.sessionVersion) return null
    this.setSession(response.data)
    return response.data.data.accessToken
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiService.client.post<AuthResponse>('/auth/login', { email, password })
    this.setSession(response.data)
    return response.data
  }

  async google(code: string): Promise<AuthResponse> {
    const response = await apiService.client.post<AuthResponse>('/auth/google', { code })
    this.setSession(response.data)
    return response.data
  }

  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    const response = await apiService.client.post<ApiResponse<null>>('/auth/forgot-password', { email })
    return response.data
  }

  async validateResetPassword(email: string, token: string): Promise<ApiResponse<null>> {
    const response = await apiService.client.get<ApiResponse<null>>('/auth/validate-reset-token', { params: { email, token } })
    return response.data
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<null>> {
    const response = await apiService.client.post<ApiResponse<null>>('/auth/reset-password', { token, newPassword })
    return response.data
  }

  async updateProfile(payload: UpdateProfilePayload): Promise<ApiResponse<User>> {
    const userId = this.user.value?.id
    const response = await apiService.client.put<ApiResponse<User>>('/auth/profile', payload, {
      headers: { Authorization: `Bearer ${this.token.value}` }
    })
    if (response.data.success && this.token.value && this.user.value?.id === userId) {
      this.userState.value = response.data.data
      if (typeof window !== 'undefined') localStorage.setItem('user', JSON.stringify(response.data.data))
    }
    return response.data
  }

  async updatePassword(payload: UpdatePasswordPayload): Promise<ApiResponse<null>> {
    const userId = this.user.value?.id
    const response = await apiService.client.put<ApiResponse<null>>('/auth/password', payload, {
      headers: { Authorization: `Bearer ${this.token.value}` }
    })
    if (response.data.success && this.token.value && this.user.value?.id === userId && this.userState.value) {
      this.userState.value = { ...this.userState.value, hasPassword: true }
      if (typeof window !== 'undefined') localStorage.setItem('user', JSON.stringify(this.userState.value))
    }
    return response.data
  }

  async logout() {
    const accessToken = this.token.value
    this.clearSession()
    if (accessToken) {
      await apiService.client.post('/auth/logout', null, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
    }
  }

  private setSession(response: AuthResponse) {
    this.sessionVersion++
    const { user, accessToken, refreshToken } = response.data
    this.tokenState.value = accessToken
    this.userState.value = user
    if (typeof window === 'undefined') return
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))
  }
}

export const authService = new AuthService()
