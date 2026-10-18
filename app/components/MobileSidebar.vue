<template>
  <USlideover
    v-model:open="open"
    side="left"
    :title="$t('components.mobileSidebar.title')"
    :description="$t('components.mobileSidebar.description')"
    :ui="{ content: 'w-64 max-w-full', header: 'min-h-14 p-3 sm:p-3', title: 'text-sm', description: 'sr-only', body: 'p-2 sm:p-2' }"
  >
    <UButton
      icon="i-lucide-menu"
      color="neutral"
      variant="ghost"
      size="sm"
      class="size-9 justify-center"
      :aria-label="$t('components.header.openMenu')"
    />

    <template #title>
      <BrandLogo />
      <span class="sr-only">{{ $t('components.mobileSidebar.title') }}</span>
    </template>

    <template #close>
      <UButton
        icon="i-lucide-x"
        color="neutral"
        variant="ghost"
        size="sm"
        class="absolute top-2.5 end-2.5 size-9 justify-center"
        :aria-label="$t('components.dashboardLayout.closeSidebar')"
      />
    </template>

    <template #body>
      <div
        class="pb-3 px-1"
      >
        <UButton
          to="/content/upload"
          color="primary"
          variant="solid"
          icon="i-lucide-cloud-upload"
          :label="$t('pages.content.upload')"
          block
          class="justify-center"
          @click="open = false"
        />
      </div>
      <UNavigationMenu
        orientation="vertical"
        :items="items"
        :aria-label="$t('components.mobileSidebar.title')"
        :ui="{ link: 'min-h-9 text-sm px-2.5 py-2', linkLeadingIcon: 'size-4', childLink: 'min-h-9 text-sm px-2.5 py-2' }"
        class="w-full"
      />
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import type { NavItem } from '~/composables/useNavigation'

const route = useRoute()
const { navGroups, isItemActive, isParentActive } = useNavigation()
const open = ref(false)

function toMobileItem(item: NavItem): NavigationMenuItem {
  const hasChildren = Boolean(item.children?.length)
  return {
    label: item.label,
    icon: item.icon,
    value: item.id,
    to: hasChildren || item.to === '#' ? undefined : item.to,
    disabled: !hasChildren && item.to === '#',
    active: hasChildren ? isParentActive(item) : isItemActive(item),
    defaultOpen: hasChildren && isParentActive(item),
    children: item.children?.map(toMobileItem),
    onSelect: hasChildren ? undefined : () => { open.value = false }
  }
}

const items = computed(() => navGroups.value.map(group => group.items.map(toMobileItem)))

watch(() => route.fullPath, () => {
  open.value = false
})

let desktopQuery: MediaQueryList | undefined
function closeOnDesktop() {
  if (desktopQuery?.matches) open.value = false
}
onMounted(() => {
  desktopQuery = window.matchMedia('(min-width: 1024px)')
  desktopQuery.addEventListener('change', closeOnDesktop)
})
onUnmounted(() => desktopQuery?.removeEventListener('change', closeOnDesktop))
</script>
