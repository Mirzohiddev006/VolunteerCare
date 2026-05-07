import { useState } from 'react'

type Size = 'sm' | 'md' | 'lg'

interface StarRatingProps {
  value?: number
  onChange?: (value: number) => void
  size?: Size
  readOnly?: boolean
  showValue?: boolean
}

export default function StarRating({
  value = 0,
  onChange,
  size = 'md',
  readOnly = false,
  showValue = false,
}: StarRatingProps) {
  const [hover, setHover] = useState<number>(0)

  const sizeClass =
    size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-7 w-7' : 'h-5 w-5'

  const stars: number[] = [1, 2, 3, 4, 5]
  const display = hover || value

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center">
        {stars.map((s) => {
          const filled = s <= display
          const halfFilled = !filled && s - 0.5 <= display
          return (
            <button
              key={s}
              type="button"
              disabled={readOnly}
              onMouseEnter={() => !readOnly && setHover(s)}
              onMouseLeave={() => !readOnly && setHover(0)}
              onClick={() => !readOnly && onChange?.(s)}
              className={`${sizeClass} ${
                readOnly
                  ? 'cursor-default'
                  : 'cursor-pointer transition-transform hover:scale-110'
              }`}
              aria-label={`${s} yulduz`}
            >
              <svg
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                className={`${sizeClass} ${
                  filled
                    ? 'text-amber-400'
                    : halfFilled
                    ? 'text-amber-300'
                    : 'text-gray-300'
                }`}
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 00-.364 1.118l1.286 3.957c.3.922-.755 1.688-1.539 1.118l-3.366-2.446a1 1 0 00-1.176 0l-3.366 2.446c-.784.57-1.838-.196-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.105 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
              </svg>
            </button>
          )
        })}
      </div>
      {showValue && (
        <span className="ml-1 text-sm font-medium text-gray-700">
          {Number(value || 0).toFixed(1)}
        </span>
      )}
    </div>
  )
}
