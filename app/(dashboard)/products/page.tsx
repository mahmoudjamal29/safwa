'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'

import { ProductFormDialog } from './_components/product-form-dialog'
import { ProductsTable } from './_components/products-table'

export default function ProductsPage() {
  const t = useTranslations('products')
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus /> {t('newProduct')}
        </Button>
      </div>
      <ProductsTable />
      <ProductFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
