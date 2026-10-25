import { authService } from '~/services/auth-service'
import { resolveAuthRedirect } from '~/util/auth/redirect'

export default defineNuxtRouteMiddleware((to) => {
  if (authService.token.value) {
    return navigateTo(resolveAuthRedirect(to.query.redirect), { replace: true })
  }
})
