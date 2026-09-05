import React, { useEffect, useState } from 'react'
import { getRecentComplaints } from '../../services/authority'
import { Link } from 'react-router-dom'

export default function AuthorityDashboard() {
  const [recent, setRecent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRecentComplaints(10).then((res) => {
      setLoading(false)
      if (res.data) setRecent(res.data)
    })
  }, [])

  return (
    <div className="container py-8">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold">Authority Dashboard</h2>
        <p className="text-gray-600">Overview of complaints assigned to your authority.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card">Total complaints: {loading ? '—' : recent.length}</div>
        <div className="card">New complaints: —</div>
        <div className="card">High priority: —</div>
      </section>

      <section className="mt-8">
        <h3 className="text-xl font-semibold">Recent complaints</h3>
        <div className="mt-4 grid gap-4">
          {recent.map((c) => (
            <Link key={c.id} to={`/authority/complaints/${c.id}`} className="card block">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">{c.complaint_number}</div>
                  <div className="font-semibold">{c.category}</div>
                </div>
                <div className="text-sm">{c.current_status}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
