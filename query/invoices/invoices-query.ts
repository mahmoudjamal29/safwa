import { queryOptions } from '@tanstack/react-query'

import { createClient } from '@/lib/supabase/client'

import type { Invoice } from './invoices-types'

export const getAllInvoicesQuery = (params?: Record<string, unknown>) =>
  queryOptions<PaginatedResponse<Invoice[]>>({
    queryFn: async () => {
      const supabase = createClient()
      const page = Number(params?.page ?? 1)
      const perPage = Number(params?.per_page ?? 15)
      const from = (page - 1) * perPage
      const to = from + perPage - 1

      const SELECT = `
        *,
        invoice_resolutions!resolver_invoice_id(
          invoices!resolved_invoice_id(
            id, invoice_number, invoice_date, subtotal, discount_percent, discount_amount, total, items
          )
        )
      `

      let query = supabase
        .from('invoices')
        .select(SELECT, { count: 'exact' })
        .order('created_at', { ascending: false })

      if (params?.search) {
        query = query.or(
          `customer_name.ilike.%${params.search}%,invoice_number.ilike.%${params.search}%`
        )
      }
      if (params?.status) query = query.eq('status', params.status as string)

      const { count, data, error } = await query.range(from, to)
      if (error) throw error

      const parsed = (data ?? []).map(inv => {
        const resolvedInvoices = ((inv as any).invoice_resolutions ?? [])
          .map((r: any) => r.invoices)
          .filter(Boolean)
          .map((r: any) => ({
            ...r,
            items: typeof r.items === 'string' ? JSON.parse(r.items) : (r.items ?? [])
          }))
        return {
          ...inv,
          items: typeof inv.items === 'string' ? JSON.parse(inv.items) : (inv.items ?? []),
          resolved_invoices: resolvedInvoices,
        }
      }) as Invoice[]

      const total = count ?? 0
      return {
        data: parsed,
        pagination: {
          current_page: page,
          from,
          last_page: Math.ceil(total / perPage) || 1,
          per_page: perPage,
          to: Math.min(to, total - 1),
          total
        }
      }
    },
    queryKey: ['invoices', params]
  })
