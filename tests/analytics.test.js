import { expect, test } from 'bun:test'
import { ref, computed, watch, nextTick } from 'vue'
import { useTopPosts } from '../app/composables/analytics/useTopPosts'
import { analyticsService } from '../app/services/analytics/analytics-service'
import { formatMetric, formatRate } from '../app/util/number'

test('metrics distinguish missing values from zero', () => {
  expect(formatMetric(null, 'en')).toBe('—')
  expect(formatMetric(0, 'en')).toBe('0')
  expect(formatMetric(1200, 'en')).toBe('1,200')
})

test('all pages load and account changes discard late results', async () => {
  const cleanup = []
  const replacements = {
    ref,
    computed,
    watch,
    onUnmounted: cb => cleanup.push(cb),
    useServiceError: () => (error) => {
      throw error
    }
  }
  const previous = Object.fromEntries(
    Object.keys(replacements).map(key => [key, globalThis[key]])
  )
  const original = analyticsService.topPosts
  Object.assign(globalThis, replacements)
  let resolveOld
  const item = (id, value) => ({
    media: { id, timestamp: '' },
    metrics: [{ name: 'total_interactions', value }]
  })
  analyticsService.topPosts = async (key, after) => {
    if (key === 'one' && after) {
      return new Promise((resolve) => {
        resolveOld = resolve
      })
    }
    return { data: { items: [item(key, 1)], after: key === 'one' ? 'next' : null } }
  }
  try {
    const account = ref('one')
    const state = useTopPosts(() => account.value)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(state.posts.value[0].media.id).toBe('one')
    account.value = 'two'
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
    resolveOld({ data: { items: [item('stale', 99)], after: null } })
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(state.posts.value.map(row => row.media.id)).toEqual(['two'])
    expect(state.loading.value).toBe(false)
    expect(state.failed.value).toBe(false)
    analyticsService.topPosts = async (_key, after) => ({
      data: {
        items: after ? [item('low', 1), item('high', 9), item('missing', null)] : [item('low', 1)],
        after: after ? null : 'page-two'
      }
    })
    account.value = 'three'
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(state.posts.value.map(row => row.media.id)).toEqual(['high', 'low', 'missing'])
    expect(state.loading.value).toBe(false)
  } finally {
    cleanup.forEach(cb => cb())
    analyticsService.topPosts = original
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete globalThis[key]
      } else {
        globalThis[key] = value
      }
    }
  }
})

test('engagement rate formatting preserves zero and distinguishes missing data', () => {
  expect(formatRate(null, 'en')).toBe('—')
  expect(formatRate(0, 'en')).toBe('0%')
  expect(formatRate(12.34, 'en')).toBe('12.34%')
  expect(formatRate(150, 'en')).toBe('150%')
})

test('radar uses shared scales per spoke and does not turn missing values into zero', async () => {
  const { radarMetrics } = await import('../app/util/analytics')
  const report = {
    engagementRate: 10,
    metrics: [
      { name: 'reach', value: 1000 },
      { name: 'likes', value: 0 },
      { name: 'comments', value: null }
    ],
    previous: {
      engagementRate: 20,
      metrics: [
        { name: 'reach', value: 500 },
        { name: 'likes', value: 0 },
        { name: 'comments', value: 2 }
      ]
    }
  }
  expect(radarMetrics(report)).toEqual([
    { name: 'reach', current: 100, previous: 50 },
    { name: 'likes', current: 0, previous: 0 },
    { name: 'engagementRate', current: 50, previous: 100 }
  ])
  expect(radarMetrics({ ...report, previous: undefined })).toEqual([])
})

test('metric trends distinguish changes, zero baselines, missing data and rate points', async () => {
  const { metricTrend } = await import('../app/util/analytics')
  expect(metricTrend(1, 3).direction).toBe('down')
  expect(metricTrend(1, 3).value).toBeCloseTo(66.6667, 3)
  expect(metricTrend(15, 10)).toEqual({ direction: 'up', value: 50 })
  expect(metricTrend(0, 0)).toEqual({ direction: 'flat', value: 0 })
  expect(metricTrend(5, 0)).toEqual({ direction: 'up', value: null })
  expect(metricTrend(0, 5)).toEqual({ direction: 'down', value: 100 })
  expect(metricTrend(null, 5)).toEqual({ direction: 'unavailable', value: null })
  expect(metricTrend(5, null)).toEqual({ direction: 'unavailable', value: null })
  expect(metricTrend(15, 10, true)).toEqual({ direction: 'up', value: 5 })
})
