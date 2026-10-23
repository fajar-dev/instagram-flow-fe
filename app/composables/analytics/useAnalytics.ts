import { instagramService } from '../../services/instagram/instagram-service'
import { analyticsService } from '../../services/analytics/analytics-service'
import type { InstagramAccount } from '~/types/instagram'
import type { InsightReport, AnalyticsPeriod } from '~/types/analytics'

export function useAnalytics() {
  const accounts = ref<InstagramAccount[]>([])
  const accountKey = ref('')
  const period = ref<AnalyticsPeriod>('this_week')
  const report = ref<InsightReport | null>(null)
  const {
    loading: accountsLoading,
    failed: accountsFailed,
    load: loadAccounts
  } = useLatestRequest(
    () => instagramService.accounts(),
    (response) => {
      accounts.value = response.data.filter(
        account => account.enabled && account.configured && !account.expired
      )
      accountKey.value = accounts.value[0]?.key || ''
    }
  )
  const { loading, load, invalidate } = useLatestRequest(
    () => analyticsService.account(accountKey.value, period.value),
    (response) => {
      report.value = response.data
    }
  )
  watch([accountKey, period], () => {
    invalidate()
    report.value = null
    if (accountKey.value) {
      load()
    }
  })
  onMounted(loadAccounts)
  return { accounts, accountKey, period, report, loading, accountsLoading, accountsFailed }
}
