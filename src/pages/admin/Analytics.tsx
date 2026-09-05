import React, { useEffect, useState } from 'react'
import { getComplaintAnalytics, getRecurringIssueAlerts, ComplaintAnalytics } from '../../services/adminAnalytics'

const entries = (values: Record<string, number>) => Object.entries(values).sort((a, b) => b[1] - a[1])

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<ComplaintAnalytics | null>(null)
  const [alerts, setAlerts] = useState<any[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const [summary, recurring] = await Promise.all([getComplaintAnalytics(), getRecurringIssueAlerts()])
      if (summary.error) setError(summary.error.message)
      else setAnalytics(summary.data)
      if (!recurring.error) setAlerts(recurring.data || [])
      setLoading(false)
    })()
  }, [])

  if (loading) return <div className="container py-8">Loading analytics...</div>
  if (error) return <div className="container py-8 text-red-700">Unable to load analytics: {error}</div>
  if (!analytics) return <div className="container py-8">No analytics available.</div>

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin analytics</h1>
        <p className="text-sm text-gray-600 mt-1">Complaint volume, outcomes, and recurring issue alerts.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card"><div className="text-sm text-gray-600">Total complaints</div><div className="text-3xl font-semibold mt-1">{analytics.total}</div></div>
        <div className="card"><div className="text-sm text-gray-600">Open complaints</div><div className="text-3xl font-semibold mt-1">{analytics.open}</div></div>
        <div className="card"><div className="text-sm text-gray-600">Resolved complaints</div><div className="text-3xl font-semibold mt-1">{analytics.resolved}</div></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <MetricList title="By status" values={analytics.byStatus} />
        <MetricList title="By category" values={analytics.byCategory} />
        <MetricList title="By operator" values={analytics.byOperator} />
      </div>

      <section className="card">
        <h2 className="font-semibold">Recurring issue alerts</h2>
        {alerts.length === 0 ? <p className="text-sm text-gray-600 mt-3">No recurring issues detected yet.</p> : (
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm text-left">
              <thead><tr className="border-b"><th className="py-2 pr-4">Issue</th><th className="py-2 pr-4">Count</th><th className="py-2 pr-4">Period</th><th className="py-2">Status</th></tr></thead>
              <tbody>{alerts.map((alert) => <tr className="border-b last:border-0" key={alert.id}><td className="py-2 pr-4">{[alert.category, alert.operator_name, alert.route].filter(Boolean).join(' / ') || 'Unspecified issue'}</td><td className="py-2 pr-4">{alert.complaint_count}</td><td className="py-2 pr-4">{alert.period_start} to {alert.period_end}</td><td className="py-2">{alert.status || 'open'}</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

function MetricList({ title, values }: { title: string; values: Record<string, number> }) {
  return <section className="card"><h2 className="font-semibold">{title}</h2><div className="mt-3 space-y-2">{entries(values).slice(0, 8).map(([label, count]) => <div className="flex justify-between gap-4 text-sm" key={label}><span className="truncate">{label}</span><span className="font-medium">{count}</span></div>)}</div></section>
}