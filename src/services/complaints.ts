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
