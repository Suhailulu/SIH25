import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getNotificationsForUser, markNotificationRead, markAllNotificationsRead } from '../services/notifications'

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getNotificationsForUser(user.id).then((res) => {
      setLoading(false)
      if (res.data) setNotifications(res.data)
    })
  }, [user])

  async function handleMarkRead(id: string) {
    await markNotificationRead(id)
    setNotifications((s) => s.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
  }

  async function handleMarkAll() {
    if (!user) return
    await markAllNotificationsRead(user.id)
    setNotifications((s) => s.map((n) => ({ ...n, is_read: true })))
  }

  if (!user) return <div className="container py-8">Sign in to view notifications.</div>

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Notifications</h3>
        <div>
          <button className="text-sm text-blue-600" onClick={handleMarkAll}>Mark all read</button>
        </div>
      </div>

      {loading && <div>Loading...</div>}

      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className={`card ${n.is_read ? 'bg-white' : 'bg-blue-50'}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{n.title}</div>
                <div className="text-sm text-gray-600">{n.message}</div>
                <div className="text-xs text-gray-500 mt-1">{new Date(n.created_at).toLocaleString()}</div>
              </div>
              {!n.is_read && <button className="text-blue-600 text-sm" onClick={() => handleMarkRead(n.id)}>Mark read</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
