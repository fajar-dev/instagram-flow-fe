/** Match route boundaries and prefer a more specific menu over its ancestor. */
export function isNavigationActive(path: string, target: string, targets: string[]): boolean {
  if (!target || target === '#') {
    return false
  }
  if (path === target) {
    return true
  }
  if (target === '/' || !path.startsWith(`${target}/`)) {
    return false
  }
  return !targets.some(
    other =>
      other !== target
      && other.startsWith(`${target}/`)
      && (path === other || path.startsWith(`${other}/`))
  )
}
