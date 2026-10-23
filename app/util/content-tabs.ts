import { getQueryString } from './query'

/** Processing belongs to jobs; decision status belongs to the resulting draft. */
export const contentTabs = [
  { value: 'QUEUED', resource: 'jobs' },
  { value: 'DISPATCHED', resource: 'jobs' },
  { value: 'PROCESSING', resource: 'jobs' },
  { value: 'READY_FOR_REVIEW', resource: 'drafts' },
  { value: 'PUBLISH', resource: 'drafts' },
  { value: 'REJECTED', resource: 'drafts' },
  { value: 'FAILED', resource: 'jobs' }
] as const

export function resolveContentTab(value: unknown) {
  return contentTabs.find(tab => tab.value === getQueryString(value)) || contentTabs[3]
}
