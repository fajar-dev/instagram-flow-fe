<template>
  <div class="space-y-6">
    <Header
      :title="$t('pages.content.upload')"
      :description="$t('pages.content.uploadHint')"
    />
    <UForm
      :schema="schema"
      :state="form"
      class="max-w-2xl space-y-4 p-6 bg-default border border-default rounded-lg"
      @submit="submit"
    >
      <div class="grid sm:grid-cols-2 gap-4">
        <UFormField
          v-for="field in fields"
          :key="field"
          :label="$t(`pages.content.fields.${field}`)"
          :name="field"
          :description="field === 'documentationDate' ? $t('pages.content.dateHint') : undefined"
          :required="field !== 'clientName'"
        >
          <DateInput
            v-if="field === 'documentationDate'"
            v-model="form.documentationDate"
            :disabled="busy || Boolean(batchId)"
          />
          <UInput
            v-else
            v-model="form[field]"
            :placeholder="$t(`pages.content.placeholders.${field}`)"
            :disabled="busy || Boolean(batchId)"
            class="w-full"
          />
        </UFormField>
      </div>
      <UFormField
        :label="$t('pages.content.fields.description')"
        name="description"
      >
        <UTextarea
          v-model="form.description"
          :placeholder="$t('pages.content.placeholders.description')"
          :disabled="busy || Boolean(batchId)"
          class="w-full"
          :rows="4"
        />
      </UFormField>
      <UFormField
        :label="$t('pages.content.outputs')"
        name="requestedOutputs"
        required
      >
        <UCheckboxGroup
          v-model="form.requestedOutputs"
          :items="['feed', 'story']"
          :disabled="busy || processingRequested"
          orientation="horizontal"
        />
      </UFormField>
      <UFormField
        name="publicationPermission"
        required
      >
        <UCheckbox
          v-model="form.publicationPermission"
          :disabled="busy || Boolean(batchId)"
          :label="$t('pages.content.consent')"
        />
      </UFormField>
      <UFileUpload
        v-model="files"
        multiple
        accept="image/jpeg,image/png,image/webp"
        :label="$t('pages.content.choosePhotos')"
        :description="uploadHint"
        :disabled="!limits || busy || Boolean(batchId)"
        :preview="false"
      />
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <UCard
          v-for="entry in entries"
          :key="entry.id"
        >
          <div
            v-if="entry.status !== 'invalid'"
            class="relative"
          >
            <img
              :src="entry.url"
              :alt="entry.file.name"
              class="aspect-square w-full object-cover rounded"
            >
            <ImagePreview
              :src="entry.url"
              :alt="entry.file.name"
            />
          </div>
          <UIcon
            v-else
            name="i-lucide-image-off"
            class="size-8 text-muted"
          />
          <p class="text-xs truncate mt-2">
            {{ entry.file.name }}
          </p>
          <p class="text-xs text-muted">
            {{ formatFileSize(entry.file.size) }}
          </p>
          <UProgress
            v-if="entry.status === 'uploading'"
            :model-value="entry.progress"
          />
          <p
            v-if="entry.status === 'uploaded'"
            class="text-success text-xs"
          >
            {{ $t('pages.content.uploaded') }}
          </p>
          <p
            v-if="entry.status === 'validating'"
            class="text-xs text-muted"
          >
            {{ $t('pages.content.validatingImage') }}
          </p>
          <p
            v-if="entry.validationError || entry.error"
            class="text-xs text-error mt-2"
            role="status"
          >
            {{ entry.validationError ? $t(`pages.content.${entry.validationError}`, { size: limits?.maxUploadMb }) : entry.error }}
          </p>
          <UButton
            v-if="entry.status !== 'uploaded' && !processingRequested"
            :disabled="busy"
            size="xs"
            variant="ghost"
            color="error"
            :aria-label="$t('pages.content.remove')"
            icon="i-lucide-x"
            @click="remove(entry.id)"
          />
        </UCard>
      </div>

      <p
        v-if="batchId"
        class="text-sm text-muted"
      >
        {{ $t('pages.content.staged') }}
      </p>
      <UButton
        type="submit"
        icon="i-lucide-sparkles"
        :loading="busy"
        :disabled="!limits || validating || !entries.some(entry => entry.status !== 'invalid') || Boolean(fileError)"
      >
        {{ $t(batchId && hasErrors ? 'pages.content.retryUpload' : 'pages.content.process') }}
      </UButton>
      <p
        v-if="fileError"
        class="text-sm text-error"
        role="status"
      >
        {{ fileError }}
      </p>
      <UButton
        v-if="uploadedCount && hasErrors"
        type="button"
        color="neutral"
        variant="outline"
        :disabled="busy || validating"
        @click="processUploaded"
      >
        {{ $t('pages.content.processUploaded', { count: uploadedCount }) }}
      </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { useContentUpload } from '~/composables/content/useContentUpload'
import { formatFileSize } from '~/util/content'

definePageMeta({ layout: 'dashboard' })
const { limits, uploadHint, fields, form, schema, files, entries, batchId, uploadedCount, hasErrors, validating, busy, processingRequested, fileError, remove, submit, processUploaded } = useContentUpload()
</script>
