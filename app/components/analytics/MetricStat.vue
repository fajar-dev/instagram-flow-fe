<template>
  <div class="min-w-0">
    <dt class="text-sm text-muted">
      {{ label }}
    </dt>
    <dd class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
      <span
        :class="prominent ? 'text-3xl' : 'text-xl'"
        class="font-semibold tabular-nums tracking-tight text-highlighted"
      >
        {{ rate ? formatRate(value, locale) : formatMetric(value, locale) }}
      </span>
      <UTooltip :text="tooltip">
        <span
          tabindex="0"
          class="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums"
          :class="
            trend.direction === 'up'
              ? 'bg-success/10 text-success'
              : trend.direction === 'down'
                ? 'bg-error/10 text-error'
                : 'bg-elevated text-muted'
          "
        >
          <UIcon
            :name="icon"
            class="size-3.5 shrink-0"
          />
          {{ trendLabel }}
        </span>
      </UTooltip>
    </dd>
  </div>
</template>

<script setup lang="ts">
import { metricTrend } from '~/util/analytics'
import { formatMetric, formatRate } from '~/util/number'

const props = defineProps<{
  label: string
  value: number | null
  previous: number | null
  rate?: boolean
  prominent?: boolean
}>()
const { t, locale } = useI18n()
const trend = computed(() => metricTrend(props.value, props.previous, props.rate))
const icon = computed(
  () =>
    ({
      up: 'i-lucide-trending-up',
      down: 'i-lucide-trending-down',
      flat: 'i-lucide-minus',
      unavailable: 'i-lucide-minus'
    })[trend.value.direction]
)
const trendLabel = computed(() => {
  if (trend.value.direction === 'unavailable') {
    return '—'
  }
  if (trend.value.value === null) {
    return t('pages.analytics.fromZero')
  }
  const value = new Intl.NumberFormat(locale.value, { maximumFractionDigits: 1 }).format(
    trend.value.value
  )
  return props.rate ? t('pages.analytics.percentagePoints', { value }) : `${value}%`
})
const tooltip = computed(() => {
  const previous = props.rate
    ? formatRate(props.previous, locale.value)
    : formatMetric(props.previous, locale.value)
  return [
    t(`pages.analytics.trend.${trend.value.direction}`),
    t('pages.analytics.previousValue', { value: previous }),
    ...(props.rate ? [t('pages.analytics.rateHint')] : [])
  ].join(' · ')
})
</script>
