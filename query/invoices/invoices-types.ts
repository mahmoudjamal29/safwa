export interface InvoiceLineItem {
  product_id: string
  product_name: string
  qty: number
  price: number
  total: number
  sell_by: 'unit' | 'piece'
  pieces_per_unit: number
}

export type InvoiceStatus = 'مدفوعة' | 'مدفوعة جزئياً' | 'معلقة' | 'ملغاة'

export interface Invoice {
  id: string
  invoice_number: string
  customer_id: string | null
  customer_name: string
  invoice_date: string
  status: InvoiceStatus
  subtotal: number
  tax_percent: number
  tax_amount: number
  total: number
  paid_amount: number
  notes: string | null
  items: InvoiceLineItem[]
  created_at: string
}

export interface CreateInvoicePayload {
  invoice_number: string
  customer_id?: string | null
  customer_name: string
  invoice_date: string
  status: InvoiceStatus
  subtotal: number
  tax_percent: number
  tax_amount: number
  total: number
  paid_amount: number
  notes?: string
  items: string // JSON.stringify(items)
}
