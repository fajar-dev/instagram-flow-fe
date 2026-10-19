<template>
  <div class="flex h-dvh w-full overflow-hidden font-sans text-sm text-highlighted">
    <div class="hidden h-full lg:block">
      <Sidebar />
    </div>

    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <MobileHeader />

      <main class="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain p-4 lg:p-6">
        <slot />
      </main>
      <MobileNavbar />
    </div>
  </div>
</template>
