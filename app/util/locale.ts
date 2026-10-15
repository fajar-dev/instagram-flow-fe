export const localeOptions = [
  { label: 'English', value: 'en', flag: 'circle-flags:us' },
  { label: 'Bahasa Indonesia', value: 'id', flag: 'circle-flags:id' }
] as const

export function getLocaleFlag(locale: string): string {
  return localeOptions.find(option => option.value === locale)?.flag ?? 'circle-flags:us'
}
