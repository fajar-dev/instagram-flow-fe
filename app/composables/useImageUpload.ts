import type { ApiResponse } from '~/types/api'

interface ImageUploadOptions {
  upload: (file: File) => Promise<ApiResponse<{ path: string }>>
  onUploaded: (path: string) => void
  successMessage: () => string
  errorMessage: () => string
}

/** Owns preview URLs and ignores responses after removal or unmount. */
export function useImageUpload(options: ImageUploadOptions) {
  const toast = useToast()
  const isUploading = ref(false)
  const previewUrl = ref<string | null>(null)
  let requestVersion = 0
  let objectUrl: string | null = null

  function releasePreview() {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl)
    }
    objectUrl = null
  }

  function setPreviewFromUrl(url?: string | null) {
    requestVersion++
    isUploading.value = false
    releasePreview()
    previewUrl.value = url ?? null
  }

  function clearPreview() {
    setPreviewFromUrl(null)
  }

  async function uploadFile(file: File) {
    if (isUploading.value) {
      return
    }
    const version = ++requestVersion
    const previous = previewUrl.value
    const previousObjectUrl = objectUrl
    objectUrl = URL.createObjectURL(file)
    previewUrl.value = objectUrl
    isUploading.value = true
    try {
      const response = await options.upload(file)
      if (version !== requestVersion) {
        return
      }
      if (!response.success || !response.data?.path) {
        throw new Error('Upload failed')
      }
      options.onUploaded(response.data.path)
      toast.add({
        title: options.successMessage(),
        icon: 'i-lucide-circle-check'
      })
    } catch {
      if (version !== requestVersion) {
        return
      }
      releasePreview()
      previewUrl.value = previous
      objectUrl = previousObjectUrl
      toast.add({ title: options.errorMessage(), color: 'error', icon: 'i-lucide-circle-alert' })
    } finally {
      if (previousObjectUrl && objectUrl !== previousObjectUrl) {
        URL.revokeObjectURL(previousObjectUrl)
      }
      if (version === requestVersion) {
        isUploading.value = false
      }
    }
  }

  onUnmounted(() => {
    requestVersion++
    releasePreview()
  })

  return { isUploading, previewUrl, uploadFile, clearPreview, setPreviewFromUrl }
}
