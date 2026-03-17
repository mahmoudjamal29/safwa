'use client'

import { useTranslations } from 'next-intl'
import { Trash2Icon } from '@/lib/icons'

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

import type { LineItem } from './new-invoice-form'

interface LineItemsTableProps {
  items: LineItem[]
  onUpdateItem: (index: number, updates: Partial<LineItem>) => void
  onRemoveItem: (index: number) => void
}

export function LineItemsTable({ items, onRemoveItem, onUpdateItem }: LineItemsTableProps) {
  const t = useTranslations('invoices')
  const subtotal = items.reduce((sum, item) => sum + item.total, 0)

  function handleQtyChange(index: number, value: string) {
    const qty = parseFloat(value) || 0
    const item = items[index]
    onUpdateItem(index, { qty, total: qty * item.unit_price })
  }

  function handlePriceChange(index: number, value: string) {
    const unit_price = parseFloat(value) || 0
    const item = items[index]
    onUpdateItem(index, { total: item.qty * unit_price, unit_price })
  }

  if (items.length === 0) {
    return (
      <div className="border rounded-lg p-6 text-center text-sm text-muted-foreground">
        {t('lineItems.empty')}
      </div>
    )
  }

  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('lineItems.product')}</TableHead>
            <TableHead>{t('lineItems.sellBy')}</TableHead>
            <TableHead>{t('lineItems.qty')}</TableHead>
            <TableHead>{t('lineItems.unitPrice')}</TableHead>
            <TableHead>{t('lineItems.total')}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{item.product_name}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {item.sell_by === 'unit' ? t('lineItems.unit') : t('lineItems.piece')}
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
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-muted/50 font-semibold">
            <TableCell colSpan={4} className="text-left">{t('lineItems.subtotal')}</TableCell>
            <TableCell>{fmtCurrency(subtotal)}</TableCell>
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
