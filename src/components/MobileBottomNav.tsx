import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Compass, Radio, Bell, User } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useTransport } from '../contexts/TransportContext'

export default function MobileBottomNav() {
  const location = useLocation()
  const { t } = useLanguage()
  const { alerts } = useTransport()
  const activeAlertsCount = alerts.filter((a) => a.status === 'Active').length

  const navItems = [
    { label: t('nav.home', 'Home'), path: '/', icon: Home },
    { label: t('nav.planJourney', 'Plan'), path: '/plan', icon: Compass },
    { label: t('nav.liveBuses', 'Live'), path: '/live', icon: Radio },
    { label: t('nav.alerts', 'Alerts'), path: '/alerts', icon: Bell, badge: activeAlertsCount },
    { label: t('nav.profile', 'Profile'), path: '/profile', icon: User }
  ]

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 px-2 py-1.5 md:hidden shadow-lg safe-bottom"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-xs font-semibold relative transition ${
                isActive ? 'text-[#1261d6]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon size={20} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e96b4c] text-[9px] font-bold text-white px-0.5">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="mt-1 text-[10px] tracking-tight">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
