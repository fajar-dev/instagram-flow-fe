import type { JobDetails } from '~/types/ai-job'

/** Return the latest rejection for this content. */
export function latestRejection(detail: JobDetails) {
  if (detail.draft?.decisionStatus !== 'REJECTED') {
    return null
  }
  return detail.rejections.reduce<JobDetails['rejections'][number] | null>(
    (latest, rejection) =>
      !latest || Date.parse(rejection.createdAt) > Date.parse(latest.createdAt)
        ? rejection
        : latest,
    null
  )
}
