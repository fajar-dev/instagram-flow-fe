<template>
  <div class="space-y-4">
    <UFormField
      :label="$t('pages.content.fields.title')"
      name="content.title"
      required
    >
      <UInput
        v-model="form.title"
        :placeholder="$t('pages.content.placeholders.title')"
        :disabled="disabled"
        class="w-full"
      />
    </UFormField>
    <UFormField
      :label="$t('pages.content.fields.caption')"
      name="content.caption"
      required
    >
      <UTextarea
        v-model="form.caption"
        :placeholder="$t('pages.content.placeholders.caption')"
        :disabled="disabled"
        :rows="8"
        class="w-full"
      />
    </UFormField>
    <UFormField
      :label="$t('pages.content.fields.hashtags')"
      name="content.hashtagText"
    >
      <UTextarea
        v-model="form.hashtagText"
        :placeholder="$t('pages.content.placeholders.hashtags')"
        :disabled="disabled"
        class="w-full"
      />
    </UFormField>
    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField
        v-for="field in ['location', 'activity'] as const"
        :key="field"
        :label="$t(`pages.content.fields.${field}`)"
        :name="`content.${field}`"
        required
      >
        <UInput
          v-model="form[field]"
          :placeholder="$t(`pages.content.placeholders.${field}`)"
          :disabled="disabled"
          class="w-full"
        />
      </UFormField>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PublishFormContent } from '~/types/content-draft'

const form = defineModel<PublishFormContent>({ required: true })
defineProps<{ disabled?: boolean }>()
</script>
