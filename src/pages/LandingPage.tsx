import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, FileWarning, HeartHandshake, Search, Sparkles } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="container pb-16">
      <header className="header flex items-center justify-between">
        <div className="eyebrow">Public transport accountability</div>
        <Link to="/passenger/dashboard" className="button-secondary text-sm">Open dashboard <ArrowRight size={16} /></Link>
      </header>

      <section className="relative overflow-hidden rounded-[28px] bg-[#17202a] px-6 py-14 text-white shadow-2xl shadow-slate-900/15 sm:px-12 md:py-20">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[40px] border-[#e96b4c]/80" />
        <div className="absolute bottom-[-100px] right-36 h-56 w-56 rounded-full border-[28px] border-[#1261d6]/70" />
        <div className="relative max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100"><Sparkles size={14} /> Make every ride count</div>
          <h1 className="max-w-2xl text-4xl font-bold leading-[1.05] sm:text-6xl">Your journey. Your rights. Your voice.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">A clear, accountable way to report public transport issues, share evidence, and follow every step toward a fair resolution.</p>

          <div className="mt-6 flex gap-3">
            <Link to="/passenger/report" className="button-primary bg-[#e96b4c] shadow-orange-900/20 hover:bg-[#d95739]">Report an issue <ArrowRight size={17} /></Link>
            <Link to="/track" className="button-secondary border-white/20 bg-white/10 text-white hover:border-white hover:text-white">Track a complaint <Search size={17} /></Link>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        <div className="card"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#1261d6]"><FileWarning size={21} /></div><h2 className="text-lg font-bold">Report with clarity</h2><p className="mt-2 text-sm leading-6 text-slate-500">Capture what happened, where it happened, and attach the details that matter.</p></div>
        <div className="card"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#e96b4c]"><Search size={21} /></div><h2 className="text-lg font-bold">Stay in the loop</h2><p className="mt-2 text-sm leading-6 text-slate-500">Follow status updates, messages, and evidence in one reliable timeline.</p></div>
        <div className="card"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><HeartHandshake size={21} /></div><h2 className="text-lg font-bold">Expect accountability</h2><p className="mt-2 text-sm leading-6 text-slate-500">Keep a record of your case while authorities investigate and respond.</p></div>
      </section>

      <section className="mt-10 grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div><div className="eyebrow">Simple by design</div><h2 className="mt-3 text-3xl font-bold">From frustration to a documented case.</h2><p className="mt-4 max-w-xl leading-7 text-slate-600">Lulu Smart Travel gives your complaint structure. Every submission gets a clear status, secure evidence, and a path forward.</p></div>
        <div className="soft-panel p-6"><h3 className="font-bold">A transparent process</h3><div className="mt-5 space-y-4">{['Describe the incident', 'Attach tickets or evidence', 'Receive authority updates', 'Track the resolution'].map((step) => <div className="flex items-center gap-3 text-sm font-semibold" key={step}><CheckCircle2 className="text-[#1261d6]" size={19} />{step}</div>)}</div></div>
      </section>
    </main>
  )
}
