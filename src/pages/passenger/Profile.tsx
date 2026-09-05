import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTransport } from '../../contexts/TransportContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { getProfile, upsertProfile } from '../../services/profiles'
import {
  UserCircle,
  Bookmark,
  Bell,
  Heart,
  Globe,
  Sliders,
  ShieldCheck,
  FileWarning,
  Clock,
  LogOut,
  MapPin,
  Compass
} from 'lucide-react'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const { complaints, reminders, userRole, setUserRole } = useTransport()
  const { language, setLanguage, accessibility, updateAccessibility } = useLanguage()

  const [profile, setProfile] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [emergencyContact, setEmergencyContact] = useState('+91 98765 43210 (Mother)')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    getProfile(user.id).then((res) => {
      if (res.data) {
        setProfile(res.data)
        setFullName(res.data.full_name || '')
        setPhone(res.data.phone || '')
      }
    })
  }, [user])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    if (user) {
      await upsertProfile({ id: user.id, full_name: fullName, phone })
    }
    setSaving(false)
    setMessage('Profile settings saved successfully ✓')
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className="container py-8 pb-20 max-w-4xl">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1261d6] uppercase tracking-wider">
            <UserCircle size={16} />
            <span>Citizen Profile & Preferences</span>
          </div>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Passenger Account</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your personal travel preferences, saved routes, emergency contacts, and language settings.
          </p>
        </div>

        {user ? (
          <button
            onClick={() => signOut()}
            className="button-secondary text-xs py-2 px-3 text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut size={14} /> Sign Out
          </button>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="button-secondary text-xs py-2 px-3">
              Sign In
            </Link>
            <Link to="/signup" className="button-primary text-xs py-2 px-3">
              Register
            </Link>
          </div>
        )}
      </header>

      <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        {/* Personal Details Form */}
        <div className="card p-6 border-slate-200 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Personal & Emergency Details</h2>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Email Address</label>
              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold">
                {user?.email || 'guest.citizen@lulusmart.local (Guest Commuter)'}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
                className="w-full border border-slate-300 rounded-xl p-2.5 font-medium bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Mobile Contact Number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98xxx xxxxx"
                className="w-full border border-slate-300 rounded-xl p-2.5 font-medium bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Trusted SOS Emergency Contact</label>
              <input
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full border border-pink-200 rounded-xl p-2.5 font-medium bg-white"
                placeholder="Primary Contact for Safe Journey Mode"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {message ? (
                <span className="text-emerald-700 font-bold">{message}</span>
              ) : (
                <span className="text-[11px] text-slate-400">Privacy protected</span>
              )}
              <button
                type="submit"
                disabled={saving}
                className="button-primary text-xs py-2 px-4 font-bold"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Preferences & Quick Portals */}
        <div className="space-y-6">
          {/* Language & Accessibility Panel */}
          <div className="card p-6 border-slate-200 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe size={18} className="text-[#1261d6]" /> Language & Interface
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="block font-bold text-slate-600 mb-1.5">Display Language</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'ta', label: 'தமிழ்' },
                    { code: 'hi', label: 'हिन्दी' }
                  ].map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code as any)}
                      className={`py-2 rounded-xl font-bold border ${
                        language === l.code
                          ? 'bg-blue-50 border-[#1261d6] text-[#1261d6]'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">High Contrast</div>
                  <div className="text-[11px] text-slate-500">Outdoor readability</div>
                </div>
                <button
                  onClick={() => updateAccessibility({ highContrast: !accessibility.highContrast })}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                    accessibility.highContrast ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {accessibility.highContrast ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links to My Items */}
          <div className="card p-6 border-slate-200 space-y-3">
            <h2 className="text-base font-bold text-slate-900">My Mobility Records</h2>
            <div className="space-y-2 text-xs">
              <Link
                to="/passenger/complaints"
                className="p-3 rounded-xl border border-slate-100 hover:border-blue-400 bg-slate-50 flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <FileWarning size={16} className="text-[#e96b4c]" />
                  <span>My Filed Complaints</span>
                </div>
                <span className="font-bold text-[#1261d6]">{complaints.length} Cases →</span>
              </Link>

              <Link
                to="/reminders"
                className="p-3 rounded-xl border border-slate-100 hover:border-blue-400 bg-slate-50 flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Bell size={16} className="text-blue-600" />
                  <span>Configured Bus Reminders</span>
                </div>
                <span className="font-bold text-[#1261d6]">{reminders.length} Active →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
