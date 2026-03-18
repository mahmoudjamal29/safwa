export interface InvoiceLineItem {
  product_id: string
  product_name: string
  qty: number
  price: number
  total: number
  sell_by: 'unit' | 'piece'
  pieces_per_unit: number
}

export type { InvoiceStatusKey as InvoiceStatus } from '@/lib/constants/statuses'

export interface ResolvedInvoice {
  id: string
  invoice_number: string
  invoice_date: string
  subtotal: number
  discount_percent: number
  discount_amount: number
  total: number
  items: InvoiceLineItem[]
}

export interface Invoice {
  id: string
  invoice_number: string
  customer_id: string | null
  customer_name: string
  invoice_date: string
  due_date: string | null
  status: string
  subtotal: number
  discount_percent: number
  discount_amount: number
  tax_percent: number
  tax_amount: number
  total: number
  paid_amount: number
  notes: string | null
  items: InvoiceLineItem[]
  resolved_invoices: ResolvedInvoice[]
  created_at: string
}

export interface CreateInvoicePayload {
  invoice_number: string
  customer_id?: string | null
  customer_name: string
  invoice_date: string
  status: string
  subtotal: number
  discount_percent: number
  discount_amount: number
  tax_percent: number
  tax_amount: number
  total: number
  paid_amount: number
  notes?: string
  items: string // JSON.stringify(items)
}
