'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { ProductFormDialog } from './_components/product-form-dialog'
import { ProductsTable } from './_components/products-table'

export default function ProductsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">المنتجات</h1>
        <Button onClick={() => setDialogOpen(true)}>+ منتج جديد</Button>
      </div>
      <ProductsTable />
      <ProductFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
