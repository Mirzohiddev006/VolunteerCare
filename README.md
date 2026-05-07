# VolunteerCare — Frontend (TypeScript)

Keksa yoshdagilarga ko'ngilli yordam ko'rsatishning onlayn platformasi uchun
React.js + TypeScript + Vite + Tailwind CSS frontend.

## Texnologiyalar

- **React 18** + **TypeScript 5** + **Vite 5**
- **React Router DOM 6** — client-side routing
- **Axios** — typed HTTP klient (interceptorlar bilan)
- **Tailwind CSS 3** — stilizatsiya
- **JWT** — `localStorage` orqali sessiya

## Tezkor boshlash

```bash
npm install
cp .env.example .env

npm run dev          # dev server
npm run build        # tsc -b && vite build
npm run typecheck    # faqat tip tekshirish
npm run preview      # production buildni ko'rish
```

Standart API manzili: `https://volunteering-z2mm.onrender.com`

## Sahifalar va rollar

| Sahifa | URL | Rol |
|---|---|---|
| Bosh sahifa | `/` | hammaga |
| Kirish | `/login` | hammaga |
| Ro'yxatdan o'tish | `/register` | hammaga |
| Parolni tiklash | `/forgot-password` | hammaga |
| So'rovlar ro'yxati | `/requests` | voluntyor / admin |
| So'rov tafsiloti | `/requests/:id` | autentifikatsiya |
| So'rov yuborish | `/send-request` | qariya |
| Mening so'rovlarim | `/my-requests` | qariya |
| Profil | `/profile` | autentifikatsiya |
| Admin panel | `/admin` | admin |
| Admin — Foydalanuvchilar | `/admin/users` | admin |
| Admin — Statistika | `/admin/stats` | admin |

## Loyiha tuzilmasi

```
src/
├── api/
│   └── index.ts               # Typed axios instance + barcha endpoint funksiyalari
├── context/
│   └── AuthContext.tsx        # AuthContextValue interfeysi, login/register/logout
├── components/
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx     # roles?: Role[]
│   ├── StarRating.tsx         # 1–5 yulduz, controlled / readOnly
│   ├── Spinner.tsx
│   ├── EmptyState.tsx
│   └── Alert.tsx              # AlertKind = 'error' | 'success' | 'info' | 'warning'
├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── ForgotPassword.tsx
│   ├── RequestsList.tsx
│   ├── RequestDetail.tsx
│   ├── SendRequest.tsx
│   ├── MyRequests.tsx
│   ├── Profile.tsx
│   ├── AdminPanel.tsx
│   ├── AdminUsers.tsx
│   ├── AdminStats.tsx
│   └── NotFound.tsx
├── types/
│   └── index.ts               # Domen tiplari: User, Role, HelpRequest, ApiResponse, ...
├── utils/
│   └── format.ts
├── App.tsx
├── main.tsx
├── index.css
└── vite-env.d.ts
```

## Tip tizimi

`src/types/index.ts` da loyihaning asosiy tiplari aniqlangan:

- `Role` = `'qariya' | 'voluntyor' | 'admin'`
- `User`, `HelpRequest`, `RequestType`, `RequestStatus`
- `RatingPayload`, `RatingSummary`, `AdminStatsData`
- `ApiSuccess<T>`, `ApiError`, `ApiResponse<T>`

API funksiyalari `Promise<T>` qaytaradi va to'liq tip xavfsizligi bilan ishlaydi.

## Auth oqimi

1. `POST /api/auth/login` orqali `{ token, user }` qaytadi.
2. Token `vc_token` kalitida, user `vc_user` da `localStorage`ga yoziladi.
3. `useAuth()` hook orqali `AuthContextValue` mavjud bo'ladi.
4. `<ProtectedRoute roles={['admin']}>` bilan sahifani himoyalash.
5. `401` xatoligi axios interceptor orqali avtomatik `/login` ga olib boradi.

## Litsenziya

MVP / o'quv loyihasi.
