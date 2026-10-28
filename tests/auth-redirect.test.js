import { expect, test } from 'bun:test'
import { computed, reactive, ref } from 'vue'
import { resolveAuthRedirect, signInLocation } from '../app/util/auth/redirect'
import { useSignIn } from '../app/composables/auth/useSignIn'
import { authService } from '../app/services/auth-service'

test('sign-in preserves the complete internal destination through query encoding', () => {
  const target = '/content/project-123?tab=publish&filter=ready%20now#photos'
  const login = signInLocation(target)
  expect(login.path).toBe('/auth/sign-in')
  const query = new URLSearchParams(login.query)
  expect(resolveAuthRedirect(query.get('redirect'))).toBe(target)
})

test('unsafe, malformed and recursive auth destinations fall back to overview', () => {
  for (const value of [
    undefined,
    null,
    [],
    ['/content'],
    '',
    'content',
    'https://evil.test',
    '//evil.test',
    '/\\evil.test',
    '/%2f%2fevil.test',
    '/%5cevil.test',
    '/auth/sign-in?redirect=/content',
    '/auth/microsoft/callback',
    '/content/../auth/sign-in',
    '/%61uth/sign-in',
    '/%zz',
    '/\n/evil.test'
  ]) {
    expect(resolveAuthRedirect(value)).toBe('/')
  }
  expect(resolveAuthRedirect('/analytics?account=main')).toBe('/analytics?account=main')
})

test('password and Google sign-in restore the destination only after successful authentication', async () => {
  const navigations = []
  let googleOptions
  let rejected = false
  let handledErrors = 0
  const replacements = {
    computed,
    reactive,
    ref,
    useI18n: () => ({ t: key => key }),
    useRoute: () => ({ query: { redirect: '/content/project-123?tab=publish#photos' } }),
    useRuntimeConfig: () => ({ public: { googleSignIn: { clientId: 'test' } } }),
    useToast: () => ({ add: () => {} }),
    useServiceError: () => () => {
      handledErrors++
    },
    useCodeClient: (options) => {
      googleOptions = options
      return { isReady: ref(true), login: () => {} }
    },
    navigateTo: async (...args) => {
      navigations.push(args)
    }
  }
  const previous = Object.fromEntries(
    Object.keys(replacements).map(key => [key, globalThis[key]])
  )
  const login = authService.login
  const google = authService.google
  Object.assign(globalThis, replacements)
  authService.login = async () => {
    if (rejected) {
      throw new Error('Invalid login')
    }
  }
  authService.google = async () => {}
  try {
    const state = useSignIn()
    await state.handleLogin()
    await googleOptions.onSuccess({ code: 'test' })
    expect(navigations).toEqual([
      ['/content/project-123?tab=publish#photos', { replace: true }],
      ['/content/project-123?tab=publish#photos', { replace: true }]
    ])
    rejected = true
    await state.handleLogin()
    expect(navigations).toHaveLength(2)
    expect(handledErrors).toBe(1)
    expect(state.loading.value).toBe(false)
  } finally {
    authService.login = login
    authService.google = google
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete globalThis[key]
      } else {
        globalThis[key] = value
      }
    }
  }
})
