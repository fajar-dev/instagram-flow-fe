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
    <template #actions>
      <div class="flex flex-wrap items-center justify-between gap-3 w-full">
        <div class="flex flex-wrap items-center gap-3">
          <ContentStatusBadge
            v-if="detail"
            :status="detail.draft?.reviewStatus || detail.job.status"
          />
          <span
            v-if="editing && detail?.revision"
            class="text-xs text-muted"
          >
            {{ $t('pages.contentReview.revision') }} {{ detail.revision.revisionNo }}
          </span>
          <UBadge
            v-if="dirty && detail?.revision"
            color="warning"
            variant="subtle"
            size="sm"
          >
            {{ $t('pages.contentReview.unsaved') }}
          </UBadge>
        </div>
        <UButton
          :to="{ path: '/content', query: { status: detail?.draft?.reviewStatus || detail?.job.status || 'READY_FOR_REVIEW' } }"
          color="neutral"
          variant="ghost"
          icon="i-lucide-arrow-left"
          size="sm"
        >
          {{ $t('pages.content.backToContent') }}
        </UButton>
      </div>
    </template>
  </Header>
</template>

<script setup lang="ts">
import type { JobDetails } from '~/types/ai-job'

defineProps<{ jobId: string, detail: JobDetails | null, editing?: boolean, dirty?: boolean }>()
</script>
