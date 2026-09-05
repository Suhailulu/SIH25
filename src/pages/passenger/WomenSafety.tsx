import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTransport } from '../../contexts/TransportContext'
import {
  Heart,
  ShieldAlert,
  PhoneCall,
  Share2,
  FileWarning,
  MapPin,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Shield,
  Info
} from 'lucide-react'

export default function WomenSafetyPage() {
  const { stops, safeJourney, startSafeJourney, stopSafeJourney } = useTransport()
  const [selectedContact, setSelectedContact] = useState('+91 98765 43210 (Mother)')
  const [journeyStarted, setJourneyStarted] = useState(false)

  const wellLitStops = stops.filter((s) => s.lighting === 'Good')

  const handleToggleSafeJourney = () => {
    if (safeJourney.isActive) {
      stopSafeJourney()
    } else {
      startSafeJourney({
        busId: 'bus-12a-01',
        destinationStopId: 'stop-railway',
        contact: selectedContact
      })
    }
  }

  const safetyTips = [
    { title: 'Prefer Designated Safe Stops After Dusk', desc: 'Board and alight at verified high-illumination stops with active CCTV coverage.' },
    { title: 'Use Reserved Front Carriage Seating', desc: 'By Tamil Nadu Motor Vehicle Rule 245-A, women passengers have priority reservation in the front stanchion section.' },
    { title: 'Share Live Transit Progress', desc: 'Activate Safe Journey Mode to automatically share periodic GPS checkpoints with trusted family contacts.' },
    { title: 'Report Inappropriate Conduct Promptly', desc: 'Overcrowding violations, conductor misbehavior, or harassment can be reported directly with time-stamped incident tracking.' }
  ]

  return (
    <div className="container py-8 pb-20 max-w-5xl">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-pink-600 uppercase tracking-wider">
          <Heart size={16} />
          <span>Empowered Public Mobility</span>
        </div>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Women Passenger Safety Hub</h1>
        <p className="mt-1 text-sm text-slate-500 max-w-2xl">
          Dedicated safe transit tools, safe-stop radar, pink police emergency hotlines, and confidential incident reporting.
        </p>
      </header>

      {/* Hero Action Cards */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Safe Journey Mode Controller */}
        <div className="card p-6 border-pink-200 bg-gradient-to-br from-pink-50/50 to-white shadow-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-pink-100 text-pink-700">
                <Shield size={22} />
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  safeJourney.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-pink-100 text-pink-700'
                }`}
              >
                {safeJourney.isActive ? 'Safe Mode Running' : 'Ready'}
              </span>
            </div>

            <h2 className="mt-3 text-xl font-bold text-slate-900">Safe Journey Mode</h2>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              When turned on, the system monitors your bus route, notifies you when approaching your stop, and shares your trip progress with your selected emergency contact.
            </p>

            <div className="mt-4 space-y-2">
              <label className="block text-xs font-bold text-slate-700">Trusted Emergency Contact</label>
              <input
                type="text"
                value={selectedContact}
                onChange={(e) => setSelectedContact(e.target.value)}
                className="w-full rounded-xl border border-pink-200 p-2 text-xs bg-white"
                placeholder="Name and Phone Number"
              />
            </div>

            {safeJourney.isActive && (
              <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                Active tracking enabled toward <strong>{safeJourney.destinationName}</strong>. Checkpoints shared with {safeJourney.emergencyContact}.
              </div>
            )}
          </div>

          <button
            onClick={handleToggleSafeJourney}
            className={`w-full text-xs font-bold py-3 rounded-xl transition ${
              safeJourney.isActive
                ? 'bg-slate-800 hover:bg-slate-900 text-white'
                : 'bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-600/30'
            }`}
          >
            {safeJourney.isActive ? 'Stop Safe Journey Monitoring' : 'Activate Safe Journey Monitoring'}
          </button>
        </div>

        {/* Rapid Assistance Numbers & SOS */}
        <div className="card p-6 border-slate-200 space-y-4 flex flex-col justify-between">
          <div>
            <span className="p-2 rounded-xl bg-red-100 text-red-600 inline-block">
              <PhoneCall size={20} />
            </span>
            <h2 className="mt-3 text-xl font-bold text-slate-900">Emergency & Police Hotlines</h2>
            <p className="mt-1 text-xs text-slate-500">
              Immediate direct toll-free connections to dedicated public safety agencies.
            </p>

            <div className="mt-4 space-y-2.5">
              <a
                href="tel:1091"
                className="p-3 rounded-xl border border-slate-200 hover:border-pink-500 hover:bg-pink-50/40 flex items-center justify-between transition"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900">Women Helpline (1091)</div>
                  <div className="text-[11px] text-slate-500">24/7 State Pink Patrol & Rapid Assistance</div>
                </div>
                <span className="text-xs font-bold text-pink-700">Call Now →</span>
              </a>

              <a
                href="tel:112"
                className="p-3 rounded-xl border border-slate-200 hover:border-red-500 hover:bg-red-50/40 flex items-center justify-between transition"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900">National Emergency (112)</div>
                  <div className="text-[11px] text-slate-500">Police, Ambulance, and Fire Response</div>
                </div>
                <span className="text-xs font-bold text-red-700">Call Now →</span>
              </a>
            </div>
          </div>

          <div className="flex gap-2">
            <Link to="/safety/sos" className="w-full button-primary bg-red-600 hover:bg-red-700 text-xs py-2.5">
              <ShieldAlert size={14} /> Open SOS Assistance
            </Link>
            <Link to="/passenger/report" className="w-full button-secondary text-xs py-2.5 text-[#e96b4c]">
              <FileWarning size={14} /> Report Harassment
            </Link>
          </div>
        </div>
      </div>

      {/* Safe-Stop Radar */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Verified Night Safe-Stops</h2>
            <p className="text-xs text-slate-500">
              Municipal bus shelters audited for uninterrupted street lighting and public CCTV visibility.
            </p>
          </div>
          <Link to="/stops" className="text-xs font-bold text-[#1261d6]">
            All Stops Audit →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wellLitStops.slice(0, 3).map((stop) => (
            <div key={stop.id} className="card p-5 border-slate-200">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                  {stop.stopCode} • High Illumination
                </span>
                <span className="text-xs font-bold text-emerald-600">✓ Audited Safe</span>
              </div>

              <h3 className="mt-2 text-sm font-bold text-slate-900">{stop.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{stop.landmark}</p>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Shelter: {stop.shelter ? 'Covered Canopy' : 'Open'}</span>
                <Link to={`/stops/${stop.id}`} className="text-[#1261d6] font-bold">
                  Stop Info →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Safety Awareness & Best Practices */}
      <section className="card p-6 border-slate-200 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Lightbulb size={20} className="text-amber-500" /> Commuter Safety Best Practices
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {safetyTips.map((tip) => (
            <div key={tip.title} className="p-3.5 bg-slate-50 rounded-xl space-y-1">
              <div className="font-bold text-xs text-slate-800">{tip.title}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Respectful Disclaimer */}
      <div className="mt-6 p-3.5 rounded-xl bg-slate-100 text-slate-600 text-xs flex items-start gap-2.5">
        <Info size={16} className="shrink-0 mt-0.5 text-slate-500" />
        <p>
          <strong>Notice: </strong>
          Lulu Smart Travel aims to enhance commuter situational awareness and facilitate rapid communication. The application does not guarantee personal security. Always contact civic police (112 / 1091) in cases of emergency or immediate distress.
        </p>
      </div>
    </div>
  )
}
