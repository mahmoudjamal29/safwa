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

import { PencilIcon, Trash2Icon } from '@/lib/icons'

import { getAllCustomersQuery, useDeleteCustomer, type Customer, type CustomerWithBalance } from '@/query/customers'

import { useDebounce } from '@/hooks/use-debounce'

import { fmtCurrency } from '@/utils/formatters'

import { DataTable } from '@/components/data-table/data-table'
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

import { CustomerFormDialog } from './customer-form-dialog'

export function CustomersTable() {
  const t = useTranslations('customers')
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 15 })
  const debouncedSearch = useDebounce(search, 300)

  const [editCustomer, setEditCustomer] = useState<Customer | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const deleteMutation = useDeleteCustomer()

  const params = useMemo(() => ({
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
    ...(debouncedSearch && { search: debouncedSearch }),
  }), [pagination.pageIndex, pagination.pageSize, debouncedSearch])

  const { data, isLoading } = useQuery(getAllCustomersQuery(params))
  const customers = data?.data ?? []

  function openEdit(c: Customer) {
    setEditCustomer(c)
    setDialogOpen(true)
  }

  const columns = useMemo<ColumnDef<CustomerWithBalance>[]>(() => [
    {
      accessorKey: 'name',
      cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
      header: t('columns.name'),
    },
    {
      accessorKey: 'phone',
      cell: ({ getValue }) => <span>{getValue<string | null>() ?? '-'}</span>,
      header: t('columns.phone'),
    },
    {
      accessorKey: 'address',
      cell: ({ getValue }) => <span>{getValue<string | null>() ?? '-'}</span>,
      header: t('columns.address'),
    },
    {
      accessorKey: 'tax_number',
      cell: ({ getValue }) => <span>{getValue<string | null>() ?? '-'}</span>,
      header: t('columns.taxNumber'),
    },
    {
      accessorKey: 'notes',
      cell: ({ getValue }) => (
        <span className="block max-w-[200px] truncate">{getValue<string | null>() ?? '-'}</span>
      ),
      header: t('columns.notes'),
    },
    {
      cell: ({ row }) => {
        const balance = row.original.pending_balance ?? 0
        return (
          <span className={balance > 0 ? 'font-semibold text-red-600' : 'text-muted-foreground'}>
            {fmtCurrency(balance)}
          </span>
        )
      },
      header: t('columns.pendingBalance'),
      id: 'pendingBalance',
    },
    {
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" onClick={() => openEdit(row.original)}>
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteId(row.original.id)}>
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </div>
      ),
      header: t('columns.actions'),
      id: 'actions',
    },
  ], [t])

  const table = useReactTable({
    columns,
    data: customers,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    onPaginationChange: setPagination,
    pageCount: data?.pagination?.last_page ?? 1,
    state: { pagination },
  })

  const toolbar = (
    <Input
      placeholder={t('searchPlaceholder')}
      value={search}
      onChange={e => {
        setSearch(e.target.value)
        setPagination(p => ({ ...p, pageIndex: 0 }))
      }}
      className="max-w-xs"
    />
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

      <CustomerFormDialog
        key={editCustomer?.id ?? 'create'}
        open={dialogOpen}
        onOpenChange={open => {
          setDialogOpen(open)
          if (!open) setEditCustomer(null)
        }}
        customer={editCustomer}
      />
    </div>
  )
}
