import { z } from 'zod'
import { parseHashtags } from '../../util/content'
import type { PublishFormContent } from '../../types/content-review'
import { instagramService } from '../../services/instagram/instagram-service'
import { publicationService } from '../../services/publishing/publication-service'
import { publicationSchedule } from '../../util/publication'
import type { InstagramAccount, PublicationPayload } from '../../types/publishing'
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
    source: 'photo' as 'photo' | 'design',
    placement: 'feed' as 'feed' | 'story',
    mode: 'now' as 'now' | 'schedule',
    date: '',
    time: ''
  })
  let requestKey = crypto.randomUUID()
  let requestBody = ''
  const design = computed(() => {
    const ai = detail().aiResult
    const original
      = ai
        && content.title === ai.rawTitle
        && content.caption === ai.rawCaption
        && JSON.stringify(parseHashtags(content.hashtagText)) === JSON.stringify(ai.rawHashtags)
        && content.location === detail().batch.location
        && content.activity === detail().batch.activity
        && content.primaryAssetId === ai.selectedAssetIds[0]
    return original
      ? detail().renders.find(
          r => r.placement === form.placement && r.assetId === content.primaryAssetId
        )
      : undefined
  })
  const caption = computed(() =>
    [content.caption, parseHashtags(content.hashtagText).join(' ')].filter(Boolean).join('\n\n')
  )
  const schema = computed(() =>
    z
      .object({
        content: z.object({
          title: z.string().trim().min(1, t('pages.content.validation')).max(300),
          caption: z.string().trim().min(1, t('pages.content.validation')).max(10000),
          primaryAssetId: z.string().min(1, t('pages.content.validation')),
          location: z.string().trim().min(1, t('pages.content.validation')).max(200),
          activity: z.string().trim().min(1, t('pages.content.validation')).max(200),
          hashtagText: z.string().refine((value) => {
            const tags = parseHashtags(value)
            return tags.length <= 30 && tags.every(tag => tag.length <= 100)
          }, t('pages.content.validation'))
        }),
        accountKey: z.string().min(1, t('pages.publishing.accountRequired')),
        source: z.enum(['photo', 'design']),
        placement: z.enum(['feed', 'story']),
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
        if (value.source === 'design' && !design.value) {
          ctx.addIssue({
            code: 'custom',
            path: ['source'],
            message: t('pages.publishing.designUnavailable')
          })
        }
        if (value.placement === 'feed' && Array.from(caption.value).length > 2200) {
          ctx.addIssue({
            code: 'custom',
            path: ['placement'],
            message: t('pages.publishing.captionTooLong')
          })
        }
      })
  )

  async function loadAccounts() {
    loading.value = true
    try {
      accounts.value = (await instagramService.accounts()).data.filter(
        a => a.enabled && a.configured && !a.expired
      )
    } catch (error) {
      handleError(error)
    } finally {
      loading.value = false
    }
  }

  async function submit() {
    if (submitting.value || !detail().draft) {
      return
    }
    submitting.value = true
    try {
      const payload: PublicationPayload = {
        expectedContentHash: detail().draft!.contentHash,
        content: {
          primaryAssetId: content.primaryAssetId,
          title: content.title.trim(),
          caption: content.caption.trim(),
          hashtags: parseHashtags(content.hashtagText),
          location: content.location.trim(),
          activity: content.activity.trim()
        },
        accountKey: form.accountKey,
        source: form.source,
        placement: form.placement,
        scheduledAt: form.mode === 'schedule' ? publicationSchedule(form.date, form.time) : null
      }
      const body = JSON.stringify(payload)
      if (requestBody !== body) {
        requestKey = crypto.randomUUID()
        requestBody = body
      }
      await publicationService.create(detail().draft!.id, payload, requestKey)
      toast.add({ title: t('pages.publishing.queued') })
      completed()
    } catch (error) {
      handleError(error)
    } finally {
      submitting.value = false
    }
  }

  watch(design, (value) => {
    if (!value) {
      form.source = 'photo'
    }
  })
  return { accounts, loading, submitting, form, schema, design, loadAccounts, submit }
}
