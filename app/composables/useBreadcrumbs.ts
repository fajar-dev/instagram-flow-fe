import type { BreadcrumbItem } from '@nuxt/ui'

export function useBreadcrumbs() {
  const route = useRoute()
  const { t } = useI18n()
  const { mobileItems, utilityItems, isItemActive } = useNavigation()
  const breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const overview = { label: t('pages.overview.overview'), to: '/overview' }
    const content = { label: t('pages.content.title'), to: '/content' }
    const path = route.path
    if (path.startsWith('/profile')) {
      return [
        { label: t('components.userPopover.profile'), to: '/profile/information' },
        {
          label: t(
            path.endsWith('/password')
              ? 'pages.profile.index.tabPassword'
              : 'pages.profile.index.tabInformation'
          )
        }
      ]
    }
    if (
      /^\/content\/[^/]+(?:\/publish)?$/.test(path)
      && !['/content/upload', '/content/media'].includes(path)
    ) {
      const detailPath = path.replace(/\/publish$/, '')
      const isPublishing = path.endsWith('/publish')
      return [
        content,
        { label: t('pages.content.detail'), ...(isPublishing ? { to: detailPath } : {}) },
        ...(isPublishing ? [{ label: t('pages.publishing.publish') }] : [])
      ]
    }
    const item = [...mobileItems.value, ...utilityItems.value].find(isItemActive)
    if (item?.id === 'overview') {
      return [{ label: overview.label }]
    }
    if (item?.id === 'upload' || item?.id === 'media') {
      return [content, { label: item.label }]
    }
    return [
      overview,
      {
        label: item?.label || content.label
      }
    ]
  })
  const title = computed(() => breadcrumbs.value.at(-1)?.label)
  return { breadcrumbs, title }
}
