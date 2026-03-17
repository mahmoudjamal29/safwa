import { queryOptions } from '@tanstack/react-query'

import { createClient } from '@/lib/supabase/client'

import type { Customer } from './customers-types'

export const getCustomerBalancesQuery = (customerIds: string[]) =>
  queryOptions<Record<string, number>>({
    enabled: customerIds.length > 0,
    queryFn: async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('invoices')
        .select('customer_id, total, paid_amount')
        .in('customer_id', customerIds)
        .neq('status', 'ملغاة')
      const map: Record<string, number> = {}
      for (const row of data ?? []) {
        if (!row.customer_id) continue
        map[row.customer_id] = (map[row.customer_id] ?? 0) + (row.total - row.paid_amount)
      }
      return map
    },
    queryKey: ['customer-balances', customerIds],
    staleTime: 60 * 1000,
  })

export const getAllCustomersQuery = (params?: Record<string, unknown>) =>
  queryOptions<PaginatedResponse<Customer[]>>({
    queryFn: async () => {
      const supabase = createClient()
      const page = Number(params?.page ?? 1)
      const perPage = Number(params?.per_page ?? 15)
      const from = (page - 1) * perPage
      const to = from + perPage - 1

      let query = supabase.from('customers').select('*', { count: 'exact' }).order('name')
      if (params?.search) query = query.ilike('name', `%${params.search}%`)

      const { count, data, error } = await query.range(from, to)
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
    },
    queryKey: ['customers', params]
  })

export const getAllCustomersSimpleQuery = () =>
  queryOptions<Customer[]>({
    queryFn: async () => {
      const { data, error } = await createClient().from('customers').select('*').order('name')
      if (error) throw error
      return data ?? []
    },
    queryKey: ['customers', 'all'],
    staleTime: 2 * 60 * 1000
  })
