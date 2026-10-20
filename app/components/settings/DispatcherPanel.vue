<template>
  <div class="min-w-0 space-y-4">
    <div class="space-y-1">
      <h2 class="text-base font-semibold text-highlighted">
        {{ $t('pages.integration.dispatcher') }}
      </h2>
      <p class="text-sm text-muted">
        {{ $t('pages.integration.dispatcherHint') }}
      </p>
    </div>
    <USkeleton
      v-if="loading"
      class="h-64 w-full"
    />
    <p
      v-else-if="failed"
      class="text-sm text-muted"
    >
      {{ $t('components.requestState.failed') }}
    </p>
    <div
      v-else-if="settings"
      class="space-y-4"
    >
      <p
        v-if="!settings.ready"
        class="text-sm text-muted"
      >
        {{ $t('pages.integration.notReady') }}
      </p>
      <UCard>
        <dl class="grid grid-cols-1 gap-5 text-sm sm:grid-cols-3">
          <div
            v-for="key in flags"
            :key="key"
          >
            <dt class="text-muted">
              {{ $t(`pages.integration.settingsFields.${key}`) }}
            </dt>
            <dd class="mt-1 font-medium text-highlighted">
              {{
                $t(
                  settings[key] ? 'pages.integration.configured' : 'pages.integration.notConfigured'
                )
              }}
            </dd>
          </div>
        </dl>
        <div
          class="mt-6 flex flex-col gap-4 border-t border-default pt-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <USwitch
            v-model="enabled"
            :label="$t('pages.integration.enableDispatch')"
            :disabled="saving || (!settings.ready && !enabled)"
          />
          <UButton
            class="self-start sm:self-auto"
            icon="i-lucide-save"
            :disabled="saving || enabled === settings.dispatchEnabled"
            :loading="saving"
            @click="save"
          >
            {{ $t('pages.content.save') }}
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { settingsService } from '~/services/integration/settings-service'
import type { Settings } from '~/types/integration'

const handleError = useServiceError()
const { t } = useI18n()
const toast = useToast()
const settings = ref<Settings | null>(null)
const enabled = ref(false)
const saving = ref(false)
const flags = ['webhookConfigured', 'serviceConfigured', 'storageConfigured'] as const
const { loading, failed, load } = useLatestRequest(
  () => settingsService.settings(),
  (response) => {
    settings.value = response.data
    enabled.value = response.data.dispatchEnabled
  }
)
onMounted(() => {
  load()
})

async function save() {
  if (saving.value) {
    return
  }
  saving.value = true
  try {
    settings.value = (await settingsService.updateSettings(enabled.value)).data
    enabled.value = settings.value.dispatchEnabled
    toast.add({ title: t('pages.content.saved'), color: 'success' })
  } catch (error) {
    handleError(error)
  } finally {
    saving.value = false
  }
}
</script>
