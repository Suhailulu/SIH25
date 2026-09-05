import React from 'react'
import { Link } from 'react-router-dom'
import { useTransport } from '../../contexts/TransportContext'
import { useLanguage } from '../../contexts/LanguageContext'
import {
  BookOpen,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Info,
  Scale,
  FileWarning,
  FileText
} from 'lucide-react'

export default function RightsPage() {
  const { legalRules } = useTransport()
  const { t } = useLanguage()

  const categories = [
    'All',
    'Fares & Tickets',
    'Safety & Women',
    'Accessibility',
    'Driver Conduct',
    'Grievance Redressal'
  ]
  const [selectedCategory, setSelectedCategory] = React.useState('All')

  const filteredRules = legalRules.filter((r) =>
    selectedCategory === 'All' ? true : r.category === selectedCategory
  )

  return (
    <div className="container py-8 pb-20 max-w-4xl">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider">
          <Scale size={16} />
          <span>Statutory Consumer Protections</span>
        </div>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          {t('rights.title', 'Passenger Rights Charter')}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Official passenger rights, fare protections, driver obligations, and grievance escalation procedures under Indian and Tamil Nadu transport statutes.
        </p>
      </header>

      {/* Official Legal Awareness Disclaimer (Required by Section 19 & 53) */}
      <div className="card mb-8 p-4 bg-amber-50/70 border-l-4 border-l-amber-500 border-amber-200 text-xs text-amber-950 flex items-start gap-3">
        <Info size={18} className="shrink-0 text-amber-700 mt-0.5" />
        <div>
          <strong>Statutory Public Awareness Notice: </strong>
          {t(
            'rights.disclaimer',
            'Information is provided for public awareness and should not be treated as formal legal advice. Rights and procedures are governed by the Motor Vehicles Act, 1988 and State Transport Undertaking regulations.'
          )}
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rights Cards Grid */}
      <div className="space-y-4">
        {filteredRules.map((rule) => (
          <div key={rule.id} className="card p-6 border-slate-200 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-100">
                  {rule.category}
                </span>
                <h3 className="mt-2 text-lg font-bold text-slate-900">{rule.title}</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">
                Verified: {rule.lastVerified}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{rule.shortExplanation}</p>

            <div className="pt-3 border-t border-slate-100 grid sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block font-semibold">Applicability Scope</span>
                <strong className="text-slate-700">{rule.applicability}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-semibold">Statutory Authority Source</span>
                <strong className="text-slate-800 flex items-center gap-1">
                  {rule.officialSource}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grievance Escalation Ladder */}
      <section className="mt-12 card p-6 border-slate-200 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">How to Escalate an Unresolved Grievance</h2>
        <p className="text-xs text-slate-500">
          When a public transport operator fails to address overcharging, harassment, or schedule cancellations:
        </p>

        <div className="grid gap-4 sm:grid-cols-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
            <div className="font-bold text-slate-900">Tier 1: Depot Grievance Desk</div>
            <p className="text-slate-500">Submit electronic complaint through Lulu Smart Travel with ticket receipt.</p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
            <div className="font-bold text-slate-900">Tier 2: Regional Transport Office (RTO)</div>
            <p className="text-slate-500">Escalate with complaint number to District Motor Vehicles Inspector.</p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
            <div className="font-bold text-slate-900">Tier 3: Consumer Disputes Forum</div>
            <p className="text-slate-500">Claim restitution under Consumer Protection Act, 2019 for deficiency in service.</p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <Link to="/laws" className="text-xs font-bold text-[#1261d6] hover:underline">
            Read Comprehensive Acts & Rules →
          </Link>
          <Link to="/passenger/report" className="button-primary text-xs py-2 px-4 bg-[#e96b4c] hover:bg-[#d95739]">
            <FileWarning size={14} /> File a Complaint Now
          </Link>
        </div>
      </section>
    </div>
  )
}
