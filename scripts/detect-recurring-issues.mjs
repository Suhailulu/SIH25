import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running this job.')
  process.exit(1)
}

const supabase = createClient(url, key)
const periodEnd = new Date()
const periodStart = new Date(periodEnd)
periodStart.setDate(periodStart.getDate() - 30)

const { data: complaints, error } = await supabase
  .from('complaints')
  .select('category, operator_name, route')
  .gte('created_at', periodStart.toISOString())
  .lte('created_at', periodEnd.toISOString())

if (error) throw error

const groups = new Map()
for (const complaint of complaints || []) {
  const key = JSON.stringify([complaint.category || null, complaint.operator_name || null, complaint.route || null])
  groups.set(key, (groups.get(key) || 0) + 1)
}

const alerts = [...groups.entries()]
  .filter(([, count]) => count >= 3)
  .map(([key, complaint_count]) => {
    const [category, operator_name, route] = JSON.parse(key)
    return { category, operator_name, route, complaint_count, period_start: periodStart.toISOString().slice(0, 10), period_end: periodEnd.toISOString().slice(0, 10), status: 'open' }
  })

if (alerts.length) {
  const { error: insertError } = await supabase.from('recurring_issue_alerts').insert(alerts)
  if (insertError) throw insertError
}

console.log(`Recurring issue detection complete: ${alerts.length} alert(s) created.`)