<template>
  <div class="space-y-6">
    <Header
      :title="$t('pages.integration.settings')"
      :description="$t('pages.integration.settingsHint')"
    />
    <USkeleton
      v-if="loading"
      class="h-64 w-full max-w-2xl"
    />
    <p
      v-else-if="failed"
      class="text-sm text-muted"
    >
      {{ $t('components.requestState.failed') }}
    </p>
    <div
      v-else-if="settings"
      class="max-w-2xl space-y-6"
    >
      <p
        v-if="!settings.ready"
        class="text-sm text-muted"
      >
        {{ $t('pages.integration.notReady') }}
      </p>
      <UCard>
        <dl class="grid sm:grid-cols-2 gap-4 text-sm">
          <div
            v-for="key in flags"
            :key="key"
          >
            <dt class="text-muted">
              {{ $t(`pages.integration.settingsFields.${key}`) }}
            </dt><dd class="mt-1 font-medium text-highlighted">
              {{ $t(settings[key] ? 'pages.integration.configured' : 'pages.integration.notConfigured') }}
            </dd>
          </div>
        </dl>
        <USwitch
          v-model="enabled"
          :label="$t('pages.integration.enableDispatch')"
          :disabled="saving || (!settings.ready && !enabled)"
          class="mt-6"
        />
        <UButton
          class="mt-4"
          icon="i-lucide-save"
          :disabled="saving || enabled === settings.dispatchEnabled"
          :loading="saving"
          @click="save"
        >
          {{ $t('pages.content.save') }}
        </UButton>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { settingsService } from '~/services/integration/settings-service'
import type { Settings } from '~/types/integration'

definePageMeta({ layout: 'dashboard' })
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
  if (saving.value) return
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
