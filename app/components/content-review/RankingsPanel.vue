<template>
  <section class="space-y-4">
    <p class="text-sm text-muted">
      {{ $t('pages.contentReview.rankingsHint') }}
    </p>
    <div
      v-for="item in rankings"
      :key="item.assetId"
      class="flex gap-4 rounded-lg border p-3 transition-colors"
      :class="primaryAssetId === item.assetId ? 'border-primary bg-primary/5' : 'border-default'"
    >
      <div class="w-24 sm:w-28 shrink-0">
        <ContentProgressiveImage
          :asset-id="item.assetId"
          :alt="item.reason"
          :frame-ratio="1"
          contain
          class="rounded-md"
        />
      </div>
      <div class="min-w-0 flex-1 space-y-2">
        <div class="flex items-center justify-between gap-2">
          <UBadge
            color="neutral"
            variant="soft"
          >
            {{ item.score }}/100
          </UBadge>
          <UIcon
            v-if="primaryAssetId === item.assetId"
            name="i-lucide-circle-check"
            class="size-5 text-primary"
          />
        </div>
        <p class="text-sm text-muted break-words">
          {{ item.reason }}
        </p>
        <UButton
          :disabled="disabled"
          size="sm"
          :variant="primaryAssetId === item.assetId ? 'soft' : 'outline'"
          :aria-pressed="primaryAssetId === item.assetId"
          @click="emit('selected', item.assetId)"
        >
          {{
            $t(
              primaryAssetId === item.assetId
                ? 'pages.contentReview.selectedPhoto'
                : 'pages.contentReview.setPrimary'
            )
          }}
        </UButton>
      </div>
    </div>
    <p
      v-if="!rankings.length"
      class="text-sm text-muted"
    >
      {{ $t('pages.content.empty') }}
    </p>
  </section>
</template>

<script setup lang="ts">
import type { AiResult } from '~/types/ai-job'

defineProps<{ rankings: AiResult['rankings'], primaryAssetId: string, disabled: boolean }>()
const emit = defineEmits<{ selected: [assetId: string] }>()
</script>
