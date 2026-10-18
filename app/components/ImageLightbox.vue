<template>
  <UModal
    v-model:open="lightboxOpen"
    :title="$t('components.imagePreview.title')"
    :description="lightboxAlt || $t('components.imagePreview.title')"
    :ui="{
      content: 'h-5/6 sm:max-w-6xl bg-transparent divide-y-0 ring-0 shadow-none overflow-visible'
    }"
  >
    <template #content>
      <img
        v-if="!failed"
        :src="lightboxImage"
        :alt="lightboxAlt || $t('components.imagePreview.title')"
        class="h-full min-h-0 w-full rounded-lg object-contain p-4 sm:p-8"
        @error="failed = true"
      >
      <p
        v-else
        class="m-auto text-sm text-white"
        role="status"
      >
        {{ $t('pages.content.previewUnavailable') }}
      </p>
      <UButton
        icon="i-lucide-x"
        color="neutral"
        variant="solid"
        class="absolute top-2 right-2 rounded-full"
        :aria-label="$t('components.imagePreview.close')"
        @click="closeLightbox"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
const { lightboxOpen, lightboxImage, lightboxAlt, closeLightbox } = useLightbox()
const route = useRoute()
const failed = ref(false)

watch(() => route.fullPath, closeLightbox)
watch([lightboxOpen, lightboxImage], () => {
  failed.value = false
})
</script>
