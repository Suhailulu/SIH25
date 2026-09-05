import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import {
  Compass,
  Radio,
  Clock,
  Bell,
  Shield,
  FileWarning,
  Search,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  Layers
} from 'lucide-react'

export default function HowItWorksPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)

  const steps = [
    {
      step: 1,
      title: 'Search Your Destination',
      icon: Compass,
      desc: 'Enter where you are and where you need to go. Lulu Smart Travel instantly queries city bus routes and timetables.',
      demoPreview: 'From: Central Bus Stand → To: Railway Junction (08:30 AM)',
      actionText: 'Try Journey Planner',
      actionPath: '/plan'
    },
    {
      step: 2,
      title: 'Compare Routes & Sanctioned Fares',
      icon: Layers,
      desc: 'Review alternative travel options, sorted by fastest travel time, lowest fare, or minimum walking distance.',
      demoPreview: 'Route 12A (45 min, ₹20) vs Express Route 24A (18 min, ₹25)',
      actionText: 'View Available Routes',
      actionPath: '/routes'
    },
    {
      step: 3,
      title: 'Track Live Buses on Interactive Map',
      icon: Radio,
      desc: 'Observe active buses moving on the OpenStreetMap layer with live simulated GPS coordinates, heading, and speed.',
      demoPreview: 'Bus TN-38-N-1204 moving at 26 km/h approaching Collectorate',
      actionText: 'Open Live Bus Radar',
      actionPath: '/live'
    },
    {
      step: 4,
      title: 'Check Smart Real-Time ETA',
      icon: Clock,
      desc: 'Our modular ETA engine calculates arrival minutes by factoring in distance, stop dwell times, and peak road congestion.',
      demoPreview: 'Arriving in ~6 minutes at Central Bus Stand Bay 2',
      actionText: 'Inspect Live Fleet',
      actionPath: '/live'
    },
    {
      step: 5,
      title: 'Set Smart Bus Reminders',
      icon: Bell,
      desc: 'Never miss your ride. Set a personalized notification to alert you 5, 10, or 15 minutes before your bus reaches your stop.',
      demoPreview: '"Remind me 10 minutes before Bus 12A arrives at Gandhipuram"',
      actionText: 'Manage Reminders',
      actionPath: '/reminders'
    },
    {
      step: 6,
      title: 'Activate Safe Journey Mode & SOS',
      icon: Shield,
      desc: 'Share continuous journey checkpoints with trusted family contacts and access a safe 3-second hold SOS emergency protocol.',
      demoPreview: 'Safe Journey active • Emergency hotline 112 & 1091 Pink Patrol',
      actionText: 'Open Safety Center',
      actionPath: '/safety'
    },
    {
      step: 7,
      title: 'Report Public Transport Issues with Evidence',
      icon: FileWarning,
      desc: 'Experience overcharging, harassment, or a severe delay? File an official digital complaint with photos and tickets.',
      demoPreview: 'Category: Overcharging • Attach ticket photo • Ref: TJ-2026-000001',
      actionText: 'Report an Issue',
      actionPath: '/passenger/report'
    },
    {
      step: 8,
      title: 'Track Complaint Resolution in Transparent Real-Time',
      icon: Search,
      desc: 'Follow your grievance through the complete 8-stage lifecycle: Submitted → Acknowledged → Assigned → Resolved.',
      demoPreview: 'Assigned to Inspector • Status: Resolved with corrective action',
      actionText: 'Track a Complaint',
      actionPath: '/track'
    }
  ]

  const active = steps[currentStep - 1]
  const Icon = active.icon

  return (
    <div className="container py-8 pb-20 max-w-4xl">
      <header className="mb-8 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1261d6] font-bold text-xs">
          <Sparkles size={14} /> Interactive Guide
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          {t('howItWorks.title', 'How to Use Lulu Smart Travel')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          {t(
            'howItWorks.subtitle',
            'An interactive step-by-step walkthrough of smart public mobility features.'
          )}
        </p>

        {/* Demo Notice */}
        <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold border border-slate-200">
          Interactive Demo — uses sample transport data
        </div>
      </header>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s) => (
          <button
            key={s.step}
            onClick={() => setCurrentStep(s.step)}
            className={`h-2.5 rounded-full transition-all ${
              s.step === currentStep
                ? 'w-8 bg-[#1261d6]'
                : s.step < currentStep
                ? 'w-2.5 bg-emerald-500'
                : 'w-2.5 bg-slate-200'
            }`}
            title={`Step ${s.step}: ${s.title}`}
          />
        ))}
      </div>

      {/* Interactive Step Card */}
      <div className="card p-6 sm:p-10 border-slate-200 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-[#1261d6] bg-blue-50 px-3 py-1 rounded-lg">
            Step {active.step} of {steps.length}
          </span>
          <button
            onClick={() => setCurrentStep(steps.length)}
            className="text-xs text-slate-400 hover:text-slate-700 font-semibold"
          >
            Skip to End
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start gap-6 pt-2">
          <div className="p-4 rounded-3xl bg-blue-50 text-[#1261d6] shrink-0 self-start">
            <Icon size={36} />
          </div>

          <div className="space-y-3 flex-1">
            <h2 className="text-2xl font-bold text-slate-900">{active.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{active.desc}</p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Interactive Simulation Context:
              </span>
              <span className="font-semibold text-slate-800">{active.demoPreview}</span>
            </div>
          </div>
        </div>

        {/* Step Navigation & Action CTA */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="button-secondary text-xs py-2 px-3 disabled:opacity-40"
            >
              <ArrowLeft size={14} /> Previous
            </button>
            <button
              onClick={() => setCurrentStep((prev) => Math.min(steps.length, prev + 1))}
              disabled={currentStep === steps.length}
              className="button-secondary text-xs py-2 px-3 disabled:opacity-40"
            >
              Next <ArrowRight size={14} />
            </button>
          </div>

          <Link
            to={active.actionPath}
            className="button-primary text-xs py-2.5 px-5 font-bold shadow-sm flex items-center justify-center gap-2"
          >
            <span>{active.actionText}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
