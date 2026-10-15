import axios from 'axios'

interface ApiError {
  message?: string
  errors?: { message: string }[]
}

// Capture UI dependencies during setup, before the first await in an event handler.
export function useServiceError() {
  const toast = useToast()
  const { t } = useI18n()
  return (error: unknown): void => {
    if (axios.isCancel(error)) return
    const data = axios.isAxiosError<ApiError>(error) ? error.response?.data : undefined
    const title = data?.message || t('components.errors.title')
    const description = Array.isArray(data?.errors)
      ? data.errors.map(item => item.message).join(', ')
      : data?.message ? undefined : t('components.errors.unexpected')
    toast.add({ title, description, icon: 'i-lucide-circle-x', color: 'error' })
  }
}
