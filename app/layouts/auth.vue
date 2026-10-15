<template>
  <div class="flex min-h-screen w-full select-none">
    <div class="hidden lg:flex lg:w-2/5 relative overflow-hidden">
      <div class="absolute inset-0 z-0 bg-[url('/hero.png')] bg-cover bg-right pointer-events-none" />
      <div class="absolute inset-0 z-0 bg-[url('/grid.svg')] bg-cover bg-center opacity-40 pointer-events-none" />
      <div class="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-black/10 to-black/20 pointer-events-none" />
      <div class="absolute inset-0 z-20 pointer-events-none shadow-inner" />

      <div class="relative z-30 flex w-full flex-col justify-end p-14 text-white">
        <slot name="hero">
          <img
            src="/ig.png"
            alt="instagram-logo"
            width="48px"
            height="48px"
            class="drop-shadow-lg"
          >
          <h1 class="text-3xl font-semibold leading-tight drop-shadow-md mt-5">
            Instagram Flow
          </h1>
          <p class="text-lg text-white/90 drop-shadow-sm">
            Asset Monitoring Teknologi Indonesia
          </p>
        </slot>
      </div>
    </div>

    <div class="relative z-50 flex flex-1 lg:w-3/5 lg:flex-none items-center justify-center bg-default px-6 py-12 lg:shadow-xl">
      <div class="absolute top-6 right-6 z-30 flex items-center gap-2">
        <UColorModeButton
          color="neutral"
          variant="ghost"
        />
        <LanguageSwitcher variant="ghost" />
      </div>

      <slot />
      <p class="absolute bottom-6 inset-x-0 text-center text-sm text-toned px-4">
        {{ $t('components.authLayout.copyright', { year: new Date().getFullYear() }) }}
      </p>
    </div>
  </div>
</template>
