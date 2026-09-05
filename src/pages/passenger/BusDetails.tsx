import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTransport } from '../../contexts/TransportContext'
import MapContainer from '../../components/MapContainer'
import {
  ArrowLeft,
  Radio,
  Clock,
  Gauge,
  Compass,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Bell,
  Heart
} from 'lucide-react'

export default function BusDetails() {
  const { id } = useParams<{ id: string }>()
  const { buses, routes, stops, addReminder } = useTransport()
  const [reminderSet, setReminderSet] = useState(false)

  const bus = buses.find((b) => b.id === id || b.registrationNumber === id) || buses[0]
  const route = routes.find((r) => r.id === bus.routeId || r.routeNumber === bus.routeNumber)

  const handleReminder = () => {
    addReminder({
      busId: bus.id,
      busNumber: bus.registrationNumber,
      routeNumber: bus.routeNumber,
      stopName: bus.nextStopName,
      minutesBefore: 10,
      enabled: true
    })
    setReminderSet(true)
    setTimeout(() => setReminderSet(false), 3000)
  }

  return (
    <div className="container py-8 pb-20">
      <div className="mb-4">
        <Link to="/buses" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#1261d6]">
          <ArrowLeft size={15} /> Back to Bus Directory
        </Link>
      </div>

      <header className="card p-6 mb-6 border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-[#1261d6] text-white font-extrabold text-xs">
                Route {bus.routeNumber}
              </span>
              <span className="text-xs font-bold text-slate-500">{bus.operator}</span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  bus.status === 'Delayed' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {bus.status}
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">{bus.registrationNumber}</h1>
            <p className="text-xs text-slate-500 mt-1">
              Currently operating on {bus.routeName} • Last GPS sync: {bus.lastUpdatedSecondsAgo}s ago
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleReminder} className="button-secondary text-xs py-2 px-3.5 font-bold">
              <Bell size={14} />
              {reminderSet ? 'Reminder Set ✓' : 'Set 10m Reminder'}
            </button>
            <Link to={`/live?focus=${bus.id}`} className="button-primary text-xs py-2 px-4">
              <Radio size={14} /> Focus on Map
            </Link>
          </div>
        </div>

        {/* Telemetry Panel */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block font-semibold text-[10px]">Next Scheduled Stop</span>
            <strong className="text-slate-800 text-sm">{bus.nextStopName}</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block font-semibold text-[10px]">Estimated Arrival (ETA)</span>
            <strong className="text-emerald-600 text-sm">~{Math.round(bus.etaNextStopMin)} minutes</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block font-semibold text-[10px]">Current Velocity</span>
            <strong className="text-slate-800 text-sm">{bus.currentLocation.speedKmH} km/h ({bus.currentLocation.headingDeg}°)</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block font-semibold text-[10px]">Passenger Occupancy</span>
            <strong className="text-slate-800 text-sm">{bus.occupancy} Crowd</strong>
          </div>
        </div>
      </header>

      {/* Map showing this bus */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Radio size={18} className="text-[#1261d6]" /> Live Location Coordinates
        </h2>
        <MapContainer
          buses={[bus]}
          routes={route ? [route] : []}
          selectedBusId={bus.id}
          height="380px"
        />
      </section>

      {/* Specifications & Safety Audit */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="card p-6 border-slate-200 space-y-3">
          <h3 className="text-base font-bold text-slate-900">Vehicle Specifications</h3>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500">Service Class:</span>
              <strong className="text-slate-800">{bus.vehicleType}</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500">Emission / Power:</span>
              <strong className="text-slate-800">BS-VI Clean Diesel / Electric</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500">Seating Capacity:</span>
              <strong className="text-slate-800">42 Passengers + Standees</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500">Air Conditioning:</span>
              <strong className="text-slate-800">{bus.features.ac ? 'Climate Controlled AC' : 'Standard Natural Ventilation'}</strong>
            </div>
          </div>
        </div>

        <div className="card p-6 border-slate-200 space-y-3">
          <h3 className="text-base font-bold text-slate-900">Safety & Accessibility Equipment</h3>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500">Low-Floor Wheelchair Ramp:</span>
              <strong className={bus.features.lowFloor ? 'text-emerald-700' : 'text-slate-500'}>
                {bus.features.lowFloor ? 'Equipped with fold-out ramp' : 'High-floor design'}
              </strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500">Onboard CCTV Surveillance:</span>
              <strong className="text-emerald-700">Dual Dome Cameras Active</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500">Emergency Panic Buttons:</span>
              <strong className="text-emerald-700">4 Stanchion Mounted SOS Buttons</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500">Dedicated Women Seating:</span>
              <strong className="text-pink-700">Front 14 Seats Reserved</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
