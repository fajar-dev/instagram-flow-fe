<template>
  <UBadge
    :color="color"
    variant="subtle"
  >
    {{ $t(`pages.content.status.${status}`) }}
  </UBadge>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: string
}>()
const color = computed(() =>
  ['FAILED', 'REJECTED', 'OUTDATED'].includes(props.status)
    ? 'error'
    : ['READY_FOR_REVIEW', 'PUBLISH', 'COMPLETED'].includes(props.status)
        ? 'success'
        : 'neutral'
)
</script>
