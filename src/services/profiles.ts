import { supabase } from '../lib/supabase'

export async function getProfile(userId: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return { data, error }
}

export async function upsertProfile(profile: { id: string; full_name?: string; email?: string; phone?: string; role?: string }) {
  const { data, error } = await supabase.from('profiles').upsert(profile)
  return { data, error }
}
