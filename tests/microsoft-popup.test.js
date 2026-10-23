import { expect, test } from 'bun:test'
import {
  createMicrosoftAuthorization,
  readMicrosoftCallback
} from '../app/util/auth/microsoft-popup'

test('Microsoft authorization binds a unique state and S256 PKCE challenge to each attempt', async () => {
  const options = {
    clientId: 'client',
    tenantId: 'common',
    redirectUri: 'https://app.test/auth/microsoft/callback'
  }
  const first = await createMicrosoftAuthorization(options)
  const second = await createMicrosoftAuthorization(options)
  const url = new URL(first.url)
  expect(first.state).not.toBe(second.state)
  expect(first.codeVerifier).not.toBe(second.codeVerifier)
  expect(url.searchParams.get('state')).toBe(first.state)
  expect(url.searchParams.get('redirect_uri')).toBe(options.redirectUri)
  expect(url.searchParams.get('code_challenge_method')).toBe('S256')
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(first.codeVerifier))
  expect(url.searchParams.get('code_challenge')).toBe(Buffer.from(digest).toString('base64url'))
  expect(url.searchParams.get('scope')).toBe('openid profile email')
})

test('callback accepts only the matching popup, origin and state', () => {
  const popup = {}
  const event = {
    origin: 'https://app.test',
    source: popup,
    data: { type: 'microsoft-auth', state: 'expected', code: 'code' }
  }
  const read = value => readMicrosoftCallback(value, popup, 'expected', 'https://app.test')
  expect(read(event)).toBe('code')
  expect(read({ ...event, origin: 'https://other.test' })).toBeNull()
  expect(read({ ...event, source: {} })).toBeNull()
  expect(read({ ...event, data: { ...event.data, state: 'wrong' } })).toBeNull()
  expect(() => read({ ...event, data: { ...event.data, error: 'access_denied' } })).toThrow(
    'loginFailed'
  )
  expect(() => read({ ...event, data: { ...event.data, code: null } })).toThrow('loginFailed')
})

test('popup cancellation and success remove listeners and close the window', async () => {
  const { openMicrosoftPopup } = await import('../app/util/auth/microsoft-popup')
  const original = globalThis.window
  const listeners = new Set()
  let target
  let closed = 0
  const popup = {
    closed: false,
    close: () => {
      closed++
    },
    location: {
      replace: (url) => {
        target = url
      }
    }
  }
  globalThis.window = {
    open: () => popup,
    location: { origin: 'https://app.test' },
    addEventListener: (_name, listener) => listeners.add(listener),
    removeEventListener: (_name, listener) => listeners.delete(listener)
  }
  const options = {
    clientId: 'client',
    tenantId: 'common',
    redirectUri: 'https://app.test/auth/microsoft/callback'
  }
  try {
    const cancelled = openMicrosoftPopup(options)
    cancelled.cancel()
    await expect(cancelled.result).rejects.toThrow('popupClosed')
    expect(listeners.size).toBe(0)
    const success = openMicrosoftPopup(options)
    for (let attempt = 0; attempt < 50 && !target; attempt++) {
      await new Promise(resolve => setTimeout(resolve, 5))
    }
    expect(target).toBeString()
    const state = new URL(target).searchParams.get('state')
    for (const listener of listeners) {
      listener({
        source: popup,
        origin: 'https://app.test',
        data: { type: 'microsoft-auth', state, code: 'accepted' }
      })
    }
    expect((await success.result).code).toBe('accepted')
    expect(listeners.size).toBe(0)
    expect(closed).toBe(2)
    window.open = () => null
    await expect(openMicrosoftPopup(options).result).rejects.toThrow('popupBlocked')
  } finally {
    globalThis.window = original
  }
})
