import type { Composer } from 'vue-i18n'
import { apiService } from '~/services/api-service'
import { authService } from '~/services/auth-service'

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig()
  apiService.configure(config.public.apiUrl as string, () => (nuxtApp.$i18n as Composer).locale.value)
  apiService.setAuthHandlers({
    refresh: () => authService.refreshToken(),
    token: () => authService.token.value,
    expire: () => {
      authService.clearSession()
      void nuxtApp.runWithContext(() => navigateTo('/auth/sign-in'))
    }
  })
  await authService.initialize()
})
