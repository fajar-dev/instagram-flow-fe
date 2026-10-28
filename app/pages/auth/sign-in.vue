<template>
  <div class="w-full max-w-md mx-auto">
    <div class="flex flex-col gap-4 mb-8">
      <div class="space-y-2">
        <h1 class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
          {{ $t('pages.auth.signIn.login') }}
        </h1>
        <p class="text-base text-toned">
          {{ $t('pages.auth.signIn.description') }}
        </p>
      </div>
    </div>

    <UForm
      :state="state"
      :schema="loginSchema"
      class="space-y-5"
      @submit="handleLogin"
    >
      <UFormField
        :label="$t('pages.auth.signIn.emailLabel')"
        name="email"
        required
        class="w-full"
      >
        <UInput
          id="email"
          v-model="state.email"
          type="email"
          :placeholder="$t('pages.auth.signIn.emailPlaceholder')"
          class="w-full"
        />
      </UFormField>

      <UFormField
        :label="$t('pages.auth.signIn.passwordLabel')"
        name="password"
        required
        class="w-full"
      >
        <template #hint>
          <NuxtLink
            to="/auth/forgot-password"
            class="text-sm font-medium text-primary"
          >
            {{ $t('pages.auth.signIn.forgotPassword') }}
          </NuxtLink>
        </template>
        <UInput
          id="password"
          v-model="state.password"
          :type="showPassword ? 'text' : 'password'"
          :placeholder="$t('pages.auth.signIn.passwordPlaceholder')"
          class="w-full"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="ghost"
              :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              class="text-dimmed hover:text-toned p-1 hover:bg-transparent cursor-pointer"
              :aria-label="$t('pages.auth.signIn.togglePasswordVisibility')"
              @click="
                () => {
                  showPassword = !showPassword
                }
              "
            />
          </template>
        </UInput>
      </UFormField>

      <div class="flex flex-col gap-3.5 pt-3">
        <UButton
          type="submit"
          block
          color="primary"
          :loading="loading || googleLoading || microsoftLoading"
        >
          {{ $t('pages.auth.signIn.login') }}
        </UButton>

        <USeparator
          :label="$t('pages.auth.signIn.or')"
          class="my-2.5"
        />

        <!-- <UButton
          type="button"
          block
          variant="soft"
          color="primary"
          :disabled="googleLoading || microsoftLoading || loading || !googleClient?.isReady.value"
          @click="handleGoogleLogin"
        >
          <template #leading>
            <svg
              class="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
          </template>
          {{ $t('pages.auth.signIn.continueWithGoogle') }}
        </UButton> -->

        <UButton
          type="button"
          block
          variant="soft"
          color="primary"
          :disabled="
            microsoftLoading || googleLoading || loading || !microsoftClient?.isReady.value
          "
          @click="handleMicrosoftLogin"
        >
          <template #leading>
            <svg
              class="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1h10v10H1z"
                fill="#F25022"
              />
              <path
                d="M13 1h10v10H13z"
                fill="#7FBA00"
              />
              <path
                d="M1 13h10v10H1z"
                fill="#00A4EF"
              />
              <path
                d="M13 13h10v10H13z"
                fill="#FFB900"
              />
            </svg>
          </template>
          {{ $t('pages.auth.signIn.continueWithMicrosoft') }}
        </UButton>
        <p
          v-if="!googleClient"
          class="text-sm text-toned text-center"
          role="status"
        >
          {{ $t('pages.auth.signIn.googleUnavailable') }}
        </p>
        <p
          v-if="!microsoftClient"
          class="text-sm text-toned text-center"
          role="status"
        >
          {{ $t('pages.auth.signIn.microsoftUnavailable') }}
        </p>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { useSignIn } from '~/composables/auth/useSignIn'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const { t } = useI18n()
const {
  state,
  showPassword,
  loginSchema,
  loading,
  googleLoading,
  microsoftLoading,
  googleClient,
  microsoftClient,
  handleLogin,
  handleGoogleLogin: _handleGoogleLogin,
  handleMicrosoftLogin
} = useSignIn()

useHead(() => ({ title: t('pages.auth.signIn.title') }))
</script>
