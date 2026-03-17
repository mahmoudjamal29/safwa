import { getTranslations } from 'next-intl/server'

import { NewInvoiceForm } from './_components/new-invoice-form'

export default async function NewInvoicePage() {
  const t = await getTranslations('invoices')

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <h1 className="text-2xl font-bold">{t('form.title')}</h1>
      <NewInvoiceForm />
    </div>
  )
}
