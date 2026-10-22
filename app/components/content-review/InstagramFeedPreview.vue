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
    <div class="relative">
      <UCarousel
        ref="carousel"
        v-slot="{ item }"
        :items="paths.length ? paths : ['']"
        :arrows="paths.length > 1"
        :dots="paths.length > 1"
        :prev="{ size: 'xs', variant: 'solid' }"
        :next="{ size: 'xs', variant: 'solid' }"
        :ui="{
          container: 'ms-0',
          item: 'ps-0',
          prev: 'start-3 sm:start-3 disabled:invisible',
          next: 'end-3 sm:end-3 disabled:invisible',
          dots: 'bottom-3 gap-1.5',
          dot: 'size-1.5 bg-white/50 data-[state=active]:bg-white'
        }"
        @select="active = $event"
      >
        <ContentPrivateImage
          :path="item"
          :alt="$t('pages.contentReview.preview')"
          placement="feed"
          class="rounded-none select-none"
        />
      </UCarousel>
      <span
        v-if="paths.length > 1"
        class="pointer-events-none absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white tabular-nums"
        aria-live="polite"
        aria-atomic="true"
      >
        {{ active + 1 }} / {{ paths.length }}
      </span>
    </div>
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
const props = defineProps<{
  paths: string[]
  caption: string
  hashtags: string[]
  location: string
}>()
const carousel = useTemplateRef('carousel')
const active = ref(0)
const expanded = ref(false)

watch(
  () => props.paths.join('|'),
  async () => {
    active.value = 0
    await nextTick()
    carousel.value?.emblaApi?.scrollTo(0, true)
  }
)
</script>
