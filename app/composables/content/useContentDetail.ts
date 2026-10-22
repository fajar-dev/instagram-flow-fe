import { jobService } from '../../services/ai-job/job-service'
import type { JobDetails } from '~/types/ai-job'
import type { PublishFormContent } from '~/types/content-review'

export function useContentDetail(jobId: string) {
  const detail = ref<JobDetails | null>(null)
  const placement = computed(() => detail.value?.job.output || 'feed')
  const form = reactive<PublishFormContent>({
    title: '',
    caption: '',
    hashtagText: '',
    location: '',
    activity: ''
  })
  const { loading, load } = useLatestRequest(
    () => jobService.details(jobId),
    (response) => {
      detail.value = response.data
      const draft = response.data.draft
      if (draft) {
        Object.assign(form, {
          title: draft.title,
          caption: draft.caption,
          hashtagText: draft.hashtags.join(' '),
          location: draft.location,
          activity: draft.activity
        })
      }
    }
  )
  const handleError = useServiceError()
  const retrying = ref(false)
  const retryKey = crypto.randomUUID()
  let disposed = false

  onUnmounted(() => {
    disposed = true
  })

  async function retry() {
    if (disposed || retrying.value) {
      return
    }
    retrying.value = true
    try {
      const job = (await jobService.retry(jobId, retryKey)).data
      if (!disposed) {
        await navigateTo(`/content/${job.jobId}`)
      }
    } catch (error) {
      if (!disposed) {
        handleError(error)
      }
    } finally {
      retrying.value = false
    }
  }

  // Poll AI processing only. Once a draft exists, preserve the user's edits.
  usePolling(async () => {
    if (!detail.value || (!detail.value.draft && !detail.value.job.completedAt)) {
      await load()
    }
  })
  return { detail, placement, form, loading, load, retrying, retry }
}
