<template>
  <section class="space-y-4">
    <div class="space-y-1">
      <h2 class="text-base font-semibold text-highlighted">
        {{ $t('pages.analytics.topPosts') }}
      </h2>
      <p class="text-sm text-muted">
        {{ $t('pages.analytics.topPostsHint') }}
      </p>
    </div>
    <DataTable
      :data="posts"
      :columns="columns"
      :loading="loading && !posts.length"
      :controls="false"
      :pagination="false"
    />
    <p
      v-if="loading"
      class="text-xs text-muted"
    >
      {{ $t('pages.analytics.loadingPosts', { count: posts.length }) }}
    </p>
    <UButton
      v-if="failed"
      color="neutral"
      variant="outline"
      @click="load"
    >
      {{ $t('pages.aiJob.retry') }}
    </UButton>
  </section>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { useTopPosts } from '~/composables/analytics/useTopPosts'
import { formatContentDate } from '~/util/content'
import type { TopPostsReport } from '~/types/analytics'
import { tableActions, tableActionsMeta } from '~/util/table-actions'
import { formatMetric, formatRate } from '~/util/number'

const props = defineProps<{ accountKey: string }>()
const { t, locale } = useI18n()
const UButton = resolveComponent('UButton')
const UTooltip = resolveComponent('UTooltip')
const { posts, loading, failed, load } = useTopPosts(() => props.accountKey)
const columns = computed<TableColumn<TopPostsReport['items'][number]>[]>(() => [
  {
    id: 'post',
    header: () => t('pages.analytics.post'),
    cell: ({ row }) =>
      h(
        'p',
        { class: 'line-clamp-2 min-w-64 max-w-md whitespace-normal' },
        row.original.media.caption || row.original.media.id
      )
  },
  {
    id: 'type',
    header: () => t('pages.analytics.type'),
    cell: ({ row }) => row.original.media.product
  },
  {
    id: 'published',
    header: () => t('pages.analytics.publishedAt'),
    cell: ({ row }) => formatContentDate(row.original.media.timestamp, locale.value)
  },
  ...[
    'views',
    'reach',
    'likes',
    'comments',
    'saved',
    'shares',
    'total_interactions',
    'follows',
    'profile_visits',
    'profile_activity'
  ].map(name => ({
    id: name,
    header: () => t(`pages.analytics.metrics.${name}`),
    cell: ({ row }: { row: { original: TopPostsReport['items'][number] } }) =>
      formatMetric(
        row.original.metrics.find(metric => metric.name === name)?.value ?? null,
        locale.value
      )
  })),
  {
    id: 'engagementRate',
    header: () => t('pages.analytics.engagementRate'),
    cell: ({ row }) => formatRate(row.original.engagementRate, locale.value)
  },
  {
    id: 'actions',
    header: () => t('components.reporting.recordList.actions'),
    meta: tableActionsMeta,
    cell: ({ row }) =>
      tableActions(
        h(
          UTooltip,
          { text: t('pages.publishing.viewPost') },
          {
            default: () =>
              h(UButton, {
                'aria-label': t('pages.publishing.viewPost'),
                'icon': 'i-lucide-external-link',
                'variant': 'ghost',
                'size': 'sm',
                'to': row.original.media.permalink || undefined,
                'disabled': !row.original.media.permalink,
                'target': '_blank',
                'rel': 'noopener noreferrer'
              })
          }
        )
      )
  }
])
</script>
