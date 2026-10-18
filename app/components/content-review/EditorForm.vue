<template>
  <UForm
    :state="form"
    :schema="schema"
    class="space-y-4"
    @submit="emit('submitted')"
  >
    <UFormField
      :label="$t('pages.content.fields.title')"
      name="title"
      required
    >
      <UInput
        v-model="form.title"
        :placeholder="$t('pages.content.placeholders.title')"
        :disabled="saving || loading"
        class="w-full"
      />
    </UFormField>
    <UFormField
      :label="$t('pages.content.fields.caption')"
      name="caption"
      required
    >
      <UTextarea
        v-model="form.caption"
        :placeholder="$t('pages.content.placeholders.caption')"
        :disabled="saving || loading"
        :rows="8"
        class="w-full"
      />
    </UFormField>
    <UFormField
      :label="$t('pages.content.fields.hashtags')"
      name="hashtagText"
    >
      <UTextarea
        v-model="form.hashtagText"
        :placeholder="$t('pages.content.placeholders.hashtags')"
        :disabled="saving || loading"
        class="w-full"
      />
    </UFormField>
    <UFormField
      v-for="field in ['location', 'activity'] as const"
      :key="field"
      :label="$t(`pages.content.fields.${field}`)"
      :name="field"
      required
    >
      <UInput
        v-model="form[field]"
        :placeholder="$t(`pages.content.placeholders.${field}`)"
        :disabled="saving || loading"
        class="w-full"
      />
    </UFormField>
    <div
      class="flex flex-wrap gap-2"
    >
      <UButton
        type="submit"
        :loading="saving"
      >
        {{ $t('pages.contentReview.saveRevision') }}
      </UButton>
      <UButton
        variant="outline"
        :disabled="saving || loading"
        @click="emit('restored')"
      >
        {{ $t('pages.contentReview.restoreAi') }}
      </UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { ZodType } from 'zod'
import type { StudioForm } from '~/types/content-review'

const form = defineModel<StudioForm>({ required: true })
defineProps<{ schema: ZodType, saving: boolean, loading: boolean }>()
const emit = defineEmits<{ submitted: [], restored: [] }>()
</script>
