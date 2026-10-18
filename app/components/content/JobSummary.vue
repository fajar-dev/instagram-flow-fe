<template>
  <UCard>
    <template #header>
      <h2 class="text-base font-semibold text-highlighted">
        {{ $t('pages.content.projectSummary') }}
      </h2>
    </template>
    <div class="space-y-5">
      <dl class="space-y-4 text-sm">
        <div
          v-for="field in ['activity', 'location', 'documentationDate', 'clientName'] as const"
          :key="field"
          class="grid grid-cols-2 gap-4"
        >
          <dt class="text-muted">
            {{ $t(`pages.content.fields.${field}`) }}
          </dt>
          <dd class="font-medium text-highlighted break-words">
            {{ field === 'documentationDate' ? formatDate(detail.batch[field], locale) : detail.batch[field] || '—' }}
          </dd>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <dt class="text-muted">
            {{ $t('pages.content.outputs') }}
          </dt>
          <dd class="flex flex-wrap gap-2">
            <UBadge
              v-for="output in detail.job.requestedOutputs"
              :key="output"
              color="neutral"
              variant="subtle"
            >
              {{ output }}
            </UBadge>
          </dd>
        </div>
      </dl>
      <p
        v-if="detail.batch.description"
        class="text-sm text-muted whitespace-pre-line break-words border-t border-default pt-5"
      >
        {{ detail.batch.description }}
      </p>
      <USeparator />
      <UTimeline
        :items="steps"
        :model-value="currentStep"
        color="primary"
        size="sm"
        :ui="{
          root: 'gap-0',
          item: 'gap-3',
          wrapper: 'pb-6 group-last:pb-0',
          title: 'text-sm font-medium',
          description: 'text-xs mt-1',
          separator: 'my-1'
        }"
      />

      <UAccordion :items="[{ label: $t('pages.content.technicalDetails'), slot: 'technical', icon: 'i-lucide-info' }]">
        <template #technical>
          <dl class="grid grid-cols-2 gap-3 text-xs pb-3">
            <dt class="text-muted">
              {{ $t('pages.aiJob.attempt') }}
            </dt><dd>{{ detail.job.attemptNo }}</dd>
            <dt class="text-muted">
              {{ $t('pages.aiJob.execution') }}
            </dt><dd class="break-all">
              {{ detail.job.lastExecutionId || '—' }}
            </dd>
          </dl>
        </template>
      </UAccordion>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { JobDetails } from '~/types/ai-job'
import { formatContentDate } from '~/util/content'
import { formatDate } from '~/util/date'

const props = defineProps<{ detail: JobDetails }>()
const { t, locale } = useI18n()
const milestones = computed(() => [
  { label: t('pages.aiJob.created'), icon: 'i-lucide-cloud-upload', date: props.detail.job.createdAt },
  { label: t('pages.aiJob.started'), icon: 'i-lucide-sparkles', date: props.detail.job.startedAt },
  { label: t('pages.aiJob.finished'), icon: 'i-lucide-check-check', date: props.detail.job.completedAt }
])

const currentStep = computed(() => milestones.value.findLastIndex(step => Boolean(step.date)))
const steps = computed(() => milestones.value.map(step => ({
  title: step.label,
  icon: step.icon,
  description: step.date ? `${formatContentDate(step.date, locale.value)} WIB` : t('pages.content.pendingStep')
})))
</script>
