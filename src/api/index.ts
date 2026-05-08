import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import type {
  AdminStatsData,
  AuthResponse,
  CreateRequestPayload,
  HelpRequest,
  LoginPayload,
  RatingPayload,
  RatingSummary,
  RegisterPayload,
  User,
} from '../types'

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://volunteering-z2mm.onrender.com'

export const TOKEN_KEY = 'vc_token'
export const REFRESH_KEY = 'vc_refresh'
export const USER_KEY = 'vc_user'

export const api: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_KEY)
      localStorage.removeItem(USER_KEY)
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

function unwrap<T>(res: AxiosResponse<unknown>): T {
  const body = res?.data as { data?: T } | T | undefined
  if (body && typeof body === 'object' && 'data' in (body as Record<string, unknown>)) {
    return (body as { data: T }).data
  }
  return body as T
}

// =========================================================================
// AUTH
// =========================================================================
export const authApi = {
  register: (payload: RegisterPayload) =>
    api.post('/auth/register/', payload).then((r) => unwrap<AuthResponse>(r)),

  login: (payload: LoginPayload) =>
    api.post('/auth/login/', payload).then((r) => unwrap<AuthResponse>(r)),

  logout: () => {
    const refresh = localStorage.getItem(REFRESH_KEY)
    return api.post('/auth/logout/', { refresh }).then((r) => unwrap<unknown>(r))
  },

  me: () => api.get('/auth/me/').then((r) => unwrap<User>(r)),

  refresh: () => {
    const refresh = localStorage.getItem(REFRESH_KEY)
    return api.post('/auth/refresh/', { refresh }).then((r) => unwrap<AuthResponse>(r))
  },

  forgotPassword: (payload: { telefon: string }) =>
    api.post('/auth/forgot-password/', payload).then((r) => unwrap<unknown>(r)),

  resetPassword: (payload: { telefon: string; kod: string; yangi_parol: string }) =>
    api.post('/auth/reset-password/', payload).then((r) => unwrap<unknown>(r)),

  changePassword: (payload: { eski_parol: string; yangi_parol: string }) =>
    api.post('/auth/change-password/', payload).then((r) => unwrap<unknown>(r)),
}

// =========================================================================
// REQUESTS
// =========================================================================
export interface RequestListParams {
  holati?: string
  turi?: string
  tuman?: string
}

export const requestsApi = {
  list: (params: RequestListParams = {}) =>
    api.get('/requests/', { params }).then((r) => unwrap<HelpRequest[]>(r)),

  get: (id: number | string) =>
    api.get(`/requests/${id}/`).then((r) => unwrap<HelpRequest>(r)),

  create: (payload: CreateRequestPayload) =>
    api.post('/requests/', payload).then((r) => unwrap<HelpRequest>(r)),

  accept: (id: number | string) =>
    api.patch(`/requests/${id}/accept/`).then((r) => unwrap<HelpRequest>(r)),

  complete: (id: number | string) =>
    api.patch(`/requests/${id}/complete/`).then((r) => unwrap<HelpRequest>(r)),

  cancel: (id: number | string) =>
    api.patch(`/requests/${id}/cancel/`).then((r) => unwrap<unknown>(r)),

  remove: (id: number | string) =>
    api.delete(`/requests/${id}/`).then((r) => unwrap<unknown>(r)),

  my: () => api.get('/requests/my/').then((r) => unwrap<HelpRequest[]>(r)),

  accepted: () =>
    api.get('/requests/accepted/').then((r) => unwrap<HelpRequest[]>(r)),
}

// =========================================================================
// USERS
// =========================================================================
export interface UpdateProfilePayload {
  ism?: string
  manzil?: string
  tuman?: string
  lat?: number
  lon?: number
  rasm?: string
  bio?: string
}

export const usersApi = {
  profile: () => api.get('/users/profile/').then((r) => unwrap<User>(r)),

  updateProfile: (payload: UpdateProfilePayload) =>
    api.put('/users/profile/', payload).then((r) => unwrap<User>(r)),

  byId: (id: number | string) =>
    api.get(`/users/${id}/`).then((r) => unwrap<User>(r)),
}

// =========================================================================
// RATINGS
// =========================================================================
export const ratingsApi = {
  rate: (payload: RatingPayload) =>
    api.post('/ratings/', payload).then((r) => unwrap<unknown>(r)),

  forVolunteer: (id: number | string) =>
    api.get(`/ratings/volunteer/${id}/`).then((r) => unwrap<RatingSummary>(r)),
}

// =========================================================================
// ADMIN
// =========================================================================
export const adminApi = {
  users: (params?: { rol?: string; faol?: boolean }) =>
    api.get('/admin/users/', { params }).then((r) => unwrap<User[]>(r)),

  blockUser: (id: number | string) =>
    api.patch(`/admin/users/${id}/block/`).then((r) => unwrap<unknown>(r)),

  requests: (params?: { holati?: string; turi?: string }) =>
    api.get('/admin/requests/', { params }).then((r) => unwrap<HelpRequest[]>(r)),

  closeRequest: (id: number | string) =>
    api.patch(`/admin/requests/${id}/`).then((r) => unwrap<unknown>(r)),

  removeRequest: (id: number | string) =>
    api.delete(`/admin/requests/${id}/`).then((r) => unwrap<unknown>(r)),

  stats: () => api.get('/admin/stats/').then((r) => unwrap<AdminStatsData>(r)),
}

// =========================================================================
// Helper
// =========================================================================
export function extractError(err: unknown): string {
  if (!err) return 'Неизвестная ошибка'
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as Record<string, unknown> | undefined
    if (data) {
      for (const key of ['error', 'message', 'detail', 'non_field_errors']) {
        const val = data[key]
        if (typeof val === 'string') return val
        if (Array.isArray(val) && typeof val[0] === 'string') return val[0]
      }
      const firstKey = Object.keys(data)[0]
      if (firstKey) {
        const val = data[firstKey]
        if (typeof val === 'string') return `${firstKey}: ${val}`
        if (Array.isArray(val) && typeof val[0] === 'string') return `${firstKey}: ${val[0]}`
      }
    }
    if (err.message) return err.message
  } else if (err instanceof Error) {
    return err.message
  }
  return 'Ошибка связи с сервером'
}

export default api
