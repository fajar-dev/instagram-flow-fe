<template>
  <header
    class="flex shrink-0 items-center justify-between gap-3 clay-glass mx-3 mt-3 rounded-3xl px-4 py-2 lg:hidden"
  >
    <div class="flex min-w-0 flex-1 items-center gap-3">
      <BrandLogo
        to="/"
        variant="full"
        size="h-7 sm:h-12"
      />
    </div>
    <div class="flex shrink-0 items-center gap-1">
      <UColorModeButton
        color="neutral"
        variant="ghost"
      />
      <LanguageSwitcher variant="ghost" />
      <UserPopover :show-details="false" />
    </div>
  </header>
</template>
