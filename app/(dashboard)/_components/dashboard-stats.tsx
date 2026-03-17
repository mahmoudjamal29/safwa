'use client'

import * as React from 'react'

import { useQuery , queryOptions } from '@tanstack/react-query'
import { useFormatter, useTranslations } from 'next-intl'

import { createClient } from '@/lib/supabase/client'
import { FileTextIcon, InvoiceIcon, MoneyIcon, PackageIcon } from '@/lib/icons'

import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/ui/date-range-picker'

import { StatCard } from './stat-card'

type Period = 'today' | 'month' | 'all' | 'custom'

interface Stats {
  revenue: number
  invoiceCount: number
  productCount: number
  lowStockCount: number
}

interface DateRange {
  from: string | null
  to: string | null
}

function buildDateRange(period: Period, fromDate: string, toDate: string): DateRange {
  const now = new Date()
  if (period === 'today') {
    return {
      from: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(),
      to: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString(),
    }
  }
  if (period === 'month') {
    return {
      from: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
      to: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString(),
    }
  }
  if (period === 'custom' && fromDate && toDate) {
    return {
      from: new Date(fromDate).toISOString(),
      to: new Date(toDate + 'T23:59:59').toISOString(),
    }
  }
  return { from: null, to: null }
}

function dashboardStatsOptions(period: Period, fromDate: string, toDate: string) {
  const range = buildDateRange(period, fromDate, toDate)
  return queryOptions<Stats>({
    queryFn: async () => {
      const supabase = createClient()

      // Invoice stats
      let invoiceQuery = supabase.from('invoices').select('total', { count: 'exact' })
      if (range.from) invoiceQuery = invoiceQuery.gte('invoice_date', range.from)
      if (range.to) invoiceQuery = invoiceQuery.lte('invoice_date', range.to)
      const { count: invoiceCount, data: invoices } = await invoiceQuery
      const revenue = (invoices ?? []).reduce((sum, inv) => sum + (inv.total ?? 0), 0)

      // Product count
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      // Low stock count — fetch all products and filter client-side (no column-to-column compare in Supabase)
      const { data: productsLow } = await supabase
        .from('products')
        .select('id, qty, min_qty')
      const lowCount = (productsLow ?? []).filter(p => p.min_qty !== null && p.qty <= p.min_qty).length

      return {
        invoiceCount: invoiceCount ?? 0,
        lowStockCount: lowCount,
        productCount: productCount ?? 0,
        revenue,
      }
    },
    queryKey: ['dashboard-stats', range.from, range.to],
  })
}

export function DashboardStats() {
  const t = useTranslations('dashboard')
  const format = useFormatter()
  const [period, setPeriod] = React.useState<Period>('month')
  const [fromDate, setFromDate] = React.useState('')
  const [toDate, setToDate] = React.useState('')

  const { data: stats, isLoading } = useQuery(dashboardStatsOptions(period, fromDate, toDate))

  const periods: { key: Period; label: string }[] = [
    { key: 'today', label: t('periods.today') },
    { key: 'month', label: t('periods.month') },
    { key: 'all', label: t('periods.all') },
    { key: 'custom', label: t('customPeriod') },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Period tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {periods.map(p => (
          <Button
            key={p.key}
            variant={period === p.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod(p.key)}
          >
            {p.label}
          </Button>
        ))}
        {period === 'custom' && (
          <DateRangePicker
            initialDateFrom={fromDate ? new Date(fromDate) : undefined}
            initialDateTo={toDate ? new Date(toDate) : undefined}
            onUpdate={({ dateFrom, dateTo }) => {
              setFromDate(dateFrom ? dateFrom.toISOString().slice(0, 10) : '')
              setToDate(dateTo ? dateTo.toISOString().slice(0, 10) : '')
            }}
          />
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t('stats.revenue')}
          value={isLoading ? '...' : format.number(stats?.revenue ?? 0, { style: 'currency', currency: 'EGP' })}
          icon={<MoneyIcon size={28} />}
          variant="gold"
        />
        <StatCard
          label={t('stats.invoices')}
          value={isLoading ? '...' : (stats?.invoiceCount ?? 0)}
          icon={<InvoiceIcon size={28} />}
          variant="blue"
        />
        <StatCard
          label={t('stats.products')}
          value={isLoading ? '...' : (stats?.productCount ?? 0)}
          icon={<PackageIcon size={28} />}
          variant="green"
        />
        <StatCard
          label={t('stats.lowStock')}
          value={isLoading ? '...' : (stats?.lowStockCount ?? 0)}
          icon={<FileTextIcon size={28} />}
          variant="red"
        />
      </div>
    </div>
  )
}
