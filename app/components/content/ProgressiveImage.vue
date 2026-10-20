<template>
  <div
    ref="container"
    class="relative overflow-hidden bg-muted w-full"
    :style="{ aspectRatio: ratio }"
    :aria-busy="!loaded && !failed"
  >
    <img
      v-if="sources?.thumbnailUrl"
      :src="sources.thumbnailUrl"
      alt=""
      aria-hidden="true"
      class="absolute inset-0 size-full object-cover blur-lg scale-110 transition-opacity duration-700 motion-reduce:transition-none"
      :class="loaded ? 'opacity-0' : 'opacity-100'"
    >
    <img
      v-if="sources?.previewUrl"
      :src="sources.previewUrl"
      :alt="alt"
      loading="lazy"
      decoding="async"
      class="absolute inset-0 size-full transition duration-700 ease-out motion-reduce:transition-none"
      :class="[
        loaded ? 'opacity-100 blur-none' : 'opacity-0 blur-md',
        contain ? 'object-contain' : 'object-cover'
      ]"
      @load="reveal"
      @error="fail"
    >
    <ImagePreview
      v-if="loaded && !failed"
      :src="sources?.previewUrl"
      :alt="alt"
    />
    <span
      v-if="failed"
      class="absolute inset-0 flex items-center justify-center p-4 text-sm text-muted bg-default/80"
    >
      {{ $t('pages.content.previewUnavailable') }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { mediaService } from '~/services/content/media-service'

const props = defineProps<{
  assetId: string
  alt: string
  width?: number
  height?: number
  frameRatio?: number
  contain?: boolean
}>()
const container = ref<HTMLElement | null>(null)
const sources = ref<{ previewUrl: string, thumbnailUrl: string } | null>(null)
const loaded = ref(false)
const failed = ref(false)
const visible = ref(false)
const naturalRatio = ref<number | null>(null)
const ratio = computed(
  () =>
    props.frameRatio
    || naturalRatio.value
    || (props.width && props.height ? props.width / props.height : 4 / 3)
)
let generation = 0
let observer: IntersectionObserver | undefined

function reveal(event: Event) {
  const image = event.target as HTMLImageElement
  if (image.currentSrc !== sources.value?.previewUrl) {
    return
  }
  if (image.naturalWidth && image.naturalHeight) {
    naturalRatio.value = image.naturalWidth / image.naturalHeight
  }
  loaded.value = true
}

function fail(event: Event) {
  if ((event.target as HTMLImageElement).currentSrc === sources.value?.previewUrl) {
    failed.value = true
  }
}

watch([() => props.assetId, visible], async ([assetId, isVisible]) => {
  const current = ++generation
  sources.value = null
  loaded.value = false
  failed.value = false
  naturalRatio.value = null
  if (!isVisible) {
    return
  }
  try {
    const response = await mediaService.previews(assetId)
    if (current === generation) {
      sources.value = response.data
    }
  } catch {
    if (current === generation) {
      failed.value = true
    }
  }
})
onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    visible.value = true
    return
  }
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        visible.value = true
        observer?.disconnect()
      }
    },
    { rootMargin: '300px' }
  )
  if (container.value) {
    observer.observe(container.value)
  }
})
onUnmounted(() => {
  generation++
  observer?.disconnect()
})
</script>
