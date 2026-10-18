import { expect, test } from 'bun:test'
import { computed, effectScope, nextTick, ref, watch } from 'vue'
import { useContentRecords } from '../app/composables/reporting/useContentRecords'
import { reportingService } from '../app/services/reporting/reporting-service'

test('media appends once, retains results on failure, retries the same page and resets search', async () => {
  const cleanup = []
  let mount
  const globals = { ref, computed, watch, useI18n: () => ({ t: key => key }), useServiceError: () => () => {}, onMounted: (fn) => {
    mount = fn
  }, onUnmounted: fn => cleanup.push(fn) }
  const previous = Object.fromEntries(Object.keys(globals).map(key => [key, globalThis[key]]))
  Object.assign(globalThis, globals)
  const original = reportingService.list
  const calls = []
  let fail = false
  reportingService.list = async (_, params) => {
    calls.push({ ...params })
    if (fail) throw new Error('Offline')
    return {
      data: params.q ? [{ id: 'search' }] : params.page === 1 ? [{ id: 'a' }, { id: 'b' }] : [{ id: 'b' }, { id: 'c' }],
      meta: { total: params.q ? 1 : 20 }
    }
  }
  const scope = effectScope()
  const settle = async () => {
    await nextTick()
    await nextTick()
    await nextTick()
  }
  try {
    const state = scope.run(() => useContentRecords({ resource: 'media', days: 30 }))
    await mount()
    fail = true
    state.loadMore()
    await settle()
    expect(state.rows.value.map(row => row.id)).toEqual(['a', 'b'])
    expect(state.failed.value).toBe(true)
    fail = false
    state.loadMore()
    await settle()
    expect(calls.map(call => call.page)).toEqual([1, 2, 2])
    expect(state.rows.value.map(row => row.id)).toEqual(['a', 'b', 'c'])
    expect(state.hasMore.value).toBe(false)
    state.loadMore()
    await settle()
    expect(calls).toHaveLength(3)
    state.search.value = 'new'
    await new Promise(resolve => setTimeout(resolve, 350))
    await settle()
    expect(calls.at(-1)).toMatchObject({ page: 1, q: 'new' })
    expect(state.rows.value.map(row => row.id)).toEqual(['search'])
  } finally {
    cleanup.forEach(fn => fn())
    scope.stop()
    reportingService.list = original
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete globalThis[key]
      else globalThis[key] = value
    }
  }
})
