import { useEffect, useState, type ReactNode } from 'react'
import { adminApi, extractError } from '../api'
import Spinner from '../components/Spinner'
import Alert from '../components/Alert'
import type { AdminStatsData } from '../types'

type Accent = 'brand' | 'emerald' | 'amber' | 'indigo' | 'rose'

interface CardProps {
  title: string
  value: number | string
  accent?: Accent
}

function Card({ title, value, accent = 'brand' }: CardProps) {
  const map: Record<Accent, string> = {
    brand: 'bg-brand-50 text-brand-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    indigo: 'bg-indigo-50 text-indigo-700',
    rose: 'bg-rose-50 text-rose-700',
  }
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className={`inline-flex rounded-lg px-2 py-1 text-xs font-semibold ${map[accent]}`}>
        {title}
      </div>
      <div className="mt-3 text-3xl font-bold text-gray-900">{value}</div>
    </div>
  )
}

interface SectionProps {
  title: string
  children: ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">{title}</h3>
      {children}
    </div>
  )
}

interface BarListProps {
  entries: [string, number][]
  max: number
  color: string
}

function BarList({ entries, max, color }: BarListProps) {
  return (
    <ul className="space-y-3">
      {entries.map(([key, value]) => {
        const pct = Math.round((Number(value) / max) * 100)
        return (
          <li key={key}>
            <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
              <span className="font-medium">{key}</span>
              <span>{value}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full ${color}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default function AdminStats() {
  const [data, setData] = useState<AdminStatsData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    adminApi
      .stats()
      .then((d) => {
        if (mounted) setData(d || {})
      })
      .catch((err) => {
        if (mounted) setError(extractError(err))
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <Spinner />

  const totalRequests = data?.totalRequests ?? 0
  const completed = data?.completedRequests ?? 0
  const pending = data?.pendingRequests ?? 0
  const totalUsers = data?.totalUsers ?? 0
  const seniors = data?.qariya ?? 0
  const volunteers = data?.voluntyor ?? 0
  const activeVolunteers = data?.activeVolunteers ?? 0
  const avgRating = data?.avgRating ?? 0

  const byType = data?.byType || {}
  const byDistrict = data?.byDistrict || {}

  const typeEntries = Object.entries(byType).map(
    ([k, v]) => [k, Number(v) || 0] as [string, number]
  )
  const districtEntries = Object.entries(byDistrict).map(
    ([k, v]) => [k, Number(v) || 0] as [string, number]
  )
  const maxType = Math.max(1, ...typeEntries.map(([, v]) => v))
  const maxDistrict = Math.max(1, ...districtEntries.map(([, v]) => v))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistika</h1>
        <p className="text-sm text-gray-500">Tizim ko'rsatkichlari va dinamika</p>
      </div>

      {error && <Alert>{error}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Jami so'rovlar" value={totalRequests} accent="brand" />
        <Card title="Bajarilgan" value={completed} accent="emerald" />
        <Card title="Kutilayotgan" value={pending} accent="amber" />
        <Card title="Foydalanuvchilar" value={totalUsers} accent="brand" />
        <Card title="Qariyalar" value={seniors} accent="rose" />
        <Card title="Voluntyorlar" value={volunteers} accent="emerald" />
        <Card title="Faol voluntyorlar" value={activeVolunteers} accent="indigo" />
        <Card
          title="O'rtacha baho"
          value={Number(avgRating || 0).toFixed(1)}
          accent="amber"
        />
      </div>

      {typeEntries.length > 0 && (
        <Section title="So'rovlar — turi bo'yicha">
          <BarList entries={typeEntries} max={maxType} color="bg-brand-500" />
        </Section>
      )}
      {districtEntries.length > 0 && (
        <Section title="So'rovlar — tuman bo'yicha">
          <BarList
            entries={districtEntries}
            max={maxDistrict}
            color="bg-emerald-500"
          />
        </Section>
      )}
    </div>
  )
}
