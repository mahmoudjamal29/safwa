'use client'

import * as React from 'react'

import { useQuery } from '@tanstack/react-query'
import { Eye, Trash2 } from 'lucide-react'

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
          placeholder="بحث بالعميل أو رقم الفاتورة..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="max-w-xs"
        />
        <Select value={status} onValueChange={v => { setStatus(v === 'all' ? '' : v); setPage(1) }}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="كل الحالات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الحالات</SelectItem>
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
              <TableHead>رقم الفاتورة</TableHead>
              <TableHead>العميل</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>الإجمالي</TableHead>
              <TableHead>المدفوع</TableHead>
              <TableHead>المتبقي</TableHead>
              <TableHead>إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">جاري التحميل...</TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">لا توجد فواتير</TableCell>
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
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteId(inv.id)}>
                        <Trash2 className="h-4 w-4" />
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
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>السابق</Button>
          <span className="text-sm text-muted-foreground flex items-center">صفحة {page} من {pagination.last_page}</span>
          <Button variant="outline" size="sm" disabled={page >= pagination.last_page} onClick={() => setPage(p => p + 1)}>التالي</Button>
        </div>
      )}

      <InvoiceViewDialog open={viewOpen} onOpenChange={setViewOpen} invoice={viewInvoice} />

      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف الفاتورة</AlertDialogTitle>
            <AlertDialogDescription>هل تريد حذف هذه الفاتورة؟ لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (deleteId) {
                  await deleteMutation.mutateAsync(deleteId)
                  setDeleteId(null)
                }
              }}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
