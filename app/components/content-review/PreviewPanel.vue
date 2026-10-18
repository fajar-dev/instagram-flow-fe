<template>
  <UCard :ui="{ body: 'bg-muted/40' }">
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
    <p
      v-if="isOutdated"
      class="text-sm text-muted"
    >
      {{ $t('pages.contentReview.outdated') }}
    </p>
    <div class="max-w-80 mx-auto py-3">
      <ContentPrivateImage
        :path="!isOutdated && render ? `renders/${render.id}` : `assets/${primaryAssetId}/preview`"
        :alt="$t('pages.contentReview.preview')"
        :placement="placement"
      />
    </div>
    <p
      v-if="isOutdated || !render"
      class="text-sm text-muted mt-3"
    >
      {{ $t('pages.contentReview.originalFallback') }}
    </p>
    <template #footer>
      <p class="text-xs text-muted leading-relaxed">
        {{ $t('pages.contentReview.previewWarning') }} · {{ $t('pages.contentReview.primaryOnly') }}
      </p>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { Render } from '~/types/ai-job'

defineProps<{ outputs: string[], primaryAssetId: string, isOutdated: boolean, render?: Render }>()
const placement = defineModel<string>({ required: true })
</script>
