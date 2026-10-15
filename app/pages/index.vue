<template>
  <div class="space-y-6">
    <!-- Dashboard Header -->
    <Header
      :title="$t('pages.dashboard.title')"
      :description="$t('pages.dashboard.description')"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})
</script>
