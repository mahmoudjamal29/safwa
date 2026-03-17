'use client'

import * as React from 'react'

import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'

import { useCreateProduct, useUpdateProduct, type Product } from '@/query/products'

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

const UNITS = ['كرتون', 'قطعة', 'كيلو', 'لتر', 'جالون', 'طن', 'حبة'] as const

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
}

export function ProductFormDialog({ onOpenChange, open, product }: ProductFormDialogProps) {
  const t = useTranslations('products')
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()

  const form = useForm({
    defaultValues: {
      name: product?.name ?? '',
      sku: product?.sku ?? '',
      category: product?.category ?? '',
      unit: product?.unit ?? 'كرتون',
      price: product?.price != null ? String(product.price) : '',
      cost: product?.cost != null ? String(product.cost) : '',
      qty: product?.qty != null ? String(product.qty) : '0',
      min_qty: product?.min_qty != null ? String(product.min_qty) : '',
      max_qty: product?.max_qty != null ? String(product.max_qty) : '',
      pieces_per_unit: product?.pieces_per_unit != null ? String(product.pieces_per_unit) : '',
      piece_price: product?.piece_price != null ? String(product.piece_price) : '',
    },
    onSubmit: async ({ value }) => {
      const payload = {
        name: value.name,
        sku: value.sku || null,
        category: value.category || null,
        unit: value.unit,
        price: parseFloat(value.price) || 0,
        cost: value.cost ? parseFloat(value.cost) : null,
        qty: parseFloat(value.qty) || 0,
        min_qty: value.min_qty ? parseFloat(value.min_qty) : null,
        max_qty: value.max_qty ? parseFloat(value.max_qty) : null,
        pieces_per_unit: value.pieces_per_unit ? parseInt(value.pieces_per_unit) : null,
        piece_price: value.piece_price ? parseFloat(value.piece_price) : null,
      }
      if (product) {
        await updateMutation.mutateAsync({ id: product.id, payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      onOpenChange(false)
    },
  })

  React.useEffect(() => {
    form.setFieldValue('name', product?.name ?? '')
    form.setFieldValue('sku', product?.sku ?? '')
    form.setFieldValue('category', product?.category ?? '')
    form.setFieldValue('unit', product?.unit ?? 'كرتون')
    form.setFieldValue('price', product?.price != null ? String(product.price) : '')
    form.setFieldValue('cost', product?.cost != null ? String(product.cost) : '')
    form.setFieldValue('qty', product?.qty != null ? String(product.qty) : '0')
    form.setFieldValue('min_qty', product?.min_qty != null ? String(product.min_qty) : '')
    form.setFieldValue('max_qty', product?.max_qty != null ? String(product.max_qty) : '')
    form.setFieldValue('pieces_per_unit', product?.pieces_per_unit != null ? String(product.pieces_per_unit) : '')
    form.setFieldValue('piece_price', product?.piece_price != null ? String(product.piece_price) : '')
  }, [product, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? t('editProduct') : t('newProduct')}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form.Field name="name">
              {(field) => (
                <FieldWrapper field={field} label={`${t('form.name')} *`}>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    required
                  />
                </FieldWrapper>
              )}
            </form.Field>

            <form.Field name="sku">
              {(field) => (
                <FieldWrapper field={field} label={t('form.sku')}>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </FieldWrapper>
              )}
            </form.Field>

            <form.Field name="category">
              {(field) => (
                <FieldWrapper field={field} label={t('form.category')}>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </FieldWrapper>
              )}
            </form.Field>

            <form.Field name="unit">
              {(field) => (
                <FieldWrapper field={field} label={t('form.unit')}>
                  <Select value={field.state.value} onValueChange={field.handleChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map(u => (
                        <SelectItem key={u} value={u}>{u}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldWrapper>
              )}
            </form.Field>

            <form.Field name="price">
              {(field) => (
                <FieldWrapper field={field} label={`${t('form.price')} *`}>
                  <Input
                    type="number"
                    step="0.01"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    required
                  />
                </FieldWrapper>
              )}
            </form.Field>

            <form.Field name="cost">
              {(field) => (
                <FieldWrapper field={field} label={t('form.cost')}>
                  <Input
                    type="number"
                    step="0.01"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </FieldWrapper>
              )}
            </form.Field>

            <form.Field name="qty">
              {(field) => (
                <FieldWrapper field={field} label={t('form.qty')}>
                  <Input
                    type="number"
                    step="0.01"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </FieldWrapper>
              )}
            </form.Field>

            <form.Field name="min_qty">
              {(field) => (
                <FieldWrapper field={field} label={t('form.minQty')}>
                  <Input
                    type="number"
                    step="0.01"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </FieldWrapper>
              )}
            </form.Field>

            <form.Field name="max_qty">
              {(field) => (
                <FieldWrapper field={field} label={t('form.maxQty')}>
                  <Input
                    type="number"
                    step="0.01"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </FieldWrapper>
              )}
            </form.Field>
          </div>

          {/* Split settings */}
          <div className="border rounded-lg p-4 flex flex-col gap-3">
            <p className="text-sm font-medium text-muted-foreground">{t('form.splitSettings')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <form.Field name="pieces_per_unit">
                {(field) => (
                  <FieldWrapper field={field} label={t('form.piecesPerUnit')}>
                    <Input
                      type="number"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder={t('form.piecesPlaceholder')}
                    />
                  </FieldWrapper>
                )}
              </form.Field>

              <form.Field name="piece_price">
                {(field) => (
                  <FieldWrapper field={field} label={t('form.piecePrice')}>
                    <Input
                      type="number"
                      step="0.01"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </FieldWrapper>
                )}
              </form.Field>
            </div>
          </div>

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
