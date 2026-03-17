'use client'

import { useEffect } from 'react'

import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'

import { useCreateMovement, type MovementType } from '@/query/inventory'
import { getAllProductsSimpleQuery } from '@/query/products'

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

interface MovementFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MovementFormDialog({ onOpenChange, open }: MovementFormDialogProps) {
  const t = useTranslations('inventory')
  const createMutation = useCreateMovement()

  const { data: products } = useQuery(getAllProductsSimpleQuery())

  const form = useForm({
    defaultValues: {
      note: '',
      product_id: '',
      product_name: '',
      qty: 0,
      type: 'وارد' as MovementType,
    },
    onSubmit: async ({ value }) => {
      await createMutation.mutateAsync({
        note: value.note || null,
        product_id: value.product_id || null,
        product_name: value.product_name,
        qty: value.qty,
        type: value.type,
      })
      onOpenChange(false)
    },
  })

  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('form.title')}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col gap-4"
        >
          {/* Product select */}
          <form.Field name="product_id">
            {(field) => (
              <FieldWrapper field={field} label={t('form.product')}>
                <Select
                  value={field.state.value}
                  onValueChange={(id) => {
                    field.handleChange(id)
                    const selected = products?.find(p => p.id === id)
                    if (selected) {
                      form.setFieldValue('product_name', selected.name)
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('form.productSearch')} />
                  </SelectTrigger>
                  <SelectContent>
                    {(products ?? []).map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.qty} {p.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldWrapper>
            )}
          </form.Field>

          {/* Movement type select */}
          <form.Field name="type">
            {(field) => (
              <FieldWrapper field={field} label={t('form.movementType')}>
                <Select
                  value={field.state.value}
                  onValueChange={(v) => field.handleChange(v as MovementType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="وارد">{t('types.incomingFull')}</SelectItem>
                    <SelectItem value="صادر">{t('types.outgoingFull')}</SelectItem>
                    <SelectItem value="تسوية">{t('types.adjustmentFull')}</SelectItem>
                    <SelectItem value="تالف">{t('types.damagedFull')}</SelectItem>
                  </SelectContent>
                </Select>
              </FieldWrapper>
            )}
          </form.Field>

          {/* Qty */}
          <form.Field name="qty">
            {(field) => (
              <FieldWrapper field={field} label={t('form.qty')}>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={String(field.state.value)}
                  onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
                  onBlur={field.handleBlur}
                />
              </FieldWrapper>
            )}
          </form.Field>

          {/* Note */}
          <form.Field name="note">
            {(field) => (
              <FieldWrapper field={field} label={t('form.note')}>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder={t('form.optional')}
                />
              </FieldWrapper>
            )}
          </form.Field>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('form.cancel')}
            </Button>
            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t('form.saving') : t('form.save')}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
