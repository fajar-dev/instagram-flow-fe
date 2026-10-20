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
  draftId: string
  revisionId: string
  revisionNo: number
  accountKey: string
  accountLabel: string
  caption: string
  source: 'photo' | 'design'
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
  revisionId: string
  accountKey: string
  source: 'photo' | 'design'
  placement: 'feed' | 'story'
  scheduledAt: string | null
}
