<template>
  <div class="space-y-4">
    <dl class="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
      <div
        v-for="field in ['activity', 'location', 'documentationDate', 'clientName'] as const"
        :key="field"
        class="space-y-1"
      >
        <dt class="text-muted">
          {{ $t(`pages.content.fields.${field}`) }}
        </dt>
        <dd class="font-medium text-highlighted break-words">
          {{
            field === 'documentationDate'
              ? formatDate(detail.batch[field], locale)
              : detail.batch[field] || '—'
          }}
        </dd>
      </div>
      <div class="space-y-1">
        <dt class="text-muted">
          {{ $t('pages.content.outputs') }}
        </dt>
        <dd class="text-toned">
          {{ $t(`pages.contentReview.${detail.job.output}`) }}
        </dd>
      </div>
      <div
        v-if="detail.batch.description"
        class="col-span-2 space-y-1"
      >
        <dt class="text-muted">
          {{ $t('pages.content.fields.description') }}
        </dt>
        <dd class="text-toned leading-relaxed whitespace-pre-line break-words">
          {{ detail.batch.description }}
        </dd>
      </div>
    </dl>

    <ContentJobTimeline
      v-if="detail.draft"
      :job="detail.job"
    />

    <UAccordion
      :items="[
        { label: $t('pages.content.technicalDetails'), slot: 'technical', icon: 'i-lucide-info' }
      ]"
    >
      <template #technical>
        <dl class="grid grid-cols-2 gap-3 text-xs pb-3">
          <dt class="text-muted">
            {{ $t('pages.aiJob.attempt') }}
          </dt>
          <dd>{{ detail.job.attemptNo }}</dd>
          <dt class="text-muted">
            {{ $t('pages.aiJob.execution') }}
          </dt>
          <dd class="break-all">
            {{ detail.job.lastExecutionId || '—' }}
          </dd>
        </dl>
      </template>
    </UAccordion>
  </div>
</template>

<script setup lang="ts">
import type { JobDetails } from '~/types/ai-job'
import { formatDate } from '~/util/date'

defineProps<{ detail: JobDetails }>()
const { locale } = useI18n()
</script>
