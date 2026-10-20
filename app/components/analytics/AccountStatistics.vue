<template>
  <USkeleton
    v-if="loading"
    class="h-96 w-full"
  />
  <div
    v-else-if="report"
    class="space-y-5"
  >
    <dl class="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <AnalyticsMetricStat
        v-for="name in primaryMetrics"
        :key="name"
        class="rounded-lg border border-default bg-default p-4 sm:p-5"
        :label="metricLabel(name)"
        :value="insightValue(report, name)"
        :previous="insightValue(report.previous, name)"
        :rate="name === 'engagementRate'"
        prominent
      />
    </dl>
    <div class="rounded-lg border border-default bg-default">
      <div
        class="flex flex-wrap items-center justify-between gap-2 border-b border-default px-5 py-4"
      >
        <h2 class="text-base font-semibold text-highlighted">
          {{ $t('pages.analytics.performance') }}
        </h2>
        <UTooltip :text="comparisonText">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 text-xs text-muted"
          >
            {{ $t('pages.analytics.comparedWithPrevious') }}
            <UIcon
              name="i-lucide-info"
              class="size-4"
            />
          </button>
        </UTooltip>
      </div>
      <div class="grid lg:grid-cols-5">
        <div class="min-w-0 border-b border-default p-4 lg:col-span-2 lg:border-r lg:border-b-0">
          <div class="flex items-center justify-between px-1">
            <p class="text-sm font-medium text-highlighted">
              {{ $t('pages.analytics.accountRadar') }}
            </p>
            <UTooltip :text="$t('pages.analytics.radarHint')">
              <UButton
                icon="i-lucide-info"
                color="neutral"
                variant="ghost"
                size="xs"
                :aria-label="$t('pages.analytics.accountRadar')"
              />
            </UTooltip>
          </div>
          <AnalyticsAccountRadar :report="report" />
        </div>
        <dl class="grid content-center grid-cols-2 gap-x-6 gap-y-7 p-5 sm:p-6 lg:col-span-3">
          <AnalyticsMetricStat
            v-for="metric in secondaryMetrics"
            :key="metric.name"
            :label="metricLabel(metric.name)"
            :value="metric.value"
            :previous="insightValue(report.previous, metric.name)"
          />
        </dl>
      </div>
    </div>
    <p class="text-xs text-muted">
      {{ $t('pages.analytics.updated', { time: formatContentDate(report.fetchedAt, locale) }) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { InsightReport } from '~/types/analytics'
import { insightValue } from '~/util/analytics'
import { formatContentDate } from '~/util/content'

const props = defineProps<{ report: InsightReport | null, loading: boolean }>()
const { t, locale } = useI18n()
const primaryMetrics = ['views', 'reach', 'total_interactions', 'engagementRate']
const secondaryMetrics = computed(
  () => props.report?.metrics.filter(metric => !primaryMetrics.includes(metric.name)) ?? []
)
const comparisonText = computed(() => {
  const report = props.report
  if (!report?.range || !report.previous?.range) {
    return t('pages.analytics.comparisonUnavailable')
  }
  return [
    `${t('pages.analytics.currentPeriod')}: ${rangeLabel(report.range)}`,
    `${t('pages.analytics.previousPeriod')}: ${rangeLabel(report.previous.range)}`
  ].join(' · ')
})

function metricLabel(name: string) {
  return t(
    name === 'engagementRate' ? 'pages.analytics.engagementRate' : `pages.analytics.metrics.${name}`
  )
}

function rangeLabel(range: { since: number, until: number }) {
  return `${formatContentDate(new Date(range.since * 1000).toISOString(), locale.value)} – ${formatContentDate(new Date(range.until * 1000).toISOString(), locale.value)} WIB`
}
</script>
