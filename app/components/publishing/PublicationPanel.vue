<template>
  <div class="space-y-5">
    <div class="space-y-4">
      <p
        v-if="canDecide && dirty"
        class="text-sm text-muted"
      >
        {{ $t('pages.publishing.readyRequired') }}
      </p>
      <p
        v-if="failed"
        class="text-sm text-error"
      >
        {{ $t('components.requestState.failed') }}
      </p>
      <p
        v-else-if="loaded && !rows.length && !canDecide"
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
        :detail="detail"
        :disabled="!canPublish || !!busy"
        @created="changed"
      >
        <template #secondary="{ submitting }">
          <UButton
            color="error"
            variant="ghost"
            :disabled="submitting || !!busy || dirty || failed"
            @click="rejectOpen = true"
          >
            {{ $t('pages.publishing.reject') }}
          </UButton>
        </template>
      </PublishingPublicationForm>
    </template>
    <PublishingRejectModal
      v-if="detail.draft && detail.revision"
      v-model="rejectOpen"
      :detail="detail"
      @rejected="changed"
    />
  </div>
</template>

<script setup lang="ts">
import { usePublications } from '~/composables/publishing/usePublications'
import type { JobDetails } from '~/types/ai-job'

const props = defineProps<{ detail: JobDetails, dirty?: boolean }>()
const emit = defineEmits<{ changed: [] }>()
const rejectOpen = ref(false)
const { rows, loaded, busy, previewing, canDecide, canPublish, failed, changed, action, preview }
  = usePublications(
    () => props.detail,
    () => !!props.dirty,
    () => emit('changed')
  )
</script>
