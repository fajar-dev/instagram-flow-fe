<template>
  <div class="space-y-6">
    <Header
      :title="$t('pages.content.upload')"
      :description="$t('pages.content.uploadHint')"
    />

    <UForm
      :schema="schema"
      :state="form"
      @submit="submit"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <!-- Left Column: Project Details, Consent & Actions (Sticky) -->
        <div class="min-w-0 lg:sticky lg:top-6">
          <UCard class="w-full">
            <div class="space-y-4">
              <div class="grid sm:grid-cols-2 gap-4">
                <UFormField
                  v-for="field in fields"
                  :key="field"
                  :class="{ 'sm:col-span-2': field === 'projectName' }"
                  :label="$t(`pages.content.fields.${field}`)"
                  :name="field"
                  :description="
                    field === 'documentationDate' ? $t('pages.content.dateHint') : undefined
                  "
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
                name="output"
                required
              >
                <URadioGroup
                  v-model="form.output"
                  :items="[
                    { label: $t('pages.contentDraft.feed'), value: 'feed' },
                    { label: $t('pages.contentDraft.story'), value: 'story' }
                  ]"
                  :disabled="busy || processingRequested"
                  orientation="horizontal"
                />
              </UFormField>

              <UFormField
                name="publicationPermission"
                required
                class="pt-1"
              >
                <UCheckbox
                  v-model="form.publicationPermission"
                  :disabled="busy || Boolean(batchId)"
                  :label="$t('pages.content.consent')"
                />
              </UFormField>

              <!-- Action Buttons: Cancel on Left, Submit on Right -->
              <div class="flex items-center justify-between gap-3 pt-4 border-t border-default">
                <UButton
                  type="button"
                  color="neutral"
                  variant="outline"
                  to="/content"
                  :disabled="busy"
                  icon="i-lucide-arrow-left"
                >
                  {{ $t('pages.content.cancel') }}
                </UButton>

                <div class="flex items-center gap-3">
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
                  <UButton
                    type="submit"
                    icon="i-lucide-sparkles"
                    :loading="busy"
                    :disabled="
                      !limits
                        || validating
                        || !entries.some((entry) => entry.status !== 'invalid')
                        || Boolean(fileError)
                    "
                  >
                    {{
                      $t(
                        batchId && hasErrors ? 'pages.content.retryUpload' : 'pages.content.process'
                      )
                    }}
                  </UButton>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Right Column: Photo Upload & Previews -->
        <div class="min-w-0">
          <UCard class="w-full">
            <div class="space-y-4">
              <UFileUpload
                v-model="files"
                multiple
                accept="image/jpeg,image/png,image/webp"
                :label="$t('pages.content.choosePhotos')"
                :description="uploadHint"
                :disabled="!limits || busy || Boolean(batchId)"
                :preview="false"
              />

              <div
                v-if="entries.length"
                class="grid grid-cols-2 sm:grid-cols-3 gap-3"
              >
                <article
                  v-for="entry in entries"
                  :key="entry.id"
                  class="min-w-0 overflow-hidden rounded-xl border border-default/60 bg-default"
                >
                  <div class="relative flex aspect-square items-center justify-center bg-muted/60">
                    <template v-if="entry.status !== 'invalid'">
                      <img
                        :src="entry.url"
                        :alt="entry.file.name"
                        class="size-full object-cover"
                      >
                      <ImagePreview
                        :src="entry.url"
                        :alt="entry.file.name"
                      />
                    </template>
                    <UIcon
                      v-else
                      name="i-lucide-image-off"
                      class="size-8 text-muted"
                    />
                    <UButton
                      v-if="entry.status !== 'uploaded' && !processingRequested"
                      :disabled="busy"
                      size="sm"
                      variant="outline"
                      color="neutral"
                      :aria-label="$t('pages.content.remove')"
                      icon="i-lucide-x"
                      class="absolute right-2 top-2 z-10 rounded-full bg-default shadow-sm hover:text-error"
                      @click.stop="remove(entry.id)"
                    />
                  </div>
                  <div class="space-y-1 p-3">
                    <p
                      class="truncate text-xs font-medium"
                      :title="entry.file.name"
                    >
                      {{ entry.file.name }}
                    </p>
                    <p class="text-xs text-muted">
                      {{ formatFileSize(entry.file.size) }}
                    </p>
                    <UProgress
                      v-if="entry.status === 'uploading'"
                      :model-value="entry.progress"
                      class="mt-1"
                    />
                    <p
                      v-if="entry.status === 'uploaded'"
                      class="text-success text-xs font-medium mt-1"
                    >
                      {{ $t('pages.content.uploaded') }}
                    </p>
                    <p
                      v-if="entry.status === 'validating'"
                      class="text-xs text-muted mt-1"
                    >
                      {{ $t('pages.content.validatingImage') }}
                    </p>
                    <p
                      v-if="entry.validationError || entry.error"
                      class="text-xs text-error mt-1"
                      role="status"
                    >
                      {{
                        entry.validationError
                          ? $t(`pages.content.${entry.validationError}`, {
                            size: limits?.maxUploadMb
                          })
                          : entry.error
                      }}
                    </p>
                  </div>
                </article>
              </div>

              <p
                v-if="batchId"
                class="text-sm text-muted"
              >
                {{ $t('pages.content.staged') }}
              </p>

              <p
                v-if="fileError"
                class="text-sm text-error"
                role="status"
              >
                {{ fileError }}
              </p>
            </div>
          </UCard>
        </div>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { useContentUpload } from '~/composables/content/useContentUpload'
import { formatFileSize } from '~/util/content'

definePageMeta({ layout: 'dashboard' })
const {
  limits,
  uploadHint,
  fields,
  form,
  schema,
  files,
  entries,
  batchId,
  uploadedCount,
  hasErrors,
  validating,
  busy,
  processingRequested,
  fileError,
  remove,
  submit,
  processUploaded
} = useContentUpload()
</script>
