'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateCustomer, useUpdateCustomer, type Customer } from '@/query/customers'

interface CustomerFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer?: Customer | null
}

interface FormState {
  name: string
  phone: string
  address: string
  tax_number: string
  notes: string
}

const defaultForm: FormState = {
  name: '',
  phone: '',
  address: '',
  tax_number: '',
  notes: '',
}

export function CustomerFormDialog({ open, onOpenChange, customer }: CustomerFormDialogProps) {
  const createMutation = useCreateCustomer()
  const updateMutation = useUpdateCustomer()

  const [form, setForm] = React.useState<FormState>(defaultForm)

  React.useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name ?? '',
        phone: customer.phone ?? '',
        address: customer.address ?? '',
        tax_number: customer.tax_number ?? '',
        notes: customer.notes ?? '',
      })
    } else {
      setForm(defaultForm)
    }
  }, [customer, open])

  function set(key: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      name: form.name,
      phone: form.phone || null,
      address: form.address || null,
      tax_number: form.tax_number || null,
      notes: form.notes || null,
    }
    if (customer) {
      await updateMutation.mutateAsync({ id: customer.id, payload })
    } else {
      await createMutation.mutateAsync(payload)
    }
    onOpenChange(false)
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{customer ? 'تعديل العميل' : 'عميل جديد'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>اسم العميل *</Label>
            <Input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="اسم العميل" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>رقم الهاتف</Label>
            <Input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="01xxxxxxxxx" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>العنوان</Label>
            <Input value={form.address} onChange={e => set('address', e.target.value)} placeholder="المحافظة، المنطقة" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>الرقم الضريبي</Label>
            <Input value={form.tax_number} onChange={e => set('tax_number', e.target.value)} placeholder="اختياري" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>ملاحظات</Label>
            <Input value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
