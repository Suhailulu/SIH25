import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ExternalLink, Scale, ShieldCheck, FileText, Info } from 'lucide-react'

export default function LawsPage() {
  const sections = [
    {
      title: 'Central Government Framework',
      statutes: [
        {
          name: 'Motor Vehicles Act, 1988 (Act No. 59 of 1988)',
          ref: 'Parliament of India',
          desc: 'Primary national statute regulating licensing of stage carriages, passenger carrying limits, speed governors, fare compliance, and passenger safety obligations (Sections 66, 72, 178).'
        },
        {
          name: 'Central Motor Vehicles Rules, 1989',
          ref: 'Ministry of Road Transport & Highways (MoRTH)',
          desc: 'Rule 21 mandates strict driver and conductor code of conduct, prohibition of mobile phone use during operation, and mandatory stoppage at gazetted passenger halts.'
        },
        {
          name: 'Rights of Persons with Disabilities Act, 2016',
          ref: 'Ministry of Social Justice and Empowerment',
          desc: 'Sections 41 and 42 mandate accessible public transport infrastructure, reserved priority seating, low-floor ramps, and audio-visual passenger information announcements.'
        }
      ]
    },
    {
      title: 'Tamil Nadu State Motor Transport Rules',
      statutes: [
        {
          name: 'Tamil Nadu Motor Vehicles Rules, 1989',
          ref: 'Home (Transport) Department, Government of Tamil Nadu',
          desc: 'Rule 245-A provides statutory reservation of 33% seats for women; Rule 250 requires maintenance of a clean, unsoiled Complaint Book on board every stage carriage vehicle.'
        },
        {
          name: 'Tamil Nadu State Transport Corporation Fare Notification',
          ref: 'Transport Department, Government of Tamil Nadu (G.O. Ms. No. 14)',
          desc: 'Gazette notification defining sanctioned urban stage carriage distance slabs, student concessionary season pass rules, and free bus travel scheme for women in ordinary city buses.'
        }
      ]
    },
    {
      title: 'Passenger Grievance & Redressal Procedures',
      statutes: [
        {
          name: 'Consumer Protection Act, 2019',
          ref: 'National Consumer Disputes Redressal Commission',
          desc: 'Categorizes transport ticket purchasers as protected consumers entitled to financial compensation for deficiency in service, unfair overcharging, or unannounced abandonment of routes.'
        }
      ]
    }
  ]

  return (
    <div className="container py-8 pb-20 max-w-4xl">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1261d6] uppercase tracking-wider">
          <BookOpen size={16} />
          <span>Statutory References & Gazette Orders</span>
        </div>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Transport Rules & Laws</h1>
        <p className="mt-1 text-sm text-slate-500">
          Official statutory foundation governing public bus operations, passenger safety, fare compliance, and consumer rights.
        </p>
      </header>

      <div className="card mb-8 p-4 bg-blue-50/70 border-l-4 border-l-[#1261d6] border-blue-200 text-xs text-blue-950 flex items-start gap-3">
        <Info size={18} className="shrink-0 text-[#1261d6] mt-0.5" />
        <p>
          <strong>Official Gazette Grounding: </strong>
          All citations on this platform are drawn directly from the Gazette of India and the Tamil Nadu Government Transport Department statutes. No secondary blogs or unverified summaries are utilized as statutory authorities.
        </p>
      </div>

      <div className="space-y-8">
        {sections.map((sec) => (
          <section key={sec.title} className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-200">
              {sec.title}
            </h2>

            <div className="space-y-3">
              {sec.statutes.map((s) => (
                <div key={s.name} className="card p-5 border-slate-200 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-sm font-bold text-slate-900">{s.name}</h3>
                    <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded shrink-0">
                      {s.ref}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between text-xs">
        <Link to="/rights" className="text-[#1261d6] font-bold hover:underline">
          ← Back to Passenger Rights Charter
        </Link>
        <Link to="/passenger/report" className="button-primary text-xs py-2 px-4">
          Report Statutory Violation
        </Link>
      </div>
    </div>
  )
}
