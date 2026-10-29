<template>
  <header
    class="flex shrink-0 items-center justify-between gap-3 clay-glass mx-3 mt-3 rounded-3xl px-4 py-2 lg:hidden"
  >
    <div class="flex min-w-0 flex-1 items-center gap-3">
      <BrandLogo
        to="/"
        variant="full"
        size="lg"
      />
    </div>
    <div class="shrink-0">
      <UserPopover :show-details="false" />
    </div>
  </header>
</template>
