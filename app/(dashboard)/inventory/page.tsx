'use client'

import { useState } from 'react'

import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'

import { InventoryTable } from './_components/inventory-table'
import { MovementFormDialog } from './_components/movement-form-dialog'

export default function InventoryPage() {
  const t = useTranslations('inventory')
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus /> {t('newMovement')}
        </Button>
      </div>
      <InventoryTable />
      <MovementFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
