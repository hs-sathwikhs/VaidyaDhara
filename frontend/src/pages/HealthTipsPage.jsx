import { useEffect, useState } from 'react'
import { fetchHealthTips } from '../api'
import { HeartPulse } from 'lucide-react'

export default function HealthTipsPage() {
  const [tips, setTips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchHealthTips()
        setTips(data)
      } catch (err) {
        setError('Failed to load tips')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div className="container-padded py-8 text-gray-300">Loading...</div>
  if (error) return <div className="container-padded py-8 text-red-400">{error}</div>

  return (
    <div className="container-padded py-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tips.map(t => (
        <article key={t.id} className="card p-4">
          <div className="flex items-center gap-2 text-primary-300 mb-2">
            <HeartPulse className="w-5 h-5" />
            <h3 className="font-semibold text-white">{t.title}</h3>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{t.body}</p>
        </article>
      ))}
    </div>
  )
}
