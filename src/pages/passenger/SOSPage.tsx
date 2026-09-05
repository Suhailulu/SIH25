import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTransport } from '../../contexts/TransportContext'
import {
  ShieldAlert,
  PhoneCall,
  Share2,
  Users,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  X,
  Info
} from 'lucide-react'

export default function SOSPage() {
  const navigate = useNavigate()
  const { buses, safeJourney } = useTransport()

  const [holding, setHolding] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const [isActivated, setIsActivated] = useState(false)
  const [activeMessage, setActiveMessage] = useState<string | null>(null)

  // Hold-to-activate logic (3-second hold timer)
  useEffect(() => {
    let timer: any = null
    if (holding && !isActivated) {
      timer = setInterval(() => {
        setHoldProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer)
            setIsActivated(true)
            setActiveMessage('Demo SOS Broadcast Triggered! (Simulated Alert)')
            return 100
          }
          return prev + 5
        })
      }, 150)
    } else if (!holding && !isActivated) {
      setHoldProgress(0)
    }

    return () => clearInterval(timer)
  }, [holding, isActivated])

  const handleShareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Emergency Alert - Lulu Smart Travel',
        text: 'I am currently on city transit and sharing my location for emergency assistance: Lat 11.0080, Lon 76.9698. Route 12A.',
        url: window.location.origin
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText('Emergency Location: Lat 11.0080, Lon 76.9698. Bus TN-38-N-1204 (Route 12A)')
      setActiveMessage('Live coordinates copied to clipboard!')
      setTimeout(() => setActiveMessage(null), 3000)
    }
  }

  return (
    <div className="container py-8 pb-20 max-w-2xl">
      <div className="mb-4">
        <Link to="/safety" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600">
          <ArrowLeft size={15} /> Back to Safety Center
        </Link>
      </div>

      <div className="card p-6 sm:p-8 border-red-200 shadow-xl text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-100 text-red-600 shadow-inner">
          <ShieldAlert size={42} className="animate-pulse" />
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
            Emergency Assistance Protocol
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Immediate Passenger SOS</h1>
          <p className="mt-2 text-xs text-slate-500 max-w-md mx-auto">
            To prevent accidental triggers, press and hold the SOS button below for 3 seconds, or choose a direct emergency action.
          </p>
        </div>

        {/* Hold Button */}
        {!isActivated ? (
          <div className="py-4">
            <button
              onMouseDown={() => setHolding(true)}
              onMouseUp={() => setHolding(false)}
              onTouchStart={() => setHolding(true)}
              onTouchEnd={() => setHolding(false)}
              className="relative select-none w-48 h-48 mx-auto rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-xl shadow-2xl flex flex-col items-center justify-center border-4 border-red-300 transform active:scale-95 transition"
            >
              <span>HOLD SOS</span>
              <span className="text-[11px] font-normal opacity-90 mt-1">3 Seconds</span>

              {/* Progress ring fill overlay */}
              {holding && (
                <div
                  className="absolute inset-0 rounded-full border-8 border-white/50 animate-pulse pointer-events-none"
                  style={{ opacity: holdProgress / 100 }}
                />
              )}
            </button>
            <div className="mt-3 text-xs text-slate-400 font-semibold">
              {holding ? `Activating... ${holdProgress}%` : 'Press and hold down to activate'}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-red-600 text-white space-y-2 animate-bounce">
            <div className="font-extrabold text-lg">SOS ASSISTANCE ACTIVE</div>
            <p className="text-xs opacity-90">
              Demo notification dispatched. In a real emergency, police (112) and transport control room are immediately dialed.
            </p>
            <button
              onClick={() => {
                setIsActivated(false)
                setHoldProgress(0)
              }}
              className="mt-2 px-4 py-1.5 rounded-lg bg-white text-red-700 font-bold text-xs"
            >
              Reset SOS
            </button>
          </div>
        )}

        {activeMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold">
            {activeMessage}
          </div>
        )}

        {/* Emergency Action Buttons */}
        <div className="grid gap-3 sm:grid-cols-2 text-left pt-4 border-t border-slate-100">
          <a
            href="tel:112"
            className="card p-4 hover:border-red-500 hover:bg-red-50/50 transition flex items-center gap-3"
          >
            <div className="p-2.5 rounded-xl bg-red-100 text-red-600">
              <PhoneCall size={20} />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900">Call Emergency (112)</div>
              <div className="text-[11px] text-slate-500">National Emergency Response</div>
            </div>
          </a>

          <a
            href="tel:1091"
            className="card p-4 hover:border-pink-500 hover:bg-pink-50/50 transition flex items-center gap-3"
          >
            <div className="p-2.5 rounded-xl bg-pink-100 text-pink-600">
              <PhoneCall size={20} />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900">Women Helpline (1091)</div>
              <div className="text-[11px] text-slate-500">24/7 Dedicated Pink Police</div>
            </div>
          </a>

          <button
            onClick={handleShareLocation}
            className="card p-4 hover:border-blue-500 hover:bg-blue-50/50 transition flex items-center gap-3 text-left"
          >
            <div className="p-2.5 rounded-xl bg-blue-100 text-[#1261d6]">
              <Share2 size={20} />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900">Share My Live Location</div>
              <div className="text-[11px] text-slate-500">Send GPS link to contacts</div>
            </div>
          </button>

          <Link
            to="/passenger/report"
            className="card p-4 hover:border-orange-500 hover:bg-orange-50/50 transition flex items-center gap-3"
          >
            <div className="p-2.5 rounded-xl bg-orange-100 text-[#e96b4c]">
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900">Report Safety Incident</div>
              <div className="text-[11px] text-slate-500">Document harassment or unsafe driving</div>
            </div>
          </Link>
        </div>

        {/* Demo Disclaimer (Required by Section 17 & 53) */}
        <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs flex items-start gap-2 text-left">
          <Info size={16} className="shrink-0 mt-0.5 text-slate-500" />
          <p>
            <strong>Demo Safety Mode Notice: </strong>
            Demo SOS — no real emergency call has been placed to civic authorities. Hardware panic button telemetry architecture is ready for IoT device integration.
          </p>
        </div>
      </div>
    </div>
  )
}
