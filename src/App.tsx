import { Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import RequestsList from './pages/RequestsList'
import RequestDetail from './pages/RequestDetail'
import SendRequest from './pages/SendRequest'
import MyRequests from './pages/MyRequests'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'
import AdminUsers from './pages/AdminUsers'
import AdminStats from './pages/AdminStats'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-10">
          <Routes>
            {/* Hammaga ochiq */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Voluntyor */}
            <Route
              path="/requests"
              element={
                <ProtectedRoute roles={['voluntyor', 'admin']}>
                  <RequestsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests/:id"
              element={
                <ProtectedRoute>
                  <RequestDetail />
                </ProtectedRoute>
              }
            />

            {/* Qariya */}
            <Route
              path="/send-request"
              element={
                <ProtectedRoute roles={['qariya']}>
                  <SendRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-requests"
              element={
                <ProtectedRoute roles={['qariya']}>
                  <MyRequests />
                </ProtectedRoute>
              }
            />

            {/* Profil */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stats"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminStats />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="border-t border-gray-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-gray-500 sm:flex-row">
            <span>© {new Date().getFullYear()} VolunteerCare</span>
            <span>С заботой о пожилых ❤️</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
