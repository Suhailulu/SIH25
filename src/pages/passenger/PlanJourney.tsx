import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTransport } from '../../contexts/TransportContext'
import { computeFare } from '../../services/etaEngine'
import {
  Compass,
  ArrowRight,
  Clock,
  MapPin,
  Filter,
  Check,
  AlertTriangle,
  Radio,
  Bookmark,
  Sparkles,
  Zap,
  DollarSign,
  Heart,
  Accessibility,
  Footprints,
  Info
} from 'lucide-react'

export default function PlanJourney() {
  const { t, language } = useLanguage()
  const { stops, routes, buses, alerts } = useTransport()
  const location = useLocation()
  const navigate = useNavigate()

  // Parse query params if present
  const queryParams = new URLSearchParams(location.search)
  const initialFrom = queryParams.get('from') || 'stop-central'
  const initialTo = queryParams.get('to') || 'stop-railway'
  const initialDate = queryParams.get('date') || new Date().toISOString().split('T')[0]
  const initialTime = queryParams.get('time') || '08:30'

  const [fromStop, setFromStop] = useState(initialFrom)
  const [toStop, setToStop] = useState(initialTo)
  const [travelDate, setTravelDate] = useState(initialDate)
  const [travelTime, setTravelTime] = useState(initialTime)
  const [passengersCount, setPassengersCount] = useState(1)
  const [passengerCategory, setPassengerCategory] = useState<'General' | 'Senior' | 'Student' | 'Differently Abled' | 'Woman'>('General')

  // Preferences
  const [filterPreference, setFilterPreference] = useState<'fastest' | 'cheapest' | 'leastWalking'>('fastest')
  const [womenSafetyPriority, setWomenSafetyPriority] = useState(false)
  const [wheelchairRequired, setWheelchairRequired] = useState(false)
  const [savedRouteIds, setSavedRouteIds] = useState<string[]>([])
  const [comparingRoutes, setComparingRoutes] = useState<string[]>([])

  const fromStopObj = stops.find((s) => s.id === fromStop) || stops[0]
  const toStopObj = stops.find((s) => s.id === toStop) || stops[1]

  // Find candidate routes that connect these stops or pass near them
  const matchingRoutes = routes.filter((route) => {
    const hasFrom = route.stops.some((s) => s.stopId === fromStop)
    const hasTo = route.stops.some((s) => s.stopId === toStop)
    return hasFrom || hasTo || route.stops.length > 2
  })

  // Check if primary bus (Route 12A) is currently delayed
  const bus12A = buses.find((b) => b.routeNumber === '12A')
  const isPrimaryDelayed = (bus12A?.delayMinutes || 0) > 0 || bus12A?.status === 'Delayed'

  const toggleSaveRoute = (routeId: string) => {
    setSavedRouteIds((prev) =>
      prev.includes(routeId) ? prev.filter((id) => id !== routeId) : [...prev, routeId]
    )
  }

  const toggleCompare = (routeId: string) => {
    setComparingRoutes((prev) =>
      prev.includes(routeId) ? prev.filter((id) => id !== routeId) : [...prev, routeId]
    )
  }

  return (
    <div className="container py-8 pb-20">
      {/* Page Header */}
      <header className="mb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1261d6] uppercase tracking-wider">
          <Compass size={16} />
          <span>{t('plan.title', 'Plan Your Journey')}</span>
        </div>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Find the Best City Bus Route</h1>
        <p className="mt-1 text-sm text-slate-500">
          {t('plan.subtitle', 'Discover optimal transit routes with real-time ETA, transparent fares, and alternative suggestions.')}
        </p>
      </header>

      {/* Inputs Form */}
      <div className="card p-5 sm:p-6 mb-8 border-slate-200">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Origin Stop</label>
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
            <label className="block text-xs font-bold text-slate-600 mb-1">Destination Stop</label>
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
            <label className="block text-xs font-bold text-slate-600 mb-1">Travel Date & Time</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs font-medium bg-slate-50"
              />
              <input
                type="time"
                value={travelTime}
                onChange={(e) => setTravelTime(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs font-medium bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Passenger Category & Count</label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={passengerCategory}
                onChange={(e: any) => setPassengerCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs font-medium bg-slate-50"
              >
                <option value="General">General</option>
                <option value="Woman">Woman (Zero-fare TN)</option>
                <option value="Student">Student (50%)</option>
                <option value="Senior">Senior (25%)</option>
                <option value="Differently Abled">Differently Abled (Free)</option>
              </select>

              <select
                value={passengersCount}
                onChange={(e) => setPassengersCount(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs font-medium bg-slate-50"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Person' : 'People'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Priority Filters */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600 flex items-center gap-1">
              <Filter size={14} /> Criteria:
            </span>
            <button
              onClick={() => setFilterPreference('fastest')}
              className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                filterPreference === 'fastest'
                  ? 'bg-blue-50 border-[#1261d6] text-[#1261d6]'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              <Zap size={13} className="inline mr-1" /> Fastest
            </button>
            <button
              onClick={() => setFilterPreference('cheapest')}
              className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                filterPreference === 'cheapest'
                  ? 'bg-blue-50 border-[#1261d6] text-[#1261d6]'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              <DollarSign size={13} className="inline mr-1" /> Cheapest
            </button>
            <button
              onClick={() => setFilterPreference('leastWalking')}
              className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                filterPreference === 'leastWalking'
                  ? 'bg-blue-50 border-[#1261d6] text-[#1261d6]'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              <Footprints size={13} className="inline mr-1" /> Least Walking
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setWomenSafetyPriority(!womenSafetyPriority)}
              className={`px-3 py-1.5 rounded-lg font-bold border flex items-center gap-1 transition ${
                womenSafetyPriority
                  ? 'bg-pink-50 border-pink-500 text-pink-700'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Heart size={13} /> Women Safety Priority
            </button>

            <button
              onClick={() => setWheelchairRequired(!wheelchairRequired)}
              className={`px-3 py-1.5 rounded-lg font-bold border flex items-center gap-1 transition ${
                wheelchairRequired
                  ? 'bg-purple-50 border-purple-500 text-purple-700'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Accessibility size={13} /> Low-Floor Accessible
            </button>
          </div>
        </div>
      </div>

      {/* Alternative Route Suggestion Banner (Section 12) */}
      {isPrimaryDelayed && (
        <div className="card mb-8 border-l-4 border-l-amber-500 bg-amber-50/40 p-5">
          <div className="flex items-start gap-3">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <AlertTriangle size={20} />
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm text-amber-900">
                  Notice: Preferred Route 12A is experiencing a ~{bus12A?.delayMinutes || 12} minute delay
                </h2>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                  Delay Alert
                </span>
              </div>
              <p className="mt-1 text-xs text-amber-800">
                Heavy traffic congestion near Central Junction is impacting regular schedules. We recommend switching to Express Route 24A to reach your destination on time.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="card p-3 bg-white border-amber-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      Alternative 1: Bus 24A (Fast Express)
                    </span>
                    <span className="text-xs font-bold text-emerald-600">Arrives in 6 min</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-600 flex justify-between">
                    <span>Fare: ₹20 • Travel: 18 min • Walking: 2 min</span>
                    <Link to="/live?focus=bus-24a-01" className="text-[#1261d6] font-bold">
                      Track 24A →
                    </Link>
                  </div>
                </div>

                <div className="card p-3 bg-white border-amber-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Alternative 2: Bus 14B (Via Hospital)
                    </span>
                    <span className="text-xs font-bold text-emerald-600">Arrives in 11 min</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-600 flex justify-between">
                    <span>Fare: ₹18 • Travel: 24 min • Walking: 3 min</span>
                    <Link to="/live?focus=bus-14b-01" className="text-[#1261d6] font-bold">
                      Track 14B →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Drawer if multiple selected */}
      {comparingRoutes.length > 1 && (
        <div className="card mb-8 bg-blue-50/50 border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div className="font-bold text-sm text-[#1261d6]">
              Comparing {comparingRoutes.length} routes side-by-side
            </div>
            <button
              onClick={() => setComparingRoutes([])}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Clear Comparison
            </button>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {comparingRoutes.map((rid) => {
              const r = routes.find((x) => x.id === rid)
              if (!r) return null
              const fareObj = computeFare(r.totalDistanceKm, 'Standard', passengerCategory, passengersCount)
              return (
                <div key={r.id} className="card p-3 bg-white text-xs space-y-1">
                  <div className="font-bold text-slate-900 text-sm">{r.routeNumber} - {r.routeName}</div>
                  <div>Duration: <strong>{r.estimatedDurationMin} min</strong></div>
                  <div>Distance: <strong>{r.totalDistanceKm} km</strong></div>
                  <div>Total Fare: <strong>₹{fareObj.totalFare}</strong></div>
                  <div>Stops: <strong>{r.stops.length}</strong></div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Route Alternatives List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {matchingRoutes.length} Available Bus Options
          </h2>
          <span className="text-xs text-slate-500">
            Sorted by {filterPreference === 'fastest' ? 'Fastest Arrival' : filterPreference === 'cheapest' ? 'Lowest Fare' : 'Minimum Walking'}
          </span>
        </div>

        {matchingRoutes.map((route, idx) => {
          const liveBus = buses.find((b) => b.routeId === route.id || b.routeNumber === route.routeNumber)
          const fareObj = computeFare(route.totalDistanceKm, 'Standard', passengerCategory, passengersCount)
          const isSaved = savedRouteIds.includes(route.id)
          const isCompared = comparingRoutes.includes(route.id)
          const isDelayed = liveBus?.status === 'Delayed'

          return (
            <div
              key={route.id}
              className={`card p-5 transition hover:shadow-lg border-slate-200 ${
                isDelayed ? 'border-amber-300' : ''
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="px-3 py-1 rounded-xl text-white font-black text-sm tracking-wide shadow-sm"
                      style={{ backgroundColor: route.color || '#1261d6' }}
                    >
                      Route {route.routeNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {route.operator}
                    </span>
                    {isDelayed ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center gap-1">
                        <AlertTriangle size={12} /> +{liveBus?.delayMinutes || 10} min delay
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                        <Check size={12} /> On time
                      </span>
                    )}
                    {liveBus?.vehicleType && (
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                        {liveBus.vehicleType}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{route.routeName}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-semibold">
                      <Clock size={14} className="text-slate-400" />
                      08:20 AM → 08:45 AM ({route.estimatedDurationMin} min)
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <MapPin size={14} className="text-slate-400" />
                      {route.totalDistanceKm} km ({route.stops.length} stops)
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <Footprints size={14} className="text-slate-400" />
                      2 min walk to boarding
                    </span>
                    <span className="font-extrabold text-[#1261d6] bg-blue-50 px-2 py-0.5 rounded">
                      Total Fare: ₹{fareObj.totalFare}
                    </span>
                  </div>

                  {fareObj.concessionAmount > 0 && (
                    <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <Info size={12} /> Concession applied: {fareObj.concessionNote} (-₹{fareObj.concessionAmount})
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleCompare(route.id)}
                    className={`button-secondary text-xs py-2 px-3 ${
                      isCompared ? 'bg-blue-100 border-blue-500 text-blue-800' : ''
                    }`}
                  >
                    {isCompared ? 'Comparing' : 'Compare'}
                  </button>

                  <button
                    onClick={() => toggleSaveRoute(route.id)}
                    className={`button-secondary text-xs py-2 px-3 ${
                      isSaved ? 'text-[#1261d6] border-[#1261d6]' : ''
                    }`}
                    title="Save to favorites"
                  >
                    <Bookmark size={14} className={isSaved ? 'fill-blue-600' : ''} />
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>

                  <Link
                    to={`/routes/${route.id}`}
                    className="button-secondary text-xs py-2 px-3 font-bold"
                  >
                    View Stops
                  </Link>

                  <Link
                    to={`/live?focus=${liveBus?.id || ''}`}
                    className="button-primary text-xs py-2 px-4 shadow-sm"
                  >
                    <Radio size={14} />
                    Track Live Bus
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
