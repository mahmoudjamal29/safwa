"use client";

import { useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { getAllProductsSimpleQuery, type Product } from "@/query/products";

import { DataTable } from "@/components/data-table/data-table";

const PAGE_SIZE = 10;

export function LowStockList() {
  const t = useTranslations("dashboard");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const { data: allProducts = [], isLoading } = useQuery(
    getAllProductsSimpleQuery(),
  );
  const products = useMemo(
    () =>
      allProducts.filter(
        (p) => p.min_qty !== null && p.qty <= (p.min_qty ?? 0),
      ),
    [allProducts],
  );

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue<string>()}</span>
        ),
        header: t("columns.product"),
      },
      {
        accessorKey: "unit",
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{getValue<string>()}</span>
        ),
        header: t("columns.unit"),
        size: 80,
      },
      {
        accessorKey: "qty",
        cell: ({ getValue }) => (
          <span className="font-bold text-red-600">{getValue<number>()}</span>
        ),
        header: t("columns.qty"),
        size: 80,
      },
      {
        accessorKey: "min_qty",
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">
            {getValue<number | null>() ?? "-"}
          </span>
        ),
        header: t("columns.minQty"),
        size: 100,
      },
    ],
    [t],
  );

  const table = useReactTable({
    columns,
    data: products,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    onPaginationChange: setPagination,
    state: { pagination },
  });

  return (
    <div className="rounded-xl border bg-card">
      <div className="border-b px-4 py-3">
        <h2 className="text-base font-semibold">{t("lowStockAlert")}</h2>
      </div>
      <DataTable
        className="border-none rounded-none"
        enableRowsPerPage
        isLoading={isLoading}
        table={table}
      />
    </div>
  );
}
