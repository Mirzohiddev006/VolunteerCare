import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react'
import { extractError, ratingsApi, usersApi, type UpdateProfilePayload } from '../api'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'
import Alert from '../components/Alert'
import StarRating from '../components/StarRating'
import { DISTRICTS, roleLabel } from '../utils/format'
import type { RatingSummary, User } from '../types'

interface FieldProps {
  label: string
  children: ReactNode
}

function Field({ label, children }: FieldProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  )
}

interface InfoProps {
  label: string
  value?: string | null
}

function Info({ label, value }: InfoProps) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </div>
      <div className="mt-1 text-sm text-gray-800">{value || '—'}</div>
    </div>
  )
}

interface ProfileForm {
  ism: string
  manzil: string
  tuman: string
  bio: string
}

export default function Profile() {
  const { user, role, updateUser } = useAuth()
  const [loading, setLoading] = useState<boolean>(true)
  const [profile, setProfile] = useState<User | null>(null)
  const [ratingSummary, setRatingSummary] = useState<RatingSummary | null>(null)
  const [error, setError] = useState<string>('')
  const [ok, setOk] = useState<string>('')
  const [editing, setEditing] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)
  const [form, setForm] = useState<ProfileForm>({
    ism: '',
    manzil: '',
    tuman: '',
    bio: '',
  })

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const u = await usersApi.profile()
      setProfile(u)
      setForm({
        ism: u?.ism || '',
        manzil: u?.manzil || '',
        tuman: u?.tuman || '',
        bio: u?.bio || '',
      })

      if (role === 'voluntyor' && u?.id) {
        try {
          const r = await ratingsApi.forVolunteer(u.id)
          setRatingSummary(r)
        } catch {
          /* ignore */
        }
      }
    } catch (err) {
      setError(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setField =
    (key: keyof ProfileForm) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((s) => ({ ...s, [key]: e.target.value }))

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setOk('')
    try {
      const payload: UpdateProfilePayload = {
        ism: form.ism || undefined,
        manzil: form.manzil || undefined,
        tuman: form.tuman || undefined,
        bio: form.bio || undefined,
      }
      const updated = await usersApi.updateProfile(payload)
      setProfile(updated)
      updateUser(updated)
      setEditing(false)
      setOk('Профиль обновлен')
    } catch (err) {
      setError(extractError(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />

  const u: User = profile || (user as User) || ({} as User)
  const avg = Number(
    ratingSummary?.average ?? ratingSummary?.avg ?? ratingSummary?.rating ?? 0
  )
  const count = ratingSummary?.count ?? ratingSummary?.total ?? 0

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
            {(u.ism || u.telefon || '?').slice(0, 1).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{u.ism || '—'}</h1>
            <div className="text-sm text-gray-500">
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                {roleLabel(role)}
              </span>
              <span className="ml-2">{u.telefon}</span>
            </div>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Редактировать
            </button>
          )}
        </div>

        {role === 'voluntyor' && (
          <div className="mt-5 flex items-center gap-3 rounded-xl bg-amber-50 p-4">
            <StarRating value={avg} readOnly showValue />
            <span className="text-sm text-amber-900">
              {count > 0 ? `${count} оценок` : 'Оценок пока нет'}
            </span>
          </div>
        )}
      </div>

      {ok && <Alert kind="success">{ok}</Alert>}
      {error && <Alert>{error}</Alert>}

      {editing ? (
        <form
          onSubmit={onSave}
          className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
        >
          <Field label="Имя">
            <input
              value={form.ism}
              onChange={setField('ism')}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </Field>
          <Field label="Адрес">
            <input
              value={form.manzil}
              onChange={setField('manzil')}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </Field>
          <Field label="Район">
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
          </Field>
          <Field label="О себе">
            <textarea
              rows={3}
              value={form.bio}
              onChange={setField('bio')}
              className="block w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setEditing(false)
                setForm({
                  ism: u?.ism || '',
                  manzil: u?.manzil || '',
                  tuman: u?.tuman || '',
                  bio: u?.bio || '',
                })
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:grid-cols-2">
          <Info label="Имя" value={u.ism} />
          <Info label="Телефон" value={u.telefon} />
          <Info label="Адрес" value={u.manzil} />
          <Info label="Район" value={u.tuman} />
          {u.bio && <Info label="О себе" value={u.bio} />}
          {u.ortacha_baho && (
            <Info label="Средняя оценка" value={u.ortacha_baho} />
          )}
          {u.created_at && (
            <Info
              label="Дата регистрации"
              value={new Date(u.created_at).toLocaleDateString('ru-RU')}
            />
          )}
        </div>
      )}
    </div>
  )
}
