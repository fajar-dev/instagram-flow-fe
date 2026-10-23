import { afterEach, expect, test } from 'bun:test'
import { AxiosError } from 'axios'
import { ApiService, apiService } from '../app/services/api-service'
import { AuthService } from '../app/services/auth-service'

const response = (config, data = {}, status = 200) => ({
  config,
  data,
  status,
  statusText: '',
  headers: {}
})
const unauthorized = config =>
  new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, null, response(config, {}, 401))

function client() {
  const service = new ApiService()
  service.configure('http://api.test', () => 'id')
  return service
}

test('concurrent 401 responses share one refresh and retry with the new token', async () => {
  const service = client()
  let refreshed = 0
  let token = 'old'
  service.setAuthHandlers({
    token: () => token,
    expire: () => {
      throw new Error('Unexpected expiry')
    },
    refresh: async () => {
      refreshed++
      await new Promise(resolve => setTimeout(resolve, 10))
      token = 'new'
      return token
    }
  })
  service.client.defaults.adapter = async (config) => {
    if (config.headers.Authorization === 'Bearer old') {
      throw unauthorized(config)
    }
    expect(config.headers.Authorization).toBe('Bearer new')
    expect(config.headers['Accept-Language']).toBe('id')
    return response(config)
  }
  await Promise.all(
    [1, 2].map(() => service.client.get('/user', { headers: { Authorization: 'Bearer old' } }))
  )
  expect(refreshed).toBe(1)
})

test('invalid login credentials do not refresh or clear another session', async () => {
  const service = client()
  let called = false
  service.setAuthHandlers({
    token: () => 'old',
    refresh: async () => {
      called = true
    },
    expire: () => {
      called = true
    }
  })
  service.client.defaults.adapter = async (config) => {
    throw unauthorized(config)
  }
  await expect(service.client.post('/auth/login', {})).rejects.toBeInstanceOf(AxiosError)
  expect(called).toBe(false)
})

test('network failure during refresh preserves the session', async () => {
  const service = client()
  let expired = false
  service.setAuthHandlers({
    token: () => 'old',
    refresh: async () => {
      throw new AxiosError('Offline', 'ERR_NETWORK')
    },
    expire: () => {
      expired = true
    }
  })
  service.client.defaults.adapter = async (config) => {
    throw unauthorized(config)
  }
  await expect(
    service.client.get('/user', { headers: { Authorization: 'Bearer old' } })
  ).rejects.toBeInstanceOf(AxiosError)
  expect(expired).toBe(false)
})

test('rejected refresh expires session without retry loops', async () => {
  const service = client()
  let expired = false
  let requests = 0
  service.setAuthHandlers({
    token: () => 'old',
    refresh: async () => {
      throw unauthorized({})
    },
    expire: () => {
      expired = true
    }
  })
  service.client.defaults.adapter = async (config) => {
    requests++
    throw unauthorized(config)
  }
  await expect(
    service.client.get('/user', { headers: { Authorization: 'Bearer old' } })
  ).rejects.toBeInstanceOf(AxiosError)
  expect(expired).toBe(true)
  expect(requests).toBe(1)
})

const originalWindow = globalThis.window
const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
afterEach(() => {
  if (originalWindow === undefined) {
    delete globalThis.window
  } else {
    globalThis.window = originalWindow
  }
  if (originalStorage) {
    Object.defineProperty(globalThis, 'localStorage', originalStorage)
  } else {
    delete globalThis.localStorage
  }
})

function browserStorage() {
  const values = new Map()
  globalThis.window = {}
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: key => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
      removeItem: key => values.delete(key)
    }
  })
  return values
}

const session = {
  data: {
    user: { id: 1, name: 'User', email: 'user@example.com', photo: null, isActive: true },
    accessToken: 'access',
    refreshToken: 'refresh'
  }
}

test('logout sends Authorization as a header and immediately clears local state', async () => {
  const values = browserStorage()
  apiService.configure('http://api.test', () => 'en')
  const auth = new AuthService()
  apiService.client.defaults.adapter = async config => response(config, session)
  await auth.login('user@example.com', 'password')
  apiService.client.defaults.adapter = async (config) => {
    expect(config.url).toBe('/auth/logout')
    expect(config.headers.Authorization).toBe('Bearer access')
    expect(config.data).toBeNull()
    expect(auth.token.value).toBeNull()
    return response(config)
  }
  await auth.logout()
  expect(values.size).toBe(0)
  expect(auth.user.value).toBeNull()
})

test('reset validation uses encoded query parameters for plus addresses', async () => {
  apiService.configure('http://api.test', () => 'en')
  apiService.client.defaults.adapter = async (config) => {
    const url = new URL(apiService.client.getUri(config))
    expect(url.searchParams.get('email')).toBe('user+reset@example.com')
    expect(url.searchParams.get('token')).toBe('a&b')
    return response(config, { data: null })
  }
  await new AuthService().validateResetPassword('user+reset@example.com', 'a&b')
})

test('late refresh cannot restore a session after logout', async () => {
  browserStorage()
  apiService.configure('http://api.test', () => 'en')
  const auth = new AuthService()
  apiService.client.defaults.adapter = async config => response(config, session)
  await auth.login('user@example.com', 'password')
  let finish
  apiService.client.defaults.adapter = config =>
    new Promise((resolve) => {
      finish = () => resolve(response(config, session))
    })
  const pending = auth.refreshToken()
  await new Promise(resolve => setTimeout(resolve, 0))
  auth.clearSession()
  finish()
  expect(await pending).toBeNull()
  expect(auth.token.value).toBeNull()
})

test('profile updates persist the returned user and use authenticated PUT requests', async () => {
  const values = browserStorage()
  apiService.configure('http://api.test', () => 'en')
  const auth = new AuthService()
  apiService.client.defaults.adapter = async config => response(config, session)
  await auth.login('user@example.com', 'password')
  const updated = { ...session.data.user, name: 'Updated', photo: null }
  apiService.client.defaults.adapter = async (config) => {
    expect(config.method).toBe('put')
    expect(config.url).toBe('/auth/profile')
    expect(config.headers.Authorization).toBe('Bearer access')
    expect(JSON.parse(config.data).photo).toBeNull()
    return response(config, { success: true, data: updated })
  }
  await auth.updateProfile({ name: updated.name, email: updated.email, photo: null })
  expect(auth.user.value.name).toBe('Updated')
  expect(JSON.parse(values.get('user'))).toEqual(updated)
})

test('setting a password updates hasPassword without storing passwords', async () => {
  const values = browserStorage()
  apiService.configure('http://api.test', () => 'en')
  const auth = new AuthService()
  apiService.client.defaults.adapter = async config => response(config, session)
  await auth.login('user@example.com', 'password')
  apiService.client.defaults.adapter = async (config) => {
    expect(config.url).toBe('/auth/password')
    expect(config.headers.Authorization).toBe('Bearer access')
    expect(JSON.parse(config.data)).toEqual({ newPassword: 'new-password' })
    return response(config, { success: true, data: null })
  }
  await auth.updatePassword({ newPassword: 'new-password' })
  expect(auth.user.value.hasPassword).toBe(true)
  expect(values.get('user')).not.toContain('new-password')
})

test('a profile response after logout does not restore user state or storage', async () => {
  const values = browserStorage()
  apiService.configure('http://api.test', () => 'en')
  const auth = new AuthService()
  apiService.client.defaults.adapter = async config => response(config, session)
  await auth.login('user@example.com', 'password')
  let finish
  apiService.client.defaults.adapter = config =>
    new Promise((resolve) => {
      finish = () => resolve(response(config, { success: true, data: session.data.user }))
    })
  const pending = auth.updateProfile({ name: 'Changed', email: 'user@example.com' })
  await new Promise(resolve => setTimeout(resolve, 0))
  auth.clearSession()
  finish()
  await pending
  expect(auth.user.value).toBeNull()
  expect(values.has('user')).toBe(false)
})

test('a rejected profile update preserves the previous user and surfaces the error', async () => {
  browserStorage()
  apiService.configure('http://api.test', () => 'en')
  const auth = new AuthService()
  apiService.client.defaults.adapter = async config => response(config, session)
  await auth.login('user@example.com', 'password')
  apiService.client.defaults.adapter = async () => {
    throw new Error('Email already in use')
  }
  await expect(auth.updateProfile({ name: 'Changed', email: 'taken@example.com' })).rejects.toThrow(
    'Email already in use'
  )
  expect(auth.user.value.name).toBe('User')
})

test('microsoft login posts authorization code and establishes session', async () => {
  browserStorage()
  apiService.configure('http://api.test', () => 'en')
  const auth = new AuthService()
  apiService.client.defaults.adapter = async (config) => {
    expect(config.url).toBe('/auth/microsoft')
    expect(JSON.parse(config.data)).toEqual({
      code: 'ms-code',
      codeVerifier: 'test-verifier'
    })
    return response(config, session)
  }
  const result = await auth.microsoft('ms-code', 'test-verifier')
  expect(result.data.accessToken).toBe('access')
  expect(auth.user.value?.email).toBe('user@example.com')
})
