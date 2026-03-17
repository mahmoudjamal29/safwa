'use client'

import * as React from 'react'

import { useQuery } from '@tanstack/react-query'

import { useCreateMovement, type MovementType } from '@/query/inventory'
import { getAllProductsSimpleQuery } from '@/query/products'

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

const MOVEMENT_TYPES: { label: string; value: MovementType; }[] = [
  { label: 'وارد (استلام)', value: 'وارد' },
  { label: 'صادر (شحن)', value: 'صادر' },
  { label: 'تسوية مخزون', value: 'تسوية' },
  { label: 'تالف / مرتجع', value: 'تالف' },
]

interface MovementFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FormState {
  product_id: string
  product_name: string
  type: MovementType
  qty: string
  note: string
}

const defaultForm: FormState = {
  note: '',
  product_id: '',
  product_name: '',
  qty: '',
  type: 'وارد',
}

export function MovementFormDialog({ onOpenChange, open }: MovementFormDialogProps) {
  const createMutation = useCreateMovement()
  const [form, setForm] = React.useState<FormState>(defaultForm)
  const [productSearch, setProductSearch] = React.useState('')

  const { data: products } = useQuery(getAllProductsSimpleQuery())

  const filteredProducts = React.useMemo(() => {
    if (!products) return []
    if (!productSearch) return products.slice(0, 20)
    return products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())).slice(0, 20)
  }, [products, productSearch])

  React.useEffect(() => {
    if (!open) {
      setForm(defaultForm)
      setProductSearch('')
    }
  }, [open])

  function set(key: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function selectProduct(id: string, name: string) {
    setForm(prev => ({ ...prev, product_id: id, product_name: name }))
    setProductSearch(name)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await createMutation.mutateAsync({
      note: form.note || null,
      product_id: form.product_id || null,
      product_name: form.product_name,
      qty: parseFloat(form.qty) || 0,
      type: form.type,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>حركة جديدة</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Product combobox */}
          <div className="flex flex-col gap-1.5">
            <Label>المنتج *</Label>
            <Input
              placeholder="ابحث عن منتج..."
              value={productSearch}
              onChange={e => { setProductSearch(e.target.value); set('product_id', ''); set('product_name', e.target.value) }}
              required={!form.product_id}
            />
            {productSearch && filteredProducts.length > 0 && !form.product_id && (
              <div className="border rounded-md bg-background shadow-md max-h-40 overflow-y-auto">
                {filteredProducts.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    className="w-full text-right px-3 py-2 text-sm hover:bg-accent"
                    onClick={() => selectProduct(p.id, p.name)}
                  >
                    {p.name} ({p.qty} {p.unit})
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>نوع الحركة *</Label>
            <Select value={form.type} onValueChange={v => set('type', v as MovementType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOVEMENT_TYPES.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>الكمية *</Label>
            <Input type="number" step="0.01" min="0.01" value={form.qty} onChange={e => set('qty', e.target.value)} required />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>ملاحظة</Label>
            <Input value={form.note} onChange={e => set('note', e.target.value)} placeholder="اختياري" />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
