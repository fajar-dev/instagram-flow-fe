export type ReportResource = 'jobs' | 'review' | 'media' | 'audit-logs'

/** Common, serialized fields returned by the reporting lists. */
export interface ContentRecord {
  id: string
  createdAt: string
  projectName?: string
  projectLocation?: string
  photoCount?: number
  requestedOutputs?: string[]
  uploaderName?: string
  uploaderPhoto?: string | null
  event?: string
  entityId?: string
  entityType?: string
  actorId?: number | null
  jobId?: string
  batchId?: string
  status?: string
  reviewStatus?: string
  safeError?: string | null
  width?: number
  height?: number
  byteSize?: number
}
