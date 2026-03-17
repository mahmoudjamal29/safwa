'use client'

import { fmtCurrency } from '@/utils/formatters'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Trash2 } from 'lucide-react'
import type { LineItem } from './new-invoice-form'

interface LineItemsTableProps {
  items: LineItem[]
  onUpdateItem: (index: number, updates: Partial<LineItem>) => void
  onRemoveItem: (index: number) => void
}

export function LineItemsTable({ items, onUpdateItem, onRemoveItem }: LineItemsTableProps) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0)

  function handleQtyChange(index: number, value: string) {
    const qty = parseFloat(value) || 0
    const item = items[index]
    onUpdateItem(index, { qty, total: qty * item.unit_price })
  }

  function handlePriceChange(index: number, value: string) {
    const unit_price = parseFloat(value) || 0
    const item = items[index]
    onUpdateItem(index, { unit_price, total: item.qty * unit_price })
  }

  if (items.length === 0) {
    return (
      <div className="border rounded-lg p-6 text-center text-sm text-muted-foreground">
        لم يتم إضافة منتجات بعد. اضغط &quot;+ إضافة منتج&quot; للبدء.
      </div>
    )
  }

  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>المنتج</TableHead>
            <TableHead>البيع بـ</TableHead>
            <TableHead>الكمية</TableHead>
            <TableHead>سعر الوحدة</TableHead>
            <TableHead>الإجمالي</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{item.product_name}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {item.sell_by === 'unit' ? 'وحدة' : 'قطعة'}
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={item.qty}
                  onChange={e => handleQtyChange(i, e.target.value)}
                  className="w-20 h-8"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unit_price}
                  onChange={e => handlePriceChange(i, e.target.value)}
                  className="w-24 h-8"
                />
              </TableCell>
              <TableCell className="font-medium">{fmtCurrency(item.total)}</TableCell>
              <TableCell>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="text-destructive h-8 w-8"
                  onClick={() => onRemoveItem(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-muted/50 font-semibold">
            <TableCell colSpan={4} className="text-left">المجموع الفرعي</TableCell>
            <TableCell>{fmtCurrency(subtotal)}</TableCell>
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
