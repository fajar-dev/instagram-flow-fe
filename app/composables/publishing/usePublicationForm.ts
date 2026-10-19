import { z } from 'zod'
import { instagramService } from '~/services/instagram/instagram-service'
import { publicationService } from '~/services/publishing/publication-service'
import { publicationSchedule } from '~/util/publication'
import type { InstagramAccount, PublicationPayload } from '~/types/publishing'
import type { JobDetails } from '~/types/ai-job'

export function usePublicationForm(detail: () => JobDetails, completed: () => void) {
  const { t } = useI18n()
  const toast = useToast()
  const handleError = useServiceError()
  const accounts = ref<InstagramAccount[]>([])
  const loading = ref(false)
  const submitting = ref(false)
  const form = reactive({ accountKey: '', source: 'photo' as 'photo' | 'design', placement: 'feed' as 'feed' | 'story', mode: 'now' as 'now' | 'schedule', date: '', time: '' })
  let requestKey = crypto.randomUUID()
  let requestBody = ''
  const design = computed(() => detail().revision?.revisionNo === 1
    ? detail().renders.find(r => r.placement === form.placement && r.assetId === detail().revision?.primaryAssetId)
    : undefined)
  const caption = computed(() => [detail().revision?.caption, detail().revision?.hashtags.join(' ')].filter(Boolean).join('\n\n'))
  const schema = computed(() => z.object({
    accountKey: z.string().min(1, t('pages.publishing.accountRequired')),
    source: z.enum(['photo', 'design']), placement: z.enum(['feed', 'story']), mode: z.enum(['now', 'schedule']), date: z.string(), time: z.string()
  }).superRefine((value, ctx) => {
    if (value.mode === 'schedule') {
      const date = publicationSchedule(value.date, value.time)
      if (!date || Date.parse(date) < Date.now() + 60000)
        ctx.addIssue({ code: 'custom', path: ['date'], message: t('pages.publishing.scheduleInvalid') })
    }
    if (value.source === 'design' && !design.value)
      ctx.addIssue({ code: 'custom', path: ['source'], message: t('pages.publishing.designUnavailable') })
    if (value.placement === 'feed' && Array.from(caption.value).length > 2200)
      ctx.addIssue({ code: 'custom', path: ['placement'], message: t('pages.publishing.captionTooLong') })
  }))
  async function loadAccounts() {
    loading.value = true
    try {
      accounts.value = (await instagramService.accounts()).data.filter(a => a.enabled && a.configured && !a.expired)
    } catch (error) {
      handleError(error)
    } finally {
      loading.value = false
    }
  }
  async function submit() {
    if (submitting.value || !detail().draft || !detail().revision) return
    submitting.value = true
    try {
      const payload: PublicationPayload = { revisionId: detail().revision!.id, accountKey: form.accountKey,
        source: form.source, placement: form.placement, scheduledAt: form.mode === 'schedule' ? publicationSchedule(form.date, form.time) : null }
      const body = JSON.stringify(payload)
      if (requestBody !== body) {
        requestKey = crypto.randomUUID()
        requestBody = body
      }
      await publicationService.create(detail().draft!.id, payload, requestKey)
      toast.add({ title: t('pages.publishing.queued'), color: 'success' })
      completed()
    } catch (error) {
      handleError(error)
    } finally {
      submitting.value = false
    }
  }
  watch(design, (value) => {
    if (!value) form.source = 'photo'
  })
  return { accounts, loading, submitting, form, schema, design, loadAccounts, submit }
}
