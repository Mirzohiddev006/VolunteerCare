export type Role = 'qariya' | 'voluntyor' | 'admin'

export interface UserShort {
  id: number
  ism: string
  telefon: string
  rol: Role
  tuman: string
  rasm_url: string | null
}

export interface User {
  id: number
  ism: string
  telefon: string
  rol: Role
  manzil: string
  tuman: string
  lat: number | null
  lon: number | null
  faol: boolean
  rasm: string | null
  rasm_url: string | null
  bio: string
  ortacha_baho: string
  created_at: string
}

export type RequestType = 'dori' | 'shifokor' | 'dokon' | 'suhbat' | 'boshqa'
export type RequestStatus = 'kutilmoqda' | 'qabul_qilindi' | 'bajarildi' | 'bekor'

export interface HelpRequest {
  id: number
  qariya: UserShort
  voluntyor: UserShort | null
  turi: RequestType
  turi_display: string
  tavsif: string
  manzil: string
  tuman: string
  lat: number | null
  lon: number | null
  holati: RequestStatus
  holati_display: string
  rasm: string | null
  rasm_url: string | null
  created_at: string
  updated_at: string
  baho?: string | null
}

export interface RatingPayload {
  sorov_id: number
  yulduz: number
  izoh?: string
}

export interface RatingSummary {
  average?: number
  avg?: number
  rating?: number
  count?: number
  total?: number
}

export interface AdminStatsData {
  totalRequests?: number
  completedRequests?: number
  pendingRequests?: number
  totalUsers?: number
  qariya?: number
  voluntyor?: number
  activeVolunteers?: number
  avgRating?: number
  byType?: Record<string, number>
  byDistrict?: Record<string, number>
}

export interface ApiSuccess<T> {
  success: true
  data: T
  message?: string
}

export interface ApiError {
  success: false
  error: string
  code: number
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export interface RegisterPayload {
  ism: string
  telefon: string
  parol: string
  parol_tasdiqlash: string
  rol: Role
  manzil?: string
  tuman?: string
}

export interface LoginPayload {
  telefon: string
  parol: string
}

export interface AuthResponse {
  access?: string
  refresh?: string
  token?: string
  accessToken?: string
  user?: User
}

export interface CreateRequestPayload {
  turi: RequestType
  tavsif: string
  manzil?: string
  tuman?: string
}
