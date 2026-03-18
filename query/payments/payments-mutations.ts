import { useMutation } from '@tanstack/react-query'

import { createClient } from '@/lib/supabase/client'

import { INVOICE_STATUSES } from '@/lib/constants/statuses'

import type { CreatePaymentPayload } from './payments-types'

export function useRecordPayment() {
  return useMutation({
    meta: {
      invalidatesQuery: [['invoices'], ['payments']],
      successMessage: 'تم تسجيل الدفعة بنجاح'
    },
    mutationFn: async (payload: CreatePaymentPayload) => {
      const supabase = createClient()
      const { error: payErr } = await supabase.from('payments').insert(payload)
      if (payErr) throw payErr

      // Fetch current invoice to update paid_amount and status
      const { data: inv } = await supabase
        .from('invoices')
        .select('total, paid_amount')
        .eq('id', payload.invoice_id)
        .single()

      if (inv) {
        const remaining = inv.total - (inv.paid_amount ?? 0)
        const safeAmount = Math.min(payload.amount, Math.max(0, remaining))
        const newPaid = (inv.paid_amount ?? 0) + safeAmount
        const newStatus = newPaid >= inv.total ? INVOICE_STATUSES.PAID : INVOICE_STATUSES.PARTIALLY_PAID
        await supabase.from('invoices')
          .update({ paid_amount: newPaid, status: newStatus })
          .eq('id', payload.invoice_id)
      }
    }
  })
}
