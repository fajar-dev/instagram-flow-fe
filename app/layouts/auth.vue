<template>
  <div class="fixed inset-0 flex overflow-hidden creative-shell p-3 sm:p-5">
    <aside
      class="relative isolate hidden shrink-0 flex-col justify-between overflow-hidden auth-art rounded-3xl p-6 lg:flex lg:w-[45%] xl:p-10 2xl:p-12"
    >
      <img
        src="/hero.png"
        alt=""
        aria-hidden="true"
        class="absolute inset-0 -z-10 size-full object-cover object-center dark:hidden"
      >
      <img
        src="/hero-dark.png"
        alt=""
        aria-hidden="true"
        class="absolute inset-0 -z-10 hidden size-full object-cover object-center dark:block"
      >
      <div class="flex items-center gap-3">
        <BrandLogo
          to="/"
          variant="full"
          size="xl"
        />
      </div>
      <div class="auth-hero-copy w-full max-w-md rounded-2xl p-5 xl:p-6">
        <slot name="hero">
          <div class="space-y-3">
            <h2 class="grid text-2xl font-medium leading-snug tracking-tight xl:text-3xl">
              <span
                class="invisible col-start-1 row-start-1"
                aria-hidden="true"
              >{{ currentSlide.headline }}<span>▏</span></span>
              <span
                class="col-start-1 row-start-1 font-semibold"
                aria-hidden="true"
              >{{ displayedHeadline }}<span class="animate-pulse">▏</span></span>
              <span class="sr-only">{{ currentSlide.headline }}</span>
            </h2>
            <p class="max-w-sm text-sm leading-relaxed text-inherit">
              {{ currentSlide.description }}
            </p>
          </div>
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
        class="flex min-h-0 w-full flex-1 items-center justify-center overflow-y-auto py-2 sm:py-4"
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

const { t } = useI18n()

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

const currentSlideIndex = ref(0)

const slides = computed<Slide[]>(() =>
  SLIDE_KEYS.map(key => ({
    headline: t(`components.authLayout.slides.${key}.headline`),
    description: t(`components.authLayout.slides.${key}.description`)
  }))
)

const currentSlide = computed<Slide>(
  () => slides.value[currentSlideIndex.value] ?? slides.value[0] ?? DEFAULT_SLIDE
)
const displayedHeadline = ref('')
let isDeleting = false
let typingTimer: ReturnType<typeof setTimeout> | undefined

function tick() {
  const headline = currentSlide.value.headline

  if (isDeleting) {
    displayedHeadline.value = displayedHeadline.value.slice(0, -1)
    if (!displayedHeadline.value) {
      currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.value.length
      return
    }
    typingTimer = setTimeout(tick, 30)
    return
  }

  displayedHeadline.value = headline.slice(0, displayedHeadline.value.length + 1)
  if (displayedHeadline.value === headline) {
    isDeleting = true
    typingTimer = setTimeout(tick, 2400)
    return
  }
  typingTimer = setTimeout(tick, 60)
}

function restartTyping() {
  clearTimeout(typingTimer)
  displayedHeadline.value = ''
  isDeleting = false
  typingTimer = setTimeout(tick, 400)
}

watch(() => currentSlide.value.headline, restartTyping)
onMounted(restartTyping)
onUnmounted(() => clearTimeout(typingTimer))
</script>
