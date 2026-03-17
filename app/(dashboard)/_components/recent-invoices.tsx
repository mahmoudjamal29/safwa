'use client'

import { useQuery, queryOptions } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'

import { createClient } from '@/lib/supabase/client'

import type { InvoiceStatus } from '@/query/invoices'

import { cn } from '@/utils/cn'
import { fmtCurrency, fmtDate } from '@/utils/formatters'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const statusColors: Record<InvoiceStatus, string> = {
  'مدفوعة': 'bg-green-100 text-green-700 border-green-200',
  'مدفوعة جزئياً': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'معلقة': 'bg-blue-100 text-blue-700 border-blue-200',
  'ملغاة': 'bg-gray-100 text-gray-500 border-gray-200',
}

interface RecentInvoice {
  id: string
  invoice_number: string
  customer_name: string
  invoice_date: string
  status: InvoiceStatus
  total: number
}

const recentInvoicesOptions = queryOptions<RecentInvoice[]>({
  queryFn: async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('invoices')
      .select('id, invoice_number, customer_name, invoice_date, status, total')
      .order('created_at', { ascending: false })
      .limit(5)
    return (data as RecentInvoice[]) ?? []
  },
  queryKey: ['invoices', 'recent'],
})

export function RecentInvoices() {
  const t = useTranslations('dashboard')
  const { data: invoices = [], isLoading } = useQuery(recentInvoicesOptions)

  return (
    <div className="rounded-xl border bg-card p-4">
      <h2 className="mb-3 text-base font-semibold">{t('recentInvoices')}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>رقم الفاتورة</TableHead>
            <TableHead>العميل</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>الإجمالي</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">{t('loading')}</TableCell>
            </TableRow>
          ) : invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">لا توجد فواتير</TableCell>
            </TableRow>
          ) : (
            invoices.map(inv => (
              <TableRow key={inv.id}>
                <TableCell className="font-mono text-sm">{inv.invoice_number}</TableCell>
                <TableCell>{inv.customer_name}</TableCell>
                <TableCell>{fmtDate(inv.invoice_date)}</TableCell>
                <TableCell>
                  <Badge className={cn('text-xs', statusColors[inv.status])}>
                    {inv.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{fmtCurrency(inv.total)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
