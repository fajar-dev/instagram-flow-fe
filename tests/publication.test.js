import { beforeEach, expect, test } from 'bun:test'
import { publicationSchedule } from '../app/util/publication'
import { publicationService } from '../app/services/publishing/publication-service'
import { instagramService } from '../app/services/instagram/instagram-service'
import { apiService } from '../app/services/api-service'

beforeEach(() => apiService.configure('http://api.test', () => 'id'))

test('WIB calendar scheduling converts to UTC and rejects impossible dates', () => {
  expect(publicationSchedule('2026-10-20', '09:30')).toBe('2026-10-20T02:30:00.000Z')
  expect(publicationSchedule('2026-10-20', '00:15')).toBe('2026-10-19T17:15:00.000Z')
  expect(publicationSchedule('2026-02-30', '12:00')).toBeNull()
  expect(publicationSchedule('2026-10-20', '24:00')).toBeNull()
  expect(publicationSchedule('', '12:00')).toBeNull()
})

test('publication requests preserve account selection, schedule, snapshot revision and idempotency', async () => {
  const calls = []
  apiService.client.defaults.adapter = async (config) => {
    calls.push(config)
    return { config, data: { success: true, data: [] }, status: 200, statusText: 'OK', headers: {} }
  }
  const payload = {
    revisionId: 'revision',
    accountKey: 'one',
    source: 'photo',
    placement: 'feed',
    scheduledAt: '2026-10-20T02:30:00.000Z'
  }
  await publicationService.create('draft', payload, 'unique-publication-key')
  await publicationService.list('draft')
  await publicationService.cancel('publication')
  await publicationService.retry('publication')
  await instagramService.accounts()
  await instagramService.verify('account')
  expect(JSON.parse(calls[0].data)).toEqual(payload)
  expect(calls[0].headers['Idempotency-Key']).toBe('unique-publication-key')
  expect(calls.map(call => call.url)).toEqual([
    '/drafts/draft/publications',
    '/drafts/draft/publications',
    '/publications/publication/cancel',
    '/publications/publication/retry',
    '/instagram/accounts',
    '/instagram/accounts/account/verify'
  ])
})
