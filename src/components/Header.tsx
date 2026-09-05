import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage, LanguageCode } from '../contexts/LanguageContext'
import { useTransport } from '../contexts/TransportContext'
import AccessibilityModal from './AccessibilityModal'
import {
  ShieldCheck,
  Bell,
  UserCircle,
  LogOut,
  Globe,
  Sliders,
  Menu,
  X,
  Compass,
  Radio,
  FileWarning,
  Search,
  BookOpen,
  MapPin,
  Shield,
  Heart,
  ChevronDown
} from 'lucide-react'

export default function Header() {
  const { user, signOut } = useAuth()
  const { t, language, setLanguage } = useLanguage()
  const { alerts, userRole, setUserRole } = useTransport()
  const navigate = useNavigate()
  const location = useLocation()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [a11yModalOpen, setA11yModalOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)

  const activeAlertsCount = alerts.filter((a) => a.status === 'Active').length

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const navLinks = [
    { label: t('nav.home', 'Home'), path: '/' },
    { label: t('nav.planJourney', 'Plan Journey'), path: '/plan' },
    { label: t('nav.liveBuses', 'Live Buses'), path: '/live' },
    { label: t('nav.routesAndStops', 'Routes & Stops'), path: '/routes' },
    { label: t('nav.fares', 'Fares'), path: '/fares' },
    { label: t('nav.safety', 'Safety'), path: '/safety' },
    { label: t('nav.alerts', 'Alerts'), path: '/alerts', badge: activeAlertsCount },
    { label: t('nav.tourism', 'Tourism'), path: '/tourism' },
    { label: t('nav.passengerRights', 'Rights'), path: '/rights' },
    { label: t('nav.help', 'Help'), path: '/how-it-works' }
  ]

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'hi', label: 'हिन्दी' }
  ]

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-[#f5f7f5]/95 backdrop-blur shadow-xs">
        <div className="container flex min-h-[70px] items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1261d6] text-white shadow-sm shadow-blue-500/30">
                <ShieldCheck size={20} />
              </span>
              <div className="leading-tight">
                <span className="text-[#17202a]">Lulu</span>{' '}
                <span className="text-[#1261d6]">Smart Travel</span>
                <span className="hidden sm:block text-[9px] font-semibold tracking-wider text-slate-500 uppercase">
                  Small-City Public Mobility
                </span>
              </div>
            </Link>

            {/* Desktop Primary Nav */}
            <nav aria-label="Primary navigation" className="hidden xl:flex items-center gap-4 text-xs font-bold text-slate-600">
              {navLinks.slice(0, 7).map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative py-1 transition hover:text-[#1261d6] ${
                      isActive ? 'text-[#1261d6] border-b-2 border-[#1261d6]' : ''
                    }`}
                  >
                    {item.label}
                    {item.badge && item.badge > 0 ? (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#e96b4c] text-[10px] text-white font-bold">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                )
              })}
              {/* Secondary links dropdown or direct */}
              <Link to="/tourism" className="hover:text-[#1261d6]">{t('nav.tourism', 'Tourism')}</Link>
              <Link to="/rights" className="hover:text-[#1261d6]">{t('nav.passengerRights', 'Rights')}</Link>
              <Link to="/how-it-works" className="hover:text-[#1261d6]">{t('nav.help', 'Help')}</Link>
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white/80 text-xs font-bold text-slate-700 hover:border-blue-400"
                aria-label="Select Language"
              >
                <Globe size={15} className="text-[#1261d6]" />
                <span className="uppercase">{language}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 rounded-xl bg-white border border-slate-200 shadow-xl py-1 z-50 animate-fade-in">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code)
                        setLangMenuOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-blue-50 ${
                        language === l.code ? 'text-[#1261d6] font-bold bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{l.label}</span>
                      {language === l.code && <span className="text-[10px]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Accessibility Options Button */}
            <button
              onClick={() => setA11yModalOpen(true)}
              title="Accessibility Options"
              className="p-2 rounded-lg text-slate-600 hover:bg-white hover:text-[#1261d6] border border-transparent hover:border-slate-200"
              aria-label="Open Accessibility Settings"
            >
              <Sliders size={18} />
            </button>

            {/* Notification Bell */}
            <Link
              to="/alerts"
              title="Notifications & Alerts"
              className="relative p-2 rounded-lg text-slate-600 hover:bg-white hover:text-[#1261d6] border border-transparent hover:border-slate-200"
            >
              <Bell size={18} />
              {activeAlertsCount > 0 && (
                <span className="absolute 1 top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e96b4c] px-1 text-[9px] font-bold text-white">
                  {activeAlertsCount}
                </span>
              )}
            </Link>

            {/* Role-Specific Portal Links */}
            {user?.role === 'driver' && (
              <Link
                to="/driver/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
              >
                <span>Driver Cockpit</span>
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition"
              >
                <span>Depot Admin</span>
              </Link>
            )}

            {user?.role === 'super_admin' && (
              <Link
                to="/super-admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition"
              >
                <span>Super Admin</span>
              </Link>
            )}

            {/* Primary CTA */}
            <Link
              to="/plan"
              className="hidden sm:inline-flex button-primary text-xs py-2 px-3.5 shadow-sm"
            >
              <Compass size={15} />
              {t('nav.planJourney', 'Plan My Journey')}
            </Link>

            {/* Profile or Sign in */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/profile"
                  title={`${user.name || user.email} (${user.role})`}
                  className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 transition"
                >
                  <UserCircle size={22} className="text-slate-700" />
                  <span className="hidden md:inline-block text-[11px] font-bold text-slate-800 max-w-[100px] truncate">
                    {user.name?.split(' ')[0] || user.email}
                  </span>
                  <span className={`hidden md:inline-block px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                    user.role === 'super_admin'
                      ? 'bg-purple-100 text-purple-800'
                      : user.role === 'driver'
                      ? 'bg-emerald-100 text-emerald-800'
                      : user.role === 'admin'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={17} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="button-secondary text-xs py-1.5 px-3 font-bold border-blue-200 text-[#1261d6] hover:bg-blue-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="hidden sm:inline-flex button-primary text-xs py-1.5 px-3 font-bold"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-4 shadow-xl animate-fade-in">
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700 pb-3 border-b border-slate-100">
              <Link onClick={() => setMobileMenuOpen(false)} to="/" className="p-2.5 rounded-lg hover:bg-blue-50 flex items-center gap-2">
                Home
              </Link>
              <Link onClick={() => setMobileMenuOpen(false)} to="/plan" className="p-2.5 rounded-lg hover:bg-blue-50 flex items-center gap-2 text-[#1261d6]">
                <Compass size={15} /> Plan Journey
              </Link>
              <Link onClick={() => setMobileMenuOpen(false)} to="/live" className="p-2.5 rounded-lg hover:bg-blue-50 flex items-center gap-2">
                <Radio size={15} /> Live Buses
              </Link>
              <Link onClick={() => setMobileMenuOpen(false)} to="/routes" className="p-2.5 rounded-lg hover:bg-blue-50 flex items-center gap-2">
                <MapPin size={15} /> Routes & Stops
              </Link>
              <Link onClick={() => setMobileMenuOpen(false)} to="/fares" className="p-2.5 rounded-lg hover:bg-blue-50 flex items-center gap-2">
                Fare Calculator
              </Link>
              <Link onClick={() => setMobileMenuOpen(false)} to="/safety" className="p-2.5 rounded-lg hover:bg-blue-50 flex items-center gap-2 text-emerald-600">
                <Shield size={15} /> Safety & SOS
              </Link>
              <Link onClick={() => setMobileMenuOpen(false)} to="/women-safety" className="p-2.5 rounded-lg hover:bg-blue-50 flex items-center gap-2 text-pink-600">
                <Heart size={15} /> Women Safety
              </Link>
              <Link onClick={() => setMobileMenuOpen(false)} to="/tourism" className="p-2.5 rounded-lg hover:bg-blue-50 flex items-center gap-2">
                City Tourism
              </Link>
              <Link onClick={() => setMobileMenuOpen(false)} to="/rights" className="p-2.5 rounded-lg hover:bg-blue-50 flex items-center gap-2">
                Passenger Rights
              </Link>
              <Link onClick={() => setMobileMenuOpen(false)} to="/laws" className="p-2.5 rounded-lg hover:bg-blue-50 flex items-center gap-2">
                <BookOpen size={15} /> Laws & Rules
              </Link>
              <Link onClick={() => setMobileMenuOpen(false)} to="/passenger/report" className="p-2.5 rounded-lg hover:bg-orange-50 text-[#e96b4c] flex items-center gap-2">
                <FileWarning size={15} /> Report an Issue
              </Link>
              <Link onClick={() => setMobileMenuOpen(false)} to="/track" className="p-2.5 rounded-lg hover:bg-blue-50 flex items-center gap-2">
                <Search size={15} /> Track Complaint
              </Link>
              <Link onClick={() => setMobileMenuOpen(false)} to="/how-it-works" className="p-2.5 rounded-lg hover:bg-blue-50 flex items-center gap-2">
                Interactive Demo
              </Link>
              <Link onClick={() => setMobileMenuOpen(false)} to="/admin" className="p-2.5 rounded-lg bg-slate-900 text-white flex items-center gap-2">
                Admin Console
              </Link>
              <Link onClick={() => setMobileMenuOpen(false)} to="/driver/dashboard" className="p-2.5 rounded-lg bg-emerald-700 text-white flex items-center gap-2">
                Driver Cockpit
              </Link>
              <Link onClick={() => setMobileMenuOpen(false)} to="/super-admin" className="p-2.5 rounded-lg bg-purple-700 text-white flex items-center gap-2 col-span-2 justify-center">
                Super Admin Console
              </Link>
            </div>
          </div>
        )}
      </header>

      <AccessibilityModal isOpen={a11yModalOpen} onClose={() => setA11yModalOpen(false)} />
    </>
  )
}
