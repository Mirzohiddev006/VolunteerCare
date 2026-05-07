import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Role } from '../types'

interface ProtectedRouteProps {
  children: ReactNode
  roles?: Role[]
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, role, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-gray-500">
        Yuklanmoqda...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && roles.length > 0 && (!role || !roles.includes(role))) {
    return (
      <div className="mx-auto max-w-xl rounded-xl bg-red-50 p-6 text-center text-red-700">
        <h2 className="mb-2 text-xl font-semibold">Ruxsat yo'q</h2>
        <p>Ushbu sahifaga kirish uchun sizning roliningizda ruxsat mavjud emas.</p>
      </div>
    )
  }

  return <>{children}</>
}
