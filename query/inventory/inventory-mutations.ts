import { useMutation } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { CreateMovementPayload } from './inventory-types'

export function useCreateMovement() {
  return useMutation({
    mutationFn: async (payload: CreateMovementPayload) => {
      const supabase = createClient()
      const { error: movErr } = await supabase.from('inventory_movements').insert(payload)
      if (movErr) throw movErr

      if (payload.product_id) {
        const { data: product } = await supabase
          .from('products')
          .select('qty')
          .eq('id', payload.product_id)
          .single()

        if (product) {
          const currentQty = product.qty ?? 0
          let newQty: number

          if (payload.type === 'وارد') {
            newQty = currentQty + payload.qty
          } else if (payload.type === 'تسوية') {
            newQty = payload.qty
          } else {
            // صادر or تالف — subtract
            newQty = currentQty - payload.qty
          }

          await supabase
            .from('products')
            .update({ qty: newQty })
            .eq('id', payload.product_id)
        }
      }
    },
    meta: {
      successMessage: 'تم تسجيل الحركة بنجاح',
      invalidatesQuery: [['inventory'], ['products']]
    }
  })
}
