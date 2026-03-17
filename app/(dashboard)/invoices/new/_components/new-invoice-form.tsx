'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'

import { createClient } from '@/lib/supabase/client'

import { getAllCustomersSimpleQuery } from '@/query/customers'
import { useCreateMovement } from '@/query/inventory'
import { useCreateInvoice, type InvoiceStatus } from '@/query/invoices'

import { fmtCurrency } from '@/utils/formatters'

import { FieldWrapper } from '@/components/form/field-wrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { LineItemsTable } from './line-items-table'
import { ProductPickerDialog } from './product-picker-dialog'

export interface LineItem {
  product_id: string
  product_name: string
  sell_by: 'unit' | 'piece'
  qty: number
  unit_price: number
  total: number
  pieces_per_unit: number
}

interface FormState {
  customer_id: string
  customer_name: string
  invoice_date: string
  status: InvoiceStatus
  tax_percent: string
  notes: string
  paid_amount: string
}

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

async function getNextInvoiceNumber() {
  const supabase = createClient()
  const { count } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
  const num = (count ?? 0) + 1
  return `INV-${String(num).padStart(5, '0')}`
}

export function NewInvoiceForm() {
  const router = useRouter()
  const t = useTranslations('invoices')
  const createInvoice = useCreateInvoice()
  const createMovement = useCreateMovement()

  const [form, setForm] = React.useState<FormState>({
    customer_id: '',
    customer_name: '',
    invoice_date: todayStr(),
    notes: '',
    paid_amount: '0',
    status: 'معلقة',
    tax_percent: '0',
  })
  const [items, setItems] = React.useState<LineItem[]>([])
  const [pickerOpen, setPickerOpen] = React.useState(false)
  const [customerSearch, setCustomerSearch] = React.useState('')

  const { data: customers } = useQuery(getAllCustomersSimpleQuery())

  const filteredCustomers = React.useMemo(() => {
    if (!customers) return []
    if (!customerSearch) return customers.slice(0, 20)
    return customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase())).slice(0, 20)
  }, [customers, customerSearch])

  function set(key: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function addItem(item: LineItem) {
    setItems(prev => [...prev, item])
  }

  function updateItem(index: number, updates: Partial<LineItem>) {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, ...updates } : item))
  }

  function removeItem(index: number) {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const taxPercent = parseFloat(form.tax_percent) || 0
  const taxAmount = subtotal * (taxPercent / 100)
  const grandTotal = subtotal + taxAmount

  function handleReset() {
    setForm({
      customer_id: '',
      customer_name: '',
      invoice_date: todayStr(),
      notes: '',
      paid_amount: '0',
      status: 'معلقة',
      tax_percent: '0',
    })
    setItems([])
    setCustomerSearch('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (items.length === 0) return

    const invoiceNumber = await getNextInvoiceNumber()

    await createInvoice.mutateAsync({
      customer_id: form.customer_id || null,
      customer_name: form.customer_name || t('form.unknownCustomer'),
      invoice_date: form.invoice_date,
      invoice_number: invoiceNumber,
      items: JSON.stringify(items),
      notes: form.notes || undefined,
      paid_amount: parseFloat(form.paid_amount) || 0,
      status: form.status,
      subtotal,
      tax_amount: taxAmount,
      tax_percent: taxPercent,
      total: grandTotal,
    })

    for (const item of items) {
      await createMovement.mutateAsync({
        note: `${t('form.invoiceRef')} ${invoiceNumber}`,
        product_id: item.product_id,
        product_name: item.product_name,
        qty: item.sell_by === 'piece' ? item.qty / (item.pieces_per_unit || 1) : item.qty,
        type: 'صادر',
      })
    }

    handleReset()
    router.push('/invoices')
  }

  const isPending = createInvoice.isPending || createMovement.isPending

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Customer + Date + Status */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-1">
          <FieldWrapper label={t('form.customer')}>
            <Input
              placeholder={t('form.customerSearch')}
              value={customerSearch}
              onChange={e => {
                setCustomerSearch(e.target.value)
                set('customer_id', '')
                set('customer_name', e.target.value)
              }}
            />
            {customerSearch && filteredCustomers.length > 0 && !form.customer_id && (
              <div className="border rounded-md bg-background shadow-md max-h-40 overflow-y-auto z-10">
                {filteredCustomers.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    className="w-full text-right px-3 py-2 text-sm hover:bg-accent"
                    onClick={() => {
                      set('customer_id', c.id)
                      set('customer_name', c.name)
                      setCustomerSearch(c.name)
                    }}
                  >
                    {c.name} {c.phone ? `(${c.phone})` : ''}
                  </button>
                ))}
              </div>
            )}
          </FieldWrapper>
        </div>

        <FieldWrapper label={t('form.invoiceDate')}>
          <Input
            type="date"
            value={form.invoice_date}
            onChange={e => set('invoice_date', e.target.value)}
            required
          />
        </FieldWrapper>

        <FieldWrapper label={t('form.status')}>
          <Select value={form.status} onValueChange={v => set('status', v as InvoiceStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="معلقة">{t('statuses.pending')}</SelectItem>
              <SelectItem value="مدفوعة">{t('statuses.paid')}</SelectItem>
              <SelectItem value="مدفوعة جزئياً">{t('statuses.partiallyPaid')}</SelectItem>
              <SelectItem value="ملغاة">{t('statuses.cancelled')}</SelectItem>
            </SelectContent>
          </Select>
        </FieldWrapper>
      </div>

      {/* Line items */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold">{t('form.items')}</span>
          <Button type="button" variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
            {t('form.addProduct')}
          </Button>
        </div>
        <LineItemsTable items={items} onUpdateItem={updateItem} onRemoveItem={removeItem} />
      </div>

      {/* Totals */}
      <div className="rounded-xl border p-4 flex flex-col gap-2 text-sm bg-muted/30">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('form.subtotal')}:</span>
          <span className="font-medium">{fmtCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{t('form.tax')}:</span>
          <Input
            type="number"
            min="0"
            max="100"
            step="0.5"
            value={form.tax_percent}
            onChange={e => set('tax_percent', e.target.value)}
            className="h-8 w-20"
          />
          <span className="font-medium">{fmtCurrency(taxAmount)}</span>
        </div>
        <div className="flex justify-between font-bold text-base border-t pt-2">
          <span>{t('form.grandTotal')}:</span>
          <span>{fmtCurrency(grandTotal)}</span>
        </div>
      </div>

      {/* Paid amount + Notes */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldWrapper label={t('form.paid')}>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={form.paid_amount}
            onChange={e => set('paid_amount', e.target.value)}
          />
        </FieldWrapper>

        <FieldWrapper label={t('form.notes')}>
          <Input
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder={t('form.notesPlaceholder')}
          />
        </FieldWrapper>
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={handleReset}>{t('form.reset')}</Button>
        <Button type="submit" disabled={isPending || items.length === 0}>
          {isPending ? t('payment.saving') : t('form.save')}
        </Button>
      </div>

      <ProductPickerDialog open={pickerOpen} onOpenChange={setPickerOpen} onSelect={addItem} />
    </form>
  )
}
