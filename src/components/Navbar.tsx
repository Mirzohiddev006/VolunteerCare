import { useState, type ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { roleLabel } from '../utils/format'

const linkBase = 'rounded-lg px-3 py-2 text-sm font-medium transition-colors'
const linkInactive = 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
const linkActive = 'bg-brand-50 text-brand-700'

interface NavItemProps {
  to: string
  children: ReactNode
  end?: boolean
  onClick?: () => void
}

function Item({ to, children, end, onClick }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `${linkBase} ${isActive ? linkActive : linkInactive}`
      }
    >
      {children}
    </NavLink>
  )
}

export default function Navbar() {
  const { user, role, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState<boolean>(false)

  const handleLogout = async () => {
    await logout()
    setOpen(false)
    navigate('/login', { replace: true })
  }

  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" onClick={close} className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-white shadow-sm">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="currentColor"
              aria-hidden
            >
              <path d="M12 21s-7.5-4.5-9.5-9.5C1 7 4 4 7.2 4c1.9 0 3.5 1 4.8 2.5C13.3 5 14.9 4 16.8 4 20 4 23 7 21.5 11.5 19.5 16.5 12 21 12 21z" />
            </svg>
          </span>
          <span className="text-lg font-bold text-gray-900">VolunteerCare</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Item to="/" end>
            Главная
          </Item>
          {isAuthenticated && role === 'voluntyor' && (
            <Item to="/requests">Запросы</Item>
          )}
          {isAuthenticated && role === 'qariya' && (
            <>
              <Item to="/send-request">Отправить запрос</Item>
              <Item to="/my-requests">Мои запросы</Item>
            </>
          )}
          {isAuthenticated && role === 'admin' && (
            <Item to="/admin">Админ панель</Item>
          )}
          {isAuthenticated && <Item to="/profile">Профиль</Item>}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Вход
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
              >
                Регистрация
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-gray-600 lg:block">
                {user?.ism || user?.telefon}
                <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                  {roleLabel(role)}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Выход
              </button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Открыть меню"
          className="md:hidden rounded-lg p-2 text-gray-700 hover:bg-gray-100"
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="space-y-1 px-3 py-3">
            <Item to="/" end onClick={close}>
              Главная
            </Item>
            {isAuthenticated && role === 'voluntyor' && (
              <Item to="/requests" onClick={close}>
                Запросы
              </Item>
            )}
            {isAuthenticated && role === 'qariya' && (
              <>
                <Item to="/send-request" onClick={close}>
                  Отправить запрос
                </Item>
                <Item to="/my-requests" onClick={close}>
                  Мои запросы
                </Item>
              </>
            )}
            {isAuthenticated && role === 'admin' && (
              <Item to="/admin" onClick={close}>
                Админ панель
              </Item>
            )}
            {isAuthenticated && (
              <Item to="/profile" onClick={close}>
                Профиль
              </Item>
            )}
            <div className="my-2 h-px bg-gray-200" />
            {!isAuthenticated ? (
              <div className="flex gap-2 px-3">
                <Link
                  to="/login"
                  onClick={close}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700"
                >
                  Вход
                </Link>
                <Link
                  to="/register"
                  onClick={close}
                  className="flex-1 rounded-lg bg-brand-600 px-3 py-2 text-center text-sm font-semibold text-white"
                >
                  Регистрация
                </Link>
              </div>
            ) : (
              <div className="px-3">
                <div className="mb-2 text-sm text-gray-600">
                  {user?.ism || user?.telefon} ·{' '}
                  <span className="font-medium text-brand-700">{roleLabel(role)}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Выход
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
