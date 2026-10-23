export interface MicrosoftCode {
  code: string
  codeVerifier: string
}

export interface MicrosoftPopupOptions {
  clientId: string
  tenantId: string
  redirectUri: string
}

export type MicrosoftPopupError = 'popupBlocked' | 'popupClosed' | 'popupTimeout' | 'loginFailed'

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

export async function createMicrosoftAuthorization(options: MicrosoftPopupOptions) {
  const state = randomToken()
  const codeVerifier = randomToken()
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier))
  const challenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
  const params = new URLSearchParams({
    client_id: options.clientId,
    response_type: 'code',
    redirect_uri: options.redirectUri,
    response_mode: 'query',
    scope: 'openid profile email',
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    prompt: 'select_account'
  })
  return {
    state,
    codeVerifier,
    url: `https://login.microsoftonline.com/${encodeURIComponent(options.tenantId)}/oauth2/v2.0/authorize?${params}`
  }
}

export function readMicrosoftCallback(
  event: MessageEvent,
  popup: Window,
  state: string,
  origin: string
) {
  if (event.origin !== origin || event.source !== popup || event.data?.type !== 'microsoft-auth') {
    return null
  }
  if (event.data.state !== state) {
    return null
  }
  if (event.data.error || typeof event.data.code !== 'string' || !event.data.code) {
    throw new Error('loginFailed')
  }
  return event.data.code as string
}

/** Open synchronously from the click; keep the verifier only in the opener's memory. */
export function openMicrosoftPopup(options: MicrosoftPopupOptions) {
  const width = Math.min(520, window.outerWidth || 520)
  const height = Math.min(680, window.outerHeight || 680)
  const left = Math.round((window.screenX || 0) + ((window.outerWidth || width) - width) / 2)
  const top = Math.round((window.screenY || 0) + ((window.outerHeight || height) - height) / 2)
  const popup = window.open(
    'about:blank',
    '_blank',
    `popup,width=${width},height=${height},left=${left},top=${top}`
  )
  let cancel = () => {}
  const result = new Promise<MicrosoftCode>((resolve, reject) => {
    if (!popup) {
      reject(new Error('popupBlocked'))
      return
    }
    let settled = false
    let state = ''
    let codeVerifier = ''

    function finish(error?: MicrosoftPopupError, code?: string) {
      if (settled) {
        return
      }
      settled = true
      clearInterval(closedTimer)
      clearTimeout(timeout)
      window.removeEventListener('message', receive)
      popup?.close()
      if (error) {
        reject(new Error(error))
      } else {
        resolve({ code: code!, codeVerifier })
      }
    }

    function receive(event: MessageEvent) {
      try {
        const code = readMicrosoftCallback(event, popup!, state, window.location.origin)
        if (code) {
          finish(undefined, code)
        }
      } catch {
        finish('loginFailed')
      }
    }

    const closedTimer = setInterval(() => {
      if (popup.closed) {
        finish('popupClosed')
      }
    }, 500)
    const timeout = setTimeout(() => finish('popupTimeout'), 5 * 60 * 1000)
    cancel = () => finish('popupClosed')
    window.addEventListener('message', receive)
    void createMicrosoftAuthorization(options)
      .then((authorization) => {
        if (settled) {
          return
        }
        state = authorization.state
        codeVerifier = authorization.codeVerifier
        popup.location.replace(authorization.url)
      })
      .catch(() => finish('loginFailed'))
  })
  return { result, cancel: () => cancel() }
}
