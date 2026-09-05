import React, { useEffect, useState } from 'react'
import { createComplaint, uploadEvidence } from '../../../services/complaints'
import { useAuth } from '../../../contexts/AuthContext'

const DRAFT_KEY = 'tj_report_draft'

export default function ReportForm() {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState('')
  const [transportType, setTransportType] = useState('')
  const [operatorName, setOperatorName] = useState('')
  const [serviceNumber, setServiceNumber] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) {
      try {
        const d = JSON.parse(raw)
        setCategory(d.category || '')
        setTransportType(d.transportType || '')
        setOperatorName(d.operatorName || '')
        setServiceNumber(d.serviceNumber || '')
        setDescription(d.description || '')
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    const d = { category, transportType, operatorName, serviceNumber, description }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(d))
  }, [category, transportType, operatorName, serviceNumber, description])

  async function handleSubmit() {
    if (!user) return setMessage('You must be signed in to submit a complaint.')
    setLoading(true)
    const payload: any = {
      passenger_id: user.id,
      category,
      transport_type: transportType,
      operator_name: operatorName,
      service_number: serviceNumber,
      description
    }
    const res = await createComplaint(payload)
    setLoading(false)
    if (res.error) setMessage('Failed to create complaint. ' + res.error.message)
    else {
      localStorage.removeItem(DRAFT_KEY)
      // redirect to complaint details
      const id = res.data?.id
      const number = res.data?.complaint_number
      setMessage(`Complaint submitted: ${number || id}`)

      // upload evidence files if any
      if (files.length > 0 && id) {
        setUploading(true)
        for (const f of files) {
          // upload each file
          // eslint-disable-next-line no-await-in-loop
          const up = await uploadEvidence(f, id, user.id)
          if (up.error) {
            console.error('upload error', up.error)
          }
        }
        setUploading(false)
      }
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold">Report — Step {step}</h3>

      {step === 1 && (
        <div className="mt-4 space-y-3">
          <label className="block">
            <div className="text-sm text-gray-700">Issue category</div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded px-3 py-2">
              <option value="">Select</option>
              <option>Denied Seat</option>
              <option>Denied Boarding</option>
              <option>Refusal of Service</option>
              <option>Staff Misconduct</option>
              <option>Ticketing Issue</option>
              <option>Overcharging</option>
              <option>Safety Concern</option>
              <option>Other</option>
            </select>
          </label>

          <div className="flex justify-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setStep(2)}>Next</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-4 space-y-3">
          <label className="block">
            <div className="text-sm text-gray-700">Transport type</div>
            <input value={transportType} onChange={(e) => setTransportType(e.target.value)} className="w-full border rounded px-3 py-2" />
          </label>
          <label className="block">
            <div className="text-sm text-gray-700">Operator name</div>
            <input value={operatorName} onChange={(e) => setOperatorName(e.target.value)} className="w-full border rounded px-3 py-2" />
          </label>
          <label className="block">
            <div className="text-sm text-gray-700">Service / vehicle number</div>
            <input value={serviceNumber} onChange={(e) => setServiceNumber(e.target.value)} className="w-full border rounded px-3 py-2" />
          </label>

          <div className="flex justify-between">
            <button className="px-4 py-2 border rounded" onClick={() => setStep(1)}>Back</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setStep(3)}>Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-4 space-y-3">
          <label className="block">
            <div className="text-sm text-gray-700">Describe what happened</div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-3 py-2 h-32" />
          </label>

          <div className="flex justify-between">
            <button className="px-4 py-2 border rounded" onClick={() => setStep(2)}>Back</button>
            <div>
              <button className="px-4 py-2 mr-2 border rounded" onClick={() => { localStorage.setItem(DRAFT_KEY, JSON.stringify({ category, transportType, operatorName, serviceNumber, description })); setMessage('Draft saved locally.') }}>Save draft</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded mr-2" onClick={() => setStep(4)}>Next: Evidence</button>
              <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSubmit} disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="mt-4 space-y-3">
          <label className="block">
            <div className="text-sm text-gray-700">Upload evidence (images, pdf). Max 10MB each.</div>
            <input type="file" multiple onChange={(e) => {
              const list = e.target.files
              if (!list) return
              const arr = Array.from(list).slice(0, 10)
              setFiles(arr)
            }} className="mt-2" />
          </label>

          <div>
            {files.length > 0 ? (
              <ul className="text-sm">
                {files.map((f, idx) => <li key={idx}>{f.name} ({Math.round(f.size/1024)} KB)</li>)}
              </ul>
            ) : <div className="text-sm text-gray-600">No files selected.</div>}
          </div>

          <div className="flex justify-between">
            <button className="px-4 py-2 border rounded" onClick={() => setStep(3)}>Back</button>
            <div>
              <button className="px-4 py-2 mr-2 border rounded" onClick={() => { localStorage.setItem(DRAFT_KEY, JSON.stringify({ category, transportType, operatorName, serviceNumber, description })); setMessage('Draft saved locally.') }}>Save draft</button>
              <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSubmit} disabled={loading || uploading}>{(loading || uploading) ? 'Submitting...' : 'Submit'}</button>
            </div>
          </div>
        </div>
      )}

      {message && <div className="mt-4 text-sm text-gray-700">{message}</div>}
    </div>
  )
}
