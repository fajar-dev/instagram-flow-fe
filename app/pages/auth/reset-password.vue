<template>
  <div class="w-full max-w-md mx-auto">
    <div
      v-if="isValidating"
      class="flex flex-col items-center gap-4 py-12"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="w-8 h-8 text-primary animate-spin"
      />
      <p class="text-muted">
        {{ $t('pages.auth.resetPassword.validating') }}
      </p>
    </div>

    <template v-else>
      <div class="flex flex-col gap-5 mb-6">
        <BrandLogo />
        <div class="space-y-1">
          <h1 class="text-3xl font-bold text-highlighted">
            {{ $t('pages.auth.resetPassword.title') }}
          </h1>
          <p class="text-toned">
            {{ $t('pages.auth.resetPassword.description') }}
          </p>
        </div>
      </div>

      <UForm
        :state="state"
        :schema="resetSchema"
        class="space-y-4"
        @submit="handleReset"
      >
        <UFormField
          :label="$t('pages.auth.resetPassword.newPasswordLabel')"
          name="password"
          required
          class="w-full"
        >
          <UInput
            id="new-password"
            v-model="state.password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="$t('pages.auth.resetPassword.newPasswordPlaceholder')"
            class="w-full"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="ghost"
                :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                class="text-dimmed hover:text-toned p-1 hover:bg-transparent cursor-pointer"
                :aria-label="$t('pages.auth.resetPassword.togglePasswordVisibility')"
                @click="
                  () => {
                    showPassword = !showPassword
                  }
                "
              />
            </template>
          </UInput>
        </UFormField>

        <UFormField
          :label="$t('pages.auth.resetPassword.confirmPasswordLabel')"
          name="confirmPassword"
          required
          class="w-full"
        >
          <UInput
            id="confirm-password"
            v-model="state.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            :placeholder="$t('pages.auth.resetPassword.confirmPasswordPlaceholder')"
            class="w-full"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="ghost"
                :icon="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                class="text-dimmed hover:text-toned p-1 hover:bg-transparent cursor-pointer"
                :aria-label="$t('pages.auth.resetPassword.toggleConfirmPasswordVisibility')"
                @click="
                  () => {
                    showConfirmPassword = !showConfirmPassword
                  }
                "
              />
            </template>
          </UInput>
        </UFormField>

        <div class="flex flex-col gap-3 pt-2">
          <UButton
            type="submit"
            block
            color="primary"
            :loading="loading"
          >
            {{ $t('pages.auth.resetPassword.save') }}
          </UButton>

          <NuxtLink
            to="/auth/sign-in"
            class="flex items-center justify-center gap-2 text-sm font-medium text-toned hover:text-highlighted transition-colors"
          >
            <UIcon
              name="i-lucide-arrow-left"
              class="w-4 h-4"
            />
            {{ $t('pages.auth.resetPassword.backToSignIn') }}
          </NuxtLink>
        </div>
      </UForm>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getQueryString } from '~/util/query'
import { z } from 'zod'
import { authService } from '~/services/auth-service'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

const { t } = useI18n()

useHead(() => ({
  title: t('pages.auth.resetPassword.title')
}))

const route = useRoute()
const toast = useToast()
const handleServiceError = useServiceError()

const token = computed(() => getQueryString(route.query.token))
const email = computed(() => getQueryString(route.query.email))

const state = reactive({
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const isValidating = ref(true)

const resetSchema = computed(() =>
  z
    .object({
      password: z.string().min(6, t('pages.auth.resetPassword.passwordMin')),
      confirmPassword: z.string().min(1, t('pages.auth.resetPassword.confirmPasswordRequired'))
    })
    .refine(data => data.password === data.confirmPassword, {
      message: t('pages.auth.resetPassword.passwordMismatch'),
      path: ['confirmPassword']
    })
)

onMounted(async () => {
  if (!token.value || !email.value) {
    toast.add({
      title: t('pages.auth.resetPassword.invalidLink'),
      icon: 'i-lucide-circle-x',
      color: 'error'
    })
    navigateTo('/auth/forgot-password')
    return
  }

  try {
    await authService.validateResetPassword(email.value, token.value)
    isValidating.value = false
  } catch (error) {
    handleServiceError(error)
    navigateTo('/auth/forgot-password')
  }
})

const handleReset = async () => {
  loading.value = true
  try {
    await authService.resetPassword(token.value, state.password)
    toast.add({
      title: t('pages.auth.resetPassword.resetSuccess'),
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
    navigateTo('/auth/sign-in')
  } catch (error) {
    handleServiceError(error)
  } finally {
    loading.value = false
  }
}
</script>
