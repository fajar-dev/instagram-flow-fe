<template>
  <div class="space-y-5">
    <div
      v-if="rows.length || (!failed && loaded && !canDecide)"
      class="space-y-4"
    >
      <p
        v-if="!failed && loaded && !rows.length && !canDecide"
        class="text-sm text-muted"
      >
        {{ $t('pages.publishing.empty') }}
      </p>
      <div
        v-for="row in rows"
        :key="row.id"
        class="space-y-6"
      >
        <PublishingPublicationResult
          :publication="row"
          :busy="!!busy"
          :retrying="busy === row.id"
          @cancel="action(row.id, 'cancel')"
          @retry="action(row.id, 'retry')"
        />
        <AnalyticsPostInsights
          v-if="row.status === 'PUBLISHED' && row.mediaId"
          :publication-id="row.id"
        />
      </div>
    </div>
    <USkeleton
      v-if="!loaded && !failed"
      class="h-48 w-full"
    />
    <PublishingPublicationForm
      v-if="canDecide && detail.draft"
      v-model="content"
      :detail="detail"
      :disabled="!canPublish || !!busy"
      @preview="emit('preview', $event)"
      @created="changed"
    >
      <template #secondary="{ submitting }">
        <UButton
          color="error"
          variant="ghost"
          :disabled="submitting || !!busy || failed"
          @click="rejectOpen = true"
        >
          {{ $t('pages.publishing.reject') }}
        </UButton>
      </template>
    </PublishingPublicationForm>
    <PublishingRejectModal
      v-if="detail.draft"
      v-model="rejectOpen"
      :detail="detail"
      @rejected="changed"
    />
  </div>
</template>

<script setup lang="ts">
import { usePublications } from '~/composables/publishing/usePublications'
import type { PublishFormContent } from '~/types/content-review'
import type { JobDetails } from '~/types/ai-job'

const content = defineModel<PublishFormContent>({ required: true })
const props = defineProps<{ detail: JobDetails }>()
const emit = defineEmits<{ changed: [], preview: [paths: string[]] }>()
const rejectOpen = ref(false)
const { rows, loaded, busy, canDecide, canPublish, failed, changed, action } = usePublications(
  () => props.detail,
  () => emit('changed')
)

watch(rows, (publications, previous) => {
  const publication = publications[0]
  if (publication) {
    emit(
      'preview',
      publication.renderIds.map(id => `renders/${id}`)
    )
  } else if (previous?.length) {
    emit('preview', [])
  }
})
</script>
