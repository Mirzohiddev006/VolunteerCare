import type { ReactNode } from 'react'

export type AlertKind = 'error' | 'success' | 'info' | 'warning'

interface AlertProps {
  kind?: AlertKind
  children?: ReactNode
}

export default function Alert({ kind = 'error', children }: AlertProps) {
  if (!children) return null
  const styles: Record<AlertKind, string> = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    info: 'border-sky-200 bg-sky-50 text-sky-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    error: 'border-red-200 bg-red-50 text-red-800',
  }
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[kind]}`}>
      {children}
    </div>
  )
}
