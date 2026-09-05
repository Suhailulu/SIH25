import React, { useEffect, useState } from 'react'
import { createComplaint, uploadEvidence } from '../../../services/complaints'
import { createTicket } from '../../../services/tickets'
import { createWitnesses } from '../../../services/witnesses'
import { createNotification } from '../../../services/notifications'
import { useAuth } from '../../../contexts/AuthContext'

const DRAFT_KEY = 'tj_report_draft'

const issueOptions = [
  'Denied Seat',
  'Denied Boarding',
  'Refusal of Service',
  'Staff Misconduct',
  'Unfair Treatment',
  'Ticketing Issue',
  'Overcharging',
  'Safety Concern',
  'Other'
]

export default function ReportForm() {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [transportType, setTransportType] = useState('')
  const [operatorName, setOperatorName] = useState('')
  const [serviceNumber, setServiceNumber] = useState('')
  const [route, setRoute] = useState('')
  const [boardingPoint, setBoardingPoint] = useState('')
  const [destination, setDestination] = useState('')
  const [journeyDate, setJourneyDate] = useState('')
  const [journeyTime, setJourneyTime] = useState('')
  const [description, setDescription] = useState('')
  const [ticketNumber, setTicketNumber] = useState('')
  const [bookingReference, setBookingReference] = useState('')
  const [seatNumber, setSeatNumber] = useState('')
  const [acceptsTerms, setAcceptsTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [witnesses, setWitnesses] = useState<Array<{ name: string; contact: string; statement: string }>>([])

  const validation = {
    category: !category,
    transportType: !transportType,
    operatorName: !operatorName,
    description: !description,
    acceptsTerms: !acceptsTerms
  }

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) {
      try {
        const d = JSON.parse(raw)
        setCategory(d.category || '')
        setSubcategory(d.subcategory || '')
        setTransportType(d.transportType || '')
        setOperatorName(d.operatorName || '')
        setServiceNumber(d.serviceNumber || '')
        setRoute(d.route || '')
        setBoardingPoint(d.boardingPoint || '')
        setDestination(d.destination || '')
        setJourneyDate(d.journeyDate || '')
        setJourneyTime(d.journeyTime || '')
        setDescription(d.description || '')
        setTicketNumber(d.ticketNumber || '')
        setBookingReference(d.bookingReference || '')
        setSeatNumber(d.seatNumber || '')
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    const d = {
      category,
      subcategory,
      transportType,
      operatorName,
      serviceNumber,
      route,
      boardingPoint,
      destination,
      journeyDate,
      journeyTime,
      description,
      ticketNumber,
      bookingReference,
      seatNumber
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(d))
  }, [category, subcategory, transportType, operatorName, serviceNumber, route, boardingPoint, destination, journeyDate, journeyTime, description, ticketNumber, bookingReference, seatNumber])

  function nextStep() {
    if (step === 1 && !category) {
      setMessage('Please select an issue type before continuing.')
      return
    }
    if (step === 2 && (!transportType || !operatorName || !route || !journeyDate)) {
      setMessage('Please complete the required journey details.')
      return
    }
    if (step === 3 && !description) {
      setMessage('Please tell us what happened.')
      return
    }
    setMessage(null)
    setStep((current) => Math.min(current + 1, 6))
  }

  async function handleSubmit() {
    if (!user) return setMessage('You must be signed in to submit a complaint.')
    if (!category || !transportType || !operatorName || !description || !acceptsTerms) {
      setMessage('Please complete the required fields and confirm the information is accurate.')
      return
    }

    setLoading(true)
    const payload: any = {
      passenger_id: user.id,
      category,
      subcategory,
      priority: category === 'Safety Concern' ? 'CRITICAL' : category === 'Staff Misconduct' ? 'HIGH' : category === 'Denied Seat' ? 'MEDIUM' : 'LOW',
      description,
      transport_type: transportType,
      operator_name: operatorName,
      service_number: serviceNumber,
      route,
      boarding_point: boardingPoint,
      destination,
      journey_date: journeyDate,
      journey_time: journeyTime,
      incident_date: journeyDate,
      incident_time: journeyTime
    }
    const res = await createComplaint(payload)
    setLoading(false)

    if (res.error) {
      setMessage('We could not submit your complaint right now. Please try again.')
      return
    }

    localStorage.removeItem(DRAFT_KEY)
    const id = res.data?.id
    if (files.length > 0 && id) {
      setUploading(true)
      for (const f of files) {
        // eslint-disable-next-line no-await-in-loop
        const up = await uploadEvidence(f, id, user.id)
        if (up.error) console.error('upload error', up.error)
      }
      setUploading(false)
    }
    // create ticket record if ticket info provided
    if (id && (ticketNumber || bookingReference || seatNumber)) {
      const t = await createTicket(id, ticketNumber, bookingReference, seatNumber)
      if (t.error) console.error('ticket save error', t.error)
    }

    // create witnesses
    if (id && witnesses.length > 0) {
      const w = await createWitnesses(id, witnesses)
      if (w.error) console.error('witness save error', w.error)
    }

    // create a notification for passenger
    if (id) {
      try {
        await createNotification(user.id, 'Complaint submitted', `Your complaint ${res.data?.complaint_number || id} has been submitted.`, id)
      } catch (e) {
        console.error('notification error', e)
      }
    }
    setMessage(`Complaint submitted successfully. Reference: ${res.data?.complaint_number || id}`)
  }

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Report — Step {step}</h3>
        <div className="text-sm text-gray-600">Draft auto-saves locally</div>
      </div>

      {step === 1 && (
        <div className="mt-4 space-y-4">
          <div className="text-sm text-gray-700">Issue type</div>
          <div className="grid sm:grid-cols-2 gap-3">
            {issueOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => { setCategory(option); setMessage(null) }}
                className={`border rounded-lg p-3 text-left ${category === option ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
              >
                {option}
              </button>
            ))}
          </div>
          {validation.category && <div className="text-sm text-red-600">Please select a category.</div>}
          <div className="flex justify-end">
            <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded" onClick={nextStep}>Next</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-sm text-gray-700">Transport type</div>
              <input value={transportType} onChange={(e) => setTransportType(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
            </label>
            <label className="block">
              <div className="text-sm text-gray-700">Operator</div>
              <input value={operatorName} onChange={(e) => setOperatorName(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
            </label>
            <label className="block">
              <div className="text-sm text-gray-700">Service number</div>
              <input value={serviceNumber} onChange={(e) => setServiceNumber(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
            </label>
            <label className="block">
              <div className="text-sm text-gray-700">Route</div>
              <input value={route} onChange={(e) => setRoute(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
            </label>
            <label className="block">
              <div className="text-sm text-gray-700">Boarding point</div>
              <input value={boardingPoint} onChange={(e) => setBoardingPoint(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
            </label>
            <label className="block">
              <div className="text-sm text-gray-700">Destination</div>
              <input value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
            </label>
            <label className="block">
              <div className="text-sm text-gray-700">Journey date</div>
              <input type="date" value={journeyDate} onChange={(e) => setJourneyDate(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
            </label>
            <label className="block">
              <div className="text-sm text-gray-700">Journey time</div>
              <input type="time" value={journeyTime} onChange={(e) => setJourneyTime(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
            </label>
          </div>

          <div className="flex justify-between">
            <button type="button" className="px-4 py-2 border rounded" onClick={() => setStep(1)}>Back</button>
            <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded" onClick={nextStep}>Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-4 space-y-4">
          <label className="block">
            <div className="text-sm text-gray-700">What happened?</div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-3 py-2 h-32 mt-1" />
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <input value={subcategory} onChange={(e) => setSubcategory(e.target.value)} placeholder="Specific issue / subcategory" className="border rounded px-3 py-2" />
            <input value={ticketNumber} onChange={(e) => setTicketNumber(e.target.value)} placeholder="Ticket number" className="border rounded px-3 py-2" />
            <input value={bookingReference} onChange={(e) => setBookingReference(e.target.value)} placeholder="Booking reference" className="border rounded px-3 py-2" />
            <input value={seatNumber} onChange={(e) => setSeatNumber(e.target.value)} placeholder="Seat number" className="border rounded px-3 py-2" />
          </div>

          <div className="flex justify-between">
            <button type="button" className="px-4 py-2 border rounded" onClick={() => setStep(2)}>Back</button>
            <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded" onClick={nextStep}>Next</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="mt-4 space-y-4">
          <label className="block">
            <div className="text-sm text-gray-700">Upload evidence (ticket, image, video, PDF, screenshot or document)</div>
            <input type="file" multiple onChange={(e) => {
              const list = e.target.files
              if (!list) return
              setFiles(Array.from(list).slice(0, 10))
            }} className="mt-2" />
          </label>

          <div>
            {files.length > 0 ? (
              <ul className="text-sm text-gray-700 list-disc pl-5">
                {files.map((file, idx) => <li key={idx}>{file.name} ({Math.round(file.size / 1024)} KB)</li>)}
              </ul>
            ) : <div className="text-sm text-gray-600">No files selected.</div>}
          </div>

          <div className="flex justify-between">
            <button type="button" className="px-4 py-2 border rounded" onClick={() => setStep(3)}>Back</button>
            <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setStep(5)}>Next</button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="mt-4 space-y-4">
          <h4 className="font-semibold">Witnesses (optional)</h4>
          {witnesses.map((w, idx) => (
            <div key={idx} className="border rounded p-3">
              <div className="grid md:grid-cols-3 gap-2">
                <input value={w.name} onChange={(e) => { const nw = [...witnesses]; nw[idx].name = e.target.value; setWitnesses(nw) }} placeholder="Name" className="border rounded px-2 py-1" />
                <input value={w.contact} onChange={(e) => { const nw = [...witnesses]; nw[idx].contact = e.target.value; setWitnesses(nw) }} placeholder="Contact" className="border rounded px-2 py-1" />
                <input value={w.statement} onChange={(e) => { const nw = [...witnesses]; nw[idx].statement = e.target.value; setWitnesses(nw) }} placeholder="Short statement" className="border rounded px-2 py-1" />
              </div>
              <div className="mt-2 text-right"><button type="button" className="text-red-600 text-sm" onClick={() => { setWitnesses(witnesses.filter((_, i) => i !== idx)) }}>Remove</button></div>
            </div>
          ))}

          <div>
            <button type="button" className="px-3 py-2 border rounded" onClick={() => setWitnesses([...witnesses, { name: '', contact: '', statement: '' }])}>Add witness</button>
          </div>

          <div className="flex justify-between">
            <button type="button" className="px-4 py-2 border rounded" onClick={() => setStep(4)}>Back</button>
            <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setStep(6)}>Next</button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="mt-4 space-y-4">
          <div className="rounded border p-4 bg-gray-50">
            <div className="font-medium">Review and submit</div>
            <div className="mt-2 text-sm text-gray-700">Issue: {category}</div>
            <div className="text-sm text-gray-700">Transport: {transportType} · {operatorName}</div>
            <div className="text-sm text-gray-700">Route: {route || 'Not provided'}</div>
            <div className="text-sm text-gray-700">Journey: {journeyDate || 'Not provided'} · {journeyTime || 'Not provided'}</div>
            <div className="text-sm text-gray-700 mt-2">{description}</div>
          </div>

          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={acceptsTerms} onChange={(e) => setAcceptsTerms(e.target.checked)} className="mt-1" />
            <span>I confirm that the information provided is accurate to the best of my knowledge.</span>
          </label>

          <div className="flex justify-between">
            <button type="button" className="px-4 py-2 border rounded" onClick={() => setStep(5)}>Back</button>
            <button type="button" className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSubmit} disabled={loading || uploading}>{loading || uploading ? 'Submitting...' : 'Submit complaint'}</button>
          </div>
        </div>
      )}

      {message && <div className="mt-4 text-sm text-gray-700">{message}</div>}
    </div>
  )
}
