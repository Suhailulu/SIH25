import { supabase } from '../lib/supabase'

export async function createNotification(userId: string, title: string, message: string, relatedComplaintId?: string) {
  const payload: any = {
    user_id: userId,
    title,
    message,
    related_complaint_id: relatedComplaintId
  }
  const { data, error } = await supabase.from('notifications').insert(payload).select().single()
  return { data, error }
}

export async function getNotificationsForUser(userId: string) {
  const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return { data, error }
}

export async function markNotificationRead(notificationId: string) {
  const { data, error } = await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId).select().single()
  return { data, error }
}

export async function markAllNotificationsRead(userId: string) {
  const { data, error } = await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).select()
  return { data, error }
}

export function subscribeToNotifications(userId: string, onInsert: (payload: any) => void) {
  if (!userId) return null
  const channel = supabase.channel(`public:notifications:user=${userId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, (payload) => {
      try { onInsert(payload.new) } catch (e) { console.error('notify cb error', e) }
    })
    .subscribe()

  return {
    unsubscribe: async () => {
      try { await channel.unsubscribe() } catch (e) { console.error('unsubscribe error', e) }
    }
  }
}
