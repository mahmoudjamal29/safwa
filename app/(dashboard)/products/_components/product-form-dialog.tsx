'use client'

import * as React from 'react'

import { useTranslations } from 'next-intl'

import { useCreateProduct, useUpdateProduct, type Product } from '@/query/products'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const UNITS = ['كرتون', 'قطعة', 'كيلو', 'لتر', 'جالون', 'طن', 'حبة'] as const

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
}

interface FormState {
  name: string
  sku: string
  category: string
  unit: string
  price: string
  cost: string
  qty: string
  min_qty: string
  max_qty: string
  pieces_per_unit: string
  piece_price: string
}

const defaultForm: FormState = {
  category: '',
  cost: '',
  max_qty: '',
  min_qty: '',
  name: '',
  piece_price: '',
  pieces_per_unit: '',
  price: '',
  qty: '0',
  sku: '',
  unit: 'كرتون',
}

export function ProductFormDialog({ onOpenChange, open, product }: ProductFormDialogProps) {
  const t = useTranslations('products')
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()

  const [form, setForm] = React.useState<FormState>(defaultForm)

  React.useEffect(() => {
    if (product) {
      setForm({
        category: product.category ?? '',
        cost: String(product.cost ?? ''),
        max_qty: product.max_qty != null ? String(product.max_qty) : '',
        min_qty: product.min_qty != null ? String(product.min_qty) : '',
        name: product.name ?? '',
        piece_price: product.piece_price != null ? String(product.piece_price) : '',
        pieces_per_unit: product.pieces_per_unit != null ? String(product.pieces_per_unit) : '',
        price: String(product.price ?? ''),
        qty: String(product.qty ?? '0'),
        sku: product.sku ?? '',
        unit: product.unit ?? 'كرتون',
      })
    } else {
      setForm(defaultForm)
    }
  }, [product, open])

  function set(key: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const showSplit = Boolean(form.pieces_per_unit || form.piece_price)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      category: form.category || null,
      cost: form.cost ? parseFloat(form.cost) : null,
      max_qty: form.max_qty ? parseFloat(form.max_qty) : null,
      min_qty: form.min_qty ? parseFloat(form.min_qty) : null,
      name: form.name,
      piece_price: form.piece_price ? parseFloat(form.piece_price) : null,
      pieces_per_unit: form.pieces_per_unit ? parseInt(form.pieces_per_unit) : null,
      price: parseFloat(form.price) || 0,
      qty: parseFloat(form.qty) || 0,
      sku: form.sku || null,
      unit: form.unit,
    }
    if (product) {
      await updateMutation.mutateAsync({ id: product.id, payload })
    } else {
      await createMutation.mutateAsync(payload)
    }
    onOpenChange(false)
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? t('editProduct') : t('newProduct')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>{t('form.name')} *</Label>
              <Input value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t('form.sku')}</Label>
              <Input value={form.sku} onChange={e => set('sku', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t('form.category')}</Label>
              <Input value={form.category} onChange={e => set('category', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t('form.unit')}</Label>
              <Select value={form.unit} onValueChange={v => set('unit', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map(u => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t('form.price')} *</Label>
              <Input type="number" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t('form.cost')}</Label>
              <Input type="number" step="0.01" value={form.cost} onChange={e => set('cost', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t('form.qty')}</Label>
              <Input type="number" step="0.01" value={form.qty} onChange={e => set('qty', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t('form.minQty')}</Label>
              <Input type="number" step="0.01" value={form.min_qty} onChange={e => set('min_qty', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t('form.maxQty')}</Label>
              <Input type="number" step="0.01" value={form.max_qty} onChange={e => set('max_qty', e.target.value)} />
            </div>
          </div>

          {/* Split settings */}
          <div className="border rounded-lg p-4 flex flex-col gap-3">
            <p className="text-sm font-medium text-muted-foreground">{t('form.splitSettings')}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>{t('form.piecesPerUnit')}</Label>
                <Input type="number" value={form.pieces_per_unit} onChange={e => set('pieces_per_unit', e.target.value)} placeholder={t('form.piecesPlaceholder')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('form.piecePrice')}</Label>
                <Input type="number" step="0.01" value={form.piece_price} onChange={e => set('piece_price', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t('form.cancel')}</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t('form.saving') : t('form.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
