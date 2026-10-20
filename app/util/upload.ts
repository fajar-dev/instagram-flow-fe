import type { UploadLimits } from '~/types/content'

export type ImageValidationError = 'fileSize' | 'fileFormat' | 'fileUnreadable' | 'filePixels'
const extensions: Record<string, string[]> = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/webp': ['webp']
}

export function uploadFileError(
  file: File,
  limits: UploadLimits
): ImageValidationError | undefined {
  if (!file.size || file.size > limits.maxUploadMb * 1024 * 1024) {
    return 'fileSize'
  }
  if (!extensions[file.type]?.includes(file.name.split('.').pop()?.toLowerCase() || '')) {
    return 'fileFormat'
  }
}

export async function validateUploadImage(
  file: File,
  limits: UploadLimits
): Promise<ImageValidationError | undefined> {
  const error = uploadFileError(file, limits)
  if (error) {
    return error
  }
  try {
    const image = await createImageBitmap(file)
    try {
      if (image.width * image.height > 40000000) {
        return 'filePixels'
      }
    } finally {
      image.close()
    }
  } catch {
    return 'fileUnreadable'
  }
}

/** Each item settles independently; successful uploads are never sent again. */
export async function uploadPendingFiles<T extends { status: string }>(
  entries: T[],
  upload: (entry: T) => Promise<void>,
  failed: (entry: T, error: unknown) => void,
  shouldContinue: () => boolean = () => true
) {
  for (const entry of entries) {
    if (!shouldContinue()) {
      return
    }
    if (!['ready', 'failed'].includes(entry.status)) {
      continue
    }
    entry.status = 'uploading'
    try {
      await upload(entry)
      entry.status = 'uploaded'
    } catch (error) {
      entry.status = 'failed'
      failed(entry, error)
    }
  }
}
