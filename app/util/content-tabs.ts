import { getQueryString } from './query'

/** Processing belongs to jobs; review status belongs to the resulting draft. */
export const contentTabs = [
  { value: 'QUEUED', resource: 'jobs' },
  { value: 'DISPATCHED', resource: 'jobs' },
  { value: 'PROCESSING', resource: 'jobs' },
  { value: 'READY_FOR_REVIEW', resource: 'review' },
  { value: 'IN_REVIEW', resource: 'review' },
  { value: 'REVISION_REQUESTED', resource: 'review' },
  { value: 'APPROVED_INTERNAL', resource: 'review' },
  { value: 'REJECTED', resource: 'review' },
  { value: 'FAILED', resource: 'jobs' }
] as const

export function resolveContentTab(value: unknown) {
  return contentTabs.find(tab => tab.value === getQueryString(value)) || contentTabs[3]
}
