<template>
  <USkeleton
    v-if="loading"
    class="h-96 w-full"
  />
  <div
    v-else-if="report"
    class="space-y-5"
  >
    <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AnalyticsMetricStat
        v-for="name in primaryMetrics"
        :key="name"
        class="clay-card metric-tile rounded-3xl border border-default p-4 sm:p-5"
        :label="metricLabel(name)"
        :value="insightValue(report, name)"
        :previous="insightValue(report.previous, name)"
        :rate="name === 'engagementRate'"
        prominent
      />
    </dl>
    <div class="grid items-stretch gap-4 lg:grid-cols-5">
      <div
        class="flex min-w-0 flex-col justify-center gap-4 clay-card rounded-3xl border border-default px-4 py-6 sm:px-6 lg:col-span-2"
      >
        <AnalyticsAccountRadar :report="report" />
        <div class="flex justify-center">
          <UTooltip :text="`${comparisonText} · ${$t('pages.analytics.radarHint')}`">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded text-xs text-muted transition-colors hover:text-default focus-visible:outline-2 focus-visible:outline-primary"
            >
              {{ $t('pages.analytics.comparedWithPrevious') }}
              <UIcon
                name="i-lucide-info"
                class="size-3.5"
              />
            </button>
          </UTooltip>
        </div>
      </div>
      <dl
        class="divide-y divide-default clay-card rounded-3xl border border-default px-5 sm:px-6 lg:col-span-3"
      >
        <AnalyticsMetricStat
          v-for="metric in secondaryMetrics"
          :key="metric.name"
          class="py-4"
          :label="metricLabel(metric.name)"
          :value="metric.value"
          :previous="insightValue(report.previous, metric.name)"
        />
      </dl>
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
