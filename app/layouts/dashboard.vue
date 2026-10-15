<template>
  <div class="flex h-dvh w-full overflow-hidden font-sans text-highlighted">
    <div class="hidden h-full lg:block">
      <Sidebar />
    </div>

    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <header class="flex shrink-0 items-center justify-between gap-3 border-b border-default bg-default px-3 py-2 lg:hidden">
        <div class="flex min-w-0 items-center gap-3">
          <MobileSidebar />
          <BrandLogo />
        </div>
        <UserPopover />
      </header>

      <main class="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain p-4 lg:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
