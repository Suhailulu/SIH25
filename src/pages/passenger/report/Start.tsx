import React from 'react'
import { Link } from 'react-router-dom'

const categories = [
  'Denied Seat',
  'Denied Boarding',
  'Refusal of Service',
  'Staff Misconduct',
  'Unfair Treatment',
  'Ticketing Issue',
  'Overcharging',
  'Safety Concern',
  'Other'
]

export default function ReportStart() {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold">Step 1 — Issue Type</h3>
      <p className="text-sm text-gray-600 mt-2">Select the type of issue you experienced.</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {categories.map((c) => (
          <label key={c} className="flex items-center gap-2 p-3 border rounded">
            <input type="radio" name="category" value={c} />
            <span>{c}</span>
          </label>
        ))}
      </div>

      <div className="mt-4 flex justify-between">
        <div />
        <Link to="/passenger/report/form" className="bg-blue-600 text-white px-4 py-2 rounded">Next: Journey Details</Link>
      </div>
    </div>
  )
}
