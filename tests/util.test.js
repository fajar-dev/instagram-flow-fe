import { isNavigationActive } from '../app/util/navigation'
import { expect, test } from 'bun:test'
import { formatDate, formatDateTime } from '../app/util/date'
import { buildListQuery, getQueryString } from '../app/util/query'
import { getLocaleFlag } from '../app/util/locale'

test('date helpers handle empty and invalid input without exposing Invalid Date', () => {
  for (const value of [null, undefined, '', 'invalid', new Date(NaN)]) {
    expect(formatDate(value)).toBe('-')
    expect(formatDateTime(value)).toBe('-')
  }
  expect(formatDate(0, 'en-US', { timeZone: 'UTC' })).toBe('Jan 1, 1970')
})

test('date helpers honor locale, timezone and date-only versus date-time output', () => {
  const value = '2026-10-15T23:30:00Z'
  expect(formatDate(value, 'en-US', { timeZone: 'UTC' })).toBe('Oct 15, 2026')
  expect(formatDate(new Date(value), 'id-ID', { timeZone: 'Asia/Jakarta' })).toBe('16 Okt 2026')
  expect(formatDateTime(value, 'id-ID', { timeZone: 'Asia/Jakarta' })).toContain('06.30')
})

test('list queries preserve reserved characters and only include ordering with a sort column', () => {
  const defaults = buildListQuery()
  expect(defaults.get('page')).toBe('1')
  expect(defaults.has('order')).toBe(false)
  const params = buildListQuery({ page: 2, perPage: 25, q: 'a+b & c@example.com', sortBy: 'name', order: 'ASC' })
  const decoded = new URLSearchParams(params.toString())
  expect(decoded.get('q')).toBe('a+b & c@example.com')
  expect(decoded.get('limit')).toBe('25')
  expect(decoded.get('sortBy')).toBe('name')
  expect(decoded.get('order')).toBe('ASC')
  params.set('isActive', 'false')
  expect(params.get('isActive')).toBe('false')
})

test('query strings reject duplicate parameters and non-string values', () => {
  expect(getQueryString('user+test@example.com')).toBe('user+test@example.com')
  for (const value of [undefined, null, ['one', 'two'], 123]) {
    expect(getQueryString(value)).toBe('')
  }
})

test('locale flags share a consistent fallback', () => {
  expect(getLocaleFlag('id')).toBe('circle-flags:id')
  expect(getLocaleFlag('en')).toBe('circle-flags:us')
  expect(getLocaleFlag('unknown')).toBe('circle-flags:us')
})

test('navigation selects the most specific route and respects path boundaries', () => {
  const targets = ['/content', '/content/media', '/user', '/']
  expect(isNavigationActive('/content/media', '/content', targets)).toBe(false)
  expect(isNavigationActive('/content/job/edit', '/content', targets)).toBe(true)
  expect(isNavigationActive('/user-other', '/user', targets)).toBe(false)
  expect(isNavigationActive('/user', '/user', targets)).toBe(true)
  expect(isNavigationActive('/user', '/', targets)).toBe(false)
})
