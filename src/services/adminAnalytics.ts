import { supabase } from '../lib/supabase'

export type ComplaintAnalytics = {
  total: number
  open: number
  resolved: number
  byStatus: Record<string, number>
  byCategory: Record<string, number>
  byOperator: Record<string, number>
}

export async function getComplaintAnalytics(): Promise<{ data: ComplaintAnalytics | null; error: any }> {
  const { data, error } = await supabase
    .from('complaints')
    .select('current_status, category, operator_name')

  if (error) return { data: null, error }

  const analytics: ComplaintAnalytics = {
    total: data?.length ?? 0,
    open: 0,
    resolved: 0,
    byStatus: {},
    byCategory: {},
    byOperator: {}
  }

  for (const complaint of data ?? []) {
    const status = complaint.current_status || 'Unknown'
    const category = complaint.category || 'Uncategorized'
    const operator = complaint.operator_name || 'Unknown operator'
    analytics.byStatus[status] = (analytics.byStatus[status] || 0) + 1
    analytics.byCategory[category] = (analytics.byCategory[category] || 0) + 1
    analytics.byOperator[operator] = (analytics.byOperator[operator] || 0) + 1
    if (status.toLowerCase() === 'resolved') analytics.resolved += 1
    else analytics.open += 1
  }

  return { data: analytics, error: null }
}

export async function getRecurringIssueAlerts() {
  return supabase
    .from('recurring_issue_alerts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)
}