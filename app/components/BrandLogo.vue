<template>
  <div class="inline-flex items-center">
    <NuxtLink
      v-if="to"
      :to="to"
      class="inline-flex items-center"
    >
      <!-- Auto Color Mode: Switch based on Tailwind dark mode -->
      <template v-if="resolvedColorMode === 'auto'">
        <img
          :src="sources.light"
          :alt="alt"
          :class="[sizeClass, 'w-auto object-contain dark:hidden', imageClass]"
        >
        <img
          :src="sources.dark"
          :alt="alt"
          :class="[sizeClass, 'w-auto object-contain hidden dark:block', imageClass]"
        >
      </template>

      <!-- Forced Light Logo (Dark graphics on light background) -->
      <img
        v-else-if="resolvedColorMode === 'light'"
        :src="sources.light"
        :alt="alt"
        :class="[sizeClass, 'w-auto object-contain', imageClass]"
      >

      <!-- Forced Dark Logo (White graphics on dark background) -->
      <img
        v-else-if="resolvedColorMode === 'dark'"
        :src="sources.dark"
        :alt="alt"
        :class="[sizeClass, 'w-auto object-contain', imageClass]"
      >
    </NuxtLink>

    <div
      v-else
      class="inline-flex items-center"
    >
      <template v-if="resolvedColorMode === 'auto'">
        <img
          :src="sources.light"
          :alt="alt"
          :class="[sizeClass, 'w-auto object-contain dark:hidden', imageClass]"
        >
        <img
          :src="sources.dark"
          :alt="alt"
          :class="[sizeClass, 'w-auto object-contain hidden dark:block', imageClass]"
        >
      </template>

      <img
        v-else-if="resolvedColorMode === 'light'"
        :src="sources.light"
        :alt="alt"
        :class="[sizeClass, 'w-auto object-contain', imageClass]"
      >

      <img
        v-else-if="resolvedColorMode === 'dark'"
        :src="sources.dark"
        :alt="alt"
        :class="[sizeClass, 'w-auto object-contain', imageClass]"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  type LogoColorMode,
  type LogoSize,
  type LogoVariant,
  getLogoSizeClass,
  getLogoSources,
  resolveLogoVariant
} from '~/util/logo'

interface Props {
  variant?: LogoVariant
  isCollapsed?: boolean
  colorMode?: LogoColorMode
  size?: LogoSize
  to?: string | null | false
  alt?: string
  imageClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: undefined,
  isCollapsed: undefined,
  colorMode: 'auto',
  size: 'md',
  to: '/',
  alt: 'AMTI',
  imageClass: ''
})

const resolvedVariant = computed<LogoVariant>(() =>
  resolveLogoVariant(props.variant, props.isCollapsed)
)

const resolvedColorMode = computed<LogoColorMode>(() => props.colorMode || 'auto')

const sources = computed(() => getLogoSources(resolvedVariant.value))

const sizeClass = computed(() => getLogoSizeClass(props.size, resolvedVariant.value))
</script>
