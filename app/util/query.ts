import type { SortOrder } from '../types/query'

interface ListQueryOptions {
  page?: number
  perPage?: number
  q?: string
  sortBy?: string
  order?: SortOrder
}

/** Return mutable parameters so services can add feature-specific filters. */
export function buildListQuery({ page = 1, perPage = 10, q = '', sortBy = '', order = 'DESC' }: ListQueryOptions = {}): URLSearchParams {
  const params = new URLSearchParams({ page: String(page), limit: String(perPage), q })
  if (sortBy) {
    params.set('sortBy', sortBy)
    params.set('order', order)
  }
  return params
}

/** Reject duplicate/array parameters instead of silently picking a value. */
export function getQueryString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}
