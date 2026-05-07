import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { extractError, ratingsApi, requestsApi } from '../api'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import Alert from '../components/Alert'
import StarRating from '../components/StarRating'
import {
  formatDate,
  requestTypeEmoji,
  requestTypeLabel,
  statusBadge,
} from '../utils/format'
import type { HelpRequest } from '../types'

export default function MyRequests() {
  const [list, setList] = useState<HelpRequest[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [ratingFor, setRatingFor] = useState<HelpRequest | null>(null)
  const [stars, setStars] = useState<number>(5)
  const [comment, setComment] = useState<string>('')
  const [submittingRating, setSubmittingRating] = useState<boolean>(false)
  const [actionMsg, setActionMsg] = useState<string>('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await requestsApi.my()
      setList(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const submitRating = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!ratingFor) return
    if (!ratingFor.voluntyor) {
      setError('Voluntyor topilmadi')
      return
    }
    setSubmittingRating(true)
    setError('')
    try {
      await ratingsApi.rate({
        sorov_id: ratingFor.id,
        yulduz: stars,
        izoh: comment.trim() || undefined,
      })
      setActionMsg('Baho muvaffaqiyatli yuborildi')
      setRatingFor(null)
      setStars(5)
      setComment('')
      await load()
    } catch (err) {
      setError(extractError(err))
    } finally {
      setSubmittingRating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mening so'rovlarim</h1>
          <p className="text-sm text-gray-500">
            Yuborgan so'rovlaringiz va ularning holati
          </p>
        </div>
        <Link
          to="/send-request"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + Yangi so'rov
        </Link>
      </div>

      {actionMsg && <Alert kind="success">{actionMsg}</Alert>}
      {error && <Alert>{error}</Alert>}

      {loading ? (
        <Spinner />
      ) : list.length === 0 ? (
        <EmptyState
          title="So'rovlaringiz yo'q"
          description="Birinchi so'rovingizni yuborib ko'ring."
          action={
            <Link
              to="/send-request"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              So'rov yuborish
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {list.map((r) => {
            const s = statusBadge(r.holati)
            const canRate = r.holati === 'bajarildi' && !!r.voluntyor && !r.baho
            return (
              <li
                key={r.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-2xl">
                      {requestTypeEmoji(r.turi)}
                    </span>
                    <div>
                      <Link
                        to={`/requests/${r.id}`}
                        className="text-sm font-semibold text-gray-900 hover:text-brand-700"
                      >
                        {requestTypeLabel(r.turi)}
                      </Link>
                      <div className="text-xs text-gray-500">
                        {formatDate(r.created_at)} · {r.tuman || r.manzil || '—'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${s.color}`}
                    >
                      {s.label}
                    </span>
                    {canRate && (
                      <button
                        onClick={() => {
                          setRatingFor(r)
                          setStars(5)
                          setComment('')
                        }}
                        className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
                      >
                        ⭐ Baholash
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-gray-700">{r.tavsif}</p>
              </li>
            )
          })}
        </ul>
      )}

      {ratingFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form
            onSubmit={submitRating}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold text-gray-900">Voluntyorni baholang</h2>
            <p className="mt-1 text-sm text-gray-500">
              Olgan yordamingiz uchun baho qoldirib, izoh yozishingiz mumkin.
            </p>

            <div className="mt-4 flex items-center justify-center">
              <StarRating value={stars} onChange={setStars} size="lg" />
            </div>

            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Izoh (ixtiyoriy)..."
              className="mt-4 block w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRatingFor(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={submittingRating}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
              >
                {submittingRating ? 'Yuborilmoqda...' : 'Bahoni yuborish'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
