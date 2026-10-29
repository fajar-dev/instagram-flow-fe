<template>
  <UPopover
    v-model:open="open"
    v-bind="popoverProps"
  >
    <!-- Trigger: use slot or default avatar/button -->
    <slot
      :open="open"
      :user="authState.user"
    >
      <UButton
        v-if="showDetails"
        variant="ghost"
        :aria-label="$t('components.userPopover.profile')"
      >
        <UAvatar
          :src="authState.user?.photo ?? undefined"
          :alt="authState.user?.name"
          size="md"
          class="shrink-0"
        />
        <div class="flex flex-col min-w-0 text-left pr-0.5">
          <span
            class="text-xs font-semibold text-highlighted truncate max-w-[160px] 2xl:max-w-[240px] leading-tight"
          >
            {{ authState.user?.name || $t('components.userPopover.profile') }}
          </span>
          <span
            v-if="authState.user?.email"
            class="text-[11px] text-muted truncate max-w-[160px] 2xl:max-w-[220px] leading-tight"
          >
            {{ authState.user.email }}
          </span>
        </div>
      </UButton>

      <UButton
        v-else
        color="neutral"
        variant="ghost"
        class="rounded-full p-1 cursor-pointer"
        :aria-label="$t('components.userPopover.profile')"
      >
        <UAvatar
          :src="authState.user?.photo ?? undefined"
          :alt="authState.user?.name"
          size="lg"
        />
      </UButton>
    </slot>

    <template #content>
      <div class="p-2 w-48 space-y-1.5 select-none">
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
import { useAuth } from '~/composables/auth/useAuth'

const open = ref(false)
const handleServiceError = useServiceError()
const { state: authState, service: authService } = useAuth()
const toast = useToast()
const { t } = useI18n()

interface Props {
  popoverProps?: Record<string, unknown>
  showDetails?: boolean
}

withDefaults(defineProps<Props>(), {
  popoverProps: () => ({
    content: { side: 'bottom', sideOffset: 8, align: 'end' }
  }),
  showDetails: true
})

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
