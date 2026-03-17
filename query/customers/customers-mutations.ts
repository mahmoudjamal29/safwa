import { useMutation } from '@tanstack/react-query'

import { createClient } from '@/lib/supabase/client'

import type { CreateCustomerPayload, UpdateCustomerPayload } from './customers-types'

export function useCreateCustomer() {
  return useMutation({
    meta: {
      invalidatesQuery: [['customers']],
      successMessage: 'تم إضافة العميل بنجاح'
    },
    mutationFn: async (payload: CreateCustomerPayload) => {
      const supabase = createClient()
      const { error } = await supabase.from('customers').insert(payload)
      if (error) throw error
    }
  })
}

export function useUpdateCustomer() {
  return useMutation({
    meta: {
      invalidatesQuery: [['customers']],
      successMessage: 'تم تحديث العميل بنجاح'
    },
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateCustomerPayload }) => {
      const supabase = createClient()
      const { error } = await supabase.from('customers').update(payload).eq('id', id)
      if (error) throw error
    }
  })
}

export function useDeleteCustomer() {
  return useMutation({
    meta: {
      invalidatesQuery: [['customers']],
      successMessage: 'تم حذف العميل'
    },
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('customers').delete().eq('id', id)
      if (error) throw error
    }
  })
}
