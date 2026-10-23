<template>
  <UModal
    v-model:open="open"
    :title="$t('components.user.updateModal.title')"
    :description="$t('components.user.updateModal.description')"
  >
    <template #body>
      <UserPhotoUpload
        v-model="form.photo"
        v-model:uploading="isUploading"
        :active="open"
        :initial-url="user?.photo"
        translation-prefix="components.user.updateModal"
      />

      <UForm
        id="update-user-form"
        :schema="schema"
        :state="form"
        class="space-y-3"
        @submit="handleSubmit"
      >
        <UserFormFields
          :model-value="form"
          translation-prefix="components.user.updateModal"
          :editing="true"
          :disabled="isSubmitting"
          @update:model-value="Object.assign(form, $event)"
        />
      </UForm>
    </template>
    <template #footer>
      <div class="flex justify-end items-center gap-2 w-full">
        <UButton
          :label="$t('components.user.updateModal.cancel')"
          color="neutral"
          variant="soft"
          @click="
            () => {
              open = false
            }
          "
        />
        <UButton
          type="submit"
          form="update-user-form"
          color="primary"
          :loading="isSubmitting"
          :disabled="isUploading || isSubmitting"
        >
          {{ $t('components.user.updateModal.save') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { userService } from '~/services/user-service'
import type { User, UserPayload } from '~/types/user'

const handleServiceError = useServiceError()

const open = defineModel<boolean>({ default: false })

const props = defineProps<{
  user: User | null
}>()

const emit = defineEmits<{ updated: [] }>()
const toast = useToast()
const isSubmitting = ref(false)
const isUploading = ref(false)

const { t } = useI18n()

// Schema for updating (password is optional, min 6 if filled)
const schema = z.object({
  name: z.string().min(1, t('components.user.updateModal.nameRequired')),
  email: z
    .string()
    .min(1, t('components.user.updateModal.emailRequired'))
    .email(t('components.user.updateModal.emailInvalid')),
  password: z
    .string()
    .min(6, t('components.user.updateModal.passwordMin'))
    .optional()
    .or(z.literal('')),
  isActive: z.boolean()
})

const form = reactive<UserPayload>({
  name: '',
  email: '',
  password: '',
  photo: null,
  isActive: true
})

const populateForm = () => {
  if (props.user) {
    form.name = props.user.name
    form.email = props.user.email
    form.password = ''
    form.photo = props.user.photo // will contain the MinIO presigned URL (or path)
    form.isActive = props.user.isActive
  }
}

const handleSubmit = async () => {
  if (isSubmitting.value || isUploading.value) {
    return
  }
  if (!props.user) {
    return
  }
  isSubmitting.value = true

  // Build payload
  const payload: UserPayload = {
    name: form.name,
    email: form.email,
    photo: form.photo,
    isActive: form.isActive
  }

  // Only send password if user filled it
  if (form.password && form.password.trim() !== '') {
    payload.password = form.password
  }

  try {
    const response = await userService.update(props.user.id, payload)
    if (response.success) {
      toast.add({
        title: t('components.user.updateModal.updatedSuccess'),
        icon: 'i-lucide-circle-check'
      })
      emit('updated')
      open.value = false
    }
  } catch (error) {
    handleServiceError(error)
  } finally {
    isSubmitting.value = false
  }
}

watch(open, (val) => {
  if (val) {
    populateForm()
  }
})
</script>
