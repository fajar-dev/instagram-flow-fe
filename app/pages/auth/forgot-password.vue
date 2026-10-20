<template>
  <div class="w-full max-w-md mx-auto">
    <div class="flex flex-col gap-5 mb-6">
      <div class="space-y-1">
        <h1 class="text-3xl font-bold text-highlighted">
          {{ $t('pages.auth.forgotPassword.title') }}
        </h1>
        <p class="text-toned">
          {{ $t('pages.auth.forgotPassword.description') }}
        </p>
      </div>
    </div>

    <div
      v-if="isSubmitted"
      class="space-y-6"
    >
      <p class="text-sm text-muted">
        {{ $t('pages.auth.forgotPassword.checkEmailTitle') }} ·
        {{ $t('pages.auth.forgotPassword.checkEmailDescription') }}
      </p>

      <div class="space-y-3">
        <UButton
          block
          variant="soft"
          color="neutral"
          :loading="isResending"
          :disabled="resendCooldown > 0"
          @click="handleResend"
        >
          {{
            resendCooldown > 0
              ? $t('pages.auth.forgotPassword.resendCooldown', { seconds: resendCooldown })
              : $t('pages.auth.forgotPassword.resendEmail')
          }}
        </UButton>

        <NuxtLink
          to="/auth/sign-in"
          class="flex items-center justify-center gap-2 text-sm font-medium text-toned hover:text-highlighted transition-colors"
        >
          <UIcon
            name="i-lucide-arrow-left"
            class="w-4 h-4"
          />
          {{ $t('pages.auth.forgotPassword.backToSignIn') }}
        </NuxtLink>
      </div>
    </div>

    <UForm
      v-else
      :state="state"
      :schema="forgotSchema"
      class="space-y-4"
      @submit="handleSubmit"
    >
      <UFormField
        :label="$t('pages.auth.forgotPassword.emailLabel')"
        name="email"
        required
        class="w-full"
      >
        <UInput
          id="forgot-email"
          v-model="state.email"
          type="email"
          :placeholder="$t('pages.auth.forgotPassword.emailPlaceholder')"
          class="w-full"
        />
      </UFormField>

      <div class="flex flex-col gap-3 pt-2">
        <UButton
          type="submit"
          block
          color="primary"
          :loading="loading"
        >
          {{ $t('pages.auth.forgotPassword.sendResetLink') }}
        </UButton>

        <NuxtLink
          to="/auth/sign-in"
          class="flex items-center justify-center gap-2 text-sm font-medium text-toned hover:text-highlighted transition-colors"
        >
          <UIcon
            name="i-lucide-arrow-left"
            class="w-4 h-4"
          />
          {{ $t('pages.auth.forgotPassword.backToSignIn') }}
        </NuxtLink>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { authService } from '~/services/auth-service'

const handleServiceError = useServiceError()

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

const { t } = useI18n()

useHead(() => ({
  title: t('pages.auth.forgotPassword.title')
}))

const state = reactive({
  email: ''
})

const loading = ref(false)
const isResending = ref(false)
const isSubmitted = ref(false)
const toast = useToast()

const forgotSchema = computed(() =>
  z.object({
    email: z.email(t('pages.auth.forgotPassword.emailInvalid'))
  })
)

const RESEND_COOLDOWN_SECONDS = 60
const resendCooldown = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | undefined

const startResendCooldown = () => {
  resendCooldown.value = RESEND_COOLDOWN_SECONDS
  clearInterval(cooldownTimer)
  cooldownTimer = setInterval(() => {
    resendCooldown.value -= 1
    if (resendCooldown.value <= 0) {
      clearInterval(cooldownTimer)
    }
  }, 1000)
}

onUnmounted(() => clearInterval(cooldownTimer))

const handleSubmit = async () => {
  loading.value = true
  try {
    await authService.forgotPassword(state.email)
    isSubmitted.value = true
    toast.add({
      title: t('pages.auth.forgotPassword.resetLinkSent'),
      icon: 'i-lucide-circle-check'
    })
    startResendCooldown()
  } catch (error) {
    handleServiceError(error)
  } finally {
    loading.value = false
  }
}

const handleResend = async () => {
  isResending.value = true
  try {
    await authService.forgotPassword(state.email)
    toast.add({
      title: t('pages.auth.forgotPassword.resetLinkSent'),
      icon: 'i-lucide-circle-check'
    })
    startResendCooldown()
  } catch (error) {
    handleServiceError(error)
  } finally {
    isResending.value = false
  }
}
</script>
