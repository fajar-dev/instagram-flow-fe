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
