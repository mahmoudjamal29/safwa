'use client'

import * as React from 'react'
import { useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
} from '@tanstack/react-table'
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

import { DataTable } from '@/components/data-table/data-table'

import { InvoiceStatusBadge } from './invoice-status-badge'
import { InvoiceViewDialog } from './invoice-view-dialog'

const STATUSES: InvoiceStatus[] = ['مدفوعة', 'مدفوعة جزئياً', 'معلقة', 'ملغاة']

export function InvoicesTable() {
  const t = useTranslations('invoices')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('')
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 15 })
  const debouncedSearch = useDebounce(search, 300)

  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const deleteMutation = useDeleteInvoice()

  const params = useMemo(() => ({
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(status && { status }),
  }), [pagination.pageIndex, pagination.pageSize, debouncedSearch, status])

  const { data, isLoading } = useQuery(getAllInvoicesQuery(params))
  const invoices = data?.data ?? []

  function openView(inv: Invoice) {
    setViewInvoice(inv)
    setViewOpen(true)
  }

  const columns = useMemo<ColumnDef<Invoice>[]>(() => [
    {
      accessorKey: 'invoice_number',
      header: t('columns.number'),
      cell: ({ getValue }) => <span className="font-mono text-sm">{getValue<string>()}</span>,
    },
    {
      accessorKey: 'customer_name',
      header: t('columns.customer'),
      cell: ({ getValue }) => <span>{getValue<string>()}</span>,
    },
    {
      accessorKey: 'invoice_date',
      header: t('columns.date'),
      cell: ({ getValue }) => <span>{fmtDate(getValue<string>())}</span>,
    },
    {
      accessorKey: 'status',
      header: t('columns.status'),
      cell: ({ getValue }) => <InvoiceStatusBadge status={getValue<InvoiceStatus>()} />,
    },
    {
      accessorKey: 'total',
      header: t('columns.total'),
      cell: ({ getValue }) => <span className="font-medium">{fmtCurrency(getValue<number>())}</span>,
    },
    {
      accessorKey: 'paid_amount',
      header: t('columns.paid'),
      cell: ({ getValue }) => <span className="text-green-600">{fmtCurrency(getValue<number>())}</span>,
    },
    {
      id: 'remaining',
      header: t('columns.remaining'),
      cell: ({ row }) => (
        <span className="text-red-600">{fmtCurrency(row.original.total - row.original.paid_amount)}</span>
      ),
    },
    {
      id: 'actions',
      header: t('columns.actions'),
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" onClick={() => openView(row.original)}>
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteId(row.original.id)}>
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], [t])

  const table = useReactTable({
    columns,
    data: invoices,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: data?.pagination?.last_page ?? 1,
    onPaginationChange: setPagination,
    state: { pagination },
  })

  const toolbar = (
    <div className="flex flex-wrap gap-2">
      <Input
        placeholder={t('searchPlaceholder')}
        value={search}
        onChange={e => {
          setSearch(e.target.value)
          setPagination(p => ({ ...p, pageIndex: 0 }))
        }}
        className="max-w-xs"
      />
      <Select
        value={status || 'all'}
        onValueChange={v => {
          setStatus(v === 'all' ? '' : v)
          setPagination(p => ({ ...p, pageIndex: 0 }))
        }}
      >
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
  )

  const deleteDialog = (
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
  )

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        isLoading={isLoading}
        table={table}
        toolbar={toolbar}
        enableRowsPerPage
        deleteDialog={deleteDialog}
      />

      <InvoiceViewDialog open={viewOpen} onOpenChange={setViewOpen} invoice={viewInvoice} />
    </div>
  )
}
