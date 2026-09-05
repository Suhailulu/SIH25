import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTransport } from '../../contexts/TransportContext'
import {
  ShieldAlert,
  Shield,
  Heart,
  PhoneCall,
  Share2,
  FileWarning,
  Eye,
  CheckCircle,
  ArrowRight,
  Info
} from 'lucide-react'

export default function SafetyCenter() {
  const { t } = useLanguage()
  const { safeJourney, startSafeJourney, stopSafeJourney } = useTransport()

  return (
    <div className="container py-8 pb-20">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider">
          <Shield size={16} />
          <span>Passenger Security & Emergency Shield</span>
        </div>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">{t('safety.title', 'Safety & Assistance Center')}</h1>
        <p className="mt-1 text-sm text-slate-500 max-w-2xl">
          {t(
            'safety.subtitle',
            'Empowering citizens with rapid emergency tools, safe journey monitoring, and direct incident reporting.'
          )}
        </p>
      </header>

      {/* Prominent SOS Trigger Banner */}
      <div className="card mb-8 p-6 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-xs font-extrabold uppercase tracking-wider">
            <ShieldAlert size={15} /> Rapid Emergency Response
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">Emergency SOS Assistance</h2>
          <p className="text-xs sm:text-sm text-red-100 max-w-lg">
            Immediate location sharing, emergency contact alerting, and police helpline integration.
          </p>
        </div>

        <Link
          to="/safety/sos"
          className="px-6 py-3.5 rounded-2xl bg-white text-red-700 font-extrabold text-sm shadow-xl hover:bg-red-50 text-center shrink-0 flex items-center justify-center gap-2"
        >
          <ShieldAlert size={18} />
          Open SOS Assistance →
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Safe Journey Mode Card */}
        <div className="card p-6 border-slate-200 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-2xl bg-blue-50 text-[#1261d6]">
                <Shield size={22} />
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  safeJourney.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {safeJourney.isActive ? 'Active & Tracking' : 'Standby'}
              </span>
            </div>

            <h3 className="mt-4 text-xl font-bold text-slate-900">Safe Journey Mode</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              When activated during your bus trip, Lulu Smart Travel monitors your vehicle's live path, sends periodic status updates to your trusted contacts, and flags unannounced route diversions.
            </p>

            {safeJourney.isActive && (
              <div className="mt-4 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div><strong>Destination:</strong> {safeJourney.destinationName}</div>
                <div><strong>Trusted Contact:</strong> {safeJourney.emergencyContact}</div>
                <div><strong>Started At:</strong> {safeJourney.startedAt}</div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100">
            {safeJourney.isActive ? (
              <button
                onClick={stopSafeJourney}
                className="w-full button-secondary text-xs font-bold py-2.5 text-red-600 hover:border-red-400"
              >
                End Safe Journey Mode
              </button>
            ) : (
              <button
                onClick={() => startSafeJourney({ busId: 'bus-12a-01', destinationStopId: 'stop-railway' })}
                className="w-full button-primary text-xs font-bold py-2.5"
              >
                Activate Safe Journey for Route 12A
              </button>
            )}
          </div>
        </div>

        {/* Women Passenger Safety Card */}
        <div className="card p-6 border-slate-200 flex flex-col justify-between space-y-4 bg-gradient-to-br from-pink-50/40 to-white">
          <div>
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-2xl bg-pink-100 text-pink-700">
                <Heart size={22} />
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-pink-100 text-pink-800">
                Priority Safety
              </span>
            </div>

            <h3 className="mt-4 text-xl font-bold text-slate-900">Women Safety Module</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Dedicated support for women commuters including verified safe bus stops with night lighting, Pink Police station contacts, zero-fare city carriage rights, and confidential grievance reporting.
            </p>

            <div className="mt-4 space-y-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle size={15} className="text-pink-600" />
                <span>24/7 Women Police Helpline: 1091</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={15} className="text-pink-600" />
                <span>Reserved Front Section Seats & Zero-Fare Stage Rights</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={15} className="text-pink-600" />
                <span>Verified High-Illumination Safe Stops at Night</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Link
              to="/women-safety"
              className="w-full button-secondary text-xs font-bold py-2.5 flex items-center justify-center gap-1.5 text-pink-700 border-pink-200 hover:border-pink-500 hover:bg-pink-50"
            >
              Open Women Safety Center <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Safety Notice (Required by Section 18 & 53) */}
      <div className="mt-8 card p-4 bg-slate-50 border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <Info size={18} className="shrink-0 mt-0.5 text-slate-500" />
        <p>
          <strong>Civic Service Transparency: </strong>
          Lulu Smart Travel provides mobility awareness and communication utilities. The platform does not claim to replace official emergency law enforcement. For imminent danger, please dial 112 or contact the nearest police patrol immediately.
        </p>
      </div>
    </div>
  )
}
