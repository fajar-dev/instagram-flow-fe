import { z } from 'zod'
import { jobService } from '../../services/ai-job/job-service'
import { draftService } from '../../services/content-review/draft-service'
import { parseHashtags } from '../../util/content'
import type { JobDetails } from '~/types/ai-job'

export function useContentStudio(jobId: string) {
  const { t } = useI18n()
  const handleError = useServiceError()
  const toast = useToast()
  const detail = ref<JobDetails | null>(null)
  const form = reactive({ title: '', caption: '', hashtagText: '', primaryAssetId: '', location: '', activity: '' })
  const snapshot = ref('')
  const placement = ref('feed')
  const saving = ref(false)
  const loading = ref(false)
  const failed = ref(false)
  const editable = computed(() => detail.value?.draft?.reviewStatus === 'READY_FOR_REVIEW')
  const dirty = computed(() => snapshot.value !== JSON.stringify(form))
  const render = computed(() => detail.value?.renders.find(item => item.placement === placement.value))
  const isOutdated = computed(() => dirty.value || render.value?.renderState === 'OUTDATED')
  const sortedRankings = computed(() => [...(detail.value?.aiResult?.rankings || [])].sort((a, b) => b.score - a.score))
  const schema = computed(() => z.object({ title: z.string().trim().min(1, t('pages.content.validation')).max(300), caption: z.string().trim().min(1, t('pages.content.validation')).max(10000), activity: z.string().min(1).max(200), location: z.string().min(1).max(200), hashtagText: z.string().refine((value) => {
    const tags = parseHashtags(value)
    return tags.length <= 30 && tags.every(tag => tag.length <= 100)
  }, t('pages.content.validation')) }))
  async function refresh() {
    loading.value = true
    failed.value = false
    try {
      detail.value = (await jobService.details(jobId)).data
      const revision = detail.value.revision
      if (revision) {
        Object.assign(form, { title: revision.title, caption: revision.caption, hashtagText: revision.hashtags.join(' '), primaryAssetId: revision.primaryAssetId, location: revision.location, activity: revision.activity })
        snapshot.value = JSON.stringify(form)
      }
      if (!detail.value.job.requestedOutputs.includes(placement.value))
        placement.value = detail.value.job.requestedOutputs[0] || 'feed'
    } catch (error) {
      failed.value = true
      throw error
    } finally {
      loading.value = false
    }
  }
  async function load() {
    if (saving.value || loading.value) return
    try {
      await refresh()
    } catch (error) {
      handleError(error)
    }
  }
  function restoreAi() {
    if (!detail.value?.aiResult || !editable.value)
      return
    const ai = detail.value.aiResult
    Object.assign(form, { title: ai.rawTitle, caption: ai.rawCaption, hashtagText: ai.rawHashtags.join(' '), primaryAssetId: ai.selectedAssetIds[0], location: detail.value.batch.location, activity: detail.value.batch.activity })
  }
  async function save() {
    if (!detail.value?.draft || !editable.value || !detail.value.revision || saving.value || loading.value)
      return
    saving.value = true
    try {
      const { hashtagText, ...content } = form
      await draftService.edit(detail.value.draft.id, { ...content, hashtags: parseHashtags(hashtagText), expectedRevisionId: detail.value.revision.id })
      await refresh()
      toast.add({ title: t('pages.content.saved'), color: 'success' })
    } catch (error) {
      handleError(error)
    } finally {
      saving.value = false
    }
  }
  onMounted(load)
  return { detail, editable, form, placement, saving, loading, failed, dirty, render, isOutdated, sortedRankings, schema, load, restoreAi, save }
}
