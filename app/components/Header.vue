<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="creative-heading space-y-4 shrink-0 select-none">
    <!-- Top Row: Page Title & Description -->
    <div class="flex items-center justify-between gap-4">
      <img
        :src="`/illustrations/${illustrationKind}.svg`"
        alt=""
        aria-hidden="true"
        width="320"
        height="250"
        class="studio-illustration hidden w-24 shrink-0 sm:block"
      >
      <div class="min-w-0 flex-1 flex flex-col gap-1">
        <h2 class="text-xl md:text-2xl font-bold text-highlighted tracking-tight">
          {{ title }}
        </h2>
        <p
          v-if="description"
          class="text-sm md:text-sm text-muted"
        >
          {{ description }}
        </p>
      </div>

      <div class="hidden shrink-0 items-center gap-1 lg:flex">
        <UColorModeButton
          color="neutral"
          variant="ghost"
        />
        <LanguageSwitcher variant="ghost" />
        <UserPopover />
      </div>
    </div>

    <!-- Middle Row: Tab links -->
    <div
      v-if="$slots.tabs"
      class="mt-5"
    >
      <nav class="flex gap-2 overflow-x-auto pb-1">
        <slot name="tabs" />
      </nav>
    </div>

    <!-- Bottom Row: Actions selectors placed BELOW the tabs, right-aligned -->
    <div
      v-if="$slots.actions"
      class="flex justify-end items-center gap-3 pt-1"
    >
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

defineProps<Props>()
const route = useRoute()
const illustrationKind = computed(() => {
  const path = route.path
  if (path.startsWith('/analytics')) {
    return 'analytics'
  }
  if (path.startsWith('/settings')) {
    return 'settings'
  }
  if (path.startsWith('/profile')) {
    return 'profile'
  }
  if (path.startsWith('/user')) {
    return 'users'
  }
  if (path.startsWith('/activity-logs')) {
    return 'activity'
  }
  if (path.startsWith('/content/upload')) {
    return 'upload'
  }
  if (path.startsWith('/content/media')) {
    return 'media'
  }
  if (path.startsWith('/content')) {
    return 'content'
  }
  return 'overview'
})
</script>
