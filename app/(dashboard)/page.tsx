import { getTranslations } from 'next-intl/server'

import { DashboardStats } from './_components/dashboard-stats'
import { LowStockList } from './_components/low-stock-list'
import { RecentInvoices } from './_components/recent-invoices'

export default async function DashboardPage() {
  const t = await getTranslations('dashboard')

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <DashboardStats />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentInvoices />
        <LowStockList />
      </div>
    </div>
  )
}
