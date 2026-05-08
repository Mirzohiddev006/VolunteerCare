import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Feature {
  title: string
  desc: string
  icon: ReactNode
}

const features: Feature[] = [
  {
    title: 'Быстрая помощь',
    desc: 'Отправьте запрос, и волонтеры поблизости увидят его через несколько минут.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
  },
  {
    title: 'Надежные волонтеры',
    desc: 'Каждый волонтер проверяется и оценивается другими пожилыми людьми.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    title: 'Бесплатно и удобно',
    desc: 'Легко использовать как по телефону, так и через веб-интерфейс. Абсолютно бесплатно.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2"
      />
    ),
  },
]

interface HelpType {
  name: string
  emoji: string
}

const helpTypes: HelpType[] = [
  { name: 'Лекарства', emoji: '💊' },
  { name: 'Врачи', emoji: '🩺' },
  { name: 'Магазин / продукты', emoji: '🛒' },
  { name: 'Беседа', emoji: '💬' },
]

export default function Home() {
  const { isAuthenticated, role } = useAuth()
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-16 text-white sm:px-12 sm:py-24">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5) 0%, transparent 40%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.35) 0%, transparent 40%)',
          }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            Милосердие — это величайшее благо
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
            Платформа волонтерской помощи пожилым людям
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/90">
            От доставки лекарств до простого общения — VolunteerCare связывает
            пожилых людей с волонтерами поблизости.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="rounded-xl bg-white px-6 py-3 text-base font-semibold text-brand-700 shadow-lg shadow-black/10 transition hover:scale-105"
                >
                  Начать сейчас
                </Link>
                <Link
                  to="/login"
                  className="rounded-xl border border-white/40 px-6 py-3 text-base font-semibold text-white hover:bg-white/10"
                >
                  У меня есть аккаунт
                </Link>
              </>
            ) : (
              <Link
                to={
                  role === 'admin'
                    ? '/admin'
                    : role === 'voluntyor'
                    ? '/requests'
                    : '/send-request'
                }
                className="rounded-xl bg-white px-6 py-3 text-base font-semibold text-brand-700 shadow-lg hover:scale-105"
              >
                Продолжить
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Yordam turlari */}
      <section className="mx-auto max-w-5xl px-2">
        <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          Чем мы можем помочь?
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {helpTypes.map((t) => (
            <div
              key={t.name}
              className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="text-4xl">{t.emoji}</span>
              <span className="text-sm font-semibold text-gray-700">{t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-2">
        <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          Почему именно VolunteerCare?
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {f.icon}
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="rounded-3xl bg-gray-900 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Начните помогать сегодня
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-300">
            Зарегистрируйтесь за несколько минут и поделитесь добром с пожилыми
            людьми рядом с вами.
          </p>
          <Link
            to="/register"
            className="mt-6 inline-block rounded-xl bg-brand-500 px-6 py-3 text-base font-semibold hover:bg-brand-400"
          >
            Регистрация
          </Link>
        </section>
      )}
    </div>
  )
}
