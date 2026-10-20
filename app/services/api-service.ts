import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

interface AuthHandlers {
  refresh: () => Promise<string | null>
  expire: () => void
  token: () => string | null
}

export class ApiService {
  private instance?: AxiosInstance

  private auth?: AuthHandlers

  private refreshPromise: Promise<string | null> | null = null

  configure(baseURL: string, locale: () => string) {
    this.instance = axios.create({ baseURL, headers: { Accept: 'application/json' } })
    this.instance.interceptors.request.use((request) => {
      request.headers.set('Accept-Language', locale())
      return request
    })
    this.instance.interceptors.response.use(
      response => response,
      async (error: unknown) => {
        if (!axios.isAxiosError(error)) {
          throw error
        }
        const request = error.config as RetryConfig | undefined
        // Public auth requests and logout must never initiate token refresh.
        if (
          error.response?.status !== 401
          || !request?.headers.Authorization
          || request.url === '/auth/logout'
          || !this.auth
        ) {
          throw error
        }
        if (request._retry) {
          this.auth.expire()
          throw error
        }
        request._retry = true
        const current = this.auth.token()
        if (current && request.headers.Authorization !== `Bearer ${current}`) {
          request.headers.set('Authorization', `Bearer ${current}`)
          return this.client(request)
        }
        try {
          this.refreshPromise ??= this.auth.refresh().finally(() => {
            this.refreshPromise = null
          })
          const token = await this.refreshPromise
          if (!token) {
            this.auth.expire()
            throw error
          }
          request.headers.set('Authorization', `Bearer ${token}`)
          return this.client(request)
        } catch (refreshError) {
          // Network/server failures do not invalidate a still recoverable local session.
          if (axios.isAxiosError(refreshError) && refreshError.response?.status === 401) {
            this.auth.expire()
          }
          throw refreshError
        }
      }
    )
  }

  setAuthHandlers(handlers: AuthHandlers) {
    this.auth = handlers
  }

  get client(): AxiosInstance {
    if (!this.instance) {
      throw new Error('API client has not been initialized')
    }
    return this.instance
  }
}

export const apiService = new ApiService()
