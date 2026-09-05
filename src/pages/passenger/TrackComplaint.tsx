import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTransport } from '../../contexts/TransportContext'
import { getComplaintByNumber } from '../../services/complaints'
import {
  Search,
  CheckCircle2,
  Clock,
  FileText,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  FileWarning
} from 'lucide-react'

export default function TrackComplaintPage() {
  const { id: paramId } = useParams<{ id: string }>()
  const { complaints } = useTransport()
  const { user } = useAuth()

  const [query, setQuery] = useState(paramId || 'TJ-2026-000001')
  const [result, setResult] = useState<any | null>(null)
  const [searching, setSearching] = useState(false)

  const handleSearch = async (targetQuery?: string) => {
    const q = (targetQuery || query).trim()
    if (!q) return

    setSearching(true)
    // 1. Try local reactive transport context first (so demo status changes reflect immediately!)
    const localMatch = complaints.find(
      (c) => c.complaint_number.toLowerCase() === q.toLowerCase() || c.id.toLowerCase() === q.toLowerCase()
    )

    if (localMatch) {
      setResult({
        ...localMatch,
        current_status: localMatch.status
      })
      setSearching(false)
      return
    }

    // 2. Fallback to Supabase service if available
    try {
      const res = await getComplaintByNumber(q)
      if (res.data) {
        setResult(res.data)
      } else {
        setResult(null)
      }
    } catch (e) {
      setResult(null)
    }
    setSearching(false)
  }

  useEffect(() => {
    if (query) {
      handleSearch(query)
    }
  }, [complaints])

  const stages = [
    { key: 'Submitted', label: '1. Submitted', desc: 'Filed by passenger via portal' },
    { key: 'Received', label: '2. Acknowledged', desc: 'Accepted by Transport System' },
    { key: 'Assigned to Officer', label: '3. Assigned to Officer', desc: 'Designated to Depot Inspector' },
    { key: 'Under Review', label: '4. Under Investigation', desc: 'Driver / Conductor statement recorded' },
    { key: 'Action Taken', label: '5. Action Taken', desc: 'Corrective warning or penalty issued' },
    { key: 'Resolved', label: '6. Resolved', desc: 'Redressal logged & passenger updated' }
  ]

  const getStageIndex = (status: string) => {
    if (status === 'Resolved' || status === 'Closed') return 5
    if (status === 'Action Taken') return 4
    if (status === 'Under Review' || status === 'Investigation in Progress') return 3
    if (status === 'Assigned to Officer') return 2
    if (status === 'Received' || status === 'Acknowledged') return 1
    return 0
  }

  return (
    <div className="container py-8 pb-20 max-w-3xl">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-[#e96b4c] uppercase tracking-wider">
          <Search size={16} />
          <span>Public Transport Accountability</span>
        </div>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Track Complaint Status</h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter your reference number to inspect the live investigation timeline, evidence audit, and authority resolution.
        </p>
      </header>

      {/* Search Box */}
      <div className="card p-5 mb-8 border-slate-200 shadow-md">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter complaint number (e.g. TJ-2026-000001)"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={searching}
            className="button-primary text-xs py-2.5 px-6 font-bold"
          >
            {searching ? 'Querying...' : 'Track Status'}
          </button>
        </div>

        {/* Quick sample pills */}
        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
          <span>Sample references:</span>
          {['TJ-2026-000001', 'TJ-2026-000002', 'TJ-2026-000003'].map((sample) => (
            <button
              key={sample}
              onClick={() => {
                setQuery(sample)
                handleSearch(sample)
              }}
              className="text-[#1261d6] font-bold hover:underline"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {result ? (
        <div className="card p-6 border-slate-200 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
            <div>
              <span className="text-xs font-black uppercase text-[#1261d6] tracking-wider">
                Case File #{result.complaint_number}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">{result.category}</h2>
              <p className="text-xs text-slate-500">{result.subcategory || result.description}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#1261d6] border border-blue-200">
                Status: {result.current_status || result.status}
              </span>
              <div className="text-[10px] text-slate-400 mt-1">Priority: {result.priority || 'MEDIUM'}</div>
            </div>
          </div>

          {/* Incident Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-4 bg-slate-50 rounded-2xl">
            <div>
              <span className="text-slate-400 block font-semibold text-[10px]">Service & Route</span>
              <strong className="text-slate-800">{result.service_number || 'Route 12A'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px]">Operator</span>
              <strong className="text-slate-800">{result.operator_name || 'Metro Transit'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px]">Boarding Point</span>
              <strong className="text-slate-800">{result.boarding_point || 'City Centre'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px]">Submission Date</span>
              <strong className="text-slate-800">
                {result.created_at ? new Date(result.created_at).toLocaleDateString() : 'Recent'}
              </strong>
            </div>
          </div>

          {/* Grievance Statement */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Grievance Summary</h3>
            <p className="mt-1.5 p-3.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed">
              "{result.description}"
            </p>
          </div>

          {/* 6-Stage Timeline */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              Investigation & Redressal Timeline
            </h3>

            <div className="space-y-4">
              {stages.map((stage, sIdx) => {
                const isPassed = sIdx <= getStageIndex(result.current_status || result.status)
                const isCurrent = sIdx === getStageIndex(result.current_status || result.status)

                return (
                  <div key={stage.key} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCurrent
                            ? 'bg-[#1261d6] text-white ring-4 ring-blue-100'
                            : isPassed
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isPassed ? '✓' : sIdx + 1}
                      </span>
                      {sIdx < stages.length - 1 && (
                        <span
                          className={`w-0.5 h-8 mt-1 ${isPassed ? 'bg-emerald-400' : 'bg-slate-200'}`}
                        />
                      )}
                    </div>

                    <div className="-mt-0.5">
                      <div className="text-xs font-bold text-slate-900">{stage.label}</div>
                      <div className="text-[11px] text-slate-500">{stage.desc}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link to="/passenger/report" className="text-slate-600 hover:text-slate-900">
              Report Another Issue
            </Link>
            <Link
              to="/rights"
              className="text-[#1261d6] font-bold flex items-center gap-1 hover:underline"
            >
              Learn about Passenger Escalation Rights <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      ) : (
        !searching && (
          <div className="card p-8 text-center text-slate-500 text-xs space-y-2">
            <FileWarning size={32} className="mx-auto text-slate-300" />
            <div className="font-bold text-slate-700">No complaint found for that reference number.</div>
            <p>Please check the format (e.g. TJ-2026-000001) or file a new complaint.</p>
          </div>
        )
      )}
    </div>
  )
}
