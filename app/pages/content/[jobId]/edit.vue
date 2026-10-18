<template>
  <div class="space-y-6">
    <ContentJobHeader
      :job-id="jobId"
      :detail="detail"
      editing
      :dirty="dirty"
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
    <template v-else-if="detail?.revision && detail.draft">
      <div class="grid lg:grid-cols-12 gap-6 items-start">
        <div class="min-w-0 lg:col-span-6 xl:col-span-7 lg:sticky lg:top-6">
          <ContentReviewPreviewPanel
            v-model="placement"
            :outputs="detail.job.requestedOutputs"
            :primary-asset-id="form.primaryAssetId"
            :is-outdated="isOutdated"
            :render="render"
          />
        </div>
        <UCard class="min-w-0 lg:col-span-6 xl:col-span-5">
          <template #header>
            <UTabs
              v-model="activePanel"
              :items="panels"
              :content="false"
              variant="link"
              size="sm"
              :ui="{ list: 'w-full overflow-x-auto', trigger: 'shrink-0 flex-1 justify-center' }"
            />
          </template>
          <div
            v-show="activePanel === 'caption'"
            class="space-y-5"
          >
            <p class="text-sm text-muted">
              {{ $t('pages.contentReview.editorHint') }}
            </p>
            <ContentReviewEditorForm
              :model-value="form"
              :schema="schema"
              :saving="saving"
              :loading="loading"
              @update:model-value="Object.assign(form, $event)"
              @submitted="save"
              @restored="restoreAi"
            />
          </div>
          <div v-show="activePanel === 'photos'">
            <ContentReviewRankingsPanel
              :rankings="sortedRankings"
              :primary-asset-id="form.primaryAssetId"
              :disabled="saving || loading"
              @selected="form.primaryAssetId = $event"
            />
            <UButton
              v-if="dirty"
              color="neutral"
              variant="outline"
              icon="i-lucide-arrow-right"
              class="mt-5"
              @click="activePanel = 'caption'"
            >
              {{ $t('pages.contentReview.backToCaption') }}
            </UButton>
          </div>
          <div v-show="activePanel === 'review'">
            <ContentReviewReviewForm
              v-model:notes="notes"
              v-model:decision="decision"
              :saving="saving"
              :loading="loading"
              :dirty="dirty"
              :decisions="decisions"
              @submitted="review"
            />
            <UButton
              v-if="dirty"
              color="neutral"
              variant="outline"
              icon="i-lucide-arrow-left"
              class="mt-4"
              @click="activePanel = 'caption'"
            >
              {{ $t('pages.contentReview.backToCaption') }}
            </UButton>
          </div>
          <div v-show="activePanel === 'history'">
            <ContentReviewReviewHistory :reviews="detail.reviews" />
            <p
              v-if="!detail.reviews.length"
              class="text-sm text-muted py-8 text-center"
            >
              {{ $t('pages.contentReview.noReviews') }}
            </p>
          </div>
        </UCard>
      </div>
    </template>
    <p
      v-else-if="!failed"
      class="text-sm text-muted"
    >
      {{ $t('pages.contentReview.notReady') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useContentStudio } from '~/composables/content-review/useContentStudio'

definePageMeta({ layout: 'dashboard', alias: ['/content-review/studio/:jobId'], key: route => route.path })
const jobId = String(useRoute().params.jobId)
const { t } = useI18n()
const activePanel = ref('caption')
const panels = computed(() => [
  { value: 'caption', label: t('pages.content.fields.caption'), icon: 'i-lucide-text' },
  { value: 'photos', label: t('pages.contentReview.photosTab'), icon: 'i-lucide-images' },
  { value: 'review', label: t('pages.contentReview.reviewTab'), icon: 'i-lucide-check-check' },
  { value: 'history', label: t('pages.contentReview.historyTab'), icon: 'i-lucide-history' }
])
const { detail, form, placement, notes, decision, saving, loading, failed, dirty, render, isOutdated, sortedRankings, decisions, schema, restoreAi, save, review } = useContentStudio(jobId)
</script>
