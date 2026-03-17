'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { CustomerFormDialog } from './_components/customer-form-dialog'
import { CustomersTable } from './_components/customers-table'

export default function CustomersPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">العملاء</h1>
        <Button onClick={() => setDialogOpen(true)}>+ عميل جديد</Button>
      </div>
      <CustomersTable />
      <CustomerFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
