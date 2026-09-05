import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  User,
  AlertTriangle,
  CheckCircle,
  Phone,
  Bus,
  KeyRound
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getPasswordValidationError, isValidEmail, normalizeEmail } from '../../services/auth'

export default function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
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

    if (!name.trim()) {
      setError('Please enter your full name.')
      return
    }

    const cleanEmail = normalizeEmail(email)
    const passwordError = getPasswordValidationError(password)

    if (!isValidEmail(cleanEmail)) {
      setError('Please enter a valid email address.')
      return
    }
    if (passwordError) {
      setError(passwordError)
      return
    }
    if (password !== confirmation) {
      setError('Passwords do not match.')
      return
    }

    setError(null)
    setMessage(null)
    setIsSubmitting(true)

    try {
      const result = await signUp(cleanEmail, password, name.trim())
      if (result.error) {
        setError(result.error.message || 'We could not create your account. Please try again.')
        setIsSubmitting(false)
        return
      }

      setMessage('Passenger account created successfully! Redirecting to your dashboard...')
      setTimeout(() => {
        navigate('/passenger/dashboard', { replace: true })
      }, 1200)
    } catch (err: any) {
      setError(err.message || 'Account creation encountered an error.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container flex min-h-[calc(100vh-72px)] items-center justify-center py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 md:grid-cols-[0.85fr_1.15fr]">
        
        {/* Left Side Banner */}
        <section className="relative hidden overflow-hidden bg-[#17202a] p-8 text-white md:flex flex-col justify-between">
          <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full border-[34px] border-[#1261d6]/60" />
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full border-[28px] border-[#e96b4c]/50" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2 text-lg font-bold">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1261d6]">
                <ShieldCheck size={20} />
              </span>
              <span>Lulu Smart Travel</span>
            </div>

            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                Public Commuter Enrollment
              </span>
              <h2 className="mt-3 text-2xl font-bold leading-snug">
                Join Coimbatore's Smart Transit Network
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-slate-300">
                Track local buses in real-time, compute Vidiyal Payanam zero-fare passes, set smart arrival alarms, and file transparent citizen grievances.
              </p>
            </div>

            {/* Strict RBAC Advisory Notice */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <AlertTriangle size={16} />
                <span>Notice for Drivers & Transit Staff</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-200/90">
                <strong>Drivers</strong> and <strong>Transport Officials</strong> cannot register here. Your operational credentials and vehicle assignments are provisioned directly by the <strong>Super Administrator</strong>.
              </p>
              <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between">
                <span className="text-[10px] text-amber-300/80">Already have staff credentials?</span>
                <Link
                  to="/login?role=driver"
                  className="font-bold underline text-amber-300 hover:text-white text-[11px]"
                >
                  Staff Login →
                </Link>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 text-[11px] font-medium text-slate-400 flex items-center justify-between border-t border-slate-800">
            <span>Passenger Data Protection Guaranteed</span>
            <span>Free Citizen Account</span>
          </div>
        </section>

        {/* Right Form */}
        <section className="p-6 sm:p-8 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            
            {/* Passenger Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-3">
              <User size={13} />
              <span>Passenger Registration</span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900">Create Citizen Account</h1>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Sign up freely to save your favorite routes, view live bus ETA, and manage complaint cases.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3.5" noValidate>
              <div>
                <label htmlFor="signup-name" className="mb-1 block text-xs font-bold text-slate-700">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    aria-hidden="true"
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="signup-name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={100}
                    className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 font-medium"
                    placeholder="e.g. Ananya Selvaraj"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className="mb-1 block text-xs font-bold text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    aria-hidden="true"
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="signup-email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    inputMode="email"
                    maxLength={254}
                    required
                    className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 font-medium"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-phone" className="mb-1 block text-xs font-bold text-slate-700">
                  Mobile Number <span className="font-normal text-slate-400">(Optional for SMS alerts)</span>
                </label>
                <div className="relative">
                  <Phone
                    aria-hidden="true"
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="signup-phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 font-medium"
                    placeholder="+91 98xxx xxxxx"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-password" className="mb-1 block text-xs font-bold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    aria-hidden="true"
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="signup-password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-10 text-xs outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 font-medium"
                    placeholder="At least 10 chars with uppercase & number"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="signup-confirm" className="mb-1 block text-xs font-bold text-slate-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    aria-hidden="true"
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="signup-confirm"
                    name="confirmation"
                    value={confirmation}
                    onChange={(e) => setConfirmation(e.target.value)}
                    autoComplete="new-password"
                    type={showConfirmation ? 'text' : 'password'}
                    required
                    className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-10 text-xs outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 font-medium"
                    placeholder="Repeat password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmation(!showConfirmation)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmation ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-medium text-red-700 flex items-start gap-2">
                  <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {message && (
                <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs font-medium text-emerald-700 flex items-start gap-2">
                  <CheckCircle size={15} className="shrink-0 mt-0.5" />
                  <span>{message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="button-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Registering Passenger Account...' : 'Register as Citizen Passenger'}
                {!isSubmitting && <ArrowRight size={15} />}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-100 text-center space-y-2 text-xs">
              <p className="text-slate-500">
                Already registered?{' '}
                <Link to="/login" className="font-bold text-[#1261d6] hover:underline">
                  Sign in here
                </Link>
              </p>
              <div className="pt-1 flex items-center justify-center gap-4 text-[11px] text-slate-400">
                <Link to="/login?role=driver" className="hover:text-emerald-700 font-medium">
                  Driver Login
                </Link>
                <span>•</span>
                <Link to="/login?role=admin" className="hover:text-amber-700 font-medium">
                  Depot Admin
                </Link>
                <span>•</span>
                <Link to="/login?role=super_admin" className="hover:text-purple-700 font-medium">
                  Super Admin
                </Link>
              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  )
}
