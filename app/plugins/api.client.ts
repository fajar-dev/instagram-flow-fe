import type { Composer } from 'vue-i18n'
import { apiService } from '~/services/api-service'
import { signInLocation } from '~/util/auth/redirect'
import { authService } from '~/services/auth-service'

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig()
  apiService.configure(
    config.public.apiUrl as string,
    () => (nuxtApp.$i18n as Composer).locale.value
  )
  apiService.setAuthHandlers({
    refresh: () => authService.refreshToken(),
    token: () => authService.token.value,
    expire: () => {
      authService.clearSession()
      // The browser URL also retains the requested path during initial session hydration.
      const { pathname, search, hash } = window.location
      if (pathname === '/auth' || pathname.startsWith('/auth/')) {
        return
      }
      const destination = signInLocation(pathname + search + hash)
      void nuxtApp.runWithContext(() => navigateTo(destination, { replace: true }))
    }
  })
  await authService.initialize()
})
