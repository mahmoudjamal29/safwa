'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRecordPayment } from '@/query/payments'
import { fmtCurrency } from '@/utils/formatters'
import type { Invoice } from '@/query/invoices'

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice
}

export function PaymentDialog({ open, onOpenChange, invoice }: PaymentDialogProps) {
  const recordPayment = useRecordPayment()
  const [amount, setAmount] = React.useState('')
  const [method, setMethod] = React.useState('نقدي')
  const [note, setNote] = React.useState('')

  const remaining = invoice.total - invoice.paid_amount

  React.useEffect(() => {
    if (!open) {
      setAmount('')
      setMethod('نقدي')
      setNote('')
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await recordPayment.mutateAsync({
      invoice_id: invoice.id,
      customer_id: invoice.customer_id,
      customer_name: invoice.customer_name,
      amount: parseFloat(amount) || 0,
      method,
      note: note || null,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>تسجيل دفعة — فاتورة {invoice.invoice_number}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="rounded-lg bg-muted p-3 text-sm flex justify-between">
            <span className="text-muted-foreground">المتبقي:</span>
            <span className="font-bold text-red-600">{fmtCurrency(remaining)}</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>المبلغ *</Label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              max={remaining}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>طريقة الدفع</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="نقدي">نقدي</SelectItem>
                <SelectItem value="تحويل">تحويل</SelectItem>
                <SelectItem value="شيك">شيك</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>ملاحظة</Label>
            <Input value={note} onChange={e => setNote(e.target.value)} placeholder="اختياري" />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
            <Button type="submit" disabled={recordPayment.isPending}>
              {recordPayment.isPending ? 'جاري التسجيل...' : 'تسجيل الدفعة'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
