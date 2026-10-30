export interface Batch {
  id: string
  projectName: string
  activity: string
  location: string
  documentationDate: string
  description: string
  clientName: string
  uploaderId: number
  status: string
  createdAt: string
}

export interface Asset {
  id: string
  batchId: string
  mime: string
  byteSize: number
  width: number
  height: number
  sha256: string
  createdAt: string
}

export interface UploadLimits {
  maxUploadMb: number
  maxBatchFiles: number
  maxJobFiles: number
}
