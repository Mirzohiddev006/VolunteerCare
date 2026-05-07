import { useEffect, useMemo, useState } from 'react'
import { adminApi, extractError } from '../api'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import Alert from '../components/Alert'
import type { Role, User } from '../types'

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [busy, setBusy] = useState<number | null>(null)
  const [search, setSearch] = useState<string>('')
  const [roleFilter, setRoleFilter] = useState<'' | Role>('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminApi.users()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo<User[]>(() => {
    const q = search.trim().toLowerCase()
    return users.filter((u) => {
      if (roleFilter && u.rol !== roleFilter) return false
      if (!q) return true
      return [u.ism, u.telefon, u.manzil]
        .filter((v): v is string => Boolean(v))
        .some((v) => v.toLowerCase().includes(q))
    })
  }, [users, search, roleFilter])

  const onToggleBlock = async (id: number, faol: boolean) => {
    const action = faol ? 'bloklash' : 'faollashtirish'
    if (!confirm(`Foydalanuvchini ${action}ni xohlaysizmi?`)) return
    setBusy(id)
    try {
      await adminApi.blockUser(id)
      setUsers((arr) =>
        arr.map((u) => (u.id !== id ? u : { ...u, faol: !faol }))
      )
    } catch (err) {
      setError(extractError(err))
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Foydalanuvchilar</h1>
        <p className="text-sm text-gray-500">
          Bloklash, ruxsatlar va profil ko'rinishi
        </p>
      </div>

      <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600">Qidiruv</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ism, telefon, manzil..."
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Rol</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as '' | Role)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="">Barchasi</option>
            <option value="qariya">Qariya</option>
            <option value="voluntyor">Voluntyor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {error && <Alert>{error}</Alert>}

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <EmptyState title="Foydalanuvchi topilmadi" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3">Ism</th>
                  <th className="px-4 py-3">Telefon</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3">Tuman</th>
                  <th className="px-4 py-3">Holati</th>
                  <th className="px-4 py-3 text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filtered.map((u) => {
                  const blocked = !u.faol
                  return (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{u.ism || '—'}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.telefon || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                          {u.rol}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.tuman || '—'}</td>
                      <td className="px-4 py-3">
                        {blocked ? (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                            Bloklangan
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            Faol
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          disabled={busy === u.id || u.rol === 'admin'}
                          onClick={() => onToggleBlock(u.id, u.faol)}
                          className={`rounded-md border px-2.5 py-1 text-xs font-semibold disabled:opacity-50 ${
                            blocked
                              ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                              : 'border-red-200 text-red-700 hover:bg-red-50'
                          }`}
                        >
                          {blocked ? 'Faollashtirish' : 'Bloklash'}
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
