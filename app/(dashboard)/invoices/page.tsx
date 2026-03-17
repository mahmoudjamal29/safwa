import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/button'

import { InvoicesTable } from './_components/invoices-table'

export default async function InvoicesPage() {
  const t = await getTranslations('invoices')

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button asChild>
          <Link href="/invoices/new">+ {t('newInvoice')}</Link>
        </Button>
      </div>
      <InvoicesTable />
    </div>
  )
}
