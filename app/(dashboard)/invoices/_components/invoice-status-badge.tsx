'use client'

import { useTranslations } from 'next-intl'

import { INVOICE_STATUSES, type InvoiceStatusKey } from '@/lib/constants/statuses'

import { cn } from '@/utils/cn'

import { Badge } from '@/components/ui/badge'

const statusStyles: Record<InvoiceStatusKey, string> = {
  [INVOICE_STATUSES.PAID]: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
  [INVOICE_STATUSES.PARTIALLY_PAID]: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
  [INVOICE_STATUSES.PENDING]: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-800',
  [INVOICE_STATUSES.CANCELLED]: 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-900/20 dark:text-zinc-400 dark:border-zinc-700',
}

const statusToKey: Record<string, InvoiceStatusKey> = {
  'مدفوعة': INVOICE_STATUSES.PAID,
  'مدفوعة جزئياً': INVOICE_STATUSES.PARTIALLY_PAID,
  'معلقة': INVOICE_STATUSES.PENDING,
  'ملغاة': INVOICE_STATUSES.CANCELLED,
  [INVOICE_STATUSES.PAID]: INVOICE_STATUSES.PAID,
  [INVOICE_STATUSES.PARTIALLY_PAID]: INVOICE_STATUSES.PARTIALLY_PAID,
  [INVOICE_STATUSES.PENDING]: INVOICE_STATUSES.PENDING,
  [INVOICE_STATUSES.CANCELLED]: INVOICE_STATUSES.CANCELLED,
}

interface InvoiceStatusBadgeProps {
  status: string
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const t = useTranslations('invoices')
  const statusKey = statusToKey[status] ?? INVOICE_STATUSES.PENDING

  return (
    <Badge variant="outline" className={cn('font-medium', statusStyles[statusKey])}>
      {t(`statuses.${statusKey}`)}
    </Badge>
  )
}
