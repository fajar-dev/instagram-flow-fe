import type { Batch, Asset } from './content'
import type { Draft } from './content-draft'

export interface Job {
  id: string
  batchId: string
  status: string
  output: 'feed' | 'story'
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
  uploader: { id: number, name: string | null }
  job: Job
  batch: Batch
  assets: Asset[]
  draft: Draft | null
  aiResult: AiResult | null
  renders: Render[]
  decisions: {
    action: 'PUBLISH' | 'REJECTED' | 'CANCELLED'
    actorId: number | null
    actorName: string | null
    createdAt: string
  }[]
  rejections: {
    id: string
    notes: string
    rejectedBy: number
    createdAt: string
  }[]
}
