import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTransport } from '../../contexts/TransportContext'
import { Radio, Search, ShieldCheck, Gauge, Users, Clock, ArrowRight } from 'lucide-react'

export default function BusesPage() {
  const { buses } = useTransport()
  const [search, setSearch] = useState('')

  const filtered = buses.filter(
    (b) =>
      b.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.routeNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.operator.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="container py-8 pb-20">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1261d6] uppercase tracking-wider">
            <Radio size={16} />
            <span>Public Transit Fleet</span>
          </div>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Active Bus Directory</h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time tracking profiles for all active stage carriages operating across the city.
          </p>
        </div>
        <Link to="/live" className="button-primary text-xs py-2 px-4">
          <Radio size={14} /> Open Live Radar Map
        </Link>
      </header>

      {/* Search */}
      <div className="card p-4 mb-6 border-slate-200">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by registration (e.g. TN-38-N-1204) or route number..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:bg-white"
          />
        </div>
      </div>

      {/* Bus Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((bus) => (
          <div key={bus.id} className="card p-5 hover:shadow-lg transition flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <span className="px-3 py-1 rounded-xl bg-[#1261d6] text-white font-extrabold text-xs">
                  Route {bus.routeNumber}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    bus.status === 'Delayed' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {bus.status}
                </span>
              </div>

              <h3 className="mt-3 text-lg font-bold text-slate-900">{bus.registrationNumber}</h3>
              <p className="text-xs text-slate-500">{bus.operator}</p>

              <div className="mt-4 p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Next Halt:</span>
                  <strong className="text-slate-800">{bus.nextStopName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Arrival ETA:</span>
                  <strong className="text-emerald-600 font-bold">~{Math.round(bus.etaNextStopMin)} min</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Speed & Heading:</span>
                  <strong className="text-slate-800">{bus.currentLocation.speedKmH} km/h • {bus.currentLocation.headingDeg}°</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Occupancy:</span>
                  <strong className="text-slate-800">{bus.occupancy}</strong>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1 text-[10px] font-semibold text-slate-600">
                {bus.features.ac && <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">AC</span>}
                {bus.features.lowFloor && <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded">Low-Floor</span>}
                {bus.features.wheelchairAccessible && <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">♿ Ramp</span>}
                {bus.features.cctv && <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">CCTV</span>}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link to={`/live?focus=${bus.id}`} className="text-xs font-bold text-[#1261d6] flex items-center gap-1 hover:underline">
                <Radio size={13} /> Track Live
              </Link>
              <Link to={`/buses/${bus.id}`} className="button-secondary text-xs py-1.5 px-3">
                Profile <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
