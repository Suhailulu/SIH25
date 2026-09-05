import React, { useEffect, useState } from 'react'
import { getRecentComplaints, assignComplaint } from '../../services/authority'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function AuthorityComplaints() {
  const [complaints, setComplaints] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    getRecentComplaints(50).then((res) => {
      setLoading(false)
      if (res.data) setComplaints(res.data)
    })
  }, [])

  async function handleAssign(id: string) {
    if (!user) return
    await assignComplaint(id, user.id)
    setComplaints((s) => s.map((c) => (c.id === id ? { ...c, assigned_officer_id: user.id, current_status: 'Assigned to Officer' } : c)))
  }

  return (
    <div className="container py-8">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold">Authority — Complaints</h2>
      </header>

      {loading && <div>Loading...</div>}

      <div className="mt-4 grid gap-3">
        {complaints.map((c) => (
          <div key={c.id} className="card flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">{c.complaint_number}</div>
              <div className="font-semibold">{c.category}</div>
              <div className="text-sm text-gray-600">Status: {c.current_status}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Link to={`/authority/complaints/${c.id}`} className="text-sm text-blue-600">Open</Link>
              <button className="px-3 py-1 border rounded text-sm" onClick={() => handleAssign(c.id)}>Assign to me</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
