'use client'

import * as React from 'react'

import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'

import type { Invoice } from '@/query/invoices'
import { useRecordPayment } from '@/query/payments'

import { fmtCurrency } from '@/utils/formatters'

import { FieldWrapper } from '@/components/form/field-wrapper'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice
}

export function PaymentDialog({ invoice, onOpenChange, open }: PaymentDialogProps) {
  const t = useTranslations('invoices')
  const recordPayment = useRecordPayment()

  const remaining = invoice.total - invoice.paid_amount

  const form = useForm({
    defaultValues: {
      amount: '',
      method: 'نقدي',
      note: '',
    },
    onSubmit: async ({ value }) => {
      await recordPayment.mutateAsync({
        amount: parseFloat(value.amount) || 0,
        customer_id: invoice.customer_id,
        customer_name: invoice.customer_name,
        invoice_id: invoice.id,
        method: value.method,
        note: value.note || null,
      })
      onOpenChange(false)
    },
  })

  React.useEffect(() => {
    if (!open) form.reset()
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('payment.title')} — {invoice.invoice_number}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col gap-4"
        >
          <div className="rounded-lg bg-muted p-3 text-sm flex justify-between">
            <span className="text-muted-foreground">{t('payment.remaining')}:</span>
            <span className="font-bold text-red-600">{fmtCurrency(remaining)}</span>
          </div>

          <form.Field
            name="amount"
            validators={{
              onChange: ({ value }) => {
                if (!value) return t('validation.amountRequired')
                const v = parseFloat(value)
                if (isNaN(v) || v <= 0) return t('validation.amountPositive')
                if (v > remaining) return t('validation.amountExceedsRemaining')
                return undefined
              },
            }}
          >
            {(field) => (
              <FieldWrapper field={field} label={t('payment.amount')} required>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={remaining}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={() => field.handleChange(remaining.toFixed(2))}
                  >
                    {t('payment.payFull')}
                  </Button>
                </div>
              </FieldWrapper>
            )}
          </form.Field>

          <form.Field name="method">
            {(field) => (
              <FieldWrapper field={field} label={t('payment.method')}>
                <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="نقدي">{t('payment.cash')}</SelectItem>
                    <SelectItem value="تحويل">{t('payment.transfer')}</SelectItem>
                    <SelectItem value="شيك">{t('payment.check')}</SelectItem>
                  </SelectContent>
                </Select>
              </FieldWrapper>
            )}
          </form.Field>

          <form.Field name="note">
            {(field) => (
              <FieldWrapper field={field} label={t('payment.note')}>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder={t('payment.optional')}
                />
              </FieldWrapper>
            )}
          </form.Field>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('payment.cancel')}
            </Button>
            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t('payment.saving') : t('payment.save')}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
