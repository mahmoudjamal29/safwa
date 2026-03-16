import { DashboardStats } from './_components/dashboard-stats'
import { RecentInvoices } from './_components/recent-invoices'
import { LowStockList } from './_components/low-stock-list'

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold">لوحة التحكم</h1>
      <DashboardStats />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentInvoices />
        <LowStockList />
      </div>
    </div>
  )
}
