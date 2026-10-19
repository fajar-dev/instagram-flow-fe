<template>
  <div class="space-y-6">
    <Header
      :title="$t('pages.overview.overview')"
      :description="$t('pages.overview.scope')"
    />
    <div class="flex justify-between gap-3">
      <USelect
        v-model="days"
        :placeholder="$t('pages.overview.periodPlaceholder')"
        :items="[7, 30, 90]"
        :aria-label="$t('pages.overview.period')"
        class="w-24"
      />
      <UButton
        to="/content/upload"
        icon="i-lucide-upload"
      >
        {{ $t('pages.content.upload') }}
      </UButton>
    </div>
    <p
      v-if="failed"
      class="text-sm text-muted"
    >
      {{ $t('components.requestState.failed') }}
    </p>
    <div class="grid grid-cols-2 xl:grid-cols-3 gap-4">
      <UCard
        v-for="key in metrics"
        :key="key"
      >
        <p class="text-sm text-muted">
          {{ $t(`pages.overview.metrics.${key}`) }}
        </p>
        <USkeleton
          v-if="loading"
          class="h-8 w-16 mt-2"
        />
        <p
          v-else
          class="text-2xl font-semibold text-highlighted tabular-nums mt-2"
        >
          {{ counts?.[key] ?? '—' }}
        </p>
      </UCard>
    </div>
    <ReportingRecordList
      resource="jobs"
      :days="days"
    />
  </div>
</template>

<script setup lang="ts">
import { reportingService } from '~/services/reporting/reporting-service'

definePageMeta({ layout: 'dashboard' })
const days = ref(30)
const counts = ref<Record<string, number> | null>(null)
const metrics = ['batches', 'assets', 'processing', 'ready', 'failed', 'publish']
const { loading, failed, load } = useLatestRequest(
  () => reportingService.overview(days.value),
  (response) => { counts.value = response.data }
)
watch(days, load)
usePolling(load, 20000)
</script>
