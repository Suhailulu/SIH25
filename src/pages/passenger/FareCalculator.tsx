import React, { useState } from 'react'
import { useTransport } from '../../contexts/TransportContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { computeFare, calculateHaversineDistanceKm } from '../../services/etaEngine'
import { Calculator, Info, Check, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react'

export default function FareCalculatorPage() {
  const { stops } = useTransport()
  const { language } = useLanguage()

  const [fromStopId, setFromStopId] = useState('stop-central')
  const [toStopId, setToStopId] = useState('stop-railway')
  const [busType, setBusType] = useState<'Standard' | 'Deluxe' | 'AC'>('Standard')
  const [passengerCategory, setPassengerCategory] = useState<'General' | 'Senior' | 'Student' | 'Differently Abled' | 'Woman'>('General')
  const [passengerCount, setPassengerCount] = useState(1)

  const fromStop = stops.find((s) => s.id === fromStopId) || stops[0]
  const toStop = stops.find((s) => s.id === toStopId) || stops[1]

  // Calculate approximate distance
  const distanceKm = Math.max(
    1.5,
    calculateHaversineDistanceKm(fromStop.latitude, fromStop.longitude, toStop.latitude, toStop.longitude)
  )

  const fareResult = computeFare(distanceKm, busType, passengerCategory, passengerCount)

  const fareStages = [
    { stage: 'Stage 1 (0 – 2 km)', standard: '₹8', deluxe: '₹15', ac: '₹25' },
    { stage: 'Stage 2 (2 – 4 km)', standard: '₹11', deluxe: '₹18', ac: '₹28' },
    { stage: 'Stage 3 (4 – 6 km)', standard: '₹14', deluxe: '₹22', ac: '₹32' },
    { stage: 'Stage 4 (6 – 8 km)', standard: '₹18', deluxe: '₹26', ac: '₹38' },
    { stage: 'Stage 5 (8 – 12 km)', standard: '₹22', deluxe: '₹32', ac: '₹45' },
    { stage: 'Stage 6 (12+ km)', standard: '₹28', deluxe: '₹38', ac: '₹55' }
  ]

  return (
    <div className="container py-8 pb-20">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1261d6] uppercase tracking-wider">
          <Calculator size={16} />
          <span>Transparent Public Transport Fares</span>
        </div>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Fare Calculator & Stage Rules</h1>
        <p className="mt-1 text-sm text-slate-500 max-w-2xl">
          Official distance-based stage matrix and government concession guidelines for city buses.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Interactive Calculator Card */}
        <div className="card p-6 border-slate-200 shadow-lg space-y-5">
          <h2 className="text-lg font-bold text-slate-900">Calculate Ticket Fare</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Boarding Stop</label>
              <select
                value={fromStopId}
                onChange={(e) => setFromStopId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium bg-slate-50 focus:bg-white"
              >
                {stops.map((s) => (
                  <option key={s.id} value={s.id}>
                    {language === 'ta' ? s.nameTa : language === 'hi' ? s.nameHi : s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Destination Stop</label>
              <select
                value={toStopId}
                onChange={(e) => setToStopId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium bg-slate-50 focus:bg-white"
              >
                {stops.map((s) => (
                  <option key={s.id} value={s.id}>
                    {language === 'ta' ? s.nameTa : language === 'hi' ? s.nameHi : s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Service Class</label>
              <select
                value={busType}
                onChange={(e: any) => setBusType(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs font-medium bg-slate-50"
              >
                <option value="Standard">Standard City (White-board)</option>
                <option value="Deluxe">Deluxe Express</option>
                <option value="AC">Low-Floor AC</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Passenger Category</label>
              <select
                value={passengerCategory}
                onChange={(e: any) => setPassengerCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs font-medium bg-slate-50"
              >
                <option value="General">General Adult</option>
                <option value="Woman">Woman (TN Zero-Fare Scheme)</option>
                <option value="Student">Student (50% Concession)</option>
                <option value="Senior">Senior Citizen (25%)</option>
                <option value="Differently Abled">Differently Abled (100%)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Number of Passengers</label>
              <select
                value={passengerCount}
                onChange={(e) => setPassengerCount(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs font-medium bg-slate-50"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Passenger' : 'Passengers'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Computed Fare Card */}
          <div className="rounded-2xl bg-blue-50/70 border border-blue-100 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Calculated Journey Distance</span>
              <span className="text-xs font-extrabold text-slate-900">{fareResult.distanceKm} km</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Standard Gross Fare</span>
              <span className="text-xs font-extrabold text-slate-700">₹{fareResult.grossFare}</span>
            </div>

            {fareResult.concessionAmount > 0 && (
              <div className="flex items-center justify-between text-emerald-700 text-xs font-bold">
                <span>Concession Subsidy ({fareResult.concessionNote})</span>
                <span>-₹{fareResult.concessionAmount}</span>
              </div>
            )}

            <div className="pt-3 border-t border-blue-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Total Net Payable Fare</span>
                <span className="text-xs text-slate-400">For {passengerCount} passenger(s)</span>
              </div>
              <div className="text-3xl font-black text-[#1261d6]">
                ₹{fareResult.totalFare}
              </div>
            </div>
          </div>

          {/* Official disclaimer (Required by Section 11 & 53) */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <Info size={16} className="shrink-0 mt-0.5" />
            <p>
              <strong>Official Notice: </strong>
              Fare information is based on available transport authority data. Concession policies reflect applicable Tamil Nadu State Transport Undertaking (TNSTU) urban stage carriage norms. Displayed rates represent <em>Sample/Demo Fare</em>.
            </p>
          </div>
        </div>

        {/* Fare Stage Reference Table */}
        <div className="space-y-6">
          <div className="card p-6 border-slate-200 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Standard Urban Fare Stage Matrix</h2>
            <p className="text-xs text-slate-500">
              Approved stage carriage tariff schedules across municipal city jurisdictions.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="py-2.5">Distance Stage</th>
                    <th className="py-2.5">Standard City</th>
                    <th className="py-2.5">Deluxe</th>
                    <th className="py-2.5">AC Low-Floor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {fareStages.map((row) => (
                    <tr key={row.stage} className="hover:bg-slate-50">
                      <td className="py-2.5">{row.stage}</td>
                      <td className="py-2.5 text-[#1261d6] font-bold">{row.standard}</td>
                      <td className="py-2.5">{row.deluxe}</td>
                      <td className="py-2.5">{row.ac}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Admin Transport Authority Console:</span>
              <span className="font-bold text-[#1261d6]">Managed via Admin Panel</span>
            </div>
          </div>

          <div className="card p-6 border-slate-200 space-y-3 bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
            <h3 className="text-base font-bold text-slate-900">Zero-Fare Scheme for Women</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Under the Tamil Nadu government public transit initiative, women passengers, trans persons, and persons with disabilities accompanied by an assistant are eligible for 100% fare-free travel across all designated standard white-board city services.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
