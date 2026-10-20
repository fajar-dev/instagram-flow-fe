import type { JobDetails } from '~/types/ai-job'

/** Return the latest rejection for this content. */
export function latestRejection(detail: JobDetails) {
  if (detail.draft?.reviewStatus !== 'REJECTED') {
    return null
  }
  return detail.reviews
    .filter(review => review.decision === 'REJECTED')
    .reduce<JobDetails['reviews'][number] | null>(
      (latest, review) =>
        !latest || Date.parse(review.createdAt) > Date.parse(latest.createdAt) ? review : latest,
      null
    )
}
