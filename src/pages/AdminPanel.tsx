import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi, extractError } from '../api'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import Alert from '../components/Alert'
import {
  formatDate,
  requestTypeEmoji,
  requestTypeLabel,
  statusBadge,
} from '../utils/format'
import type { AdminStatsData, HelpRequest } from '../types'

interface StatCardProps {
  title: string
  value: number | string
  color: string
}

function StatCard({ title, value, color }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className={`inline-flex rounded-lg px-2 py-1 text-xs font-semibold ${color}`}>
        {title}
      </div>
      <div className="mt-3 text-3xl font-bold text-gray-900">{value ?? '—'}</div>
    </div>
  )
}

export default function AdminPanel() {
  const [requests, setRequests] = useState<HelpRequest[]>([])
  const [stats, setStats] = useState<AdminStatsData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [busy, setBusy] = useState<number | null>(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [r, s] = await Promise.all([
        adminApi.requests().catch(() => [] as HelpRequest[]),
        adminApi.stats().catch(() => null),
      ])
      setRequests(Array.isArray(r) ? r : [])
      setStats(s)
    } catch (err) {
      setError(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onRemove = async (id: number) => {
    if (!confirm("Вы хотите удалить запрос?")) return
    setBusy(id)
    try {
      await adminApi.removeRequest(id)
      setRequests((arr) => arr.filter((x) => x.id !== id))
    } catch (err) {
      setError(extractError(err))
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Админ панель</h1>
          <p className="text-sm text-gray-500">Управление системой</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/users"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Пользователи
          </Link>
          <Link
            to="/admin/stats"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Статистика
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Всего запросов"
          value={stats?.totalRequests ?? requests.length}
          color="bg-brand-50 text-brand-700"
        />
        <StatCard
          title="Выполнено"
          value={
            stats?.completedRequests ??
            requests.filter((r) => r.holati === 'bajarildi').length
          }
          color="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Активные волонтеры"
          value={stats?.activeVolunteers ?? '—'}
          color="bg-indigo-50 text-indigo-700"
        />
        <StatCard
          title="Пользователи"
          value={stats?.totalUsers ?? '—'}
          color="bg-amber-50 text-amber-700"
        />
      </div>

      {error && <Alert>{error}</Alert>}

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">Все запросы</h2>
          <button
            onClick={load}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Обновить
          </button>
        </div>

        {loading ? (
          <Spinner />
        ) : requests.length === 0 ? (
          <EmptyState title="Запросов нет" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3">Тип</th>
                  <th className="px-4 py-3">Описание</th>
                  <th className="px-4 py-3">Район</th>
                  <th className="px-4 py-3">Статус</th>
                  <th className="px-4 py-3">Дата</th>
                  <th className="px-4 py-3 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {requests.map((r) => {
                  const s = statusBadge(r.holati)
                  return (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2">
                          <span className="text-lg">{requestTypeEmoji(r.turi)}</span>
                          <span className="font-medium text-gray-800">
                            {requestTypeLabel(r.turi)}
                          </span>
                        </span>
                      </td>
                      <td className="max-w-xs truncate px-4 py-3 text-gray-600">
                        {r.tavsif || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{r.tuman || '—'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.color}`}
                        >
                          {s.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                        {formatDate(r.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/requests/${r.id}`}
                          className="mr-2 text-xs font-semibold text-brand-700 hover:underline"
                        >
                          Просмотр
                        </Link>
                        <button
                          disabled={busy === r.id}
                          onClick={() => onRemove(r.id)}
                          className="rounded-md border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
