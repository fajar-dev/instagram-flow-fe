export type LogoVariant = 'icon' | 'full'

export type LogoColorMode = 'auto' | 'light' | 'dark'

export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string

export function resolveLogoVariant(variant?: LogoVariant, isCollapsed?: boolean): LogoVariant {
  if (variant) {
    return variant
  }
  if (isCollapsed !== undefined) {
    return isCollapsed ? 'icon' : 'full'
  }
  return 'icon'
}

export function getLogoSources(variant: LogoVariant) {
  if (variant === 'full') {
    return {
      light: '/logo-full.png',
      dark: '/logo-full-light.png'
    }
  }
  return {
    light: '/logo.png',
    dark: '/logo-light.png'
  }
}

export function getLogoSizeClass(size: LogoSize = 'md', variant: LogoVariant = 'icon'): string {
  const isFull = variant === 'full'
  switch (size) {
    case 'xs':
      return isFull ? 'h-5' : 'h-6'
    case 'sm':
      return isFull ? 'h-7' : 'h-8'
    case 'md':
      return isFull ? 'h-9' : 'h-12'
    case 'lg':
      return isFull ? 'h-12' : 'h-14'
    case 'xl':
      return isFull ? 'h-16' : 'h-18'
    default:
      return size || (isFull ? 'h-9' : 'h-12')
  }
}
