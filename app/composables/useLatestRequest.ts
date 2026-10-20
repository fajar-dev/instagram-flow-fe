import { ref } from 'vue'

/** Only the latest request may update a view or report an error. */
export function useLatestRequest<T>(request: () => Promise<T>, apply: (result: T) => void) {
  const loading = ref(false)
  const failed = ref(false)
  const handleError = useServiceError()
  let version = 0
  let disposed = false

  function invalidate() {
    version++
    loading.value = false
    failed.value = false
  }

  async function load() {
    if (disposed) {
      return
    }
    const current = ++version
    loading.value = true
    try {
      const result = await request()
      if (!disposed && current === version) {
        apply(result)
        failed.value = false
      }
    } catch (error) {
      if (!disposed && current === version) {
        if (!failed.value) {
          handleError(error)
        }
        failed.value = true
      }
    } finally {
      if (!disposed && current === version) {
        loading.value = false
      }
    }
  }

  onUnmounted(() => {
    disposed = true
    invalidate()
  })
  return { loading, failed, load, invalidate }
}
