<template>
  <NuxtLink
    :to="to"
    :aria-current="active ? 'page' : undefined"
    class="px-4 py-2.5 rounded-full text-sm font-medium border transition-colors cursor-pointer shrink-0 inline-flex items-center gap-2"
    :class="
      active
        ? 'clay-active border-primary/15 text-primary font-semibold'
        : 'border-transparent bg-default/50 text-muted hover:text-highlighted'
    "
  >
    {{ label }}
    <UBadge
      v-if="count !== undefined"
      :color="active ? 'primary' : 'neutral'"
      variant="soft"
      size="md"
      class="justify-center font-medium tabular-nums"
    >
      {{ count === null ? '—' : count }}
    </UBadge>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{ to: RouteLocationRaw, label: string, active: boolean, count?: number | null }>()
</script>
