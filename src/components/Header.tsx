import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getNotificationsForUser } from '../services/notifications'

export default function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [unread, setUnread] = React.useState(0)

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  React.useEffect(() => {
    if (!user) return
    getNotificationsForUser(user.id).then((res) => {
      if (res.data) setUnread(res.data.filter((n: any) => !n.is_read).length)
    })
  }, [user])

  return (
    <header className="bg-white shadow">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-lg font-semibold">TransitJustice</Link>
          <nav className="hidden sm:flex gap-3 text-sm text-gray-700">
            <Link to="/passenger/report">Report</Link>
            <Link to="/passenger/complaints">Complaints</Link>
            <Link to="/passenger/rights">Know Your Rights</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {!user && (
            <>
              <Link to="/login" className="text-sm text-blue-600">Sign in</Link>
              <Link to="/signup" className="text-sm text-gray-700">Sign up</Link>
            </>
          )}

          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">{user.email}</span>
              <Link to="/passenger/notifications" className="text-sm text-gray-700 relative">Notifications{unread > 0 && <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-red-600 text-white">{unread}</span>}</Link>
              <Link to="/passenger/profile" className="text-sm text-gray-700">Profile</Link>
              <button onClick={handleSignOut} className="text-sm text-red-600">Sign out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
