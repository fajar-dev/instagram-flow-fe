import { expect, test } from 'bun:test'
import { computed, reactive, ref, watch } from 'vue'
import { usePublicationForm } from '../app/composables/publishing/usePublicationForm'
import { publicationService } from '../app/services/publishing/publication-service'

test('publish submits edited content once, preserves retries, and does not require a separate save', async () => {
  const errors = []
  const calls = []
  let completed = 0
  let dispose
  const replacements = {
    computed,
    reactive,
    ref,
    watch,
    onUnmounted: (callback) => {
      dispose = callback
    },
    useI18n: () => ({ t: key => key }),
    useToast: () => ({ add() {} }),
    useServiceError: () => error => errors.push(error)
  }
  const previous = Object.fromEntries(
    Object.keys(replacements).map(key => [key, globalThis[key]])
  )
  const originalCreate = publicationService.create
  Object.assign(globalThis, replacements)
  try {
    const detail = {
      job: { output: 'feed' },
      draft: { id: 'draft', contentHash: 'original' },
      batch: { location: 'Jakarta', activity: 'Inspection' },
      renders: [],
      aiResult: null
    }
    const content = reactive({
      title: 'Final title',
      caption: 'Edited caption',
      hashtagText: '#AMTI',
      location: 'Jakarta',
      activity: 'Inspection'
    })
    const state = usePublicationForm(
      () => detail,
      content,
      () => completed++
    )
    state.form.accountKey = 'one'
    publicationService.create = async (...args) => {
      calls.push(args)
      if (calls.length === 1) {
        throw new Error('Network failed')
      }
    }
    await state.submit()
    expect(completed).toBe(0)
    expect(errors).toHaveLength(1)
    expect(content.caption).toBe('Edited caption')
    await state.submit()
    expect(calls[0][2]).toBe(calls[1][2])
    expect(calls[1][1].content).toEqual({
      title: 'Final title',
      caption: 'Edited caption',
      hashtags: ['#AMTI'],
      location: 'Jakarta',
      activity: 'Inspection'
    })
    expect(calls[1][1].expectedContentHash).toBe('original')
    expect(completed).toBe(1)
    content.caption = 'Another caption'
    await state.submit()
    expect(calls[2][2]).not.toBe(calls[1][2])
    expect(state.submitting.value).toBe(false)
    detail.job.output = 'story'
    await state.submit()
    expect(calls[3][1].placement).toBe('story')
    expect(calls[3][1].content.caption).toBe('')
    expect(calls[3][1].content.hashtags).toEqual([])
    detail.job.output = 'feed'
    content.title = ''
    expect(state.schema.value.safeParse(state.form).success).toBe(false)
    let finish
    publicationService.create = () =>
      new Promise((resolve) => {
        finish = resolve
      })
    const late = state.submit()
    dispose()
    finish()
    await late
    expect(completed).toBe(3)
    content.title = 'Original title'
    detail.aiResult = {
      rawTitle: 'Original title',
      rawCaption: 'Original caption',
      rawHashtags: [],
      selectedAssetIds: ['photo']
    }
    detail.renders = [{ id: 'ai-image', placement: 'feed', assetId: 'photo' }]
    const designState = usePublicationForm(
      () => detail,
      content,
      () => {}
    )
    expect(designState.form.renderIds).toEqual(['ai-image'])
    content.caption = 'A new caption does not change image pixels'
    content.hashtagText = '#Edited'
    expect(designState.form.renderIds).toEqual(['ai-image'])
    content.title = 'A different image title'
    expect(designState.form.renderIds).toEqual(['ai-image'])
    dispose()
  } finally {
    publicationService.create = originalCreate
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete globalThis[key]
      } else {
        globalThis[key] = value
      }
    }
  }
})
