import type { BreadcrumbItem } from '@nuxt/ui'

export function useBreadcrumbs() {
  const route = useRoute()
  const { t } = useI18n()
  const { mobileItems, utilityItems, isItemActive } = useNavigation()
  const breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const overview = { label: t('pages.overview.overview'), to: '/overview' }
    const content = { label: t('pages.content.title'), to: '/content' }
    const path = route.path
      .replace(/^\/content-review\/studio\//, '/content/')
      .replace(/^\/ai-jobs(?=\/|$)/, '/content')
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
      /^\/content\/[^/]+(?:\/edit)?$/.test(path)
      && !['/content/upload', '/content/media'].includes(path)
    ) {
      const detailPath = path.replace(/\/edit$/, '')
      const isEditor = path.endsWith('/edit') || route.path.startsWith('/content-review/studio/')
      return [
        content,
        { label: t('pages.content.detail'), ...(isEditor ? { to: detailPath } : {}) },
        ...(isEditor ? [{ label: t('pages.contentReview.editorTitle') }] : [])
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
        label:
          route.path === '/integration-settings'
            ? t('pages.integration.settings')
            : item?.label || content.label
      }
    ]
  })
  const title = computed(() => breadcrumbs.value.at(-1)?.label)
  return { breadcrumbs, title }
}
