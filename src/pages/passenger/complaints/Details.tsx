import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { getComplaintById, getEvidenceSignedUrl } from '../../../services/complaints'
import { getMessagesForComplaint, sendMessage } from '../../../services/messages'
import { supabase } from '../../../lib/supabase'
import { subscribeToMessages } from '../../../services/messages'
import { subscribeToEvidence } from '../../../services/complaints'
import { useToasts } from '../../../contexts/ToastContext'

export default function ComplaintDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const { push } = useToasts()
  const [complaint, setComplaint] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [evidenceLinks, setEvidenceLinks] = useState<Record<string,string>>({})
  const [tickets, setTickets] = useState<any[]>([])
  const [witnesses, setWitnesses] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')

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

        const msgs = await getMessagesForComplaint(id)
        if (msgs.data) setMessages(msgs.data)
        // subscribe to realtime messages and evidence
        const msgSub = subscribeToMessages(id, (m) => {
          setMessages((s) => [...s, m])
          if (m && !m.is_internal) push({ title: 'New message', message: m.message })
        })
        const evSub = subscribeToEvidence(id, async (e) => {
          // fetch signed url and append
          if (e.file_path) {
            const signed = await getEvidenceSignedUrl(e.file_path, 60)
            if (signed.data) setEvidenceLinks((s) => ({ ...s, [e.id]: signed.data.signedUrl }))
            push({ title: 'New evidence', message: `New evidence uploaded for ${complaint.complaint_number}` })
          }
        })
        // cleanup when id changes/unmount
        return () => { if (msgSub && msgSub.unsubscribe) msgSub.unsubscribe(); if (evSub && evSub.unsubscribe) evSub.unsubscribe() }
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
          <h4 className="font-semibold">Messages</h4>
          {messages.length === 0 && <div className="text-sm text-gray-600">No messages yet.</div>}
          <div className="mt-2 space-y-2">
            {messages.map((m) => (
              <div key={m.id} className={`p-3 rounded ${m.is_internal ? 'bg-gray-100' : 'bg-white'}`}>
                <div className="text-sm text-gray-600">{m.sender_id} · {new Date(m.created_at).toLocaleString()}</div>
                <div className="mt-1 text-sm">{m.message}</div>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="w-full border rounded px-3 py-2 h-20" placeholder="Write a message to the authority" />
            <div className="mt-2 flex justify-end">
              <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={async () => {
                if (!newMessage.trim()) return
                await sendMessage(complaint.id, user.id, newMessage.trim(), false)
                setMessages((s) => [...s, { id: Date.now().toString(), sender_id: user.id, message: newMessage.trim(), is_internal: false, created_at: new Date().toISOString() }])
                setNewMessage('')
              }}>Send</button>
            </div>
          </div>
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
