<template>
  <header
    class="flex shrink-0 items-center justify-between gap-3 border-b border-default bg-default px-4 py-2 lg:hidden"
  >
    <div class="flex min-w-0 flex-1 items-center gap-3">
      <BrandLogo class="shrink-0" />
      <div class="min-w-0 flex-1 space-y-1 border-l border-default pl-3">
        <p class="truncate text-sm font-semibold text-highlighted">
          {{ title }}
        </p>
        <UBreadcrumb
          :items="breadcrumbs"
          class="overflow-x-auto"
          :ui="{ list: 'flex-nowrap gap-1', item: 'shrink-0', link: 'text-xs font-normal' }"
        >
          <template #separator>
            <span class="mx-2 text-muted">/</span>
          </template>
        </UBreadcrumb>
      </div>
    </div>
    <div class="shrink-0">
      <UserPopover />
    </div>
  </header>
</template>

<script setup lang="ts">
const { breadcrumbs, title } = useBreadcrumbs()
</script>
