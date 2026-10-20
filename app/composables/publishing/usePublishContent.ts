import { jobService } from '~/services/ai-job/job-service'
import type { JobDetails } from '~/types/ai-job'
import type { PublishFormContent } from '~/types/content-review'

export function usePublishContent(jobId: string) {
  const detail = ref<JobDetails | null>(null)
  const placement = ref('feed')
  const form = reactive<PublishFormContent>({
    title: '',
    caption: '',
    hashtagText: '',
    primaryAssetId: '',
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
          primaryAssetId: draft.primaryAssetId,
          location: draft.location,
          activity: draft.activity
        })
      }
    }
  )
  // No polling here: a refresh must never discard an in-progress publish form.
  onMounted(load)
  return { detail, placement, form, loading, load }
}
