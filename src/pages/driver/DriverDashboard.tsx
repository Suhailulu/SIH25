import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bus,
  Radio,
  MapPin,
  Users,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Compass,
  ArrowRight,
  PhoneCall,
  Flame,
  Volume2,
  PauseCircle,
  PlayCircle
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTransport } from '../../contexts/TransportContext'
import { OccupancyLevel } from '../../types/transport'

export default function DriverDashboard() {
  const { user } = useAuth()
  const {
    buses,
    triggerBusDelay,
    triggerEmergencyAlert,
    updateBus
  } = useTransport()

  // Default to driver's assigned bus or first bus
  const assignedRegNo = user?.assignedBus || 'TN-38-N-1204'
  const currentBus = buses.find((b) => b.registrationNumber === assignedRegNo) || buses[0]

  const [dutyStatus, setDutyStatus] = useState<'on_route' | 'standby' | 'break'>('on_route')
  const [gpsBroadcasting, setGpsBroadcasting] = useState(true)
  const [occupancyLevel, setOccupancyLevel] = useState<OccupancyLevel>(
    currentBus?.occupancy || 'Medium'
  )
  const [currentStopIndex, setCurrentStopIndex] = useState(1)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false)

  const stopsList = [
    { name: 'Central Bus Stand (Gandhipuram)', time: '08:00 AM' },
    { name: 'Town Hall City Center', time: '08:12 AM' },
    { name: 'Coimbatore Railway Junction', time: '08:24 AM' },
    { name: 'Ukkadam Bus Terminal', time: '08:35 AM' },
    { name: 'Perur Pateeswarar Temple', time: '08:50 AM' }
  ]

  const handleNextStop = () => {
    if (currentStopIndex < stopsList.length - 1) {
      const nextIdx = currentStopIndex + 1
      setCurrentStopIndex(nextIdx)
      const nextStop = stopsList[nextIdx]
      if (currentBus) {
        updateBus(currentBus.id, {
          nextStopName: nextStop.name,
          etaNextStopMin: 4
        })
      }
      setStatusMessage(`Next stop updated to: ${nextStop.name}. Audio announcement sent to passengers.`)
      setTimeout(() => setStatusMessage(null), 4000)
    }
  }

  const handleUpdateOccupancy = (level: OccupancyLevel) => {
    setOccupancyLevel(level)
    if (currentBus) {
      updateBus(currentBus.id, { occupancy: level })
    }
    setStatusMessage(`Bus occupancy updated to "${level}" for live commuter map.`)
    setTimeout(() => setStatusMessage(null), 3000)
  }

  const handleReportDelay = (minutes: number) => {
    if (currentBus) {
      triggerBusDelay(currentBus.id, minutes)
      setStatusMessage(`Traffic delay (+${minutes} mins) broadcast to all passengers on Route ${currentBus.routeNumber}.`)
      setTimeout(() => setStatusMessage(null), 4500)
    }
  }

  const handleTriggerSos = (reason: string) => {
    triggerEmergencyAlert(
      currentBus?.routeNumber || '12A',
      `[DRIVER SOS ALERT]: ${currentBus?.registrationNumber} reported: ${reason}. Depot response team dispatched.`
    )
    setIsEmergencyModalOpen(false)
    setStatusMessage(`Emergency SOS broadcast initiated! Depot controller notified.`)
    setTimeout(() => setStatusMessage(null), 5000)
  }

  return (
    <div className="container py-8 pb-20 max-w-5xl">
      {/* Header Banner */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#17202a] via-[#1e293b] to-[#0f172a] p-6 text-white shadow-xl border border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500 text-white shadow-xs">
                <Bus size={18} />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Driver Cockpit Console
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Authorized Operator
              </span>
            </div>
            <h1 className="text-2xl font-bold">
              {user?.name || 'P. Murugan (Driver #482)'}
            </h1>
            <p className="text-xs text-slate-300 flex items-center gap-3">
              <span>Depot: <strong>{user?.depot || 'Gandhipuram Central Depot'}</strong></span>
              <span>•</span>
              <span>Clearance: <strong>Super Admin Verified ✓</strong></span>
            </p>
          </div>

          {/* Duty Mode Controls */}
          <div className="flex items-center gap-2 bg-slate-800/90 p-1.5 rounded-xl border border-slate-700">
            <button
              onClick={() => setDutyStatus('on_route')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                dutyStatus === 'on_route'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio size={13} className="animate-pulse" />
              <span>On Route</span>
            </button>
            <button
              onClick={() => setDutyStatus('standby')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                dutyStatus === 'standby'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Standby
            </button>
            <button
              onClick={() => setDutyStatus('break')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                dutyStatus === 'break'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Break
            </button>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
        
        {/* Left Column: Active Vehicle & Route Controls */}
        <div className="space-y-6">
          
          {/* Active Bus Card */}
          <div className="card p-6 border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Assigned Transit Bus</span>
                <div className="text-xl font-black text-slate-900 flex items-center gap-2 mt-0.5">
                  <span>{currentBus?.registrationNumber || assignedRegNo}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-[#1261d6]">
                    Route {currentBus?.routeNumber || '12A'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Speed / Telemetry</span>
                <div className="text-base font-bold text-slate-800">
                  {currentBus?.currentLocation?.speedKmH || 28} km/h
                </div>
              </div>
            </div>

            {/* GPS Broadcast Switch */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2.5">
                <span className={`p-2 rounded-lg ${gpsBroadcasting ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                  <Radio size={18} className={gpsBroadcasting ? 'animate-pulse' : ''} />
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Live GPS Passenger Broadcast
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {gpsBroadcasting
                      ? 'Transmitting coordinates to Lulu Smart Travel app'
                      : 'GPS beacon is currently paused'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setGpsBroadcasting(!gpsBroadcasting)}
                className={`button-secondary text-xs py-1.5 px-3 font-bold ${
                  gpsBroadcasting ? 'text-emerald-700 border-emerald-300' : 'text-slate-600'
                }`}
              >
                {gpsBroadcasting ? 'Active' : 'Enable'}
              </button>
            </div>

            {/* Next Stop Stepper */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Navigation size={15} className="text-[#1261d6]" />
                  <span>Route Stops Progress ({currentStopIndex + 1} of {stopsList.length})</span>
                </span>
                <button
                  onClick={handleNextStop}
                  disabled={currentStopIndex >= stopsList.length - 1}
                  className="button-primary text-xs py-1.5 px-3 flex items-center gap-1 font-bold disabled:opacity-40"
                >
                  <Volume2 size={13} />
                  <span>Announce Next Stop</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="space-y-2 border-l-2 border-blue-200 pl-4 ml-2">
                {stopsList.map((stop, idx) => {
                  const isCurrent = idx === currentStopIndex
                  const isPassed = idx < currentStopIndex
                  return (
                    <div
                      key={stop.name}
                      className={`relative text-xs flex items-center justify-between p-2 rounded-lg transition ${
                        isCurrent
                          ? 'bg-blue-50 font-bold text-[#1261d6] border border-blue-200'
                          : isPassed
                          ? 'text-slate-400 line-through'
                          : 'text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`-ml-[25px] h-3 w-3 rounded-full border-2 border-white ${
                            isCurrent ? 'bg-[#1261d6]' : isPassed ? 'bg-slate-300' : 'bg-slate-200'
                          }`}
                        />
                        <span>{stop.name}</span>
                      </div>
                      <span className="text-[11px] font-medium">{stop.time}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Passenger Load / Crowd Level Updater */}
          <div className="card p-6 border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Users size={16} className="text-blue-600" />
                <span>Passenger Load on Bus</span>
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Current: {occupancyLevel}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Keep passengers informed of onboard crowd density at incoming bus stands.
            </p>

            <div className="grid grid-cols-4 gap-2 pt-1">
              {(['Low', 'Medium', 'High', 'Full'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleUpdateOccupancy(lvl)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition ${
                    occupancyLevel === lvl
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Driver Quick Actions & Emergency */}
        <div className="space-y-6">
          
          {/* Quick Delay Broadcast Buttons */}
          <div className="card p-6 border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Clock size={16} className="text-amber-600" />
              <span>Report Traffic Delay</span>
            </span>
            <p className="text-[11px] text-slate-500">
              One-touch dispatch delay notification to all waiting commuters along Route {currentBus?.routeNumber}.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => handleReportDelay(5)}
                className="p-2.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold text-center transition"
              >
                +5 Min
              </button>
              <button
                onClick={() => handleReportDelay(10)}
                className="p-2.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold text-center transition"
              >
                +10 Min
              </button>
              <button
                onClick={() => handleReportDelay(20)}
                className="p-2.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold text-center transition"
              >
                +20 Min
              </button>
            </div>
          </div>

          {/* Emergency SOS Button */}
          <div className="card p-6 border-red-200 bg-red-50/40 space-y-3">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
              <AlertTriangle size={18} />
              <span>Driver Emergency SOS & Incident</span>
            </div>
            <p className="text-xs text-red-800/80 leading-relaxed">
              Use in case of mechanical breakdown, medical emergency onboard, or severe road blockage. Instantly alerts TNSTC control room.
            </p>

            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
            >
              <Flame size={16} />
              <span>Trigger Driver Incident Alert</span>
            </button>
          </div>

          {/* Super Admin Authorization Badge */}
          <div className="card p-6 border-slate-200 bg-slate-50 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <ShieldCheck size={17} className="text-emerald-600" />
              <span>Super Admin Credentials Verification</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div>Employee ID: <strong>TNSTC-DRV-482</strong></div>
              <div>License: <strong>{user?.phone ? `Valid: ${user.phone}` : 'TN-38-2012-DR-88219'}</strong></div>
              <div>Account Status: <span className="font-bold text-emerald-700">Active & Audited ✓</span></div>
              <div className="pt-2 border-t border-slate-200 text-slate-400">
                Authorized by State Transport Directorate Super Admin.
              </div>
            </div>
          </div>

          {/* View Public Live Tracking */}
          <Link
            to="/live"
            className="card p-4 border-blue-200 bg-blue-50 hover:bg-blue-100 text-[#1261d6] flex items-center justify-between text-xs font-bold transition"
          >
            <span>Preview Public Passenger Live Map →</span>
            <Compass size={16} />
          </Link>

        </div>
      </div>

      {/* Incident Modal */}
      {isEmergencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-red-200">
            <div className="flex items-center gap-2 text-red-600 font-bold text-base mb-2">
              <AlertTriangle size={20} />
              <h3>Report Driver Emergency Incident</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Select the urgent incident type to immediately broadcast to the depot dispatch center:
            </p>
            <div className="space-y-2 mb-4">
              <button
                onClick={() => handleTriggerSos('Mechanical engine breakdown near junction')}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-red-400 hover:bg-red-50 text-xs font-bold text-slate-800"
              >
                🛠️ Mechanical Breakdown (Replacement bus needed)
              </button>
              <button
                onClick={() => handleTriggerSos('Medical emergency onboard — Ambulance requested')}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-red-400 hover:bg-red-50 text-xs font-bold text-slate-800"
              >
                🚑 Passenger Medical Emergency (108 Ambulance)
              </button>
              <button
                onClick={() => handleTriggerSos('Severe road waterlogging / Route diverted')}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-red-400 hover:bg-red-50 text-xs font-bold text-slate-800"
              >
                🌊 Severe Road Obstruction / Flooding
              </button>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEmergencyModalOpen(false)}
                className="button-secondary text-xs py-2 px-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
