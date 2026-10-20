import { expect, test } from 'bun:test'
import { latestRejection } from '../app/util/rejection'

const review = (id, decision, revisionId, createdAt) => ({
  id,
  decision,
  revisionId,
  createdAt,
  notes: id
})
const detail = {
  draft: { reviewStatus: 'REJECTED' },
  revision: { id: 'current' },
  reviews: [
    review('latest', 'REJECTED', 'current', '2026-10-19T10:00:00Z'),
    review('old', 'REJECTED', 'current', '2026-10-19T09:00:00Z'),
    review('legacy', 'READY_FOR_REVIEW', 'current', '2026-10-19T11:00:00Z'),
    review('superseded', 'REJECTED', 'previous', '2026-10-19T12:00:00Z')
  ]
}

test('rejection notice selects latest relevant decision without mutating audit history', () => {
  expect(latestRejection(detail)?.id).toBe('latest')
  expect(detail.reviews.map(item => item.id)).toEqual(['latest', 'old', 'legacy', 'superseded'])
})

test('ready, published and cancelled-without-review content do not inherit old rejection notes', () => {
  for (const reviewStatus of ['READY_FOR_REVIEW', 'PUBLISH']) {
    expect(latestRejection({ ...detail, draft: { reviewStatus } })).toBeNull()
  }
  expect(latestRejection({ ...detail, reviews: [] })).toBeNull()
})
