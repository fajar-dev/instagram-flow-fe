<template>
  <UDropdownMenu
    :items="langMenuItems"
    :content="{ align: 'end' }"
  >
    <UButton
      color="neutral"
      :variant="variant"
      :icon="currentLocaleFlag"
      :aria-label="$t('components.languageSwitcher.ariaLabel')"
    />

    <template #item-trailing="{ item }">
      <UIcon
        v-if="item.active"
        name="i-lucide-check"
        class="size-4 text-primary shrink-0"
      />
    </template>
  </UDropdownMenu>
</template>

<script setup lang="ts">
import { getLocaleFlag, localeOptions } from '~/util/locale'
import type { ButtonProps } from '@nuxt/ui'

interface Props {
  variant?: ButtonProps['variant']
}

withDefaults(defineProps<Props>(), {
  variant: 'ghost'
})

const { locale, setLocale } = useI18n()

const currentLocaleFlag = computed(() => getLocaleFlag(locale.value))

const langMenuItems = computed(() =>
  localeOptions.map(opt => ({
    label: opt.label,
    active: locale.value === opt.value,
    icon: opt.flag,
    onSelect: () => setLocale(opt.value)
  }))
)
</script>
