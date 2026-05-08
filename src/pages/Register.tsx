import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { extractError, TOKEN_KEY } from '../api'
import Alert from '../components/Alert'
import { DISTRICTS } from '../utils/format'
import type { Role } from '../types'

interface RoleOption {
  value: Role
  label: string
}

const ROLES: RoleOption[] = [
  { value: 'qariya', label: 'Пожилой человек — нужна помощь' },
  { value: 'voluntyor', label: 'Волонтер — я помогу' },
]

interface FormState {
  ism: string
  telefon: string
  rol: Role
  manzil: string
  tuman: string
  parol: string
  confirm: string
}

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState<FormState>({
    ism: '',
    telefon: '',
    rol: 'qariya',
    manzil: '',
    tuman: '',
    parol: '',
    confirm: '',
  })
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const setField =
    (key: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((s) => ({ ...s, [key]: e.target.value as FormState[typeof key] }))

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!form.ism.trim() || !form.telefon.trim() || !form.parol) {
      setError('Пожалуйста, заполните все обязательные поля')
      return
    }
    if (form.parol.length < 6) {
      setError('Пароль должен содержать не менее 6 символов')
      return
    }
    if (form.parol !== form.confirm) {
      setError('Пароль и подтверждение пароля не совпадают')
      return
    }

    setSubmitting(true)
    try {
      const u = await register({
        ism: form.ism.trim(),
        telefon: form.telefon.trim(),
        rol: form.rol,
        manzil: form.manzil.trim() || undefined,
        tuman: form.tuman || undefined,
        parol: form.parol,
        parol_tasdiqlash: form.parol,
      })
      const isAuthed = !!localStorage.getItem(TOKEN_KEY)
      if (isAuthed && u) {
        const dest =
          u.rol === 'admin'
            ? '/admin'
            : u.rol === 'voluntyor'
            ? '/requests'
            : '/send-request'
        navigate(dest, { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    } catch (err) {
      setError(extractError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Регистрация</h1>
        <p className="mt-1 text-sm text-gray-500">
          Несколько шагов — и вы присоединитесь к платформе.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Alert>{error}</Alert>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Полное имя *
            </label>
            <input
              value={form.ism}
              onChange={setField('ism')}
              placeholder="Ваше имя"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Роль *</label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {ROLES.map((r) => (
                <label
                  key={r.value}
                  className={`cursor-pointer rounded-lg border px-3 py-2.5 text-sm transition ${
                    form.rol === r.value
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    name="rol"
                    value={r.value}
                    checked={form.rol === r.value}
                    onChange={setField('rol')}
                  />
                  {r.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Номер телефона *
            </label>
            <input
              type="tel"
              value={form.telefon}
              onChange={setField('telefon')}
              placeholder="+998901234567"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Адрес</label>
              <input
                value={form.manzil}
                onChange={setField('manzil')}
                placeholder="Улица, номер дома"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Район</label>
              <select
                value={form.tuman}
                onChange={setField('tuman')}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              >
                <option value="">Не выбрано</option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Пароль *
              </label>
              <input
                type="password"
                value={form.parol}
                onChange={setField('parol')}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Подтвердите пароль *
              </label>
              <input
                type="password"
                value={form.confirm}
                onChange={setField('confirm')}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? 'Создание...' : 'Регистрация'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          У вас есть аккаунт?{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:underline">
            Вход
          </Link>
        </p>
      </div>
    </div>
  )
}
