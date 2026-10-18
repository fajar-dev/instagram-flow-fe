import { expect, test } from 'bun:test'
import { effectScope, nextTick, ref, watch } from 'vue'
import { useTableQuery } from '../app/composables/useTableQuery'

test('changing page size or sort resets to the first page with one reload', async () => {
  const globals = { ref, watch, onUnmounted: () => {} }
  const old = Object.fromEntries(Object.keys(globals).map(key => [key, globalThis[key]]))
  Object.assign(globalThis, globals)
  const scope = effectScope()
  let calls = 0
  try {
    const query = scope.run(() => useTableQuery(() => {
      calls++
    }))
    query.page.value = 4
    await nextTick()
    calls = 0
    query.perPage.value = 25
    await nextTick()
    expect(query.page.value).toBe(1)
    expect(calls).toBe(1)
    query.page.value = 3
    await nextTick()
    calls = 0
    query.toggleSort('name')
    await nextTick()
    expect(query.page.value).toBe(1)
    expect(query.order.value).toBe('ASC')
    expect(calls).toBe(1)
  } finally {
    scope.stop()
    for (const [key, value] of Object.entries(old)) {
      if (value === undefined) delete globalThis[key]
      else globalThis[key] = value
    }
  }
})
