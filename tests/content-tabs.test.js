import { expect, test } from 'bun:test'
import { contentTabs, resolveContentTab } from '../app/util/content-tabs'

test('content tabs distinguish job lifecycle from current draft review status', () => {
  expect(resolveContentTab('PROCESSING').resource).toBe('jobs')
  expect(resolveContentTab('FAILED').resource).toBe('jobs')
  for (const status of ['READY_FOR_REVIEW', 'PUBLISH', 'REJECTED']) {
    expect(resolveContentTab(status)).toEqual({ value: status, resource: 'review' })
  }
  expect(new Set(contentTabs.map(tab => tab.value)).size).toBe(contentTabs.length)
})

test('invalid or repeated status query parameters use the ready-for-review tab', () => {
  for (const value of [undefined, 'UNKNOWN', ['FAILED', 'PUBLISH']]) {
    expect(resolveContentTab(value).value).toBe('READY_FOR_REVIEW')
  }
})
