<template>
  <article class="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-black">
    <ContentPrivateImage
      :path="path"
      :alt="$t('pages.contentDraft.story')"
      placement="story"
      class="rounded-none bg-black text-white"
    />
    <div
      class="pointer-events-none absolute inset-x-0 top-0 space-y-3 bg-linear-to-b from-black/70 to-transparent px-4 pt-3 pb-10 text-white"
      aria-hidden="true"
    >
      <div class="h-0.5 rounded-full bg-white/40">
        <div class="h-full w-1/3 rounded-full bg-white" />
      </div>
      <div class="flex items-center gap-2.5">
        <UAvatar
          icon="i-lucide-instagram"
          size="sm"
          class="bg-white/20 text-white ring-1 ring-white/40"
        />
        <span class="min-w-0 flex-1 truncate text-sm font-semibold">
          {{ $t('pages.contentDraft.instagramAccount') }}
        </span>
        <UIcon
          name="i-lucide-pause"
          class="size-4 shrink-0"
        />
        <UIcon
          name="i-lucide-ellipsis"
          class="size-5 shrink-0"
        />
        <UIcon
          name="i-lucide-x"
          class="size-5 shrink-0"
        />
      </div>
    </div>
    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-3 bg-linear-to-t from-black/70 to-transparent px-4 pt-10 pb-4 text-white"
      aria-hidden="true"
    >
      <span class="min-w-0 flex-1 truncate rounded-full border border-white/60 px-4 py-2.5 text-sm">
        {{ $t('pages.contentDraft.storyReply') }}
      </span>
      <UIcon
        name="i-lucide-heart"
        class="size-6 shrink-0"
      />
      <UIcon
        name="i-lucide-send"
        class="size-6 shrink-0"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{ path: string }>()
</script>
