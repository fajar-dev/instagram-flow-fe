import { expect, test } from 'bun:test'
import { computed } from 'vue'
import { useBreadcrumbs } from '../app/composables/useBreadcrumbs'

test('content has one breadcrumb destination for review and publishing', () => {
  const route = { path: '/content/example' }
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
