import { authService } from '../auth-service'

export function requestHeaders(key?: string) {
  return {
    Authorization: `Bearer ${authService.token.value}`,
    ...(key ? { 'Idempotency-Key': key } : {})
  }
}
