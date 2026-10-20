import { expect, test } from 'bun:test'
import { computed } from 'vue'
import { useBreadcrumbs } from '../app/composables/useBreadcrumbs'

test('current and legacy editor breadcrumbs link to the same content detail', () => {
  const route = { path: '/content/example/edit' }
  const replacements = {
    computed,
    useRoute: () => route,
    useI18n: () => ({ t: key => key }),
    useNavigation: () => ({
      mobileItems: { value: [] },
      utilityItems: { value: [] },
      isItemActive: () => false
    })
  }
  const previous = Object.fromEntries(
    Object.keys(replacements).map(key => [key, globalThis[key]])
  )
  Object.assign(globalThis, replacements)
  try {
    const current = useBreadcrumbs().breadcrumbs.value
    route.path = '/content-review/studio/example'
    const legacy = useBreadcrumbs().breadcrumbs.value
    expect(legacy).toEqual(current)
    expect(legacy[1].to).toBe('/content/example')
    expect(legacy[2].to).toBeUndefined()
    route.path = '/content/example'
    expect(useBreadcrumbs().breadcrumbs.value).toEqual([
      { label: 'pages.content.title', to: '/content' },
      { label: 'pages.content.detail' }
    ])
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete globalThis[key]
      } else {
        globalThis[key] = value
      }
    }
  }
})
