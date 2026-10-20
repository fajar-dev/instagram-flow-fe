<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="space-y-4 shrink-0 select-none">
    <!-- Top Row: Page Title & Description -->
    <div class="flex items-start justify-between gap-4">
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
      <UBreadcrumb
        :items="breadcrumbs"
        class="hidden max-w-md shrink-0 pt-1 lg:block"
        :ui="{ list: 'justify-end flex-wrap', link: 'text-sm font-normal' }"
      >
        <template #separator>
          <span class="mx-2 text-muted">/</span>
        </template>
      </UBreadcrumb>
    </div>

    <!-- Middle Row: Tab links -->
    <div
      v-if="$slots.tabs"
      class="border-b border-default mt-7"
    >
      <nav class="flex gap-6 -mb-px overflow-x-auto">
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
const { breadcrumbs } = useBreadcrumbs()
</script>
