import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTransport } from '../../contexts/TransportContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { MapPin, Search, ArrowRight, Clock, ShieldCheck, Radio } from 'lucide-react'

export default function RoutesPage() {
  const { routes, buses } = useTransport()
  const { language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRoutes = routes.filter(
    (r) =>
      r.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.destination.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container py-8 pb-20">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1261d6] uppercase tracking-wider">
            <MapPin size={16} />
            <span>Public Transit Directory</span>
          </div>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">City Bus Routes</h1>
          <p className="mt-1 text-sm text-slate-500">
            Search scheduled routes, service timings, frequencies, and stop sequences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/stops" className="button-secondary text-xs font-bold py-2">
            View Bus Stops Directory →
          </Link>
        </div>
      </header>

      {/* Search Input */}
      <div className="card p-4 mb-6 border-slate-200">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by route number (e.g. 12A), origin, or destination..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:bg-white"
          />
        </div>
      </div>

      {/* Route Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredRoutes.map((route) => {
          const activeBus = buses.find((b) => b.routeId === route.id || b.routeNumber === route.routeNumber)
          return (
            <div key={route.id} className="card p-6 hover:shadow-lg transition flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <span
                    className="px-3 py-1 rounded-xl text-white font-extrabold text-sm"
                    style={{ backgroundColor: route.color || '#1261d6' }}
                  >
                    Route {route.routeNumber}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    Every {route.frequencyMin} min
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-bold text-slate-900">{route.routeName}</h3>
                <p className="mt-1 text-xs text-slate-500">{route.operator}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-semibold">First / Last Bus</span>
                    <strong className="text-slate-800">{route.firstService} – {route.lastService}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-semibold">Distance & Duration</span>
                    <strong className="text-slate-800">{route.totalDistanceKm} km (~{route.estimatedDurationMin}m)</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-semibold">Total Stops</span>
                    <strong className="text-slate-800">{route.stops.length} halts</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-semibold">Fare Range</span>
                    <strong className="text-slate-800">₹{route.fareMin} – ₹{route.fareMax}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link to={`/live?focus=${activeBus?.id || ''}`} className="text-xs font-bold text-[#1261d6] flex items-center gap-1 hover:underline">
                  <Radio size={14} /> Track Bus Live
                </Link>

                <Link to={`/routes/${route.id}`} className="button-primary text-xs py-1.5 px-3">
                  Route Details & Stops <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
