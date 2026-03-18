"use client";

import * as React from "react";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

import type { Invoice } from "@/query/invoices";
import { getPaymentsByInvoiceQuery } from "@/query/payments";
import { INVOICE_STATUSES } from "@/lib/constants/statuses";

import { fmtCurrency, fmtDate } from "@/utils/formatters";
import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { InvoiceStatusBadge } from "./invoice-status-badge";
import { InvoicePrint } from "./invoice-print";
import { PaymentDialog } from "./payment-dialog";

interface InvoiceViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}

export function InvoiceViewDialog({
  invoice,
  onOpenChange,
  open,
}: InvoiceViewDialogProps) {
  const t = useTranslations("invoices");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [paymentOpen, setPaymentOpen] = React.useState(false);

  const { data: payments } = useQuery({
    ...getPaymentsByInvoiceQuery(invoice?.id ?? ""),
    enabled: !!invoice?.id && open,
  });

  if (!invoice) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {t("view.title")} {invoice.invoice_number}
            </DialogTitle>
          </DialogHeader>

          {/* Invoice info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-muted rounded-lg p-4">
            <div>
              <span className="text-muted-foreground">
                {t("view.customer")}:{" "}
              </span>
              <span className="font-medium">{invoice.customer_name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">{t("view.date")}: </span>
              <span className="font-medium">
                {fmtDate(invoice.invoice_date)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">
                {t("view.status")}:{" "}
              </span>
              <InvoiceStatusBadge status={invoice.status} />
            </div>
            <div>
              <span className="text-muted-foreground">{t("view.total")}: </span>
              <span className="font-bold">{fmtCurrency(invoice.total)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">{t("view.paid")}: </span>
              <span className="font-medium text-green-600">
                {fmtCurrency(invoice.paid_amount)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">
                {t("view.remaining")}:{" "}
              </span>
              <span className="font-medium text-red-600">
                {fmtCurrency(invoice.total - invoice.paid_amount)}
              </span>
            </div>
          </div>

          {/* Line items */}
          <div>
            <h3 className="font-semibold my-2 text-sm">
              {t("view.lineItems")}
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("lineItems.product")}</TableHead>
                    <TableHead>{t("view.sellBy")}</TableHead>
                    <TableHead>{t("lineItems.qty")}</TableHead>
                    <TableHead>{t("lineItems.unitPrice")}</TableHead>
                    <TableHead>{t("lineItems.total")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(invoice.items ?? []).map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell>
                        {item.sell_by === "unit"
                          ? t("view.unit")
                          : t("view.piece")}
                      </TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>{fmtCurrency(item.price)}</TableCell>
                      <TableCell>{fmtCurrency(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Totals summary */}
          <div className="flex flex-col gap-3 text-sm border-t pt-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t("view.subtotal")}:
              </span>
              <span>{fmtCurrency(invoice.subtotal)}</span>
            </div>
            {(invoice.discount_percent ?? 0) > 0 && (
              <div className="flex justify-between text-amber-600 dark:text-amber-400">
                <span>
                  {t("view.discount")} ({invoice.discount_percent}%):
                </span>
                <span>- {fmtCurrency(invoice.discount_amount ?? 0)}</span>
              </div>
            )}
            {invoice.tax_percent > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("view.tax")} ({invoice.tax_percent}%):
                </span>
                <span>{fmtCurrency(invoice.tax_amount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base">
              <span>{t("view.grandTotal")}:</span>
              <span>{fmtCurrency(invoice.total)}</span>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="text-sm text-muted-foreground border rounded-lg p-3">
              <span className="font-medium text-foreground">
                {t("view.notes")}:{" "}
              </span>
              {invoice.notes}
            </div>
          )}

          {/* Payment history */}
          <div>
            <h3 className="font-semibold mb-2 text-sm">
              {t("view.paymentHistory")}
            </h3>
            {!payments || payments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("view.noPayments")}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("view.date")}</TableHead>
                      <TableHead>{t("view.amount")}</TableHead>
                      <TableHead>{t("view.method")}</TableHead>
                      <TableHead>{t("view.note")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{fmtDate(p.created_at)}</TableCell>
                        <TableCell className="font-medium">
                          {fmtCurrency(p.amount)}
                        </TableCell>
                        <TableCell>{p.method}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {p.note ?? "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            {invoice.status !== INVOICE_STATUSES.PAID && invoice.status !== INVOICE_STATUSES.CANCELLED && (
              <Button onClick={() => setPaymentOpen(true)}>
                {t("view.recordPayment")}
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="size-4" />
                {isRTL ? 'طباعة' : 'Print'}
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {t("view.close")}
              </Button>
            </div>
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

      <div className="hidden print:block">
        <InvoicePrint invoice={invoice} payments={payments ?? []} />
      </div>
      {paymentOpen && (
        <PaymentDialog
          open={paymentOpen}
          onOpenChange={setPaymentOpen}
          invoice={invoice}
        />
      )}
    </>
  );
}
