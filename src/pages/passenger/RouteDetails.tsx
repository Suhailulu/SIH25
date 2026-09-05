import React from 'react'
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
  AlertTriangle,
  Info
} from 'lucide-react'

export default function RouteDetails() {
  const { id } = useParams<{ id: string }>()
  const { routes, stops, buses } = useTransport()
  const { language } = useLanguage()

  const route = routes.find((r) => r.id === id || r.routeNumber === id) || routes[0]
  const activeBuses = buses.filter((b) => b.routeId === route.id || b.routeNumber === route.routeNumber)
  const routeStops = route.stops.map((rs) => {
    const fullStop = stops.find((s) => s.id === rs.stopId)
    return { ...rs, fullStop }
  })

  return (
    <div className="container py-8 pb-20">
      {/* Back button */}
      <div className="mb-4">
        <Link to="/routes" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#1261d6]">
          <ArrowLeft size={15} /> Back to Routes
        </Link>
      </div>

      {/* Header Profile */}
      <header className="card p-6 mb-6 border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="px-3.5 py-1 rounded-xl text-white font-black text-base shadow-sm"
                style={{ backgroundColor: route.color || '#1261d6' }}
              >
                Route {route.routeNumber}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase">{route.operator}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {route.status} Status
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">{route.routeName}</h1>
            <p className="text-xs text-slate-500 mt-1">
              Connects {route.origin} to {route.destination} via major civic transit nodes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/live?focus=${activeBuses[0]?.id || ''}`} className="button-primary text-xs py-2 px-4">
              <Radio size={15} /> Track Route Live
            </Link>
            <Link to={`/plan?from=${route.stops[0]?.stopId}&to=${route.stops[route.stops.length - 1]?.stopId}`} className="button-secondary text-xs py-2 px-4">
              <Compass size={15} /> Plan Trip on Route
            </Link>
          </div>
        </div>

        {/* Telemetry Stats */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block font-semibold text-[10px]">Total Distance</span>
            <strong className="text-slate-800 text-sm">{route.totalDistanceKm} km</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block font-semibold text-[10px]">Average Duration</span>
            <strong className="text-slate-800 text-sm">~{route.estimatedDurationMin} minutes</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block font-semibold text-[10px]">Frequency & Operating Hours</span>
            <strong className="text-slate-800 text-sm">Every {route.frequencyMin}m ({route.firstService} - {route.lastService})</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block font-semibold text-[10px]">Sanctioned Fare Matrix</span>
            <strong className="text-slate-800 text-sm">₹{route.fareMin} – ₹{route.fareMax}</strong>
          </div>
        </div>
      </header>

      {/* Route Map Section */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <MapPin size={18} className="text-[#1261d6]" /> Route Alignment & Active Buses
        </h2>
        <MapContainer
          routes={[route]}
          stops={stops.filter((s) => route.stops.some((rs) => rs.stopId === s.id))}
          buses={activeBuses}
          height="400px"
        />
      </section>

      {/* Sequential Stops Timeline */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">
            Sequential Route Halts ({route.stops.length} Stops)
          </h2>
          <span className="text-xs text-slate-500">Scheduled arrival times from origin</span>
        </div>

        <div className="card p-6 border-slate-200 divide-y divide-slate-100">
          {routeStops.map((item, index) => {
            const isFirst = index === 0
            const isLast = index === routeStops.length - 1
            const fullStop = item.fullStop

            return (
              <div key={item.stopId} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        isFirst
                          ? 'bg-emerald-600 text-white'
                          : isLast
                          ? 'bg-red-600 text-white'
                          : 'bg-blue-100 text-[#1261d6]'
                      }`}
                    >
                      {item.sequence}
                    </span>
                    {!isLast && <span className="w-0.5 h-10 bg-slate-200 mt-1" />}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {language === 'ta' ? item.stopNameTa : language === 'hi' ? item.stopNameHi : item.stopName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {fullStop?.landmark || 'Municipal designated stop'}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-600">
                        +{item.scheduledMinutesFromStart} min from origin
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-600">
                        {item.distanceFromStartKm} km
                      </span>
                      {fullStop?.shelter ? (
                        <span className="text-emerald-700 font-medium">✓ Weather Shelter</span>
                      ) : (
                        <span className="text-slate-400">No shelter</span>
                      )}
                      {fullStop?.accessible && (
                        <span className="text-purple-700 font-medium">♿ Accessible curb</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <Link
                    to={`/stops/${item.stopId}`}
                    className="text-xs font-bold text-[#1261d6] hover:underline"
                  >
                    Stop Info →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
