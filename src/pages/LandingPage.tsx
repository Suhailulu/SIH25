import React from 'react'
import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <main className="container">
      <header className="header flex items-center justify-between">
        <h1 className="text-2xl font-semibold">TransitJustice</h1>
        <nav className="space-x-4">
          <Link to="/passenger/report" className="text-blue-600">Report an Issue</Link>
          <Link to="/passenger/dashboard" className="text-gray-700">Dashboard</Link>
        </nav>
      </header>

      <section className="grid gap-8 md:grid-cols-2 items-center">
        <div>
          <h2 className="text-4xl font-bold">Your Journey. Your Rights. Your Voice.</h2>
          <p className="mt-4 text-lg text-gray-700">Report public transport service issues, submit supporting evidence, track your grievance, and stay informed throughout the resolution process.</p>

          <div className="mt-6 flex gap-3">
            <Link to="/passenger/report" className="bg-blue-600 text-white px-4 py-2 rounded">Report an Issue</Link>
            <Link to="/passenger/dashboard" className="border border-blue-600 text-blue-600 px-4 py-2 rounded">Track Complaint</Link>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold">How it works</h3>
          <ol className="mt-4 space-y-2">
            <li>1. Report — Describe what happened.</li>
            <li>2. Submit Evidence — Upload your ticket and evidence.</li>
            <li>3. Review — The relevant authority reviews the grievance.</li>
            <li>4. Track Resolution — Follow the complaint from submission to resolution.</li>
          </ol>
        </div>
      </section>

      <section className="mt-12">
        <h3 className="text-2xl font-semibold">Features</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card">Easy Complaint Reporting</div>
          <div className="card">Ticket & Evidence Upload</div>
          <div className="card">Complaint Tracking</div>
          <div className="card">Authority Communication</div>
          <div className="card">Smart Issue Classification</div>
          <div className="card">Recurring Issue Detection</div>
        </div>
      </section>
    </main>
  )
}
