'use client'

import { useTranslations } from 'next-intl'

import type { InvoiceStatus } from '@/query/invoices'

import { cn } from '@/utils/cn'

import { Badge } from '@/components/ui/badge'

const statusStyles: Record<InvoiceStatus, string> = {
  'مدفوعة':         'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
  'مدفوعة جزئياً': 'bg-amber-50   text-amber-700   border-amber-200   dark:bg-amber-900/20   dark:text-amber-400   dark:border-amber-800',
  'معلقة':          'bg-sky-50     text-sky-700     border-sky-200     dark:bg-sky-900/20     dark:text-sky-400     dark:border-sky-800',
  'ملغاة':          'bg-zinc-100   text-zinc-500    border-zinc-200    dark:bg-zinc-900/20    dark:text-zinc-400    dark:border-zinc-700',
}

const statusKey: Record<InvoiceStatus, 'paid' | 'partiallyPaid' | 'pending' | 'cancelled'> = {
  'مدفوعة':         'paid',
  'مدفوعة جزئياً': 'partiallyPaid',
  'معلقة':          'pending',
  'ملغاة':          'cancelled',
}

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const t = useTranslations('invoices')
  return (
    <Badge variant="outline" className={cn('font-medium', statusStyles[status])}>
      {t(`statuses.${statusKey[status]}`)}
    </Badge>
  )
}
