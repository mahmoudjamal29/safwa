import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { InvoicesTable } from './_components/invoices-table'

export default function InvoicesPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">الفواتير</h1>
        <Button asChild>
          <Link href="/invoices/new">+ فاتورة جديدة</Link>
        </Button>
      </div>
      <InvoicesTable />
    </div>
  )
}
