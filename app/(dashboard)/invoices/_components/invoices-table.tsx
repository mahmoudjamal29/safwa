'use client'

import * as React from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { EyeIcon, Trash2Icon } from '@/lib/icons'

import { getAllInvoicesQuery, useDeleteInvoice, type Invoice, type InvoiceStatus } from '@/query/invoices'

import { useDebounce } from '@/hooks/use-debounce'

import { fmtCurrency, fmtDate } from '@/utils/formatters'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { InvoiceStatusBadge } from './invoice-status-badge'
import { InvoiceViewDialog } from './invoice-view-dialog'

const STATUSES: InvoiceStatus[] = ['مدفوعة', 'مدفوعة جزئياً', 'معلقة', 'ملغاة']

export function InvoicesTable() {
  const t = useTranslations('invoices')
  const [search, setSearch] = React.useState('')
  const [status, setStatus] = React.useState<string>('')
  const [page, setPage] = React.useState(1)
  const debouncedSearch = useDebounce(search, 300)

  const [viewInvoice, setViewInvoice] = React.useState<Invoice | null>(null)
  const [viewOpen, setViewOpen] = React.useState(false)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const deleteMutation = useDeleteInvoice()

  const params = React.useMemo(() => ({
    page,
    per_page: 15,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(status && { status }),
  }), [page, debouncedSearch, status])

  const { data, isLoading } = useQuery(getAllInvoicesQuery(params))
  const invoices = data?.data ?? []
  const pagination = data?.pagination

  function openView(inv: Invoice) {
    setViewInvoice(inv)
    setViewOpen(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="max-w-xs"
        />
        <Select value={status} onValueChange={v => { setStatus(v === 'all' ? '' : v); setPage(1) }}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={t('allStatuses')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allStatuses')}</SelectItem>
            {STATUSES.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('columns.number')}</TableHead>
              <TableHead>{t('columns.customer')}</TableHead>
              <TableHead>{t('columns.date')}</TableHead>
              <TableHead>{t('columns.status')}</TableHead>
              <TableHead>{t('columns.total')}</TableHead>
              <TableHead>{t('columns.paid')}</TableHead>
              <TableHead>{t('columns.remaining')}</TableHead>
              <TableHead>{t('columns.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">{t('loading')}</TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">{t('noInvoices')}</TableCell>
              </TableRow>
            ) : (
              invoices.map(inv => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-sm">{inv.invoice_number}</TableCell>
                  <TableCell>{inv.customer_name}</TableCell>
                  <TableCell>{fmtDate(inv.invoice_date)}</TableCell>
                  <TableCell><InvoiceStatusBadge status={inv.status} /></TableCell>
                  <TableCell className="font-medium">{fmtCurrency(inv.total)}</TableCell>
                  <TableCell className="text-green-600">{fmtCurrency(inv.paid_amount)}</TableCell>
                  <TableCell className="text-red-600">{fmtCurrency(inv.total - inv.paid_amount)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openView(inv)}>
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteId(inv.id)}>
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.last_page > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>{t('prev')}</Button>
          <span className="text-sm text-muted-foreground flex items-center">{t('pageOf', { current: page, total: pagination.last_page })}</span>
          <Button variant="outline" size="sm" disabled={page >= pagination.last_page} onClick={() => setPage(p => p + 1)}>{t('next')}</Button>
        </div>
      )}

      <InvoiceViewDialog open={viewOpen} onOpenChange={setViewOpen} invoice={viewInvoice} />

      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('deleteDescription')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (deleteId) {
                  await deleteMutation.mutateAsync(deleteId)
                  setDeleteId(null)
                }
              }}
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
