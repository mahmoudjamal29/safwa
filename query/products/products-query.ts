import { queryOptions } from '@tanstack/react-query'

import { createClient } from '@/lib/supabase/client'

import type { Product } from './products-types'

export const getAllProductsQuery = (params?: Record<string, unknown>) =>
  queryOptions<PaginatedResponse<Product[]>>({
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
    queryKey: ['products', params]
  })

export const getAllProductsSimpleQuery = () =>
  queryOptions<Product[]>({
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name')
      if (error) throw error
      return data ?? []
    },
    queryKey: ['products', 'all'],
    staleTime: 2 * 60 * 1000
  })
