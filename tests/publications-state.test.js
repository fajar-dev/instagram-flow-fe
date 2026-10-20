import { expect, test } from 'bun:test'
import { computed, ref } from 'vue'
import { usePublications } from '../app/composables/publishing/usePublications'
import { mediaService } from '../app/services/content/media-service'
import { publicationService } from '../app/services/publishing/publication-service'
import { useLatestRequest } from '../app/composables/useLatestRequest'

test('publication preview releases its blob without closing another image, and ignores late errors', async () => {
  const cleanup = []
  const errors = []
  const image = ref('')
  let closed = 0
  let poll
  const replacements = {
    ref,
    computed,
    useLatestRequest,
    useI18n: () => ({ t: key => key }),
    useToast: () => ({ add: () => {} }),
    useServiceError: () => error => errors.push(error),
    useLightbox: () => ({
      lightboxImage: image,
      openLightbox: (src) => {
        image.value = src
      },
      closeLightbox: () => {
        closed++
      }
    }),
    usePolling: (load) => {
      poll = load
    },
    onUnmounted: callback => cleanup.push(callback)
  }
  const previous = Object.fromEntries(
    Object.keys(replacements).map(key => [key, globalThis[key]])
  )
  const file = mediaService.file
  const list = publicationService.list
  let calls = 0
  Object.assign(globalThis, replacements)
  try {
    publicationService.list = async () => {
      calls++
      return { data: [] }
    }
    mediaService.file = async () => new Blob(['preview'])
    const state = usePublications(
      () => ({ batch: {} }),
      () => false,
      () => {}
    )
    await poll()
    expect(calls).toBe(0)
    expect(state.canDecide.value).toBe(false)
    await state.preview({ id: 'one', accountLabel: 'Account' })
    const ownedUrl = image.value
    expect(ownedUrl.startsWith('blob:')).toBe(true)
    image.value = 'another-image'
    let reject
    mediaService.file = () =>
      new Promise((resolve, fail) => {
        reject = fail
      })
    const pending = state.preview({ id: 'two' })
    cleanup.forEach(callback => callback())
    reject(new Error('Late failure'))
    await pending
    expect(closed).toBe(0)
    expect(errors).toEqual([])
    expect(state.previewing.value).toBe('')
    await expect(fetch(ownedUrl)).rejects.toThrow()
  } finally {
    mediaService.file = file
    publicationService.list = list
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete globalThis[key]
      } else {
        globalThis[key] = value
      }
    }
  }
})
