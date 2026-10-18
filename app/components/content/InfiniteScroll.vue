<template>
  <div
    ref="sentinel"
    class="flex justify-center py-4"
    :aria-busy="loading"
  >
    <UButton
      v-if="failed || (!supported && hasMore)"
      color="neutral"
      variant="ghost"
      :loading="loading"
      :label="$t(failed ? 'components.content.infiniteScroll.retry' : 'components.content.infiniteScroll.more')"
      @click="$emit('requested')"
    />
    <span
      v-else-if="loading"
      class="text-sm text-muted"
      role="status"
    >
      {{ $t('pages.content.loadingMedia') }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ loading: boolean, hasMore: boolean, failed: boolean }>()
const emit = defineEmits<{ requested: [] }>()
const sentinel = ref<HTMLElement>()
const supported = ref(true)
let observer: IntersectionObserver | undefined

function observe() {
  observer?.disconnect()
  if (sentinel.value && !props.loading && props.hasMore && !props.failed) {
    observer?.observe(sentinel.value)
  }
}

watch(() => [props.loading, props.hasMore, props.failed], observe, { flush: 'post' })
onMounted(() => {
  supported.value = 'IntersectionObserver' in window
  if (!supported.value) return
  observer = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting && !props.loading && props.hasMore && !props.failed) {
      observer?.disconnect()
      emit('requested')
    }
  }, { rootMargin: '400px' })
  observe()
})
onUnmounted(() => observer?.disconnect())
</script>
