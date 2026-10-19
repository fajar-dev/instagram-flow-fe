export interface Revision {
  id: string
  draftId: string
  revisionNo: number
  primaryAssetId: string
  title: string
  caption: string
  hashtags: string[]
  location: string
  activity: string
  contentHash: string
  createdAt: string
}

export interface Draft {
  id: string
  jobId: string
  currentRevisionId: string
  reviewStatus: 'READY_FOR_REVIEW' | 'PUBLISH' | 'REJECTED'
  createdAt: string
}

export interface StudioForm {
  title: string
  caption: string
  hashtagText: string
  primaryAssetId: string
  location: string
  activity: string
}
