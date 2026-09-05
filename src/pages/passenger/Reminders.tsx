import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTransport } from '../../contexts/TransportContext'
import { Bell, Clock, Trash2, Plus, Check, Radio } from 'lucide-react'

export default function RemindersPage() {
  const { reminders, buses, stops, addReminder, removeReminder, toggleReminder } = useTransport()

  const [selectedBusId, setSelectedBusId] = useState(buses[0]?.id || '')
  const [selectedStopName, setSelectedStopName] = useState('Central Bus Stand (Gandhipuram)')
  const [minutesBefore, setMinutesBefore] = useState(10)
  const [showAddModal, setShowAddModal] = useState(false)

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault()
    const bus = buses.find((b) => b.id === selectedBusId) || buses[0]
    addReminder({
      busId: bus.id,
      busNumber: bus.registrationNumber,
      routeNumber: bus.routeNumber,
      stopName: selectedStopName,
      minutesBefore,
      enabled: true
    })
    setShowAddModal(false)
  }

  return (
    <div className="container py-8 pb-20 max-w-4xl">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1261d6] uppercase tracking-wider">
            <Bell size={16} />
            <span>Intelligent Travel Alerts</span>
          </div>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Smart Bus Reminders</h1>
          <p className="mt-1 text-sm text-slate-500">
            Automated alerts when your tracked bus is 5, 10, or 15 minutes away from your boarding halt.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="button-primary text-xs py-2.5 px-4 font-bold flex items-center gap-2"
        >
          <Plus size={15} /> Set New Reminder
        </button>
      </header>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="card max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900">Configure Arrival Reminder</h2>

            <form onSubmit={handleCreateReminder} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Select Bus & Route</label>
                <select
                  value={selectedBusId}
                  onChange={(e) => setSelectedBusId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 bg-slate-50"
                >
                  {buses.map((b) => (
                    <option key={b.id} value={b.id}>
                      Route {b.routeNumber} ({b.registrationNumber}) — Next: {b.nextStopName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Boarding Bus Halt</label>
                <select
                  value={selectedStopName}
                  onChange={(e) => setSelectedStopName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 bg-slate-50"
                >
                  {stops.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.stopCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Notify Me</label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 15].map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setMinutesBefore(m)}
                      className={`py-2 rounded-lg font-bold border ${
                        minutesBefore === m
                          ? 'bg-blue-50 border-[#1261d6] text-[#1261d6]'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {m} min before
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="button-secondary text-xs py-2 px-3"
                >
                  Cancel
                </button>
                <button type="submit" className="button-primary text-xs py-2 px-4 font-bold">
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reminders List */}
      <div className="space-y-4">
        {reminders.length === 0 ? (
          <div className="card p-12 text-center text-slate-500 space-y-3">
            <Bell size={32} className="mx-auto text-slate-300" />
            <h3 className="font-bold text-slate-700">No active bus reminders</h3>
            <p className="text-xs">Configure reminders to get alerted before your bus reaches your stop.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="button-primary text-xs py-2 px-4 font-bold"
            >
              Set First Reminder
            </button>
          </div>
        ) : (
          reminders.map((rem) => {
            const liveBus = buses.find((b) => b.id === rem.busId || b.routeNumber === rem.routeNumber)
            return (
              <div
                key={rem.id}
                className={`card p-5 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                  !rem.enabled ? 'opacity-60 bg-slate-50/50' : ''
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#1261d6] text-white font-extrabold text-xs">
                      Route {rem.routeNumber}
                    </span>
                    <strong className="text-sm text-slate-900">{rem.busNumber}</strong>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        rem.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {rem.enabled ? 'Active Reminder' : 'Disabled'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Halt: <strong>{rem.stopName}</strong> • Reminder set for{' '}
                    <strong>{rem.minutesBefore} minutes</strong> before vehicle arrival.
                  </p>

                  {liveBus && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <Radio size={12} className="text-[#1261d6] animate-pulse" />
                      Current status: {liveBus.nextStopName} (~{Math.round(liveBus.etaNextStopMin)}m away)
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleReminder(rem.id)}
                    className={`button-secondary text-xs py-1.5 px-3 font-semibold ${
                      rem.enabled ? 'hover:text-amber-600' : 'hover:text-emerald-600'
                    }`}
                  >
                    {rem.enabled ? 'Disable' : 'Enable'}
                  </button>

                  <button
                    onClick={() => removeReminder(rem.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete Reminder"
                  >
                    <Trash2 size={16} />
                  </button>

                  <Link
                    to={`/live?focus=${rem.busId}`}
                    className="button-primary text-xs py-1.5 px-3 font-bold"
                  >
                    Track Bus
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
