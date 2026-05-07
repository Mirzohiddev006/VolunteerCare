interface SpinnerProps {
  label?: string
}

export default function Spinner({ label = 'Yuklanmoqda...' }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-gray-500">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand-600" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
