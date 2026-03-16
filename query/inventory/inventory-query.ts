import { queryOptions } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { InventoryMovement } from './inventory-types'

export const getAllInventoryQuery = (params?: Record<string, unknown>) =>
  queryOptions<PaginatedResponse<InventoryMovement[]>>({
    queryKey: ['inventory', params],
    queryFn: async () => {
      const supabase = createClient()
      const page = Number(params?.page ?? 1)
      const perPage = Number(params?.per_page ?? 15)
      const from = (page - 1) * perPage
      const to = from + perPage - 1

      let query = supabase
        .from('inventory_movements')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (params?.search) query = query.ilike('product_name', `%${params.search}%`)
      if (params?.type) query = query.eq('type', params.type as string)

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
