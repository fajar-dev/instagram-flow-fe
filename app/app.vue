<template>
  <UApp :toaster="{ position: 'top-right', progress: false }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ImageLightbox />
  </UApp>
</template>

<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'manifest', href: '/manifest.webmanifest' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Instagram Flow - AMTI'
const description = 'Manage all your Instagram account efficiently with our platform'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})
</script>
