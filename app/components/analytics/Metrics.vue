<template>
  <div class="space-y-3">
    <USkeleton
      v-if="loading"
      class="h-80 w-full"
    />
    <template v-else-if="report">
      <div class="grid items-center gap-6 xl:grid-cols-2">
        <RadialBarChart
          v-if="chartMetrics.length"
          :data="chartMetrics.map((metric) => metric.value)"
          :categories="categories"
          :height="320"
          :corner-radius="4"
          :legend-position="LegendPosition.BottomCenter"
          :aria-label="$t('pages.analytics.chartLabel')"
          :empty-label="$t('pages.analytics.chartEmpty')"
          :hide-tooltip="true"
        />
        <p
          v-else
          class="py-8 text-center text-sm text-muted"
        >
          {{ $t('pages.analytics.chartEmpty') }}
        </p>

        <dl class="grid grid-cols-2 gap-x-6 gap-y-5">
          <div
            v-for="metric in report.metrics"
            :key="metric.name"
            class="min-w-0"
          >
            <dt class="text-sm text-muted">
              {{ $t(`pages.analytics.metrics.${metric.name}`) }}
            </dt>
            <dd class="mt-1 text-xl font-semibold tabular-nums text-highlighted">
              {{ formatMetric(metric.value, locale) }}
            </dd>
          </div>
        </dl>
      </div>
      <p class="text-xs text-muted">
        {{ $t('pages.analytics.updated', { time: formatContentDate(report.fetchedAt, locale) }) }}
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { LegendPosition } from 'nuxt-charts/enums'
import type { BulletLegendItemInterface } from 'nuxt-charts/types'
import { formatMetric } from '~/util/number'
import type { InsightReport } from '~/types/analytics'
import { formatContentDate } from '~/util/content'

const props = defineProps<{
  report: InsightReport | null
  loading: boolean
}>()
const { locale, t } = useI18n()

const metricColors: Record<string, string> = {
  views: 'var(--ui-primary)',
  reach: 'var(--color-teal-500)',
  likes: 'var(--color-rose-400)',
  comments: 'var(--color-amber-500)',
  saved: 'var(--color-violet-400)',
  shares: 'var(--color-sky-400)',
  total_interactions: 'var(--color-indigo-400)',
  replies: 'var(--color-amber-500)',
  navigation: 'var(--color-violet-400)'
}

const chartMetrics = computed(() =>
  (props.report?.metrics ?? []).filter(
    (metric): metric is typeof metric & { value: number } => metric.value !== null
  )
)
const categories = computed<Record<string, BulletLegendItemInterface>>(() =>
  Object.fromEntries(
    chartMetrics.value.map(metric => [
      metric.name,
      {
        name: t(`pages.analytics.metrics.${metric.name}`),
        color: metricColors[metric.name] ?? 'var(--ui-primary)'
      }
    ])
  )
)
</script>
