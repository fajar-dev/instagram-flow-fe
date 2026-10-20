<template>
  <UForm
    :schema="schema"
    :state="form"
    class="space-y-4"
    @submit="!disabled && submit()"
  >
    <ContentReviewPublishFields
      v-model="form.content"
      :disabled="disabled || submitting"
    />
    <ContentReviewRankingsPanel
      :rankings="detail.aiResult?.rankings || []"
      :primary-asset-id="form.content.primaryAssetId"
      :disabled="disabled || submitting"
      @selected="form.content.primaryAssetId = $event"
    />
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
        :label="$t('pages.publishing.placement')"
        name="placement"
        required
      >
        <USelect
          v-model="form.placement"
          :items="placements"
          :disabled="disabled || submitting"
          class="w-full"
        />
      </UFormField>
      <UFormField
        :label="$t('pages.publishing.source')"
        name="source"
        required
      >
        <USelect
          v-model="form.source"
          :items="sources"
          :disabled="disabled || submitting"
          class="w-full"
        />
      </UFormField>
      <p
        v-if="!design"
        class="text-xs text-muted"
      >
        {{ $t('pages.publishing.designUnavailable') }}
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
      v-if="form.placement === 'story'"
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

const placement = defineModel<string>('placement', { required: true })
const content = defineModel<PublishFormContent>({ required: true })
const props = defineProps<{ detail: JobDetails, disabled?: boolean }>()
const emit = defineEmits<{ created: [], preview: [path: string] }>()
const { t } = useI18n()
const { accounts, loading, submitting, form, schema, design, loadAccounts, submit }
  = usePublicationForm(
    () => props.detail,
    content.value,
    () => {
      emit('created')
    }
  )
const placements = computed(() => [
  { label: t('pages.contentReview.feed'), value: 'feed' },
  { label: t('pages.contentReview.story'), value: 'story' }
])
const sources = computed(() => [
  { label: t('pages.publishing.photo'), value: 'photo' },
  { label: t('pages.publishing.design'), value: 'design', disabled: !design.value }
])
const scheduled = computed({
  get: () => form.mode === 'schedule',
  set: (value: boolean) => {
    form.mode = value ? 'schedule' : 'now'
  }
})

watch(
  placement,
  (value) => {
    form.placement = value === 'story' ? 'story' : 'feed'
  },
  { immediate: true }
)
watch(
  () => form.placement,
  (value) => {
    placement.value = value
  }
)
watch(
  () =>
    form.source === 'design' && design.value
      ? `renders/${design.value.id}`
      : `assets/${form.content.primaryAssetId}/preview`,
  path => emit('preview', path),
  { immediate: true }
)
onMounted(loadAccounts)
</script>
