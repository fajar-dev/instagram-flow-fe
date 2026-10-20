<template>
  <UCard>
    <template #header>
      <h2 class="text-base font-semibold text-highlighted">
        {{ $t('pages.content.projectSummary') }}
      </h2>
    </template>
    <div class="space-y-5">
      <div class="flex flex-wrap items-center gap-3">
        <ContentStatusBadge :status="detail.draft?.reviewStatus || detail.job.status" />
        <span
          v-if="detail.revision"
          class="text-xs text-muted"
        >
          {{ $t('pages.contentReview.revision') }} {{ detail.revision.revisionNo }}
        </span>
      </div>
      <p
        v-if="detail.job.safeError"
        class="text-sm text-error break-words"
      >
        {{ detail.job.errorCode || $t('pages.aiJob.failed') }} · {{ detail.job.safeError }}
      </p>
      <ContentReviewRejectionNotice :detail="detail" />
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
            {{
              field === 'documentationDate'
                ? formatDate(detail.batch[field], locale)
                : detail.batch[field] || '—'
            }}
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
        <div
          v-if="detail.batch.description"
          class="space-y-1.5"
        >
          <dt class="text-muted">
            {{ $t('pages.content.fields.description') }}
          </dt>
          <dd class="text-toned leading-relaxed whitespace-pre-line break-words">
            {{ detail.batch.description }}
          </dd>
        </div>
      </dl>
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
  </UCard>
</template>

<script setup lang="ts">
import type { JobDetails } from '~/types/ai-job'
import { formatContentDate } from '~/util/content'
import { formatDate } from '~/util/date'

const props = defineProps<{ detail: JobDetails }>()
const { t, locale } = useI18n()
const milestones = computed(() => [
  {
    label: t('pages.aiJob.created'),
    icon: 'i-lucide-cloud-upload',
    date: props.detail.job.createdAt
  },
  { label: t('pages.aiJob.started'), icon: 'i-lucide-sparkles', date: props.detail.job.startedAt },
  {
    label: t('pages.aiJob.finished'),
    icon: 'i-lucide-check-check',
    date: props.detail.job.completedAt
  }
])

const currentStep = computed(() => milestones.value.findLastIndex(step => Boolean(step.date)))
const steps = computed(() =>
  milestones.value.map(step => ({
    title: step.label,
    icon: step.icon,
    description: step.date
      ? `${formatContentDate(step.date, locale.value)} WIB`
      : t('pages.content.pendingStep')
  }))
)
</script>
