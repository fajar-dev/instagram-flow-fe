import { expect, test } from 'bun:test'
import { computed, reactive, ref } from 'vue'
import { useContentStudio } from '../app/composables/content-review/useContentStudio'
import { jobService } from '../app/services/ai-job/job-service'
import { draftService } from '../app/services/content-review/draft-service'

test('failed refresh after saving a revision reports the error without a success toast', async () => {
  const replacements = {
    ref, reactive, computed,
    useI18n: () => ({ t: key => key }),
    useToast: () => ({ add: message => toasts.push(message) }),
    useServiceError: () => error => errors.push(error),
    onMounted: () => {}
  }
  const previous = Object.fromEntries(Object.keys(replacements).map(key => [key, globalThis[key]]))
  const originalDetails = jobService.details
  const originalEdit = draftService.edit
  const toasts = []
  const errors = []
  let saved = 0
  const failure = new Error('Reload failed')
  Object.assign(globalThis, replacements)
  try {
    jobService.details = async () => ({ data: {
      job: { requestedOutputs: ['feed'] },
      draft: { id: 'draft' },
      revision: { id: 'revision', title: 'Title', caption: 'Caption', hashtags: [], primaryAssetId: 'asset', location: 'Location', activity: 'Activity' },
      renders: [], reviews: []
    } })
    draftService.edit = async () => {
      saved++
    }
    const studio = useContentStudio('job')
    await studio.load()
    studio.form.title = 'Edited'
    jobService.details = async () => {
      throw failure
    }
    await studio.save()
    expect(saved).toBe(1)
    expect(errors).toEqual([failure])
    expect(toasts).toEqual([])
    expect(studio.form.title).toBe('Edited')
    expect(studio.saving.value).toBe(false)
    expect(studio.loading.value).toBe(false)
  } finally {
    jobService.details = originalDetails
    draftService.edit = originalEdit
    for (const key of Object.keys(replacements)) {
      if (previous[key] === undefined) delete globalThis[key]
      else globalThis[key] = previous[key]
    }
  }
})
