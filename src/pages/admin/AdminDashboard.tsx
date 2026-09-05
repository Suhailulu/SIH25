import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTransport } from '../../contexts/TransportContext'
import MapContainer from '../../components/MapContainer'
import {
  ShieldCheck,
  Radio,
  MapPin,
  Compass,
  FileWarning,
  AlertTriangle,
  Users,
  CheckCircle,
  Plus,
  Edit2,
  Trash2,
  BarChart3,
  Sliders,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react'

export default function AdminDashboard() {
  const {
    buses,
    routes,
    stops,
    alerts,
    complaints,
    advanceComplaintStatus,
    triggerBusDelay,
    triggerEmergencyAlert,
    addBus,
    addRoute,
    addStop,
    addAlert
  } = useTransport()

  const [activeTab, setActiveTab] = useState<'overview' | 'buses' | 'routes' | 'complaints' | 'alerts' | 'analytics'>('overview')

  // Stats
  const activeBusesCount = buses.filter((b) => b.status !== 'Out of service').length
  const pendingComplaints = complaints.filter((c) => !['Resolved', 'Closed'].includes(c.status)).length
  const resolvedComplaints = complaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length
  const activeAlertsCount = alerts.filter((a) => a.status === 'Active').length

  // Quick complaint status changer
  const handleStatusChange = (complaintId: string, status: string) => {
    advanceComplaintStatus(complaintId, status, `Updated by Transport Authority officer via Admin Console`)
  }

  return (
    <div className="container py-8 pb-20">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1261d6] uppercase tracking-wider">
            <ShieldCheck size={16} />
            <span>Civic Transport Authority Dashboard</span>
          </div>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Operations Control Center</h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time fleet supervision, route dispatch, fare structures, emergency broadcast, and passenger grievance redressal.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-1 p-1 bg-slate-200/80 rounded-2xl text-xs font-bold">
          {(['overview', 'buses', 'routes', 'complaints', 'alerts', 'analytics'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl capitalize transition ${
                activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="card p-5 border-l-4 border-l-[#1261d6]">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Fleet in Operation</span>
            <Radio size={16} className="text-[#1261d6]" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">{activeBusesCount} Buses</div>
          <div className="text-[11px] text-slate-500 mt-1">Transmitting simulated GPS feeds</div>
        </div>

        <div className="card p-5 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Operational Routes</span>
            <Compass size={16} className="text-purple-600" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">{routes.length} Corridors</div>
          <div className="text-[11px] text-slate-500 mt-1">{stops.length} Designated Halts</div>
        </div>

        <div className="card p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Pending Grievances</span>
            <FileWarning size={16} className="text-amber-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">{pendingComplaints} Active</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            {resolvedComplaints} Resolved Cases
          </div>
        </div>

        <div className="card p-5 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Service Bulletins</span>
            <AlertTriangle size={16} className="text-red-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">{activeAlertsCount} Bulletins</div>
          <div className="text-[11px] text-slate-500 mt-1">Passenger broadcast active</div>
        </div>
      </section>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Live Fleet Map */}
          <div className="card p-6 border-slate-200 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Radio size={18} className="text-[#1261d6]" /> Live Fleet Tracking Map
                </h2>
                <p className="text-xs text-slate-500">Real-time positions of all stage carriage city buses</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700">
                Live GPS Feeds Active
              </span>
            </div>
            <MapContainer buses={buses} stops={stops} routes={routes} height="440px" />
          </div>

          {/* Rapid Triage Complaint Queue Preview */}
          <div className="card p-6 border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Recent Grievance Triage Queue</h2>
              <button
                onClick={() => setActiveTab('complaints')}
                className="text-xs font-bold text-[#1261d6] hover:underline"
              >
                View Full Complaint Queue ({complaints.length}) →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5">Ref #</th>
                    <th className="py-2.5">Category</th>
                    <th className="py-2.5">Route / Vehicle</th>
                    <th className="py-2.5">Priority</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5 text-right">Advance Workflow</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {complaints.slice(0, 4).map((c) => (
                    <tr key={c.id}>
                      <td className="py-3 text-[#1261d6] font-bold">{c.complaint_number}</td>
                      <td className="py-3">{c.category}</td>
                      <td className="py-3 text-slate-500">{c.service_number || c.route || 'Route 12A'}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800">
                          {c.priority}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <select
                          value={c.status}
                          onChange={(e) => handleStatusChange(c.id, e.target.value)}
                          className="border border-slate-200 rounded p-1 text-[11px] bg-slate-50 font-medium"
                        >
                          <option value="Submitted">1. Submitted</option>
                          <option value="Received">2. Received</option>
                          <option value="Under Review">3. Under Review</option>
                          <option value="Assigned to Officer">4. Assigned to Officer</option>
                          <option value="Investigation in Progress">5. Investigation</option>
                          <option value="Action Taken">6. Action Taken</option>
                          <option value="Resolved">7. Resolved</option>
                          <option value="Closed">8. Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* BUSES TAB */}
      {activeTab === 'buses' && (
        <div className="card p-6 border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Fleet Management</h2>
            <button
              onClick={() => {
                const newId = `bus-${Date.now()}`
                addBus({
                  id: newId,
                  registrationNumber: `TN-38-N-${Math.floor(1000 + Math.random() * 9000)}`,
                  routeId: 'route-12a',
                  routeNumber: '12A',
                  routeName: 'Central ⇄ Railway Junction',
                  operator: 'TNSTC Public Express',
                  currentLocation: {
                    latitude: 11.015,
                    longitude: 76.969,
                    timestamp: new Date().toISOString(),
                    speedKmH: 28,
                    headingDeg: 180
                  },
                  currentStopId: 'stop-central',
                  nextStopId: 'stop-collectorate',
                  nextStopName: 'District Collectorate',
                  etaNextStopMin: 4,
                  etaDestinationMin: 18,
                  status: 'On time',
                  delayMinutes: 0,
                  occupancy: 'Medium',
                  vehicleType: 'Standard City',
                  features: {
                    ac: false,
                    lowFloor: false,
                    wheelchairAccessible: true,
                    cctv: true,
                    emergencyButtons: true,
                    womenSection: true
                  },
                  lastUpdatedSecondsAgo: 2
                })
              }}
              className="button-primary text-xs py-1.5 px-3 flex items-center gap-1"
            >
              <Plus size={14} /> Dispatch New Bus
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5">Registration</th>
                  <th className="py-2.5">Route</th>
                  <th className="py-2.5">Class</th>
                  <th className="py-2.5">Speed</th>
                  <th className="py-2.5">Next Stop</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Quick Delay Inject</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {buses.map((bus) => (
                  <tr key={bus.id}>
                    <td className="py-3 font-bold text-slate-900">{bus.registrationNumber}</td>
                    <td className="py-3 font-bold text-[#1261d6]">Route {bus.routeNumber}</td>
                    <td className="py-3">{bus.vehicleType}</td>
                    <td className="py-3">{bus.currentLocation.speedKmH} km/h</td>
                    <td className="py-3">{bus.nextStopName}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          bus.status === 'Delayed' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {bus.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => triggerBusDelay(bus.id, 15)}
                        className="px-2 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold hover:bg-amber-100"
                      >
                        +15m Delay
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ROUTES TAB */}
      {activeTab === 'routes' && (
        <div className="card p-6 border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Route Corridors & Dispatches</h2>
            <button
              onClick={() => {
                triggerEmergencyAlert('12A', 'Road blockage at Central Junction due to emergency works.')
              }}
              className="button-primary bg-red-600 hover:bg-red-700 text-xs py-1.5 px-3 flex items-center gap-1"
            >
              <AlertTriangle size={14} /> Trigger Emergency Diversion
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {routes.map((route) => (
              <div key={route.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span
                    className="px-2.5 py-0.5 rounded text-white font-black text-xs"
                    style={{ backgroundColor: route.color }}
                  >
                    Route {route.routeNumber}
                  </span>
                  <span className="font-bold text-slate-500">{route.status}</span>
                </div>
                <div className="font-bold text-slate-900 text-sm">{route.routeName}</div>
                <div className="text-slate-500">
                  {route.totalDistanceKm} km • {route.estimatedDurationMin} min • {route.stops.length} halts
                </div>
                {route.diversionNote && (
                  <div className="p-2 bg-red-50 text-red-800 rounded font-medium text-[11px]">
                    Diversion: {route.diversionNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMPLAINTS TAB */}
      {activeTab === 'complaints' && (
        <div className="card p-6 border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Official Grievance Management Desk</h2>
              <p className="text-xs text-slate-500">
                Advance cases through investigation stages to transparently update passengers.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {complaints.map((c) => (
              <div key={c.id} className="card p-5 border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                  <div>
                    <span className="text-xs font-black text-[#1261d6]">{c.complaint_number}</span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{c.category}</h3>
                    <div className="text-xs text-slate-500">
                      Route: {c.route || c.service_number || 'Route 12A'} • Submitter: Citizen ID #8492
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800">
                      {c.priority} Priority
                    </span>
                    <div className="text-xs font-bold text-slate-700">
                      Current: <span className="text-blue-700">{c.status}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl leading-relaxed">
                  "{c.description}"
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-slate-400 font-semibold">Advance Status:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Under Review', 'Assigned to Officer', 'Action Taken', 'Resolved'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(c.id, st)}
                        className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition ${
                          c.status === st
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Set {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALERTS TAB */}
      {activeTab === 'alerts' && (
        <div className="card p-6 border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Broadcast Service Disruption Bulletins</h2>
            <button
              onClick={() => {
                triggerEmergencyAlert('12A', 'Sudden culvert water-logging. Traffic diverted via bypass.')
              }}
              className="button-primary bg-red-600 text-xs py-1.5 px-3"
            >
              Publish Emergency Alert
            </button>
          </div>

          <div className="space-y-3">
            {alerts.map((al) => (
              <div key={al.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900 text-sm">{al.title}</span>
                  <span className="text-red-600 uppercase font-black">{al.severity}</span>
                </div>
                <p className="text-slate-600">{al.description}</p>
                <div className="text-[11px] text-slate-500 pt-1 font-semibold">
                  Affected: Route {al.affectedRoutes.join(', ')} • Action: {al.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card p-6 border-slate-200 space-y-3">
              <h3 className="text-base font-bold text-slate-900">Grievances by Category</h3>
              <p className="text-xs text-slate-500">Distribution of citizen reports logged over the past 30 days</p>
              <div className="space-y-2 pt-2 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>Overcharging & Fare Disputes</span>
                    <span>38%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-[#1261d6] w-[38%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>Peak Hour Bus Delays</span>
                    <span>28%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-amber-500 w-[28%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>Staff Conduct & Seat Denial</span>
                    <span>20%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-purple-500 w-[20%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>Shelter & Stop Infrastructure</span>
                    <span>14%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[14%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6 border-slate-200 space-y-3">
              <h3 className="text-base font-bold text-slate-900">Route Reliability & Punctuality</h3>
              <p className="text-xs text-slate-500">Percentage of services reaching terminals within 5 minutes of schedule</p>
              <div className="space-y-2 pt-2 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>Route 24A (Fast Express)</span>
                    <span className="text-emerald-600 font-bold">94% on time</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[94%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>Route 14B (Lake Promenade)</span>
                    <span className="text-emerald-600 font-bold">88% on time</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[88%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>Route 8A (Perur Heritage)</span>
                    <span className="text-amber-600 font-bold">82% on time</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-amber-500 w-[82%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>Route 12A (Collectorate Corridor)</span>
                    <span className="text-amber-600 font-bold">78% on time</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-amber-500 w-[78%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
