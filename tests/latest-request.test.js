import { expect, test } from 'bun:test'
import { useLatestRequest } from '../app/composables/useLatestRequest'

function deferred() {
  let resolve, reject
  const promise = new Promise((ok, fail) => {
    resolve = ok
    reject = fail
  })
  return { promise, resolve, reject }
}

async function withRequest(run) {
  const old = { onUnmounted: globalThis.onUnmounted, useServiceError: globalThis.useServiceError }
  let dispose
  const errors = []
  globalThis.onUnmounted = (callback) => {
    dispose = callback
  }
  globalThis.useServiceError = () => error => errors.push(error)
  try {
    await run({ errors, dispose: () => dispose() })
  } finally {
    for (const [key, value] of Object.entries(old)) {
      if (value === undefined) {
        delete globalThis[key]
      } else {
        globalThis[key] = value
      }
    }
  }
}

test('a slow older response cannot overwrite a newer filter result', () =>
  withRequest(async () => {
    const first = deferred(),
      second = deferred()
    const pending = [first, second]
    const applied = []
    const state = useLatestRequest(
      () => pending.shift().promise,
      result => applied.push(result)
    )
    const oldRequest = state.load()
    const newRequest = state.load()
    second.resolve('new')
    await newRequest
    first.resolve('old')
    await oldRequest
    expect(applied).toEqual(['new'])
    expect(state.loading.value).toBe(false)
  }))

test('superseded errors do not show a toast or clear the current loading state', () =>
  withRequest(async ({ errors }) => {
    const first = deferred(),
      second = deferred()
    const pending = [first, second]
    const state = useLatestRequest(
      () => pending.shift().promise,
      () => {}
    )
    const oldRequest = state.load()
    const newRequest = state.load()
    first.reject(new Error('old request failed'))
    await oldRequest
    expect(errors).toEqual([])
    expect(state.loading.value).toBe(true)
    expect(state.failed.value).toBe(false)
    const failure = new Error('current request failed')
    second.reject(failure)
    await newRequest
    expect(errors).toEqual([failure])
    expect(state.failed.value).toBe(true)
    expect(state.loading.value).toBe(false)
  }))

test('navigation prevents late response effects and future requests', () =>
  withRequest(async ({ dispose, errors }) => {
    const pending = deferred()
    let calls = 0
    const applied = []
    const state = useLatestRequest(
      () => {
        calls++
        return pending.promise
      },
      result => applied.push(result)
    )
    const request = state.load()
    dispose()
    pending.reject(new Error('request after navigation'))
    await request
    await state.load()
    expect(errors).toEqual([])
    expect(applied).toEqual([])
    expect(calls).toBe(1)
  }))

test('repeated polling failures keep one error notification until recovery', () =>
  withRequest(async ({ errors }) => {
    let failing = true
    const applied = []
    const failure = new Error('Offline')
    const state = useLatestRequest(
      async () => {
        if (failing) {
          throw failure
        }
        return 'recovered'
      },
      result => applied.push(result)
    )
    await state.load()
    await state.load()
    expect(errors).toEqual([failure])
    expect(state.failed.value).toBe(true)
    failing = false
    await state.load()
    expect(applied).toEqual(['recovered'])
    expect(state.failed.value).toBe(false)
    failing = true
    await state.load()
    expect(errors).toEqual([failure, failure])
  }))
