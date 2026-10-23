<template>
  <section class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="text-base font-semibold text-highlighted">
        {{ $t('pages.contentDraft.preview') }}
      </h2>
    </div>
    <ContentDraftInstagramFeedPreview
      v-if="placement === 'feed'"
      :paths="paths"
      :caption="caption"
      :hashtags="hashtags"
      :location="location"
    />
    <ContentDraftInstagramStoryPreview
      v-else
      :path="paths[0] || ''"
    />
  </section>
</template>

<script setup lang="ts">
defineProps<{
  placement: 'feed' | 'story'
  paths: string[]
  caption: string
  hashtags: string[]
  location: string
}>()
</script>
