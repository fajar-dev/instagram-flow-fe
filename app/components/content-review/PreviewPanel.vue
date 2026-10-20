<template>
  <section class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="text-base font-semibold text-highlighted">
        {{ $t('pages.contentReview.preview') }}
      </h2>
      <UTabs
        v-model="placement"
        :items="
          outputs.map((value) => ({
            label:
              value === 'story' ? $t('pages.contentReview.story') : $t('pages.contentReview.feed'),
            value
          }))
        "
        :content="false"
        size="sm"
        variant="pill"
      />
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
  outputs: string[]
  primaryAssetId: string
  path?: string
  caption: string
  hashtags: string[]
  location: string
}>()
const placement = defineModel<string>({ required: true })
const imagePath = computed(() => props.path || `assets/${props.primaryAssetId}/preview`)
</script>
