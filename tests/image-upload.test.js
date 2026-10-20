import { expect, test } from 'bun:test'
import { ref } from 'vue'
import { useImageUpload } from '../app/composables/useImageUpload'

async function withUploadContext(run) {
  const names = ['ref', 'useToast', 'onUnmounted']
  const previous = names.map(name => globalThis[name])
  const cleanup = []
  const toasts = []
  globalThis.ref = ref
  globalThis.useToast = () => ({ add: message => toasts.push(message) })
  globalThis.onUnmounted = callback => cleanup.push(callback)
  try {
    await run(toasts)
  } finally {
    cleanup.forEach(callback => callback())
    names.forEach((name, index) => {
      if (previous[index] === undefined) {
        delete globalThis[name]
      } else {
        globalThis[name] = previous[index]
      }
    })
  }
}

test('closing an avatar editor ignores a pending upload response', async () => {
  await withUploadContext(async (toasts) => {
    let finish
    const uploaded = []
    const upload = useImageUpload({
      upload: () =>
        new Promise((resolve) => {
          finish = resolve
        }),
      onUploaded: path => uploaded.push(path),
      successMessage: () => 'saved',
      errorMessage: () => 'failed'
    })
    const pending = upload.uploadFile(new File(['photo'], 'photo.png'))
    expect(upload.isUploading.value).toBe(true)
    upload.clearPreview()
    finish({ success: true, data: { path: 'avatar.png' } })
    await pending
    expect(uploaded).toEqual([])
    expect(toasts).toEqual([])
    expect(upload.previewUrl.value).toBeNull()
    expect(upload.isUploading.value).toBe(false)
  })
})

test('a failed avatar replacement preserves the existing preview and stored path', async () => {
  await withUploadContext(async (toasts) => {
    const uploaded = []
    const upload = useImageUpload({
      upload: async () => {
        throw new Error('offline')
      },
      onUploaded: path => uploaded.push(path),
      successMessage: () => 'saved',
      errorMessage: () => 'failed'
    })
    upload.setPreviewFromUrl('https://example.test/existing.png')
    await upload.uploadFile(new File(['photo'], 'photo.png'))
    expect(upload.previewUrl.value).toBe('https://example.test/existing.png')
    expect(uploaded).toEqual([])
    expect(toasts[0].color).toBe('error')
    expect(upload.isUploading.value).toBe(false)
  })
})
