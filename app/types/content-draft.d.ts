export interface PublishContent {
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
  decisionStatus: 'READY_FOR_REVIEW' | 'PUBLISH' | 'REJECTED'
  createdAt: string
}

export interface PublishFormContent {
  title: string
  caption: string
  hashtagText: string
  location: string
  activity: string
}
