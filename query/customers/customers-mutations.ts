import { useMutation } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { CreateCustomerPayload, UpdateCustomerPayload } from './customers-types'

export function useCreateCustomer() {
  return useMutation({
    mutationFn: async (payload: CreateCustomerPayload) => {
      const supabase = createClient()
      const { error } = await supabase.from('customers').insert(payload)
      if (error) throw error
    },
    meta: {
      successMessage: 'تم إضافة العميل بنجاح',
      invalidatesQuery: [['customers']]
    }
  })
}

export function useUpdateCustomer() {
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateCustomerPayload }) => {
      const supabase = createClient()
      const { error } = await supabase.from('customers').update(payload).eq('id', id)
      if (error) throw error
    },
    meta: {
      successMessage: 'تم تحديث العميل بنجاح',
      invalidatesQuery: [['customers']]
    }
  })
}

export function useDeleteCustomer() {
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('customers').delete().eq('id', id)
      if (error) throw error
    },
    meta: {
      successMessage: 'تم حذف العميل',
      invalidatesQuery: [['customers']]
    }
  })
}
