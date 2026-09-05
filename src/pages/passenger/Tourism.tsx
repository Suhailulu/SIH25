import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTransport } from '../../contexts/TransportContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { Compass, MapPin, Clock, ArrowRight, Tag, Sparkles } from 'lucide-react'

export default function TourismPage() {
  const { touristDestinations, stops } = useTransport()
  const { language } = useLanguage()

  const categories = ['All', 'Heritage', 'Religious', 'Nature', 'Family', 'Food & Market']
  const [selectedCat, setSelectedCat] = useState('All')

  const filtered = touristDestinations.filter((d) =>
    selectedCat === 'All' ? true : d.category === selectedCat
  )

  return (
    <div className="container py-8 pb-20">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
          <Sparkles size={16} />
          <span>Civic Sightseeing & Transit Discovery</span>
        </div>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Explore Your City by Bus</h1>
        <p className="mt-1 text-sm text-slate-500 max-w-2xl">
          Discover ancient temples, heritage parks, eco-lakes, and historic markets with convenient, affordable public bus routes.
        </p>
      </header>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
              selectedCat === cat
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Destinations Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((dest) => (
          <div key={dest.id} className="card p-0 overflow-hidden hover:shadow-xl transition flex flex-col justify-between group">
            <div>
              <div className="h-44 overflow-hidden relative">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur text-[10px] font-extrabold text-white uppercase tracking-wider">
                  {dest.category}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#1261d6]">
                  {language === 'ta' ? dest.nameTa : language === 'hi' ? dest.nameHi : dest.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{dest.description}</p>

                <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nearest Halt:</span>
                    <strong className="text-slate-800 truncate max-w-[170px]">{dest.nearestStopName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Connecting Buses:</span>
                    <span className="font-extrabold text-[#1261d6]">Route {dest.connectingRoutes.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Travel Time & Demo Fare:</span>
                    <strong className="text-emerald-700">~{dest.approxTravelTimeMin}m • ₹{dest.demoFare}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Best Visiting Hours:</span>
                    <span className="text-slate-600 text-[11px] font-medium">{dest.bestTime}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {dest.tags.map((t) => (
                    <span key={t} className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 flex gap-2">
              <Link
                to={`/plan?to=${dest.nearestStopId}`}
                className="w-full button-primary text-xs py-2 flex items-center justify-center gap-1 font-bold shadow-sm"
              >
                <Compass size={14} /> Plan Bus Trip
              </Link>
              <Link
                to={`/tourism/${dest.id}`}
                className="button-secondary text-xs py-2 px-3 font-bold"
              >
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
