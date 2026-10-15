import type { ApiResponse } from './api'

export interface User {
  id: number
  name: string
  email: string
  photo: string | null
  isActive: boolean
  hasPassword?: boolean
}

export interface AuthData {
  user: User
  accessToken: string
  refreshToken: string
}

export type AuthResponse = ApiResponse<AuthData>
