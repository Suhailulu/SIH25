import React, { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ManageProfiles() {
  const [authId, setAuthId] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('passenger')
  const [message, setMessage] = useState('')

  async function handleCreateOrUpdate() {
    if (!authId || !email) { setMessage('Auth ID and email required'); return }
    const payload = { id: authId, full_name: fullName || null, email, role }
    const { data, error } = await supabase.from('profiles').upsert(payload).select().single()
    if (error) setMessage('Error: ' + error.message)
    else setMessage('Profile upserted: ' + data.id)
  }

  return (
    <div className="container py-8">
      <div className="card max-w-xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">Manage Profiles (Admin)</h2>
        <label className="block text-sm">Auth User ID</label>
        <input value={authId} onChange={(e) => setAuthId(e.target.value)} className="w-full border rounded px-3 py-2 mb-2" placeholder="auth user UUID" />
        <label className="block text-sm">Full name</label>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border rounded px-3 py-2 mb-2" placeholder="Full name" />
        <label className="block text-sm">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2 mb-2" placeholder="email" />
        <label className="block text-sm">Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full border rounded px-3 py-2 mb-4">
          <option value="passenger">passenger</option>
          <option value="authority">authority</option>
          <option value="admin">admin</option>
        </select>
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleCreateOrUpdate}>Upsert Profile</button>
        </div>
        {message && <div className="mt-3 text-sm text-gray-700">{message}</div>}
      </div>
    </div>
  )
}
