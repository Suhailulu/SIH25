import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getNotificationsForUser } from '../services/notifications'
import { Bell, LogOut, ShieldCheck, UserCircle } from 'lucide-react'

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
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#f5f7f5]/90 backdrop-blur">
      <div className="container flex min-h-[72px] items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1261d6] text-white"><ShieldCheck size={19} /></span>
            Lulu <span className="text-[#1261d6]">Smart Travel</span>
          </Link>
          <nav aria-label="Primary navigation" className="hidden items-center gap-5 text-sm font-semibold text-slate-600 md:flex">
            <Link className="hover:text-[#1261d6]" to="/passenger/report">Report an issue</Link>
            <Link className="hover:text-[#1261d6]" to="/passenger/complaints">My complaints</Link>
            <Link className="hover:text-[#1261d6]" to="/passenger/rights">Your rights</Link>
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
              <span className="hidden text-sm text-slate-500 lg:block">{user.email}</span>
              <Link aria-label="Notifications" title="Notifications" to="/passenger/notifications" className="relative rounded-lg p-2 text-slate-600 hover:bg-white hover:text-[#1261d6]"><Bell size={19} />{unread > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e96b4c] px-1 text-[10px] font-bold text-white">{unread}</span>}</Link>
              <Link aria-label="Profile" title="Profile" to="/passenger/profile" className="rounded-lg p-2 text-slate-600 hover:bg-white hover:text-[#1261d6]"><UserCircle size={19} /></Link>
              <button aria-label="Sign out" title="Sign out" onClick={handleSignOut} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><LogOut size={18} /></button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
