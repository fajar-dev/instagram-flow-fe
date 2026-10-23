import { useMicrosoftCodeClient } from './useMicrosoftCodeClient'
import { z } from 'zod'
import type { Ref } from 'vue'
import { authService } from '~/services/auth-service'

export function useSignIn() {
  const { t } = useI18n()
  const config = useRuntimeConfig()
  const toast = useToast()
  const handleServiceError = useServiceError()
  const state = reactive({ email: '', password: '' })
  const showPassword = ref(false)
  const loading = ref(false)
  const googleLoading = ref(false)
  const microsoftLoading = ref(false)
  const loginSchema = computed(() =>
    z.object({
      email: z.email(t('pages.auth.signIn.emailInvalid')),
      password: z.string().min(1, t('pages.auth.signIn.passwordRequired'))
    })
  )

  async function completeLogin(request: () => Promise<unknown>, pending: Ref<boolean>) {
    pending.value = true
    try {
      await request()
      toast.add({ title: t('pages.auth.signIn.loginSuccess'), icon: 'i-lucide-circle-check' })
      await navigateTo('/')
    } catch (error) {
      handleServiceError(error)
    } finally {
      pending.value = false
    }
  }

  function providerError(pending: Ref<boolean>, error = 'loginFailed') {
    pending.value = false
    if (error === 'popupClosed') {
      return
    }
    const key = ['popupBlocked', 'popupTimeout'].includes(error) ? error : 'loginFailed'
    toast.add({ title: t(`pages.auth.signIn.${key}`), color: 'error', icon: 'i-lucide-circle-x' })
  }

  const googleClient = config.public.googleSignIn?.clientId
    ? useCodeClient({
        onSuccess: response =>
          completeLogin(() => authService.google(response.code), googleLoading),
        onError: () => providerError(googleLoading)
      })
    : null
  const microsoftClient = config.public.microsoftClientId
    ? useMicrosoftCodeClient({
        clientId: config.public.microsoftClientId,
        tenantId: config.public.microsoftTenantId || 'common',
        redirectUri:
          config.public.microsoftRedirectUri || `${window.location.origin}/auth/microsoft/callback`,
        onSuccess: ({ code, codeVerifier }) =>
          completeLogin(() => authService.microsoft(code, codeVerifier), microsoftLoading),
        onError: error => providerError(microsoftLoading, error)
      })
    : null

  function handleGoogleLogin() {
    if (!googleClient?.isReady.value) {
      return
    }
    googleLoading.value = true
    try {
      googleClient.login()
    } catch {
      providerError(googleLoading)
    }
  }

  function handleMicrosoftLogin() {
    if (!microsoftClient?.isReady.value) {
      return
    }
    microsoftLoading.value = true
    void microsoftClient.login()
  }

  function handleLogin() {
    return completeLogin(() => authService.login(state.email, state.password), loading)
  }

  return {
    state,
    showPassword,
    loginSchema,
    loading,
    googleLoading,
    microsoftLoading,
    googleClient,
    microsoftClient,
    handleLogin,
    handleGoogleLogin,
    handleMicrosoftLogin
  }
}
