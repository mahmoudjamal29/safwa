export interface Payment {
  id: string
  invoice_id: string
  customer_id: string | null
  customer_name: string
  amount: number
  method: string
  note: string | null
  created_at: string
}

export type CreatePaymentPayload = Omit<Payment, 'id' | 'created_at'>
