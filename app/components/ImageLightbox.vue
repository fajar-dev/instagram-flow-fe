<template>
  <UModal
    v-model:open="lightboxOpen"
    :title="$t('components.imagePreview.title')"
    :description="lightboxAlt || $t('components.imagePreview.title')"
    :ui="{
      content: 'h-5/6 sm:max-w-6xl !bg-transparent !border-0 !shadow-none rounded-none divide-y-0 ring-0 overflow-visible'
    }"
  >
    <template #content>
      <div
        class="flex h-full min-h-0 w-full items-center justify-center p-4 sm:p-8"
        @click.self="closeLightbox"
      >
        <img
          v-if="!failed"
          :src="lightboxImage"
          :alt="lightboxAlt || $t('components.imagePreview.title')"
          class="max-h-full max-w-full rounded-lg object-contain"
          @error="failed = true"
        >
        <p
          v-else
          class="text-sm text-white"
          role="status"
        >
          {{ $t('pages.content.previewUnavailable') }}
        </p>
      </div>
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
