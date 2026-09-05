import { supabase } from '../lib/supabase'
import { createNotification } from './notifications'

export async function getMessagesForComplaint(complaintId: string) {
  const { data, error } = await supabase.from('complaint_messages').select('*').eq('complaint_id', complaintId).order('created_at', { ascending: true })
  return { data, error }
}

export async function sendMessage(complaintId: string, senderId: string, message: string, isInternal = false) {
  const payload = { complaint_id: complaintId, sender_id: senderId, message, is_internal: isInternal }
  const { data, error } = await supabase.from('complaint_messages').insert(payload).select().single()
  if (error) return { data: null, error }

  // create notification for the other party
  try {
    const { data: complaint } = await supabase.from('complaints').select('*').eq('id', complaintId).single()
    if (complaint) {
      if (isInternal) {
        if (complaint.assigned_officer_id && complaint.assigned_officer_id !== senderId) {
          await createNotification(complaint.assigned_officer_id, 'New internal note', `An internal note was added for ${complaint.complaint_number}` , complaintId)
        }
      } else {
        if (senderId === complaint.passenger_id) {
          if (complaint.assigned_officer_id) await createNotification(complaint.assigned_officer_id, 'New message from passenger', `New message on ${complaint.complaint_number}` , complaintId)
        } else {
          if (complaint.passenger_id) await createNotification(complaint.passenger_id, 'New message from authority', `New message on ${complaint.complaint_number}` , complaintId)
        }
      }
    }
  } catch (e) {
    console.error('notification error', e)
  }

  return { data, error: null }
}
