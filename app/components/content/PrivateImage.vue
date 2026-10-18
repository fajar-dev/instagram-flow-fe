<template>
  <div
    class="relative overflow-hidden rounded-lg bg-muted flex items-center justify-center"
    :class="placement === 'story' ? 'aspect-9/16' : 'aspect-4/5'"
  >
    <img
      v-if="url"
      :src="url"
      :alt="alt"
      class="size-full object-contain"
    >
    <UIcon
      v-else-if="loading"
      name="i-lucide-loader-circle"
      class="size-6 animate-spin"
    />
    <span
      v-else
      class="text-sm text-muted p-3"
    >{{ $t('pages.content.previewUnavailable') }}</span>
    <ImagePreview
      v-if="url"
      :src="url"
      :alt="alt"
    />
  </div>
</template>

<script setup lang="ts">
import { mediaService } from '~/services/content/media-service'

const props = defineProps<{
  path: string
  alt: string
  placement?: string
}>()
const url = ref('')
const loading = ref(false)
let version = 0
function clear() {
  if (url.value)
    URL.revokeObjectURL(url.value)
  url.value = ''
}
watch(() => props.path, async (path) => {
  const current = ++version
  clear()
  if (!path) {
    loading.value = false
    return
  }
  loading.value = true
  try {
    const blob = await mediaService.file(path)
    if (current === version)
      url.value = URL.createObjectURL(blob)
  } catch { /* display the unavailable state without toast spam */
  } finally {
    if (current === version)
      loading.value = false
  }
}, { immediate: true })
onUnmounted(() => {
  version++
  clear()
})
</script>
