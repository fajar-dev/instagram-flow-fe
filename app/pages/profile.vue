<template>
  <div class="space-y-6">
    <Header
      :title="$t('pages.profile.index.title')"
      :description="$t('pages.profile.index.description')"
    >
      <template #tabs>
        <NuxtLink
          to="/profile/information"
          class="pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer"
          :class="[
            $route.path === '/profile/information' || $route.path === '/profile'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-muted hover:text-highlighted'
          ]"
        >
          {{ $t('pages.profile.index.tabInformation') }}
        </NuxtLink>
        <NuxtLink
          to="/profile/password"
          class="pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer"
          :class="[
            $route.path === '/profile/password'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-muted hover:text-highlighted'
          ]"
        >
          {{ $t('pages.profile.index.tabPassword') }}
        </NuxtLink>
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
