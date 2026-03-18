'use client'

import * as React from 'react'
import { useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

import { getAllProductsSimpleQuery, type Product } from '@/query/products'

import { fmtCurrency } from '@/utils/formatters'

import { DataTable } from '@/components/data-table/data-table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import type { LineItem } from './new-invoice-form'

interface ProductPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (item: LineItem) => void
}

const ALL = '__all__'

export function ProductPickerDialog({ onOpenChange, onSelect, open }: ProductPickerDialogProps) {
  const t = useTranslations('invoices')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(ALL)
  const [sellByMap, setSellByMap] = useState<Record<string, 'unit' | 'piece'>>({})

  const { data: products = [], isLoading } = useQuery(getAllProductsSimpleQuery())

  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category).filter(Boolean) as string[])
    return Array.from(set).sort()
  }, [products])

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
      const matchCategory = category === ALL || p.category === category
      return matchSearch && matchCategory
    })
  }, [products, search, category])

  function getSellBy(p: Product): 'unit' | 'piece' {
    return sellByMap[p.id] ?? 'unit'
  }

  function toggleSellBy(id: string) {
    setSellByMap(prev => ({
      ...prev,
      [id]: prev[id] === 'piece' ? 'unit' : 'piece',
    }))
  }

  function handleSelect(p: Product) {
    const sellBy = getSellBy(p)
    const price = sellBy === 'piece' && p.piece_price != null ? p.piece_price : p.price
    onSelect({
      pieces_per_unit: p.pieces_per_unit ?? 1,
      product_id: p.id,
      product_name: p.name,
      qty: 1,
      sell_by: sellBy,
      total: price,
      unit_price: price,
    })
    onOpenChange(false)
    setSearch('')
    setCategory(ALL)
  }

  const columns = useMemo<ColumnDef<Product>[]>(() => [
    {
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{row.original.name}</span>
          {row.original.category && (
            <span className="text-xs text-muted-foreground">{row.original.category}</span>
          )}
        </div>
      ),
      header: t('picker.columns.name'),
      minSize: 160,
    },
    {
      accessorKey: 'unit',
      cell: ({ getValue }) => <span className="text-muted-foreground">{getValue<string>()}</span>,
      header: t('picker.columns.unit'),
      size: 80,
    },
    {
      accessorKey: 'qty',
      cell: ({ row }) => (
        <span className={row.original.min_qty != null && row.original.qty <= row.original.min_qty ? 'font-bold text-red-600' : 'font-medium'}>
          {row.original.qty}
        </span>
      ),
      header: t('picker.columns.stock'),
      size: 80,
    },
    {
      cell: ({ row }) => {
        const p = row.original
        const sellBy = getSellBy(p)
        const price = sellBy === 'piece' && p.piece_price != null ? p.piece_price : p.price
        return <span className="font-medium">{fmtCurrency(price)}</span>
      },
      header: t('picker.columns.price'),
      id: 'price',
      size: 100,
    },
    {
      cell: ({ row }) => {
        const p = row.original
        const hasPieces = p.pieces_per_unit != null && p.pieces_per_unit > 1
        if (!hasPieces) return <span className="text-muted-foreground text-xs">—</span>
        const sellBy = getSellBy(p)
        return (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 px-2 text-xs"
            onClick={() => toggleSellBy(p.id)}
          >
            {sellBy === 'unit' ? t('picker.sellPiece') : t('picker.sellUnit')}
          </Button>
        )
      },
      header: t('picker.columns.sellBy'),
      id: 'sellBy',
      size: 90,
    },
    {
      cell: ({ row }) => (
        <Button type="button" size="sm" onClick={() => handleSelect(row.original)}>
          {t('picker.add')}
        </Button>
      ),
      header: t('picker.columns.actions'),
      id: 'actions',
      size: 70,
    },
  ], [t, sellByMap])

  const table = useReactTable({
    columns,
    data: filtered,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  })

  const toolbar = (
    <div className="flex flex-wrap gap-2">
      <Input
        placeholder={t('picker.search')}
        value={search}
        onChange={e => {
          setSearch(e.target.value)
          table.setPageIndex(0)
        }}
        className="max-w-xs"
      />
      {categories.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => { setCategory(ALL); table.setPageIndex(0) }}
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              category === ALL
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            {t('picker.allCategories')}
          </button>
          {categories.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => { setCategory(c); table.setPageIndex(0) }}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                category === c
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t('picker.title')}</DialogTitle>
        </DialogHeader>
        <DataTable
          table={table}
          isLoading={isLoading}
          toolbar={toolbar}
          enableRowsPerPage
          wrapperClassName="max-h-[45vh]"
        />
      </DialogContent>
    </Dialog>
  )
}
