import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getProfile, upsertProfile } from '../../services/profiles'

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    getProfile(user.id).then((res) => {
      if (res.data) {
        setProfile(res.data)
        setFullName(res.data.full_name || '')
        setPhone(res.data.phone || '')
      }
    })
  }, [user])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    const res = await upsertProfile({ id: user.id, full_name: fullName, phone })
    setSaving(false)
    if (res.error) setMessage('Failed to save profile')
    else setMessage('Profile saved')
  }

  if (!user) return <div className="container py-8">Sign in to view your profile.</div>

  return (
    <div className="container py-8">
      <div className="card max-w-md">
        <h3 className="text-lg font-semibold">My Profile</h3>
        <form onSubmit={handleSave} className="mt-4 space-y-3">
          <div>
            <label className="text-sm text-gray-700">Email</label>
            <div className="mt-1">{user.email}</div>
          </div>

          <div>
            <label className="text-sm text-gray-700">Full name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
          </div>

          <div>
            <label className="text-sm text-gray-700">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
          </div>

          <div>
            <label className="text-sm text-gray-700">Role</label>
            <div className="mt-1">{profile?.role || 'passenger'}</div>
          </div>

          <div className="flex justify-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
        {message && <div className="mt-3 text-sm text-gray-700">{message}</div>}
      </div>
    </div>
  )
}
