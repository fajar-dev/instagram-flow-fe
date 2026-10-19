<template>
  <Header
    :title="detail?.batch.projectName || $t('pages.aiJob.jobDetail')"
    :description="detail?.batch.activity"
  >
    <template #tabs>
      <HeaderTab
        :to="`/content/${jobId}`"
        :label="$t('pages.content.detail')"
        :active="!editing"
      />
      <HeaderTab
        v-if="detail?.draft"
        :to="`/content/${jobId}/edit`"
        :label="$t('pages.contentReview.editorTitle')"
        :active="editing"
      />
    </template>
  </Header>
</template>

<script setup lang="ts">
import type { JobDetails } from '~/types/ai-job'

defineProps<{ jobId: string, detail: JobDetails | null, editing?: boolean }>()
</script>
