<template>
  <USlideover
    v-model:open="open"
    side="left"
    :title="$t('components.mobileSidebar.title')"
    :description="$t('components.mobileSidebar.description')"
    :ui="{ content: 'w-64 max-w-full', header: 'min-h-14 p-3 sm:p-3', title: 'text-sm', description: 'sr-only', body: 'p-2 sm:p-2' }"
  >
    <UButton
      color="neutral"
      variant="ghost"
      class="min-h-14 w-full flex-col justify-center gap-1 rounded-lg px-1 py-2 text-xs font-medium focus-visible:ring-2 focus-visible:ring-primary"
      :class="active || open ? 'text-primary bg-primary/10' : 'text-muted'"
      :aria-label="$t('components.mobileSidebar.title')"
      :aria-expanded="open"
      aria-haspopup="dialog"
    >
      <UIcon
        name="i-lucide-layout-grid"
        class="size-5"
      />
      <span>{{ $t('components.mobileSidebar.title') }}</span>
    </UButton>

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

const route = useRoute()
const { utilityItems, isItemActive } = useNavigation()
const open = ref(false)

const active = computed(() => utilityItems.value.some(isItemActive))
const items = computed<NavigationMenuItem[]>(() => utilityItems.value.map(item => ({
  label: item.label,
  icon: item.icon,
  to: item.to,
  active: isItemActive(item),
  onSelect: () => { open.value = false }
})))

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
