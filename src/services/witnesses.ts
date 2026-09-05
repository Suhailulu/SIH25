import { supabase } from '../lib/supabase'

export async function createWitnesses(complaintId: string, witnesses: Array<{ name?: string; contact?: string; statement?: string }>) {
  if (!witnesses || witnesses.length === 0) return { data: null, error: null }
  const payload = witnesses.map((w) => ({ complaint_id: complaintId, name: w.name, contact: w.contact, statement: w.statement }))
  const { data, error } = await supabase.from('witnesses').insert(payload).select()
  return { data, error }
}
