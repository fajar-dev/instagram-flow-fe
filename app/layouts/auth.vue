<template>
  <div class="flex min-h-dvh w-full bg-muted/30 p-2">
    <aside
      class="relative isolate hidden w-2/5 shrink-0 flex-col justify-between overflow-hidden rounded-2xl bg-neutral-950 p-8 text-white lg:flex xl:p-12"
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
        <img
          src="/logo-light.png"
          alt="AMTI"
          class="h-15 w-auto"
        >
      </div>
      <div class="max-w-md space-y-5 pt-80 pb-6">
        <slot name="hero">
          <h2 class="text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
            {{ $t('components.authLayout.headline') }}
          </h2>
          <p class="max-w-sm text-sm leading-relaxed text-white/70 xl:text-base">
            {{ $t('components.authLayout.description') }}
          </p>
        </slot>
      </div>
    </aside>
    <div class="flex min-w-0 flex-1 flex-col px-4 sm:px-8 lg:px-12">
      <header class="flex min-h-16 items-center justify-between gap-3 py-3">
        <BrandLogo class="lg:hidden" />
        <div class="ml-auto flex items-center gap-1">
          <UColorModeButton
            color="neutral"
            variant="ghost"
          />
          <LanguageSwitcher variant="ghost" />
        </div>
      </header>
      <main class="flex w-full flex-1 items-center py-10 sm:py-16">
        <slot />
      </main>
      <footer class="py-5 text-center text-sm leading-relaxed text-muted">
        {{ $t('components.authLayout.copyright', { year: new Date().getFullYear() }) }}
      </footer>
    </div>
  </div>
</template>
