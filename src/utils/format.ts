import type { RequestStatus, RequestType } from '../types'

export interface RequestTypeMeta {
  value: RequestType
  label: string
  emoji: string
}

export const REQUEST_TYPES: RequestTypeMeta[] = [
  { value: 'dori', label: 'Лекарства', emoji: '💊' },
  { value: 'shifokor', label: 'Врачи', emoji: '🩺' },
  { value: 'dokon', label: 'Магазин / продукты', emoji: '🛒' },
  { value: 'suhbat', label: 'Беседа', emoji: '💬' },
  { value: 'boshqa', label: 'Другое', emoji: '📋' },
]

export interface StatusMeta {
  label: string
  color: string
}

export const REQUEST_STATUSES: Record<string, StatusMeta> = {
  kutilmoqda: { label: 'Ожидает', color: 'bg-amber-100 text-amber-800' },
  qabul_qilindi: { label: 'Принято', color: 'bg-sky-100 text-sky-800' },
  bajarildi: { label: 'Выполнено', color: 'bg-emerald-100 text-emerald-800' },
  bekor: { label: 'Отменено', color: 'bg-gray-200 text-gray-700' },
}

export const requestTypeLabel = (value: RequestType | undefined): string =>
  REQUEST_TYPES.find((t) => t.value === value)?.label || (value as string) || '—'

export const requestTypeEmoji = (value: RequestType | undefined): string =>
  REQUEST_TYPES.find((t) => t.value === value)?.emoji || '📋'

export const formatDate = (iso?: string | null): string => {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

export const statusBadge = (status: RequestStatus | string | undefined): StatusMeta => {
  const s = status ? REQUEST_STATUSES[status] : undefined
  if (s) return s
  return {
    label: (status as string) || 'Неопределено',
    color: 'bg-gray-100 text-gray-700',
  }
}

export const roleLabel = (role: string | null | undefined): string => {
  if (role === 'qariya') return 'Пожилой человек'
  if (role === 'voluntyor') return 'Волонтер'
  if (role === 'admin') return 'Админ'
  return role || ''
}

export const DISTRICTS: string[] = [
  'Бектемир',
  'Чиланзар',
  'Мирабад',
  'Мирзо-Улугбек',
  'Сергели',
  'Шайхантахур',
  'Алмазар',
  'Учтепа',
  'Яккасарай',
  'Яшнабад',
  'Юнусабад',
  'Янгихаёт',
]
