'use client'

import * as React from 'react'

import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'

import { useCreateCustomer, useUpdateCustomer, type Customer } from '@/query/customers'

import { FieldWrapper } from '@/components/form/field-wrapper'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface CustomerFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer?: Customer | null
}

export function CustomerFormDialog({ customer, onOpenChange, open }: CustomerFormDialogProps) {
  const t = useTranslations('customers')
  const createMutation = useCreateCustomer()
  const updateMutation = useUpdateCustomer()

  const form = useForm({
    defaultValues: {
      address: customer?.address ?? '',
      name: customer?.name ?? '',
      notes: customer?.notes ?? '',
      phone: customer?.phone ?? '',
      tax_number: customer?.tax_number ?? '',
    },
    onSubmit: async ({ value }) => {
      const payload = {
        address: value.address || null,
        name: value.name,
        notes: value.notes || null,
        phone: value.phone || null,
        tax_number: value.tax_number || null,
      }
      if (customer) {
        await updateMutation.mutateAsync({ id: customer.id, payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      onOpenChange(false)
    },
  })

  React.useEffect(() => {
    form.setFieldValue('name', customer?.name ?? '')
    form.setFieldValue('phone', customer?.phone ?? '')
    form.setFieldValue('address', customer?.address ?? '')
    form.setFieldValue('tax_number', customer?.tax_number ?? '')
    form.setFieldValue('notes', customer?.notes ?? '')
  }, [customer, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{customer ? t('editCustomer') : t('newCustomer')}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col gap-4"
        >
          <form.Field name="name">
            {(field) => (
              <FieldWrapper field={field} label={t('form.name')} required>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder={t('form.namePlaceholder')}
                />
              </FieldWrapper>
            )}
          </form.Field>

          <form.Field name="phone">
            {(field) => (
              <FieldWrapper field={field} label={t('form.phone')}>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder={t('form.phonePlaceholder')}
                />
              </FieldWrapper>
            )}
          </form.Field>

          <form.Field name="address">
            {(field) => (
              <FieldWrapper field={field} label={t('form.address')}>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder={t('form.addressPlaceholder')}
                />
              </FieldWrapper>
            )}
          </form.Field>

          <form.Field name="tax_number">
            {(field) => (
              <FieldWrapper field={field} label={t('form.taxNumber')}>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder={t('form.taxPlaceholder')}
                />
              </FieldWrapper>
            )}
          </form.Field>

          <form.Field name="notes">
            {(field) => (
              <FieldWrapper field={field} label={t('form.notes')}>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
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
