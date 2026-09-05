import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getComplaintsByPassenger } from '../../services/complaints'

export default function PassengerDashboard() {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getComplaintsByPassenger(user.id).then((res) => {
      setLoading(false)
      if (res.data) setComplaints(res.data)
    })
  }, [user])

  const active = complaints.filter((c) => !['Resolved', 'Closed'].includes(c.current_status)).length
  const underReview = complaints.filter((c) => c.current_status === 'Under Review').length
  const resolved = complaints.filter((c) => c.current_status === 'Resolved').length

  return (
    <div className="container py-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-blue-700">Passenger Portal</p>
          <h2 className="text-3xl font-semibold">Hello, Passenger</h2>
          <p className="text-gray-600">How can we help you today?</p>
        </div>
        <div>
          <Link to="/passenger/report" className="bg-blue-600 text-white px-4 py-2.5 rounded-lg">Report an Issue</Link>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="card">
          <div className="text-sm text-gray-500">Active complaints</div>
          <div className="mt-2 text-3xl font-semibold">{loading ? '—' : active}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500">Under review</div>
          <div className="mt-2 text-3xl font-semibold">{loading ? '—' : underReview}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500">Resolved</div>
          <div className="mt-2 text-3xl font-semibold">{loading ? '—' : resolved}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500">Quick actions</div>
          <div className="mt-2 flex flex-col gap-2 text-sm text-blue-600">
            <Link to="/passenger/report">Report New Complaint</Link>
            <Link to="/passenger/complaints">My Complaints</Link>
            <Link to="/passenger/rights">Know Your Rights</Link>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-xl font-semibold">Recent Complaints</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading && <div className="text-sm text-gray-600">Loading...</div>}
          {!loading && complaints.length === 0 && <div className="card">You haven't submitted any complaints yet. <Link to="/passenger/report" className="text-blue-600">Report an Issue</Link></div>}
          {!loading && complaints.map((complaint) => (
            <Link key={complaint.id} to={`/passenger/complaints/${complaint.id}`} className="card block hover:shadow-md transition">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">{complaint.complaint_number}</div>
                  <div className="font-semibold mt-1">{complaint.category}</div>
                </div>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">{complaint.priority}</span>
              </div>
              <div className="mt-3 text-sm text-gray-600">{new Date(complaint.created_at).toLocaleDateString()}</div>
              <div className="mt-2 text-sm text-gray-700">Status: {complaint.current_status}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
