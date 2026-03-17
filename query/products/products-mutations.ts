import { useMutation } from '@tanstack/react-query'

import { createClient } from '@/lib/supabase/client'

import type { CreateProductPayload, UpdateProductPayload } from './products-types'

export function useCreateProduct() {
  return useMutation({
    meta: {
      invalidatesQuery: [['products']],
      successMessage: 'تم إضافة المنتج بنجاح'
    },
    mutationFn: async (payload: CreateProductPayload) => {
      const supabase = createClient()
      const { error } = await supabase.from('products').insert(payload)
      if (error) throw error
    }
  })
}

export function useUpdateProduct() {
  return useMutation({
    meta: {
      invalidatesQuery: [['products']],
      successMessage: 'تم تحديث المنتج بنجاح'
    },
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateProductPayload }) => {
      const supabase = createClient()
      const { error } = await supabase.from('products').update(payload).eq('id', id)
      if (error) throw error
    }
  })
}

export function useDeleteProduct() {
  return useMutation({
    meta: {
      invalidatesQuery: [['products']],
      successMessage: 'تم حذف المنتج'
    },
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
    }
  })
}
