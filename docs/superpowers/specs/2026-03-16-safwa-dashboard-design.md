# Safwa Dashboard — Design Spec

**Date:** 2026-03-16
**Project:** `/home/d7om/Projects/safwa`
**Status:** Approved

---

## Overview

Convert the existing single-file `index.html` SPA ("الصفوة" food trading management system) into a proper Next.js 16 application using the `create-d7om-dashboard` template structure and patterns from `edge-admin-dashboard`. The app connects to an existing Supabase project and requires email/password authentication.

---

## Stack

| Concern | Library |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + shadcn/ui + Tailwind CSS v4 |
| Data fetching | TanStack Query v5 |
| Forms | TanStack Form + Zod |
| Database / Auth | @supabase/supabase-js + @supabase/ssr |
| i18n | next-intl (ar/en, cookie-based) |
| Toast | Sonner |
| URL state | nuqs |
| Icons | Lucide React |
| Theme | next-themes |
| Package manager | Bun |

---

## Auth

- `middleware.ts` reads Supabase session from cookies via `@supabase/ssr`
- Unauthenticated requests to `/(dashboard)/*` → redirect to `/login`
- Authenticated requests to `/login` → redirect to `/`
- Login page: email/password form, TanStack Form + Zod validation, `supabase.auth.signInWithPassword()`
- Logout: `supabase.auth.signOut()` + redirect to `/login`

---

## Pages

### `/(auth)/login`
Email + password form. Gold/navy theme matching original HTML branding. Error display inline.

### `/(dashboard)/` — Dashboard Overview
- 4 stat cards: Total Revenue, Invoice Count, Product Count, Low Stock Count
- Period filter: Today / This Month / All / Custom date range
- Recent invoices mini-table (last 6)
- Low stock products list

### `/(dashboard)/invoices` — Invoices List
- Data table with search (customer/invoice number), status filter
- Actions: View (dialog with payments), Record Payment (dialog), Print, Edit, Delete
- Status badges: مدفوعة / معلقة / ملغاة

### `/(dashboard)/invoices/new` — New Invoice
- Customer search/select (combobox from customers list)
- Invoice date, status select
- Line items table: product picker modal, qty, unit price, total per line
- Tax % input with auto-calculated tax value
- Grand total display
- Notes textarea
- Save / Reset

### `/(dashboard)/products` — Products
- Data table with search + category filter
- CRUD via dialog/sheet: name, SKU, category, unit, price, cost, split pricing, qty, min/max qty
- Category management (inline)

### `/(dashboard)/inventory` — Inventory Movements
- Data table showing all movements (product, type, qty, note, date)
- New movement dialog: product select, type (وارد/صادر/تسوية/تالف), qty, note

### `/(dashboard)/customers` — Customers
- Data table with search
- CRUD via dialog: name, phone, address, tax number, notes
- Balance/credit display if applicable

---

## Data Layer

### Supabase Tables (inferred from existing HTML)

| Table | Key Columns |
|---|---|
| `products` | id, name, sku, category, unit, price, cost, pieces_count, piece_price, qty, min_qty, max_qty |
| `customers` | id, name, phone, address, tax_number, notes |
| `invoices` | id, invoice_number, customer_id, customer_name, invoice_date, status, subtotal, tax_pct, tax_val, total, notes |
| `invoice_items` | id, invoice_id, product_id, product_name, qty, unit_price, total |
| `inventory_movements` | id, product_id, product_name, type, qty, note, created_at |
| `payments` | id, invoice_id, amount, method, note, created_at |

### Query Organization

```
query/
  invoices/
    invoices-types.ts
    invoices-query.ts      # queryOptions wrappers around supabase client calls
    invoices-mutations.ts  # useMutation helpers
    index.ts
  products/   customers/   inventory/   payments/
    (same structure)
```

All queries use `queryOptions()` from TanStack Query. Mutations call `supabase.from(table).insert/update/delete` and invalidate relevant query keys on success.

---

## Supabase Client Split

```
lib/supabase/
  client.ts      # createBrowserClient() — used in client components
  server.ts      # createServerClient() using next/headers cookies — used in Server Components & route handlers
```

Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## i18n

Cookie-based locale detection, identical to edge-admin-dashboard pattern.

```
lib/i18n/
  i18n-config.ts     # locales = ['ar', 'en'], defaultLocale = 'ar'
  request.ts         # getRequestConfig, getLocale(), getTimeZone()
  messages.ts        # aggregates all JSON per locale
  ar/
    common.json  auth.json  layout.json  dashboard.json
    invoices.json  products.json  inventory.json  customers.json
  en/
    (same files)
```

RTL/LTR: `ar` → `dir="rtl"`, `en` → `dir="ltr"`. Applied on `<html>` in root layout via locale from `getLocale()`.

---

## Layout

Mirrors edge-admin-dashboard `_layout` pattern:

```
app/(dashboard)/_layout/
  sidebar-config.ts              # createMenuSidebarMain(t) → MenuConfig
  components/
    sidebar.tsx
    sidebar-content.tsx
    sidebar-footer.tsx
    header.tsx
    header-toolbar.tsx           # locale switcher, theme toggle, user dropdown
    dashboard-layout-wrapper.tsx
```

Sidebar nav sections:
- الرئيسية: Dashboard
- المبيعات: Invoices, New Invoice
- المخزون: Products, Inventory Movements
- العملاء: Customers

---

## Branding / Theme

Preserve original color palette from HTML:
- Navy: `#0A1628` (background)
- Gold: `#C9A84C` / `#E8C84A` (accent/primary)
- Fonts: Tajawal (body), Noto Naskh Arabic (headings/logo)

Map to CSS variables / shadcn theme tokens so they work with next-themes dark/light.

---

## Project File Structure

```
safwa/
├── app/
│   ├── globals.css
│   ├── layout.tsx                    # Root: html dir/lang, providers
│   ├── page.tsx                      # redirect → /
│   ├── (auth)/
│   │   └── login/page.tsx
│   └── (dashboard)/
│       ├── layout.tsx
│       ├── _layout/
│       │   ├── sidebar-config.ts
│       │   └── components/
│       ├── page.tsx
│       ├── invoices/
│       │   ├── page.tsx
│       │   ├── new/page.tsx
│       │   └── _components/
│       ├── products/
│       │   ├── page.tsx
│       │   └── _components/
│       ├── inventory/
│       │   ├── page.tsx
│       │   └── _components/
│       └── customers/
│           ├── page.tsx
│           └── _components/
├── components/
│   ├── ui/          # shadcn/ui primitives
│   ├── custom/      # from template: info-card, badge, title, timeline...
│   ├── data-table/  # from template: DataTable, filters
│   └── form/        # from template: form fields
├── lib/
│   ├── supabase/    client.ts · server.ts
│   ├── i18n/        (as above)
│   ├── providers/   providers-root.tsx · query-client.tsx · theme-provider.tsx · sonner-provider.tsx
│   └── env.ts
├── query/
│   └── invoices/ products/ customers/ inventory/ payments/
├── query-client/
│   ├── get-query-client.ts
│   └── index.ts
├── hooks/
│   ├── use-data-table.ts
│   ├── use-data-table-query.ts
│   └── use-debounce.ts  ...
├── utils/   types/
├── middleware.ts
├── next.config.ts
├── components.json
├── tsconfig.json
├── package.json
└── .env.local
```

---

## Non-Goals

- No role-based permissions (unlike edge-admin-dashboard)
- No push notifications
- No Sentry integration (can be added later via template's sentry comments)
- No print-to-PDF infrastructure (browser print via `window.print()` is sufficient)
