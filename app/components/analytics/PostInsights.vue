<template>
  <AnalyticsMetrics
    :report="contentReport"
    :loading="loading"
  />
</template>

<script setup lang="ts">
import { analyticsService } from '~/services/analytics/analytics-service'
import type { InsightReport } from '~/types/analytics'

const props = defineProps<{ publicationId: string }>()
const report = ref<InsightReport | null>(null)
const contentReport = computed(() =>
  report.value
    ? {
        ...report.value,
        metrics: report.value.metrics.filter(metric =>
          [
            'views',
            'reach',
            'likes',
            'comments',
            'saved',
            'shares',
            'total_interactions',
            'replies',
            'navigation'
          ].includes(metric.name)
        )
      }
    : null
)
const { loading, load } = useLatestRequest(
  () => analyticsService.publication(props.publicationId),
  (response) => {
    report.value = response.data
  }
)
watch(
  () => props.publicationId,
  () => {
    report.value = null
    load()
  },
  { immediate: true }
)
</script>
