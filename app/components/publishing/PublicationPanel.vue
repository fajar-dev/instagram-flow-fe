<template>
  <div class="space-y-5">
    <div class="space-y-4">
      <p
        v-if="!failed && loaded && !rows.length && !canDecide"
        class="text-sm text-muted"
      >
        {{
          $t(
            detail.draft?.reviewStatus === 'REJECTED'
              ? 'pages.publishing.rejectedEmpty'
              : 'pages.publishing.empty'
          )
        }}
      </p>
      <PublishingPublicationResult
        v-for="row in rows"
        :key="row.id"
        :publication="row"
        :busy="!!busy"
        :retrying="busy === row.id"
        :previewing="previewing === row.id"
        @preview="preview(row)"
        @cancel="action(row.id, 'cancel')"
        @retry="action(row.id, 'retry')"
      />
    </div>
    <USkeleton
      v-if="!loaded && !failed"
      class="h-48 w-full"
    />
    <template v-if="canDecide">
      <p class="text-sm text-muted">
        {{ $t('pages.publishing.description') }}
      </p>
      <PublishingPublicationForm
        v-model="content"
        v-model:placement="placement"
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
    </template>
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

const placement = defineModel<string>('placement', { required: true })
const content = defineModel<PublishFormContent>({ required: true })
const props = defineProps<{ detail: JobDetails }>()
const emit = defineEmits<{ changed: [], preview: [path: string] }>()
const rejectOpen = ref(false)
const { rows, loaded, busy, previewing, canDecide, canPublish, failed, changed, action, preview }
  = usePublications(
    () => props.detail,
    () => emit('changed')
  )
watch(rows, (publications) => {
  const publication = publications[0]
  if (publication) {
    placement.value = publication.placement
    emit('preview', `publications/${publication.id}/image`)
  }
})
</script>
