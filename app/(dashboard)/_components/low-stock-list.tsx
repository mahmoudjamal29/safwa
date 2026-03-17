'use client'

import { useQuery } from '@tanstack/react-query'

import { getAllProductsSimpleQuery } from '@/query/products'

export function LowStockList() {
  const { data: allProducts = [], isLoading } = useQuery(getAllProductsSimpleQuery())
  const products = allProducts.filter(p => p.min_qty !== null && p.qty <= (p.min_qty ?? 0))

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-4">
        <h2 className="mb-3 text-base font-semibold">مخزون منخفض</h2>
        <p className="text-sm text-muted-foreground">جاري التحميل...</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-4">
      <h2 className="mb-3 text-base font-semibold">مخزون منخفض ⚠️</h2>
      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground">لا توجد منتجات بمخزون منخفض</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {products.map(p => (
            <li key={p.id} className="flex items-center justify-between rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 px-3 py-2 text-sm">
              <span className="font-medium">{p.name}</span>
              <span className="text-red-600 font-bold">
                {p.qty} {p.unit} / الحد: {p.min_qty}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
