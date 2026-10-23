import { h, type VNode } from 'vue'

export const tableActionsMeta = {
  class: {
    td: 'sticky right-0 z-10 w-16 border-l border-default bg-default text-right whitespace-nowrap',
    th: 'sticky right-0 z-20 w-16 border-l border-default bg-muted text-right whitespace-nowrap'
  }
}

export function tableActions(...actions: VNode[]) {
  return h('div', { class: 'flex items-center justify-end gap-1 whitespace-nowrap' }, actions)
}
