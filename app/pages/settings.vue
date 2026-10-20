<template>
  <div class="space-y-6">
    <Header
      :title="$t('pages.integration.settings')"
      :description="$t('pages.integration.settingsHint')"
    />
    <div class="w-full max-w-3xl space-y-8">
      <SettingsDispatcherPanel />
      <SettingsInstagramAccounts />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
</script>
