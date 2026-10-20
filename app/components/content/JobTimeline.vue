<template>
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
</template>

<script setup lang="ts">
import type { Job } from '~/types/ai-job'
import { formatContentDate } from '~/util/content'

const props = defineProps<{ job: Job }>()
const { t, locale } = useI18n()
const milestones = computed(() => [
  {
    label: t('pages.aiJob.created'),
    icon: 'i-lucide-cloud-upload',
    date: props.job.createdAt
  },
  { label: t('pages.aiJob.started'), icon: 'i-lucide-sparkles', date: props.job.startedAt },
  {
    label: t('pages.aiJob.finished'),
    icon: 'i-lucide-check-check',
    date: props.job.completedAt
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
