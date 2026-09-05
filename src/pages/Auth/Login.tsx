import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginPage() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = await signIn(email, password)
    if (res.error) {
      setError(res.error.message)
    } else {
      navigate('/passenger/dashboard')
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto card">
        <h3 className="text-xl font-semibold">Sign in</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border rounded px-3 py-2" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border rounded px-3 py-2" />
          {error && <div className="text-red-600">{error}</div>}
          <button className="w-full bg-blue-600 text-white px-3 py-2 rounded">Sign in</button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          <Link to="/signup" className="text-blue-600">Create an account</Link> · <Link to="/forgot-password" className="text-blue-600">Forgot password</Link>
        </div>
      </div>
    </div>
  )
}
