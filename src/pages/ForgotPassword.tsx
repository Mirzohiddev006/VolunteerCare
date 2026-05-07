import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { authApi, extractError } from '../api'
import Alert from '../components/Alert'

type Step = 'request' | 'reset'

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>('request')
  const [telefon, setTelefon] = useState<string>('')
  const [kod, setKod] = useState<string>('')
  const [yangiParol, setYangiParol] = useState<string>('')
  const [confirm, setConfirm] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [ok, setOk] = useState<string>('')

  const sendCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setOk('')
    if (!telefon) return setError('Telefon raqamingizni kiriting')
    setSubmitting(true)
    try {
      await authApi.forgotPassword({ telefon })
      setOk('Tasdiqlash kodi yuborildi. Iltimos, telefoningizni tekshiring.')
      setStep('reset')
    } catch (err) {
      setError(extractError(err))
    } finally {
      setSubmitting(false)
    }
  }

  const reset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setOk('')
    if (!kod || !yangiParol) return setError("Barcha maydonlarni to'ldiring")
    if (yangiParol.length < 6) return setError("Parol kamida 6 ta belgi bo'lsin")
    if (yangiParol !== confirm) return setError('Parollar mos kelmadi')
    setSubmitting(true)
    try {
      await authApi.resetPassword({ telefon, kod, yangi_parol: yangiParol })
      setOk('Parol muvaffaqiyatli yangilandi. Endi tizimga kira olasiz.')
    } catch (err) {
      setError(extractError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Parolni tiklash</h1>
        <p className="mt-1 text-sm text-gray-500">
          {step === 'request'
            ? 'Telefoningizga SMS kod yuboramiz.'
            : 'Telefoningizga kelgan kodni va yangi parolni kiriting.'}
        </p>

        {step === 'request' ? (
          <form className="mt-6 space-y-4" onSubmit={sendCode}>
            {error && <Alert>{error}</Alert>}
            {ok && <Alert kind="success">{ok}</Alert>}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Telefon
              </label>
              <input
                type="tel"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                placeholder="+998901234567"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {submitting ? 'Yuborilmoqda...' : 'Kod yuborish'}
            </button>
          </form>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={reset}>
            {error && <Alert>{error}</Alert>}
            {ok && <Alert kind="success">{ok}</Alert>}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Tasdiqlash kodi
              </label>
              <input
                value={kod}
                onChange={(e) => setKod(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Yangi parol
              </label>
              <input
                type="password"
                value={yangiParol}
                onChange={(e) => setYangiParol(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Parolni tasdiqlang
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {submitting ? 'Yangilanmoqda...' : 'Parolni yangilash'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          <Link to="/login" className="font-semibold text-brand-700 hover:underline">
            ← Kirishga qaytish
          </Link>
        </p>
      </div>
    </div>
  )
}
