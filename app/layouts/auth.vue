<template>
  <div class="fixed inset-0 flex overflow-hidden bg-muted/30 p-2">
    <aside
      class="relative isolate hidden shrink-0 flex-col justify-between overflow-hidden rounded-2xl bg-neutral-950 p-6 text-white lg:flex lg:w-[45%] xl:p-10 2xl:p-12"
    >
      <img
        src="/hero.png"
        alt=""
        aria-hidden="true"
        class="absolute inset-0 -z-20 size-full object-cover object-center"
      >
      <div
        class="absolute inset-0 -z-10 bg-linear-to-t from-neutral-950/90 via-transparent to-black/30"
      />
      <div class="flex items-center gap-3">
        <BrandLogo
          to="/"
          variant="full"
          size="xl"
          color-mode="dark"
        />
      </div>
      <div class="max-w-md space-y-4 pb-2 xl:space-y-5 xl:pb-6">
        <slot name="hero">
          <div class="flex items-center gap-1.5 pb-1">
            <span
              v-for="(_, index) in slides"
              :key="index"
              class="h-1 rounded-full transition-all duration-300"
              :class="index === currentSlideIndex ? 'w-6 bg-primary' : 'w-1.5 bg-white/30'"
            />
          </div>
          <div class="flex min-h-20 flex-col justify-end xl:min-h-28">
            <h2 class="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl xl:text-4xl">
              <span>{{ displayedHeadline }}</span>
              <span
                class="ml-1 inline-block h-6 w-0.5 animate-pulse bg-primary align-middle xl:h-9"
                aria-hidden="true"
              />
            </h2>
          </div>
          <p class="min-h-10 max-w-sm text-sm leading-relaxed text-white/70 xl:text-base">
            {{ currentSlide.description }}
          </p>
        </slot>
      </div>
    </aside>
    <div
      class="flex h-full min-w-0 flex-1 flex-col overflow-hidden px-4 sm:px-8 lg:w-[55%] lg:px-10 xl:px-12"
    >
      <header
        class="flex shrink-0 min-h-12 items-center justify-between gap-3 py-2 sm:min-h-14 sm:py-3"
      >
        <BrandLogo class="lg:hidden" />
        <div class="ml-auto flex items-center gap-1">
          <UColorModeButton
            color="neutral"
            variant="ghost"
          />
          <LanguageSwitcher variant="ghost" />
        </div>
      </header>
      <main
        class="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden py-2 sm:py-4"
      >
        <slot />
      </main>
      <footer
        class="shrink-0 py-2 text-center text-xs leading-relaxed text-muted sm:py-3 sm:text-sm"
      >
        {{ $t('components.authLayout.copyright', { year: new Date().getFullYear() }) }}
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Slide {
  headline: string
  description: string
}

const { locale, t } = useI18n()

useHead({
  htmlAttrs: {
    class: 'h-dvh overflow-hidden'
  },
  bodyAttrs: {
    class: 'h-dvh overflow-hidden'
  }
})

const SLIDE_KEYS = ['story', 'aiDesign', 'review', 'schedule', 'analytics'] as const

const DEFAULT_SLIDE: Slide = {
  headline: '',
  description: ''
}

const TYPE_SPEED = 60
const DELETE_SPEED = 30
const PAUSE_COMPLETE = 2400
const PAUSE_EMPTY = 400

const currentSlideIndex = ref(0)
const displayedHeadline = ref('')
const isDeleting = ref(false)

let timer: ReturnType<typeof setTimeout> | undefined

const slides = computed<Slide[]>(() =>
  SLIDE_KEYS.map(key => ({
    headline: t(`components.authLayout.slides.${key}.headline`),
    description: t(`components.authLayout.slides.${key}.description`)
  }))
)

const currentSlide = computed<Slide>(
  () => slides.value[currentSlideIndex.value] ?? slides.value[0] ?? DEFAULT_SLIDE
)

const tick = () => {
  const currentHeadline = currentSlide.value.headline

  if (!isDeleting.value) {
    if (displayedHeadline.value.length < currentHeadline.length) {
      displayedHeadline.value = currentHeadline.slice(0, displayedHeadline.value.length + 1)
      timer = setTimeout(tick, TYPE_SPEED)
    } else {
      isDeleting.value = true
      timer = setTimeout(tick, PAUSE_COMPLETE)
    }
  } else {
    if (displayedHeadline.value.length > 0) {
      displayedHeadline.value = currentHeadline.slice(0, displayedHeadline.value.length - 1)
      timer = setTimeout(tick, DELETE_SPEED)
    } else {
      isDeleting.value = false
      currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.value.length
      timer = setTimeout(tick, PAUSE_EMPTY)
    }
  }
}

watch(locale, () => {
  if (timer) {
    clearTimeout(timer)
  }
  isDeleting.value = false
  displayedHeadline.value = ''
  timer = setTimeout(tick, 200)
})

onMounted(() => {
  timer = setTimeout(tick, 400)
})

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
})
</script>
