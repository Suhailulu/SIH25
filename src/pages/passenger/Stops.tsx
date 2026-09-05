import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTransport } from '../../contexts/TransportContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { MapPin, Search, ArrowRight, ShieldCheck, Check, AlertCircle } from 'lucide-react'

export default function StopsPage() {
  const { stops, buses } = useTransport()
  const { language } = useLanguage()
  const [query, setQuery] = useState('')

  const filteredStops = stops.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.stopCode.toLowerCase().includes(query.toLowerCase()) ||
      s.landmark.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="container py-8 pb-20">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1261d6] uppercase tracking-wider">
            <MapPin size={16} />
            <span>Public Transit Halts</span>
          </div>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Bus Stops Directory</h1>
          <p className="mt-1 text-sm text-slate-500">
            Shelter facilities, lighting safety audit, connecting routes, and real-time arrivals.
          </p>
        </div>

        <Link to="/routes" className="button-secondary text-xs font-bold py-2">
          View All Routes →
        </Link>
      </header>

      {/* Search */}
      <div className="card p-4 mb-6 border-slate-200">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bus stops by name, stop code (e.g. CBS-01) or landmark..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:bg-white"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredStops.map((stop) => {
          const upcomingBuses = buses.filter((b) => stop.routesServing.includes(b.routeNumber))
          return (
            <div key={stop.id} className="card p-5 hover:shadow-lg transition flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-[#1261d6] font-extrabold text-xs">
                    {stop.stopCode}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      stop.lighting === 'Good' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    Lighting: {stop.lighting}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-bold text-slate-900">
                  {language === 'ta' ? stop.nameTa : language === 'hi' ? stop.nameHi : stop.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{stop.landmark}</p>

                <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-semibold">
                  <span className="text-slate-500">Routes:</span>
                  {stop.routesServing.map((r) => (
                    <span key={r} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {r}
                    </span>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Weather Shelter:</span>
                    <strong className={stop.shelter ? 'text-emerald-700' : 'text-slate-500'}>
                      {stop.shelter ? 'Available' : 'Open Stand'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Next Bus Arrival:</span>
                    <strong className="text-[#1261d6]">
                      {upcomingBuses.length > 0 ? `~${Math.round(upcomingBuses[0].etaNextStopMin)} min` : 'Scheduled'}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link to={`/plan?to=${stop.id}`} className="text-xs font-bold text-[#1261d6] hover:underline">
                  Ride to Here →
                </Link>
                <Link to={`/stops/${stop.id}`} className="button-secondary text-xs py-1.5 px-3">
                  Stop Info <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
