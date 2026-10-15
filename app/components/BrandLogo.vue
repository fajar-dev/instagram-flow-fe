<template>
  <div class="flex items-center gap-3">
    <NuxtLink
      :to="to"
      class="flex items-center gap-2.5"
    >
      <img
        src="/logo.png"
        alt="logo"
        class="h-12 w-auto dark:hidden"
      >
      <img
        src="/logo-light.png"
        alt="logo"
        class="h-12 w-auto hidden dark:block"
      >
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  isCollapsed?: boolean
  to?: string
}>(), {
  to: '/'
})
</script>
