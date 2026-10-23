<template>
  <div class="p-6 space-y-6">
    <div class="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-default">
      <div class="relative group">
        <UAvatar
          :src="previewUrl || undefined"
          :alt="$t('pages.profile.information.photoTitle')"
          icon="i-lucide-user"
          :ui="{ root: 'size-24 text-3xl border-2 border-default' }"
        />

        <div
          class="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        >
          <UIcon
            name="i-lucide-camera"
            class="size-6 text-white"
          />
        </div>

        <div
          v-if="isUploading"
          class="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center"
        >
          <UIcon
            name="i-lucide-loader-2"
            class="size-6 text-white animate-spin"
          />
        </div>
      </div>

      <div class="space-y-1.5 text-center sm:text-left">
        <h3 class="text-base font-semibold text-highlighted">
          {{ $t('pages.profile.information.photoTitle') }}
        </h3>
        <p class="text-sm text-muted pb-1">
          {{ $t('pages.profile.information.photoHint') }}
        </p>
        <div class="flex gap-2 justify-center sm:justify-start">
          <UFileUpload
            v-slot="{ open: openFilePicker }"
            v-model="photoFile"
            accept="image/*"
            :preview="false"
            :disabled="isUploading || isSavingInfo"
            reset
          >
            <UButton
              size="xs"
              color="neutral"
              variant="outline"
              icon="i-lucide-upload"
              :label="$t('pages.profile.information.changePhoto')"
              :disabled="isUploading || isSavingInfo"
              @click="openFilePicker()"
            />
          </UFileUpload>
          <UButton
            v-if="previewUrl || formInfo.photo"
            size="xs"
            color="error"
            variant="outline"
            icon="i-lucide-trash"
            :disabled="isUploading || isSavingInfo"
            @click="removePhoto"
          >
            {{ $t('pages.profile.information.remove') }}
          </UButton>
        </div>
      </div>
    </div>

    <UForm
      :schema="infoSchema"
      :state="formInfo"
      class="space-y-4"
      @submit="handleInfoSubmit"
    >
      <UFormField
        :label="$t('pages.profile.information.nameLabel')"
        name="name"
        required
      >
        <UInput
          v-model="formInfo.name"
          :placeholder="$t('pages.profile.information.namePlaceholder')"
          class="w-full"
        />
      </UFormField>

      <UFormField
        :label="$t('pages.profile.information.emailLabel')"
        name="email"
        required
      >
        <UInput
          v-model="formInfo.email"
          type="email"
          :placeholder="$t('pages.profile.information.emailPlaceholder')"
          class="w-full"
        />
      </UFormField>

      <div class="flex justify-end pt-3 border-t border-default">
        <UButton
          type="submit"
          color="primary"
          :loading="isSavingInfo"
          :disabled="isUploading || isSavingInfo"
          icon="i-lucide-save"
        >
          {{ $t('pages.profile.information.save') }}
        </UButton>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/auth/useAuth'
import { ref, reactive, watch } from 'vue'
import { z } from 'zod'
import type { UpdateProfilePayload } from '~/types/profile'
import { userService } from '~/services/user-service'

const { state: authState, service: authService } = useAuth()
const toast = useToast()
const handleServiceError = useServiceError()
const { t } = useI18n()

const isSavingInfo = ref(false)
const photoFile = ref<File | null>(null)

const formInfo = reactive<UpdateProfilePayload>({
  name: '',
  email: '',
  photo: null
})

const infoSchema = computed(() =>
  z.object({
    name: z.string().trim().min(1, t('pages.profile.information.nameRequired')),
    email: z
      .string()
      .trim()
      .min(1, t('pages.profile.information.emailRequired'))
      .email(t('pages.profile.information.emailInvalid'))
  })
)

const { isUploading, previewUrl, uploadFile, clearPreview, setPreviewFromUrl } = useImageUpload({
  upload: file => userService.uploadPhoto(file),
  onUploaded: (path) => {
    formInfo.photo = path
  },
  successMessage: () => t('pages.profile.information.photoUploadSuccess'),
  errorMessage: () => t('pages.profile.information.photoUploadFailed')
})

watch(photoFile, (file) => {
  if (file) {
    uploadFile(file)
  }
})

const removePhoto = () => {
  formInfo.photo = null
  photoFile.value = null
  clearPreview()
}

const populateProfile = () => {
  if (authState.user) {
    formInfo.name = authState.user.name
    formInfo.email = authState.user.email
    formInfo.photo = authState.user.photo ?? null
    setPreviewFromUrl(authState.user.photo)
  }
}

const handleInfoSubmit = async () => {
  if (isSavingInfo.value || isUploading.value) {
    return
  }
  isSavingInfo.value = true
  try {
    const response = await authService.updateProfile({
      ...formInfo,
      name: formInfo.name.trim(),
      email: formInfo.email.trim()
    })
    if (response.success) {
      toast.add({
        title: t('pages.profile.information.updatedSuccess'),
        icon: 'i-lucide-circle-check'
      })
    }
  } catch (error) {
    handleServiceError(error)
  } finally {
    isSavingInfo.value = false
  }
}

watch(
  () => authState.user,
  () => {
    populateProfile()
  },
  { immediate: true }
)
</script>
