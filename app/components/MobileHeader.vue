<template>
  <header
    class="flex shrink-0 items-center justify-between gap-3 border-b border-default bg-default px-4 pt-2 pb-0 lg:hidden"
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
