/** Poll without overlap; pause in background tabs and clean up on navigation. */
export function usePolling(load: () => Promise<void>, interval = 5000) {
  let timer: ReturnType<typeof setTimeout> | undefined
  let disposed = false

  async function tick() {
    try {
      if (!document.hidden) {
        await load()
      }
    } finally {
      if (!disposed) {
        timer = setTimeout(tick, interval)
      }
    }
  }

  onMounted(tick)
  onUnmounted(() => {
    disposed = true
    clearTimeout(timer)
  })
}
