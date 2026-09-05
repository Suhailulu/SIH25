import React from 'react'
import { Link } from 'react-router-dom'

export default function PassengerDashboard() {
  return (
    <div className="container py-8">
      <header className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Hello, Passenger</h2>
        <div>
          <Link to="/passenger/report" className="bg-blue-600 text-white px-3 py-2 rounded">Report an Issue</Link>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="card">Active complaints: 0</div>
        <div className="card">Under review: 0</div>
        <div className="card">Resolved: 0</div>
      </section>

      <section className="mt-8">
        <h3 className="text-xl font-semibold">Recent Complaints</h3>
        <div className="mt-4">No complaints yet.</div>
      </section>
    </div>
  )
}
