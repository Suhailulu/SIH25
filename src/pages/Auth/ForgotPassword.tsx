import React, { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/'
    })
    if (error) setMessage(error.message)
    else setMessage('If the email exists, a reset link has been sent.')
  }

  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto card">
        <h3 className="text-xl font-semibold">Reset password</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border rounded px-3 py-2" />
          {message && <div className="text-sm text-gray-700">{message}</div>}
          <button className="w-full bg-blue-600 text-white px-3 py-2 rounded">Send reset link</button>
        </form>
      </div>
    </div>
  )
}
