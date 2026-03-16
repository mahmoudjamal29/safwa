'use client'

import * as React from 'react'
import { createClient } from '@/lib/supabase/client'
import { fmtCurrency } from '@/utils/formatters'
import { StatCard } from './stat-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils/cn'

type Period = 'today' | 'month' | 'all' | 'custom'

interface Stats {
  revenue: number
  invoiceCount: number
  productCount: number
  lowStockCount: number
}

export function DashboardStats() {
  const [period, setPeriod] = React.useState<Period>('month')
  const [fromDate, setFromDate] = React.useState('')
  const [toDate, setToDate] = React.useState('')
  const [stats, setStats] = React.useState<Stats>({ revenue: 0, invoiceCount: 0, productCount: 0, lowStockCount: 0 })
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      const supabase = createClient()

      // Build date filter
      let from: string | null = null
      let to: string | null = null
      const now = new Date()

      if (period === 'today') {
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
        to = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString()
      } else if (period === 'month') {
        from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()
      } else if (period === 'custom' && fromDate && toDate) {
        from = new Date(fromDate).toISOString()
        to = new Date(toDate + 'T23:59:59').toISOString()
      }

      // Invoice stats
      let invoiceQuery = supabase.from('invoices').select('total', { count: 'exact' })
      if (from) invoiceQuery = invoiceQuery.gte('invoice_date', from)
      if (to) invoiceQuery = invoiceQuery.lte('invoice_date', to)
      const { data: invoices, count: invoiceCount } = await invoiceQuery
      const revenue = (invoices ?? []).reduce((sum, inv) => sum + (inv.total ?? 0), 0)

      // Product stats
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      const { count: lowStockCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lte('qty', supabase.rpc as unknown as never)

      // Re-fetch low stock with filter
      const { data: productsLow } = await supabase
        .from('products')
        .select('id, qty, min_qty')
      const lowCount = (productsLow ?? []).filter(p => p.min_qty !== null && p.qty <= p.min_qty).length

      setStats({
        revenue,
        invoiceCount: invoiceCount ?? 0,
        productCount: productCount ?? 0,
        lowStockCount: lowCount,
      })
      setLoading(false)
    }
    fetchStats()
  }, [period, fromDate, toDate])

  const periods: { key: Period; label: string }[] = [
    { key: 'today', label: 'اليوم' },
    { key: 'month', label: 'هذا الشهر' },
    { key: 'all', label: 'الكل' },
    { key: 'custom', label: 'تخصيص' },
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
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="h-9 w-36"
            />
            <span className="text-muted-foreground text-sm">إلى</span>
            <Input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="h-9 w-36"
            />
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="إجمالي المبيعات"
          value={loading ? '...' : fmtCurrency(stats.revenue)}
          icon="💰"
          variant="gold"
        />
        <StatCard
          label="إجمالي الفواتير"
          value={loading ? '...' : stats.invoiceCount}
          icon="🧾"
          variant="blue"
        />
        <StatCard
          label="المنتجات"
          value={loading ? '...' : stats.productCount}
          icon="📦"
          variant="green"
        />
        <StatCard
          label="مخزون منخفض"
          value={loading ? '...' : stats.lowStockCount}
          icon="⚠️"
          variant="red"
        />
      </div>
    </div>
  )
}
