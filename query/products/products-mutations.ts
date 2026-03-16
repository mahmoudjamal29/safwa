import { useMutation } from '@tanstack/react-query'
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
