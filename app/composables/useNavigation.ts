import { isNavigationActive } from '~/util/navigation'
import { useRoute } from 'vue-router'

export interface NavItem {
  id: string
  label: string
  to: string
  icon?: string
  children?: NavItem[]
}

export interface NavGroup {
  id?: string
  title?: string
  items: NavItem[]
}

export const useNavigation = () => {
  const route = useRoute()
  const { t } = useI18n()
  const isCollapsed = useState('sidebar-collapsed', () => false)
  const expandedItems = useState<string[]>('sidebar-expanded', () => ['group:main'])

  const navGroups = computed<NavGroup[]>(() => [{
    id: 'content',
    items: [
      { id: 'overview', label: t('pages.overview.overview'), to: '/overview', icon: 'i-lucide-layout-dashboard' },
      { id: 'content', label: t('pages.content.title'), to: '/content', icon: 'i-lucide-file-image' },
      { id: 'media', label: t('pages.content.media'), to: '/content/media', icon: 'i-lucide-images' },
      { id: 'logs', label: t('pages.content.logs'), to: '/activity-logs', icon: 'i-lucide-scroll-text' },
      { id: 'settings', label: t('pages.integration.settings'), to: '/integration-settings', icon: 'i-lucide-settings-2' },
      { id: 'users', label: t('components.sidebar.nav.users'), to: '/user', icon: 'i-lucide-users' }
    ]
  }])

  const isItemActive = (item: NavItem) => isNavigationActive(
    route.path.startsWith('/ai-jobs') || route.path.startsWith('/content-review') ? '/content' : route.path,
    item.to,
    navGroups.value.flatMap(group => group.items.flatMap(entry => [entry.to, ...(entry.children?.map(child => child.to) ?? [])]))
  )

  const isParentActive = (item: NavItem) => {
    if (!item.children) return false
    return item.children.some(child => isItemActive(child))
  }

  const toggleExpanded = (id: string) => {
    const index = expandedItems.value.indexOf(id)
    if (index === -1) {
      expandedItems.value.push(id)
    } else {
      expandedItems.value.splice(index, 1)
    }
  }

  const isExpanded = (id: string) => {
    return expandedItems.value.includes(id)
  }

  return {
    isCollapsed,
    navGroups,
    isItemActive,
    isParentActive,
    toggleExpanded,
    isExpanded
  }
}
