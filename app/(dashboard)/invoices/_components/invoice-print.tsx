"use client";

import * as React from "react";

import { useLocale, useTranslations } from "next-intl";

import { INVOICE_STATUSES } from "@/lib/constants/statuses";

import type { Invoice } from "@/query/invoices";

import { fmtCurrency, fmtDate } from "@/utils/formatters";

interface Payment {
  id: string;
  amount: number;
  method: string;
  note: string | null;
  created_at: string;
}

interface InvoicePrintProps {
  invoice: Invoice;
  payments?: Payment[];
}

export function InvoicePrint({ invoice, payments = [] }: InvoicePrintProps) {
  const t = useTranslations("invoices");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const resolvedInvoices = invoice.resolved_invoices ?? [];

  const statusLabel = React.useMemo(() => {
    if (invoice.status === INVOICE_STATUSES.PAID) return t("statuses.paid");
    if (invoice.status === INVOICE_STATUSES.PARTIALLY_PAID)
      return t("statuses.partially_paid");
    if (invoice.status === INVOICE_STATUSES.PENDING)
      return t("statuses.pending");
    return t("statuses.cancelled");
  }, [invoice.status, t]);

  return (
    <div
      className="print-invoice"
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        backgroundColor: "#fff",
        color: "#000",
        direction: isRTL ? "rtl" : "ltr",
        fontFamily: isRTL ? '"IBM Plex Sans Arabic", sans-serif' : "monospace",
        margin: "0 auto",
        maxWidth: "210mm",
        padding: "20px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        
        @media print {
          body * {
            visibility: hidden;
          }
          .print-invoice, .print-invoice * {
            visibility: visible;
          }
          .print-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
        }
        
        .print-invoice .mono {
          font-family: 'IBM Plex Mono', monospace;
        }
        
        .print-invoice table {
          width: 100%;
          border-collapse: collapse;
          margin: 12px 0;
        }
        
        .print-invoice th, .print-invoice td {
          border: 1px solid #ddd;
          padding: 6px 8px;
          text-align: ${isRTL ? "right" : "left"};
          font-size: 12px;
        }
        
        .print-invoice th {
          background-color: #f5f5f5;
          font-weight: 600;
        }
        
        .print-invoice .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #333;
        }
        
        .print-invoice .company-info {
          text-align: ${isRTL ? "right" : "left"};
        }
        
        .print-invoice .invoice-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .print-invoice .invoice-number {
          font-size: 14px;
          color: #666;
        }
        
        .print-invoice .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin: 16px 0;
        }
        
        .print-invoice .info-box {
          background: #f9f9f9;
          padding: 12px;
          border-radius: 4px;
        }
        
        .print-invoice .info-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
        }
        
        .print-invoice .info-value {
          font-size: 14px;
          font-weight: 500;
        }
        
        .print-invoice .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .print-invoice .status-paid { background: #d1fae5; color: #065f46; }
        .print-invoice .status-partial { background: #fef3c7; color: #92400e; }
        .print-invoice .status-pending { background: #dbeafe; color: #1e40af; }
        .print-invoice .status-cancelled { background: #f3f4f6; color: #6b7280; }
        
        .print-invoice .totals-section {
          margin-top: 24px;
          text-align: ${isRTL ? "left" : "right"};
        }
        
        .print-invoice .totals-table {
          display: inline-block;
          min-width: 280px;
        }
        
        .print-invoice .totals-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid #eee;
        }
        
        .print-invoice .totals-row.grand-total {
          border-top: 2px solid #333;
          border-bottom: none;
          font-size: 18px;
          font-weight: 700;
          padding-top: 12px;
          margin-top: 8px;
        }
        
        .print-invoice .footer {
          margin-top: 48px;
          padding-top: 16px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
        
        .print-invoice .negative {
          color: #dc2626;
        }
        
        .print-invoice .positive {
          color: #059669;
        }
        
        .print-invoice .section-title {
          font-size: 14px;
          font-weight: 700;
          margin-top: 24px;
          margin-bottom: 8px;
          padding-bottom: 8px;
          border-bottom: 1px solid #ddd;
        }
      `}</style>

      <div className="header">
        <div className="company-info">
          <div className="invoice-title mono">{isRTL ? "Safwa" : "SAFWA"}</div>
        </div>
        <div style={{ textAlign: isRTL ? "left" : "right" }}>
          <div className="invoice-number mono">
            {t("view.title")} #{invoice.invoice_number}
          </div>
          <div style={{ color: "#666", fontSize: "12px", marginTop: "4px" }}>
            {fmtDate(invoice.invoice_date)}
          </div>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-box">
          <div className="info-label">{t("view.customer")}</div>
          <div className="info-value">{invoice.customer_name}</div>
        </div>
        <div className="info-box">
          <div className="info-label">{t("view.status")}</div>
          <div className="info-value">
            <span
              className={`status-badge ${
                invoice.status === INVOICE_STATUSES.PAID
                  ? "status-paid"
                  : invoice.status === INVOICE_STATUSES.PARTIALLY_PAID
                    ? "status-partial"
                    : invoice.status === INVOICE_STATUSES.PENDING
                      ? "status-pending"
                      : "status-cancelled"
              }`}
            >
              {statusLabel}
            </span>
          </div>
        </div>
      </div>

      {resolvedInvoices.length > 0 && (
        <div
          style={{
            background: "#fef3c7",
            border: "2px solid #f59e0b",
            borderRadius: "4px",
            marginTop: "24px",
            padding: "16px",
          }}
        >
          <div
            style={{ color: "#92400e", fontWeight: 700, marginBottom: "8px" }}
          >
            {t("settledInvoicesNote")}
          </div>
          <div style={{ color: "#78350f", fontSize: "12px", marginBottom: "12px" }}>
            {isRTL
              ? "تم تسوية الفواتير التالية في هذه الفاتورة"
              : "The following invoices have been settled in this invoice"}
          </div>

          {resolvedInvoices.map((settledInv) => (
              <div key={settledInv.id} style={{ background: "#fff", borderRadius: "4px", marginBottom: "16px", padding: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div style={{ fontWeight: 600 }}>
                    {t("view.title")} #{settledInv.invoice_number}
                  </div>
                  <div style={{ color: "#666", fontSize: "12px" }}>
                    {fmtDate(settledInv.invoice_date)}
                  </div>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: "35%" }}>{t("lineItems.product")}</th>
                      <th style={{ textAlign: "center", width: "15%" }}>{t("view.sellBy")}</th>
                      <th style={{ textAlign: "right", width: "15%" }}>{t("lineItems.qty")}</th>
                      <th style={{ textAlign: "right", width: "17%" }}>{t("lineItems.unitPrice")}</th>
                      <th style={{ textAlign: "right", width: "18%" }}>{t("lineItems.total")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settledInv.items?.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td>{item.product_name}</td>
                        <td className="mono" style={{ textAlign: "center" }}>
                          {item.sell_by === "unit" ? t("view.unit") : t("view.piece")}
                        </td>
                        <td className="mono" style={{ textAlign: "right" }}>{item.qty}</td>
                        <td className="mono" style={{ textAlign: "right" }}>{fmtCurrency(item.price)}</td>
                        <td className="mono" style={{ textAlign: "right" }}>{fmtCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ marginTop: "8px", borderTop: "1px solid #eee", paddingTop: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", padding: "2px 0" }}>
                    <span style={{ color: "#666" }}>{t("view.subtotal")}</span>
                    <span className="mono">{fmtCurrency(settledInv.subtotal)}</span>
                  </div>
                  {(settledInv.discount_percent ?? 0) > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", padding: "2px 0", color: "#dc2626" }}>
                      <span>{t("view.discount")} ({settledInv.discount_percent}%)</span>
                      <span className="mono">- {fmtCurrency(settledInv.discount_amount)}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 700, padding: "4px 0", borderTop: "1px solid #ddd", marginTop: "4px" }}>
                    <span>{t("view.grandTotal")}</span>
                    <span className="mono">{fmtCurrency(settledInv.total)}</span>
                  </div>
                </div>
              </div>
          ))}
        </div>
      )}

      <div className="section-title">
        {t("view.lineItems")}
      </div>

      <table>
        <thead>
          <tr>
            <th style={{ width: "40%" }}>{t("lineItems.product")}</th>
            <th style={{ textAlign: "center", width: "15%" }}>{t("view.sellBy")}</th>
            <th style={{ textAlign: "right", width: "15%" }}>{t("lineItems.qty")}</th>
            <th style={{ textAlign: "right", width: "15%" }}>{t("lineItems.unitPrice")}</th>
            <th style={{ textAlign: "right", width: "15%" }}>{t("lineItems.total")}</th>
          </tr>
        </thead>
        <tbody>
          {(invoice.items ?? []).map((item, idx) => (
            <tr key={idx}>
              <td>{item.product_name}</td>
              <td className="mono" style={{ textAlign: "center" }}>
                {item.sell_by === "unit" ? t("view.unit") : t("view.piece")}
              </td>
              <td className="mono" style={{ textAlign: "right" }}>
                {item.qty}
              </td>
              <td className="mono" style={{ textAlign: "right" }}>
                {fmtCurrency(item.price)}
              </td>
              <td className="mono" style={{ textAlign: "right" }}>
                {fmtCurrency(item.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="totals-section">
        <div className="totals-table">
          <div className="totals-row">
            <span>{t("view.subtotal")}</span>
            <span className="mono">{fmtCurrency(invoice.subtotal)}</span>
          </div>
          {(invoice.discount_percent ?? 0) > 0 && (
            <div className="totals-row negative">
              <span>
                {t("view.discount")} ({invoice.discount_percent}%)
              </span>
              <span className="mono">
                - {fmtCurrency(invoice.discount_amount ?? 0)}
              </span>
            </div>
          )}
          {invoice.tax_percent > 0 && (
            <div className="totals-row">
              <span>
                {t("view.tax")} ({invoice.tax_percent}%)
              </span>
              <span className="mono">{fmtCurrency(invoice.tax_amount)}</span>
            </div>
          )}
          <div className="totals-row grand-total">
            <span>{t("view.grandTotal")}</span>
            <span className="mono">{fmtCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      <div className="info-grid" style={{ marginTop: "24px" }}>
        <div className="info-box">
          <div className="info-label">{t("view.paid")}</div>
          <div className="info-value positive mono">
            {fmtCurrency(invoice.paid_amount)}
          </div>
        </div>
        <div className="info-box">
          <div className="info-label">{t("view.remaining")}</div>
          <div
            className={`info-value mono ${invoice.total - invoice.paid_amount > 0 ? "negative" : "positive"}`}
          >
            {fmtCurrency(invoice.total - invoice.paid_amount)}
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div
          style={{
            background: "#f9f9f9",
            borderRadius: "4px",
            marginTop: "16px",
            padding: "12px",
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: "4px" }}>
            {t("view.notes")}
          </div>
          <div style={{ color: "#666" }}>{invoice.notes}</div>
        </div>
      )}

      {payments.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <div style={{ fontWeight: 600, marginBottom: "8px" }}>
            {t("view.paymentHistory")}
          </div>
          <table>
            <thead>
              <tr>
                <th>{t("view.date")}</th>
                <th>{t("view.amount")}</th>
                <th>{t("view.method")}</th>
                <th>{t("view.note")}</th>
              </tr>
            </thead>
            <tbody>
              {payments?.map((p) => (
                <tr key={p.id}>
                  <td className="mono">{fmtDate(p.created_at)}</td>
                  <td className="mono positive">{fmtCurrency(p.amount)}</td>
                  <td>{p.method}</td>
                  <td style={{ color: "#666" }}>{p.note ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="footer">
        {isRTL ? "شكراً لتعاملكم معنا" : "Thank you for your business"}
      </div>
    </div>
  );
}
