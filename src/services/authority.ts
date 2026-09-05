import { supabase } from '../lib/supabase'

export async function getRecentComplaints(limit = 10) {
  const { data, error } = await supabase.from('complaints').select('*').order('created_at', { ascending: false }).limit(limit)
  return { data, error }
}

export async function getAssignedComplaints(officerId: string) {
  const { data, error } = await supabase.from('complaints').select('*').eq('assigned_officer_id', officerId).order('created_at', { ascending: false })
  return { data, error }
}

export async function assignComplaint(complaintId: string, officerId: string) {
  const { data, error } = await supabase.from('complaints').update({ assigned_officer_id: officerId, current_status: 'Assigned to Officer' }).eq('id', complaintId).select().single()
  // insert authority action
  await supabase.from('authority_actions').insert({ complaint_id: complaintId, officer_id: officerId, action_type: 'assign', description: `Assigned to officer ${officerId}` })
  // insert status history
  await supabase.from('complaint_status_history').insert({ complaint_id: complaintId, previous_status: null, new_status: 'Assigned to Officer', updated_by: officerId, note: 'Assigned by officer' })
  return { data, error }
}

export async function updateComplaintStatus(complaintId: string, newStatus: string, officerId: string, note?: string) {
  const { data, error } = await supabase.from('complaints').update({ current_status: newStatus }).eq('id', complaintId).select().single()
  await supabase.from('complaint_status_history').insert({ complaint_id: complaintId, previous_status: null, new_status: newStatus, updated_by: officerId, note: note || null })
  await supabase.from('authority_actions').insert({ complaint_id: complaintId, officer_id: officerId, action_type: 'status_update', description: note || `Status updated to ${newStatus}` })
  return { data, error }
}

export async function addInternalNote(complaintId: string, officerId: string, message: string) {
  const { data, error } = await supabase.from('complaint_messages').insert({ complaint_id: complaintId, sender_id: officerId, message, is_internal: true }).select().single()
  return { data, error }
}
