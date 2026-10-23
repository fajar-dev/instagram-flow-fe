import { useAuth } from '~/composables/auth/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  const { state } = useAuth()

  const publicPaths = [
    '/auth/sign-in',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/microsoft/callback'
  ]

  // Allow public pages
  if (publicPaths.includes(to.path) || to.path.startsWith('/auth/')) {
    return
  }

  // Require authentication
  if (!state.token) {
    return navigateTo('/auth/sign-in')
  }
})
