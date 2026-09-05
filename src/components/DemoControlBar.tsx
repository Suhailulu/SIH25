import React, { useState } from 'react'
import { useTransport } from '../contexts/TransportContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { Sliders, Play, Pause, AlertTriangle, Clock, RefreshCw, ShieldAlert, CheckCircle } from 'lucide-react'

export default function DemoControlBar() {
  const {
    isSimulationRunning,
    setIsSimulationRunning,
    triggerBusDelay,
    triggerEmergencyAlert,
    advanceComplaintStatus,
    complaints,
    userRole,
    setUserRole
  } = useTransport()

  const { switchDemoRole } = useAuth()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [lastAction, setLastAction] = useState<string | null>(null)

  const handleSimulateDelay = () => {
    triggerBusDelay('bus-12a-01', 12)
    setLastAction('Simulated +12 min delay on Route 12A (TN-38-N-1204)')
    setTimeout(() => setLastAction(null), 4000)
  }

  const handleSimulateEmergency = () => {
    triggerEmergencyAlert('12A', 'Road closure near Central Junction due to sudden heavy waterlogging.')
    setLastAction('Triggered Emergency Alert on Route 12A')
    setTimeout(() => setLastAction(null), 4000)
  }

  const handleAdvanceComplaint = () => {
    if (complaints.length > 0) {
      const target = complaints[0]
      const statusCycle: Record<string, string> = {
        'Submitted': 'Acknowledged',
        'Received': 'Under Review',
        'Under Review': 'Assigned to Officer',
        'Assigned to Officer': 'Investigation in Progress',
        'Investigation in Progress': 'Action Taken',
        'Action Taken': 'Resolved',
        'Resolved': 'Closed',
        'Closed': 'Submitted'
      }
      const next = statusCycle[target.status] || 'Under Review'
      advanceComplaintStatus(target.id, next, `Advanced by transport inspector in live demo`)
      setLastAction(`Advanced Complaint #${target.complaint_number} to "${next}"`)
      setTimeout(() => setLastAction(null), 4000)
    }
  }

  return (
    <div className="sticky top-0 z-50 bg-[#17202a] text-white border-b border-slate-700/60 shadow-md text-xs">
      <div className="container flex items-center justify-between py-1.5 gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
            {t('app.demoBadge', 'Demo Mode')}
          </span>
          <span className="hidden sm:inline text-slate-300">
            Role: <strong className="text-white capitalize">{userRole}</strong>
          </span>
        </div>

        {lastAction && (
          <div className="hidden md:flex items-center gap-1 text-emerald-400 font-medium animate-pulse">
            <CheckCircle size={13} /> {lastAction}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulationRunning(!isSimulationRunning)}
            className={`px-2.5 py-1 rounded flex items-center gap-1 font-semibold transition ${
              isSimulationRunning ? 'bg-emerald-600/80 hover:bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}
            title="Toggle real-time bus location simulator"
          >
            {isSimulationRunning ? <Pause size={12} /> : <Play size={12} />}
            <span className="hidden sm:inline">{isSimulationRunning ? 'Live GPS Active' : 'Simulation Paused'}</span>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-2.5 py-1 rounded bg-blue-600/80 hover:bg-blue-600 text-white font-semibold flex items-center gap-1.5"
          >
            <Sliders size={12} />
            <span>Simulate Events</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="bg-[#0f172a] border-t border-slate-700/80 px-4 py-3">
          <div className="container grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-center">
            <div>
              <div className="text-[11px] text-slate-400 font-semibold mb-1">Switch Application View:</div>
              <div className="inline-flex rounded-lg border border-slate-700 p-0.5 bg-slate-800">
                {(['passenger', 'driver', 'admin', 'super_admin'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setUserRole(r)
                      switchDemoRole(r)
                    }}
                    className={`px-2 py-1 text-[10px] font-bold rounded capitalize transition ${
                      userRole === r ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {r.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 font-semibold mb-1">Transit Delay Simulation:</div>
              <button
                onClick={handleSimulateDelay}
                className="w-full text-left px-2.5 py-1 rounded bg-orange-600/30 hover:bg-orange-600/50 border border-orange-500/40 text-orange-200 font-medium flex items-center gap-1.5"
              >
                <Clock size={12} />
                <span>Simulate 12-min Delay (Route 12A)</span>
              </button>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 font-semibold mb-1">Emergency Event Simulation:</div>
              <button
                onClick={handleSimulateEmergency}
                className="w-full text-left px-2.5 py-1 rounded bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-200 font-medium flex items-center gap-1.5"
              >
                <AlertTriangle size={12} />
                <span>Trigger Road Closure Alert</span>
              </button>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 font-semibold mb-1">Complaint Lifecycle Step:</div>
              <button
                onClick={handleAdvanceComplaint}
                className="w-full text-left px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 font-medium flex items-center gap-1.5"
              >
                <RefreshCw size={12} />
                <span>Advance Complaint Status</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
