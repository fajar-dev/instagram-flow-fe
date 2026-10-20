<template>
  <div class="space-y-4">
    <!-- Controls -->
    <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
      <div class="flex flex-col sm:flex-row sm:items-center gap-2">
        <div class="flex flex-row items-center gap-2">
          <UInput
            v-model="search"
            icon="i-lucide-search"
            variant="outline"
            :placeholder="searchPlaceholder ?? $t('components.dataTable.searchPlaceholder')"
            :aria-label="searchPlaceholder ?? $t('components.dataTable.searchPlaceholder')"
            class="w-full sm:w-64"
          />
          <USelect
            v-if="pagination"
            v-model="perPage"
            :items="limitOptions"
            :aria-label="$t('components.dataTable.itemsPerPage')"
            :placeholder="$t('components.dataTable.itemsPerPage')"
            class="w-20"
          />
        </div>
        <div
          v-if="$slots.filters"
          class="w-full sm:w-auto"
        >
          <slot name="filters" />
        </div>
      </div>
      <div
        v-if="$slots.actions"
        class="w-full xl:w-auto"
      >
        <slot name="actions" />
      </div>
    </div>
    <div
      :class="
        $slots.content ? 'space-y-4' : 'overflow-hidden rounded-lg border border-default bg-default'
      "
    >
      <!-- Table -->
      <slot name="content">
        <div class="overflow-x-auto">
          <UTable
            v-model:expanded="expanded"
            :expanded-options="{ getRowCanExpand: () => true }"
            :data="data"
            :columns="columns"
            :loading="loading"
            :ui="{
              thead: 'bg-muted',
              th: 'px-5 py-3 text-xs font-semibold whitespace-nowrap',
              td: 'px-5 py-4 text-sm text-highlighted',
              tr: 'transition-colors hover:bg-muted/30 motion-reduce:transition-none',
              empty: 'py-12 text-center text-sm text-muted'
            }"
            :class="['w-full', tableClass]"
          >
            <template #expanded="{ row }">
              <slot
                name="expanded"
                :row="row"
              />
            </template>
          </UTable>
        </div>
      </slot>

      <!-- Pagination -->
      <div
        v-if="pagination"
        class="flex flex-col sm:flex-row items-center justify-between gap-3"
        :class="!$slots.content ? 'border-t border-default bg-muted px-5 py-3' : ''"
      >
        <span class="text-xs tabular-nums">
          {{ $t('components.dataTable.showing', { from: from || 0, to: to || 0, total }) }}
        </span>
        <UPagination
          v-model:page="page"
          size="sm"
          :total="total"
          :items-per-page="perPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import type { TableColumn } from '@nuxt/ui'

const search = defineModel<string>('search', { default: '' })
const page = defineModel<number>('page', { default: 1 })
const perPage = defineModel<number>('perPage', { default: 10 })
const expanded = defineModel<Record<string, boolean>>('expanded', { default: () => ({}) })

withDefaults(
  defineProps<{
    columns: TableColumn<T>[]
    data: T[]
    pagination?: boolean
    loading?: boolean
    total?: number
    from?: number
    to?: number
    searchPlaceholder?: string
    limitOptions?: number[]
    tableClass?: string
  }>(),
  {
    pagination: true,
    loading: false,
    total: 0,
    from: 0,
    to: 0,
    limitOptions: () => [10, 25, 50, 100],
    tableClass: ''
  }
)
</script>
