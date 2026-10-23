<template>
  <section
    v-if="detail.draft?.decisionStatus === 'REJECTED'"
    class="space-y-2"
  >
    <h3 class="text-sm font-medium text-highlighted">
      {{ $t('pages.contentDraft.rejectionTitle') }}
    </h3>
    <p class="text-sm text-toned whitespace-pre-line break-words">
      {{ rejection?.notes.trim() || $t('pages.contentDraft.rejectionEmpty') }}
    </p>
    <p
      v-if="rejection"
      class="text-xs text-muted"
    >
      {{ formatContentDate(rejection.createdAt, locale) }} WIB
    </p>
  </section>
</template>

<script setup lang="ts">
import type { JobDetails } from '~/types/ai-job'
import { formatContentDate } from '~/util/content'
import { latestRejection } from '~/util/rejection'

const props = defineProps<{ detail: JobDetails }>()
const { locale } = useI18n()
const rejection = computed(() => latestRejection(props.detail))
</script>
