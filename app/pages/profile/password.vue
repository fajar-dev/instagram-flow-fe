<template>
  <div class="p-6 space-y-6">
    <UForm
      :schema="passwordSchema"
      :state="formPassword"
      class="space-y-4"
      @submit="handlePasswordSubmit"
    >
      <UFormField
        v-if="requiresCurrentPassword"
        :label="$t('pages.profile.password.currentPasswordLabel')"
        :description="$t('pages.profile.password.currentPasswordHint')"
        name="oldPassword"
        required
      >
        <UInput
          v-model="formPassword.oldPassword"
          autocomplete="current-password"
          type="password"
          :placeholder="$t('pages.profile.password.currentPasswordPlaceholder')"
          class="w-full"
        />
      </UFormField>
      <UFormField
        :label="$t('pages.profile.password.newPasswordLabel')"
        name="newPassword"
        required
      >
        <UInput
          v-model="formPassword.newPassword"
          autocomplete="new-password"
          type="password"
          :placeholder="$t('pages.profile.password.newPasswordPlaceholder')"
          class="w-full"
        />
      </UFormField>
      <UFormField
        :label="$t('pages.profile.password.confirmPasswordLabel')"
        name="confirmPassword"
        required
      >
        <UInput
          v-model="formPassword.confirmPassword"
          autocomplete="new-password"
          type="password"
          :placeholder="$t('pages.profile.password.confirmPasswordPlaceholder')"
          class="w-full"
        />
      </UFormField>

      <div class="flex justify-end pt-3 border-t border-default">
        <UButton
          type="submit"
          color="primary"
          :loading="isSavingPassword"
          icon="i-lucide-key-round"
        >
          {{ $t('pages.profile.password.save') }}
        </UButton>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/auth/useAuth'
import { ref, reactive } from 'vue'
import { z } from 'zod'
import type { UpdatePasswordPayload } from '~/types/profile'

const { state: authState, service: authService } = useAuth()
const toast = useToast()
const handleServiceError = useServiceError()
const { t } = useI18n()

const isSavingPassword = ref(false)

const formPassword = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const requiresCurrentPassword = computed(() => authState.user?.hasPassword !== false)

const passwordSchema = computed(() =>
  z
    .object({
      oldPassword: requiresCurrentPassword.value
        ? z.string().min(1, t('pages.profile.password.currentPasswordRequired'))
        : z.string().optional(),
      newPassword: z.string().min(6, t('pages.profile.password.newPasswordMin')),
      confirmPassword: z.string().min(6, t('pages.profile.password.confirmPasswordMin'))
    })
    .refine(data => data.confirmPassword === data.newPassword, {
      message: t('pages.profile.password.passwordMismatch'),
      path: ['confirmPassword']
    })
)

const handlePasswordSubmit = async () => {
  if (isSavingPassword.value) {
    return
  }
  isSavingPassword.value = true

  const payload: UpdatePasswordPayload = {
    newPassword: formPassword.newPassword
  }

  if (requiresCurrentPassword.value) {
    payload.oldPassword = formPassword.oldPassword
  }

  try {
    const response = await authService.updatePassword(payload)
    if (response.success) {
      toast.add({
        title: t('pages.profile.password.updatedSuccess'),
        icon: 'i-lucide-circle-check'
      })
      formPassword.oldPassword = ''
      formPassword.newPassword = ''
      formPassword.confirmPassword = ''
    }
  } catch (error) {
    handleServiceError(error)
  } finally {
    isSavingPassword.value = false
  }
}
</script>
