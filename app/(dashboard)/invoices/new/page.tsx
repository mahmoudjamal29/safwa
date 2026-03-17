import { NewInvoiceForm } from './_components/new-invoice-form'

export default function NewInvoicePage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold">إنشاء فاتورة جديدة</h1>
      <NewInvoiceForm />
    </div>
  )
}
