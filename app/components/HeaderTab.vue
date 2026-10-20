<template>
  <NuxtLink
    :to="to"
    :aria-current="active ? 'page' : undefined"
    class="pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer shrink-0 inline-flex items-center gap-2"
    :class="
      active
        ? 'border-primary text-primary font-semibold'
        : 'border-transparent text-muted hover:text-highlighted'
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
