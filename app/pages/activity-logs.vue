<template>
  <ReportingRecordPage
    :title="$t('pages.content.logs')"
    resource="audit-logs"
  />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
</script>
