export interface InstagramAccount {
  key: string
  label: string
  instagramUserId: string
  enabled: boolean
  configured: boolean
  expired: boolean
  tokenExpiresAt: string | null
}
