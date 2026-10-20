<template>
  <UForm
    :schema="schema"
    :state="form"
    class="space-y-4"
    @submit="!disabled && submit()"
  >
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
        required
      >
        <USelect
          v-model="form.mode"
          :items="modes"
          :disabled="disabled || submitting"
          class="w-full"
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
    <div class="flex flex-wrap items-center justify-between gap-3 border-t border-default pt-4">
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
import type { JobDetails } from '~/types/ai-job'

const props = defineProps<{ detail: JobDetails, disabled?: boolean }>()
const emit = defineEmits<{ created: [] }>()
const { t } = useI18n()
const { accounts, loading, submitting, form, schema, design, loadAccounts, submit }
  = usePublicationForm(
    () => props.detail,
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
const modes = computed(() => [
  { label: t('pages.publishing.now'), value: 'now' },
  { label: t('pages.publishing.schedule'), value: 'schedule' }
])
onMounted(loadAccounts)
</script>
