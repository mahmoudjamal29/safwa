"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { INVOICE_STATUSES, type InvoiceStatusKey } from "@/lib/constants/statuses";
import { createClient } from "@/lib/supabase/client";

import {
  getAllCustomersWithBalanceQuery,
  getPendingInvoicesForCustomerQuery,
  type CustomerWithBalance,
} from "@/query/customers";
import { useCreateMovement } from "@/query/inventory";
import { useCreateInvoice, useUpdateInvoice } from "@/query/invoices";

import { fmtCurrency } from "@/utils/formatters";

import { FormCard } from "@/components/custom/form-card";
import { Flex } from "@/components/data-table/columns/flex";
import { useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { CustomerFormDialog } from "@/app/(dashboard)/customers/_components/customer-form-dialog";

import { LineItemsTable } from "./line-items-table";
import { ProductPickerDialog } from "./product-picker-dialog";

export interface LineItem {
  product_id: string;
  product_name: string;
  sell_by: "unit" | "piece";
  qty: number;
  unit_price: number;
  total: number;
  pieces_per_unit: number;
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

async function getNextInvoiceNumber() {
  const supabase = createClient();
  const { count } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true });
  const num = (count ?? 0) + 1;
  return `INV-${String(num).padStart(5, "0")}`;
}

function deriveStatus(paidAmount: number, total: number): InvoiceStatusKey {
  if (total <= 0 || paidAmount <= 0) return INVOICE_STATUSES.PENDING;
  if (paidAmount >= total) return INVOICE_STATUSES.PAID;
  return INVOICE_STATUSES.PARTIALLY_PAID;
}

export function NewInvoiceForm() {
  const router = useRouter();
  const t = useTranslations("invoices");
  const createInvoice = useCreateInvoice();
  const createMovement = useCreateMovement();
  const updateInvoice = useUpdateInvoice();

  const [items, setItems] = React.useState<LineItem[]>([]);
  const [showItemsError, setShowItemsError] = React.useState(false);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [addCustomerOpen, setAddCustomerOpen] = React.useState(false);
  const [settleOldBalance, setSettleOldBalance] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState<CustomerWithBalance | null>(null);

  const { data: customers } = useQuery(getAllCustomersWithBalanceQuery());

  const { data: pendingInvoices = [] } = useQuery(
    getPendingInvoicesForCustomerQuery(selectedCustomer?.id ?? "")
  );

  const totalPendingBalance = React.useMemo(
    () => pendingInvoices.reduce((sum, inv) => sum + inv.remaining, 0),
    [pendingInvoices]
  );

  const form = useAppForm({
    defaultValues: {
      customer_id: "",
      customer_name: "",
      discount_percent: "0",
      invoice_date: todayStr(),
      notes: "",
      paid_amount: "0",
    },
    onSubmit: async ({ value }) => {
      if (items.length === 0) {
        setShowItemsError(true);
        return;
      }

      const subtotal = items.reduce((s, i) => s + i.total, 0);
      const discountPercent = parseFloat(value.discount_percent) || 0;
      const discountAmount = subtotal * (discountPercent / 100);
      const itemsTotal = subtotal - discountAmount;
      const grandTotal = settleOldBalance ? itemsTotal + totalPendingBalance : itemsTotal;
      const paidAmount = Math.min(
        parseFloat(value.paid_amount) || 0,
        grandTotal,
      );
      const status = deriveStatus(paidAmount, grandTotal);

      const invoiceNumber = await getNextInvoiceNumber();

      const newInvoice = await createInvoice.mutateAsync({
        customer_id: value.customer_id || null,
        customer_name: value.customer_name || t("form.unknownCustomer"),
        discount_amount: discountAmount,
        discount_percent: discountPercent,
        invoice_date: value.invoice_date,
        invoice_number: invoiceNumber,
        items: JSON.stringify(items),
        notes: value.notes || undefined,
        paid_amount: paidAmount,
        status,
        subtotal,
        tax_amount: 0,
        tax_percent: 0,
        total: grandTotal,
      });

      if (settleOldBalance && pendingInvoices.length > 0 && newInvoice?.id) {
        const supabase = createClient();
        await supabase.from('invoice_resolutions').insert(
          pendingInvoices.map(inv => ({
            resolver_invoice_id: newInvoice.id,
            resolved_invoice_id: inv.id,
          }))
        );
      }

      for (const item of items) {
        await createMovement.mutateAsync({
          note: `${t("form.invoiceRef")} ${invoiceNumber}`,
          product_id: item.product_id,
          product_name: item.product_name,
          qty:
            item.sell_by === "piece"
              ? item.qty / (item.pieces_per_unit || 1)
              : item.qty,
          type: "صادر",
        });
      }

      if (settleOldBalance && pendingInvoices.length > 0) {
        for (const pendingInv of pendingInvoices) {
          await updateInvoice.mutateAsync({
            id: pendingInv.id,
            payload: {
              paid_amount: pendingInv.total,
              status: INVOICE_STATUSES.PAID,
            },
          });
        }
      }

      form.reset();
      setItems([]);
      setShowItemsError(false);
      setSettleOldBalance(false);
      setSelectedCustomer(null);
      router.push("/invoices");
    },
  });

  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const isPending = createInvoice.isPending || createMovement.isPending || updateInvoice.isPending;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-5"
    >
      {/* ── Invoice Details ───────────────────────────────── */}
      <FormCard title={t("form.title")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <form.AppField
            name="customer_id"
            validators={{
              onSubmit: ({ value }) =>
                !value ? t("validation.customerRequired") : undefined,
            }}
          >
            {(field) => (
              <field.Combobox
                label={t("form.customer")}
                placeholder={t("form.customerSearch")}
                options={customers ?? []}
                valueKey="id"
                labelKey="name"
                onSelectItem={(item: CustomerWithBalance | undefined) => {
                  form.setFieldValue("customer_name", item?.name ?? "");
                  setSelectedCustomer(item ?? null);
                  setSettleOldBalance(false);
                }}
                footer={
                  <button
                    type="button"
                    className="w-full rounded px-2 py-1.5 text-start text-sm text-primary hover:bg-accent"
                    onClick={() => setAddCustomerOpen(true)}
                  >
                    {t("form.addNewCustomer")}
                  </button>
                }
                renderSelected={(c) => (
                  <Flex
                    viewOptions={{ avatar: false }}
                    title={c?.name}
                    subtitle={
                      c?.pending_balance
                        ? `${t("form.pendingBalance")}: ${fmtCurrency(c.pending_balance)}`
                        : undefined
                    }
                  />
                )}
              />
            )}
          </form.AppField>

          <form.AppField
            name="invoice_date"
            validators={{
              onBlur: ({ value }) =>
                !value ? t("validation.dateRequired") : undefined,
            }}
          >
            {(field) => (
              <field.DatePicker label={t("form.invoiceDate")} required />
            )}
          </form.AppField>

          <form.AppField name="notes">
            {(field) => (
              <field.TextArea
                label={t("form.notes")}
                placeholder={t("form.notesPlaceholder")}
              />
            )}
          </form.AppField>
        </div>
      </FormCard>

      {/* ── Settle Old Balance ───────────────────────────── */}
      {selectedCustomer && totalPendingBalance > 0 && (
        <FormCard title={t("form.settleOldBalance")}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Checkbox
                id="settle-balance"
                checked={settleOldBalance}
                onCheckedChange={(checked) => setSettleOldBalance(checked === true)}
              />
              <label
                htmlFor="settle-balance"
                className="text-sm cursor-pointer flex-1"
              >
                <span className="font-medium">{t("form.settleOldBalance")}</span>
                <span className="text-muted-foreground ms-2">
                  ({t("form.settleOldBalanceDesc", { amount: fmtCurrency(totalPendingBalance), count: pendingInvoices.length })})
                </span>
              </label>
            </div>
            {settleOldBalance && pendingInvoices.length > 0 && (
              <div className="rounded-lg border bg-muted/30 p-3 text-sm space-y-1.5">
                <div className="font-medium text-muted-foreground mb-2">{t("form.invoicesToSettle")}:</div>
                {pendingInvoices.map((inv) => (
                  <div key={inv.id} className="flex justify-between">
                    <span>
                      {inv.invoice_number} ({inv.invoice_date})
                    </span>
                    <span className="text-amber-600">{fmtCurrency(inv.remaining)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FormCard>
      )}

      {/* ── Products ──────────────────────────────────────── */}
      <FormCard
        title={t("form.items")}
        isFieldInvalid={showItemsError && items.length === 0}
        errorMessage={
          showItemsError && items.length === 0
            ? t("form.itemsRequired")
            : undefined
        }
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPickerOpen(true)}
          >
            <Plus />
            {t("form.addProduct")}
          </Button>
        }
      >
        <LineItemsTable
          items={items}
          onUpdateItem={(idx, updates) =>
            setItems((prev) =>
              prev.map((item, i) =>
                i === idx ? { ...item, ...updates } : item,
              ),
            )
          }
          onRemoveItem={(idx) =>
            setItems((prev) => prev.filter((_, i) => i !== idx))
          }
        />
      </FormCard>

      {/* ── Payment ───────────────────────────────────────── */}
      <FormCard title={t("form.paid")}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-0">
            <form.AppField
              name="discount_percent"
              validators={{
                onBlur: ({ value }) => {
                  const v = parseFloat(value);
                  return isNaN(v) || v < 0 || v > 100
                    ? t("validation.discountRange")
                    : undefined;
                },
              }}
            >
              {(field) => (
                <field.Input
                  label={t("form.discountPct")}
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                />
              )}
            </form.AppField>

            <form.AppField
              name="paid_amount"
              validators={{
                onBlur: ({ value }) => {
                  const v = parseFloat(value);
                  return isNaN(v) || v < 0
                    ? t("validation.amountPositive")
                    : undefined;
                },
              }}
            >
              {(field) => (
                <field.Input
                  label={t("form.paid")}
                  type="number"
                  min="0"
                  step="0.5"
                />
              )}
            </form.AppField>
          </div>

          <form.Subscribe selector={(s) => s.values}>
            {(values) => {
              const discountPercent = parseFloat(values.discount_percent) || 0;
              const paidAmount = parseFloat(values.paid_amount) || 0;
              const discountAmount = subtotal * (discountPercent / 100);
              const itemsTotal = subtotal - discountAmount;
              const grandTotal = settleOldBalance
                ? itemsTotal + totalPendingBalance
                : itemsTotal;
              const autoStatus = deriveStatus(paidAmount, grandTotal);
              const exceedsTotal = paidAmount > grandTotal && grandTotal > 0;

              return (
                <div className="rounded-xl border p-4 flex flex-col gap-2 text-sm bg-muted/30 self-start">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("form.subtotal")}:
                    </span>
                    <span className="font-medium">{fmtCurrency(subtotal)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-amber-600 dark:text-amber-400">
                      <span>
                        {t("form.discount")} ({discountPercent}%):
                      </span>
                      <span>- {fmtCurrency(discountAmount)}</span>
                    </div>
                  )}
                  {settleOldBalance && totalPendingBalance > 0 && (
                    <div className="flex justify-between text-amber-600 dark:text-amber-400">
                      <span>{t("form.oldBalance")}:</span>
                      <span>+ {fmtCurrency(totalPendingBalance)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base border-t pt-2">
                    <span>{t("form.grandTotal")}:</span>
                    <span>{fmtCurrency(grandTotal)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-muted-foreground text-xs">
                    <span>{t("form.autoStatus")}:</span>
                    <span className="font-medium text-foreground">
                      {autoStatus}
                    </span>
                  </div>
                  {exceedsTotal && (
                    <p className="text-amber-600 dark:text-amber-400 text-xs pt-1">
                      {t("validation.paidExceedsTotal")}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Subscribe>
        </div>
      </FormCard>

      {/* ── Actions ───────────────────────────────────────── */}
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            form.reset();
            setItems([]);
            setShowItemsError(false);
            setSettleOldBalance(false);
            setSelectedCustomer(null);
          }}
        >
          {t("form.reset")}
        </Button>
        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isPending || isSubmitting}>
              {isPending || isSubmitting ? t("payment.saving") : t("form.save")}
            </Button>
          )}
        </form.Subscribe>
      </div>

      <ProductPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(item) => {
          setItems((prev) => [...prev, item]);
          setShowItemsError(false);
        }}
      />

      <CustomerFormDialog
        open={addCustomerOpen}
        onOpenChange={setAddCustomerOpen}
      />
    </form>
  );
}
