<template>
  <div class="min-w-0 space-y-3">
    <RadarChart
      v-if="data.length >= 3"
      :data="data"
      :categories="categories"
      data-key="metric"
      :height="320"
      :fill-opacity="0.2"
      :legend-position="LegendPosition.BottomCenter"
      :hide-tooltip="true"
      :aria-label="$t('pages.analytics.accountRadar')"
    />
    <p
      v-else
      class="py-8 text-sm text-muted"
    >
      {{ $t('pages.analytics.comparisonUnavailable') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { LegendPosition } from 'nuxt-charts/enums'
import type { BulletLegendItemInterface } from 'nuxt-charts/types'
import type { InsightReport } from '~/types/analytics'
import { radarMetrics } from '~/util/analytics'

const props = defineProps<{ report: InsightReport }>()
const { t } = useI18n()
const data = computed(() =>
  radarMetrics(props.report).map(row => ({
    metric: t(
      row.name === 'engagementRate'
        ? 'pages.analytics.engagementRate'
        : `pages.analytics.metrics.${row.name}`
    ),
    current: row.current,
    previous: row.previous
  }))
)
const categories = computed<Record<string, BulletLegendItemInterface>>(() => ({
  current: { name: t('pages.analytics.currentPeriod'), color: 'var(--ui-primary)' },
  previous: { name: t('pages.analytics.previousPeriod'), color: 'var(--color-teal-500)' }
}))
</script>
