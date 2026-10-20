import { analyticsService } from '../../services/analytics/analytics-service'
import type { TopPostsReport } from '~/types/analytics'

export function useTopPosts(accountKey: () => string) {
  const items = ref<TopPostsReport['items']>([])
  const loading = ref(false)
  const failed = ref(false)
  const handleError = useServiceError()
  let generation = 0
  let after: string | undefined
  let complete = false
  const seen = new Set<string>()
  const posts = computed(() =>
    [...items.value].sort((a, b) => {
      const value = (row: typeof a, name: string) =>
        row.metrics.find(metric => metric.name === name)?.value ?? -1
      return (
        value(b, 'total_interactions') - value(a, 'total_interactions')
        || value(b, 'reach') - value(a, 'reach')
        || b.media.timestamp.localeCompare(a.media.timestamp)
        || a.media.id.localeCompare(b.media.id)
      )
    })
  )

  async function load() {
    if (loading.value || complete || !accountKey()) {
      return
    }
    const current = generation
    const key = accountKey()
    loading.value = true
    failed.value = false
    try {
      while (current === generation) {
        const response = await analyticsService.topPosts(key, after)
        if (current !== generation) {
          return
        }
        const ids = new Set(items.value.map(item => item.media.id))
        items.value.push(...response.data.items.filter(item => !ids.has(item.media.id)))
        const next = response.data.after
        if (!next) {
          complete = true
          break
        }
        if (seen.has(next)) {
          throw new Error('Instagram pagination did not advance')
        }
        seen.add(next)
        after = next
      }
    } catch (error) {
      if (current === generation) {
        failed.value = true
        handleError(error)
      }
    } finally {
      if (current === generation) {
        loading.value = false
      }
    }
  }

  watch(
    accountKey,
    () => {
      generation++
      items.value = []
      after = undefined
      complete = false
      seen.clear()
      loading.value = false
      failed.value = false
      load()
    },
    { immediate: true }
  )
  onUnmounted(() => {
    generation++
  })
  return { posts, loading, failed, load }
}
