'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { InventoryTable } from './_components/inventory-table'
import { MovementFormDialog } from './_components/movement-form-dialog'

export default function InventoryPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">حركة المخزون</h1>
        <Button onClick={() => setDialogOpen(true)}>+ حركة جديدة</Button>
      </div>
      <InventoryTable />
      <MovementFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
