import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { KeyRound, ArrowRight } from 'lucide-react'

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
    <div className="container py-8 max-w-xl">
      {/* Link to Full Super Admin RBAC Console */}
      <div className="mb-6 p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-purple-600 text-white">
            <KeyRound size={18} />
          </span>
          <div>
            <div className="text-xs font-bold text-purple-950">Looking for RBAC Governance?</div>
            <div className="text-[11px] text-purple-700">Provision drivers, assign routes & audit logs in Super Admin Console</div>
          </div>
        </div>
        <Link
          to="/super-admin"
          className="button-primary bg-purple-600 hover:bg-purple-700 text-xs py-1.5 px-3 flex items-center gap-1"
        >
          <span>Open Console</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="card">
        <h2 className="text-base font-bold mb-3 text-slate-900">Direct Supabase Profile Upsert</h2>
        <label className="block text-xs font-bold text-slate-700 mb-1">Auth User ID (UUID)</label>
        <input value={authId} onChange={(e) => setAuthId(e.target.value)} className="w-full border rounded-xl px-3 py-2 mb-3 text-xs" placeholder="auth user UUID" />
        <label className="block text-xs font-bold text-slate-700 mb-1">Full name</label>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border rounded-xl px-3 py-2 mb-3 text-xs" placeholder="Full name" />
        <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-xl px-3 py-2 mb-3 text-xs" placeholder="email" />
        <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full border rounded-xl px-3 py-2 mb-4 text-xs bg-white">
          <option value="passenger">passenger</option>
          <option value="driver">driver</option>
          <option value="admin">admin</option>
          <option value="super_admin">super_admin</option>
          <option value="authority">authority</option>
        </select>
        <div className="flex justify-end">
          <button className="button-primary text-xs py-2 px-4" onClick={handleCreateOrUpdate}>Upsert Profile</button>
        </div>
        {message && <div className="mt-3 text-xs text-slate-700 font-medium">{message}</div>}
      </div>
    </div>
  )
}
