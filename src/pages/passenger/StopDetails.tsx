import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTransport } from '../../contexts/TransportContext'
import { useLanguage } from '../../contexts/LanguageContext'
import MapContainer from '../../components/MapContainer'
import {
  ArrowLeft,
  MapPin,
  Clock,
  Compass,
  Radio,
  ShieldCheck,
  CheckCircle,
  Bell,
  Navigation,
  Sun,
  Eye,
  Camera
} from 'lucide-react'

export default function StopDetails() {
  const { id } = useParams<{ id: string }>()
  const { stops, routes, buses, addReminder } = useTransport()
  const { language } = useLanguage()
  const [reminderSet, setReminderSet] = useState(false)

  const stop = stops.find((s) => s.id === id || s.stopCode === id) || stops[0]
  const servingRoutes = routes.filter((r) => r.stops.some((rs) => rs.stopId === stop.id))
  const upcomingBuses = buses.filter((b) => stop.routesServing.includes(b.routeNumber))

  const handleSetReminder = () => {
    if (upcomingBuses.length > 0) {
      const bus = upcomingBuses[0]
      addReminder({
        busId: bus.id,
        busNumber: bus.registrationNumber,
        routeNumber: bus.routeNumber,
        stopName: stop.name,
        minutesBefore: 10,
        enabled: true
      })
      setReminderSet(true)
      setTimeout(() => setReminderSet(false), 3000)
    }
  }

  return (
    <div className="container py-8 pb-20">
      <div className="mb-4">
        <Link to="/stops" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#1261d6]">
          <ArrowLeft size={15} /> Back to Bus Stops
        </Link>
      </div>

      {/* Header Profile */}
      <header className="card p-6 mb-6 border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-[#1261d6] font-black text-xs">
                {stop.stopCode}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                Active Civic Halt
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              {language === 'ta' ? stop.nameTa : language === 'hi' ? stop.nameHi : stop.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1">Landmark: {stop.landmark}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button onClick={handleSetReminder} className="button-secondary text-xs py-2 px-3.5 font-bold">
              <Bell size={14} />
              {reminderSet ? 'Reminder Set ✓' : 'Set Arrival Reminder'}
            </button>
            <Link to={`/plan?to=${stop.id}`} className="button-primary text-xs py-2 px-4">
              <Compass size={14} /> Directions & Plan Trip
            </Link>
          </div>
        </div>

        {/* Audit Badges */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block font-semibold text-[10px]">Shelter & Seating</span>
            <strong className="text-slate-800 text-sm">
              {stop.shelter ? 'Covered Canopy + Benches' : 'Open Roadside Stand'}
            </strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block font-semibold text-[10px]">Night Lighting Audit</span>
            <strong className={`text-sm ${stop.lighting === 'Good' ? 'text-emerald-700' : 'text-amber-700'}`}>
              {stop.lighting} Illumination
            </strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block font-semibold text-[10px]">CCTV & Women Safety</span>
            <strong className="text-slate-800 text-sm">
              {stop.cctv ? 'Civic CCTV Installed' : 'Under Assessment'}
            </strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block font-semibold text-[10px]">Wheelchair Accessibility</span>
            <strong className="text-slate-800 text-sm">
              {stop.accessible ? 'Tactile & Low Curb' : 'Standard Curb'}
            </strong>
          </div>
        </div>
      </header>

      {/* Map */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <MapPin size={18} className="text-[#1261d6]" /> Halt Location on Street Map
        </h2>
        <MapContainer
          stops={[stop]}
          buses={upcomingBuses}
          center={[stop.latitude, stop.longitude]}
          zoom={15}
          height="360px"
        />
      </section>

      {/* Live Upcoming Buses */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="card p-6 border-slate-200">
          <h2 className="text-base font-bold text-slate-900 mb-3">
            Live Arriving Buses
          </h2>
          <div className="space-y-3">
            {upcomingBuses.length > 0 ? (
              upcomingBuses.map((bus) => (
                <div key={bus.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#1261d6] text-white font-extrabold text-xs">
                        Route {bus.routeNumber}
                      </span>
                      <strong className="text-xs text-slate-800">{bus.registrationNumber}</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{bus.routeName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-emerald-600">
                      ~{Math.round(bus.etaNextStopMin)} min
                    </span>
                    <span className="block text-[10px] text-slate-400 font-semibold">{bus.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 italic p-4 text-center">
                No buses currently within 15 minutes of this halt. Next scheduled service in ~22 min.
              </div>
            )}
          </div>
        </div>

        <div className="card p-6 border-slate-200">
          <h2 className="text-base font-bold text-slate-900 mb-3">
            Connecting Routes ({servingRoutes.length})
          </h2>
          <div className="space-y-3">
            {servingRoutes.map((route) => (
              <Link
                key={route.id}
                to={`/routes/${route.id}`}
                className="p-3 rounded-xl border border-slate-200 hover:border-[#1261d6] flex items-center justify-between transition block"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-white font-black text-xs"
                      style={{ backgroundColor: route.color || '#1261d6' }}
                    >
                      {route.routeNumber}
                    </span>
                    <strong className="text-xs text-slate-800">{route.routeName}</strong>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Frequency: Every {route.frequencyMin}m • Fare: ₹{route.fareMin} - ₹{route.fareMax}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#1261d6]">Stops →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
