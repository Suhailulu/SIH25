import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Header from './components/Header'
import MobileBottomNav from './components/MobileBottomNav'
import DemoControlBar from './components/DemoControlBar'

// Passenger Pages
import PlanJourney from './pages/passenger/PlanJourney'
import LiveBuses from './pages/passenger/LiveBuses'
import BusesPage from './pages/passenger/Buses'
import BusDetails from './pages/passenger/BusDetails'
import RoutesPage from './pages/passenger/Routes'
import RouteDetails from './pages/passenger/RouteDetails'
import StopsPage from './pages/passenger/Stops'
import StopDetails from './pages/passenger/StopDetails'
import FareCalculatorPage from './pages/passenger/FareCalculator'
import SafetyCenter from './pages/passenger/SafetyCenter'
import SOSPage from './pages/passenger/SOSPage'
import WomenSafetyPage from './pages/passenger/WomenSafety'
import RightsPage from './pages/passenger/Rights'
import LawsPage from './pages/passenger/Laws'
import TourismPage from './pages/passenger/Tourism'
import DestinationDetails from './pages/passenger/DestinationDetails'
import HowItWorksPage from './pages/passenger/HowItWorks'
import RemindersPage from './pages/passenger/Reminders'
import AlertsPage from './pages/passenger/Alerts'

// Preserved Existing Passenger & Auth Pages
import PassengerDashboard from './pages/passenger/Dashboard'
import ReportPage from './pages/passenger/Report'
import LoginPage from './pages/Auth/Login'
import SignupPage from './pages/Auth/Signup'
import ForgotPasswordPage from './pages/Auth/ForgotPassword'
import ProtectedRoute from './components/ProtectedRoute'
import ProfilePage from './pages/passenger/Profile'
import RoleProtectedRoute from './components/RoleProtectedRoute'
import AuthorityDashboard from './pages/authority/Dashboard'
import AuthorityComplaints from './pages/authority/Complaints'
import AuthorityComplaintDetails from './pages/authority/complaints/Details'
import ComplaintsPage from './pages/passenger/Complaints'
import ComplaintDetails from './pages/passenger/complaints/Details'
import TrackComplaintPage from './pages/passenger/TrackComplaint'
import NotificationsPage from './pages/Notifications'
import ManageProfiles from './pages/admin/ManageProfiles'
import AdminAnalytics from './pages/admin/Analytics'

// New Authority / Admin Suite
import AdminDashboard from './pages/admin/AdminDashboard'

export default function App() {
  return (
    <div className="app-shell text-gray-900">
      {/* Demo Simulation Control Bar */}
      <DemoControlBar />

      {/* Global Header */}
      <Header />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:shadow-lg"
      >
        Skip to main content
      </a>

      <main id="main-content" tabIndex={-1} className="flex-1">
        <Routes>
          {/* Public Transit Hub & Mobility Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/plan" element={<PlanJourney />} />
          <Route path="/live" element={<LiveBuses />} />
          <Route path="/buses" element={<BusesPage />} />
          <Route path="/buses/:id" element={<BusDetails />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/routes/:id" element={<RouteDetails />} />
          <Route path="/stops" element={<StopsPage />} />
          <Route path="/stops/:id" element={<StopDetails />} />
          <Route path="/fares" element={<FareCalculatorPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/safety" element={<SafetyCenter />} />
          <Route path="/safety/sos" element={<SOSPage />} />
          <Route path="/women-safety" element={<WomenSafetyPage />} />
          <Route path="/rights" element={<RightsPage />} />
          <Route path="/laws" element={<LawsPage />} />
          <Route path="/tourism" element={<TourismPage />} />
          <Route path="/tourism/:id" element={<DestinationDetails />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/reminders" element={<RemindersPage />} />

          {/* Preserved Complaint & Case Desk Routes (with Section 48 Aliases) */}
          <Route path="/track" element={<TrackComplaintPage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/complaints/new" element={<ReportPage />} />
          <Route path="/complaints/:id" element={<TrackComplaintPage />} />

          {/* Authentication & User Portals */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          {/* Existing Protected Passenger Routes */}
          <Route path="/passenger/dashboard" element={<PassengerDashboard />} />
          <Route path="/passenger/report/*" element={<ReportPage />} />
          <Route path="/passenger/profile" element={<ProfilePage />} />
          <Route path="/passenger/complaints" element={<ComplaintsPage />} />
          <Route path="/passenger/complaints/:id" element={<ComplaintDetails />} />
          <Route path="/passenger/rights" element={<RightsPage />} />
          <Route path="/passenger/notifications" element={<NotificationsPage />} />

          {/* Transport Authority & Admin Console */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/buses" element={<AdminDashboard />} />
          <Route path="/admin/routes" element={<AdminDashboard />} />
          <Route path="/admin/stops" element={<AdminDashboard />} />
          <Route path="/admin/fares" element={<AdminDashboard />} />
          <Route path="/admin/complaints" element={<AdminDashboard />} />
          <Route path="/admin/alerts" element={<AdminDashboard />} />
          <Route path="/admin/tourism" element={<AdminDashboard />} />
          <Route path="/admin/legal" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminDashboard />} />

          {/* Existing Authority Endpoints */}
          <Route path="/authority/dashboard" element={<AuthorityDashboard />} />
          <Route path="/authority/complaints" element={<AuthorityComplaints />} />
          <Route path="/authority/complaints/:id" element={<AuthorityComplaintDetails />} />
          <Route path="/admin/manage-profiles" element={<ManageProfiles />} />

          {/* Fallback 404 */}
          <Route
            path="*"
            element={
              <div className="container py-16 text-center space-y-3">
                <h2 className="text-2xl font-bold">404 — Page Not Found</h2>
                <p className="text-slate-500 text-sm">The route you requested does not exist.</p>
                <Link to="/" className="button-primary text-xs py-2 px-4">
                  Return to Home
                </Link>
              </div>
            }
          />
        </Routes>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  )
}
