<template>
  <div :aria-busy="loading">
    <p
      v-if="!loading && !rows.length"
      class="text-sm text-muted py-8 text-center"
    >
      {{ $t('pages.content.empty') }}
    </p>
    <p
      v-else-if="loading && !rows.length"
      class="text-sm text-muted py-8 text-center"
      role="status"
    >
      {{ $t('pages.content.loadingMedia') }}
    </p>
    <div class="columns-1 sm:columns-2 xl:columns-3 gap-5">
      <article
        v-for="row in rows"
        :key="row.id"
        class="group relative break-inside-avoid mb-5 overflow-hidden rounded-lg isolate"
      >
        <ContentProgressiveImage
          :asset-id="row.id"
          :width="row.width"
          :height="row.height"
          :alt="row.projectName || $t('pages.content.photo')"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity duration-300 motion-reduce:transition-none"
        />
        <div
          class="absolute top-3 right-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity duration-300 motion-reduce:transition-none"
        >
          <UButton
            size="sm"
            color="neutral"
            variant="solid"
            icon="i-lucide-archive"
            :aria-label="
              $t('pages.content.archivePhoto', {
                name: row.projectName || $t('pages.content.photo')
              })
            "
            @click="$emit('archived', row.id)"
          />
        </div>
        <div
          class="absolute inset-x-0 bottom-0 pointer-events-none flex items-end justify-between gap-3 p-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity duration-300 motion-reduce:transition-none"
        >
          <div class="min-w-0 text-white">
            <p class="text-sm font-medium truncate">
              {{ row.projectName || $t('pages.content.photo') }}
            </p>
            <div
              v-if="row.uploaderName"
              class="flex items-center gap-2 mt-2"
            >
              <UAvatar
                :src="row.uploaderPhoto || undefined"
                :alt="row.uploaderName"
                size="xs"
              />
              <span class="text-xs truncate">{{ row.uploaderName }}</span>
            </div>
            <p class="text-xs text-white/80 mt-1">
              {{ row.width }} × {{ row.height }} · {{ formatFileSize(Number(row.byteSize)) }}
            </p>
          </div>
          <UButton
            size="sm"
            color="neutral"
            variant="solid"
            icon="i-lucide-download"
            class="pointer-events-auto"
            :aria-label="
              $t('pages.content.downloadPhoto', {
                name: row.projectName || $t('pages.content.photo')
              })
            "
            @click="$emit('downloaded', row.id)"
          />
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContentRecord } from '~/types/reporting'
import { formatFileSize } from '~/util/content'

defineProps<{ rows: ContentRecord[], loading: boolean }>()
defineEmits<{ downloaded: [id: string], archived: [id: string] }>()
</script>
