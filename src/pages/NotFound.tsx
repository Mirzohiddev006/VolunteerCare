import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="text-7xl font-extrabold text-brand-600">404</div>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Страница не найдена</h1>
      <p className="mt-2 text-sm text-gray-500">
        Страница, которую вы ищете, не существует или была перемещена.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Вернуться на главную
      </Link>
    </div>
  )
}
