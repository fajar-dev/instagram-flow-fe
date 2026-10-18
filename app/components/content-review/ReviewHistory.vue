<template>
  <section v-if="reviews.length">
    <h2 class="text-base font-semibold text-highlighted mb-3">
      {{ $t('pages.contentReview.reviewHistory') }}
    </h2>
    <div
      v-for="item in reviews"
      :key="item.id"
      class="py-3 border-b border-default last:border-b-0"
    >
      <ContentStatusBadge :status="item.decision" /><p class="text-sm mt-2">
        {{ item.notes }}
      </p>
      <p class="text-xs text-muted break-words">
        {{ formatContentDate(item.createdAt, locale) }} WIB · {{ item.reviewerId }} · {{ item.revisionId }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { JobDetails } from '~/types/ai-job'
import { formatContentDate } from '~/util/content'

defineProps<{ reviews: JobDetails['reviews'] }>()
const { locale } = useI18n()
</script>
