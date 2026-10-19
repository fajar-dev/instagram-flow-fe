<template>
  <div class="space-y-6">
    <ContentJobHeader
      :job-id="jobId"
      :detail="detail"
      editing
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
        <div class="min-w-0 lg:col-span-5 lg:sticky lg:top-6">
          <ContentReviewPreviewPanel
            v-model="placement"
            :outputs="detail.job.requestedOutputs"
            :primary-asset-id="form.primaryAssetId"
            :caption="form.caption"
            :hashtags="parseHashtags(form.hashtagText)"
            :location="form.location"
            :is-outdated="isOutdated"
            :render="render"
          />
        </div>
        <div class="min-w-0 lg:col-span-7 space-y-6">
          <UCard
            class="divide-y-0"
            :ui="{ header: 'pb-0 sm:pb-0' }"
          >
            <template #header>
              <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 class="text-base font-semibold text-highlighted">
                  {{ $t('pages.contentReview.editorTitle') }}
                </h2>
                <ContentStatusBadge
                  v-if="activePanel !== 'publish' || detail.draft.reviewStatus !== 'PUBLISH'"
                  :status="detail.draft.reviewStatus"
                />
              </div>
              <UTabs
                v-model="activePanel"
                :items="panels"
                :content="false"
                variant="pill"
                color="primary"
                size="sm"
                :ui="{
                  list: 'w-full bg-muted rounded-lg p-1',
                  trigger: 'flex-1 justify-center px-2 py-2 text-sm',
                  indicator: 'shadow-sm rounded-md'
                }"
              />
              <UBadge
                v-if="dirty && editable"
                color="warning"
                variant="subtle"
                size="sm"
                class="mt-3"
              >
                {{ $t('pages.contentReview.unsaved') }}
              </UBadge>
            </template>
            <div
              v-show="activePanel === 'caption'"
              class="space-y-5"
            >
              <p class="text-sm text-muted">
                {{ $t(editable ? 'pages.contentReview.editorHint' : 'pages.contentReview.readOnlyHint') }}
              </p>
              <ContentReviewEditorForm
                :model-value="form"
                :schema="schema"
                :saving="saving"
                :loading="loading"
                :readonly="!editable"
                @update:model-value="Object.assign(form, $event)"
                @submitted="save"
                @restored="restoreAi"
              />
            </div>
            <div v-show="activePanel === 'photos'">
              <ContentReviewRankingsPanel
                :rankings="sortedRankings"
                :primary-asset-id="form.primaryAssetId"
                :disabled="saving || loading || !editable"
                @selected="form.primaryAssetId = $event"
              />
              <UButton
                v-if="dirty && editable"
                color="neutral"
                variant="outline"
                icon="i-lucide-arrow-right"
                class="mt-5"
                @click="activePanel = 'caption'"
              >
                {{ $t('pages.contentReview.backToCaption') }}
              </UButton>
            </div>
            <div
              v-show="activePanel === 'publish'"
              class="space-y-5"
            >
              <ContentReviewRejectionNotice :detail="detail" />
              <PublishingPublicationPanel
                v-if="detail.draft"
                :detail="detail"
                :dirty="dirty"
                @changed="load"
              />
            </div>
          </UCard>
        </div>
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
import { parseHashtags } from '~/util/content'
import { useContentStudio } from '~/composables/content-review/useContentStudio'

definePageMeta({ layout: 'dashboard', alias: ['/content-review/studio/:jobId'], key: route => route.path })
const jobId = String(useRoute().params.jobId)
const { t } = useI18n()
const activePanel = ref('caption')
const panels = computed(() => [
  { value: 'caption', label: t('pages.content.fields.caption') },
  { value: 'photos', label: t('pages.contentReview.photosTab') },
  { value: 'publish', label: t('pages.publishing.publish') }
])
const { detail, editable, form, placement, saving, loading, failed, dirty, render, isOutdated, sortedRankings, schema, restoreAi, save, load } = useContentStudio(jobId)
</script>
