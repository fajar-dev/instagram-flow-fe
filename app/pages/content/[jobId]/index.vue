<template>
  <div class="space-y-6">
    <ContentJobHeader
      :job-id="jobId"
      :detail="detail"
    />
    <USkeleton
      v-if="loading && !detail"
      class="h-64 w-full"
    />
    <template v-if="detail">
      <div class="grid lg:grid-cols-12 gap-6 items-start">
        <div class="min-w-0 lg:col-span-7">
          <ContentAssetSlider
            :assets="detail.assets"
            :title="detail.batch.projectName"
          />
        </div>
        <div class="min-w-0 lg:col-span-5 space-y-5">
          <ContentJobSummary :detail="detail" />
          <UCard v-if="detail.draft">
            <h2 class="text-base font-semibold mb-3">
              {{ detail.draft.title }}
            </h2>
            <p class="text-sm whitespace-pre-line">
              {{ detail.draft.caption }}
            </p>
            <p class="mt-3 text-sm text-primary">
              {{ detail.draft.hashtags.join(' ') }}
            </p>
          </UCard>
          <UButton
            v-if="detail.draft?.reviewStatus === 'READY_FOR_REVIEW'"
            color="error"
            variant="outline"
            block
            @click="rejectOpen = true"
          >
            {{ $t('pages.publishing.reject') }}
          </UButton>
          <PublishingRejectModal
            v-if="detail.draft"
            v-model="rejectOpen"
            :detail="detail"
            @rejected="load"
          />
          <UButton
            v-if="detail.draft && detail.draft.reviewStatus !== 'REJECTED'"
            :to="`/content/${jobId}/publish`"
            icon="i-lucide-send"
            block
          >
            {{ $t('pages.publishing.publish') }}
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

definePageMeta({ layout: 'dashboard', key: route => route.path })
const jobId = String(useRoute().params.jobId)
const handleError = useServiceError()
const detail = ref<JobDetails | null>(null)
const retrying = ref(false)
const rejectOpen = ref(false)
const retryKey = crypto.randomUUID()
const { loading, load } = useLatestRequest(
  () => jobService.details(jobId),
  (response) => {
    detail.value = response.data
  }
)

async function retry() {
  if (retrying.value) {
    return
  }
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
