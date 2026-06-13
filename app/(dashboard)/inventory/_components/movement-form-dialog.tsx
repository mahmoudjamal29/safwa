'use client'

import { useEffect, useState } from 'react'

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
  const [productSearch, setProductSearch] = useState('')

  const { data: products } = useQuery(getAllProductsSimpleQuery())

  const filteredProducts = (products ?? []).filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  )

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
      setProductSearch('')
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
          {/* Product searchable combobox */}
          <form.Field name="product_id">
            {(field) => (
              <FieldWrapper field={field} label={t('form.product')}>
                <div className="flex flex-col gap-1">
                  <Input
                    placeholder={t('form.productSearch')}
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    autoComplete="off"
                  />
                  {productSearch.length > 0 && (
                    <div className="max-h-48 overflow-y-auto rounded-md border bg-popover shadow-md">
                      {filteredProducts.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-muted-foreground">لا توجد نتائج</div>
                      ) : (
                        filteredProducts.map(p => (
                          <button
                            key={p.id}
                            type="button"
                            className={`w-full px-3 py-2 text-start text-sm hover:bg-accent transition-colors ${
                              field.state.value === p.id ? 'bg-accent font-medium' : ''
                            }`}
                            onClick={() => {
                              field.handleChange(p.id)
                              form.setFieldValue('product_name', p.name)
                              setProductSearch(p.name)
                            }}
                          >
                            {p.name}
                            <span className="text-muted-foreground ms-2 text-xs">({p.qty} {p.unit})</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                  {field.state.value && productSearch === products?.find(p => p.id === field.state.value)?.name && (
                    <div className="text-xs text-muted-foreground px-1">
                      {products?.find(p => p.id === field.state.value)?.name} — {t('form.productSearch').replace('...', '')}
                    </div>
                  )}
                </div>
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
