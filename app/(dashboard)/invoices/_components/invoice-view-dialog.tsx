'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fmtCurrency, fmtDate } from '@/utils/formatters'
import { getPaymentsByInvoiceQuery } from '@/query/payments'
import { InvoiceStatusBadge } from './invoice-status-badge'
import { PaymentDialog } from './payment-dialog'
import type { Invoice } from '@/query/invoices'

interface InvoiceViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice | null
}

export function InvoiceViewDialog({ open, onOpenChange, invoice }: InvoiceViewDialogProps) {
  const [paymentOpen, setPaymentOpen] = React.useState(false)

  const { data: payments } = useQuery({
    ...getPaymentsByInvoiceQuery(invoice?.id ?? ''),
    enabled: !!invoice?.id && open,
  })

  if (!invoice) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>فاتورة رقم {invoice.invoice_number}</DialogTitle>
          </DialogHeader>

          {/* Invoice info */}
          <div className="grid grid-cols-2 gap-3 text-sm bg-muted rounded-lg p-4">
            <div><span className="text-muted-foreground">العميل: </span><span className="font-medium">{invoice.customer_name}</span></div>
            <div><span className="text-muted-foreground">التاريخ: </span><span className="font-medium">{fmtDate(invoice.invoice_date)}</span></div>
            <div className="flex items-center gap-2"><span className="text-muted-foreground">الحالة: </span><InvoiceStatusBadge status={invoice.status} /></div>
            <div><span className="text-muted-foreground">الإجمالي: </span><span className="font-bold">{fmtCurrency(invoice.total)}</span></div>
            <div><span className="text-muted-foreground">المدفوع: </span><span className="font-medium text-green-600">{fmtCurrency(invoice.paid_amount)}</span></div>
            <div><span className="text-muted-foreground">المتبقي: </span><span className="font-medium text-red-600">{fmtCurrency(invoice.total - invoice.paid_amount)}</span></div>
          </div>

          {/* Line items */}
          <div>
            <h3 className="font-semibold mb-2 text-sm">بنود الفاتورة</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المنتج</TableHead>
                  <TableHead>البيع بـ</TableHead>
                  <TableHead>الكمية</TableHead>
                  <TableHead>سعر الوحدة</TableHead>
                  <TableHead>الإجمالي</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(invoice.items ?? []).map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell>{item.sell_by === 'unit' ? 'وحدة' : 'قطعة'}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>{fmtCurrency(item.price)}</TableCell>
                    <TableCell>{fmtCurrency(item.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totals summary */}
          <div className="flex flex-col gap-1 text-sm border-t pt-3">
            <div className="flex justify-between"><span className="text-muted-foreground">المجموع الفرعي:</span><span>{fmtCurrency(invoice.subtotal)}</span></div>
            {invoice.tax_percent > 0 && (
              <div className="flex justify-between"><span className="text-muted-foreground">ضريبة ({invoice.tax_percent}%):</span><span>{fmtCurrency(invoice.tax_amount)}</span></div>
            )}
            <div className="flex justify-between font-bold text-base"><span>الإجمالي:</span><span>{fmtCurrency(invoice.total)}</span></div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="text-sm text-muted-foreground border rounded-lg p-3">
              <span className="font-medium text-foreground">ملاحظات: </span>{invoice.notes}
            </div>
          )}

          {/* Payment history */}
          <div>
            <h3 className="font-semibold mb-2 text-sm">سجل الدفعات</h3>
            {!payments || payments.length === 0 ? (
              <p className="text-sm text-muted-foreground">لا توجد دفعات</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>طريقة الدفع</TableHead>
                    <TableHead>ملاحظة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map(p => (
                    <TableRow key={p.id}>
                      <TableCell>{fmtDate(p.created_at)}</TableCell>
                      <TableCell className="font-medium">{fmtCurrency(p.amount)}</TableCell>
                      <TableCell>{p.method}</TableCell>
                      <TableCell className="text-muted-foreground">{p.note ?? '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="flex justify-between">
            {invoice.status !== 'مدفوعة' && invoice.status !== 'ملغاة' && (
              <Button onClick={() => setPaymentOpen(true)}>تسجيل دفعة</Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>إغلاق</Button>
          </div>
        </DialogContent>
      </Dialog>

      {paymentOpen && (
        <PaymentDialog
          open={paymentOpen}
          onOpenChange={setPaymentOpen}
          invoice={invoice}
        />
      )}
    </>
  )
}
