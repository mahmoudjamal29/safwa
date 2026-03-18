import { queryOptions } from "@tanstack/react-query";

import { createClient } from "@/lib/supabase/client";

import { INVOICE_STATUSES } from "@/lib/constants/statuses";

import type { Customer, CustomerWithBalance } from "./customers-types";
import type { SupabaseClient } from "@supabase/supabase-js";

const fetchPendingBalances = async (
  supabase: SupabaseClient,
  customerIds: string[]
): Promise<Record<string, number>> => {
  if (customerIds.length === 0) return {};
  const { data } = await supabase
    .from("invoices")
    .select("customer_id, total, paid_amount")
    .in("customer_id", customerIds)
    .neq("status", INVOICE_STATUSES.CANCELLED);
  const map: Record<string, number> = {};
  for (const row of data ?? []) {
    if (!row.customer_id) continue;
    map[row.customer_id] =
      (map[row.customer_id] ?? 0) + (row.total - row.paid_amount);
  }
  return map;
};

export const getCustomerBalancesQuery = (customerIds: string[]) =>
  queryOptions<Record<string, number>>({
    enabled: customerIds.length > 0,
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("invoices")
        .select("customer_id, total, paid_amount")
        .in("customer_id", customerIds)
        .neq("status", INVOICE_STATUSES.CANCELLED);
      const map: Record<string, number> = {};
      for (const row of data ?? []) {
        if (!row.customer_id) continue;
        map[row.customer_id] =
          (map[row.customer_id] ?? 0) + (row.total - row.paid_amount);
      }
      return map;
    },
    queryKey: ["customer-balances", customerIds],
    staleTime: 60 * 1000,
  });

export const getAllCustomersQuery = (params?: Record<string, unknown>) =>
  queryOptions<PaginatedResponse<CustomerWithBalance[]>>({
    queryFn: async () => {
      const supabase = createClient();
      const page = Number(params?.page ?? 1);
      const perPage = Number(params?.per_page ?? 15);
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

      let query = supabase
        .from("customers")
        .select("*", { count: "exact" })
        .order("name");
      if (params?.search) query = query.ilike("name", `%${params.search}%`);

      const { count, data, error } = await query.range(from, to);
      if (error) throw error;

      const customerIds = (data ?? []).map((c) => c.id);
      const balanceMap = await fetchPendingBalances(supabase, customerIds);

      const total = count ?? 0;
      return {
        data: (data ?? []).map((c) => ({
          ...c,
          pending_balance: balanceMap[c.id] ?? 0,
        })),
        pagination: {
          current_page: page,
          from,
          last_page: Math.ceil(total / perPage) || 1,
          per_page: perPage,
          to: Math.min(to, total - 1),
          total,
        },
      };
    },
    queryKey: ["customers", params],
  });

export const getAllCustomersSimpleQuery = () =>
  queryOptions<Customer[]>({
    queryFn: async () => {
      const { data, error } = await createClient()
        .from("customers")
        .select("*")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
    queryKey: ["customers", "all"],
    staleTime: 2 * 60 * 1000,
  });

export const getAllCustomersWithBalanceQuery = () =>
  queryOptions<CustomerWithBalance[]>({
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("name");
      if (error) throw error;

      const customerIds = (data ?? []).map((c) => c.id);
      const balanceMap = await fetchPendingBalances(supabase, customerIds);

      return (data ?? []).map((c) => ({
        ...c,
        pending_balance: balanceMap[c.id] ?? 0,
      }));
    },
    queryKey: ["customers", "all-with-balance"],
    staleTime: 2 * 60 * 1000,
  });

export interface PendingInvoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  total: number;
  paid_amount: number;
  remaining: number;
}

export const getPendingInvoicesForCustomerQuery = (customerId: string) =>
  queryOptions<PendingInvoice[]>({
    enabled: !!customerId,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("invoices")
        .select("id, invoice_number, invoice_date, total, paid_amount")
        .eq("customer_id", customerId)
        .neq("status", INVOICE_STATUSES.CANCELLED);
      if (error) throw error;

      return (data ?? [])
        .map((inv) => ({
          ...inv,
          remaining: inv.total - inv.paid_amount,
        }))
        .filter((inv) => inv.remaining > 0)
        .sort((a, b) => new Date(b.invoice_date).getTime() - new Date(a.invoice_date).getTime());
    },
    queryKey: ["customer-pending-invoices", customerId],
    staleTime: 30 * 1000,
  });
