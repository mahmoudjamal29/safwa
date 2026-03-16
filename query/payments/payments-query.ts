import { queryOptions } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Payment } from './payments-types'

export const getPaymentsByInvoiceQuery = (invoiceId: string) =>
  queryOptions<Payment[]>({
    queryKey: ['payments', invoiceId],
    queryFn: async () => {
      const { data, error } = await createClient()
        .from('payments')
        .select('*')
        .eq('invoice_id', invoiceId)
        .order('created_at')
      if (error) throw error
      return data ?? []
    },
    enabled: !!invoiceId
  })
