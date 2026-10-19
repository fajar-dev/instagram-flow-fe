<template>
  <nav
    :aria-label="$t('components.mobileNavbar.label')"
    class="relative z-10 shrink-0 border-t border-default bg-default lg:hidden"
    :style="{ paddingBottom: 'env(safe-area-inset-bottom)' }"
  >
    <div class="grid grid-cols-5 items-center gap-1 px-2 py-2">
      <template
        v-for="item in mobileItems"
        :key="item.id"
      >
        <div
          v-if="item.id === 'upload'"
          class="mx-auto flex size-14 -translate-y-5 items-center justify-center rounded-full bg-default"
        >
          <UButton
            :to="item.to"
            :icon="item.icon"
            :aria-label="item.label"
            :aria-current="isItemActive(item) ? 'page' : undefined"
            class="size-12 justify-center rounded-full shadow-sm"
            :class="{ 'ring-2 ring-primary ring-offset-2 ring-offset-default': isItemActive(item) }"
            :ui="{ leadingIcon: 'size-6' }"
          />
        </div>
        <UButton
          v-else
          :to="item.to"
          color="neutral"
          variant="ghost"
          :aria-current="isItemActive(item) ? 'page' : undefined"
          class="min-h-14 min-w-0 flex-col justify-center gap-1 rounded-lg px-1 py-2 text-xs font-medium"
          :class="isItemActive(item) ? 'text-primary bg-primary/10' : 'text-muted'"
        >
          <UIcon
            v-if="item.icon"
            :name="item.icon"
            class="size-5 shrink-0"
          />
          <span class="max-w-full truncate">{{ item.label }}</span>
        </UButton>
      </template>
      <MobileUtilitySidebar />
    </div>
  </nav>
</template>

<script setup lang="ts">
const { mobileItems, isItemActive } = useNavigation()
</script>
