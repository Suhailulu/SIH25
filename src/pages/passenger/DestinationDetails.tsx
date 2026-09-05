import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTransport } from '../../contexts/TransportContext'
import { useLanguage } from '../../contexts/LanguageContext'
import MapContainer from '../../components/MapContainer'
import {
  ArrowLeft,
  Compass,
  MapPin,
  Clock,
  Radio,
  Tag,
  Sparkles,
  Info
} from 'lucide-react'

export default function DestinationDetails() {
  const { id } = useParams<{ id: string }>()
  const { touristDestinations, stops, routes, buses } = useTransport()
  const { language } = useLanguage()

  const dest = touristDestinations.find((d) => d.id === id) || touristDestinations[0]
  const nearestStop = stops.find((s) => s.id === dest.nearestStopId)
  const connectingRouteObjs = routes.filter((r) => dest.connectingRoutes.includes(r.routeNumber))

  return (
    <div className="container py-8 pb-20 max-w-4xl">
      <div className="mb-4">
        <Link to="/tourism" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#1261d6]">
          <ArrowLeft size={15} /> Back to City Tourism
        </Link>
      </div>

      <div className="card p-0 overflow-hidden border-slate-200 shadow-xl mb-8">
        <div className="h-64 sm:h-80 relative">
          <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur text-[10px] font-extrabold uppercase tracking-widest">
              {dest.category} Destination
            </span>
            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold">
              {language === 'ta' ? dest.nameTa : language === 'hi' ? dest.nameHi : dest.name}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-200 max-w-xl">
              Alight at {dest.nearestStopName} • Public Transit Connection
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">About this Destination</h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">{dest.description}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-4 bg-slate-50 rounded-2xl">
            <div>
              <span className="text-slate-400 block font-semibold text-[10px]">Nearest Bus Halt</span>
              <strong className="text-slate-800">{dest.nearestStopName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px]">Transit Travel Time</span>
              <strong className="text-emerald-700">~{dest.approxTravelTimeMin} minutes</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px]">Demo Public Fare</span>
              <strong className="text-slate-800">₹{dest.demoFare} (Stage Carriage)</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px]">Recommended Hours</span>
              <strong className="text-slate-800">{dest.bestTime}</strong>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to={`/plan?to=${dest.nearestStopId}`}
              className="button-primary text-xs py-2.5 px-5 font-bold shadow-sm"
            >
              <Compass size={16} /> Plan Bus Journey to this Spot
            </Link>
            <Link
              to={`/live`}
              className="button-secondary text-xs py-2.5 px-4 font-bold"
            >
              <Radio size={16} /> View on Live Transit Map
            </Link>
          </div>
        </div>
      </div>

      {/* Map of Destination & Nearest Halt */}
      {nearestStop && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <MapPin size={18} className="text-[#1261d6]" /> Nearest Bus Halt on Street Map
          </h2>
          <MapContainer
            stops={[nearestStop]}
            center={[nearestStop.latitude, nearestStop.longitude]}
            zoom={15}
            height="340px"
          />
        </section>
      )}
    </div>
  )
}
