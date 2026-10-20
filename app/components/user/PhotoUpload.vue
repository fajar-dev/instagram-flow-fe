<template>
  <div class="flex flex-col items-center justify-center pb-4 space-y-2">
    <div
      class="relative group cursor-pointer"
      @click="triggerFileInput"
    >
      <div
        class="w-24 h-24 rounded-full overflow-hidden border-2 border-default hover:border-primary/50 transition-colors duration-200 flex items-center justify-center bg-muted relative"
      >
        <img
          v-if="previewUrl"
          :src="previewUrl"
          class="w-full h-full object-cover"
        >
        <UIcon
          v-else
          name="i-lucide-user"
          class="w-12 h-12 text-dimmed"
        />

        <div
          class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <UIcon
            name="i-lucide-camera"
            class="w-6 h-6 text-white"
          />
        </div>

        <div
          v-if="isUploading"
          class="absolute inset-0 bg-black/50 flex items-center justify-center"
        >
          <UIcon
            name="i-lucide-loader-2"
            class="w-6 h-6 text-white animate-spin"
          />
        </div>
      </div>
    </div>
    <div class="flex gap-2">
      <UButton
        size="xs"
        color="neutral"
        variant="outline"
        icon="i-lucide-upload"
        @click="triggerFileInput"
      >
        {{ $t(`${translationPrefix}.choosePhoto`) }}
      </UButton>
      <UButton
        v-if="previewUrl || photo"
        size="xs"
        color="error"
        variant="outline"
        icon="i-lucide-trash"
        @click="removePhoto"
      >
        {{ $t(`${translationPrefix}.remove`) }}
      </UButton>
    </div>
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      accept="image/*"
      @change="onFileChange"
    >
  </div>
</template>

<script setup lang="ts">
import { userService } from '~/services/user-service'

const photo = defineModel<string | null>({ default: null })
const uploading = defineModel<boolean>('uploading', { default: false })
const props = defineProps<{
  active: boolean
  initialUrl?: string | null
  translationPrefix: 'components.user.addModal' | 'components.user.updateModal'
}>()
const { t } = useI18n()
const fileInput = ref<HTMLInputElement | null>(null)
const { isUploading, previewUrl, uploadFile, clearPreview, setPreviewFromUrl } = useImageUpload({
  upload: file => userService.uploadPhoto(file),
  onUploaded: (path) => {
    photo.value = path
  },
  successMessage: () => t(`${props.translationPrefix}.photoUploadSuccess`),
  errorMessage: () => t(`${props.translationPrefix}.photoUploadFailed`)
})

function triggerFileInput() {
  fileInput.value?.click()
}

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    await uploadFile(file)
  }
  input.value = ''
}

function removePhoto() {
  photo.value = null
  clearPreview()
}

watch(
  isUploading,
  (value) => {
    uploading.value = value
  },
  { immediate: true }
)
watch(
  () => [props.active, props.initialUrl] as const,
  ([active, url]) => {
    setPreviewFromUrl(active ? url : null)
  },
  { immediate: true }
)
</script>
