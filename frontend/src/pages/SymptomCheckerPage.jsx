import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stethoscope } from 'lucide-react'
import { useLang } from '../context/LanguageContext'

export default function SymptomCheckerPage() {
  const { lang } = useLang()
  const navigate = useNavigate()
  const [symptom, setSymptom] = useState('')
  const [severity, setSeverity] = useState('moderate')
  const [duration, setDuration] = useState('1-3 days')
  const [notes, setNotes] = useState('')

  function startChat(e) {
    e.preventDefault()
    const parts = [
      `Symptoms: ${symptom || 'N/A'}`,
      `Severity: ${severity}`,
      `Duration: ${duration}`,
      notes ? `Notes: ${notes}` : null,
      `Language: ${lang}`,
    ].filter(Boolean)
    const prefill = `I have the following issue. ${parts.join(' | ')}. Please advise.`
    navigate('/', { state: { prefill } })
  }

  return (
    <div className="container-padded py-6">
      <form onSubmit={startChat} className="card p-6 max-w-3xl mx-auto space-y-4">
        <div className="flex items-center gap-3 text-primary-300">
          <Stethoscope className="w-6 h-6" />
          <h2 className="text-lg font-semibold text-white">Symptom Checker</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-300 mb-1">Symptoms</label>
            <input className="input" value={symptom} onChange={e=>setSymptom(e.target.value)} placeholder="e.g. fever, cough" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Severity</label>
            <select className="input" value={severity} onChange={e=>setSeverity(e.target.value)}>
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Duration</label>
            <select className="input" value={duration} onChange={e=>setDuration(e.target.value)}>
              <option value="< 24 hours">Less than 24 hours</option>
              <option value="1-3 days">1-3 days</option>
              <option value="> 3 days">More than 3 days</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-300 mb-1">Additional Notes</label>
            <textarea className="input min-h-24" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Any other details..." />
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="btn-primary">Start Chat</button>
        </div>
      </form>
    </div>
  )
}
