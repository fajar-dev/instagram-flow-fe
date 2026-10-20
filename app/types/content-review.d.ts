export interface PublishContent {
  primaryAssetId: string
  title: string
  caption: string
  hashtags: string[]
  location: string
  activity: string
}

export interface Draft extends PublishContent {
  id: string
  jobId: string
  contentHash: string
  reviewStatus: 'READY_FOR_REVIEW' | 'PUBLISH' | 'REJECTED'
  createdAt: string
}

export interface PublishFormContent {
  title: string
  caption: string
  hashtagText: string
  primaryAssetId: string
  location: string
  activity: string
}
