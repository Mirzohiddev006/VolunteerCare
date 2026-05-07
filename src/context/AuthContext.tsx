import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { authApi, TOKEN_KEY, REFRESH_KEY, USER_KEY } from '../api'
import type { LoginPayload, RegisterPayload, Role, User } from '../types'

export interface AuthContextValue {
  user: User | null
  role: Role | null
  isAuthenticated: boolean
  loading: boolean
  login: (creds: LoginPayload) => Promise<User>
  register: (payload: RegisterPayload) => Promise<User | null>
  logout: () => Promise<void>
  updateUser: (patch: Partial<User>) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? (JSON.parse(raw) as User) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }
    let cancelled = false
    authApi
      .me()
      .then((fresh) => {
        if (cancelled) return
        if (fresh) {
          setUser(fresh)
          localStorage.setItem(USER_KEY, JSON.stringify(fresh))
        }
      })
      .catch(() => {
        // 401: interceptor clears token and redirects to /login
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (creds: LoginPayload): Promise<User> => {
    const data = await authApi.login(creds)
    const token = data?.access || data?.token || data?.accessToken
    if (!token) throw new Error('Token kelmadi')
    localStorage.setItem(TOKEN_KEY, token)
    if (data?.refresh) localStorage.setItem(REFRESH_KEY, data.refresh)
    const fresh = await authApi.me()
    if (!fresh) throw new Error("Foydalanuvchi ma'lumotlari kelmadi")
    setUser(fresh)
    localStorage.setItem(USER_KEY, JSON.stringify(fresh))
    return fresh
  }, [])

  const register = useCallback(
    async (payload: RegisterPayload): Promise<User | null> => {
      const data = await authApi.register(payload)
      const token = data?.access || data?.token || data?.accessToken
      if (token) {
        localStorage.setItem(TOKEN_KEY, token)
        if (data?.refresh) localStorage.setItem(REFRESH_KEY, data.refresh)
        const fresh = await authApi.me()
        if (fresh) {
          setUser(fresh)
          localStorage.setItem(USER_KEY, JSON.stringify(fresh))
          return fresh
        }
      }
      return null
    },
    []
  )

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authApi.logout()
    } catch {
      /* ignore */
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_KEY)
      localStorage.removeItem(USER_KEY)
      setUser(null)
    }
  }, [])

  const updateUser = useCallback((patch: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      localStorage.setItem(USER_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const value: AuthContextValue = {
    user,
    role: user?.rol || null,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth AuthProvider ichida ishlatilishi kerak')
  return ctx
}
