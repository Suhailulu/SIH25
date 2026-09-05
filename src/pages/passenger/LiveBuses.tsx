import React, { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTransport } from '../../contexts/TransportContext'
import MapContainer from '../../components/MapContainer'
import { LiveBus, BusStop } from '../../types/transport'
import {
  Radio,
  Clock,
  Gauge,
  Compass,
  Users,
  ShieldCheck,
  AlertTriangle,
  Bell,
  CheckCircle,
  Eye,
  RefreshCw,
  Navigation,
  Info
} from 'lucide-react'

export default function LiveBuses() {
  const { t, language } = useLanguage()
  const { buses, routes, stops, alerts, addReminder } = useTransport()
  const location = useLocation()

  const queryParams = new URLSearchParams(location.search)
  const focusBusId = queryParams.get('focus')

  const [selectedBus, setSelectedBus] = useState<LiveBus | null>(() => {
    if (focusBusId) {
      return buses.find((b) => b.id === focusBusId) || buses[0]
    }
    return buses[0] || null
  })

  const [reminderSet, setReminderSet] = useState(false)

  useEffect(() => {
    if (focusBusId) {
      const b = buses.find((item) => item.id === focusBusId)
      if (b) setSelectedBus(b)
    }
  }, [focusBusId, buses])

  // Sync selected bus updates as simulation coordinates change
  useEffect(() => {
    if (selectedBus) {
      const fresh = buses.find((b) => b.id === selectedBus.id)
      if (fresh) setSelectedBus(fresh)
    }
  }, [buses])

  const handleSetReminder = () => {
    if (!selectedBus) return
    addReminder({
      busId: selectedBus.id,
      busNumber: selectedBus.registrationNumber,
      routeNumber: selectedBus.routeNumber,
      stopName: selectedBus.nextStopName,
      minutesBefore: 10,
      enabled: true
    })
    setReminderSet(true)
    setTimeout(() => setReminderSet(false), 3000)
  }

  const activeEmergency = alerts.find((a) => a.severity === 'Emergency' && a.status === 'Active')

  return (
    <div className="container py-8 pb-20">
      {/* Page Header */}
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1261d6] uppercase tracking-wider">
            <Radio size={16} className="animate-pulse" />
            <span>{t('live.title', 'Live Bus Radar')}</span>
          </div>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Real-Time Fleet & Route Map</h1>
          <p className="mt-1 text-sm text-slate-500">
            {t('live.subtitle', 'Track active buses and route progress across the city in real time.')}
          </p>
        </div>

        {/* Live GPS badge */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Demo Live Data</span>
          </div>
        </div>
      </header>

      {/* Emergency banner if active */}
      {activeEmergency && (
        <div className="card mb-6 bg-red-50 border-l-4 border-l-red-600 p-4 text-red-900 text-xs">
          <strong>EMERGENCY DIVERSION: </strong>
          {activeEmergency.title} — {activeEmergency.description}
        </div>
      )}

      {/* Map and Detail Layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Interactive Leaflet Map */}
        <div className="space-y-4">
          <MapContainer
            buses={buses}
            stops={stops}
            routes={routes}
            selectedBusId={selectedBus?.id}
            onSelectBus={(b) => setSelectedBus(b)}
            height="560px"
          />

          {/* Map Legend */}
          <div className="card p-3 bg-white flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="h-3 w-3 rounded-full bg-[#1261d6]" /> Active Bus (On Time)
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="h-3 w-3 rounded-full bg-[#e96b4c]" /> Delayed Bus (+10m)
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="h-2.5 w-2.5 rounded-full border-2 border-[#1261d6] bg-white" /> Bus Stop
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Click any bus or stop marker to inspect telemetries
            </div>
          </div>
        </div>

        {/* Selected Bus Inspection Card */}
        <div className="space-y-4">
          {selectedBus ? (
            <div className="card p-6 border-slate-200 shadow-lg space-y-4">
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <span className="text-xs font-black text-white px-2.5 py-1 rounded-lg bg-[#1261d6]">
                    Route {selectedBus.routeNumber}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">{selectedBus.registrationNumber}</h3>
                  <p className="text-xs text-slate-500 font-medium">{selectedBus.operator}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      selectedBus.status === 'Delayed'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {selectedBus.status}
                  </span>
                  <div className="mt-1 text-[10px] text-slate-400">
                    Updated {selectedBus.lastUpdatedSecondsAgo}s ago
                  </div>
                </div>
              </div>

              {/* ETA Highlight */}
              <div className="rounded-2xl bg-blue-50/70 border border-blue-100 p-4">
                <div className="text-xs font-bold text-slate-500">Next Destination Stop</div>
                <div className="mt-1 text-base font-extrabold text-slate-900">{selectedBus.nextStopName}</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#1261d6]">
                    ~{Math.round(selectedBus.etaNextStopMin)}
                  </span>
                  <span className="text-xs font-bold text-slate-600">minutes arrival ETA</span>
                </div>
              </div>

              {/* Bus Telemetry Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="text-slate-400 flex items-center gap-1 font-semibold">
                    <Gauge size={13} /> Current Speed
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-800">
                    {selectedBus.currentLocation.speedKmH} km/h
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="text-slate-400 flex items-center gap-1 font-semibold">
                    <Compass size={13} /> Direction
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-800">
                    {selectedBus.currentLocation.headingDeg}° South-West
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="text-slate-400 flex items-center gap-1 font-semibold">
                    <Users size={13} /> Passenger Crowd
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-800">
                    {selectedBus.occupancy} Occupancy
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="text-slate-400 flex items-center gap-1 font-semibold">
                    <ShieldCheck size={13} /> Vehicle Type
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-800 truncate">
                    {selectedBus.vehicleType}
                  </div>
                </div>
              </div>

              {/* Safety & In-Bus Features */}
              <div>
                <div className="text-xs font-bold text-slate-500 mb-2">Vehicle Amenities</div>
                <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold">
                  {selectedBus.features.ac && (
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800">Air Conditioned</span>
                  )}
                  {selectedBus.features.lowFloor && (
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800">Low-Floor</span>
                  )}
                  {selectedBus.features.wheelchairAccessible && (
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Wheelchair Ramp</span>
                  )}
                  {selectedBus.features.cctv && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">CCTV Monitored</span>
                  )}
                  {selectedBus.features.emergencyButtons && (
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-700">SOS Button</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={handleSetReminder}
                  className="w-full button-primary text-xs py-2.5 font-bold flex items-center justify-center gap-2"
                >
                  <Bell size={15} />
                  {reminderSet ? 'Reminder Set (10m Before) ✓' : 'Remind me 10 min before arrival'}
                </button>

                <Link
                  to={`/buses/${selectedBus.id}`}
                  className="w-full button-secondary text-xs py-2 flex items-center justify-center gap-1 font-bold"
                >
                  View Full Bus Profile & History →
                </Link>
              </div>
            </div>
          ) : (
            <div className="card p-6 text-center text-slate-500 text-xs">
              Select a bus marker on the map to inspect live telemetries.
            </div>
          )}

          {/* Quick List of other active buses */}
          <div className="card p-4">
            <h4 className="text-xs font-bold text-slate-700 mb-3">All Live Fleet Buses</h4>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {buses.map((bus) => (
                <button
                  key={bus.id}
                  onClick={() => setSelectedBus(bus)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition ${
                    selectedBus?.id === bus.id
                      ? 'border-[#1261d6] bg-blue-50/70 font-bold'
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#1261d6]">Route {bus.routeNumber}</span>
                    <span className="text-slate-600 font-medium">{bus.registrationNumber}</span>
                  </div>
                  <span className="text-emerald-600 font-bold">~{Math.round(bus.etaNextStopMin)}m</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
