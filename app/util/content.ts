import { formatDateTime } from './date'

export function formatContentDate(value: string | null | undefined, locale: string) {
  return formatDateTime(value, locale, { timeZone: 'Asia/Jakarta' })
}
export function parseHashtags(value: string): string[] {
  return [...new Set(value.split(/[\s,]+/).map(tag => tag.trim()).filter(Boolean))]
}
export function formatFileSize(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`
}
