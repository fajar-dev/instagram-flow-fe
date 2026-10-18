<template>
  <div class="space-y-6">
    <Header
      :title="title"
      :description="$t('pages.overview.scope')"
    />
    <ReportingRecordList :resource="resource" />
  </div>
</template>

<script setup lang="ts">
import type { ReportResource } from '~/types/reporting'

defineProps<{ title: string, resource: ReportResource }>()
</script>
