export type ReportResource = 'jobs' | 'review' | 'media' | 'audit-logs'

export interface AuditEntry {
  id: string
  actorId: number | null
  event: string
  entityType: string
  entityId: string
  createdAt: string
}

/** Common, serialized fields returned by the reporting lists. */
export interface ContentRecord {
  id: string
  createdAt: string
  projectName?: string
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
