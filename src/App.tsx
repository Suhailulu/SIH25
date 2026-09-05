import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import PassengerDashboard from './pages/passenger/Dashboard'
import ReportPage from './pages/passenger/Report'
import LoginPage from './pages/Auth/Login'
import SignupPage from './pages/Auth/Signup'
import ForgotPasswordPage from './pages/Auth/ForgotPassword'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import ProfilePage from './pages/passenger/Profile'
import RoleProtectedRoute from './components/RoleProtectedRoute'
import AuthorityDashboard from './pages/authority/Dashboard'
import AuthorityComplaints from './pages/authority/Complaints'
import AuthorityComplaintDetails from './pages/authority/complaints/Details'
import ComplaintsPage from './pages/passenger/Complaints'
import ComplaintDetails from './pages/passenger/complaints/Details'
import RightsPage from './pages/passenger/Rights'
import TrackComplaintPage from './pages/passenger/TrackComplaint'
import NotificationsPage from './pages/Notifications'
import ManageProfiles from './pages/admin/ManageProfiles'
import AdminAnalytics from './pages/admin/Analytics'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/track" element={<TrackComplaintPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/passenger/dashboard" element={<ProtectedRoute><PassengerDashboard /></ProtectedRoute>} />
        <Route path="/passenger/report/*" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
        <Route path="/passenger/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/passenger/complaints" element={<ProtectedRoute><ComplaintsPage /></ProtectedRoute>} />
        <Route path="/passenger/complaints/:id" element={<ProtectedRoute><ComplaintDetails /></ProtectedRoute>} />
        <Route path="/passenger/rights" element={<ProtectedRoute><RightsPage /></ProtectedRoute>} />
        <Route path="/authority/dashboard" element={<RoleProtectedRoute roles={[ 'authority', 'admin' ]}><AuthorityDashboard /></RoleProtectedRoute>} />
        <Route path="/authority/complaints" element={<RoleProtectedRoute roles={[ 'authority', 'admin' ]}><AuthorityComplaints /></RoleProtectedRoute>} />
        <Route path="/authority/complaints/:id" element={<RoleProtectedRoute roles={[ 'authority', 'admin' ]}><AuthorityComplaintDetails /></RoleProtectedRoute>} />
        <Route path="/passenger/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/admin/manage-profiles" element={<RoleProtectedRoute roles={[ 'admin' ]}><ManageProfiles /></RoleProtectedRoute>} />
        <Route path="/admin/analytics" element={<RoleProtectedRoute roles={[ 'admin' ]}><AdminAnalytics /></RoleProtectedRoute>} />

        <Route path="*" element={<div className="p-8">404 — <Link to="/">Home</Link></div>} />
      </Routes>
    </div>
  )
}
