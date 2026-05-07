import type { RequestStatus, RequestType } from '../types'

export interface RequestTypeMeta {
  value: RequestType
  label: string
  emoji: string
}

export const REQUEST_TYPES: RequestTypeMeta[] = [
  { value: 'dori', label: 'Dori-darmon', emoji: '💊' },
  { value: 'shifokor', label: 'Shifokor', emoji: '🩺' },
  { value: 'dokon', label: "Do'kon / oziq-ovqat", emoji: '🛒' },
  { value: 'suhbat', label: 'Suhbat', emoji: '💬' },
  { value: 'boshqa', label: 'Boshqa', emoji: '📋' },
]

export interface StatusMeta {
  label: string
  color: string
}

export const REQUEST_STATUSES: Record<string, StatusMeta> = {
  kutilmoqda: { label: 'Kutilmoqda', color: 'bg-amber-100 text-amber-800' },
  qabul_qilindi: { label: 'Qabul qilindi', color: 'bg-sky-100 text-sky-800' },
  bajarildi: { label: 'Bajarildi', color: 'bg-emerald-100 text-emerald-800' },
  bekor: { label: 'Bekor qilindi', color: 'bg-gray-200 text-gray-700' },
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
    return d.toLocaleString('uz-UZ', {
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
    label: (status as string) || 'Noaniq',
    color: 'bg-gray-100 text-gray-700',
  }
}

export const DISTRICTS: string[] = [
  'Bektemir',
  'Chilonzor',
  'Mirobod',
  'Mirzo Ulug`bek',
  'Sergeli',
  'Shayxontohur',
  'Olmazor',
  'Uchtepa',
  'Yakkasaroy',
  'Yashnobod',
  'Yunusobod',
  'Yangihayot',
]
