export const INVOICE_STATUSES = {
  PAID: 'paid',
  PARTIALLY_PAID: 'partially_paid',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
} as const

export type InvoiceStatusKey = (typeof INVOICE_STATUSES)[keyof typeof INVOICE_STATUSES]

export const INVOICE_STATUS_AR = {
  [INVOICE_STATUSES.PAID]: 'مدفوعة',
  [INVOICE_STATUSES.PARTIALLY_PAID]: 'مدفوعة جزئياً',
  [INVOICE_STATUSES.PENDING]: 'معلقة',
  [INVOICE_STATUSES.CANCELLED]: 'ملغاة',
} as const

export const INVOICE_STATUS_EN = {
  [INVOICE_STATUSES.PAID]: 'Paid',
  [INVOICE_STATUSES.PARTIALLY_PAID]: 'Partially Paid',
  [INVOICE_STATUSES.PENDING]: 'Pending',
  [INVOICE_STATUSES.CANCELLED]: 'Cancelled',
} as const

export const INVOICE_STATUS_KEYS: InvoiceStatusKey[] = [
  INVOICE_STATUSES.PAID,
  INVOICE_STATUSES.PARTIALLY_PAID,
  INVOICE_STATUSES.PENDING,
  INVOICE_STATUSES.CANCELLED,
]

export function getInvoiceStatusLabel(status: InvoiceStatusKey, locale: string): string {
  return locale === 'ar' ? INVOICE_STATUS_AR[status] : INVOICE_STATUS_EN[status]
}

export function getInvoiceStatusFromLabel(label: string): InvoiceStatusKey {
  if (label === INVOICE_STATUS_AR[INVOICE_STATUSES.PAID] || label === INVOICE_STATUS_EN[INVOICE_STATUSES.PAID]) {
    return INVOICE_STATUSES.PAID
  }
  if (label === INVOICE_STATUS_AR[INVOICE_STATUSES.PARTIALLY_PAID] || label === INVOICE_STATUS_EN[INVOICE_STATUSES.PARTIALLY_PAID]) {
    return INVOICE_STATUSES.PARTIALLY_PAID
  }
  if (label === INVOICE_STATUS_AR[INVOICE_STATUSES.PENDING] || label === INVOICE_STATUS_EN[INVOICE_STATUSES.PENDING]) {
    return INVOICE_STATUSES.PENDING
  }
  return INVOICE_STATUSES.CANCELLED
}
