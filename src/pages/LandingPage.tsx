import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useTransport } from '../contexts/TransportContext'
import {
  Compass,
  Radio,
  Search,
  ArrowRight,
  ShieldAlert,
  Calculator,
  FileWarning,
  BookOpen,
  MapPin,
  Clock,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  HeartHandshake,
  Users,
  Eye,
  Navigation,
  ExternalLink
} from 'lucide-react'

export default function LandingPage() {
  const { t, language } = useLanguage()
  const { buses, routes, stops, alerts, touristDestinations } = useTransport()
  const navigate = useNavigate()

  const [fromStop, setFromStop] = useState('stop-central')
  const [toStop, setToStop] = useState('stop-railway')
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0])
  const [travelTime, setTravelTime] = useState('08:30')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/plan?from=${fromStop}&to=${toStop}&date=${travelDate}&time=${travelTime}`)
  }

  // Active service alerts
  const emergencyAlert = alerts.find((a) => a.severity === 'Emergency' && a.status === 'Active')
  const warningAlerts = alerts.filter((a) => a.severity === 'Warning' && a.status === 'Active')

  // Quick Action cards
  const quickActions = [
    { title: t('nav.liveBuses', 'Live Buses'), desc: 'Interactive GPS map & live arrivals', icon: Radio, path: '/live', color: 'bg-blue-50 text-[#1261d6]' },
    { title: t('nav.routesAndStops', 'Routes & Stops'), desc: 'City bus timetables & shelter info', icon: MapPin, path: '/routes', color: 'bg-indigo-50 text-indigo-600' },
    { title: t('nav.fares', 'Fare Calculator'), desc: 'Official fare stages & concessions', icon: Calculator, path: '/fares', color: 'bg-emerald-50 text-emerald-600' },
    { title: t('nav.safety', 'Safety & SOS'), desc: 'Safe Journey & emergency tools', icon: ShieldAlert, path: '/safety', color: 'bg-red-50 text-red-600' },
    { title: t('nav.trackComplaint', 'Track Complaint'), desc: 'Follow resolution progress & timeline', icon: Search, path: '/track', color: 'bg-orange-50 text-[#e96b4c]' },
    { title: t('nav.passengerRights', 'Passenger Rights'), desc: 'Legal charter & transport rules', icon: BookOpen, path: '/rights', color: 'bg-purple-50 text-purple-600' }
  ]

  return (
    <div className="pb-20">
      {/* Emergency Alert Banner if triggered */}
      {emergencyAlert && (
        <div className="bg-red-600 text-white px-4 py-3 shadow-lg border-b-2 border-red-800">
          <div className="container flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-1 rounded-full bg-white/20 animate-bounce">
                <AlertTriangle size={20} />
              </span>
              <div>
                <span className="font-extrabold uppercase tracking-wide text-xs bg-black/30 px-2 py-0.5 rounded mr-2">
                  Emergency Alert
                </span>
                <strong className="font-bold">{emergencyAlert.title}: </strong>
                <span className="text-sm opacity-95">{emergencyAlert.description}</span>
              </div>
            </div>
            <Link
              to="/alerts"
              className="text-xs font-bold bg-white text-red-700 px-3 py-1.5 rounded-lg shadow whitespace-nowrap hover:bg-red-50"
            >
              View Alternative Routes →
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#17202a] text-white pt-12 pb-20 px-4 sm:px-6">
        {/* Background decorative circles matching original design */}
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full border-[48px] border-[#e96b4c]/70 pointer-events-none" />
        <div className="absolute bottom-[-120px] right-48 h-72 w-72 rounded-full border-[36px] border-[#1261d6]/60 pointer-events-none" />

        <div className="container relative z-10 max-w-5xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-blue-200">
            <Sparkles size={14} className="text-amber-400" />
            <span>{t('app.tagline', 'Your journey. Your rights. Your voice.')}</span>
          </div>

          <h1 className="max-w-3xl text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.08]">
            {t('home.heroTitle', 'Travel smarter. Travel safer. Know before you go.')}
          </h1>

          <p className="mt-5 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {t(
              'home.heroSubtitle',
              'Real-time public transport information, safer journeys, transparent fares, route guidance and passenger support — all in one place.'
            )}
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link
              to="/plan"
              className="button-primary bg-[#1261d6] hover:bg-[#0d3b78] px-6 py-3 text-sm font-bold shadow-lg shadow-blue-900/40"
            >
              <Compass size={18} />
              {t('home.planCTA', 'Plan My Journey')}
            </Link>
            <Link
              to="/live"
              className="button-secondary border-white/25 bg-white/10 text-white hover:border-white hover:text-white px-5 py-3 text-sm font-bold"
            >
              <Radio size={18} />
              {t('home.trackBusCTA', 'Track a Bus')}
            </Link>
            <Link
              to="/passenger/report"
              className="button-primary bg-[#e96b4c] hover:bg-[#d95739] text-white px-5 py-3 text-sm font-bold shadow-lg shadow-orange-900/30"
            >
              <FileWarning size={17} />
              {t('home.reportCTA', 'Report an Issue')}
            </Link>
          </div>

          {/* Prominent Journey Search Box */}
          <div className="mt-12 rounded-2xl bg-white p-5 sm:p-7 text-slate-800 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-blue-50 text-[#1261d6]">
                  <Compass size={20} />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {t('home.searchBoxTitle', 'Where do you want to go?')}
                  </h2>
                  <p className="text-xs text-slate-500">Instant route matching across city bus networks</p>
                </div>
              </div>
              <span className="hidden sm:inline-flex text-[11px] font-bold px-2.5 py-1 rounded bg-blue-50 text-[#1261d6]">
                Demo Live Network
              </span>
            </div>

            <form onSubmit={handleSearch} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">From Origin</label>
                <select
                  value={fromStop}
                  onChange={(e) => setFromStop(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium bg-slate-50 focus:bg-white"
                >
                  {stops.map((s) => (
                    <option key={s.id} value={s.id}>
                      {language === 'ta' ? s.nameTa : language === 'hi' ? s.nameHi : s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">To Destination</label>
                <select
                  value={toStop}
                  onChange={(e) => setToStop(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium bg-slate-50 focus:bg-white"
                >
                  {stops.map((s) => (
                    <option key={s.id} value={s.id}>
                      {language === 'ta' ? s.nameTa : language === 'hi' ? s.nameHi : s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">{t('home.dateLabel', 'Date')}</label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">{t('home.timeLabel', 'Time')}</label>
                <input
                  type="time"
                  value={travelTime}
                  onChange={(e) => setTravelTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full button-primary text-xs py-3 font-bold flex items-center justify-center gap-2"
                >
                  <Search size={16} />
                  <span>{t('home.findRoutesBtn', 'Find Routes')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Main Container Content */}
      <main className="container -mt-6">
        {/* Quick Actions Grid */}
        <section aria-label="Transit quick actions" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.title}
                to={item.path}
                className="card group hover:-translate-y-1 hover:shadow-xl transition flex items-start gap-4 p-5"
              >
                <div className={`p-3 rounded-2xl ${item.color} group-hover:scale-110 transition`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1261d6] flex items-center gap-1">
                    {item.title}
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-transform group-hover:translate-x-1" />
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </Link>
            )
          })}
        </section>

        {/* Live Service Status Board */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="eyebrow">{t('home.serviceStatus', 'Service Status')}</p>
              <h2 className="text-2xl font-bold text-slate-900">City Transit Fleet Telemetry</h2>
            </div>
            <Link to="/alerts" className="text-xs font-bold text-[#1261d6] flex items-center gap-1">
              View All Disruptions & Alerts <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card border-l-4 border-l-emerald-500 p-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Normal Operations</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900">
                {routes.filter((r) => r.status === 'Normal').length} Routes
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Running on schedule with minimal delay</p>
            </div>

            <div className="card border-l-4 border-l-amber-500 p-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Traffic Delays</span>
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900">
                {buses.filter((b) => b.status === 'Delayed').length} Buses
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Average +8 min due to peak congestion</p>
            </div>

            <div className="card border-l-4 border-l-blue-500 p-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Active Fleet</span>
                <Radio size={14} className="text-blue-500" />
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900">{buses.length} Active</div>
              <p className="mt-1 text-[11px] text-slate-500">Transmitting live simulated GPS coordinates</p>
            </div>

            <div className="card border-l-4 border-l-purple-500 p-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Network Coverage</span>
                <MapPin size={14} className="text-purple-500" />
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900">{stops.length} Bus Stops</div>
              <p className="mt-1 text-[11px] text-slate-500">Monitored shelters, lighting & CCTV</p>
            </div>
          </div>
        </section>

        {/* Near You Transit Radar */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="eyebrow">{t('home.nearYou', 'Near You')}</p>
              <h2 className="text-2xl font-bold text-slate-900">
                {t('home.nearYouSubtitle', 'Live radar of nearby bus stops and upcoming services')}
              </h2>
            </div>
            <Link to="/live" className="button-secondary text-xs py-1.5 px-3">
              Open Full Live Map <Radio size={14} />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {stops.slice(0, 3).map((stop) => {
              const servingBuses = buses.filter((b) => stop.routesServing.includes(b.routeNumber))
              return (
                <div key={stop.id} className="card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-[#1261d6]">
                        {stop.stopCode}
                      </span>
                      <h3 className="mt-2 text-base font-bold text-slate-900">
                        {language === 'ta' ? stop.nameTa : language === 'hi' ? stop.nameHi : stop.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{stop.landmark}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-semibold text-slate-500 mb-2">Upcoming Buses at this Stop:</div>
                    <div className="space-y-2">
                      {servingBuses.length > 0 ? (
                        servingBuses.map((bus) => (
                          <div key={bus.id} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#1261d6] bg-white px-2 py-0.5 rounded border border-slate-200">
                                {bus.routeNumber}
                              </span>
                              <span className="text-slate-600 font-medium truncate max-w-[120px]">{bus.registrationNumber}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-emerald-600">~{Math.round(bus.etaNextStopMin)} min</span>
                              <span className="block text-[10px] text-slate-400 font-semibold">{bus.status}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-slate-500 italic">Next scheduled service in 14 min</div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <Link to={`/stops`} className="text-[#1261d6] font-bold hover:underline">
                      Stop Facilities & Routes →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Explore Your City (Tourism Discovery) */}
        <section className="mt-14">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="eyebrow">{t('home.exploreCity', 'Explore Your City')}</p>
              <h2 className="text-2xl font-bold text-slate-900">Public Transit for Local Sightseeing</h2>
            </div>
            <Link to="/tourism" className="text-xs font-bold text-[#1261d6] flex items-center gap-1">
              Browse All Cultural Spots <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {touristDestinations.slice(0, 4).map((dest) => (
              <div key={dest.id} className="card p-0 overflow-hidden group hover:shadow-xl transition">
                <div className="h-36 overflow-hidden relative">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur text-[10px] font-bold text-white uppercase tracking-wider">
                    {dest.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#1261d6] line-clamp-1">
                    {language === 'ta' ? dest.nameTa : language === 'hi' ? dest.nameHi : dest.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">{dest.description}</p>
                  
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Nearest Bus</span>
                      <span className="font-bold text-slate-700">Route {dest.connectingRoutes.join(', ')}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-semibold">Travel Time</span>
                      <span className="font-bold text-emerald-600">~{dest.approxTravelTimeMin} min</span>
                    </div>
                  </div>

                  <Link
                    to={`/plan?to=${dest.nearestStopId}`}
                    className="mt-3 w-full button-secondary text-xs py-1.5 flex items-center justify-center gap-1 font-bold"
                  >
                    <Compass size={13} /> Plan Bus Ride
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRESERVED FOUNDATION: Public Transport Accountability & Grievance Mechanism */}
        <section className="mt-16 pt-10 border-t border-slate-200">
          <div className="header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="eyebrow">{t('home.accountabilityTitle', 'Public transport accountability')}</div>
              <h2 className="mt-1 text-3xl font-bold text-slate-900">Fair, transparent, documented resolutions.</h2>
              <p className="mt-2 text-sm text-slate-600 max-w-xl">
                {t(
                  'home.accountabilitySubtitle',
                  'A clear, accountable way to report transport issues, share evidence, and follow every step toward a fair resolution.'
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/passenger/report" className="button-primary bg-[#e96b4c] hover:bg-[#d95739] text-xs font-bold py-2.5">
                <FileWarning size={15} /> Report an issue
              </Link>
              <Link to="/track" className="button-secondary text-xs font-bold py-2.5">
                <Search size={15} /> Track a complaint
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div className="card">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#1261d6]">
                <FileWarning size={22} />
              </div>
              <h3 className="text-lg font-bold">Report with clarity</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Capture what happened, where it happened, and attach tickets, photos, or witness details that matter.
              </p>
            </div>

            <div className="card">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#e96b4c]">
                <Search size={22} />
              </div>
              <h3 className="text-lg font-bold">Stay in the loop</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Follow live status updates, direct authority responses, and timeline progression without losing your case history.
              </p>
            </div>

            <div className="card">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <HeartHandshake size={22} />
              </div>
              <h3 className="text-lg font-bold">Expect accountability</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Hold transport operators and local depots accountable through auditable grievance logs and escalation procedures.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <div className="eyebrow">Simple by design</div>
              <h3 className="mt-2 text-2xl font-bold">From frustration to a documented case.</h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                Lulu Smart Travel gives your voice legal grounding. Every submission receives an official grievance tracking reference, secure evidence custody, and a dedicated officer assignment.
              </p>
              <div className="mt-5 flex gap-3">
                <Link to="/rights" className="text-xs font-bold text-[#1261d6] hover:underline">
                  Read Motor Vehicles Act Rights →
                </Link>
                <span className="text-slate-300">•</span>
                <Link to="/how-it-works" className="text-xs font-bold text-[#1261d6] hover:underline">
                  Interactive Platform Guide →
                </Link>
              </div>
            </div>

            <div className="soft-panel p-6">
              <h4 className="font-bold text-sm text-slate-900">The 8-Stage Accountable Process</h4>
              <div className="mt-4 space-y-3">
                {[
                  '1. Describe the incident with exact route/bus details',
                  '2. Attach photos, video clips or ticket receipts',
                  '3. Receive automatic receipt & officer assignment',
                  '4. Follow investigation timeline to final resolution'
                ].map((step) => (
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700" key={step}>
                    <CheckCircle2 className="text-[#1261d6] shrink-0" size={17} />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
