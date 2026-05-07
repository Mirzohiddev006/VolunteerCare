import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { extractError, requestsApi } from '../api'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'
import Alert from '../components/Alert'
import {
  formatDate,
  requestTypeEmoji,
  requestTypeLabel,
  statusBadge,
} from '../utils/format'
import type { HelpRequest } from '../types'

interface InfoRowProps {
  label: string
  value: string
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </div>
      <div className="mt-1 text-sm text-gray-800">{value}</div>
    </div>
  )
}

export default function RequestDetail() {
  const { id = '' } = useParams<{ id: string }>()
  const { user, role } = useAuth()
  const navigate = useNavigate()
  const [item, setItem] = useState<HelpRequest | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [actionMsg, setActionMsg] = useState<string>('')
  const [busy, setBusy] = useState<boolean>(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await requestsApi.get(id)
      setItem(data)
    } catch (err) {
      setError(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const onAccept = async () => {
    setBusy(true)
    setError('')
    setActionMsg('')
    try {
      await requestsApi.accept(id)
      setActionMsg("So'rov qabul qilindi. Iltimos, qariya bilan bog'laning.")
      await load()
    } catch (err) {
      setError(extractError(err))
    } finally {
      setBusy(false)
    }
  }

  const onComplete = async () => {
    if (!confirm("So'rovni 'Bajarildi' deb belgilashni tasdiqlaysizmi?")) return
    setBusy(true)
    setError('')
    setActionMsg('')
    try {
      await requestsApi.complete(id)
      setActionMsg("So'rov bajarildi deb belgilandi. Rahmat!")
      await load()
    } catch (err) {
      setError(extractError(err))
    } finally {
      setBusy(false)
    }
  }

  const onCancel = async () => {
    if (!confirm("So'rovni bekor qilishni xohlaysizmi?")) return
    setBusy(true)
    setError('')
    try {
      await requestsApi.cancel(id)
      navigate('/my-requests', { replace: true })
    } catch (err) {
      setError(extractError(err))
      setBusy(false)
    }
  }

  const onDelete = async () => {
    if (!confirm("So'rovni o'chirishni xohlaysizmi? Bu amal qaytarilmaydi.")) return
    setBusy(true)
    setError('')
    try {
      await requestsApi.remove(id)
      navigate('/requests', { replace: true })
    } catch (err) {
      setError(extractError(err))
      setBusy(false)
    }
  }

  if (loading) return <Spinner />

  if (!item) {
    return (
      <div className="space-y-4">
        <Alert>{error || "So'rov topilmadi"}</Alert>
        <Link
          to="/requests"
          className="text-sm font-medium text-brand-700 hover:underline"
        >
          ← Ro'yxatga qaytish
        </Link>
      </div>
    )
  }

  const s = statusBadge(item.holati)
  const qariya = item.qariya
  const voluntyor = item.voluntyor
  const isOwner = !!user && user.id === qariya?.id
  const isAcceptedByMe = !!voluntyor && voluntyor.id === user?.id
  const holati = item.holati

  return (
    <div className="space-y-6">
      <Link
        to={role === 'qariya' ? '/my-requests' : '/requests'}
        className="text-sm text-brand-700 hover:underline"
      >
        ← Orqaga
      </Link>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 bg-gradient-to-r from-brand-50 to-white px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-3xl shadow-sm">
              {requestTypeEmoji(item.turi)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {requestTypeLabel(item.turi)}
              </h1>
              <p className="text-sm text-gray-500">{formatDate(item.created_at)}</p>
            </div>
          </div>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${s.color}`}
          >
            {s.label}
          </span>
        </div>

        <div className="space-y-5 px-6 py-6">
          {actionMsg && <Alert kind="success">{actionMsg}</Alert>}
          {error && <Alert>{error}</Alert>}

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Tavsif
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
              {item.tavsif || '—'}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoRow label="Manzil" value={item.manzil || '—'} />
            <InfoRow label="Tuman" value={item.tuman || '—'} />
          </div>

          {qariya && (
            <div className="rounded-xl bg-gray-50 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Qariya
              </h3>
              <div className="mt-2 flex flex-col gap-1 text-sm text-gray-800">
                <div className="font-semibold">{qariya.ism || '—'}</div>
                {role === 'voluntyor' &&
                  (holati === 'qabul_qilindi' || isAcceptedByMe) && (
                    <a
                      href={`tel:${qariya.telefon}`}
                      className="text-brand-700 hover:underline"
                    >
                      📞 {qariya.telefon}
                    </a>
                  )}
              </div>
            </div>
          )}

          {voluntyor && (
            <div className="rounded-xl bg-emerald-50 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Voluntyor
              </h3>
              <div className="mt-2 flex flex-col gap-1 text-sm text-emerald-900">
                <div className="font-semibold">{voluntyor.ism || '—'}</div>
                <a href={`tel:${voluntyor.telefon}`} className="hover:underline">
                  📞 {voluntyor.telefon}
                </a>
              </div>
            </div>
          )}

          {item.baho && (
            <div className="rounded-xl bg-amber-50 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Baho
              </h3>
              <p className="mt-1 text-sm text-amber-900">{item.baho}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-5">
            {role === 'voluntyor' && holati === 'kutilmoqda' && (
              <button
                disabled={busy}
                onClick={onAccept}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
              >
                Qabul qildim
              </button>
            )}
            {role === 'voluntyor' &&
              holati === 'qabul_qilindi' &&
              isAcceptedByMe && (
                <button
                  disabled={busy}
                  onClick={onComplete}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  Bajarildi deb belgilash
                </button>
              )}
            {role === 'qariya' && isOwner && holati === 'kutilmoqda' && (
              <button
                disabled={busy}
                onClick={onCancel}
                className="rounded-lg border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-60"
              >
                Bekor qilish
              </button>
            )}
            {role === 'admin' && (
              <button
                disabled={busy}
                onClick={onDelete}
                className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
              >
                O'chirish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
