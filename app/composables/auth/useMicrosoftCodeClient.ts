import { computed, onBeforeUnmount } from 'vue'
import { openMicrosoftPopup } from '../../util/auth/microsoft-popup'
import type { MicrosoftCode, MicrosoftPopupOptions } from '../../util/auth/microsoft-popup'

interface MicrosoftCodeClientOptions extends MicrosoftPopupOptions {
  onSuccess: (response: MicrosoftCode) => void | Promise<void>
  onError: (error: string) => void
}

export function useMicrosoftCodeClient(options: MicrosoftCodeClientOptions) {
  const isReady = computed(() => Boolean(options.clientId.trim()))
  let active: ReturnType<typeof openMicrosoftPopup> | null = null
  let disposed = false

  async function login() {
    if (!isReady.value || active || disposed) {
      return
    }
    try {
      if (new URL(options.redirectUri).origin !== window.location.origin) {
        throw new Error('loginFailed')
      }
      active = openMicrosoftPopup(options)
      const response = await active.result
      if (!disposed) {
        await options.onSuccess(response)
      }
    } catch (error) {
      if (!disposed) {
        options.onError(error instanceof Error ? error.message : 'loginFailed')
      }
    } finally {
      active = null
    }
  }

  onBeforeUnmount(() => {
    disposed = true
    active?.cancel()
  })

  return { isReady, login }
}
