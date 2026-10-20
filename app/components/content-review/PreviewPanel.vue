<template>
  <section class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="text-base font-semibold text-highlighted">
        {{ $t('pages.contentReview.preview') }}
      </h2>
    </div>
    <ContentReviewInstagramFeedPreview
      v-if="placement === 'feed'"
      :path="imagePath"
      :caption="caption"
      :hashtags="hashtags"
      :location="location"
    />
    <ContentReviewInstagramStoryPreview
      v-else
      :path="imagePath"
    />
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  placement: 'feed' | 'story'
  primaryAssetId: string
  path?: string
  caption: string
  hashtags: string[]
  location: string
}>()
const imagePath = computed(() => props.path || `assets/${props.primaryAssetId}/preview`)
</script>
