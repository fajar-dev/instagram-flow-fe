import { expect, test } from 'bun:test'
import { latestRejection } from '../app/util/rejection'

const rejection = (id, createdAt) => ({
  id,
  createdAt,
  notes: id
})
const detail = {
  draft: { decisionStatus: 'REJECTED' },
  rejections: [
    rejection('latest', '2026-10-19T10:00:00Z'),
    rejection('old', '2026-10-19T09:00:00Z')
  ]
}

test('rejection notice selects latest relevant decision without mutating audit history', () => {
  expect(latestRejection(detail)?.id).toBe('latest')
  expect(detail.rejections.map(item => item.id)).toEqual(['latest', 'old'])
})

test('ready, published and cancelled-without-rejection content do not inherit old rejection notes', () => {
  for (const decisionStatus of ['READY_FOR_REVIEW', 'PUBLISH']) {
    expect(latestRejection({ ...detail, draft: { decisionStatus } })).toBeNull()
  }
  expect(latestRejection({ ...detail, rejections: [] })).toBeNull()
})
