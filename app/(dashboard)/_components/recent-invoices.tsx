"use client";

import { useQuery, queryOptions } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { createClient } from "@/lib/supabase/client";

import type { InvoiceStatus } from "@/query/invoices";

import { fmtCurrency, fmtDate } from "@/utils/formatters";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { InvoiceStatusBadge } from "@/app/(dashboard)/invoices/_components/invoice-status-badge";

interface RecentInvoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  invoice_date: string;
  status: InvoiceStatus;
  total: number;
}

const recentInvoicesOptions = queryOptions<RecentInvoice[]>({
  queryFn: async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("invoices")
      .select("id, invoice_number, customer_name, invoice_date, status, total")
      .order("created_at", { ascending: false })
      .limit(10);
    return (data as RecentInvoice[]) ?? [];
  },
  queryKey: ["invoices", "recent"],
});

export function RecentInvoices() {
  const t = useTranslations("dashboard");
  const { data: invoices = [], isLoading } = useQuery(recentInvoicesOptions);

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="border-b px-4 py-3">
        <h2 className="text-base font-semibold">{t("recentInvoices")}</h2>
      </div>
      <div className="overflow-x-auto  max-h-[50vh]! overflow-y-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("columns.invoiceNumber")}</TableHead>
              <TableHead>{t("columns.customer")}</TableHead>
              <TableHead>{t("columns.date")}</TableHead>
              <TableHead>{t("columns.status")}</TableHead>
              <TableHead>{t("columns.total")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-y-scroll!">
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  {t("loading")}
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  {t("noInvoices")}
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-sm">
                    {inv.invoice_number}
                  </TableCell>
                  <TableCell>{inv.customer_name}</TableCell>
                  <TableCell>{fmtDate(inv.invoice_date)}</TableCell>
                  <TableCell>
                    <InvoiceStatusBadge status={inv.status} />
                  </TableCell>
                  <TableCell className="font-medium">
                    {fmtCurrency(inv.total)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
