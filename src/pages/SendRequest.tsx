import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { extractError, requestsApi } from '../api'
import Alert from '../components/Alert'
import { DISTRICTS, REQUEST_TYPES } from '../utils/format'
import type { RequestType } from '../types'

interface FormState {
  turi: RequestType
  tavsif: string
  manzil: string
  tuman: string
}

export default function SendRequest() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({
    turi: 'dori',
    tavsif: '',
    manzil: '',
    tuman: '',
  })
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [ok, setOk] = useState<string>('')

  const setField =
    (key: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((s) => ({ ...s, [key]: e.target.value }))

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setOk('')
    if (!form.tavsif.trim() || !form.manzil.trim()) {
      setError("Tavsif va manzilni to'liq kiriting")
      return
    }
    setSubmitting(true)
    try {
      const created = await requestsApi.create({
        turi: form.turi,
        tavsif: form.tavsif,
        manzil: form.manzil,
        tuman: form.tuman || undefined,
      })
      setOk("So'rov muvaffaqiyatli yuborildi")
      setTimeout(() => navigate(`/requests/${created.id}`), 600)
    } catch (err) {
      setError(extractError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Yangi so'rov yuborish</h1>
      <p className="mt-1 text-sm text-gray-500">
        Sizga qaysi yordam zarurligini qisqa va aniq yozing.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
      >
        <Alert>{error}</Alert>
        {ok && <Alert kind="success">{ok}</Alert>}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Yordam turi *
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {REQUEST_TYPES.map((t) => (
              <label
                key={t.value}
                className={`flex cursor-pointer flex-col items-center rounded-xl border p-3 text-center transition ${
                  form.turi === t.value
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="turi"
                  value={t.value}
                  className="sr-only"
                  checked={form.turi === t.value}
                  onChange={setField('turi')}
                />
                <span className="text-2xl">{t.emoji}</span>
                <span className="mt-1 text-xs font-medium">{t.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Tavsif *
          </label>
          <textarea
            rows={4}
            value={form.tavsif}
            onChange={setField('tavsif')}
            placeholder="Masalan: Yaqin dorixonadan paratsetamol va tomografiya yo'llanmasi olib kelish kerak..."
            className="block w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Manzil *
            </label>
            <input
              value={form.manzil}
              onChange={setField('manzil')}
              placeholder="Ko'cha, uy, kvartira"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tuman</label>
            <select
              value={form.tuman}
              onChange={setField('tuman')}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="">Tanlanmagan</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? 'Yuborilmoqda...' : "So'rov yuborish"}
        </button>
      </form>
    </div>
  )
}
