import { z } from 'zod'
import { parseHashtags } from '../../util/content'
import type { PublishFormContent } from '../../types/content-draft'
import { instagramService } from '../../services/instagram/instagram-service'
import { publicationService } from '../../services/publishing/publication-service'
import { publicationSchedule } from '../../util/publication'
import type { InstagramAccount } from '../../types/instagram'
import type { PublicationPayload } from '../../types/publishing'
import type { JobDetails } from '../../types/ai-job'

export function usePublicationForm(
  detail: () => JobDetails,
  content: PublishFormContent,
  completed: () => void
) {
  const { t } = useI18n()
  const toast = useToast()
  const handleError = useServiceError()
  const accounts = ref<InstagramAccount[]>([])
  const loading = ref(false)
  const submitting = ref(false)
  const form = reactive({
    content,
    accountKey: '',
    renderIds: detail()
      .renders.slice()
      .sort(
        (a, b) =>
          Number(b.assetId === detail().aiResult?.selectedAssetIds[0])
          - Number(a.assetId === detail().aiResult?.selectedAssetIds[0])
      )
      .slice(0, detail().job.output === 'feed' ? 10 : 1)
      .map(r => r.id),
    mode: 'now' as 'now' | 'schedule',
    date: '',
    time: ''
  })
  let requestKey = crypto.randomUUID()
  let requestBody = ''
  let disposed = false

  onUnmounted(() => {
    disposed = true
  })
  const caption = computed(() =>
    [content.caption, parseHashtags(content.hashtagText).join(' ')].filter(Boolean).join('\n\n')
  )
  const schema = computed(() =>
    z
      .object({
        content: z.object({
          title: z.string().trim().min(1, t('pages.content.validation')).max(300),
          caption:
            detail().job.output === 'story'
              ? z.string()
              : z.string().trim().min(1, t('pages.content.validation')).max(10000),
          location: z.string().trim().min(1, t('pages.content.validation')).max(200),
          activity: z.string().trim().min(1, t('pages.content.validation')).max(200),
          hashtagText: z.string().refine((value) => {
            const tags = parseHashtags(value)
            return tags.length <= 30 && tags.every(tag => tag.length <= 100)
          }, t('pages.content.validation'))
        }),
        accountKey: z.string().min(1, t('pages.publishing.accountRequired')),
        renderIds: z
          .array(z.string().uuid())
          .min(1, t('pages.publishing.imagesRequired'))
          .max(detail().job.output === 'feed' ? 10 : 1),
        mode: z.enum(['now', 'schedule']),
        date: z.string(),
        time: z.string()
      })
      .superRefine((value, ctx) => {
        if (value.mode === 'schedule') {
          const date = publicationSchedule(value.date, value.time)
          if (!date || Date.parse(date) < Date.now() + 60000) {
            ctx.addIssue({
              code: 'custom',
              path: ['date'],
              message: t('pages.publishing.scheduleInvalid')
            })
          }
        }
        if (detail().job.output === 'feed' && Array.from(caption.value).length > 2200) {
          ctx.addIssue({
            code: 'custom',
            path: ['content', 'caption'],
            message: t('pages.publishing.captionTooLong')
          })
        }
      })
  )

  async function loadAccounts() {
    if (disposed) {
      return
    }
    loading.value = true
    try {
      const response = await instagramService.accounts()
      if (disposed) {
        return
      }
      accounts.value = response.data.filter(a => a.enabled && a.configured && !a.expired)
    } catch (error) {
      if (!disposed) {
        handleError(error)
      }
    } finally {
      loading.value = false
    }
  }

  async function submit() {
    if (disposed || submitting.value || !detail().draft) {
      return
    }
    submitting.value = true
    try {
      const payload: PublicationPayload = {
        expectedContentHash: detail().draft!.contentHash,
        content: {
          title: content.title.trim(),
          caption: detail().job.output === 'story' ? '' : content.caption.trim(),
          hashtags: detail().job.output === 'story' ? [] : parseHashtags(content.hashtagText),
          location: content.location.trim(),
          activity: content.activity.trim()
        },
        accountKey: form.accountKey,
        renderIds: form.renderIds,
        placement: detail().job.output,
        scheduledAt: form.mode === 'schedule' ? publicationSchedule(form.date, form.time) : null
      }
      const body = JSON.stringify(payload)
      if (requestBody !== body) {
        requestKey = crypto.randomUUID()
        requestBody = body
      }
      await publicationService.create(detail().draft!.id, payload, requestKey)
      if (disposed) {
        return
      }
      toast.add({ title: t('pages.publishing.queued') })
      completed()
    } catch (error) {
      if (!disposed) {
        handleError(error)
      }
    } finally {
      submitting.value = false
    }
  }

  return { accounts, loading, submitting, form, schema, loadAccounts, submit }
}
