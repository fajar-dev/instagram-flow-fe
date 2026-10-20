<template>
  <div class="space-y-6">
    <DataTable
      v-model:search="search"
      v-model:page="page"
      v-model:per-page="perPage"
      :pagination="!previewLimit && resource !== 'media'"
      :controls="!previewLimit"
      :data="rows"
      :columns="columns"
      :loading="loading"
      :total="total"
      :from="from"
      :to="to"
      :search-placeholder="$t('pages.content.search')"
      :table-class="previewLimit ? 'min-w-160' : 'min-w-192'"
    >
      <template #filters>
        <USelect
          v-if="!fixedStatus && (resource === 'jobs' || resource === 'review')"
          v-model="status"
          :placeholder="$t('pages.content.statusPlaceholder')"
          :items="statuses"
          class="w-full sm:w-52"
          :aria-label="$t('pages.content.statusLabel')"
        />
      </template>
      <template
        v-if="resource === 'media'"
        #content
      >
        <ContentMediaGallery
          :rows="rows"
          :loading="loading"
          @downloaded="download"
          @archived="archiveId = $event"
        />
        <ContentInfiniteScroll
          :loading="loading"
          :has-more="hasMore"
          :failed="failed"
          @requested="loadMore"
        />
      </template>
    </DataTable>
    <DeleteModal
      v-model="showArchive"
      :loading="archiving"
      :title="$t('pages.content.archive')"
      @confirm="archive"
    />
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { ContentRecord, ReportResource } from '~/types/reporting'
import { useContentRecords } from '~/composables/reporting/useContentRecords'
import { formatContentDate } from '~/util/content'

const props = defineProps<{
  resource: ReportResource
  days?: number
  previewLimit?: number
  fixedStatus?: string
}>()
const { t, locale } = useI18n()
const {
  rows,
  hasMore,
  loadMore,
  page,
  perPage,
  total,
  from,
  to,
  search,
  status,
  loading,
  failed,
  archiveId,
  archiving,
  showArchive,
  statuses,
  download,
  archive
} = useContentRecords(props)
const UButton = resolveComponent('UButton')
const UAvatar = resolveComponent('UAvatar')
const NuxtLink = resolveComponent('NuxtLink')
const isContent = computed(() => props.resource === 'jobs' || props.resource === 'review')

function detailPath(row: ContentRecord) {
  return `/content/${props.resource === 'review' ? row.jobId : row.id}`
}

const columns = computed<TableColumn<ContentRecord>[]>(() => [
  {
    id: 'record',
    header: () =>
      t(
        props.resource === 'audit-logs'
          ? 'components.reporting.recordList.event'
          : 'pages.content.fields.projectName'
      ),
    cell: ({ row }) =>
      h('div', { class: 'space-y-1 max-w-sm whitespace-normal' }, [
        h(
          isContent.value ? NuxtLink : 'p',
          {
            class: 'font-medium text-highlighted break-words',
            ...(isContent.value
              ? {
                  to: detailPath(row.original),
                  class:
                    'font-medium text-highlighted break-words hover:text-primary focus-visible:outline-primary'
                }
              : {})
          },
          row.original.event || row.original.projectName || row.original.id
        ),
        isContent.value
          ? row.original.projectLocation
            ? h('p', { class: 'text-xs text-muted break-words' }, row.original.projectLocation)
            : null
          : h(
              'p',
              { class: 'text-xs text-muted break-all' },
              row.original.entityId || row.original.id
            ),
        row.original.safeError
          ? h('p', { class: 'text-sm text-error' }, row.original.safeError)
          : null
      ])
  },
  {
    id: 'actor',
    header: () =>
      t(
        props.resource === 'audit-logs'
          ? 'components.reporting.recordList.actor'
          : 'components.reporting.recordList.uploader'
      ),
    cell: ({ row }) =>
      props.resource === 'audit-logs'
        ? (row.original.actorId ?? '—')
        : h('div', { class: 'flex items-center gap-3' }, [
            h(UAvatar, {
              src: row.original.uploaderPhoto || undefined,
              alt: row.original.uploaderName || undefined,
              icon: row.original.uploaderName ? undefined : 'i-lucide-user',
              size: 'sm'
            }),
            h('span', { class: 'font-medium' }, row.original.uploaderName || '—')
          ])
  },
  ...(isContent.value
    ? [
        {
          id: 'photos',
          header: () => t('components.reporting.recordList.photos'),
          cell: ({ row }: { row: { original: ContentRecord } }) =>
            h('span', { class: 'tabular-nums' }, String(row.original.photoCount ?? '—'))
        }
      ]
    : []),
  ...(isContent.value
    ? [
        {
          id: 'outputs',
          header: () => t('components.reporting.recordList.outputs'),
          cell: ({ row }: { row: { original: ContentRecord } }) =>
            (row.original.requestedOutputs || [])
              .map(output => t(`pages.contentReview.${output}`))
              .join(' · ') || '—'
        }
      ]
    : []),
  {
    accessorKey: 'createdAt',
    header: () => t('pages.aiJob.created'),
    cell: ({ row }) => `${formatContentDate(row.original.createdAt, locale.value)} WIB`
  },
  ...(props.resource === 'audit-logs' || props.previewLimit
    ? []
    : [
        {
          id: 'actions',
          header: () => t('components.reporting.recordList.actions'),
          meta: { class: { td: 'text-right', th: 'text-right' } },
          cell: ({ row }: { row: { original: ContentRecord } }) =>
            h(UButton, {
              'to': detailPath(row.original),
              'color': 'neutral',
              'variant': 'ghost',
              'icon': 'i-lucide-arrow-up-right',
              'aria-label': t('pages.content.detail')
            })
        }
      ])
])
</script>
