<template>
  <div class="space-y-6">
    <ContentJobHeader
      :job-id="jobId"
      :detail="detail"
    />
    <p
      v-if="failed"
      class="text-sm text-muted"
    >
      {{ $t('components.requestState.failed') }}
    </p>
    <USkeleton
      v-if="loading && !detail"
      class="h-64 w-full"
    />
    <template v-if="detail">
      <p
        v-if="detail.job.safeError"
        class="text-sm text-muted"
      >
        {{ detail.job.errorCode || $t('pages.aiJob.failed') }} · {{ detail.job.safeError }}
      </p>
      <div class="grid lg:grid-cols-12 gap-6 items-start">
        <div class="min-w-0 lg:col-span-7">
          <ContentAssetSlider
            :assets="detail.assets"
            :title="detail.batch.projectName"
          />
        </div>
        <div class="min-w-0 lg:col-span-5 space-y-5">
          <ContentJobSummary :detail="detail" />
          <UButton
            v-if="detail.draft"
            :to="`/content/${jobId}/edit`"
            icon="i-lucide-pencil-line"
            block
          >
            {{ $t('pages.aiJob.viewResult') }}
          </UButton>
          <UButton
            v-if="detail.job.retryable && detail.job.status === 'FAILED'"
            :loading="retrying"
            icon="i-lucide-rotate-ccw"
            block
            @click="retry"
          >
            {{ $t('pages.aiJob.retry') }}
          </UButton>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { jobService } from '~/services/ai-job/job-service'
import type { JobDetails } from '~/types/ai-job'

definePageMeta({ layout: 'dashboard', alias: ['/ai-jobs/:jobId'], key: route => route.path })
const jobId = String(useRoute().params.jobId)
const handleError = useServiceError()
const detail = ref<JobDetails | null>(null)
const retrying = ref(false)
const retryKey = crypto.randomUUID()
const { loading, failed, load } = useLatestRequest(
  () => jobService.details(jobId),
  (response) => { detail.value = response.data }
)
async function retry() {
  if (retrying.value) return
  retrying.value = true
  try {
    const job = (await jobService.retry(jobId, retryKey)).data
    await navigateTo(`/content/${job.jobId}`)
  } catch (error) {
    handleError(error)
  } finally {
    retrying.value = false
  }
}
usePolling(load)
</script>
