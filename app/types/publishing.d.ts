import type { PublishContent } from './content-review'

export interface InstagramAccount {
  key: string
  label: string
  instagramUserId: string
  enabled: boolean
  configured: boolean
  expired: boolean
  tokenExpiresAt: string | null
}

export type PublicationStatus
  = | 'QUEUED'
    | 'SCHEDULED'
    | 'PROCESSING'
    | 'PUBLISHING'
    | 'PUBLISHED'
    | 'FAILED'
    | 'UNKNOWN'
    | 'CANCELLED'

export interface Publication {
  id: string
  renderIds: string[]
  imageCount: number
  draftId: string
  accountKey: string
  accountLabel: string
  caption: string
  placement: 'feed' | 'story'
  status: PublicationStatus
  scheduledAt: string
  publishedAt: string | null
  mediaId: string | null
  permalink: string | null
  safeError: string | null
  createdAt: string
}

export interface PublicationPayload {
  expectedContentHash: string
  content: PublishContent
  accountKey: string
  renderIds: string[]
  placement: 'feed' | 'story'
  scheduledAt: string | null
}
