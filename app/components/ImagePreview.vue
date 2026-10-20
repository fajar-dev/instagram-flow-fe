<template>
  <UButton
    v-if="src"
    color="neutral"
    variant="link"
    class="absolute inset-0 size-full p-0 cursor-zoom-in rounded-lg"
    :aria-label="$t('components.imagePreview.open', { name: alt })"
    @click.stop="openLightbox(src, alt)"
  />
</template>

<script setup lang="ts">
const props = defineProps<{ src?: string | null, alt: string }>()
const { lightboxImage, openLightbox, closeLightbox } = useLightbox()

watch(
  () => props.src,
  (_, previous) => {
    if (previous && lightboxImage.value === previous) {
      closeLightbox()
    }
  }
)
onBeforeUnmount(() => {
  if (props.src && lightboxImage.value === props.src) {
    closeLightbox()
  }
})
</script>
