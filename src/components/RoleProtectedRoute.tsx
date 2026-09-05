import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function RoleProtectedRoute({ children, roles }: { children: React.ReactElement; roles: string[] }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="p-8">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role || '')) return <Navigate to="/" replace />

  return children
}
