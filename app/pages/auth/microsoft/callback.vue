<script setup lang="ts">
definePageMeta({ layout: false })

const delivered = ref(false)

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  window.history.replaceState({}, '', window.location.pathname)
  if (!window.opener) {
    return
  }
  window.opener.postMessage(
    {
      type: 'microsoft-auth',
      state: params.get('state'),
      code: params.get('code'),
      error: params.get('error')
    },
    window.location.origin
  )
  delivered.value = true
})
</script>

<template>
  <main class="flex min-h-screen items-center justify-center p-6 text-center">
    <p class="text-muted">
      {{ $t(delivered ? 'pages.auth.signIn.processing' : 'pages.auth.signIn.popupExpired') }}
    </p>
  </main>
</template>
