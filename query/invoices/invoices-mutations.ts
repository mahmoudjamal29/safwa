import { useMutation } from '@tanstack/react-query'

import { createClient } from '@/lib/supabase/client'

import type { CreateInvoicePayload } from './invoices-types'

export function useCreateInvoice() {
  return useMutation({
    meta: {
      invalidatesQuery: [['invoices'], ['customers'], ['customer-balances'], ['customer-pending-invoices']],
      successMessage: 'تم حفظ الفاتورة بنجاح'
    },
    mutationFn: async (payload: CreateInvoicePayload) => {
      const supabase = createClient()
      const { data, error } = await supabase.from('invoices').insert(payload).select('id').single()
      if (error) throw error
      return data as { id: string }
    }
  })
}

export function useUpdateInvoice() {
  return useMutation({
    meta: {
      invalidatesQuery: [['invoices'], ['customers'], ['customer-balances']],
      successMessage: 'تم تحديث الفاتورة'
    },
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateInvoicePayload> }) => {
      const { error } = await createClient().from('invoices').update(payload).eq('id', id)
      if (error) throw error
    }
  })
}

export function useDeleteInvoice() {
  return useMutation({
    meta: {
      invalidatesQuery: [['invoices'], ['payments']],
      successMessage: 'تم حذف الفاتورة'
    },
    mutationFn: async (id: string) => {
      const { error } = await createClient().from('invoices').delete().eq('id', id)
      if (error) throw error
    }
  })
}
