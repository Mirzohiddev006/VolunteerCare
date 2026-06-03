import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { extractError, requestsApi, type RequestListParams } from '../api'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import Alert from '../components/Alert'
import {
  DISTRICTS,
  REQUEST_TYPES,
  formatDate,
  requestTypeEmoji,
  requestTypeLabel,
  statusBadge,
} from '../utils/format'
import type { HelpRequest } from '../types'

export default function RequestsList() {
  const [list, setList] = useState<HelpRequest[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [turi, setTuri] = useState<string>('')
  const [tuman, setTuman] = useState<string>('')
  const [search, setSearch] = useState<string>('')

  const fetchList = async () => {
    setLoading(true)
    setError('')
    try {
      const params: RequestListParams = { holati: 'kutilmoqda' }
      if (turi) params.turi = turi
      if (tuman) params.tuman = tuman
      const data = await requestsApi.list(params)
      setList(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turi, tuman])

  const filtered = useMemo<HelpRequest[]>(() => {
    if (!search.trim()) return list
    const q = search.trim().toLowerCase()
    return list.filter((r) =>
      [r.tavsif, r.manzil, r.tuman]
        .filter((v): v is string => Boolean(v))
        .some((s) => s.toLowerCase().includes(q))
    )
  }, [list, search])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ожидающие запросы</h1>
          <p className="text-sm text-gray-500">
            Список запросов от пожилых людей, которым нужна помощь
          </p>
        </div>
        <button
          onClick={fetchList}
          className="self-start rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:self-auto"
        >
          Обновить
        </button>
      </div>

      <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Тип помощи
          </label>
          <select
            value={turi}
            onChange={(e) => setTuri(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="">Все</option>
            {REQUEST_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.emoji} {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Район</label>
          <select
            value={tuman}
            onChange={(e) => setTuman(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="">Все</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Поиск</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ключевое слово..."
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>

      <Alert>{error}</Alert>

      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Запросы не найдены"
          description="Пока нет ожидающих запросов или они не соответствуют фильтрам."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((r) => {
            const s = statusBadge(r.holati)
            return (
              <Link
                key={r.id}
                to={`/requests/${r.id}`}
                className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-2xl">
                      {requestTypeEmoji(r.turi)}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-brand-700">
                        {requestTypeLabel(r.turi)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {r.tuman || r.manzil || '—'}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${s.color}`}
                  >
                    {s.label}
                  </span>
                </div>
                <p className="mt-3 line-clamp-3 text-sm text-gray-700">
                  {r.tavsif || '—'}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span>{formatDate(r.created_at)}</span>
                  <span className="font-medium text-brand-700 group-hover:underline">
                    Подробнее →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
