<template>
  <header class="flex shrink-0 items-center justify-between gap-3 border-b border-default bg-default px-4 py-2 lg:hidden">
    <div class="flex min-w-0 flex-1 items-center gap-3">
      <BrandLogo class="shrink-0" />
      <div class="min-w-0 flex-1 space-y-1 border-l border-default pl-3">
        <p class="truncate text-sm font-semibold text-highlighted">
          {{ title }}
        </p>
        <UBreadcrumb
          :items="breadcrumbs"
          class="overflow-x-auto"
          :ui="{ list: 'flex-nowrap gap-1', item: 'shrink-0', link: 'text-xs font-normal', separatorIcon: 'size-3' }"
        />
      </div>
    </div>
    <div class="shrink-0">
      <UserPopover />
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const { mobileItems, utilityItems, isItemActive } = useNavigation()
const breadcrumbs = computed(() => {
  const overview = { label: t('pages.overview.overview'), to: '/overview' }
  const content = { label: t('pages.content.title'), to: '/content' }
  const path = route.path
    .replace(/^\/content-review\/studio\//, '/content/')
    .replace(/^\/ai-jobs(?=\/|$)/, '/content')
  if (path.startsWith('/profile')) {
    return [
      { label: t('components.userPopover.profile'), to: '/profile/information' },
      { label: t(path.endsWith('/password') ? 'pages.profile.index.tabPassword' : 'pages.profile.index.tabInformation') }
    ]
  }
  if (/^\/content\/[^/]+(?:\/edit)?$/.test(path) && !['/content/upload', '/content/media'].includes(path)) {
    const detailPath = path.replace(/\/edit$/, '')
    return [content, { label: t('pages.content.detail'), ...(path.endsWith('/edit') ? { to: detailPath } : {}) },
      ...(path.endsWith('/edit') || route.path.startsWith('/content-review/studio/') ? [{ label: t('pages.contentReview.editorTitle') }] : [])]
  }
  const item = [...mobileItems.value, ...utilityItems.value].find(isItemActive)
  if (item?.id === 'overview') return [{ label: overview.label }]
  if (item?.id === 'upload' || item?.id === 'media') return [content, { label: item.label }]
  return [overview, { label: route.path === '/integration-settings' ? t('pages.integration.settings') : item?.label || content.label }]
})
const title = computed(() => breadcrumbs.value.at(-1)?.label)
</script>
