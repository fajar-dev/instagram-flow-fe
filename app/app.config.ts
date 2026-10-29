const controlSize = 'lg' as const

export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      error: 'red',
      warning: 'yellow',
      neutral: 'slate'
    },
    button: {
      slots: { base: 'clay-button rounded-full font-semibold' },
      defaultVariants: {
        size: controlSize
      }
    },
    input: {
      slots: { base: 'clay-control rounded-2xl' },
      defaultVariants: {
        size: controlSize
      }
    },
    selectMenu: {
      slots: { base: 'clay-control rounded-2xl' },
      defaultVariants: {
        size: controlSize
      }
    },
    select: {
      slots: { base: 'clay-control rounded-2xl' },
      defaultVariants: {
        size: controlSize
      }
    },
    textarea: {
      slots: { base: 'clay-control rounded-2xl' },
      defaultVariants: {
        size: controlSize
      }
    },
    card: {
      slots: {
        root: 'clay-card rounded-3xl ring-0 divide-default/60',
        header: 'px-5 py-5 sm:px-6',
        body: 'p-5 sm:p-6',
        footer: 'px-5 py-4 sm:px-6'
      }
    },
    badge: { slots: { base: 'rounded-full font-medium' } },
    tabs: {
      slots: {
        list: 'clay-tabs rounded-full p-1.5',
        trigger: 'rounded-full',
        indicator: 'rounded-full'
      }
    },
    popover: { slots: { content: 'clay-card rounded-2xl' } },
    dropdownMenu: { slots: { content: 'clay-card rounded-2xl p-2', item: 'rounded-xl' } },
    slideover: { slots: { content: 'clay-card' } },
    modal: {
      slots: {
        content: 'clay-card rounded-3xl sm:max-w-lg',
        overlay: '!backdrop-blur-xs !bg-white/10 dark:!bg-black/50',
        body: 'border-0 !py-0',
        header: 'border-0'
      }
    }
  }
})
