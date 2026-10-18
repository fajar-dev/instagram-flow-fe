const controlSize = 'lg' as const

export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      error: 'red',
      warning: 'yellow',
      neutral: 'neutral'
    },
    button: {
      defaultVariants: {
        size: controlSize
      }
    },
    input: {
      defaultVariants: {
        size: controlSize
      }
    },
    selectMenu: {
      defaultVariants: {
        size: controlSize
      }
    },
    select: {
      defaultVariants: {
        size: controlSize
      }
    },
    textarea: {
      defaultVariants: {
        size: controlSize
      }
    },
    modal: {
      slots: {
        content: 'sm:max-w-lg',
        overlay: '!backdrop-blur-xs !bg-white/10 dark:!bg-black/50',
        body: 'border-0 !py-0',
        header: 'border-0'
      }
    }
  }
})
