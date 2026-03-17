import { useMutation } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { CreateInvoicePayload } from './invoices-types'

export function useCreateInvoice() {
  return useMutation({
    mutationFn: async (payload: CreateInvoicePayload) => {
      const supabase = createClient()
      const { error } = await supabase.from('invoices').insert(payload)
      if (error) throw error
    },
    meta: {
      successMessage: 'تم حفظ الفاتورة بنجاح',
      invalidatesQuery: [['invoices']]
    }
  })
}

export function useUpdateInvoice() {
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateInvoicePayload> }) => {
      const { error } = await createClient().from('invoices').update(payload).eq('id', id)
      if (error) throw error
    },
    meta: {
      successMessage: 'تم تحديث الفاتورة',
      invalidatesQuery: [['invoices']]
    }
  })
}

export function useDeleteInvoice() {
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await createClient().from('invoices').delete().eq('id', id)
      if (error) throw error
    },
    meta: {
      successMessage: 'تم حذف الفاتورة',
      invalidatesQuery: [['invoices'], ['payments']]
    }
  })
}
