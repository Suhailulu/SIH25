import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { getComplaintById, getEvidenceSignedUrl, subscribeToEvidence } from '../../../services/complaints'
import { assignComplaint, updateComplaintStatus, addInternalNote } from '../../../services/authority'
import { getMessagesForComplaint, sendMessage, subscribeToMessages } from '../../../services/messages'
import { supabase } from '../../../lib/supabase'

export default function AuthorityComplaintDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const [complaint, setComplaint] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [note, setNote] = useState('')
  const [evidenceLinks, setEvidenceLinks] = useState<Record<string,string>>({})
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    if (!id) return
    let msgSub: any = null
    let evSub: any = null
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

        const msgs = await getMessagesForComplaint(id)
        if (msgs.data) setMessages(msgs.data)

        msgSub = subscribeToMessages(id, (m) => setMessages((s) => [...s, m]))
        evSub = subscribeToEvidence(id, async (e) => {
          if (e.file_path) {
            const signed = await getEvidenceSignedUrl(e.file_path, 60)
            if (signed && signed.data && (signed.data as any).signedUrl) {
              setEvidenceLinks((s) => ({ ...s, [e.id]: (signed.data as any).signedUrl }))
            }
          }
        })
      }
    })()

    return () => {
      if (msgSub && msgSub.unsubscribe) msgSub.unsubscribe()
      if (evSub && evSub.unsubscribe) evSub.unsubscribe()
    }
  }, [id])

  if (!user) return <div className="container py-8">Sign in to view.</div>
  if (loading) return <div className="container py-8">Loading...</div>
  if (!complaint) return <div className="container py-8">Complaint not found.</div>

  async function handleAssign() {
    if (!user) return
    await assignComplaint(complaint.id, user.id)
    setComplaint({ ...complaint, assigned_officer_id: user.id, current_status: 'Assigned to Officer' })
  }

  async function handleStatusChange(newStatus: string) {
    if (!user) return
    await updateComplaintStatus(complaint.id, newStatus, user.id, `Updated by ${user.id}`)
    setComplaint({ ...complaint, current_status: newStatus })
  }

  async function handleAddNote() {
    if (!user || !note) return
    await addInternalNote(complaint.id, user.id, note)
    setNote('')
    const msgs = await getMessagesForComplaint(complaint.id)
    if (msgs.data) setMessages(msgs.data)
  }

  async function handleSendMessage() {
    if (!newMessage.trim() || !user) return
    await sendMessage(complaint.id, user.id, newMessage.trim(), false)
    setNewMessage('')
    const msgs = await getMessagesForComplaint(complaint.id)
    if (msgs.data) setMessages(msgs.data)
  }

  return (
    <div className="container py-8">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">{complaint.complaint_number}</div>
            <h3 className="text-xl font-semibold">{complaint.category}</h3>
            <div className="text-sm text-gray-600">Status: {complaint.current_status}</div>
            <div className="text-sm text-gray-600">Assigned: {complaint.assigned_officer_id || 'Unassigned'}</div>
          </div>
          <div className="flex flex-col gap-2">
            {!complaint.assigned_officer_id && <button className="px-3 py-1 border rounded" onClick={handleAssign}>Assign to me</button>}
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded" onClick={() => handleStatusChange('Under Review')}>Under Review</button>
              <button className="px-3 py-1 border rounded" onClick={() => handleStatusChange('Investigation in Progress')}>Investigate</button>
              <button className="px-3 py-1 border rounded" onClick={() => handleStatusChange('Resolved')}>Resolve</button>
            </div>
          </div>
        </div>

        <section className="mt-4">
          <h4 className="font-semibold">Incident Details</h4>
          <p className="text-sm text-gray-700">{complaint.description}</p>
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
          <h4 className="font-semibold">Internal Notes</h4>
          {messages.filter(m => m.is_internal).length === 0 && <div className="text-sm text-gray-600">No internal notes.</div>}
          <div className="mt-2 space-y-2">
            {messages.filter(m => m.is_internal).map((n) => (
              <div key={n.id} className="p-3 bg-gray-100 rounded">
                <div className="text-sm text-gray-600">{n.sender_id} · {new Date(n.created_at).toLocaleString()}</div>
                <div className="mt-1 text-sm">{n.message}</div>
              </div>
            ))}
          </div>
          <div className="mt-2">
            <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full border rounded px-3 py-2 h-24" placeholder="Add internal note (private)" />
            <div className="mt-2 text-right"><button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={handleAddNote}>Save note</button></div>
          </div>
        </section>

        <section className="mt-4">
          <h4 className="font-semibold">Message Thread</h4>
          {messages.filter(m => !m.is_internal).length === 0 && <div className="text-sm text-gray-600">No messages yet.</div>}
          <div className="mt-2 space-y-2">
            {messages.filter(m => !m.is_internal).map((m) => (
              <div key={m.id} className={`p-3 rounded ${m.is_internal ? 'bg-gray-100' : 'bg-white'}`}>
                <div className="text-sm text-gray-600">{m.sender_id} · {new Date(m.created_at).toLocaleString()}</div>
                <div className="mt-1 text-sm">{m.message}</div>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="w-full border rounded px-3 py-2 h-20" placeholder="Write a public message to the passenger" />
            <div className="mt-2 flex justify-end">
              <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
