import { beforeEach, expect, test } from 'bun:test'
import { apiService } from '../app/services/api-service'
import { batchService } from '../app/services/content/batch-service'
import { jobService } from '../app/services/ai-job/job-service'
import { draftService } from '../app/services/content-review/draft-service'
import { mediaService } from '../app/services/content/media-service'
import { settingsService } from '../app/services/integration/settings-service'
import { reportingService } from '../app/services/reporting/reporting-service'

const response = (config, data) => ({ config, data, status: 200, statusText: 'OK', headers: {} })
beforeEach(() => {
  apiService.configure('http://api.test', () => 'en')
})

test('split batch/job clients preserve idempotency headers and request payloads', async () => {
  const calls = []
  apiService.client.defaults.adapter = async (config) => {
    calls.push(config)
    return response(config, { data: { id: 'batch-1', jobId: 'job-1' } })
  }
  expect((await batchService.batch({ projectName: 'AMTI' }, 'batch-key')).data.id).toBe('batch-1')
  expect((await jobService.process('batch-1', ['feed'], 'process-key')).data.jobId).toBe('job-1')
  await jobService.retry('job-1', 'retry-key')
  expect(calls.map(call => call.headers['Idempotency-Key'])).toEqual([
    'batch-key',
    'process-key',
    'retry-key'
  ])
  expect(calls.map(call => call.url)).toEqual([
    '/batches',
    '/batches/batch-1/process',
    '/jobs/job-1/retry'
  ])
  expect(JSON.parse(calls[1].data)).toEqual({ requestedOutputs: ['feed'] })
})

test('draft client preserves revision guards and media requests remain private blobs', async () => {
  const calls = []
  apiService.client.defaults.adapter = async (config) => {
    calls.push(config)
    return response(config, new Blob(['private preview']))
  }
  await draftService.edit('draft-1', { expectedRevisionId: 'revision-1', title: 'Updated' })
  await draftService.reject('draft-1', { revisionId: 'revision-1', contentHash: 'hash', notes: '' })
  await mediaService.file('renders/render-1')
  expect(JSON.parse(calls[0].data).expectedRevisionId).toBe('revision-1')
  expect(JSON.parse(calls[1].data).contentHash).toBe('hash')
  expect(calls[2].responseType).toBe('blob')
  expect(calls[2].headers.Authorization).toStartWith('Bearer ')
})

test('reporting and settings clients retain envelopes and query parameters', async () => {
  apiService.client.defaults.adapter = async (config) => {
    if (config.url === '/jobs') {
      expect(config.params).toEqual({ page: 2, q: 'a+b & c' })
      return response(config, { data: [{ id: 'job-1' }], meta: { total: 21 } })
    }
    return response(config, { data: { dispatchEnabled: false } })
  }
  expect((await reportingService.list('jobs', { page: 2, q: 'a+b & c' })).meta.total).toBe(21)
  expect((await settingsService.settings()).data.dispatchEnabled).toBe(false)
})

test('all JSON feature clients return the same ApiResponse envelope as user', async () => {
  const envelope = { status: 'success', message: 'Success', data: { id: 'id' } }
  apiService.client.defaults.adapter = async config => response(config, envelope)
  const results = await Promise.all([
    batchService.limits(),
    batchService.batch({}, 'batch-key'),
    batchService.upload('batch', new File(['x'], 'image.png'), () => {}),
    jobService.details('job'),
    jobService.process('batch', ['feed'], 'process-key'),
    jobService.retry('job', 'retry-key'),
    draftService.edit('draft', {}),
    draftService.reject('draft', {}),
    mediaService.archive('asset'),
    settingsService.settings(),
    settingsService.updateSettings(false),
    reportingService.overview(30)
  ])
  for (const result of results) {
    expect(result).toEqual(envelope)
  }
})

test('content tab counts include all dates when no period is selected', async () => {
  apiService.client.defaults.adapter = async (config) => {
    expect(config.url).toBe('/content/counts')
    expect(config.params).toEqual({})
    return response(config, { data: { QUEUED: 2, READY_FOR_REVIEW: 0, PUBLISH: 4 } })
  }
  expect((await reportingService.contentCounts()).data.PUBLISH).toBe(4)
})

test('progressive media requests authenticated URLs rather than downloading the full image first', async () => {
  apiService.client.defaults.adapter = async (config) => {
    expect(config.url).toBe('/assets/asset-1/previews')
    expect(config.responseType).not.toBe('blob')
    return response(config, {
      data: {
        previewUrl: 'https://storage.test/preview',
        thumbnailUrl: 'https://storage.test/thumbnail'
      }
    })
  }
  expect((await mediaService.previews('asset-1')).data.thumbnailUrl).toContain('/thumbnail')
})
