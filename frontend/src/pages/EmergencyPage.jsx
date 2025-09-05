import { EMERGENCY_CONTACTS } from '../api'
import { Phone, ShieldAlert } from 'lucide-react'

export default function EmergencyPage() {
  return (
    <div className="container-padded py-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EMERGENCY_CONTACTS.map((c) => (
          <div key={c.id} className="card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="text-white font-semibold">{c.label}</h3>
                <p className="text-gray-400 text-sm">{c.number}</p>
              </div>
            </div>
            <a className="btn-primary h-10 px-4 inline-flex items-center gap-2" href={`tel:${c.number}`}>
              <Phone className="w-4 h-4" />
              Call
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
