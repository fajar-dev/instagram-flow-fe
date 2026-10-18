<template>
  <div class="space-y-6 min-w-0">
    <Header
      :title="$t('pages.content.title')"
      :description="$t('pages.content.listDescription')"
    >
      <template #tabs>
        <HeaderTab
          v-for="tab in contentTabs"
          :key="tab.value"
          :to="{ path: '/content', query: { status: tab.value } }"
          :label="$t(`pages.content.status.${tab.value}`)"
          :active="activeTab.value === tab.value"
          :count="counts ? counts[tab.value] ?? 0 : null"
        />
      </template>
    </Header>
    <ReportingRecordList
      :key="activeTab.value"
      :resource="activeTab.resource"
      :fixed-status="activeTab.value"
    />
  </div>
</template>

<script setup lang="ts">
import { contentTabs, resolveContentTab } from '~/util/content-tabs'
import { reportingService } from '~/services/reporting/reporting-service'

definePageMeta({ layout: 'dashboard', alias: ['/ai-jobs', '/content-review', '/content-review/studio'] })
const route = useRoute()
const activeTab = computed(() => resolveContentTab(route.query.status))
const counts = ref<Record<string, number> | null>(null)
const { load } = useLatestRequest(
  () => reportingService.contentCounts(30),
  (response) => { counts.value = response.data }
)
watch(() => activeTab.value.value, load)
usePolling(load, 20000)
</script>
