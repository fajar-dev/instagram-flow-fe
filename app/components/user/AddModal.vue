<template>
  <UModal
    v-model:open="open"
    :title="$t('components.user.addModal.title')"
    :description="$t('components.user.addModal.description')"
    color="neutral"
    variant="soft"
  >
    <template #body>
      <UserPhotoUpload
        v-model="form.photo"
        v-model:uploading="isUploading"
        :active="open"
        translation-prefix="components.user.addModal"
      />

      <UForm
        id="add-user-form"
        :schema="schema"
        :state="form"
        class="space-y-3"
        @submit="handleSubmit"
      >
        <UserFormFields
          :model-value="form"
          translation-prefix="components.user.addModal"
          :editing="false"
          :disabled="isSubmitting"
          @update:model-value="Object.assign(form, $event)"
        />
      </UForm>
    </template>
    <template #footer>
      <div class="flex justify-end items-center gap-2 w-full">
        <UButton
          :label="$t('components.user.addModal.cancel')"
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
          form="add-user-form"
          color="primary"
          :loading="isSubmitting"
          :disabled="isUploading || isSubmitting"
        >
          {{ $t('components.user.addModal.save') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { userService } from '~/services/user-service'
import type { UserPayload } from '~/types/user'

const handleServiceError = useServiceError()

const open = defineModel<boolean>({ default: false })
const emit = defineEmits<{ created: [] }>()
const toast = useToast()
const isSubmitting = ref(false)
const isUploading = ref(false)

const { t } = useI18n()

const schema = z.object({
  name: z.string().min(1, t('components.user.addModal.nameRequired')),
  email: z
    .string()
    .min(1, t('components.user.addModal.emailRequired'))
    .email(t('components.user.addModal.emailInvalid')),
  password: z.string().min(6, t('components.user.addModal.passwordMin')),
  isActive: z.boolean()
})

const form = reactive<UserPayload>({
  name: '',
  email: '',
  password: '',
  photo: null,
  isActive: true
})

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.password = ''
  form.photo = null
  form.isActive = true
}

const handleSubmit = async () => {
  if (isSubmitting.value || isUploading.value) {
    return
  }
  isSubmitting.value = true
  try {
    const response = await userService.create(form)
    if (response.success) {
      toast.add({
        title: t('components.user.addModal.createdSuccess'),
        color: 'success',
        icon: 'i-lucide-circle-check'
      })
      emit('created')
      open.value = false
      resetForm()
    }
  } catch (error) {
    handleServiceError(error)
  } finally {
    isSubmitting.value = false
  }
}

watch(open, (val) => {
  if (!val) {
    resetForm()
  }
})
</script>
