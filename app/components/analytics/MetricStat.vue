<template>
  <div
    class="min-w-0"
    :class="
      prominent
        ? 'grid grid-cols-2 items-start gap-x-2 gap-y-3'
        : 'flex items-center justify-between gap-4'
    "
  >
    <dt
      class="text-sm text-muted"
      :class="prominent ? 'self-center' : undefined"
    >
      {{ label }}
    </dt>
    <dd :class="prominent ? 'contents' : 'flex shrink-0 items-center justify-end gap-4'">
      <span
        :class="
          prominent ? ['col-span-2 row-start-2 text-3xl', valueColor] : 'text-lg text-highlighted'
        "
        class="font-semibold tabular-nums tracking-tight"
      >
        {{ rate ? formatRate(value, locale) : formatMetric(value, locale) }}
      </span>
      <UTooltip :text="tooltip">
        <span
          tabindex="0"
          class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium tabular-nums"
          :class="[
            prominent ? 'col-start-2 row-start-1 justify-self-end' : 'min-w-16 justify-center',
            trend.direction === 'up'
              ? 'bg-success/10 text-success'
              : trend.direction === 'down'
                ? 'bg-error/10 text-error'
                : prominent
                  ? 'bg-elevated text-muted'
                  : 'text-muted'
          ]"
        >
          <UIcon
            :name="icon"
            class="size-3.5 shrink-0"
          />
          {{ trendLabel }}
        </span>
      </UTooltip>
      <span
        v-if="prominent"
        class="col-span-2 text-xs leading-relaxed text-muted"
      >
        {{ $t('pages.analytics.previousValue', { value: previousLabel }) }}
      </span>
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
      up: 'i-lucide-arrow-up',
      down: 'i-lucide-arrow-down',
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
const valueColor = computed(() => {
  if (trend.value.direction === 'up') {
    return 'text-success'
  }
  if (trend.value.direction === 'down') {
    return 'text-error'
  }
  return 'text-highlighted'
})
const previousLabel = computed(() =>
  props.rate ? formatRate(props.previous, locale.value) : formatMetric(props.previous, locale.value)
)
const tooltip = computed(() => {
  return [
    t(`pages.analytics.trend.${trend.value.direction}`),
    t('pages.analytics.previousValue', { value: previousLabel.value }),
    ...(props.rate ? [t('pages.analytics.rateHint')] : [])
  ].join(' · ')
})
</script>
