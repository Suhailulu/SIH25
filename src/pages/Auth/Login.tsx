import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  User,
  Bus,
  Building2,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { AppRole } from '../../services/rbacService'
import { isValidEmail, normalizeEmail } from '../../services/auth'

interface RoleConfig {
  role: AppRole
  title: string
  label: string
  icon: React.ElementType
  badge: string
  color: string
  bgLight: string
  borderColor: string
  description: string
  defaultEmail: string
  defaultPass: string
  redirectUrl: string
  accessNotice: string
  canSignUp: boolean
}

const ROLES: RoleConfig[] = [
  {
    role: 'passenger',
    title: 'Passenger Portal',
    label: 'Passenger',
    icon: User,
    badge: 'Public Access',
    color: '#1261d6',
    bgLight: 'bg-blue-50/70',
    borderColor: 'border-blue-200',
    description: 'Citizens and daily commuters. Check live buses, plan multi-stop routes, calculate fares, and monitor complaints.',
    defaultEmail: 'passenger@lulusmart.local',
    defaultPass: 'Passenger@123',
    redirectUrl: '/passenger/dashboard',
    accessNotice: 'Passengers can register freely anytime without requiring prior permission.',
    canSignUp: true
  },
  {
    role: 'driver',
    title: 'Driver Cockpit',
    label: 'Driver',
    icon: Bus,
    badge: 'Authorized Staff',
    color: '#059669',
    bgLight: 'bg-emerald-50/70',
    borderColor: 'border-emerald-200',
    description: 'Authorized TNSTC bus operators. Broadcast live bus GPS, report route delays, update passenger count, and trigger safety SOS.',
    defaultEmail: 'driver.murugan@tnstc.local',
    defaultPass: 'Driver@12345',
    redirectUrl: '/driver/dashboard',
    accessNotice: 'Driver credentials and vehicle assignments are provisioned exclusively by the Super Administrator.',
    canSignUp: false
  },
  {
    role: 'admin',
    title: 'Transport Admin',
    label: 'Depot Admin',
    icon: Building2,
    badge: 'Authority Only',
    color: '#d97706',
    bgLight: 'bg-amber-50/70',
    borderColor: 'border-amber-200',
    description: 'Depot managers & transport officers. Manage fleet allocations, publish emergency service alerts, and adjudicate grievances.',
    defaultEmail: 'depot.admin@tnstc.local',
    defaultPass: 'Admin@12345',
    redirectUrl: '/admin',
    accessNotice: 'Depot administrator accounts are provisioned and audited by the State Super Administrator.',
    canSignUp: false
  },
  {
    role: 'super_admin',
    title: 'Super Admin Console',
    label: 'Super Admin',
    icon: KeyRound,
    badge: 'Chief Authority',
    color: '#7c3aed',
    bgLight: 'bg-purple-50/70',
    borderColor: 'border-purple-200',
    description: 'State Transport Directorate & System Administrators. Issue driver credentials, provision depot admins, assign routes, and monitor audit logs.',
    defaultEmail: 'duker2006love@gmail.com',
    defaultPass: 'Admin@12345',
    redirectUrl: '/super-admin',
    accessNotice: 'Master access controller. Sole authority permitted to grant driver and admin credentials.',
    canSignUp: false
  }
]

export default function LoginPage() {
  const { signIn, user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const requestedRole = searchParams.get('role') as AppRole | null
  const initialRole = ROLES.find((r) => r.role === requestedRole) ? requestedRole! : 'passenger'

  const [activeRole, setActiveRole] = useState<AppRole>(initialRole)
  const currentConfig = ROLES.find((r) => r.role === activeRole) || ROLES[0]

  const [email, setEmail] = useState(currentConfig.defaultEmail)
  const [password, setPassword] = useState(currentConfig.defaultPass)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requestModalOpen, setRequestModalOpen] = useState(false)

  // Update input defaults when switching role tab
  const handleRoleChange = (newRole: AppRole) => {
    setActiveRole(newRole)
    const conf = ROLES.find((r) => r.role === newRole)
    if (conf) {
      setEmail(conf.defaultEmail)
      setPassword(conf.defaultPass)
      setError(null)
    }
  }

  // Quick 1-Click Demo Login
  const handleQuickDemoLogin = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await signIn(currentConfig.defaultEmail, currentConfig.defaultPass)
      if (res.error) {
        setError(res.error.message || 'Login failed')
        setIsSubmitting(false)
        return
      }
      navigate(currentConfig.redirectUrl, { replace: true })
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (isSubmitting) return

    const cleanEmail = normalizeEmail(email)
    if (!isValidEmail(cleanEmail)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      const result = await signIn(cleanEmail, password)
      if (result.error) {
        setError(result.error.message || 'Invalid credentials. Check email and password or contact Super Admin.')
        setIsSubmitting(false)
        return
      }

      // Check role mismatch warning if any
      const loggedUser = result.data?.user
      if (loggedUser?.role && loggedUser.role !== activeRole && loggedUser.role !== 'super_admin') {
        // Redirect to appropriate role dashboard anyway
        const dest =
          loggedUser.role === 'driver'
            ? '/driver/dashboard'
            : loggedUser.role === 'admin'
            ? '/admin'
            : loggedUser.role === 'super_admin'
            ? '/super-admin'
            : '/passenger/dashboard'
        navigate(dest, { replace: true })
      } else {
        navigate(currentConfig.redirectUrl, { replace: true })
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container flex min-h-[calc(100vh-72px)] items-center justify-center py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 md:grid-cols-[0.85fr_1.15fr]">
        
        {/* Left Informational Showcase Panel */}
        <section className="relative hidden overflow-hidden bg-[#17202a] p-8 text-white md:flex flex-col justify-between">
          <div className="absolute -right-20 -top-16 h-56 w-56 rounded-full border-[34px] border-[#e96b4c]/60" />
          <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full border-[28px] border-[#1261d6]/50" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2 text-lg font-bold">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1261d6] shadow-sm">
                <ShieldCheck size={20} />
              </span>
              <span>Lulu Smart Travel</span>
            </div>

            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-slate-200 border border-white/20 uppercase tracking-wider">
                Role-Based Access Control
              </span>
              <h2 className="mt-3 text-2xl font-bold leading-snug">
                Unified Civic Mobility & Transit Management
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-slate-300">
                A multi-tiered platform connecting daily commuters, TNSTC bus operators, depot supervisors, and state transport commissioners into one synchronized network.
              </p>
            </div>

            {/* Role Hierarchy Matrix Preview */}
            <div className="space-y-2.5 rounded-2xl bg-slate-800/80 p-4 border border-slate-700/70 text-xs">
              <div className="font-bold text-slate-200 flex items-center gap-1.5 pb-2 border-b border-slate-700">
                <KeyRound size={14} className="text-[#e96b4c]" />
                <span>Governance & Permissions Rule</span>
              </div>
              <div className="space-y-2 text-[11px] text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-400 mt-1 shrink-0" />
                  <span><strong>Passengers:</strong> Self-registration enabled. Instant public access.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
                  <span><strong>Drivers:</strong> No self-registration. Credentials & bus assignments granted by Super Admin.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400 mt-1 shrink-0" />
                  <span><strong>Depot Admins:</strong> Station-level operational clearance issued by Super Admin.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="h-2 w-2 rounded-full bg-purple-400 mt-1 shrink-0" />
                  <span><strong>Super Admin:</strong> Full authority over RBAC provisioning, vehicle assignments, and audit logs.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 text-[11px] font-medium text-slate-400 flex items-center justify-between border-t border-slate-800">
            <span>Coimbatore Urban Division • TNSTC</span>
            <span>v2.4 Active</span>
          </div>
        </section>

        {/* Right Form Panel */}
        <section className="p-6 sm:p-8 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            
            {/* Role Switcher Tabs */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Select Your Portal Role:
              </label>
              <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200">
                {ROLES.map((r) => {
                  const Icon = r.icon
                  const isSelected = activeRole === r.role
                  return (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => handleRoleChange(r.role)}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-bold transition-all ${
                        isSelected
                          ? 'bg-white text-slate-900 shadow-md border border-slate-200'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                      }`}
                    >
                      <Icon
                        size={17}
                        style={{ color: isSelected ? r.color : undefined }}
                        className="mb-1"
                      />
                      <span className="truncate w-full text-center">{r.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Active Role Header Banner */}
            <div className={`p-4 rounded-2xl border ${currentConfig.borderColor} ${currentConfig.bgLight} mb-6 transition-all`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="p-1.5 rounded-lg text-white font-bold"
                    style={{ backgroundColor: currentConfig.color }}
                  >
                    <currentConfig.icon size={16} />
                  </span>
                  <div>
                    <h1 className="text-base font-bold text-slate-900 leading-none">
                      {currentConfig.title}
                    </h1>
                    <span className="text-[10px] font-semibold text-slate-500">
                      Role: <strong className="capitalize">{currentConfig.role}</strong>
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white shadow-xs border border-slate-200 text-slate-700">
                  {currentConfig.badge}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                {currentConfig.description}
              </p>
            </div>

            {/* Fast 1-Click Evaluation Shortcut */}
            <div className="mb-5 flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] text-slate-600">
                <span className="font-bold text-slate-800">Demo Account: </span>
                <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[#1261d6]">
                  {currentConfig.defaultEmail}
                </code>
              </div>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1 text-xs font-bold py-1.5 px-3 rounded-lg text-white shadow-xs transition hover:brightness-110 active:scale-95 disabled:opacity-50"
                style={{ backgroundColor: currentConfig.color }}
                title="Instant login with pre-configured demo credentials"
              >
                <Sparkles size={13} />
                <span>1-Click Sign In</span>
              </button>
            </div>

            {/* Standard Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-xs font-bold text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    aria-hidden="true"
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="login-email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    inputMode="email"
                    required
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-xs outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 font-medium"
                    placeholder="name@transport.tn.gov.in"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="login-password" className="block text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-[11px] font-bold text-[#1261d6] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    aria-hidden="true"
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="login-password"
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-11 text-xs outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 font-medium"
                    placeholder="Enter account password"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700 flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="button-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Authenticating...' : `Sign in to ${currentConfig.title}`}
                {!isSubmitting && <ArrowRight size={15} />}
              </button>
            </form>

            {/* Bottom Registration & Access Governance Notice */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              {currentConfig.canSignUp ? (
                <p className="text-xs text-slate-500">
                  New citizen commuter?{' '}
                  <Link to="/signup" className="font-bold text-[#1261d6] hover:underline">
                    Create a passenger account
                  </Link>
                </p>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                    <Info size={14} className="text-amber-600 shrink-0" />
                    <span>Self-Registration Restricted</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {currentConfig.accessNotice}
                  </p>
                  <button
                    type="button"
                    onClick={() => setRequestModalOpen(true)}
                    className="text-[11px] font-bold text-[#1261d6] hover:underline block pt-0.5"
                  >
                    Need an account? Inquire about Super Admin enrollment →
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Access Request Explainer Modal */}
      {requestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base mb-2">
              <KeyRound size={20} className="text-purple-600" />
              <h3>Transit Staff Access Governance</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              To guarantee fleet security and public safety, <strong>Driver</strong> and <strong>Transport Admin</strong> accounts cannot be self-registered on the web.
            </p>
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 space-y-2 text-xs text-slate-700 mb-4">
              <div>
                <strong>For Bus Drivers:</strong> Bring your commercial driving license and employee badge to your designated TNSTC depot officer. The Super Admin creates your profile and links your assigned bus (e.g. <code>TN-38-N-1204</code>).
              </div>
              <div className="pt-2 border-t border-slate-200">
                <strong>For Depot Admins:</strong> Submit official departmental clearance from the State Transport Directorate.
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-slate-400">Coimbatore TNSTC Division</span>
              <button
                onClick={() => setRequestModalOpen(false)}
                className="button-primary text-xs py-2 px-4"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
