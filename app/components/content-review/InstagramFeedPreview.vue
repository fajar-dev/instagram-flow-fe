<template>
  <article class="overflow-hidden rounded-xl border border-default bg-default">
    <header class="flex items-center gap-3 px-4 py-3">
      <UAvatar
        icon="i-lucide-instagram"
        size="sm"
      />
      <div class="min-w-0 flex-1">
        <p class="text-sm font-semibold text-highlighted">
          {{ $t('pages.contentReview.instagramAccount') }}
        </p>
        <p
          v-if="location"
          class="truncate text-xs text-muted"
        >
          {{ location }}
        </p>
      </div>
      <UIcon
        name="i-lucide-ellipsis"
        class="size-5 text-toned"
        aria-hidden="true"
      />
    </header>
    <ContentPrivateImage
      :path="path"
      :alt="$t('pages.contentReview.preview')"
      placement="feed"
      class="rounded-none"
    />
    <div class="space-y-3 p-4">
      <div
        class="flex items-center gap-4 text-highlighted"
        aria-hidden="true"
      >
        <UIcon
          name="i-lucide-heart"
          class="size-6"
        />
        <UIcon
          name="i-lucide-message-circle"
          class="size-6"
        />
        <UIcon
          name="i-lucide-send"
          class="size-6"
        />
        <UIcon
          name="i-lucide-bookmark"
          class="ml-auto size-6"
        />
      </div>
      <div
        v-if="caption || hashtags.length"
        class="space-y-2"
      >
        <p
          class="whitespace-pre-line break-words text-sm leading-relaxed text-toned"
          :class="{ 'line-clamp-3': !expanded }"
        >
          {{ caption }}
        </p>
        <p
          v-if="expanded && hashtags.length"
          class="break-words text-sm text-primary"
        >
          {{ hashtags.join(' ') }}
        </p>
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          class="p-0"
          :aria-expanded="expanded"
          @click="expanded = !expanded"
        >
          {{ $t(expanded ? 'pages.contentReview.lessCaption' : 'pages.contentReview.fullCaption') }}
        </UButton>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{ path: string, caption: string, hashtags: string[], location: string }>()
const expanded = ref(false)
</script>
