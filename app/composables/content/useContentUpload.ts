import type { UploadLimits } from '~/types/content'
import { validateUploadImage, uploadPendingFiles } from '~/util/upload'
import axios from 'axios'
import { z } from 'zod'
import { batchService } from '~/services/content/batch-service'
import { jobService } from '~/services/ai-job/job-service'

export function useContentUpload() {
  const { t } = useI18n()
  const handleError = useServiceError()
  const toast = useToast()
  const limits = ref<UploadLimits | null>(null)
  const { load: loadLimits } = useLatestRequest(
    () => batchService.limits(),
    (response) => {
      limits.value = response.data
    }
  )
  onMounted(loadLimits)
  const uploadHint = computed(() =>
    limits.value
      ? t('pages.content.uploadLimits', {
          count: Math.min(limits.value.maxBatchFiles, limits.value.maxJobFiles),
          size: limits.value.maxUploadMb
        })
      : t('pages.content.loadingLimits')
  )
  const fields = ['projectName', 'activity', 'location', 'documentationDate', 'clientName'] as const
  const form = reactive({
    projectName: '',
    activity: '',
    location: '',
    documentationDate: '',
    clientName: '',
    description: '',
    publicationPermission: false,
    requestedOutputs: ['feed', 'story'] as ('feed' | 'story')[]
  })
  const schema = computed(() =>
    z.object({
      projectName: z.string().trim().min(3, t('pages.content.validation')).max(150),
      activity: z.string().trim().min(3, t('pages.content.validation')).max(200),
      location: z.string().trim().min(3, t('pages.content.validation')).max(200),
      documentationDate: z.iso.date(t('pages.content.validation')),
      description: z.string().max(2000),
      clientName: z.string().max(200),
      publicationPermission: z
        .boolean()
        .refine(value => value, t('pages.content.consentRequired')),
      requestedOutputs: z.array(z.enum(['feed', 'story'])).min(1, t('pages.content.outputRequired'))
    })
  )
  const files = ref<File[]>([])
  const entries = ref<
    {
      id: string
      file: File
      url: string
      status: string
      error: string
      validationError?: string
      progress: number
    }[]
  >([])
  const batchId = ref('')
  const batchKey = crypto.randomUUID()
  const processKey = crypto.randomUUID()
  const processingRequested = ref(false)
  let submittedOutputs: string[] | undefined
  const busy = ref(false)
  const validating = computed(() => entries.value.some(entry => entry.status === 'validating'))
  const uploadedCount = computed(
    () => entries.value.filter(entry => entry.status === 'uploaded').length
  )
  const hasErrors = computed(() =>
    entries.value.some(entry => ['invalid', 'failed'].includes(entry.status))
  )
  const fileError = computed(() =>
    limits.value
    && entries.value.filter(entry => entry.status !== 'invalid').length
    > Math.min(limits.value.maxBatchFiles, limits.value.maxJobFiles)
      ? uploadHint.value
      : ''
  )
  let disposed = false
  watch([files, limits], async () => {
    const previous = entries.value
    previous
      .filter(entry => !files.value.includes(entry.file))
      .forEach(entry => URL.revokeObjectURL(entry.url))
    entries.value = files.value.map(
      file =>
        previous.find(entry => entry.file === file) || {
          id: crypto.randomUUID(),
          file,
          url: URL.createObjectURL(file),
          status: 'validating',
          error: '',
          progress: 0
        }
    )
    if (!limits.value) {
      return
    }
    for (const entry of entries.value) {
      if (entry.status !== 'validating') {
        continue
      }
      const error = await validateUploadImage(entry.file, limits.value)
      if (disposed || !entries.value.includes(entry)) {
        continue
      }
      entry.validationError = error
      entry.status = error ? 'invalid' : 'ready'
    }
  })
  onUnmounted(() => {
    disposed = true
    entries.value.forEach(entry => URL.revokeObjectURL(entry.url))
  })

  function remove(id: string) {
    const entry = entries.value.find(entry => entry.id === id)
    if (!entry || busy.value || processingRequested.value || entry.status === 'uploaded') {
      return
    }
    files.value = files.value.filter(file => file !== entry.file)
  }

  async function processUploaded() {
    if (disposed || busy.value || !uploadedCount.value || validating.value) {
      return
    }
    if (!schema.value.safeParse(form).success) {
      toast.add({ title: t('pages.content.outputRequired'), color: 'error' })
      return
    }
    busy.value = true
    try {
      submittedOutputs ??= [...form.requestedOutputs]
      processingRequested.value = true
      const result = (await jobService.process(batchId.value, submittedOutputs, processKey)).data
      if (!disposed) {
        await navigateTo(`/content/${result.jobId}`)
      }
    } catch (error) {
      if (!disposed) {
        handleError(error)
      }
    } finally {
      busy.value = false
    }
  }

  async function submit() {
    if (
      disposed
      || !limits.value
      || busy.value
      || validating.value
      || fileError.value
      || !entries.value.some(entry => entry.status !== 'invalid')
    ) {
      return
    }
    busy.value = true
    try {
      if (!batchId.value) {
        const { requestedOutputs, ...metadata } = form
        batchId.value = (await batchService.batch(metadata, batchKey)).data.id
      }
      if (disposed) {
        return
      }
      await uploadPendingFiles(
        entries.value,
        async (entry) => {
          entry.error = ''
          await batchService.upload(batchId.value, entry.file, (value) => {
            entry.progress = value
          })
        },
        (entry, error) => {
          entry.error
            = axios.isAxiosError(error) && typeof error.response?.data?.message === 'string'
              ? error.response.data.message
              : t('pages.content.fileUploadFailed')
        },
        () => !disposed
      )
      if (disposed) {
        return
      }
      if (hasErrors.value) {
        toast.add({
          title: t('pages.content.partialUpload', { count: uploadedCount.value }),
          color: 'warning'
        })
        return
      }
    } catch (error) {
      if (!disposed) {
        handleError(error)
      }
    } finally {
      busy.value = false
    }
    if (uploadedCount.value && !hasErrors.value) {
      await processUploaded()
    }
  }

  return {
    limits,
    uploadHint,
    fields,
    form,
    schema,
    files,
    entries,
    batchId,
    uploadedCount,
    hasErrors,
    validating,
    busy,
    processingRequested,
    fileError,
    remove,
    submit,
    processUploaded
  }
}
