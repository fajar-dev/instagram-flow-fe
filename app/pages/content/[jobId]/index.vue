<template>
  <div class="space-y-6">
    <Header
      :title="detail?.batch.projectName || $t('pages.aiJob.jobDetail')"
      :description="detail?.batch.activity"
    />
    <USkeleton
      v-if="loading && !detail"
      class="h-64 w-full"
    />
    <div
      v-if="detail"
      class="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start"
    >
      <div class="min-w-0 lg:col-span-5 lg:sticky lg:top-6">
        <ContentReviewPreviewPanel
          v-if="detail.draft"
          v-model="placement"
          :outputs="detail.draft.reviewStatus === 'PUBLISH' ? [placement] : ['feed', 'story']"
          :primary-asset-id="form.primaryAssetId"
          :caption="form.caption"
          :hashtags="parseHashtags(form.hashtagText)"
          :location="form.location"
          :path="previewPath"
        />
        <ContentAssetSlider
          v-else
          :assets="detail.assets"
          :title="detail.batch.projectName"
        />
      </div>
      <div class="min-w-0 lg:col-span-7 space-y-6">
        <UCard>
          <PublishingPublicationPanel
            v-if="detail.draft && detail.draft.reviewStatus !== 'REJECTED'"
            v-model="form"
            v-model:placement="placement"
            :detail="detail"
            @preview="previewPath = $event"
            @changed="load"
          />
          <div
            v-else
            class="space-y-5"
          >
            <ContentStatusBadge :status="detail.draft?.reviewStatus || detail.job.status" />
            <ContentReviewRejectionNotice
              v-if="detail.draft"
              :detail="detail"
            />
            <template v-else>
              <p
                v-if="detail.job.safeError"
                class="text-sm text-error break-words"
              >
                {{ detail.job.safeError }}
              </p>
              <ContentJobTimeline :job="detail.job" />
              <UButton
                v-if="detail.job.retryable && detail.job.status === 'FAILED'"
                :loading="retrying"
                icon="i-lucide-rotate-ccw"
                @click="retry"
              >
                {{ $t('pages.aiJob.retry') }}
              </UButton>
            </template>
          </div>
        </UCard>
        <UCard>
          <template #header>
            <h2 class="text-base font-semibold text-highlighted">
              {{ $t('pages.content.projectSummary') }}
            </h2>
          </template>
          <ContentJobSummary :detail="detail" />
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { parseHashtags } from '~/util/content'
import { useContentDetail } from '~/composables/content/useContentDetail'

definePageMeta({ layout: 'dashboard', key: route => route.path })
const jobId = String(useRoute().params.jobId)
const previewPath = ref('')
const { detail, placement, form, loading, load, retrying, retry } = useContentDetail(jobId)
</script>
