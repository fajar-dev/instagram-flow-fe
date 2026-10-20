<template>
  <div class="space-y-6">
    <ContentJobHeader
      :job-id="jobId"
      :detail="detail"
      publishing
    />
    <USkeleton
      v-if="loading && !detail"
      class="h-64 w-full"
    />
    <div
      v-else-if="detail?.draft"
      class="grid lg:grid-cols-12 gap-6 items-start"
    >
      <div class="min-w-0 lg:col-span-5 lg:sticky lg:top-6">
        <ContentReviewPreviewPanel
          v-model="placement"
          :outputs="detail.draft.reviewStatus === 'PUBLISH' ? [placement] : ['feed', 'story']"
          :primary-asset-id="form.primaryAssetId"
          :caption="form.caption"
          :hashtags="parseHashtags(form.hashtagText)"
          :location="form.location"
          :path="previewPath"
        />
      </div>
      <div class="min-w-0 lg:col-span-7">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between gap-3">
              <h2 class="text-base font-semibold">
                {{ $t('pages.publishing.publish') }}
              </h2>
              <ContentStatusBadge :status="detail.draft.reviewStatus" />
            </div>
          </template>
          <ContentReviewRejectionNotice :detail="detail" />
          <PublishingPublicationPanel
            v-model="form"
            v-model:placement="placement"
            :detail="detail"
            @preview="previewPath = $event"
            @changed="load"
          />
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { parseHashtags } from '~/util/content'
import { usePublishContent } from '~/composables/publishing/usePublishContent'

definePageMeta({
  layout: 'dashboard',
  key: route => route.path
})
const previewPath = ref('')
const jobId = String(useRoute().params.jobId)
const { detail, placement, form, loading, load } = usePublishContent(jobId)
</script>
