import React, { useState } from 'react'
import { getComplaintByNumber } from '../../services/complaints'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function TrackComplaintPage() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<any | null>(null)
  const [searching, setSearching] = useState(false)
  const { user } = useAuth()

  async function handleSearch() {
    const q = query.trim()
    if (!q) return
    setSearching(true)
    const res = await getComplaintByNumber(q)
    setSearching(false)
    if (res.error) setResult(null)
    else setResult(res.data)
  }

  return (
    <div className="container py-8">
      <div className="max-w-xl mx-auto card">
        <h3 className="text-xl font-semibold">Track Complaint</h3>
        <div className="mt-4 flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter complaint number (e.g. TJ-2026-000001)"
            className="flex-1 w-full border rounded px-3 py-2"
          />
          <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={handleSearch} disabled={searching}>{searching ? 'Searching...' : 'Search'}</button>
        </div>

        {query && !searching && result === null && (
          <div className="mt-4 text-sm text-gray-600">No complaint found for that number.</div>
        )}

        {result && (
          <div className="mt-4 border rounded p-4">
            <div className="text-sm text-gray-600">{result.complaint_number}</div>
            <div className="font-semibold mt-1">{result.category}</div>
            <div className="text-sm mt-2">Status: {result.current_status}</div>
            <div className="text-sm">Priority: {result.priority}</div>
            {user && user.id === result.passenger_id && (
              <div className="mt-3"><Link to={`/passenger/complaints/${result.id}`} className="text-blue-600">View details</Link></div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
