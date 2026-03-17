'use client'

import * as React from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'

import { getAllProductsSimpleQuery } from '@/query/products'

import { Button } from '@/components/ui/button'

const DISPLAY_LIMIT = 5

export function LowStockList() {
  const t = useTranslations('dashboard')
  const [showAll, setShowAll] = React.useState(false)
  const { data: allProducts = [], isLoading } = useQuery(getAllProductsSimpleQuery())
  const products = allProducts.filter(p => p.min_qty !== null && p.qty <= (p.min_qty ?? 0))

  const visibleProducts = showAll ? products : products.slice(0, DISPLAY_LIMIT)
  const hasMore = products.length > DISPLAY_LIMIT

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-4">
        <h2 className="mb-3 text-base font-semibold">{t('lowStockAlert')}</h2>
        <p className="text-sm text-muted-foreground">{t('loading')}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-4">
      <h2 className="mb-3 text-base font-semibold">{t('lowStockAlert')}</h2>
      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('noLowStock')}</p>
      ) : (
        <>
          <ul className="flex flex-col gap-2">
            {visibleProducts.map(p => (
              <li key={p.id} className="flex items-center justify-between rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 px-3 py-2 text-sm">
                <span className="font-medium">{p.name}</span>
                <span className="text-red-600 font-bold">
                  {p.qty} {p.unit} / {t('limit')}: {p.min_qty}
                </span>
              </li>
            ))}
          </ul>
          {hasMore && !showAll && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 w-full"
              onClick={() => setShowAll(true)}
            >
              {t('viewAll')}
            </Button>
          )}
        </>
      )}
    </div>
  )
}
