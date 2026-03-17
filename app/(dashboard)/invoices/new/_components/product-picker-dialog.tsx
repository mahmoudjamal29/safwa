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

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table/data-table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
      header: t('picker.columns.name'),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{row.original.name}</span>
          {row.original.category && (
            <span className="text-xs text-muted-foreground">{row.original.category}</span>
          )}
        </div>
      ),
      minSize: 160,
    },
    {
      accessorKey: 'unit',
      header: t('picker.columns.unit'),
      cell: ({ getValue }) => <span className="text-muted-foreground">{getValue<string>()}</span>,
      size: 80,
    },
    {
      accessorKey: 'qty',
      header: t('picker.columns.stock'),
      cell: ({ row }) => (
        <span className={row.original.min_qty != null && row.original.qty <= row.original.min_qty ? 'font-bold text-red-600' : 'font-medium'}>
          {row.original.qty}
        </span>
      ),
      size: 80,
    },
    {
      id: 'price',
      header: t('picker.columns.price'),
      cell: ({ row }) => {
        const p = row.original
        const sellBy = getSellBy(p)
        const price = sellBy === 'piece' && p.piece_price != null ? p.piece_price : p.price
        return <span className="font-medium">{fmtCurrency(price)}</span>
      },
      size: 100,
    },
    {
      id: 'sellBy',
      header: t('picker.columns.sellBy'),
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
      size: 90,
    },
    {
      id: 'actions',
      header: t('picker.columns.actions'),
      cell: ({ row }) => (
        <Button type="button" size="sm" onClick={() => handleSelect(row.original)}>
          {t('picker.add')}
        </Button>
      ),
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
        <Select
          value={category}
          onValueChange={v => {
            setCategory(v)
            table.setPageIndex(0)
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder={t('picker.allCategories')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t('picker.allCategories')}</SelectItem>
            {categories.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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
