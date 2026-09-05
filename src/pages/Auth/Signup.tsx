import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getPasswordValidationError, isValidEmail, normalizeEmail } from '../../services/auth'
import { upsertProfile } from '../../services/profiles'

export default function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (isSubmitting) return
    const cleanEmail = normalizeEmail(email)
    const passwordError = getPasswordValidationError(password)
    if (!isValidEmail(cleanEmail)) return setError('Enter a valid email address.')
    if (passwordError) return setError(passwordError)
    if (password !== confirmation) return setError('Passwords do not match.')
    setError(null)
    setMessage(null)
    setIsSubmitting(true)
    const result = await signUp(cleanEmail, password)
    if (result.error) {
      setError('We could not create your account. Check your details and try again.')
      setIsSubmitting(false)
      return
    }
    const userId = result.data?.user?.id
    if (userId) {
      const profile = await upsertProfile({ id: userId, email: cleanEmail, role: 'passenger' })
      if (profile.error) {
        setError('Your account was created, but setup is incomplete. Please contact support.')
        setIsSubmitting(false)
        return
      }
    }
    if (result.data?.session) navigate('/passenger/dashboard', { replace: true })
    else setMessage('Account created. Check your email to confirm your address before signing in.')
    setIsSubmitting(false)
  }

  return (
    <main className="container flex min-h-[calc(100vh-72px)] items-center justify-center py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 md:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-[#17202a] p-10 text-white md:block">
          <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full border-[34px] border-[#1261d6]/70" />
          <div className="relative flex h-full flex-col justify-between">
            <div><div className="flex items-center gap-2 text-lg font-bold"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1261d6]"><ShieldCheck size={19} /></span>Lulu Smart Travel</div><p className="mt-16 max-w-xs text-3xl font-bold leading-tight">A better way to be heard.</p><p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">Create a secure passenger account to report issues and track your journey.</p></div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Your voice matters</div>
          </div>
        </section>
        <section className="p-6 sm:p-10">
          <div className="max-w-md"><p className="eyebrow">Get started</p><h1 className="mt-2 text-3xl font-bold">Create your account</h1><p className="mt-2 text-sm leading-6 text-slate-500">Your account is created as a passenger. Staff roles are assigned separately by administrators.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
              <div><label htmlFor="signup-email" className="mb-2 block text-sm font-bold text-slate-700">Email address</label><div className="relative"><Mail aria-hidden="true" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input id="signup-email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" inputMode="email" maxLength={254} required className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-[#1261d6] focus:ring-4 focus:ring-blue-100" placeholder="you@example.com" /></div></div>
              <PasswordField id="signup-password" label="Password" value={password} onChange={setPassword} visible={showPassword} onToggle={() => setShowPassword((visible) => !visible)} placeholder="At least 10 characters" autoComplete="new-password" />
              <PasswordField id="signup-confirmation" label="Confirm password" value={confirmation} onChange={setConfirmation} visible={showConfirmation} onToggle={() => setShowConfirmation((visible) => !visible)} placeholder="Repeat your password" autoComplete="new-password" />
              {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">{error}</div>}
              {message && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-700">{message}</div>}
              <button type="submit" disabled={isSubmitting} className="button-primary w-full disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Creating account...' : 'Create account'}{!isSubmitting && <ArrowRight size={17} />}</button>
            </form>
            <p className="mt-7 text-center text-sm text-slate-500">Already registered? <Link to="/login" className="font-bold text-[#1261d6] hover:underline">Sign in</Link></p>
          </div>
        </section>
      </div>
    </main>
  )
}

function PasswordField({ id, label, value, onChange, visible, onToggle, placeholder, autoComplete }: { id: string; label: string; value: string; onChange: (value: string) => void; visible: boolean; onToggle: () => void; placeholder: string; autoComplete: string }) {
  return <div><label htmlFor={id} className="mb-2 block text-sm font-bold text-slate-700">{label}</label><div className="relative"><Lock aria-hidden="true" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input id={id} name={id} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} type={visible ? 'text' : 'password'} maxLength={128} required className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-11 text-sm outline-none focus:border-[#1261d6] focus:ring-4 focus:ring-blue-100" placeholder={placeholder} /><button type="button" aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} onClick={onToggle} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:text-[#1261d6]">{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
}
