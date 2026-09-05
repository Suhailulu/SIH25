import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { getComplaintById, getEvidenceSignedUrl } from '../../../services/complaints'
import { supabase } from '../../../lib/supabase'

export default function ComplaintDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const [complaint, setComplaint] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [evidenceLinks, setEvidenceLinks] = useState<Record<string,string>>({})
  const [tickets, setTickets] = useState<any[]>([])
  const [witnesses, setWitnesses] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    if (!id) return
    ;(async () => {
      const res = await getComplaintById(id)
      setLoading(false)
      if (res.data) {
        setComplaint(res.data)

        const { data: ev } = await supabase.from('evidence').select('*').eq('complaint_id', id)
        if (ev) {
          const links: Record<string,string> = {}
          for (const e of ev) {
            if (e.file_path) {
              const signed = await getEvidenceSignedUrl(e.file_path, 60)
              if (signed.data) links[e.id] = signed.data.signedUrl
            }
          }
          setEvidenceLinks(links)
        }

        const { data: t } = await supabase.from('tickets').select('*').eq('complaint_id', id)
        if (t) setTickets(t)

        const { data: w } = await supabase.from('witnesses').select('*').eq('complaint_id', id)
        if (w) setWitnesses(w)

        const { data: h } = await supabase.from('complaint_status_history').select('*').eq('complaint_id', id).order('created_at', { ascending: true })
        if (h) setHistory(h)
      }
    })()
  }, [id])

  if (!user) return <div className="container py-8">Sign in to view this complaint.</div>
  if (loading) return <div className="container py-8">Loading...</div>
  if (!complaint) return <div className="container py-8">Complaint not found.</div>

  return (
    <div className="container py-8">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">{complaint.complaint_number}</div>
            <h3 className="text-xl font-semibold">{complaint.category}</h3>
            <div className="text-sm text-gray-600">Status: {complaint.current_status}</div>
          </div>
        </div>

        <section className="mt-4">
          <h4 className="font-semibold">Incident Details</h4>
          <p className="text-sm text-gray-700">{complaint.description}</p>
        </section>

        <section className="mt-4">
          <h4 className="font-semibold">Ticket</h4>
          {tickets.length === 0 && <div className="text-sm text-gray-600">No ticket information provided.</div>}
          {tickets.map((t) => (
            <div key={t.id} className="text-sm text-gray-700">Ticket: {t.ticket_number} · Booking: {t.booking_reference} · Seat: {t.seat_number}</div>
          ))}
        </section>

        <section className="mt-4">
          <h4 className="font-semibold">Witnesses</h4>
          {witnesses.length === 0 && <div className="text-sm text-gray-600">No witnesses provided.</div>}
          {witnesses.map((w) => (
            <div key={w.id} className="mt-2 border rounded p-3">
              <div className="text-sm font-medium">{w.name}</div>
              <div className="text-sm text-gray-600">{w.contact}</div>
              <div className="text-sm mt-1">{w.statement}</div>
            </div>
          ))}
        </section>

        <section className="mt-4">
          <h4 className="font-semibold">Evidence</h4>
          {Object.keys(evidenceLinks).length === 0 && <div className="text-sm text-gray-600">No evidence uploaded.</div>}
          <ul className="mt-2">
            {Object.entries(evidenceLinks).map(([eid, url]) => (
              <li key={eid}><a className="text-blue-600" href={url} target="_blank" rel="noreferrer">View attachment</a></li>
            ))}
          </ul>
        </section>

        <section className="mt-4">
          <h4 className="font-semibold">Status Timeline</h4>
          {history.length === 0 && <div className="text-sm text-gray-600">No history yet.</div>}
          <ol className="mt-2 border-l-2 border-gray-200 pl-4">
            {history.map((h) => (
              <li key={h.id} className="mb-3">
                <div className="text-sm font-medium">{h.new_status}</div>
                <div className="text-xs text-gray-600">{new Date(h.created_at).toLocaleString()}</div>
                {h.note && <div className="text-sm mt-1">{h.note}</div>}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}
