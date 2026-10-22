import { expect, test } from 'bun:test'
import { computed, ref } from 'vue'
import { usePublications } from '../app/composables/publishing/usePublications'
import { publicationService } from '../app/services/publishing/publication-service'
import { useLatestRequest } from '../app/composables/useLatestRequest'

test('publication actions ignore late errors after unmount and skip loading without a draft', async () => {
  const cleanup = []
  const errors = []
  let poll
  const replacements = {
    ref,
    computed,
    useLatestRequest,
    useI18n: () => ({ t: key => key }),
    useToast: () => ({ add: () => {} }),
    useServiceError: () => error => errors.push(error),
    usePolling: (load) => {
      poll = load
    },
    onUnmounted: callback => cleanup.push(callback)
  }
  const previous = Object.fromEntries(
    Object.keys(replacements).map(key => [key, globalThis[key]])
  )
  const cancel = publicationService.cancel
  const list = publicationService.list
  let calls = 0
  Object.assign(globalThis, replacements)
  try {
    publicationService.list = async () => {
      calls++
      return { data: [] }
    }
    const state = usePublications(
      () => ({ batch: {} }),
      () => {}
    )
    await poll()
    expect(calls).toBe(0)
    expect(state.canDecide.value).toBe(false)
    let reject
    publicationService.cancel = () =>
      new Promise((resolve, fail) => {
        reject = fail
      })
    const pending = state.action('two', 'cancel')
    cleanup.forEach(callback => callback())
    reject(new Error('Late failure'))
    await pending
    expect(errors).toEqual([])
    expect(state.busy.value).toBe('')
  } finally {
    publicationService.cancel = cancel
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
