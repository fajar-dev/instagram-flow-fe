import { expect, test } from 'bun:test'
import { reactive, ref } from 'vue'
import { useContentDetail } from '../app/composables/content/useContentDetail'
import { useLatestRequest } from '../app/composables/useLatestRequest'
import { jobService } from '../app/services/ai-job/job-service'

test('processing becomes editable on the same page without polling over unsaved edits', async () => {
  let poll
  let calls = 0
  let response = { job: { completedAt: null }, draft: null }
  const cleanup = []
  const replacements = {
    reactive,
    ref,
    useLatestRequest,
    usePolling: (callback) => {
      poll = callback
    },
    useServiceError: () => (error) => {
      throw error
    },
    onUnmounted: callback => cleanup.push(callback)
  }
  const previous = Object.fromEntries(
    Object.keys(replacements).map(key => [key, globalThis[key]])
  )
  const original = jobService.details
  Object.assign(globalThis, replacements)
  jobService.details = async () => {
    calls++
    return { data: response }
  }
  try {
    const state = useContentDetail('job')
    await poll()
    expect(state.detail.value.draft).toBeNull()
    response = {
      job: { completedAt: '2026-10-20' },
      draft: {
        title: 'Project',
        caption: 'Generated',
        hashtags: ['#AMTI'],
        primaryAssetId: 'photo',
        location: 'Jakarta',
        activity: 'Inspection',
        reviewStatus: 'READY_FOR_REVIEW'
      }
    }
    await poll()
    expect(state.form.caption).toBe('Generated')
    state.form.caption = 'Unsaved edit'
    await poll()
    expect(calls).toBe(2)
    expect(state.form.caption).toBe('Unsaved edit')
    response = {
      ...response,
      draft: { ...response.draft, caption: 'Final', reviewStatus: 'PUBLISH' }
    }
    await state.load()
    expect(state.detail.value.draft.reviewStatus).toBe('PUBLISH')
    expect(state.form.caption).toBe('Final')
  } finally {
    cleanup.forEach(callback => callback())
    jobService.details = original
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete globalThis[key]
      } else {
        globalThis[key] = value
      }
    }
  }
})
