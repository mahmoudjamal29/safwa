'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getAllProductsSimpleQuery, type Product } from '@/query/products'
import { fmtCurrency } from '@/utils/formatters'
import type { LineItem } from './new-invoice-form'

interface ProductPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (item: LineItem) => void
}

export function ProductPickerDialog({ open, onOpenChange, onSelect }: ProductPickerDialogProps) {
  const [search, setSearch] = React.useState('')
  const { data: products } = useQuery(getAllProductsSimpleQuery())
  const [sellByMap, setSellByMap] = React.useState<Record<string, 'unit' | 'piece'>>({})

  const filtered = React.useMemo(() => {
    if (!products) return []
    if (!search) return products
    return products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  }, [products, search])

  function getSellBy(p: Product): 'unit' | 'piece' {
    return sellByMap[p.id] ?? 'unit'
  }

  function toggleSellBy(p: Product) {
    setSellByMap(prev => ({
      ...prev,
      [p.id]: prev[p.id] === 'piece' ? 'unit' : 'piece',
    }))
  }

  function handleSelect(p: Product) {
    const sellBy = getSellBy(p)
    const price = sellBy === 'piece' && p.piece_price != null ? p.piece_price : p.price
    const pieces_per_unit = p.pieces_per_unit ?? 1
    onSelect({
      product_id: p.id,
      product_name: p.name,
      sell_by: sellBy,
      qty: 1,
      unit_price: price,
      total: price,
      pieces_per_unit,
    })
    onOpenChange(false)
    setSearch('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>اختيار منتج</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="بحث في المنتجات..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-3"
        />
        <div className="flex flex-col gap-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">لا توجد منتجات</p>
          ) : (
            filtered.map(p => {
              const sellBy = getSellBy(p)
              const hasPieces = p.pieces_per_unit != null && p.pieces_per_unit > 1
              return (
                <div key={p.id} className="flex items-center justify-between rounded-lg border p-3 gap-2">
                  <div className="flex flex-col gap-0.5 flex-1">
                    <span className="font-medium text-sm">{p.name}</span>
                    <span className="text-xs text-muted-foreground">
                      متاح: {p.qty} {p.unit}
                      {hasPieces && ` · ${p.pieces_per_unit} قطعة/وحدة`}
                    </span>
                    <span className="text-xs font-medium">
                      {sellBy === 'piece' && p.piece_price != null
                        ? fmtCurrency(p.piece_price) + ' / قطعة'
                        : fmtCurrency(p.price) + ' / ' + p.unit}
                    </span>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    {hasPieces && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 px-2"
                        onClick={() => toggleSellBy(p)}
                      >
                        {sellBy === 'unit' ? 'بيع قطعة' : 'بيع وحدة'}
                      </Button>
                    )}
                    <Button type="button" size="sm" onClick={() => handleSelect(p)}>
                      إضافة
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
