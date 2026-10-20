<template>
  <section class="space-y-4">
    <div>
      <h2 class="text-base font-semibold text-highlighted">
        {{ $t('pages.publishing.accountsTitle') }}
      </h2>
      <p class="mt-1 text-sm text-muted">
        {{ $t('pages.publishing.accountsHint') }}
      </p>
    </div>
    <USkeleton
      v-if="loading"
      class="h-32 w-full"
    />
    <p
      v-else-if="failed"
      class="text-sm text-error"
    >
      {{ $t('components.requestState.failed') }}
    </p>
    <UCard v-else>
      <p
        v-if="!accounts.length"
        class="text-sm text-muted"
      >
        {{ $t('pages.publishing.noAccounts') }}
      </p>
      <div
        v-else
        class="divide-y divide-default"
      >
        <div
          v-for="account in accounts"
          :key="account.key"
          class="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
        >
          <div class="flex items-center gap-3 min-w-0">
            <UAvatar
              icon="i-lucide-instagram"
              :alt="account.label"
            />
            <div class="min-w-0">
              <p class="text-sm font-medium text-highlighted">
                {{ account.label }}
              </p>
              <p class="text-xs text-muted break-all">
                {{
                  usernames[account.key]
                    ? `@${usernames[account.key]}`
                    : account.instagramUserId || account.key
                }}
              </p>
              <p
                v-if="account.tokenExpiresAt"
                class="text-xs text-muted mt-1"
              >
                {{
                  $t('pages.publishing.tokenExpiry', {
                    date: formatContentDate(account.tokenExpiresAt, locale)
                  })
                }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <UBadge
              :color="
                account.expired
                  ? 'error'
                  : account.enabled && account.configured
                    ? 'primary'
                    : 'neutral'
              "
              variant="subtle"
            >
              {{
                $t(
                  account.expired
                    ? 'pages.publishing.expired'
                    : !account.enabled
                      ? 'pages.publishing.disabled'
                      : account.configured
                        ? 'pages.publishing.configured'
                        : 'pages.publishing.notConfigured'
                )
              }}
            </UBadge>
            <UButton
              size="sm"
              color="neutral"
              variant="soft"
              :loading="checking === account.key"
              :disabled="!!checking || !account.enabled || !account.configured || account.expired"
              @click="verify(account.key)"
            >
              {{ $t('pages.publishing.verify') }}
            </UButton>
          </div>
        </div>
      </div>
    </UCard>
  </section>
</template>

<script setup lang="ts">
import { instagramService } from '~/services/instagram/instagram-service'
import { formatContentDate } from '~/util/content'
import type { InstagramAccount } from '~/types/publishing'

const { t, locale } = useI18n()
const toast = useToast()
const handleError = useServiceError()
const accounts = ref<InstagramAccount[]>([])
const usernames = ref<Record<string, string>>({})
const checking = ref('')
const { loading, failed, load } = useLatestRequest(
  () => instagramService.accounts(),
  (response) => {
    accounts.value = response.data
  }
)
onMounted(load)

async function verify(key: string) {
  checking.value = key
  try {
    usernames.value[key] = (await instagramService.verify(key)).data.username
    toast.add({ title: t('pages.publishing.verified'), color: 'success' })
  } catch (error) {
    handleError(error)
  } finally {
    checking.value = ''
  }
}
</script>
