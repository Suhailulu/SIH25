import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import ReportStart from './report/Start'
import ReportForm from './report/Form'

export default function ReportPage() {
  return (
    <div className="container py-8">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold">Report an Issue</h2>
        <p className="text-gray-600">Follow the steps to submit a complaint.</p>
      </header>

      <Routes>
        <Route path="/" element={<ReportStart />} />
        <Route path="/form" element={<ReportForm />} />
      </Routes>

      <div className="mt-6">
        <Link to="/passenger/dashboard" className="text-sm text-gray-600">Back to dashboard</Link>
      </div>
    </div>
  )
}
