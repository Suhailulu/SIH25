import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getComplaintsByPassenger } from '../../services/complaints'
import { ArrowRight, ClipboardList, Clock3, FileCheck2, Plus } from 'lucide-react'

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
      <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Passenger portal</p>
          <h2 className="mt-2 text-4xl font-bold">Your case desk</h2>
          <p className="mt-2 text-slate-500">A quick view of your reports and what needs your attention.</p>
        </div>
        <div>
          <Link to="/passenger/report" className="button-primary"><Plus size={17} /> Report an issue</Link>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="card border-l-4 border-l-[#1261d6]"><div className="flex items-center justify-between"><div className="text-sm font-semibold text-slate-500">Active complaints</div><ClipboardList size={19} className="text-[#1261d6]" /></div><div className="mt-3 text-3xl font-bold">{loading ? '—' : active}</div>
        </div>
        <div className="card border-l-4 border-l-amber-400"><div className="flex items-center justify-between"><div className="text-sm font-semibold text-slate-500">Under review</div><Clock3 size={19} className="text-amber-500" /></div><div className="mt-3 text-3xl font-bold">{loading ? '—' : underReview}</div>
        </div>
        <div className="card border-l-4 border-l-emerald-500"><div className="flex items-center justify-between"><div className="text-sm font-semibold text-slate-500">Resolved</div><FileCheck2 size={19} className="text-emerald-500" /></div><div className="mt-3 text-3xl font-bold">{loading ? '—' : resolved}</div>
        </div>
        <div className="card bg-[#17202a] text-white"><div className="text-sm font-semibold text-slate-300">Quick actions</div><div className="mt-3 flex flex-col gap-2 text-sm font-semibold"><Link className="flex items-center justify-between hover:text-blue-200" to="/passenger/report">Report new complaint <ArrowRight size={15} /></Link><Link className="flex items-center justify-between hover:text-blue-200" to="/passenger/complaints">View my complaints <ArrowRight size={15} /></Link><Link className="flex items-center justify-between hover:text-blue-200" to="/passenger/rights">Know your rights <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between"><h3 className="text-xl font-bold">Recent complaints</h3><Link to="/passenger/complaints" className="text-sm font-bold text-[#1261d6]">View all <ArrowRight className="ml-1 inline" size={15} /></Link></div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading && <div className="text-sm text-gray-600">Loading...</div>}
          {!loading && complaints.length === 0 && <div className="card">You haven't submitted any complaints yet. <Link to="/passenger/report" className="text-blue-600">Report an Issue</Link></div>}
          {!loading && complaints.map((complaint) => (
            <Link key={complaint.id} to={`/passenger/complaints/${complaint.id}`} className="card group block hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.12em] text-[#1261d6]">{complaint.complaint_number}</div>
                  <div className="font-semibold mt-1">{complaint.category}</div>
                </div>
                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-[#c55236]">{complaint.priority}</span>
              </div>
              <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">{new Date(complaint.created_at).toLocaleDateString()}</div>
              <div className="mt-2 text-sm font-semibold text-slate-700">{complaint.current_status}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
