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
