import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { GENERIC_AUTH_ERROR, isValidEmail, normalizeEmail } from '../../services/auth'
import { getProfile } from '../../services/profiles'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (isSubmitting) return
    const cleanEmail = normalizeEmail(email)
    if (!isValidEmail(cleanEmail)) {
      setError('Enter a valid email address.')
      return
    }
    if (!password) {
      setError('Enter your password.')
      return
    }

    setError(null)
    setIsSubmitting(true)
    const result = await signIn(cleanEmail, password)
    if (result.error) {
      setError(GENERIC_AUTH_ERROR)
      setIsSubmitting(false)
      return
    }

    const profile = result.data?.user?.id ? await getProfile(result.data.user.id) : null
    const role = profile?.data?.role
    navigate(role === 'admin' ? '/admin/analytics' : role === 'authority' ? '/authority/dashboard' : '/passenger/dashboard', { replace: true })
  }

  return (
    <main className="container flex min-h-[calc(100vh-72px)] items-center justify-center py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 md:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-[#17202a] p-10 text-white md:block">
          <div className="absolute -right-20 -top-16 h-56 w-56 rounded-full border-[34px] border-[#e96b4c]/70" />
          <div className="relative flex h-full flex-col justify-between">
            <div><div className="flex items-center gap-2 text-lg font-bold"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1261d6]"><ShieldCheck size={19} /></span>Lulu Smart Travel</div><p className="mt-16 max-w-xs text-3xl font-bold leading-tight">Keep your journey moving forward.</p><p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">Securely access your complaints, evidence, messages, and resolution updates.</p></div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Your voice matters</div>
          </div>
        </section>

        <section className="p-6 sm:p-10">
          <div className="max-w-md">
            <p className="eyebrow">Welcome back</p>
            <h1 className="mt-2 text-3xl font-bold">Sign in to your account</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Manage your reports and stay informed about every update.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
              <div><label htmlFor="login-email" className="mb-2 block text-sm font-bold text-slate-700">Email address</label><div className="relative"><Mail aria-hidden="true" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input id="login-email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" inputMode="email" maxLength={254} required aria-invalid={Boolean(error && !isValidEmail(email))} className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-[#1261d6] focus:ring-4 focus:ring-blue-100" placeholder="you@example.com" /></div></div>
              <div><div className="mb-2 flex items-center justify-between"><label htmlFor="login-password" className="block text-sm font-bold text-slate-700">Password</label><Link to="/forgot-password" className="text-xs font-bold text-[#1261d6] hover:underline">Forgot password?</Link></div><div className="relative"><Lock aria-hidden="true" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input id="login-password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" type={showPassword ? 'text' : 'password'} maxLength={128} required className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-11 text-sm outline-none transition focus:border-[#1261d6] focus:ring-4 focus:ring-blue-100" placeholder="Enter your password" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:text-[#1261d6]"><span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
              {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">{error}</div>}
              <button type="submit" disabled={isSubmitting} className="button-primary w-full disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Signing in...' : 'Sign in'}{!isSubmitting && <ArrowRight size={17} />}</button>
            </form>
            <p className="mt-7 text-center text-sm text-slate-500">New to Lulu Smart Travel? <Link to="/signup" className="font-bold text-[#1261d6] hover:underline">Create an account</Link></p>
          </div>
        </section>
      </div>
    </main>
  )
}
