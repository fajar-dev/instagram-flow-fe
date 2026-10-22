<template>
  <UForm
    :schema="schema"
    :state="form"
    class="space-y-4"
    @submit="!disabled && submit()"
  >
    <ContentReviewPublishFields
      v-if="detail.job.output === 'feed'"
      v-model="form.content"
      :disabled="disabled || submitting"
    />
    <UFormField
      name="renderIds"
      :label="$t('pages.publishing.postOrder')"
      required
    >
      <PublishingSlideSelection
        v-model="form.renderIds"
        :renders="detail.renders"
        :rankings="detail.aiResult?.rankings || []"
        :limit="detail.job.output === 'feed' ? 10 : 1"
        :disabled="disabled || submitting"
      />
    </UFormField>
    <USeparator />
    <div class="space-y-4">
      <UFormField
        :label="$t('pages.publishing.accountsTitle')"
        name="accountKey"
        required
      >
        <USelectMenu
          v-model="form.accountKey"
          :items="accounts"
          value-key="key"
          label-key="label"
          :loading="loading"
          :disabled="disabled || submitting"
          :placeholder="$t('pages.publishing.selectAccounts')"
          class="w-full"
        />
      </UFormField>
      <p
        v-if="!loading && !accounts.length"
        class="text-sm text-muted"
      >
        {{ $t('pages.publishing.noAccounts') }}
      </p>
      <UFormField
        :label="$t('pages.publishing.mode')"
        name="mode"
      >
        <USwitch
          v-model="scheduled"
          :label="$t('pages.publishing.schedule')"
          :disabled="disabled || submitting"
        />
      </UFormField>
      <div
        v-if="form.mode === 'schedule'"
        class="grid grid-cols-2 gap-3"
      >
        <UFormField
          :label="$t('pages.publishing.date')"
          name="date"
          required
        >
          <DateInput
            v-model="form.date"
            :disabled="disabled || submitting"
          />
        </UFormField>
        <UFormField
          :label="$t('pages.publishing.time')"
          name="time"
          required
        >
          <UInput
            v-model="form.time"
            type="time"
            :disabled="disabled || submitting"
            class="w-full"
          />
        </UFormField>
      </div>
    </div>
    <p
      v-if="detail.job.output === 'story'"
      class="text-sm text-muted"
    >
      {{ $t('pages.publishing.storyHint') }}
    </p>
    <p class="text-xs text-muted">
      {{ $t('pages.publishing.snapshotHint') }}
    </p>
    <div class="flex flex-wrap items-center gap-2 pt-2">
      <slot
        name="secondary"
        :submitting="submitting"
      />
      <UButton
        type="submit"
        :loading="submitting"
        :disabled="disabled || loading || submitting || !accounts.length"
        icon="i-lucide-send"
      >
        {{ $t(form.mode === 'schedule' ? 'pages.publishing.schedule' : 'pages.publishing.now') }}
      </UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { usePublicationForm } from '~/composables/publishing/usePublicationForm'
import type { PublishFormContent } from '~/types/content-review'
import type { JobDetails } from '~/types/ai-job'

const content = defineModel<PublishFormContent>({ required: true })
const props = defineProps<{ detail: JobDetails, disabled?: boolean }>()
const emit = defineEmits<{ created: [], preview: [paths: string[]] }>()
const { accounts, loading, submitting, form, schema, loadAccounts, submit } = usePublicationForm(
  () => props.detail,
  content.value,
  () => {
    emit('created')
  }
)
const scheduled = computed({
  get: () => form.mode === 'schedule',
  set: (value: boolean) => {
    form.mode = value ? 'schedule' : 'now'
  }
})

watch(
  () => form.renderIds.map(id => `renders/${id}`),
  paths => emit('preview', paths),
  { immediate: true }
)
onMounted(loadAccounts)
</script>
