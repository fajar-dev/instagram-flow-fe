import { useTableQuery } from '../useTableQuery'
import { useLatestRequest } from '../useLatestRequest'
import type { ContentRecord, ReportResource } from '../../types/reporting'
import { mediaService } from '../../services/content/media-service'
import { reportingService } from '../../services/reporting/reporting-service'

export function useContentRecords(props: {
  resource: ReportResource
  days?: number
  previewLimit?: number
  fixedStatus?: string
}) {
  const { t } = useI18n()
  const handleError = useServiceError()
  const rows = ref<ContentRecord[]>([])
  const infinite = props.resource === 'media'
  const queryChanging = ref(false)
  const loadedPage = ref(0)
  const hasMore = ref(true)
  const total = ref(0)
  const from = ref(0)
  const to = ref(0)
  const status = ref(props.fixedStatus || 'ALL')
  const archiveId = ref('')
  const archiving = ref(false)
  const showArchive = computed({
    get: () => Boolean(archiveId.value),
    set: (value) => {
      if (!value) {
        archiveId.value = ''
      }
    }
  })
  const statuses = computed(() => [
    { label: t('pages.content.all'), value: 'ALL' },
    ...(props.resource === 'drafts'
      ? ['READY_FOR_REVIEW', 'PUBLISH', 'REJECTED']
      : ['QUEUED', 'DISPATCHED', 'PROCESSING', 'READY_FOR_REVIEW', 'FAILED']
    ).map(value => ({ label: t(`pages.content.status.${value}`), value }))
  ])
  const { loading, failed, load } = useLatestRequest(
    async () => {
      queryChanging.value = false
      const requestedPage = page.value
      if (infinite && requestedPage === 1) {
        rows.value = []
      }
      const result = await reportingService.list<ContentRecord>(props.resource, {
        page: props.previewLimit ? 1 : page.value,
        limit: props.previewLimit || perPage.value,
        q: props.previewLimit ? '' : search.value,
        ...(props.days === undefined ? {} : { days: props.days }),
        ...(status.value !== 'ALL' ? { status: status.value } : {})
      })
      return { result, requestedPage }
    },
    ({ result, requestedPage }) => {
      if (infinite && requestedPage > 1) {
        const existing = new Set(rows.value.map(row => row.id))
        rows.value.push(...result.data.filter(row => !existing.has(row.id)))
      } else {
        rows.value = result.data
      }
      loadedPage.value = requestedPage
      hasMore.value
        = result.data.length > 0 && requestedPage * perPage.value < (result.meta?.total ?? 0)
      total.value = result.meta?.total ?? 0
      from.value = result.meta?.from ?? 0
      to.value = result.meta?.to ?? 0
      const lastPage = Math.max(1, Math.ceil(total.value / perPage.value))
      if (!infinite && page.value > lastPage) {
        page.value = lastPage
      }
    }
  )
  const { page, perPage, search } = useTableQuery(load)

  watch(
    search,
    () => {
      queryChanging.value = true
    },
    { flush: 'sync' }
  )

  function loadMore() {
    if (queryChanging.value || loading.value || (!hasMore.value && !failed.value)) {
      return
    }
    if (failed.value) {
      void load()
    } else {
      page.value = loadedPage.value + 1
    }
  }

  async function download(assetId: string) {
    try {
      const blob = await mediaService.file(`assets/${assetId}/download`)
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = assetId
      anchor.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (error) {
      handleError(error)
    }
  }

  async function archive() {
    if (archiving.value || !archiveId.value) {
      return
    }
    archiving.value = true
    try {
      await mediaService.archive(archiveId.value)
      archiveId.value = ''
      if (infinite && page.value !== 1) {
        page.value = 1
      } else {
        await load()
      }
    } catch (error) {
      handleError(error)
    } finally {
      archiving.value = false
    }
  }

  watch([status, () => props.days], () => {
    if (page.value === 1) {
      load()
    } else {
      page.value = 1
    }
  })
  if (infinite) {
    onMounted(load)
  } else {
    usePolling(load, 20000)
  }
  return {
    rows,
    hasMore,
    loadMore,
    page,
    perPage,
    total,
    from,
    to,
    search,
    status,
    loading,
    failed,
    archiveId,
    archiving,
    showArchive,
    statuses,
    download,
    archive
  }
}
