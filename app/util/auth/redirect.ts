const appOrigin = 'https://ig-flow.invalid'

/** Only internal, non-auth destinations may be restored after sign-in. */
export function resolveAuthRedirect(value: unknown): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
    return '/'
  }
  try {
    const path = value.split(/[?#]/, 1)[0]!
    const decodedPath = decodeURIComponent(path)
    const hasUnsafeCharacters = [...value, ...decodedPath].some(
      character =>
        character === '\\' || character.charCodeAt(0) <= 32 || character.charCodeAt(0) === 127
    )
    if (hasUnsafeCharacters) {
      return '/'
    }
    const normalized = new URL(decodedPath, appOrigin)
    const destination = new URL(value, appOrigin)
    if (
      normalized.origin !== appOrigin
      || destination.origin !== appOrigin
      || /^\/auth(?:\/|$)/i.test(normalized.pathname)
    ) {
      return '/'
    }
    return destination.pathname + destination.search + destination.hash
  } catch {
    return '/'
  }
}

export function signInLocation(fullPath: string) {
  return {
    path: '/auth/sign-in',
    query: { redirect: resolveAuthRedirect(fullPath) }
  }
}
