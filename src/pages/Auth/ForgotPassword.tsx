import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { isValidEmail, normalizeEmail } from '../../services/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    const cleanEmail = normalizeEmail(email)
    if (!isValidEmail(cleanEmail)) {
      setMessage('Enter a valid email address.')
      return
    }
    setIsSubmitting(true)
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: window.location.origin + '/'
    })
    setIsSubmitting(false)
    if (error) setMessage('If the email exists, a reset link has been sent.')
    else setMessage('If the email exists, a reset link has been sent.')
  }

  return (
    <main className="container flex min-h-[calc(100vh-72px)] items-center justify-center py-10">
      <div className="card w-full max-w-md">
        <Link to="/login" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#1261d6]"><ArrowLeft size={16} /> Back to sign in</Link>
        <p className="eyebrow">Account recovery</p>
        <h1 className="mt-2 text-3xl font-bold">Reset your password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Enter your email and we will send recovery instructions if an account exists.</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
          <label htmlFor="reset-email" className="block text-sm font-bold text-slate-700">Email address</label>
          <div className="relative"><Mail aria-hidden="true" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input id="reset-email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" maxLength={254} required placeholder="you@example.com" className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-[#1261d6] focus:ring-4 focus:ring-blue-100" /></div>
          {message && <div role="status" className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm text-blue-800">{message}</div>}
          <button type="submit" disabled={isSubmitting} className="button-primary w-full disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Sending...' : 'Send reset link'}</button>
        </form>
      </div>
    </main>
  )
}
