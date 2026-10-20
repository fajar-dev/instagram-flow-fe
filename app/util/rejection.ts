import type { JobDetails } from '~/types/ai-job'

/** Ignore legacy decisions and notes for superseded revisions. */
export function latestRejection(detail: JobDetails) {
  if (detail.draft?.reviewStatus !== 'REJECTED') {
    return null
  }
  return detail.reviews
    .filter(review => review.decision === 'REJECTED' && review.revisionId === detail.revision?.id)
    .reduce<JobDetails['reviews'][number] | null>(
      (latest, review) =>
        !latest || Date.parse(review.createdAt) > Date.parse(latest.createdAt) ? review : latest,
      null
    )
}
