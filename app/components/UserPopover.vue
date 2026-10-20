<template>
  <UPopover
    v-model:open="open"
    v-bind="popoverProps"
  >
    <!-- Trigger: use slot or default avatar -->
    <slot>
      <UButton
        color="neutral"
        variant="ghost"
        class="rounded-full p-1"
        :aria-label="$t('components.sidebar.settings')"
      >
        <UAvatar
          :src="authState.user?.photo ?? undefined"
          :alt="authState.user?.name"
          size="lg"
        />
      </UButton>
    </slot>

    <template #content>
      <div class="p-2 w-56 space-y-1.5 select-none">
        <!-- User Info -->
        <div class="flex items-center gap-3 p-1.5">
          <UAvatar
            :src="authState.user?.photo ?? undefined"
            :alt="authState.user?.name"
            size="lg"
          />
          <div class="min-w-0 flex-1">
            <h2 class="text-sm font-semibold truncate text-highlighted">
              {{ authState.user?.name }}
            </h2>
            <p class="text-xs text-muted truncate">
              {{ authState.user?.email }}
            </p>
          </div>
        </div>

        <USeparator />

        <!-- Settings Items -->
        <div class="space-y-0.5">
          <UButton
            to="/profile/information"
            color="neutral"
            variant="ghost"
            icon="i-lucide-user-round"
            class="w-full justify-start"
            @click="
              () => {
                open = false
              }
            "
          >
            {{ $t('components.userPopover.profile') }}
          </UButton>
          <!-- Theme Dropdown Menu -->
          <UDropdownMenu
            :items="themeMenuItems"
            :content="{ side: 'right', sideOffset: 15 }"
          >
            <UButton
              color="neutral"
              variant="ghost"
              :icon="currentThemeIcon"
              class="w-full justify-start cursor-pointer"
            >
              {{ $t('components.userPopover.theme') }}
            </UButton>

            <template #item-trailing="{ item }">
              <UIcon
                v-if="item.active"
                name="i-lucide-check"
                class="size-4 text-primary shrink-0"
              />
            </template>
          </UDropdownMenu>

          <!-- Language Dropdown Menu -->
          <UDropdownMenu
            :items="langMenuItems"
            :content="{ side: 'right', sideOffset: 15 }"
          >
            <UButton
              color="neutral"
              variant="ghost"
              :icon="currentLocaleFlag"
              class="w-full justify-start cursor-pointer"
            >
              {{ $t('components.userPopover.language') }}
            </UButton>

            <template #item-trailing="{ item }">
              <UIcon
                v-if="item.active"
                name="i-lucide-check"
                class="size-4 text-primary shrink-0"
              />
            </template>
          </UDropdownMenu>
        </div>

        <USeparator />

        <!-- Logout Action -->
        <div>
          <UButton
            color="error"
            variant="ghost"
            icon="i-lucide-log-out"
            class="w-full justify-start cursor-pointer"
            @click="handleLogout"
          >
            {{ $t('components.userPopover.logout') }}
          </UButton>
        </div>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { getLocaleFlag, localeOptions } from '~/util/locale'

const open = ref(false)
const handleServiceError = useServiceError()
const { state: authState, service: authService } = useAuth()
const toast = useToast()
const colorMode = useColorMode()
const { locale, setLocale, t } = useI18n()

interface Props {
  popoverProps?: Record<string, unknown>
}

withDefaults(defineProps<Props>(), {
  popoverProps: () => ({})
})

const themeOptions = [
  { label: 'Light', value: 'light', icon: 'i-lucide-sun' },
  { label: 'Dark', value: 'dark', icon: 'i-lucide-moon' },
  { label: 'System', value: 'system', icon: 'i-lucide-laptop' }
]

const currentThemeIcon = computed(() => {
  if (colorMode.value === 'dark') {
    return 'i-lucide-moon'
  }
  return 'i-lucide-sun'
})

const themeMenuItems = computed(() =>
  themeOptions.map(opt => ({
    label: opt.label,
    icon: opt.icon,
    active: colorMode.preference === opt.value,
    onSelect: () => {
      colorMode.preference = opt.value
    }
  }))
)

const currentLocaleFlag = computed(() => getLocaleFlag(locale.value))

const langMenuItems = computed(() =>
  localeOptions.map(opt => ({
    label: opt.label,
    icon: opt.flag,
    active: locale.value === opt.value,
    onSelect: () => {
      setLocale(opt.value)
    }
  }))
)

const handleLogout = async () => {
  try {
    await authService.logout()
  } catch (error) {
    handleServiceError(error)
  } finally {
    await navigateTo('/auth/sign-in')
  }
  toast.add({
    title: t('components.userPopover.logoutSuccess'),
    icon: 'i-lucide-circle-check'
  })
}
</script>
