import { publicationService } from '../../services/publishing/publication-service'
import { mediaService } from '../../services/content/media-service'
import type { Publication } from '~/types/publishing'
import type { JobDetails } from '~/types/ai-job'

export function usePublications(
  detail: () => JobDetails,
  dirty: () => boolean,
  completed: () => void
) {
  const { t } = useI18n()
  const handleError = useServiceError()
  const toast = useToast()
  const { openLightbox, closeLightbox, lightboxImage } = useLightbox()
  const rows = ref<Publication[]>([])
  const loaded = ref(false)
  const busy = ref('')
  const previewing = ref('')
  let previewUrl = ''
  let disposed = false
  const canDecide = computed(
    () => detail().draft?.reviewStatus === 'READY_FOR_REVIEW' && loaded.value && !rows.value.length
  )
  const canPublish = computed(
    () => canDecide.value && !failed.value && !dirty() && detail().batch.publicationPermission
  )
  const { failed, load } = useLatestRequest(
    async () => {
      const draftId = detail().draft?.id
      return draftId ? publicationService.list(draftId) : { data: [] }
    },
    (response) => {
      rows.value = [...response.data].reverse()
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
      toast.add({ title: t('pages.publishing.updated'), color: 'success' })
      await changed()
    } catch (error) {
      if (!disposed) {
        handleError(error)
      }
    } finally {
      busy.value = ''
    }
  }

  async function preview(row: Publication) {
    if (previewing.value) {
      return
    }
    previewing.value = row.id
    try {
      const blob = await mediaService.file(`publications/${row.id}/image`)
      if (disposed) {
        return
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      previewUrl = URL.createObjectURL(blob)
      openLightbox(previewUrl, row.accountLabel)
    } catch (error) {
      if (!disposed) {
        handleError(error)
      }
    } finally {
      previewing.value = ''
    }
  }

  usePolling(load, 10000)
  onUnmounted(() => {
    disposed = true
    if (previewUrl) {
      if (lightboxImage.value === previewUrl) {
        closeLightbox()
      }
      URL.revokeObjectURL(previewUrl)
    }
  })

  return { rows, loaded, busy, previewing, canDecide, canPublish, failed, changed, action, preview }
}
