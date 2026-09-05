import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getComplaintsByPassenger } from '../../services/complaints'

export default function ComplaintsPage() {
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

  if (!user) return <div className="container py-8">Sign in to view your complaints.</div>

  return (
    <div className="container py-8">
      <h3 className="text-lg font-semibold">My Complaints</h3>
      {loading && <div className="mt-4">Loading...</div>}
      {!loading && complaints.length === 0 && (
        <div className="mt-4 card">You haven't submitted any complaints yet. <Link to="/passenger/report" className="text-blue-600">Report an Issue</Link></div>
      )}

      <div className="mt-4 grid gap-4">
        {complaints.map((c) => (
          <Link key={c.id} to={`/passenger/complaints/${c.id}`} className="card block">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">{c.complaint_number || c.id}</div>
                <div className="font-semibold">{c.category}</div>
                <div className="text-sm text-gray-600">{new Date(c.created_at).toLocaleString()}</div>
              </div>
              <div className="text-sm">{c.current_status}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
