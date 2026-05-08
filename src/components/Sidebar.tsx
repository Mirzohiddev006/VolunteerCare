import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { roleLabel } from '../utils/format'

const navLinkBase = 'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200'
const navLinkInactive = 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
const navLinkActive = 'bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-100'

interface SidebarItemProps {
  to: string
  icon: React.ReactNode
  label: string
  isCollapsed: boolean
  onClick?: () => void
}

function SidebarItem({ to, icon, label, isCollapsed, onClick }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive} ${
          isCollapsed ? 'justify-center px-2' : ''
        }`
      }
      title={isCollapsed ? label : ''}
    >
      <span className="shrink-0">{icon}</span>
      {!isCollapsed && <span className="truncate">{label}</span>}
    </NavLink>
  )
}

export default function Sidebar() {
  const { user, role, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [location])

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  if (!isAuthenticated) return null

  const items = [
    { to: '/', label: 'Главная', icon: <HomeIcon /> },
    ...(role === 'voluntyor' ? [{ to: '/requests', label: 'Запросы', icon: <ListIcon /> }] : []),
    ...(role === 'qariya'
      ? [
          { to: '/send-request', label: 'Отправить запрос', icon: <PlusIcon /> },
          { to: '/my-requests', label: 'Мои запросы', icon: <UserListIcon /> },
        ]
      : []),
    ...(role === 'admin' ? [{ to: '/admin', label: 'Админ панель', icon: <ShieldIcon /> }] : []),
    { to: '/profile', label: 'Профиль', icon: <UserIcon /> },
  ]

  return (
    <>
      {/* Mobile Header (Hidden on Desktop) */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white/80 px-4 py-3 backdrop-blur-md lg:hidden">
        <Link to="/" className="flex items-center gap-2">
          <LogoIcon className="h-8 w-8 text-brand-600" />
          <span className="font-bold text-gray-900">VolunteerCare</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar (Desktop Persistent / Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white transition-all duration-300 ease-in-out lg:sticky lg:h-screen lg:border-r lg:border-gray-100 ${
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Header */}
        <div className={`flex h-16 items-center border-b border-gray-50 px-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <Link to="/" className={`flex items-center gap-2 ${isCollapsed ? 'hidden' : 'flex'}`}>
            <LogoIcon className="h-8 w-8 text-brand-600" />
            <span className="text-lg font-bold text-gray-900">VolunteerCare</span>
          </Link>
          {isCollapsed && <LogoIcon className="h-8 w-8 text-brand-600" />}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600 lg:block"
          >
            {isCollapsed ? <ChevronRightIcon className="h-5 w-5" /> : <ChevronLeftIcon className="h-5 w-5" />}
          </button>
          
          <button onClick={() => setIsMobileOpen(false)} className="lg:hidden text-gray-400 p-1">
             <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {items.map((item) => (
            <SidebarItem
              key={item.to}
              {...item}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        {/* User Profile / Footer */}
        <div className="border-t border-gray-50 p-4">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-100 font-bold text-brand-700">
              {(user?.ism || user?.telefon || '?').slice(0, 1).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">{user?.ism || 'Пользователь'}</p>
                <p className="truncate text-xs text-gray-500">{roleLabel(role)}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
            title={isCollapsed ? 'Выход' : ''}
          >
            <LogoutIcon className="h-5 w-5" />
            {!isCollapsed && <span>Выход</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

// --- Icons ---

function HomeIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

function UserListIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.333 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.956 11.956 0 0112 2.714z" />
    </svg>
  )
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  )
}

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 21s-7.5-4.5-9.5-9.5C1 7 4 4 7.2 4c1.9 0 3.5 1 4.8 2.5C13.3 5 14.9 4 16.8 4 20 4 23 7 21.5 11.5 19.5 16.5 12 21 12 21z" />
    </svg>
  )
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  )
}
