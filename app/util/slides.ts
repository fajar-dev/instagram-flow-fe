import type { AiResult, Render } from '../types/ai-job'

/** Rank without mutating API data; missing scores follow scored photos, ties keep source order. */
export function rankSlides(renders: Render[], rankings: AiResult['rankings']): Render[] {
  const scores = new Map(rankings.map(item => [item.assetId, item.score]))
  return [...renders].sort((a, b) => (scores.get(b.assetId) ?? -1) - (scores.get(a.assetId) ?? -1))
}

/** Move an existing selected slide without changing membership. */
export function moveSlide(ids: string[], id: string, target: number): string[] {
  const from = ids.indexOf(id)
  if (from < 0 || target < 0 || target >= ids.length || from === target) {
    return ids
  }
  const next = [...ids]
  next.splice(from, 1)
  next.splice(target, 0, id)
  return next
}
