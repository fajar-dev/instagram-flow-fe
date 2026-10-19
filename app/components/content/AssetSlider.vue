<template>
  <UCard class="min-w-0">
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <h2 class="text-base font-semibold text-highlighted">
          {{ $t('pages.content.photos') }}
        </h2>
        <UBadge
          color="neutral"
          variant="soft"
        >
          {{ assets.length }}
        </UBadge>
      </div>
      <p class="text-sm text-muted mt-1">
        {{ $t('pages.content.sliderHint') }}
      </p>
    </template>
    <UCarousel
      v-if="assets.length"
      v-slot="{ item, index }"
      :items="assets"
      :arrows="assets.length > 1"
      :dots="assets.length > 1"
      :prev="{ color: 'neutral', variant: 'solid', size: 'sm' }"
      :next="{ color: 'neutral', variant: 'solid', size: 'sm' }"
      :ui="{
        prev: 'start-3 sm:start-3 z-20 size-9 justify-center shadow-md',
        next: 'end-3 sm:end-3 z-20 size-9 justify-center shadow-md',
        dots: 'static mt-4'
      }"
    >
      <ContentProgressiveImage
        :asset-id="item.id"
        :alt="title"
        :frame-ratio="4 / 3"
        contain
        class="rounded-lg"
      />
      <div class="flex justify-between gap-3 text-xs text-muted mt-3">
        <span>{{ index + 1 }} / {{ assets.length }}</span>
        <span>{{ item.width }} × {{ item.height }} · {{ formatFileSize(item.byteSize) }}</span>
      </div>
    </UCarousel>
    <p
      v-else
      class="text-sm text-muted"
    >
      {{ $t('pages.content.empty') }}
    </p>
  </UCard>
</template>

<script setup lang="ts">
import type { Asset } from '~/types/content'
import { formatFileSize } from '~/util/content'

defineProps<{ assets: Asset[], title: string }>()
</script>
