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
  const notes = ref('')
  const decision = ref('IN_REVIEW')
  const saving = ref(false)
  const loading = ref(false)
  const failed = ref(false)
  const dirty = computed(() => snapshot.value !== JSON.stringify(form))
  const render = computed(() => detail.value?.renders.find(item => item.placement === placement.value))
  const isOutdated = computed(() => dirty.value || render.value?.renderState === 'OUTDATED')
  const sortedRankings = computed(() => [...(detail.value?.aiResult?.rankings || [])].sort((a, b) => b.score - a.score))
  const decisions = computed(() => ['IN_REVIEW', 'APPROVED_INTERNAL', 'REVISION_REQUESTED', 'REJECTED'].map(value => ({ value, label: t(`pages.content.status.${value}`) })))
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
    if (!detail.value?.aiResult)
      return
    const ai = detail.value.aiResult
    Object.assign(form, { title: ai.rawTitle, caption: ai.rawCaption, hashtagText: ai.rawHashtags.join(' '), primaryAssetId: ai.selectedAssetIds[0], location: detail.value.batch.location, activity: detail.value.batch.activity })
  }
  async function save() {
    if (!detail.value?.draft || !detail.value.revision || saving.value || loading.value)
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
  async function review() {
    if (!detail.value?.draft || !detail.value.revision || saving.value || loading.value || dirty.value)
      return
    saving.value = true
    try {
      await draftService.review(detail.value.draft.id, { revisionId: detail.value.revision.id, contentHash: detail.value.revision.contentHash, decision: decision.value, notes: notes.value })
      await refresh()
      toast.add({ title: t('pages.content.saved'), color: 'success' })
    } catch (error) {
      handleError(error)
    } finally {
      saving.value = false
    }
  }
  onMounted(load)
  return { detail, form, placement, notes, decision, saving, loading, failed, dirty, render, isOutdated, sortedRankings, decisions, schema, load, restoreAi, save, review }
}
