<template>
  <div
    class="space-y-4"
  >
    <h2 class="text-base font-semibold text-highlighted">
      {{ $t('pages.contentReview.reviewTitle') }}
    </h2>
    <UFormField
      :label="$t('pages.contentReview.notes')"
      name="reviewNotes"
    >
      <UTextarea
        v-model="notes"
        :placeholder="$t('pages.contentReview.notesPlaceholder')"
        :disabled="saving || loading"
        class="w-full"
        :rows="4"
        :maxlength="2000"
      />
    </UFormField>
    <UFormField
      :label="$t('pages.contentReview.decision')"
      name="reviewDecision"
      required
    >
      <USelect
        v-model="decision"
        :items="decisions"
        :placeholder="$t('pages.contentReview.decisionPlaceholder')"
        :disabled="saving || loading"
        class="w-full"
      />
    </UFormField>
    <UButton
      :loading="saving"
      :disabled="dirty || saving || loading"
      @click="emit('submitted')"
    >
      {{ $t('pages.contentReview.submitReview') }}
    </UButton>
    <p
      v-if="dirty"
      class="text-sm text-warning"
    >
      {{ $t('pages.contentReview.saveFirst') }}
    </p>
  </div>
</template>

<script setup lang="ts">
const notes = defineModel<string>('notes', { required: true })
const decision = defineModel<string>('decision', { required: true })
defineProps<{ saving: boolean, loading: boolean, dirty: boolean, decisions: { label: string, value: string }[] }>()
const emit = defineEmits<{ submitted: [] }>()
</script>
