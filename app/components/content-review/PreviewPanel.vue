<template>
  <UCard :ui="{ body: 'bg-muted/40 space-y-4' }">
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-base font-semibold text-highlighted">
          {{ $t('pages.contentReview.preview') }}
        </h2>
        <UTabs
          v-model="placement"
          :items="outputs.map(value => ({ label: value === 'story' ? $t('pages.contentReview.story') : $t('pages.contentReview.feed'), value }))"
          :content="false"
          size="sm"
          variant="pill"
        />
      </div>
    </template>
    <ContentReviewInstagramFeedPreview
      v-if="placement === 'feed'"
      :path="imagePath"
      :caption="caption"
      :hashtags="hashtags"
      :location="location"
    />
    <div
      v-else
      class="max-w-80 mx-auto py-3"
    >
      <ContentPrivateImage
        :path="imagePath"
        :alt="$t('pages.contentReview.preview')"
        :placement="placement"
      />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Render } from '~/types/ai-job'

const props = defineProps<{ outputs: string[], primaryAssetId: string, isOutdated: boolean, render?: Render, caption: string, hashtags: string[], location: string }>()
const placement = defineModel<string>({ required: true })
const imagePath = computed(() => !props.isOutdated && props.render ? `renders/${props.render.id}` : `assets/${props.primaryAssetId}/preview`)
</script>
