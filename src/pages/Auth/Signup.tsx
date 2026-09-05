import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { upsertProfile } from '../../services/profiles'

export default function SignupPage() {
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = await signUp(email, password)
    if (res.error) {
      setError(res.error.message)
    } else {
      // create basic profile record (role: passenger)
      const userId = res.data?.user?.id
      if (userId) {
        await upsertProfile({ id: userId, email, role: 'passenger' })
      }
      navigate('/passenger/dashboard')
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto card">
        <h3 className="text-xl font-semibold">Create account</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border rounded px-3 py-2" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border rounded px-3 py-2" />
          {error && <div className="text-red-600">{error}</div>}
          <button className="w-full bg-blue-600 text-white px-3 py-2 rounded">Create account</button>
        </form>
      </div>
    </div>
  )
}
