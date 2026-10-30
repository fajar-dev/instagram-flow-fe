import { publicationService } from '../../services/publishing/publication-service'
import type { Publication } from '~/types/publishing'
import type { JobDetails } from '~/types/ai-job'

export function usePublications(detail: () => JobDetails, completed: () => void) {
  const { t } = useI18n()
  const handleError = useServiceError()
  const toast = useToast()
  const rows = ref<Publication[]>([])
  const loaded = ref(false)
  const busy = ref('')
  let disposed = false
  const canDecide = computed(
    () =>
      detail().draft?.decisionStatus === 'READY_FOR_REVIEW' && loaded.value && !rows.value.length
  )
  const canPublish = computed(() => canDecide.value && !failed.value)
  const { failed, load } = useLatestRequest(
    async () => {
      const draftId = detail().draft?.id
      return draftId ? publicationService.list(draftId) : { data: [] }
    },
    (response) => {
      rows.value = response.data
      loaded.value = true
    }
  )

  async function changed() {
    await load()
    if (!disposed) {
      completed()
    }
  }

  async function action(id: string, operation: 'retry' | 'cancel') {
    if (busy.value) {
      return
    }
    busy.value = id
    try {
      await publicationService[operation](id)
      if (disposed) {
        return
      }
      toast.add({ title: t('pages.publishing.updated') })
      await changed()
    } catch (error) {
      if (!disposed) {
        handleError(error)
      }
    } finally {
      busy.value = ''
    }
  }

  usePolling(load, 10000)
  onUnmounted(() => {
    disposed = true
  })

  return { rows, loaded, busy, canDecide, canPublish, failed, changed, action }
}
