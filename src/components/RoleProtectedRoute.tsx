import React from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react'

export default function RoleProtectedRoute({
  children,
  roles
}: {
  children: React.ReactElement
  roles: string[]
}) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="container py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
        <p className="mt-3 text-sm text-slate-500 font-semibold">Verifying credentials & permissions...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const userRole = user.role || 'passenger'

  // super_admin has overarching access to admin, driver, and passenger views
  const isAuthorized =
    userRole === 'super_admin' ||
    roles.includes(userRole) ||
    (roles.includes('admin') && (userRole as string) === 'authority')

  if (!isAuthorized) {
    return (
      <div className="container py-16 max-w-lg text-center">
        <div className="card p-8 border-red-200 bg-red-50/50 shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Restricted Access Portal</h2>
          <p className="mt-2 text-sm text-slate-600">
            Your current logged-in role is <strong className="capitalize text-slate-900">{userRole}</strong>.
            This section requires one of: <span className="font-semibold text-red-700">{roles.join(', ')}</span> permissions.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="button-secondary text-xs py-2.5 px-4 flex items-center justify-center gap-1.5">
              <ArrowLeft size={15} /> Back to Home
            </Link>
            <Link to="/login" className="button-primary text-xs py-2.5 px-4 flex items-center justify-center gap-1.5">
              <LogIn size={15} /> Switch Portal
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return children
}
