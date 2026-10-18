<template>
  <div class="space-y-6">
    <Header
      :title="$t('pages.profile.index.title')"
      :description="$t('pages.profile.index.description')"
    >
      <template #tabs>
        <HeaderTab
          to="/profile/information"
          :label="$t('pages.profile.index.tabInformation')"
          :active="$route.path === '/profile/information' || $route.path === '/profile'"
        />
        <HeaderTab
          to="/profile/password"
          :label="$t('pages.profile.index.tabPassword')"
          :active="$route.path === '/profile/password'"
        />
      </template>
    </Header>

    <div class="max-w-2xl bg-default border border-default rounded-lg">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: [
    (to) => {
      if (to.path === '/profile' || to.path === '/profile/') {
        return navigateTo('/profile/information', { replace: true })
      }
    }
  ]
})
</script>
