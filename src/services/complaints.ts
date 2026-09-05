import { supabase } from '../lib/supabase'

export async function createComplaint(payload: any) {
  // payload should contain passenger_id and complaint fields per schema
  const { data, error } = await supabase.from('complaints').insert(payload).select().single()
  return { data, error }
}

export async function uploadEvidence(file: File, complaintId: string, uploadedBy: string) {
  // ensure a bucket named 'evidence' exists in Supabase storage
  const path = `${complaintId}/${Date.now()}_${file.name}`
  const { data, error } = await supabase.storage.from('evidence').upload(path, file)
  if (error) return { data: null, error }
  const publicUrl = supabase.storage.from('evidence').getPublicUrl(path)
  // Save record in evidence table
  const { data: record, error: recErr } = await supabase.from('evidence').insert({
    complaint_id: complaintId,
    evidence_type: file.type,
    file_path: path,
    file_name: file.name,
    mime_type: file.type,
    file_size: file.size,
    uploaded_by: uploadedBy
  }).select().single()

  return { data: record, error: recErr || null, publicUrl }
}

export async function getComplaintsByPassenger(passengerId: string) {
  const { data, error } = await supabase.from('complaints').select('*').eq('passenger_id', passengerId).order('created_at', { ascending: false })
  return { data, error }
}

export async function getComplaintById(id: string) {
  const { data, error } = await supabase.from('complaints').select('*').eq('id', id).single()
  return { data, error }
}

export async function getComplaintByNumber(number: string) {
  const { data, error } = await supabase.from('complaints').select('*').eq('complaint_number', number).single()
  return { data, error }
}

export async function getEvidenceSignedUrl(path: string, expiresSec = 60) {
  try {
    const { data, error } = await supabase.storage.from('evidence').createSignedUrl(path, expiresSec)
    return { data, error }
  } catch (err) {
    return { data: null, error: err }
  }
}

export function subscribeToEvidence(complaintId: string, onInsert: (payload: any) => void) {
  if (!complaintId) return null
  const channel = supabase.channel(`public:evidence:complaint=${complaintId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'evidence', filter: `complaint_id=eq.${complaintId}` }, (payload) => {
      try { onInsert(payload.new) } catch (e) { console.error('evidence cb error', e) }
    })
    .subscribe()

  return {
    unsubscribe: async () => {
      try { await channel.unsubscribe() } catch (e) { console.error('unsubscribe error', e) }
    }
  }
}
