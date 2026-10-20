<template>
  <UModal
    v-model:open="open"
    :title="$t('pages.publishing.rejectTitle')"
    :description="detail.revision?.title"
    :dismissible="!saving"
  >
    <template #body>
      <UForm
        id="reject-content-form"
        :state="form"
        :schema="schema"
        @submit="submit"
      >
        <UFormField
          name="notes"
          :label="$t('pages.publishing.rejectNotes')"
        >
          <UTextarea
            v-model="form.notes"
            :placeholder="$t('pages.publishing.rejectPlaceholder')"
            :disabled="saving"
            :rows="3"
            class="w-full"
          />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton
          color="neutral"
          variant="ghost"
          :disabled="saving"
          @click="open = false"
        >
          {{ $t('pages.publishing.cancel') }}
        </UButton>
        <UButton
          type="submit"
          form="reject-content-form"
          color="error"
          :loading="saving"
        >
          {{ $t('pages.publishing.reject') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { draftService } from '~/services/content-review/draft-service'
import type { JobDetails } from '~/types/ai-job'

const props = defineProps<{ detail: JobDetails }>()
const open = defineModel<boolean>({ required: true })
const emit = defineEmits<{ rejected: [] }>()
const { t } = useI18n()
const toast = useToast()
const handleError = useServiceError()
const saving = ref(false)
const form = reactive({ notes: '' })
const schema = z.object({ notes: z.string().max(2000) })

async function submit() {
  const { draft, revision } = props.detail
  if (saving.value || !draft || !revision) {
    return
  }
  saving.value = true
  try {
    await draftService.reject(draft.id, {
      revisionId: revision.id,
      contentHash: revision.contentHash,
      notes: form.notes
    })
    toast.add({ title: t('pages.publishing.rejected'), color: 'success' })
    open.value = false
    emit('rejected')
  } catch (error) {
    handleError(error)
  } finally {
    saving.value = false
  }
}
</script>
