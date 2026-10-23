<template>
  <div class="space-y-6">
    <Header
      :title="$t('pages.overview.overview')"
      :description="$t('pages.overview.scope')"
    />
    <section class="overflow-hidden rounded-lg border border-primary/20 bg-primary/5">
      <div class="grid gap-6 p-6 sm:p-8 lg:grid-cols-3 lg:items-center">
        <div class="space-y-3 lg:col-span-2">
          <div
            class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary"
          >
            <UIcon
              name="i-lucide-sparkles"
              class="size-4"
            />
            {{ $t('pages.overview.workspace') }}
          </div>
          <h2 class="text-2xl font-semibold tracking-tight text-highlighted sm:text-3xl">
            {{ $t('pages.overview.bannerTitle') }}
          </h2>
          <p class="max-w-xl text-sm leading-relaxed text-muted">
            {{ $t('pages.overview.bannerDescription') }}
          </p>
          <div class="flex flex-wrap gap-3 pt-2">
            <UButton
              to="/content/upload"
              icon="i-lucide-plus"
            >
              {{ $t('pages.content.upload') }}
            </UButton>
            <UButton
              to="/analytics"
              color="neutral"
              variant="outline"
              icon="i-lucide-chart-no-axes-combined"
            >
              {{ $t('pages.analytics.title') }}
            </UButton>
          </div>
        </div>
        <NuxtLink
          to="/content?status=READY_FOR_REVIEW"
          class="rounded-lg border border-default bg-default p-5 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary"
        >
          <div class="flex items-center justify-between text-primary">
            <UIcon
              name="i-lucide-scan-eye"
              class="size-6"
            /><UIcon
              name="i-lucide-arrow-up-right"
              class="size-5"
            />
          </div>
          <USkeleton
            v-if="loading && !counts"
            class="my-3 h-12 w-16"
          />
          <p
            v-else
            class="my-3 text-4xl font-semibold tabular-nums text-highlighted"
          >
            {{ counts?.ready ?? '—' }}
          </p>
          <p class="font-medium text-highlighted">{{ $t('pages.overview.metrics.ready') }}</p>
          <p class="mt-1 text-sm text-muted">{{ $t('pages.overview.reviewHint') }}</p>
        </NuxtLink>
      </div>
    </section>
    <dl class="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <div
        v-for="metric in metrics"
        :key="metric.key"
        class="rounded-lg border border-default bg-default p-5"
      >
        <dt class="mb-4 flex items-center justify-between gap-2 text-sm text-muted">
          <span>{{ $t(`pages.overview.metrics.${metric.key}`) }}</span><UIcon
            :name="metric.icon"
            class="size-5 shrink-0 text-primary"
          />
        </dt>
        <dd>
          <USkeleton
            v-if="loading && !counts"
            class="h-8 w-16"
          /><span
            v-else
            class="text-2xl font-semibold tabular-nums text-highlighted"
          >{{ counts?.[metric.key] ?? '—' }}</span>
        </dd>
      </div>
    </dl>
    <div class="flex items-center justify-between gap-3">
      <div class="space-y-1">
        <h2 class="text-base font-semibold text-highlighted">
          {{ $t('pages.content.status.READY_FOR_REVIEW') }}
        </h2>
        <p class="text-sm text-muted">
          {{ $t('pages.overview.reviewSubtitle') }}
        </p>
      </div>
      <UButton
        to="/content?status=READY_FOR_REVIEW"
        variant="link"
        trailing-icon="i-lucide-arrow-right"
        size="sm"
      >
        {{ $t('pages.overview.viewContent') }}
      </UButton>
    </div>
    <ReportingRecordList
      resource="drafts"
      fixed-status="READY_FOR_REVIEW"
      :preview-limit="5"
    />
  </div>
</template>

<script setup lang="ts">
import { reportingService } from '~/services/reporting/reporting-service'

definePageMeta({ layout: 'dashboard' })
const counts = ref<Record<string, number> | null>(null)
const metrics = [
  { key: 'processing', icon: 'i-lucide-loader' },
  { key: 'failed', icon: 'i-lucide-circle-alert' },
  { key: 'publish', icon: 'i-lucide-send' },
  { key: 'rejected', icon: 'i-lucide-circle-x' }
]
const { loading, load } = useLatestRequest(
  () => reportingService.overview(),
  (response) => {
    counts.value = response.data
  }
)
usePolling(load, 20000)
</script>
