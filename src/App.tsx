import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import PassengerDashboard from './pages/passenger/Dashboard'
import ReportPage from './pages/passenger/Report'
import LoginPage from './pages/Auth/Login'
import SignupPage from './pages/Auth/Signup'
import ForgotPasswordPage from './pages/Auth/ForgotPassword'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="/passenger/dashboard"
          element={<ProtectedRoute><PassengerDashboard /></ProtectedRoute>}
        />
        <Route
          path="/passenger/report/*"
          element={<ProtectedRoute><ReportPage /></ProtectedRoute>}
        />

        <Route path="*" element={<div className="p-8">404 — <Link to="/">Home</Link></div>} />
      </Routes>
    </div>
  )
}
