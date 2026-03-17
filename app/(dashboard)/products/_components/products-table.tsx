'use client'

import * as React from 'react'
import { useMemo, useState } from 'react'

import { useQuery, queryOptions } from '@tanstack/react-query'
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
} from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { PencilIcon, Trash2Icon } from '@/lib/icons'

import { createClient } from '@/lib/supabase/client'

import { getAllProductsQuery, useDeleteProduct, type Product } from '@/query/products'

import { useDebounce } from '@/hooks/use-debounce'

import { fmtCurrency } from '@/utils/formatters'

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

import { ProductFormDialog } from './product-form-dialog'

const CATEGORIES_QUERY_KEY = ['product-categories']

export function ProductsTable() {
  const t = useTranslations('products')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 15 })
  const debouncedSearch = useDebounce(search, 300)

  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const deleteMutation = useDeleteProduct()

  const params = useMemo(() => ({
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(category && { category }),
  }), [pagination.pageIndex, pagination.pageSize, debouncedSearch, category])

  const { data, isLoading } = useQuery(getAllProductsQuery(params))
  const products = data?.data ?? []

  // Distinct categories inline query
  const { data: allProducts } = useQuery(queryOptions({
    queryFn: async () => {
      const { data } = await createClient().from('products').select('category').order('category')
      return data ?? []
    },
    queryKey: CATEGORIES_QUERY_KEY,
    staleTime: 5 * 60 * 1000,
  }))
  const categories = Array.from(new Set((allProducts ?? []).map(p => p.category).filter(Boolean))) as string[]

  function openCreate() {
    setEditProduct(null)
    setDialogOpen(true)
  }

  function openEdit(p: Product) {
    setEditProduct(p)
    setDialogOpen(true)
  }

  const columns = useMemo<ColumnDef<Product>[]>(() => [
    {
      accessorKey: 'name',
      header: t('columns.name'),
      cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
    },
    {
      accessorKey: 'sku',
      header: t('columns.sku'),
      cell: ({ getValue }) => <span className="text-muted-foreground">{getValue<string | null>() ?? '-'}</span>,
    },
    {
      accessorKey: 'category',
      header: t('columns.category'),
      cell: ({ getValue }) => <span>{getValue<string | null>() ?? '-'}</span>,
    },
    {
      accessorKey: 'unit',
      header: t('columns.unit'),
      cell: ({ getValue }) => <span>{getValue<string>()}</span>,
    },
    {
      accessorKey: 'price',
      header: t('columns.price'),
      cell: ({ getValue }) => <span>{fmtCurrency(getValue<number>())}</span>,
    },
    {
      accessorKey: 'cost',
      header: t('columns.cost'),
      cell: ({ getValue }) => {
        const v = getValue<number | null>()
        return <span>{v != null ? fmtCurrency(v) : '-'}</span>
      },
    },
    {
      accessorKey: 'qty',
      header: t('columns.qty'),
      cell: ({ row }) => {
        const isLow = row.original.min_qty != null && row.original.qty <= (row.original.min_qty ?? Infinity)
        return (
          <span className={isLow ? 'text-red-600 font-bold' : ''}>
            {row.original.qty}
          </span>
        )
      },
    },
    {
      accessorKey: 'min_qty',
      header: t('columns.minQty'),
      cell: ({ getValue }) => <span>{getValue<number | null>() ?? '-'}</span>,
    },
    {
      accessorKey: 'pieces_per_unit',
      header: t('columns.piecesPerUnit'),
      cell: ({ getValue }) => <span>{getValue<number | null>() ?? '-'}</span>,
    },
    {
      id: 'actions',
      header: t('columns.actions'),
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
    },
  ], [t])

  const table = useReactTable({
    columns,
    data: products,
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
        value={category || '__all__'}
        onValueChange={v => {
          setCategory(v === '__all__' ? '' : v)
          setPagination(p => ({ ...p, pageIndex: 0 }))
        }}
      >
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">{t('allCategories')}</SelectItem>
          {categories.map(c => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
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

      <ProductFormDialog
        key={editProduct?.id ?? 'create'}
        open={dialogOpen}
        onOpenChange={open => {
          setDialogOpen(open)
          if (!open) setEditProduct(null)
        }}
        product={editProduct}
      />
    </div>
  )
}
