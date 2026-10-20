<template>
  <div class="space-y-6">
    <Header
      :title="$t('pages.analytics.title')"
      :description="$t('pages.analytics.description')"
    />
    <USkeleton
      v-if="accountsLoading"
      class="h-12 w-full"
    />
    <p
      v-else-if="!accountsFailed && !accounts.length"
      class="text-sm text-muted"
    >
      {{ $t('pages.publishing.noAccounts') }}
    </p>
    <template v-if="accountKey">
      <div class="flex flex-col gap-4 sm:flex-row">
        <UFormField
          :label="$t('pages.analytics.account')"
          class="w-full sm:w-64"
        >
          <USelect
            v-model="accountKey"
            :items="accounts.map((account) => ({ label: account.label, value: account.key }))"
            :placeholder="$t('pages.analytics.account')"
            class="w-full"
          />
        </UFormField>
        <UFormField
          :label="$t('pages.analytics.period')"
          class="w-full sm:w-48"
        >
          <USelect
            v-model="period"
            :items="
              ['today', 'this_week', 'this_month', 'last_7_days', 'last_30_days'].map((value) => ({
                label: $t(`pages.analytics.periods.${value}`),
                value
              }))
            "
            :placeholder="$t('pages.analytics.period')"
            class="w-full"
          />
        </UFormField>
      </div>
      <AnalyticsAccountStatistics
        :report="report"
        :loading="loading"
      />
      <AnalyticsTopPosts :account-key="accountKey" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAnalytics } from '~/composables/analytics/useAnalytics'

definePageMeta({ layout: 'dashboard' })
const { accounts, accountKey, period, report, loading, accountsLoading, accountsFailed }
  = useAnalytics()
</script>
