# Safwa Dashboard Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the single-file `index.html` SPA into a full Next.js 16 admin dashboard for "الصفوة" food trading business using Supabase Auth + direct Supabase client, TanStack Query, TanStack Form, and next-intl (ar/en).

**Architecture:** Next.js 16 App Router with Supabase SSR for auth (middleware protects routes, server/browser clients split). All data fetching via TanStack Query wrapping Supabase calls returning `PaginatedResponse<T[]>` format. i18n is cookie-based with flat URLs (no locale prefix), using next-intl.

**Tech Stack:** Next.js 16 · React 19 · @supabase/supabase-js + @supabase/ssr · TanStack Query v5 · TanStack Form · next-intl · shadcn/ui · Tailwind v4 · nuqs · Sonner · Zod · Bun

---

## Chunk 1: Project Scaffold

### Task 1: Clean and initialize project

**Files:**
- Delete: `index.html` (keep `manifest.json`)
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `.env.local`, `.env.example`, `.gitignore`, `components.json`

- [ ] **Step 1: Remove the old HTML file and initialize**

```bash
cd /home/d7om/Projects/safwa
rm index.html
```

- [ ] **Step 2: Install Next.js and all dependencies**

```bash
bun add next@^16 react@^19 react-dom@^19
bun add @supabase/supabase-js @supabase/ssr
bun add @tanstack/react-query@^5 @tanstack/react-form @tanstack/react-table@^8
bun add next-intl next-themes sonner nuqs
bun add @t3-oss/env-nextjs zod
bun add class-variance-authority clsx tailwind-merge
bun add lucide-react
bun add usehooks-ts
bun add --dev typescript @types/node @types/react@^19 @types/react-dom@^19
bun add --dev tailwindcss@^4 @tailwindcss/postcss postcss
```

- [ ] **Step 3: Create `package.json`**

```json
{
  "name": "safwa",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

- [ ] **Step 4: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Create `next.config.ts`**

```ts
import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts')

const nextConfig: NextConfig = {}

export default withNextIntl(nextConfig)
```

- [ ] **Step 6: Create `.env.example`**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://akhjfhkwcqcryvdrpycq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

- [ ] **Step 7: Create `.env.local`** (fill in real values from existing `index.html`)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://akhjfhkwcqcryvdrpycq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<copy from index.html SUPABASE_KEY const>
```

- [ ] **Step 8: Create `.gitignore`**

```
.next/
node_modules/
.env.local
.env.*.local
```

- [ ] **Step 9: Create `components.json`** (shadcn config)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/utils/cn",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

- [ ] **Step 10: Commit scaffold**

```bash
git add -A
git commit -m "feat: initialize Next.js 16 project scaffold"
```

---

### Task 2: Copy utilities and types from template

**Files:**
- Create: `utils/cn.ts`, `utils/parsers.ts`, `utils/query.ts`, `utils/formatters.ts`
- Create: `types/data-table.ts`, `types/sidebar.ts`
- Create: `lib/supabase/api-types.d.ts`

- [ ] **Step 1: Copy `utils/cn.ts`** from template

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 2: Copy `utils/parsers.ts`** from template verbatim (handles sort state URL parsing for TanStack Table)

Copy from `/home/d7om/Projects/create-d7om-dashboard/template/utils/parsers.ts`

- [ ] **Step 3: Copy `utils/query.ts`** from template verbatim

Copy from `/home/d7om/Projects/create-d7om-dashboard/template/utils/query.ts`

- [ ] **Step 4: Create `utils/formatters.ts`** (currency and date helpers matching original HTML)

```ts
export function fmtNum(value: number | string | undefined | null, decimals = 2): string {
  const num = parseFloat(String(value ?? 0))
  if (isNaN(num)) return '0.00'
  return num.toLocaleString('ar-EG', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export function fmtCurrency(value: number | string | undefined | null): string {
  return `${fmtNum(value)} ج.م`
}

export function fmtDate(dateStr: string | undefined | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ar-EG', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}
```

- [ ] **Step 5: Copy `types/data-table.ts`** from template verbatim

Copy from `/home/d7om/Projects/create-d7om-dashboard/template/types/data-table.ts`

- [ ] **Step 6: Create `types/sidebar.ts`**

```ts
import type { LucideIcon } from 'lucide-react'

export interface MenuItem {
  title: string
  path?: string
  icon?: LucideIcon | React.ComponentType<{ className?: string }>
  children?: Omit<MenuItem, 'icon' | 'children'>[]
  separator?: boolean
}

export type MenuConfig = MenuItem[]
```

- [ ] **Step 7: Create `lib/supabase/api-types.d.ts`** — declares global types used across the query layer

```ts
export declare global {
  type API<T = undefined> = {
    data?: T
    message?: string
    statusCode: number
    success: boolean
  }

  type Pagination = {
    current_page: number
    from: number
    last_page: number
    per_page: number
    to: number
    total: number
  }

  type PaginatedResponse<T = undefined> = {
    data?: T
    pagination: Pagination
  }
}
```

- [ ] **Step 8: Commit utilities**

```bash
git add -A
git commit -m "feat: add utility functions, types, and global type declarations"
```

---

### Task 3: Copy hooks and UI components from template

**Files:**
- Create: `hooks/use-data-table.ts`, `hooks/use-data-table-query.ts`, `hooks/use-debounce.ts`, `hooks/use-mobile.tsx`
- Create: `components/data-table/`, `components/form/`, `components/custom/`
- Create: `lib/fetcher/utils.ts` (for `paginationFallback`)

- [ ] **Step 1: Create `lib/fetcher/utils.ts`** — provides `paginationFallback` used by hooks

```ts
export const paginationFallback: Pagination = {
  current_page: 1,
  from: 0,
  last_page: 1,
  per_page: 15,
  to: 0,
  total: 0
}
```

- [ ] **Step 2: Create `lib/index.ts`** — barrel for lib utilities

```ts
export { paginationFallback } from './fetcher/utils'
```

- [ ] **Step 3: Copy hooks from template** — copy these files verbatim:
  - `hooks/use-data-table.ts` from template (remove axios import if present)
  - `hooks/use-data-table-query.ts` from template (remove AxiosError, replace with `Error`)
  - `hooks/use-debounce.ts` from template
  - `hooks/use-mobile.tsx` from template

  In `use-data-table-query.ts`, the AxiosError type is used. Since we're not using Axios, replace:
  ```ts
  // Remove: import { AxiosError } from 'axios'
  // Replace all AxiosError<API> with Error
  ```

- [ ] **Step 4: Copy data-table components from template** verbatim:
  - `components/data-table/data-table.tsx`
  - `components/data-table/data-table-filter.tsx`
  - `components/data-table/data-table-error.tsx`
  - `components/data-table/data-table-view-options.tsx`
  - `components/data-table/filters/` (all filter components)

- [ ] **Step 5: Copy form components from template** verbatim:
  - `components/form/form-field.tsx`
  - `components/form/text-area-field.tsx`
  - `components/form/checkbox-field.tsx`
  - `components/form/combobox-field.tsx`
  - `components/form/switch-field.tsx`
  - `components/form/date-input-field.tsx`
  - `components/form/index.ts`

- [ ] **Step 6: Copy custom components from template** verbatim:
  - `components/custom/title.tsx`
  - `components/custom/subtitle.tsx`
  - `components/custom/badge.tsx`
  - `components/custom/info-card/`

- [ ] **Step 7: Add shadcn UI primitives**

```bash
bunx shadcn@latest add button input label card badge dialog select separator dropdown-menu tooltip skeleton table alert-dialog sheet
```

- [ ] **Step 8: Commit components**

```bash
git add -A
git commit -m "feat: add hooks, data-table, form, and UI components"
```

---

## Chunk 2: Supabase Auth

### Task 4: Supabase client setup

**Files:**
- Create: `lib/supabase/client.ts`, `lib/supabase/server.ts`
- Create: `lib/env.ts`

- [ ] **Step 1: Create `lib/env.ts`**

```ts
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1)
  },
  runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
})
```

- [ ] **Step 2: Create `lib/supabase/client.ts`** — browser client, call from client components

```ts
import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/lib/env'

export function createClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
```

- [ ] **Step 3: Create `lib/supabase/server.ts`** — server client, call from server components and middleware

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { env } from '@/lib/env'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Called from Server Component — ignore
          }
        }
      }
    }
  )
}
```

- [ ] **Step 4: Commit Supabase clients**

```bash
git add -A
git commit -m "feat: add Supabase browser and server clients"
```

---

### Task 5: Middleware — session refresh + route protection

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Create `middleware.ts`**

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        }
      }
    }
  )

  // IMPORTANT: Do not write code between createServerClient and getUser()
  const { data: { user } } = await supabase.auth.getUser()

  const isLoginPage = request.nextUrl.pathname === '/login'

  if (!user && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|ico)$).*)']
}
```

- [ ] **Step 2: Commit middleware**

```bash
git add middleware.ts
git commit -m "feat: add Supabase SSR middleware for route protection"
```

---

### Task 6: Login page

**Files:**
- Create: `app/(auth)/login/page.tsx`
- Create: `app/(auth)/layout.tsx`

- [ ] **Step 1: Create `app/(auth)/layout.tsx`**

```tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A1628]">
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Create `app/(auth)/login/page.tsx`**

```tsx
'use client'

import { useForm } from '@tanstack/react-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const loginSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
})

export default function LoginPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { email: '', password: '' },
    onSubmit: async ({ value }) => {
      setServerError(null)
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: value.email,
        password: value.password
      })
      if (error) {
        setServerError('بيانات الدخول غير صحيحة')
        return
      }
      router.push('/')
      router.refresh()
    }
  })

  return (
    <Card className="w-full max-w-sm border-[rgba(201,168,76,0.3)] bg-[#0F1F3D]">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3">
          {/* Safwa logo SVG */}
          <svg width="48" height="48" viewBox="0 0 38 38" fill="none">
            <defs>
              <linearGradient id="sg" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
                <stop stopColor="#B8960C"/>
                <stop offset="1" stopColor="#E8C84A"/>
              </linearGradient>
            </defs>
            <line x1="19" y1="3" x2="19" y2="35" stroke="url(#sg)" strokeWidth="2" strokeLinecap="round"/>
            <line x1="19" y1="12" x2="9" y2="4" stroke="url(#sg)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="19" y1="18" x2="9" y2="10" stroke="url(#sg)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="19" y1="24" x2="9" y2="16" stroke="url(#sg)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="19" y1="12" x2="29" y2="4" stroke="url(#sg)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="19" y1="18" x2="29" y2="10" stroke="url(#sg)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="19" y1="24" x2="29" y2="16" stroke="url(#sg)" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="19" cy="2.5" r="2.5" fill="url(#sg)"/>
          </svg>
        </div>
        <CardTitle className="bg-gradient-to-r from-[#C9A84C] to-[#E8C84A] bg-clip-text text-2xl font-bold text-transparent">
          الصفوة
        </CardTitle>
        <p className="text-sm text-[#8A9BB5]">نظام إدارة الأعمال</p>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field name="email">
            {(field) => (
              <div className="space-y-1">
                <Label className="text-[#8A9BB5]">البريد الإلكتروني</Label>
                <Input
                  type="email"
                  dir="ltr"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="border-[rgba(138,155,181,0.15)] bg-[rgba(10,22,40,0.6)] text-[#E8EDF5]"
                />
                {field.state.meta.errors?.[0] && (
                  <p className="text-xs text-red-400">{String(field.state.meta.errors[0])}</p>
                )}
              </div>
            )}
          </form.Field>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-1">
                <Label className="text-[#8A9BB5]">كلمة المرور</Label>
                <Input
                  type="password"
                  dir="ltr"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="border-[rgba(138,155,181,0.15)] bg-[rgba(10,22,40,0.6)] text-[#E8EDF5]"
                />
                {field.state.meta.errors?.[0] && (
                  <p className="text-xs text-red-400">{String(field.state.meta.errors[0])}</p>
                )}
              </div>
            )}
          </form.Field>
          {serverError && (
            <p className="text-sm text-red-400">{serverError}</p>
          )}
          <form.Subscribe selector={(s) => s.isSubmitting}>
            {(isSubmitting) => (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#C9A84C] to-[#E8C84A] font-semibold text-[#0A1628] hover:opacity-90"
              >
                {isSubmitting ? 'جاري الدخول...' : 'دخول'}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 3: Verify login works manually** — run `bun dev` and navigate to `/login`

- [ ] **Step 4: Commit auth**

```bash
git add -A
git commit -m "feat: add login page with Supabase Auth and TanStack Form"
```

---

## Chunk 3: i18n + Providers + Root Layout

### Task 7: i18n setup

**Files:**
- Create: `lib/i18n/i18n-config.ts`, `lib/i18n/request.ts`, `lib/i18n/messages.ts`
- Create: `lib/i18n/ar/*.json`, `lib/i18n/en/*.json`
- Create: `lib/i18n/next-intl.d.ts`

- [ ] **Step 1: Create `lib/i18n/i18n-config.ts`**

```ts
export const locales = ['ar', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'ar'
```

- [ ] **Step 2: Copy `lib/i18n/request.ts`** from edge-admin-dashboard verbatim (handles cookie-based locale + getTimeZone)

Copy from `/home/d7om/Work/Edge/edge-admin-dashboard/lib/i18n/request.ts` — the full file with `getLocale()`, `getTimeZone()`, `getRequestConfig()`, cookie helpers.

Replace the import of `defaultLocale` to use local:
```ts
import { defaultLocale } from '@/lib/i18n/i18n-config'
```

- [ ] **Step 3: Create `lib/i18n/ar/common.json`**

```json
{
  "actions": {
    "save": "حفظ",
    "cancel": "إلغاء",
    "delete": "حذف",
    "edit": "تعديل",
    "add": "إضافة",
    "search": "بحث",
    "filter": "تصفية",
    "reset": "تفريغ",
    "close": "إغلاق",
    "confirm": "تأكيد",
    "print": "طباعة",
    "view": "عرض"
  },
  "status": {
    "paid": "مدفوعة",
    "partiallyPaid": "مدفوعة جزئياً",
    "pending": "معلقة",
    "cancelled": "ملغاة",
    "incoming": "وارد",
    "outgoing": "صادر",
    "adjustment": "تسوية",
    "damaged": "تالف"
  },
  "table": {
    "noData": "لا توجد بيانات",
    "loading": "جاري التحميل...",
    "rowsPerPage": "صفوف في الصفحة",
    "total": "الإجمالي"
  },
  "currency": "ج.م",
  "confirmDelete": "هل أنت متأكد من الحذف؟",
  "deleteWarning": "هذا الإجراء لا يمكن التراجع عنه."
}
```

- [ ] **Step 4: Create `lib/i18n/ar/auth.json`**

```json
{
  "login": {
    "title": "الصفوة",
    "subtitle": "نظام إدارة الأعمال",
    "email": "البريد الإلكتروني",
    "password": "كلمة المرور",
    "submit": "دخول",
    "submitting": "جاري الدخول...",
    "invalidCredentials": "بيانات الدخول غير صحيحة"
  },
  "logout": "تسجيل الخروج"
}
```

- [ ] **Step 5: Create `lib/i18n/ar/layout.json`**

```json
{
  "sidebar": {
    "sections": {
      "main": "الرئيسية",
      "sales": "المبيعات",
      "inventory": "المخزون",
      "clients": "العملاء"
    },
    "menu": {
      "dashboard": "لوحة التحكم",
      "invoices": "الفواتير",
      "newInvoice": "فاتورة جديدة",
      "products": "المنتجات",
      "inventoryMovements": "حركة المخزون",
      "customers": "العملاء"
    },
    "footer": "الصفوة لتجارة المنتجات الغذائية"
  },
  "header": {
    "toggleSidebar": "تبديل القائمة",
    "switchLanguage": "English",
    "userMenu": {
      "profile": "الملف الشخصي",
      "logout": "تسجيل الخروج"
    }
  }
}
```

- [ ] **Step 6: Create `lib/i18n/ar/dashboard.json`**

```json
{
  "title": "لوحة التحكم",
  "stats": {
    "revenue": "إجمالي المبيعات",
    "invoices": "إجمالي الفواتير",
    "products": "المنتجات",
    "lowStock": "مخزون منخفض"
  },
  "periods": {
    "today": "اليوم",
    "month": "هذا الشهر",
    "all": "الكل",
    "from": "من تاريخ",
    "to": "إلى تاريخ"
  },
  "recentInvoices": "آخر الفواتير",
  "lowStockAlert": "مخزون منخفض",
  "viewAll": "عرض الكل",
  "clickToView": "اضغط للعرض"
}
```

- [ ] **Step 7: Create `lib/i18n/ar/invoices.json`**

```json
{
  "title": "الفواتير",
  "newInvoice": "فاتورة جديدة",
  "invoiceNumber": "رقم الفاتورة",
  "customer": "العميل",
  "date": "التاريخ",
  "status": "الحالة",
  "total": "الإجمالي",
  "paidAmount": "المدفوع",
  "remaining": "المتبقي",
  "actions": "إجراءات",
  "searchPlaceholder": "بحث بالعميل أو رقم الفاتورة...",
  "allStatuses": "كل الحالات",
  "form": {
    "title": "إنشاء فاتورة جديدة",
    "customerSearch": "ابحث عن عميل...",
    "invoiceDate": "تاريخ الفاتورة",
    "status": "الحالة",
    "items": "بنود الفاتورة",
    "product": "المنتج",
    "qty": "الكمية",
    "unitPrice": "سعر الوحدة",
    "lineTotal": "الإجمالي",
    "addProduct": "إضافة منتج",
    "subtotal": "المجموع الفرعي",
    "tax": "ضريبة %",
    "grandTotal": "الإجمالي",
    "notes": "ملاحظات",
    "notesPlaceholder": "أي ملاحظات إضافية...",
    "save": "حفظ الفاتورة",
    "reset": "تفريغ",
    "selectProduct": "اضغط لاختيار منتج...",
    "unit": "وحدة",
    "piece": "قطعة",
    "piecesFrom": "من اصل {count} قطعة",
    "lockedItem": "لا يمكن تعديل هذا البند"
  },
  "view": {
    "title": "فاتورة رقم",
    "paymentHistory": "سجل الدفعات",
    "noPayments": "لا توجد دفعات",
    "method": "طريقة الدفع",
    "amount": "المبلغ",
    "note": "ملاحظة"
  },
  "payment": {
    "title": "تسجيل دفعة",
    "amount": "المبلغ",
    "method": "طريقة الدفع",
    "cash": "نقدي",
    "transfer": "تحويل",
    "check": "شيك",
    "note": "ملاحظة",
    "remaining": "المتبقي",
    "save": "تسجيل الدفعة"
  },
  "deleteConfirm": "هل تريد حذف هذه الفاتورة؟"
}
```

- [ ] **Step 8: Create `lib/i18n/ar/products.json`**

```json
{
  "title": "المنتجات",
  "newProduct": "منتج جديد",
  "name": "اسم المنتج",
  "sku": "كود المنتج",
  "category": "الفئة",
  "unit": "وحدة القياس",
  "price": "سعر الوحدة",
  "cost": "سعر التكلفة",
  "qty": "الكمية",
  "minQty": "الحد الأدنى",
  "maxQty": "الحد الأقصى",
  "piecesPerUnit": "عدد القطع في الوحدة",
  "piecePrice": "سعر القطعة",
  "searchPlaceholder": "بحث في المنتجات...",
  "allCategories": "كل الفئات",
  "manageCategories": "إدارة الفئات",
  "units": {
    "carton": "كرتون",
    "piece": "قطعة",
    "kg": "كيلو",
    "liter": "لتر",
    "gallon": "جالون",
    "ton": "طن",
    "item": "حبة"
  },
  "splitSettings": "اعدادات التقسيم (للمنتجات القابلة للتجزئة)",
  "piecesHelp": "يحسب تلقائيا",
  "stockLevel": {
    "low": "مخزون منخفض",
    "out": "نفذ المخزون"
  },
  "deleteConfirm": "هل تريد حذف هذا المنتج؟"
}
```

- [ ] **Step 9: Create `lib/i18n/ar/inventory.json`**

```json
{
  "title": "حركة المخزون",
  "newMovement": "حركة جديدة",
  "product": "المنتج",
  "type": "نوع الحركة",
  "qty": "الكمية",
  "note": "ملاحظة",
  "date": "التاريخ",
  "types": {
    "incoming": "وارد (استلام)",
    "outgoing": "صادر (شحن)",
    "adjustment": "تسوية مخزون",
    "damaged": "تالف / مرتجع"
  }
}
```

- [ ] **Step 10: Create `lib/i18n/ar/customers.json`**

```json
{
  "title": "العملاء",
  "newCustomer": "عميل جديد",
  "name": "اسم العميل",
  "phone": "رقم الهاتف",
  "address": "العنوان",
  "taxNumber": "الرقم الضريبي",
  "notes": "ملاحظات",
  "balance": "الرصيد",
  "searchPlaceholder": "بحث في العملاء...",
  "phonePlaceholder": "01xxxxxxxxx",
  "addressPlaceholder": "المحافظة، المنطقة",
  "taxPlaceholder": "اختياري",
  "deleteConfirm": "هل تريد حذف هذا العميل؟"
}
```

- [ ] **Step 11: Create English translation files** — `lib/i18n/en/` with same structure

```json
// common.json
{
  "actions": {
    "save": "Save", "cancel": "Cancel", "delete": "Delete", "edit": "Edit",
    "add": "Add", "search": "Search", "filter": "Filter", "reset": "Reset",
    "close": "Close", "confirm": "Confirm", "print": "Print", "view": "View"
  },
  "status": {
    "paid": "Paid", "partiallyPaid": "Partially Paid", "pending": "Pending",
    "cancelled": "Cancelled", "incoming": "Incoming", "outgoing": "Outgoing",
    "adjustment": "Adjustment", "damaged": "Damaged"
  },
  "table": { "noData": "No data", "loading": "Loading...", "rowsPerPage": "Rows per page", "total": "Total" },
  "currency": "EGP",
  "confirmDelete": "Are you sure you want to delete?",
  "deleteWarning": "This action cannot be undone."
}
```

Create `lib/i18n/en/auth.json`, `layout.json`, `dashboard.json`, `invoices.json`, `products.json`, `inventory.json`, `customers.json` with English translations mirroring the Arabic files.

- [ ] **Step 12: Create `lib/i18n/messages.ts`**

```ts
import type { Locale } from './i18n-config'

const loadMessages = async (locale: Locale) => {
  const [common, auth, layout, dashboard, invoices, products, inventory, customers] =
    await Promise.all([
      import(`./${locale}/common.json`),
      import(`./${locale}/auth.json`),
      import(`./${locale}/layout.json`),
      import(`./${locale}/dashboard.json`),
      import(`./${locale}/invoices.json`),
      import(`./${locale}/products.json`),
      import(`./${locale}/inventory.json`),
      import(`./${locale}/customers.json`)
    ])
  return { common, auth, layout, dashboard, invoices, products, inventory, customers }
}

export const messages: Record<Locale, () => Promise<Record<string, unknown>>> = {
  ar: () => loadMessages('ar'),
  en: () => loadMessages('en')
}
```

Note: `request.ts` calls `messages[locale]` — update `getRequestConfig` to await the messages:
```ts
export default getRequestConfig(async () => {
  const locale = await getLocale()
  const msgs = await messages[locale as Locale]()
  return { locale, messages: msgs as RequestConfig['messages'] }
})
```

- [ ] **Step 13: Create `lib/i18n/next-intl.d.ts`** for type-safe translations

```ts
import ar from './ar/common.json'
import arAuth from './ar/auth.json'
import arLayout from './ar/layout.json'
import arDashboard from './ar/dashboard.json'
import arInvoices from './ar/invoices.json'
import arProducts from './ar/products.json'
import arInventory from './ar/inventory.json'
import arCustomers from './ar/customers.json'

type Messages = {
  common: typeof ar
  auth: typeof arAuth
  layout: typeof arLayout
  dashboard: typeof arDashboard
  invoices: typeof arInvoices
  products: typeof arProducts
  inventory: typeof arInventory
  customers: typeof arCustomers
}

declare global {
  interface IntlMessages extends Messages {}
  // Translations helper type used in sidebar-config
  type Translations<T extends string> = (key: T extends `${infer NS}.${infer Key}` ? Key : T) => string
}
```

- [ ] **Step 14: Commit i18n**

```bash
git add -A
git commit -m "feat: add next-intl i18n with ar/en translations"
```

---

### Task 8: Providers and root layout

**Files:**
- Create: `lib/providers/query-client.tsx`, `lib/providers/theme-provider.tsx`, `lib/providers/sonner-provider.tsx`, `lib/providers/providers-root.tsx`
- Create: `app/globals.css`, `app/layout.tsx`, `app/page.tsx`
- Create: `app/not-found.tsx`, `app/global-error.tsx`

- [ ] **Step 1: Copy provider files from template** verbatim:
  - `lib/providers/query-client.tsx` (HydrationBoundary + QueryClientProvider)
  - `lib/providers/theme-provider.tsx` (next-themes ThemeProvider)
  - `lib/providers/sonner-provider.tsx` (Sonner Toaster)

- [ ] **Step 2: Create `lib/providers/providers-root.tsx`**

```tsx
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { QueryClientProvider } from './query-client'
import { ThemeProvider } from './theme-provider'
import { Toaster } from './sonner-provider'
import { TooltipProvider } from '@/components/ui/tooltip'

export const RootProviders = ({ children }: { children: React.ReactNode }) => (
  <NuqsAdapter>
    <QueryClientProvider>
      <ThemeProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
    <Toaster />
  </NuqsAdapter>
)
```

- [ ] **Step 3: Create `app/globals.css`** — navy/gold theme mapped to CSS variables

```css
@import "tailwindcss";

:root {
  --background: 214 100% 9%; /* #0A1628 navy */
  --foreground: 220 30% 93%; /* #E8EDF5 */
  --card: 220 59% 15%; /* #0F1F3D navy2 */
  --card-foreground: 220 30% 93%;
  --popover: 220 59% 15%;
  --popover-foreground: 220 30% 93%;
  --primary: 42 57% 54%; /* #C9A84C gold */
  --primary-foreground: 214 100% 9%;
  --secondary: 220 50% 17%;
  --secondary-foreground: 220 20% 70%;
  --muted: 220 50% 17%;
  --muted-foreground: 215 20% 55%; /* #8A9BB5 */
  --accent: 220 50% 20%;
  --accent-foreground: 220 30% 93%;
  --destructive: 0 75% 56%; /* #E74C3C */
  --destructive-foreground: 0 0% 100%;
  --border: 215 20% 38% / 15%; /* rgba(138,155,181,0.15) */
  --input: 220 50% 17%;
  --ring: 42 57% 54%;
  --radius: 0.5rem;
  --sidebar-width: 240px;
  --header-height: 60px;
}

@font-face {
  /* Tajawal loaded via next/font in layout */
}

* { box-sizing: border-box; }
body { font-family: 'Tajawal', sans-serif; }
```

- [ ] **Step 4: Create `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Tajawal, Noto_Naskh_Arabic } from 'next/font/google'
import { getLocale } from '@/lib/i18n/request'
import { RootProviders } from '@/lib/providers/providers-root'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import './globals.css'

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-tajawal'
})

const notoNaskh = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-naskh'
})

export const metadata: Metadata = {
  title: 'الصفوة - نظام الإدارة',
  description: 'نظام إدارة الأعمال للصفوة لتجارة المنتجات الغذائية'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${tajawal.variable} ${notoNaskh.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <RootProviders>{children}</RootProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Create `app/page.tsx`**

```tsx
import { redirect } from 'next/navigation'
export default function RootPage() {
  redirect('/')
}
```

Note: The root `/` route will be the dashboard page under `(dashboard)`.
Actually, since route groups are transparent, `app/(dashboard)/page.tsx` handles `/`.

- [ ] **Step 6: Create `app/not-found.tsx`**

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-muted-foreground">الصفحة غير موجودة</p>
      <Button asChild><Link href="/">العودة للرئيسية</Link></Button>
    </div>
  )
}
```

- [ ] **Step 7: Create `app/global-error.tsx`**

```tsx
'use client'
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html><body>
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold">حدث خطأ غير متوقع</h2>
        <button onClick={reset} className="rounded bg-yellow-600 px-4 py-2 text-white">إعادة المحاولة</button>
      </div>
    </body></html>
  )
}
```

- [ ] **Step 8: Commit providers and layout**

```bash
git add -A
git commit -m "feat: add providers, root layout with next-intl and Tajawal font"
```

---

## Chunk 4: Dashboard Layout Shell

### Task 9: Query client setup

**Files:**
- Create: `query-client/get-query-client.ts`, `query-client/index.ts`

- [ ] **Step 1: Copy `query-client/get-query-client.ts`** from template verbatim

Copy from `/home/d7om/Projects/create-d7om-dashboard/template/query-client/get-query-client.ts` — the MutationCache with auto-toast on success/error is exactly what we need.

Note on MutationCache error handler — it references `error.response?.data.message`. For Supabase errors, replace with:
```ts
toast.error(error.message || 'حدث خطأ')
```

- [ ] **Step 2: Create `query-client/index.ts`**

```ts
export { getQueryClient } from './get-query-client'
```

- [ ] **Step 3: Commit query client**

```bash
git add -A
git commit -m "feat: add TanStack Query client with MutationCache auto-toast"
```

---

### Task 10: Dashboard layout shell

**Files:**
- Create: `app/(dashboard)/layout.tsx`, `app/(dashboard)/error.tsx`
- Create: `app/(dashboard)/_layout/sidebar-config.ts`
- Create: `app/(dashboard)/_layout/components/dashboard-layout-wrapper.tsx`
- Create: `app/(dashboard)/_layout/components/sidebar.tsx`
- Create: `app/(dashboard)/_layout/components/sidebar-content.tsx`
- Create: `app/(dashboard)/_layout/components/sidebar-footer.tsx`
- Create: `app/(dashboard)/_layout/components/header.tsx`
- Create: `app/(dashboard)/_layout/components/header-toolbar.tsx`
- Create: `app/(dashboard)/_layout/components/user-dropdown.tsx`

- [ ] **Step 1: Create `app/(dashboard)/_layout/sidebar-config.ts`**

```ts
import {
  LayoutDashboardIcon,
  FileTextIcon,
  PlusCircleIcon,
  PackageIcon,
  ArrowRightLeftIcon,
  UsersIcon
} from 'lucide-react'
import type { MenuConfig } from '@/types/sidebar'

export const createMenuConfig = (t: (key: string) => string): MenuConfig => [
  {
    title: t('sections.main'),
    separator: true
  },
  {
    icon: LayoutDashboardIcon,
    path: '/',
    title: t('menu.dashboard')
  },
  {
    title: t('sections.sales'),
    separator: true
  },
  {
    icon: FileTextIcon,
    path: '/invoices',
    title: t('menu.invoices')
  },
  {
    icon: PlusCircleIcon,
    path: '/invoices/new',
    title: t('menu.newInvoice')
  },
  {
    title: t('sections.inventory'),
    separator: true
  },
  {
    icon: PackageIcon,
    path: '/products',
    title: t('menu.products')
  },
  {
    icon: ArrowRightLeftIcon,
    path: '/inventory',
    title: t('menu.inventoryMovements')
  },
  {
    title: t('sections.clients'),
    separator: true
  },
  {
    icon: UsersIcon,
    path: '/customers',
    title: t('menu.customers')
  }
]
```

- [ ] **Step 2: Create `app/(dashboard)/_layout/components/sidebar-content.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/utils/cn'
import { createMenuConfig } from '../sidebar-config'

export function SidebarContent() {
  const pathname = usePathname()
  const t = useTranslations('layout.sidebar')
  const menu = createMenuConfig(t)

  return (
    <nav className="flex-1 overflow-y-auto py-4">
      {menu.map((item, i) => {
        if (item.separator) {
          return (
            <div key={i} className="px-4 pt-4 pb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
              {item.title}
            </div>
          )
        }
        const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path!)
        const Icon = item.icon
        return (
          <Link
            key={item.path}
            href={item.path!}
            className={cn(
              'flex items-center gap-2.5 border-e-[3px] border-transparent px-5 py-2.5 text-sm text-muted-foreground transition-all hover:bg-primary/5 hover:text-foreground',
              isActive && 'border-primary bg-primary/10 text-primary'
            )}
          >
            {Icon && <Icon className="size-[18px] shrink-0" />}
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}
```

- [ ] **Step 3: Create `app/(dashboard)/_layout/components/sidebar-footer.tsx`**

```tsx
import { useTranslations } from 'next-intl'

export function SidebarFooter() {
  const t = useTranslations('layout.sidebar')
  return (
    <div className="border-t border-border px-5 py-4 text-center text-[10px] text-muted-foreground">
      {t('footer')}
    </div>
  )
}
```

- [ ] **Step 4: Create sidebar logo component inline in `app/(dashboard)/_layout/components/sidebar.tsx`**

```tsx
'use client'

import { SidebarContent } from './sidebar-content'
import { SidebarFooter } from './sidebar-footer'
import { cn } from '@/utils/cn'

export function Sidebar({ className }: { className?: string }) {
  return (
    <aside className={cn(
      'fixed end-0 top-[var(--header-height)] bottom-0 z-40 flex w-[var(--sidebar-width)] shrink-0 flex-col border-s border-border bg-card transition-all duration-300',
      className
    )}>
      <SidebarContent />
      <SidebarFooter />
    </aside>
  )
}
```

- [ ] **Step 5: Create `app/(dashboard)/_layout/components/user-dropdown.tsx`**

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { LogOutIcon, UserIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export function UserDropdown() {
  const router = useRouter()
  const t = useTranslations('layout.header')

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 rounded-full border border-border">
          <UserIcon className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
          <LogOutIcon className="me-2 size-4" />
          {t('userMenu.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

- [ ] **Step 6: Create `app/(dashboard)/_layout/components/header-toolbar.tsx`**

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { UserDropdown } from './user-dropdown'

export function HeaderToolbar() {
  const t = useTranslations('layout.header')

  const switchLocale = (locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`
    window.location.reload()
  }

  return (
    <nav className="flex items-center gap-2">
      <button
        onClick={() => switchLocale(document.cookie.includes('NEXT_LOCALE=en') ? 'ar' : 'en')}
        className="rounded border border-border px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/30 hover:text-primary"
      >
        {t('switchLanguage')}
      </button>
      <UserDropdown />
    </nav>
  )
}
```

- [ ] **Step 7: Create `app/(dashboard)/_layout/components/header.tsx`**

```tsx
import { useTranslations } from 'next-intl'
import { HeaderToolbar } from './header-toolbar'

// Safe import for server — note: HeaderToolbar is client component
export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-[var(--header-height)] items-center justify-between border-b border-border bg-card px-6 pe-[calc(var(--sidebar-width)+1.5rem)]">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <svg width="28" height="28" viewBox="0 0 38 38" fill="none">
          <defs>
            <linearGradient id="hg" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#B8960C"/>
              <stop offset="1" stopColor="#E8C84A"/>
            </linearGradient>
          </defs>
          <line x1="19" y1="3" x2="19" y2="35" stroke="url(#hg)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="19" y1="12" x2="9" y2="4" stroke="url(#hg)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="19" y1="18" x2="9" y2="10" stroke="url(#hg)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="19" y1="24" x2="9" y2="16" stroke="url(#hg)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="19" y1="12" x2="29" y2="4" stroke="url(#hg)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="19" y1="18" x2="29" y2="10" stroke="url(#hg)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="19" y1="24" x2="29" y2="16" stroke="url(#hg)" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="19" cy="2.5" r="2.5" fill="url(#hg)"/>
        </svg>
        <span className="bg-gradient-to-r from-[#C9A84C] to-[#E8C84A] bg-clip-text font-bold text-transparent">
          الصفوة
        </span>
      </div>
      <HeaderToolbar />
    </header>
  )
}
```

- [ ] **Step 8: Create `app/(dashboard)/_layout/components/dashboard-layout-wrapper.tsx`**

```tsx
'use client'

import { Header } from './header'
import { Sidebar } from './sidebar'

export function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex min-h-screen pt-[var(--header-height)]">
        <Sidebar className="hidden md:flex" />
        <main className="flex-1 overflow-auto pe-0 transition-all duration-300 md:pe-[var(--sidebar-width)]">
          {children}
        </main>
      </div>
    </>
  )
}
```

- [ ] **Step 9: Create `app/(dashboard)/layout.tsx`**

```tsx
import { DashboardLayoutWrapper } from './_layout/components/dashboard-layout-wrapper'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>
}
```

- [ ] **Step 10: Create `app/(dashboard)/error.tsx`**

```tsx
'use client'

export default function DashboardError({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold text-foreground">حدث خطأ</h2>
      <button onClick={reset} className="rounded bg-primary px-4 py-2 text-primary-foreground text-sm">
        إعادة المحاولة
      </button>
    </div>
  )
}
```

- [ ] **Step 11: Verify shell renders** — `bun dev`, navigate to `/` (redirects to login, then back to `/` shows empty dashboard layout)

- [ ] **Step 12: Commit layout shell**

```bash
git add -A
git commit -m "feat: add dashboard layout with sidebar, header, user dropdown"
```

---

## Chunk 5: Query Layer

### Task 11: Supabase query helpers and domain types/queries

**Files per domain:** `query/{domain}/{domain}-types.ts`, `{domain}-query.ts`, `{domain}-mutations.ts`, `index.ts`

- [ ] **Step 1: Create `query/products/products-types.ts`**

```ts
export interface Product {
  id: string
  name: string
  sku: string | null
  category: string | null
  unit: string
  price: number
  cost: number | null
  pieces_per_unit: number | null
  piece_price: number | null
  qty: number
  min_qty: number | null
  max_qty: number | null
  created_at: string
}

export interface ProductsListParams {
  page?: number
  per_page?: number
  search?: string
  category?: string
}

export type CreateProductPayload = Omit<Product, 'id' | 'created_at'>
export type UpdateProductPayload = Partial<CreateProductPayload>
```

- [ ] **Step 2: Create `query/products/products-query.ts`**

```ts
import { queryOptions } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Product, ProductsListParams } from './products-types'

export const getAllProductsQuery = (params?: Record<string, unknown>) =>
  queryOptions<PaginatedResponse<Product[]>>({
    queryKey: ['products', params],
    queryFn: async () => {
      const supabase = createClient()
      const page = Number(params?.page ?? 1)
      const perPage = Number(params?.per_page ?? 15)
      const from = (page - 1) * perPage
      const to = from + perPage - 1

      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .order('name')

      if (params?.search) query = query.ilike('name', `%${params.search}%`)
      if (params?.category) query = query.eq('category', params.category as string)

      const { data, count, error } = await query.range(from, to)
      if (error) throw error

      const total = count ?? 0
      return {
        data: data ?? [],
        pagination: {
          current_page: page,
          from,
          last_page: Math.ceil(total / perPage) || 1,
          per_page: perPage,
          to: Math.min(to, total - 1),
          total
        }
      }
    }
  })

export const getAllProductsSimpleQuery = () =>
  queryOptions<Product[]>({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name')
      if (error) throw error
      return data ?? []
    },
    staleTime: 2 * 60 * 1000
  })
```

- [ ] **Step 3: Create `query/products/products-mutations.ts`**

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { CreateProductPayload, UpdateProductPayload } from './products-types'

export function useCreateProduct() {
  return useMutation({
    mutationFn: async (payload: CreateProductPayload) => {
      const supabase = createClient()
      const { error } = await supabase.from('products').insert(payload)
      if (error) throw error
    },
    meta: {
      successMessage: 'تم إضافة المنتج بنجاح',
      invalidatesQuery: [['products']]
    }
  })
}

export function useUpdateProduct() {
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateProductPayload }) => {
      const supabase = createClient()
      const { error } = await supabase.from('products').update(payload).eq('id', id)
      if (error) throw error
    },
    meta: {
      successMessage: 'تم تحديث المنتج بنجاح',
      invalidatesQuery: [['products']]
    }
  })
}

export function useDeleteProduct() {
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
    },
    meta: {
      successMessage: 'تم حذف المنتج',
      invalidatesQuery: [['products']]
    }
  })
}
```

- [ ] **Step 4: Create `query/products/index.ts`**

```ts
export * from './products-types'
export * from './products-query'
export * from './products-mutations'
```

- [ ] **Step 5: Create `query/customers/customers-types.ts`**

```ts
export interface Customer {
  id: string
  name: string
  phone: string | null
  address: string | null
  tax_number: string | null
  notes: string | null
  created_at: string
}

export type CreateCustomerPayload = Omit<Customer, 'id' | 'created_at'>
export type UpdateCustomerPayload = Partial<CreateCustomerPayload>
```

- [ ] **Step 6: Create `query/customers/customers-query.ts`**

Same pattern as `products-query.ts` — paginated list query + simple all-customers query:

```ts
import { queryOptions } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Customer } from './customers-types'

export const getAllCustomersQuery = (params?: Record<string, unknown>) =>
  queryOptions<PaginatedResponse<Customer[]>>({
    queryKey: ['customers', params],
    queryFn: async () => {
      const supabase = createClient()
      const page = Number(params?.page ?? 1)
      const perPage = Number(params?.per_page ?? 15)
      const from = (page - 1) * perPage
      const to = from + perPage - 1

      let query = supabase.from('customers').select('*', { count: 'exact' }).order('name')
      if (params?.search) query = query.ilike('name', `%${params.search}%`)

      const { data, count, error } = await query.range(from, to)
      if (error) throw error

      const total = count ?? 0
      return {
        data: data ?? [],
        pagination: {
          current_page: page, from,
          last_page: Math.ceil(total / perPage) || 1,
          per_page: perPage, to: Math.min(to, total - 1), total
        }
      }
    }
  })

export const getAllCustomersSimpleQuery = () =>
  queryOptions<Customer[]>({
    queryKey: ['customers', 'all'],
    queryFn: async () => {
      const { data, error } = await createClient().from('customers').select('*').order('name')
      if (error) throw error
      return data ?? []
    },
    staleTime: 2 * 60 * 1000
  })
```

- [ ] **Step 7: Create `query/customers/customers-mutations.ts`** — same pattern as products, messages in Arabic

- [ ] **Step 8: Create `query/customers/index.ts`** — barrel export

- [ ] **Step 9: Create `query/inventory/inventory-types.ts`**

```ts
export type MovementType = 'وارد' | 'صادر' | 'تسوية' | 'تالف'

export interface InventoryMovement {
  id: string
  product_id: string | null
  product_name: string
  type: MovementType
  qty: number
  note: string | null
  created_at: string
}

export type CreateMovementPayload = Omit<InventoryMovement, 'id' | 'created_at'>
```

- [ ] **Step 10: Create `query/inventory/inventory-query.ts`** — paginated list, same pattern

- [ ] **Step 11: Create `query/inventory/inventory-mutations.ts`**

```ts
// useCreateMovement: inserts movement + updates product qty
export function useCreateMovement() {
  return useMutation({
    mutationFn: async (payload: CreateMovementPayload) => {
      const supabase = createClient()
      const { error: movErr } = await supabase.from('inventory_movements').insert(payload)
      if (movErr) throw movErr

      if (payload.product_id) {
        const { data: product } = await supabase
          .from('products').select('qty').eq('id', payload.product_id).single()
        if (product) {
          const delta = payload.type === 'وارد' ? payload.qty
            : payload.type === 'تسوية' ? payload.qty - (product.qty ?? 0)
            : -payload.qty
          await supabase.from('products')
            .update({ qty: (product.qty ?? 0) + delta })
            .eq('id', payload.product_id)
        }
      }
    },
    meta: {
      successMessage: 'تم تسجيل الحركة بنجاح',
      invalidatesQuery: [['inventory'], ['products']]
    }
  })
}
```

- [ ] **Step 12: Create `query/invoices/invoices-types.ts`**

```ts
export interface InvoiceLineItem {
  product_id: string
  product_name: string
  qty: number
  price: number
  total: number
  sell_by: 'unit' | 'piece'
  pieces_per_unit: number
}

export type InvoiceStatus = 'مدفوعة' | 'مدفوعة جزئياً' | 'معلقة' | 'ملغاة'

export interface Invoice {
  id: string
  invoice_number: string
  customer_id: string | null
  customer_name: string
  invoice_date: string
  status: InvoiceStatus
  subtotal: number
  tax_percent: number
  tax_amount: number
  total: number
  paid_amount: number
  notes: string | null
  items: InvoiceLineItem[]
  created_at: string
}

export interface CreateInvoicePayload {
  invoice_number: string
  customer_id?: string | null
  customer_name: string
  invoice_date: string
  status: InvoiceStatus
  subtotal: number
  tax_percent: number
  tax_amount: number
  total: number
  paid_amount: number
  notes?: string
  items: string // JSON.stringify(items)
}
```

- [ ] **Step 13: Create `query/invoices/invoices-query.ts`**

```ts
import { queryOptions } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Invoice } from './invoices-types'

export const getAllInvoicesQuery = (params?: Record<string, unknown>) =>
  queryOptions<PaginatedResponse<Invoice[]>>({
    queryKey: ['invoices', params],
    queryFn: async () => {
      const supabase = createClient()
      const page = Number(params?.page ?? 1)
      const perPage = Number(params?.per_page ?? 15)
      const from = (page - 1) * perPage
      const to = from + perPage - 1

      let query = supabase
        .from('invoices')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (params?.search) {
        query = query.or(
          `customer_name.ilike.%${params.search}%,invoice_number.ilike.%${params.search}%`
        )
      }
      if (params?.status) query = query.eq('status', params.status as string)

      const { data, count, error } = await query.range(from, to)
      if (error) throw error

      // Parse items JSON for each invoice
      const parsed = (data ?? []).map(inv => ({
        ...inv,
        items: typeof inv.items === 'string' ? JSON.parse(inv.items) : (inv.items ?? [])
      })) as Invoice[]

      const total = count ?? 0
      return {
        data: parsed,
        pagination: {
          current_page: page, from,
          last_page: Math.ceil(total / perPage) || 1,
          per_page: perPage, to: Math.min(to, total - 1), total
        }
      }
    }
  })
```

- [ ] **Step 14: Create `query/invoices/invoices-mutations.ts`**

```ts
export function useCreateInvoice() {
  return useMutation({
    mutationFn: async (payload: CreateInvoicePayload) => {
      const supabase = createClient()
      const { error } = await supabase.from('invoices').insert(payload)
      if (error) throw error
    },
    meta: {
      successMessage: 'تم حفظ الفاتورة بنجاح',
      invalidatesQuery: [['invoices']]
    }
  })
}

export function useUpdateInvoice() {
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateInvoicePayload> }) => {
      const { error } = await createClient().from('invoices').update(payload).eq('id', id)
      if (error) throw error
    },
    meta: {
      successMessage: 'تم تحديث الفاتورة',
      invalidatesQuery: [['invoices']]
    }
  })
}

export function useDeleteInvoice() {
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await createClient().from('invoices').delete().eq('id', id)
      if (error) throw error
    },
    meta: {
      successMessage: 'تم حذف الفاتورة',
      invalidatesQuery: [['invoices']]
    }
  })
}
```

- [ ] **Step 15: Create `query/payments/payments-types.ts`**

```ts
export interface Payment {
  id: string
  invoice_id: string
  customer_id: string | null
  customer_name: string
  amount: number
  method: string
  note: string | null
  created_at: string
}

export type CreatePaymentPayload = Omit<Payment, 'id' | 'created_at'>
```

- [ ] **Step 16: Create `query/payments/payments-query.ts`** — query payments by invoice_id

```ts
export const getPaymentsByInvoiceQuery = (invoiceId: string) =>
  queryOptions<Payment[]>({
    queryKey: ['payments', invoiceId],
    queryFn: async () => {
      const { data, error } = await createClient()
        .from('payments')
        .select('*')
        .eq('invoice_id', invoiceId)
        .order('created_at')
      if (error) throw error
      return data ?? []
    },
    enabled: !!invoiceId
  })
```

- [ ] **Step 17: Create `query/payments/payments-mutations.ts`** — `useRecordPayment` that inserts payment + updates invoice paid_amount and status

```ts
export function useRecordPayment() {
  return useMutation({
    mutationFn: async (payload: CreatePaymentPayload) => {
      const supabase = createClient()
      const { error: payErr } = await supabase.from('payments').insert(payload)
      if (payErr) throw payErr

      // Fetch current invoice to update paid_amount and status
      const { data: inv } = await supabase
        .from('invoices')
        .select('total, paid_amount')
        .eq('id', payload.invoice_id)
        .single()

      if (inv) {
        const newPaid = (inv.paid_amount ?? 0) + payload.amount
        const newStatus = newPaid >= inv.total ? 'مدفوعة' : 'مدفوعة جزئياً'
        await supabase.from('invoices')
          .update({ paid_amount: newPaid, status: newStatus })
          .eq('id', payload.invoice_id)
      }
    },
    meta: {
      successMessage: 'تم تسجيل الدفعة بنجاح',
      invalidatesQuery: [['invoices'], ['payments']]
    }
  })
}
```

- [ ] **Step 18: Create barrel index files** for all query domains

- [ ] **Step 19: Commit query layer**

```bash
git add -A
git commit -m "feat: add complete query layer with Supabase for all 5 domains"
```

---

## Chunk 6: Domain Pages

### Task 12: Dashboard overview page

**Files:**
- Create: `app/(dashboard)/page.tsx`
- Create: `app/(dashboard)/_components/stat-card.tsx`
- Create: `app/(dashboard)/_components/dashboard-stats.tsx`
- Create: `app/(dashboard)/_components/recent-invoices.tsx`
- Create: `app/(dashboard)/_components/low-stock-list.tsx`

- [ ] **Step 1: Create `app/(dashboard)/_components/stat-card.tsx`**

```tsx
import { cn } from '@/utils/cn'

interface StatCardProps {
  label: string
  value: string | number
  icon: string
  variant?: 'gold' | 'green' | 'blue' | 'red'
  onClick?: () => void
}

const variantClasses = {
  gold: 'text-[#C9A84C]',
  green: 'text-[#2ECC71]',
  blue: 'text-[#3498DB]',
  red: 'text-[#E74C3C]'
}

export function StatCard({ label, value, icon, variant = 'gold', onClick }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30',
        onClick && 'cursor-pointer'
      )}
    >
      <div className="text-3xl mb-2.5">{icon}</div>
      <div className={cn('text-2xl font-bold mb-1', variantClasses[variant])}>{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}
```

- [ ] **Step 2: Create `app/(dashboard)/_components/dashboard-stats.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import { StatCard } from './stat-card'
import { fmtNum } from '@/utils/formatters'
import { queryOptions } from '@tanstack/react-query'

type Period = 'day' | 'month' | 'all' | 'custom'

const dashboardStatsQuery = (period: Period, from?: string, to?: string) =>
  queryOptions({
    queryKey: ['dashboard', 'stats', period, from, to],
    queryFn: async () => {
      const supabase = createClient()
      const now = new Date()

      let invoicesQuery = supabase.from('invoices').select('total, status, customer_name')
      if (period === 'day') {
        const today = now.toISOString().split('T')[0]
        invoicesQuery = invoicesQuery.gte('invoice_date', today)
      } else if (period === 'month') {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
        invoicesQuery = invoicesQuery.gte('invoice_date', monthStart)
      } else if (period === 'custom' && from && to) {
        invoicesQuery = invoicesQuery.gte('invoice_date', from).lte('invoice_date', to)
      }

      const [invoicesRes, productsRes] = await Promise.all([
        invoicesQuery,
        supabase.from('products').select('id, qty, min_qty')
      ])

      const invoices = invoicesRes.data ?? []
      const products = productsRes.data ?? []

      const revenue = invoices.reduce((s, i) => s + (i.total ?? 0), 0)
      const lowStock = products.filter(p => (p.qty ?? 0) <= (p.min_qty ?? 10)).length

      return {
        revenue,
        invoiceCount: invoices.length,
        productCount: products.length,
        lowStock
      }
    }
  })

export function DashboardStats() {
  const t = useTranslations('dashboard')
  const [period, setPeriod] = useState<Period>('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const { data, isLoading } = useQuery(dashboardStatsQuery(period, fromDate, toDate))

  const stats = data ?? { revenue: 0, invoiceCount: 0, productCount: 0, lowStock: 0 }

  return (
    <div className="rounded-xl border border-border bg-card p-5 mb-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="font-semibold text-foreground">💰 {t('stats.revenue')}</h2>
        <div className="flex flex-wrap items-center gap-2">
          {(['day', 'month', 'all'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-md border px-3 py-1 text-xs transition ${period === p ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/30'}`}
            >
              {t(`periods.${p}`)}
            </button>
          ))}
          <span className="text-xs text-muted-foreground">{t('periods.from')}</span>
          <input type="date" value={fromDate} onChange={e => { setFromDate(e.target.value); setPeriod('custom') }}
            className="rounded border border-border bg-input px-2 py-1 text-xs text-foreground" />
          <span className="text-xs text-muted-foreground">{t('periods.to')}</span>
          <input type="date" value={toDate} onChange={e => { setToDate(e.target.value); setPeriod('custom') }}
            className="rounded border border-border bg-input px-2 py-1 text-xs text-foreground" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label={`${t('stats.revenue')} (ج.م)`} value={isLoading ? '...' : fmtNum(stats.revenue)} icon="💰" variant="gold" />
        <StatCard label={t('stats.invoices')} value={isLoading ? '...' : stats.invoiceCount} icon="🧾" variant="green" />
        <StatCard label={t('stats.products')} value={isLoading ? '...' : stats.productCount} icon="📦" variant="blue" />
        <StatCard label={t('stats.lowStock')} value={isLoading ? '...' : stats.lowStock} icon="⚠️" variant="red" />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `app/(dashboard)/_components/recent-invoices.tsx`**

```tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { getAllInvoicesQuery } from '@/query/invoices'
import { fmtCurrency, fmtDate } from '@/utils/formatters'
import { InvoiceStatusBadge } from '../invoices/_components/invoice-status-badge'

export function RecentInvoices() {
  const t = useTranslations('dashboard')
  const { data, isLoading } = useQuery(getAllInvoicesQuery({ per_page: 6 }))
  const invoices = data?.data ?? []

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 font-semibold text-foreground">🧾 {t('recentInvoices')}</h3>
      {isLoading ? (
        <div className="flex items-center justify-center py-10 text-muted-foreground text-sm">جاري التحميل...</div>
      ) : invoices.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground text-sm">لا توجد فواتير</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primary/30">
                <th className="py-2 text-right text-xs font-semibold uppercase tracking-wider text-primary">العميل</th>
                <th className="py-2 text-right text-xs font-semibold uppercase tracking-wider text-primary">المبلغ</th>
                <th className="py-2 text-right text-xs font-semibold uppercase tracking-wider text-primary">الحالة</th>
                <th className="py-2 text-right text-xs font-semibold uppercase tracking-wider text-primary">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="border-b border-border/50 hover:bg-primary/5">
                  <td className="py-3">{inv.customer_name}</td>
                  <td className="py-3">{fmtCurrency(inv.total)}</td>
                  <td className="py-3"><InvoiceStatusBadge status={inv.status} /></td>
                  <td className="py-3 text-muted-foreground">{fmtDate(inv.invoice_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create `app/(dashboard)/_components/low-stock-list.tsx`** — similar pattern, queries products where qty <= min_qty

- [ ] **Step 5: Create `app/(dashboard)/page.tsx`**

```tsx
import { DashboardStats } from './_components/dashboard-stats'
import { RecentInvoices } from './_components/recent-invoices'
import { LowStockList } from './_components/low-stock-list'

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-7">
      <DashboardStats />
      <div className="grid gap-5 md:grid-cols-2">
        <RecentInvoices />
        <LowStockList />
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Commit dashboard page**

```bash
git add -A
git commit -m "feat: add dashboard overview with stats, recent invoices, low stock"
```

---

### Task 13: Products page

**Files:**
- Create: `app/(dashboard)/products/page.tsx`
- Create: `app/(dashboard)/products/_components/products-table.tsx`
- Create: `app/(dashboard)/products/_components/product-form-dialog.tsx`

- [ ] **Step 1: Create `app/(dashboard)/products/_components/product-form-dialog.tsx`**

```tsx
'use client'

import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateProduct, useUpdateProduct } from '@/query/products'
import type { Product } from '@/query/products'

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product
}

const UNITS = ['كرتون', 'قطعة', 'كيلو', 'لتر', 'جالون', 'طن', 'حبة']

export function ProductFormDialog({ open, onOpenChange, product }: ProductFormDialogProps) {
  const t = useTranslations('products')
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()

  const form = useForm({
    defaultValues: {
      name: product?.name ?? '',
      sku: product?.sku ?? '',
      category: product?.category ?? '',
      unit: product?.unit ?? 'كرتون',
      price: product?.price ?? 0,
      cost: product?.cost ?? 0,
      pieces_per_unit: product?.pieces_per_unit ?? 0,
      piece_price: product?.piece_price ?? 0,
      qty: product?.qty ?? 0,
      min_qty: product?.min_qty ?? 10,
      max_qty: product?.max_qty ?? 1000
    },
    onSubmit: async ({ value }) => {
      if (product) {
        await updateProduct.mutateAsync({ id: product.id, payload: value })
      } else {
        await createProduct.mutateAsync(value)
      }
      onOpenChange(false)
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-primary/30 bg-card sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {product ? t('edit', { defaultValue: 'تعديل منتج' }) : t('newProduct')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <form.Field name="name">
              {(field) => (
                <div className="space-y-1">
                  <Label className="text-muted-foreground">{t('name')} *</Label>
                  <Input value={field.state.value} onChange={e => field.handleChange(e.target.value)} className="bg-input border-border" />
                </div>
              )}
            </form.Field>
            <form.Field name="sku">
              {(field) => (
                <div className="space-y-1">
                  <Label className="text-muted-foreground">{t('sku')}</Label>
                  <Input dir="ltr" value={field.state.value ?? ''} onChange={e => field.handleChange(e.target.value)} className="bg-input border-border" />
                </div>
              )}
            </form.Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <form.Field name="category">
              {(field) => (
                <div className="space-y-1">
                  <Label className="text-muted-foreground">{t('category')}</Label>
                  <Input value={field.state.value ?? ''} onChange={e => field.handleChange(e.target.value)} className="bg-input border-border" />
                </div>
              )}
            </form.Field>
            <form.Field name="unit">
              {(field) => (
                <div className="space-y-1">
                  <Label className="text-muted-foreground">{t('unit')}</Label>
                  <Select value={field.state.value} onValueChange={field.handleChange}>
                    <SelectTrigger className="bg-input border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>{UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <form.Field name="price">
              {(field) => (
                <div className="space-y-1">
                  <Label className="text-muted-foreground">{t('price')} *</Label>
                  <Input type="number" dir="ltr" step="0.01" value={field.state.value} onChange={e => field.handleChange(parseFloat(e.target.value) || 0)} className="bg-input border-border" />
                </div>
              )}
            </form.Field>
            <form.Field name="cost">
              {(field) => (
                <div className="space-y-1">
                  <Label className="text-muted-foreground">{t('cost')}</Label>
                  <Input type="number" dir="ltr" step="0.01" value={field.state.value ?? 0} onChange={e => field.handleChange(parseFloat(e.target.value) || 0)} className="bg-input border-border" />
                </div>
              )}
            </form.Field>
          </div>
          {/* Split pricing section */}
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
            <p className="text-xs font-semibold text-primary">{t('splitSettings')}</p>
            <div className="grid grid-cols-2 gap-4">
              <form.Field name="pieces_per_unit">
                {(field) => (
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">{t('piecesPerUnit')}</Label>
                    <Input type="number" dir="ltr" value={field.state.value ?? 0} onChange={e => field.handleChange(parseInt(e.target.value) || 0)} className="bg-input border-border text-sm" />
                  </div>
                )}
              </form.Field>
              <form.Field name="piece_price">
                {(field) => (
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">{t('piecePrice')}</Label>
                    <Input type="number" dir="ltr" step="0.01" placeholder={t('piecesHelp')} value={field.state.value ?? 0} onChange={e => field.handleChange(parseFloat(e.target.value) || 0)} className="bg-input border-border text-sm" />
                  </div>
                )}
              </form.Field>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {(['qty', 'min_qty', 'max_qty'] as const).map((fieldName) => (
              <form.Field key={fieldName} name={fieldName}>
                {(field) => (
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">{t(fieldName === 'qty' ? 'qty' : fieldName === 'min_qty' ? 'minQty' : 'maxQty')}</Label>
                    <Input type="number" dir="ltr" value={field.state.value ?? 0} onChange={e => field.handleChange(parseInt(e.target.value) || 0)} className="bg-input border-border text-sm" />
                  </div>
                )}
              </form.Field>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <form.Subscribe selector={s => s.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-[#C9A84C] to-[#E8C84A] font-semibold text-[#0A1628] hover:opacity-90">
                  {isSubmitting ? 'جاري الحفظ...' : '💾 حفظ'}
                </Button>
              )}
            </form.Subscribe>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 2: Create `app/(dashboard)/products/_components/products-table.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableError } from '@/components/data-table/data-table-error'
import { useDataTable } from '@/hooks/use-data-table'
import { getAllProductsQuery, useDeleteProduct } from '@/query/products'
import type { Product } from '@/query/products'
import { fmtCurrency, fmtNum } from '@/utils/formatters'
import { Button } from '@/components/ui/button'
import { ProductFormDialog } from './product-form-dialog'

export function ProductsTable() {
  const t = useTranslations('products')
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const deleteProduct = useDeleteProduct()

  const columns: ColumnDef<Product>[] = [
    { id: 'name', accessorKey: 'name', header: t('name'), enableSorting: true },
    { id: 'sku', accessorKey: 'sku', header: t('sku') },
    { id: 'category', accessorKey: 'category', header: t('category'), enableColumnFilter: true },
    { id: 'unit', accessorKey: 'unit', header: t('unit') },
    { id: 'price', accessorKey: 'price', header: t('price'), cell: ({ getValue }) => fmtCurrency(getValue() as number) },
    {
      id: 'qty',
      accessorKey: 'qty',
      header: t('qty'),
      cell: ({ row }) => {
        const qty = row.original.qty ?? 0
        const minQty = row.original.min_qty ?? 10
        return (
          <span className={qty === 0 ? 'text-destructive font-bold' : qty <= minQty ? 'text-yellow-500 font-semibold' : ''}>
            {fmtNum(qty, 0)}
          </span>
        )
      }
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="size-7" onClick={() => setEditProduct(row.original)}>
            <PencilIcon className="size-3.5 text-muted-foreground" />
          </Button>
          <Button size="icon" variant="ghost" className="size-7" onClick={() => {
            if (confirm(t('deleteConfirm'))) deleteProduct.mutate(row.original.id)
          }}>
            <Trash2Icon className="size-3.5 text-destructive" />
          </Button>
        </div>
      )
    }
  ]

  const { table, isLoading, isError } = useDataTable({
    columns,
    queryOptions: (params) => getAllProductsQuery(params)
  })

  if (isError) return <DataTableError />

  return (
    <>
      <DataTable table={table} isLoading={isLoading} />
      {editProduct && (
        <ProductFormDialog
          open={!!editProduct}
          onOpenChange={(open) => !open && setEditProduct(null)}
          product={editProduct}
        />
      )}
    </>
  )
}
```

- [ ] **Step 3: Create `app/(dashboard)/products/page.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductsTable } from './_components/products-table'
import { ProductFormDialog } from './_components/product-form-dialog'

export default function ProductsPage() {
  const t = useTranslations('products')
  const [open, setOpen] = useState(false)

  return (
    <div className="p-6 md:p-7">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">📦 {t('title')}</h1>
        <Button onClick={() => setOpen(true)} className="bg-gradient-to-r from-[#C9A84C] to-[#E8C84A] font-semibold text-[#0A1628] hover:opacity-90">
          <PlusIcon className="me-2 size-4" /> {t('newProduct')}
        </Button>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <ProductsTable />
      </div>
      <ProductFormDialog open={open} onOpenChange={setOpen} />
    </div>
  )
}
```

- [ ] **Step 4: Commit products page**

```bash
git add -A
git commit -m "feat: add products page with CRUD table and form dialog"
```

---

### Task 14: Customers page

**Files:** Same structure as products — `customers-table.tsx`, `customer-form-dialog.tsx`, `page.tsx`

- [ ] **Step 1: Create `customer-form-dialog.tsx`** — fields: name, phone (dir=ltr), address, tax_number, notes (textarea). Same TanStack Form pattern as product dialog.

- [ ] **Step 2: Create `customers-table.tsx`** — columns: name, phone, address. Edit/Delete actions. Same `useDataTable` + `getAllCustomersQuery` pattern.

- [ ] **Step 3: Create `app/(dashboard)/customers/page.tsx`** — same pattern as products page.

- [ ] **Step 4: Commit customers page**

```bash
git add -A
git commit -m "feat: add customers page with CRUD"
```

---

### Task 15: Inventory page

**Files:**
- Create: `app/(dashboard)/inventory/page.tsx`
- Create: `app/(dashboard)/inventory/_components/inventory-table.tsx`
- Create: `app/(dashboard)/inventory/_components/movement-form-dialog.tsx`

- [ ] **Step 1: Create `movement-form-dialog.tsx`** — product select (combobox from `getAllProductsSimpleQuery`), type select (وارد/صادر/تسوية/تالف), qty, note. Uses `useCreateMovement`.

- [ ] **Step 2: Create `inventory-table.tsx`** — columns: product_name, type (with colored badge), qty, note, created_at. Read-only, no edit/delete. Uses `getAllInventoryQuery` (implement query using same pagination pattern).

- [ ] **Step 3: Create `app/(dashboard)/inventory/page.tsx`**

- [ ] **Step 4: Commit inventory page**

```bash
git add -A
git commit -m "feat: add inventory movements page"
```

---

### Task 16: Invoices list page

**Files:**
- Create: `app/(dashboard)/invoices/page.tsx`
- Create: `app/(dashboard)/invoices/_components/invoices-table.tsx`
- Create: `app/(dashboard)/invoices/_components/invoice-status-badge.tsx`
- Create: `app/(dashboard)/invoices/_components/invoice-view-dialog.tsx`
- Create: `app/(dashboard)/invoices/_components/payment-dialog.tsx`

- [ ] **Step 1: Create `invoice-status-badge.tsx`**

```tsx
import { cn } from '@/utils/cn'
import type { InvoiceStatus } from '@/query/invoices'

const statusStyles: Record<InvoiceStatus, string> = {
  'مدفوعة': 'bg-green-500/15 text-green-400',
  'مدفوعة جزئياً': 'bg-yellow-500/15 text-yellow-400',
  'معلقة': 'bg-blue-500/15 text-blue-400',
  'ملغاة': 'bg-destructive/15 text-destructive'
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold', statusStyles[status])}>
      {status}
    </span>
  )
}
```

- [ ] **Step 2: Create `payment-dialog.tsx`**

```tsx
'use client'

import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRecordPayment } from '@/query/payments'
import { fmtCurrency } from '@/utils/formatters'
import type { Invoice } from '@/query/invoices'

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice
}

export function PaymentDialog({ open, onOpenChange, invoice }: PaymentDialogProps) {
  const t = useTranslations('invoices.payment')
  const recordPayment = useRecordPayment()
  const remaining = invoice.total - (invoice.paid_amount ?? 0)

  const form = useForm({
    defaultValues: { amount: remaining, method: 'نقدي', note: '' },
    onSubmit: async ({ value }) => {
      await recordPayment.mutateAsync({
        invoice_id: invoice.id,
        customer_id: invoice.customer_id ?? null,
        customer_name: invoice.customer_name,
        amount: value.amount,
        method: value.method,
        note: value.note || null
      })
      onOpenChange(false)
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-primary/30 bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">{t('title')}</DialogTitle>
        </DialogHeader>
        <div className="mb-4 rounded-lg bg-primary/5 p-3 text-sm text-muted-foreground">
          {t('remaining')}: <span className="font-bold text-primary">{fmtCurrency(remaining)}</span>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }} className="space-y-4">
          <form.Field name="amount">
            {(field) => (
              <div className="space-y-1">
                <Label className="text-muted-foreground">{t('amount')}</Label>
                <Input type="number" dir="ltr" step="0.01" max={remaining} value={field.state.value} onChange={e => field.handleChange(parseFloat(e.target.value) || 0)} className="bg-input border-border" />
              </div>
            )}
          </form.Field>
          <form.Field name="method">
            {(field) => (
              <div className="space-y-1">
                <Label className="text-muted-foreground">{t('method')}</Label>
                <Select value={field.state.value} onValueChange={field.handleChange}>
                  <SelectTrigger className="bg-input border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="نقدي">{t('cash')}</SelectItem>
                    <SelectItem value="تحويل">{t('transfer')}</SelectItem>
                    <SelectItem value="شيك">{t('check')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>
          <form.Field name="note">
            {(field) => (
              <div className="space-y-1">
                <Label className="text-muted-foreground">{t('note')}</Label>
                <Input value={field.state.value} onChange={e => field.handleChange(e.target.value)} className="bg-input border-border" />
              </div>
            )}
          </form.Field>
          <div className="flex gap-3">
            <form.Subscribe selector={s => s.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-[#C9A84C] to-[#E8C84A] font-semibold text-[#0A1628] hover:opacity-90">
                  {isSubmitting ? 'جاري التسجيل...' : t('save')}
                </Button>
              )}
            </form.Subscribe>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 3: Create `invoice-view-dialog.tsx`** — shows invoice details + payments list + "Record Payment" button

```tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getPaymentsByInvoiceQuery } from '@/query/payments'
import { fmtCurrency, fmtDate } from '@/utils/formatters'
import { InvoiceStatusBadge } from './invoice-status-badge'
import { PaymentDialog } from './payment-dialog'
import type { Invoice } from '@/query/invoices'

export function InvoiceViewDialog({ invoice, open, onOpenChange }: {
  invoice: Invoice; open: boolean; onOpenChange: (o: boolean) => void
}) {
  const [paymentOpen, setPaymentOpen] = useState(false)
  const { data: payments } = useQuery(getPaymentsByInvoiceQuery(invoice.id))

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-primary/30 bg-card sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-primary">فاتورة رقم {invoice.invoice_number}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">العميل: </span><span className="text-foreground font-medium">{invoice.customer_name}</span></div>
              <div><span className="text-muted-foreground">التاريخ: </span><span>{fmtDate(invoice.invoice_date)}</span></div>
              <div><span className="text-muted-foreground">الحالة: </span><InvoiceStatusBadge status={invoice.status} /></div>
              <div><span className="text-muted-foreground">الإجمالي: </span><span className="font-bold text-primary">{fmtCurrency(invoice.total)}</span></div>
              <div><span className="text-muted-foreground">المدفوع: </span><span className="text-green-400">{fmtCurrency(invoice.paid_amount)}</span></div>
              <div><span className="text-muted-foreground">المتبقي: </span><span className="text-destructive">{fmtCurrency(invoice.total - invoice.paid_amount)}</span></div>
            </div>
            {/* Items */}
            <div>
              <h4 className="mb-2 text-sm font-semibold text-muted-foreground">بنود الفاتورة</h4>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-primary/20">
                  <th className="py-1.5 text-right text-primary">المنتج</th>
                  <th className="py-1.5 text-right text-primary">الكمية</th>
                  <th className="py-1.5 text-right text-primary">السعر</th>
                  <th className="py-1.5 text-right text-primary">الإجمالي</th>
                </tr></thead>
                <tbody>{invoice.items?.map((item, i) => (
                  <tr key={i} className="border-b border-border/40">
                    <td className="py-2">{item.product_name}</td>
                    <td className="py-2">{item.qty}</td>
                    <td className="py-2">{fmtCurrency(item.price)}</td>
                    <td className="py-2 font-semibold">{fmtCurrency(item.total)}</td>
                  </tr>
                ))}</tbody>
              </table>
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between"><span>المجموع الفرعي</span><span>{fmtCurrency(invoice.subtotal)}</span></div>
                {invoice.tax_percent > 0 && <div className="flex justify-between"><span>ضريبة {invoice.tax_percent}%</span><span>{fmtCurrency(invoice.tax_amount)}</span></div>}
                <div className="flex justify-between border-t border-primary/20 pt-1 text-base font-bold text-primary"><span>الإجمالي</span><span>{fmtCurrency(invoice.total)}</span></div>
              </div>
            </div>
            {/* Payments */}
            <div>
              <h4 className="mb-2 text-sm font-semibold text-muted-foreground">سجل الدفعات</h4>
              {!payments?.length ? (
                <p className="text-xs text-muted-foreground">لا توجد دفعات</p>
              ) : (
                <table className="w-full text-xs">
                  <thead><tr className="border-b border-primary/20">
                    <th className="py-1 text-right text-primary">التاريخ</th>
                    <th className="py-1 text-right text-primary">المبلغ</th>
                    <th className="py-1 text-right text-primary">الطريقة</th>
                    <th className="py-1 text-right text-primary">ملاحظة</th>
                  </tr></thead>
                  <tbody>{payments.map(p => (
                    <tr key={p.id} className="border-b border-border/40">
                      <td className="py-1.5">{fmtDate(p.created_at)}</td>
                      <td className="py-1.5 text-green-400">{fmtCurrency(p.amount)}</td>
                      <td className="py-1.5">{p.method}</td>
                      <td className="py-1.5 text-muted-foreground">{p.note}</td>
                    </tr>
                  ))}</tbody>
                </table>
              )}
            </div>
            {invoice.status !== 'مدفوعة' && invoice.status !== 'ملغاة' && (
              <Button onClick={() => setPaymentOpen(true)} className="w-full bg-gradient-to-r from-[#C9A84C] to-[#E8C84A] font-semibold text-[#0A1628]">
                تسجيل دفعة
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {paymentOpen && (
        <PaymentDialog open={paymentOpen} onOpenChange={setPaymentOpen} invoice={invoice} />
      )}
    </>
  )
}
```

- [ ] **Step 4: Create `invoices-table.tsx`** — columns: invoice_number, customer_name, invoice_date, status badge, total, paid_amount. Actions: View (opens InvoiceViewDialog), Delete. Uses `useDataTable` + `getAllInvoicesQuery` with `status` filter column.

- [ ] **Step 5: Create `app/(dashboard)/invoices/page.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { InvoicesTable } from './_components/invoices-table'

export default function InvoicesPage() {
  const t = useTranslations('invoices')
  return (
    <div className="p-6 md:p-7">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">🧾 {t('title')}</h1>
        <Button asChild className="bg-gradient-to-r from-[#C9A84C] to-[#E8C84A] font-semibold text-[#0A1628] hover:opacity-90">
          <Link href="/invoices/new"><PlusIcon className="me-2 size-4" /> {t('newInvoice')}</Link>
        </Button>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <InvoicesTable />
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Commit invoices list page**

```bash
git add -A
git commit -m "feat: add invoices list page with view dialog, payment recording"
```

---

### Task 17: New invoice page

**Files:**
- Create: `app/(dashboard)/invoices/new/page.tsx`
- Create: `app/(dashboard)/invoices/new/_components/new-invoice-form.tsx`
- Create: `app/(dashboard)/invoices/new/_components/product-picker-dialog.tsx`
- Create: `app/(dashboard)/invoices/new/_components/line-items-table.tsx`

- [ ] **Step 1: Create `product-picker-dialog.tsx`** — searches all products, displays name/category/price, on select calls `onSelect(product)`

```tsx
'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { getAllProductsSimpleQuery } from '@/query/products'
import type { Product } from '@/query/products'
import { fmtCurrency } from '@/utils/formatters'

export function ProductPickerDialog({ open, onOpenChange, onSelect }: {
  open: boolean
  onOpenChange: (o: boolean) => void
  onSelect: (product: Product, sellBy: 'unit' | 'piece') => void
}) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const { data: products } = useQuery(getAllProductsSimpleQuery())

  const categories = [...new Set((products ?? []).map(p => p.category).filter(Boolean))]
  const filtered = (products ?? []).filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = !category || p.category === category
    return matchSearch && matchCat
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[85vh] max-w-2xl flex-col border-primary/30 bg-card p-0">
        <DialogHeader className="shrink-0 border-b border-border px-6 py-4">
          <DialogTitle className="text-primary">اختيار منتج</DialogTitle>
          <div className="mt-3 flex gap-2">
            <Input
              placeholder="بحث في المنتجات..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-input border-border"
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground"
            >
              <option value="">كل الفئات</option>
              {categories.map(c => <option key={c} value={c!}>{c}</option>)}
            </select>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid gap-2">
            {filtered.map(product => (
              <div key={product.id} className="rounded-lg border border-border bg-card/50 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category} · {product.unit} · الكمية: {product.qty}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { onSelect(product, 'unit'); onOpenChange(false) }}
                      className="rounded border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary"
                    >
                      {fmtCurrency(product.price)} / {product.unit}
                    </button>
                    {product.pieces_per_unit && product.pieces_per_unit > 0 && (
                      <button
                        onClick={() => { onSelect(product, 'piece'); onOpenChange(false) }}
                        className="rounded border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs text-primary hover:bg-primary/20"
                      >
                        {fmtCurrency(product.piece_price ?? 0)} / قطعة
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 2: Create `line-items-table.tsx`** — renders current invoice line items with qty/price inputs, remove button, total per line. Receives `items` array and `onChange` callback.

```tsx
'use client'

import { useState } from 'react'
import { Trash2Icon } from 'lucide-react'
import { ProductPickerDialog } from './product-picker-dialog'
import { fmtCurrency } from '@/utils/formatters'
import type { Product } from '@/query/products'

export interface LineItem {
  product_id: string
  product_name: string
  qty: number
  price: number
  total: number
  sell_by: 'unit' | 'piece'
  pieces_per_unit: number
}

interface LineItemsTableProps {
  items: LineItem[]
  onChange: (items: LineItem[]) => void
}

export function LineItemsTable({ items, onChange }: LineItemsTableProps) {
  const [pickerIndex, setPickerIndex] = useState<number | null>(null)

  const addItem = () => onChange([...items, { product_id: '', product_name: '', qty: 1, price: 0, total: 0, sell_by: 'unit', pieces_per_unit: 0 }])

  const removeItem = (i: number) => onChange(items.filter((_, idx) => idx !== i))

  const updateItem = (i: number, updates: Partial<LineItem>) => {
    const updated = [...items]
    updated[i] = { ...updated[i], ...updates }
    if ('qty' in updates || 'price' in updates) {
      updated[i].total = updated[i].qty * updated[i].price
    }
    onChange(updated)
  }

  const handleProductSelect = (i: number, product: Product, sellBy: 'unit' | 'piece') => {
    updateItem(i, {
      product_id: product.id,
      product_name: product.name,
      sell_by: sellBy,
      price: sellBy === 'piece' ? (product.piece_price ?? 0) : product.price,
      pieces_per_unit: product.pieces_per_unit ?? 0,
      total: 1 * (sellBy === 'piece' ? (product.piece_price ?? 0) : product.price)
    })
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary/30">
              <th className="py-2 text-right text-xs text-primary">المنتج</th>
              <th className="py-2 text-right text-xs text-primary w-20">الكمية</th>
              <th className="py-2 text-right text-xs text-primary w-28">سعر الوحدة</th>
              <th className="py-2 text-right text-xs text-primary w-28">الإجمالي</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-border/40">
                <td className="py-2 pe-2">
                  <button
                    type="button"
                    onClick={() => setPickerIndex(i)}
                    className={`w-full rounded border px-3 py-2 text-start text-sm transition ${item.product_id ? 'border-primary/30 text-foreground' : 'border-border text-muted-foreground'} bg-input hover:border-primary/50`}
                  >
                    {item.product_name || 'اضغط لاختيار منتج...'}
                    {item.sell_by === 'piece' && <span className="ms-2 text-xs text-primary">(قطعة)</span>}
                  </button>
                </td>
                <td className="py-2 pe-2">
                  <input
                    type="number" min="0" step="1" value={item.qty}
                    onChange={e => updateItem(i, { qty: parseFloat(e.target.value) || 0 })}
                    className="w-20 rounded border border-border bg-input px-2 py-1.5 text-center text-sm text-foreground"
                  />
                </td>
                <td className="py-2 pe-2">
                  <input
                    type="number" min="0" step="0.01" value={item.price}
                    onChange={e => updateItem(i, { price: parseFloat(e.target.value) || 0 })}
                    className="w-28 rounded border border-border bg-input px-2 py-1.5 text-center text-sm text-foreground"
                  />
                </td>
                <td className="py-2 pe-2">
                  <input
                    type="number" min="0" step="0.01" value={item.total}
                    onChange={e => updateItem(i, { total: parseFloat(e.target.value) || 0, price: item.qty ? (parseFloat(e.target.value) || 0) / item.qty : 0 })}
                    className="w-28 rounded border border-primary/30 bg-input px-2 py-1.5 text-center text-sm font-semibold text-primary"
                  />
                </td>
                <td className="py-2">
                  <button type="button" onClick={() => removeItem(i)} className="rounded p-1 text-destructive hover:bg-destructive/10">
                    <Trash2Icon className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addItem}
        className="mt-2 rounded border border-border px-3 py-1.5 text-sm text-muted-foreground hover:border-primary/30 hover:text-primary"
      >
        + إضافة منتج
      </button>
      {pickerIndex !== null && (
        <ProductPickerDialog
          open={true}
          onOpenChange={(o) => !o && setPickerIndex(null)}
          onSelect={(product, sellBy) => {
            handleProductSelect(pickerIndex, product, sellBy)
            setPickerIndex(null)
          }}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create `new-invoice-form.tsx`** — the full form: customer combobox (from `getAllCustomersSimpleQuery`), invoice date, status select, `LineItemsTable`, tax % with auto-calculated values, notes, save/reset buttons. Uses `useCreateInvoice` and `useUpdateProduct` (to deduct stock) + `useCreateMovement` (to log صادر).

```tsx
'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { getAllCustomersSimpleQuery } from '@/query/customers'
import { getAllProductsSimpleQuery } from '@/query/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LineItemsTable, type LineItem } from './line-items-table'
import { fmtCurrency } from '@/utils/formatters'
import type { Customer } from '@/query/customers'

export function NewInvoiceForm() {
  const t = useTranslations('invoices.form')
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: customers } = useQuery(getAllCustomersSimpleQuery())
  const { data: products } = useQuery(getAllProductsSimpleQuery())

  const [customerSearch, setCustomerSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showCustomerList, setShowCustomerList] = useState(false)
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
  const [status, setStatus] = useState<'معلقة' | 'مدفوعة'>('معلقة')
  const [items, setItems] = useState<LineItem[]>([])
  const [taxPercent, setTaxPercent] = useState(0)
  const [notes, setNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const filteredCustomers = (customers ?? []).filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase())
  )

  const subtotal = items.reduce((s, i) => s + (i.total ?? 0), 0)
  const taxAmount = subtotal * taxPercent / 100
  const grandTotal = subtotal + taxAmount

  const handleSave = async () => {
    if (!customerSearch.trim()) { toast.error('يرجى إدخال اسم العميل'); return }
    if (!items.length) { toast.error('يرجى إضافة منتج واحد على الأقل'); return }
    if (items.some(i => !i.product_id)) { toast.error('يرجى اختيار المنتج لكل بند'); return }

    setIsSaving(true)
    const supabase = createClient()
    const invoiceNumber = Date.now().toString().slice(-6)
    const paidAmount = status === 'مدفوعة' ? grandTotal : 0

    try {
      const { error } = await supabase.from('invoices').insert({
        invoice_number: invoiceNumber,
        customer_id: selectedCustomer?.id ?? null,
        customer_name: customerSearch,
        invoice_date: invoiceDate,
        status,
        subtotal,
        tax_percent: taxPercent,
        tax_amount: taxAmount,
        total: grandTotal,
        paid_amount: paidAmount,
        notes: notes || null,
        items: JSON.stringify(items)
      })
      if (error) throw error

      // Deduct stock and log inventory movements
      for (const item of items) {
        const product = products?.find(p => p.id === item.product_id)
        if (product) {
          const deductQty = item.sell_by === 'piece' && item.pieces_per_unit > 0
            ? item.qty / item.pieces_per_unit
            : item.qty
          await supabase.from('products').update({ qty: (product.qty ?? 0) - deductQty }).eq('id', product.id)
          await supabase.from('inventory_movements').insert({
            product_id: product.id,
            product_name: product.name,
            type: 'صادر',
            qty: deductQty,
            note: `فاتورة رقم ${invoiceNumber}`
          })
        }
      }

      await queryClient.invalidateQueries({ queryKey: ['invoices'] })
      await queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('✅ تم حفظ الفاتورة بنجاح')
      router.push('/invoices')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-6">
      <h2 className="text-lg font-semibold text-primary">➕ {t('title')}</h2>

      {/* Customer + Date */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1 relative">
          <Label className="text-muted-foreground">{t('customerSearch')} *</Label>
          <Input
            value={customerSearch}
            onChange={e => { setCustomerSearch(e.target.value); setSelectedCustomer(null); setShowCustomerList(true) }}
            onFocus={() => setShowCustomerList(true)}
            onBlur={() => setTimeout(() => setShowCustomerList(false), 200)}
            placeholder={t('customerSearch')}
            className="bg-input border-border"
          />
          {showCustomerList && filteredCustomers.length > 0 && (
            <div className="absolute top-full z-50 w-full rounded-lg border border-primary/30 bg-card shadow-xl max-h-48 overflow-y-auto">
              {filteredCustomers.map(c => (
                <button key={c.id} type="button"
                  onMouseDown={() => { setSelectedCustomer(c); setCustomerSearch(c.name); setShowCustomerList(false) }}
                  className="block w-full px-4 py-2.5 text-right text-sm text-foreground hover:bg-primary/10"
                >
                  {c.name}
                  {c.phone && <span className="ms-2 text-xs text-muted-foreground">{c.phone}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <Label className="text-muted-foreground">{t('invoiceDate')}</Label>
          <Input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className="bg-input border-border" />
        </div>
        <div className="space-y-1">
          <Label className="text-muted-foreground">{t('status')}</Label>
          <Select value={status} onValueChange={v => setStatus(v as 'معلقة' | 'مدفوعة')}>
            <SelectTrigger className="bg-input border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="معلقة">معلقة</SelectItem>
              <SelectItem value="مدفوعة">مدفوعة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Line items */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">📦 {t('items')}</h3>
        <LineItemsTable items={items} onChange={setItems} />
      </div>

      {/* Totals */}
      <div className="flex justify-start">
        <div className="w-72 space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground border-b border-border pb-2">
            <span>المجموع الفرعي</span><span>{fmtCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>ضريبة %</span>
            <div className="flex items-center gap-2">
              <input type="number" value={taxPercent} min="0" max="100"
                onChange={e => setTaxPercent(parseFloat(e.target.value) || 0)}
                className="w-16 rounded border border-border bg-input px-2 py-1 text-center text-sm text-foreground"
              />
              <span>{fmtCurrency(taxAmount)}</span>
            </div>
          </div>
          <div className="flex justify-between border-t border-primary/30 pt-2 text-lg font-bold text-primary">
            <span>الإجمالي</span><span>{fmtCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <Label className="text-muted-foreground">{t('notes')}</Label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder={t('notesPlaceholder')}
          rows={3}
          className="w-full resize-y rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-[#C9A84C] to-[#E8C84A] font-semibold text-[#0A1628] hover:opacity-90"
        >
          {isSaving ? 'جاري الحفظ...' : '💾 حفظ الفاتورة'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => { setItems([]); setCustomerSearch(''); setSelectedCustomer(null); setTaxPercent(0); setNotes('') }}
        >
          🔄 تفريغ
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create `app/(dashboard)/invoices/new/page.tsx`**

```tsx
import { NewInvoiceForm } from './_components/new-invoice-form'

export default function NewInvoicePage() {
  return (
    <div className="p-6 md:p-7">
      <NewInvoiceForm />
    </div>
  )
}
```

- [ ] **Step 5: Commit new invoice page**

```bash
git add -A
git commit -m "feat: add new invoice page with line items, product picker, tax, stock deduction"
```

---

### Task 18: Final wiring and verification

- [ ] **Step 1: Verify `app/page.tsx` is removed** — with the `(dashboard)` route group, `app/(dashboard)/page.tsx` handles `/`. Delete `app/page.tsx` if it exists alongside `app/(dashboard)/page.tsx`.

- [ ] **Step 2: Verify `query/inventory/` is complete** — `inventory-query.ts` uses same pagination pattern as products; `inventory-mutations.ts` exports `useCreateMovement`.

- [ ] **Step 3: Run type check**

```bash
bun run build 2>&1 | head -50
```

Fix any TypeScript errors before proceeding. Common issues:
- `AxiosError` references in copied hooks (replace with `Error`)
- Missing `paginationFallback` import in hooks (import from `@/lib`)
- `API<>` wrapper references in hooks (the `extractQueryItems` handles both wrapped and unwrapped formats)

- [ ] **Step 4: Test auth flow** — navigate to `/` → should redirect to `/login` → log in → redirect to dashboard

- [ ] **Step 5: Test each page** — navigate to `/invoices`, `/products`, `/inventory`, `/customers` — data should load from Supabase

- [ ] **Step 6: Test locale switch** — click the locale toggle → page reloads in English (LTR) or Arabic (RTL)

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "feat: complete Safwa dashboard - all pages wired and verified"
```

---

## Summary

The plan produces a complete Next.js 16 admin dashboard for "الصفوة" with:

- **Auth:** Supabase SSR (email/password, middleware route protection)
- **5 pages:** Dashboard overview, Invoices, Products, Inventory, Customers
- **Forms:** TanStack Form + Zod validation for all CRUD
- **Data tables:** TanStack Table via `useDataTable` with URL-based pagination/search/filter
- **i18n:** next-intl with ar (RTL) and en (LTR), cookie-based locale switching
- **Branding:** Navy (#0A1628) + Gold (#C9A84C) theme, Tajawal font, Safwa logo

Total commits: ~10 logical commits tracking each major chunk.
