import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { extractError } from '../api'
import Alert from '../components/Alert'

interface LocationState {
  from?: { pathname?: string }
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [telefon, setTelefon] = useState<string>('')
  const [parol, setParol] = useState<string>('')
  const [showPwd, setShowPwd] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const state = location.state as LocationState | null
  const from = state?.from?.pathname || '/'

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    if (!telefon || !parol) {
      setError("Telefon va parolni to'liq kiriting")
      return
    }
    setSubmitting(true)
    try {
      const u = await login({ telefon, parol })
      const dest =
        from !== '/'
          ? from
          : u.rol === 'admin'
          ? '/admin'
          : u.rol === 'voluntyor'
          ? '/requests'
          : '/send-request'
      navigate(dest, { replace: true })
    } catch (err) {
      setError(extractError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Kirish</h1>
        <p className="mt-1 text-sm text-gray-500">
          Telefon raqam va parolingiz bilan tizimga kiring.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Alert>{error}</Alert>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Telefon raqam
            </label>
            <input
              type="tel"
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
              placeholder="+998901234567"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              autoComplete="tel"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Parol
            </label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={parol}
                onChange={(e) => setParol(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-12 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-gray-500 hover:text-gray-700"
              >
                {showPwd ? 'Yashir' : "Ko'rsat"}
              </button>
            </div>
            <div className="mt-2 text-right">
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-brand-700 hover:underline"
              >
                Parolni unutdingizmi?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? 'Kirilmoqda...' : 'Kirish'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Akkauntingiz yo'qmi?{' '}
          <Link to="/register" className="font-semibold text-brand-700 hover:underline">
            Ro'yxatdan o'ting
          </Link>
        </p>
      </div>
    </div>
  )
}
