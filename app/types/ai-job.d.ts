import type { Batch, Asset } from './content'
import type { Revision, Draft } from './content-review'

export interface Job {
  id: string
  batchId: string
  status: string
  requestedOutputs: string[]
  retryable: boolean
  attemptNo: number
  createdAt: string
  startedAt: string | null
  completedAt: string | null
  lastExecutionId: string | null
  safeError: string | null
  errorCode: string | null
}

export interface Render {
  id: string
  assetId: string
  placement: 'feed' | 'story'
  renderState: string
  width: number
  height: number
}

export interface AiResult {
  rankings: {
    assetId: string
    score: number
    reason: string
  }[]
  selectedAssetIds: string[]
  rawTitle: string
  rawCaption: string
  rawHashtags: string[]
}

export interface JobDetails {
  job: Job
  batch: Batch
  assets: Asset[]
  draft: Draft | null
  revision: Revision | null
  revisions: Revision[]
  aiResult: AiResult | null
  renders: Render[]
  reviews: {
    id: string
    decision: string
    notes: string
    reviewerId: number
    revisionId: string
    createdAt: string
  }[]
}
