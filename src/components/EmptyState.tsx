import type { ReactNode } from 'react'

interface EmptyStateProps {
  title?: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({
  title = 'Ничего не найдено',
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-10 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-gray-100 text-gray-400">
        <svg
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h7m4-4l4 4m0 0l-4 4m4-4H10"
          />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
