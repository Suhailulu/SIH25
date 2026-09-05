import React from 'react'
import { Link } from 'react-router-dom'
import { useTransport } from '../../contexts/TransportContext'
import {
  Bell,
  AlertTriangle,
  Info,
  ShieldAlert,
  ArrowRight,
  Compass,
  Radio,
  Clock
} from 'lucide-react'

export default function AlertsPage() {
  const { alerts, routes } = useTransport()

  const emergencyAlerts = alerts.filter((a) => a.severity === 'Emergency')
  const warningAlerts = alerts.filter((a) => a.severity === 'Warning')
  const infoAlerts = alerts.filter((a) => a.severity === 'Information' || a.severity === 'Disruption')

  return (
    <div className="container py-8 pb-20 max-w-4xl">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
          <AlertTriangle size={16} />
          <span>Real-Time Service Feeds</span>
        </div>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Transit Alerts & Disruption Center</h1>
        <p className="mt-1 text-sm text-slate-500">
          Official bulletins on traffic congestion, route diversions, road maintenance, and civic emergency events.
        </p>
      </header>

      {/* Emergency Section if active */}
      {emergencyAlerts.length > 0 && (
        <section className="mb-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider">
            <ShieldAlert size={16} />
            <span>Active Emergency Bulletins</span>
          </div>

          {emergencyAlerts.map((alert) => (
            <div
              key={alert.id}
              className="card p-6 border-l-4 border-l-red-600 bg-red-50/50 border-red-200 shadow-lg space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-red-600 text-white font-black text-[10px] uppercase tracking-wider">
                    Emergency Alert
                  </span>
                  <h2 className="mt-2 text-lg font-bold text-red-950">{alert.title}</h2>
                </div>
                <span className="text-xs text-red-600 font-semibold">{alert.startTime}</span>
              </div>

              <p className="text-xs text-red-900 leading-relaxed">{alert.description}</p>

              <div className="p-3 bg-white/80 rounded-xl border border-red-100 text-xs text-red-950 space-y-1">
                <div>
                  <strong>Affected Routes:</strong> Route {alert.affectedRoutes.join(', ')}
                </div>
                <div>
                  <strong>Recommended Action:</strong> {alert.recommendedAction}
                </div>
              </div>

              {alert.suggestedAlternativeRoute && (
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-red-800">
                    Suggested Alternative: Route {alert.suggestedAlternativeRoute}
                  </span>
                  <Link
                    to={`/plan?to=stop-railway`}
                    className="button-primary bg-red-600 hover:bg-red-700 text-xs py-1.5 px-3 font-bold"
                  >
                    Take Alternative Route →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Warnings and Disruptions */}
      <section className="space-y-4 mb-8">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-500" />
          Service Delays & Diversions
        </h2>

        {warningAlerts.map((alert) => (
          <div
            key={alert.id}
            className="card p-5 border-l-4 border-l-amber-500 border-slate-200 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px] uppercase">
                  Delay Advisory
                </span>
                <h3 className="mt-1.5 text-base font-bold text-slate-900">{alert.title}</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">{alert.startTime}</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{alert.description}</p>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <div className="text-slate-700">
                <strong>Affected Corridors:</strong> Route {alert.affectedRoutes.join(', ')}
              </div>
              <div className="text-slate-700">
                <strong>Guidance:</strong> {alert.recommendedAction}
              </div>
            </div>

            {alert.suggestedAlternativeRoute && (
              <div className="pt-2 flex justify-end">
                <Link
                  to="/plan"
                  className="text-xs font-bold text-[#1261d6] flex items-center gap-1 hover:underline"
                >
                  Check Alternative Express Routes <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Information & Civic Notices */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Info size={16} className="text-[#1261d6]" />
          Transit Notices & Safety Desks
        </h2>

        {infoAlerts.map((alert) => (
          <div
            key={alert.id}
            className="card p-5 border-l-4 border-l-[#1261d6] border-slate-200 space-y-2"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-bold text-slate-900">{alert.title}</h3>
              <span className="text-xs text-slate-400">{alert.startTime}</span>
            </div>
            <p className="text-xs text-slate-600">{alert.description}</p>
            <div className="text-xs text-slate-700 font-semibold">{alert.recommendedAction}</div>
          </div>
        ))}
      </section>
    </div>
  )
}
