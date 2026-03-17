'use client'

import * as React from 'react'

import { useQuery, queryOptions } from '@tanstack/react-query'
import { Pencil, Trash2 } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

import { getAllProductsQuery, useDeleteProduct, type Product } from '@/query/products'

import { useDebounce } from '@/hooks/use-debounce'

import { fmtCurrency } from '@/utils/formatters'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { ProductFormDialog } from './product-form-dialog'

const CATEGORIES_QUERY_KEY = ['product-categories']

export function ProductsTable() {
  const [search, setSearch] = React.useState('')
  const [category, setCategory] = React.useState('')
  const [page, setPage] = React.useState(1)
  const debouncedSearch = useDebounce(search, 300)

  const [editProduct, setEditProduct] = React.useState<Product | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const deleteMutation = useDeleteProduct()

  const params = React.useMemo(() => ({
    page,
    per_page: 15,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(category && { category }),
  }), [page, debouncedSearch, category])

  const { data, isLoading } = useQuery(getAllProductsQuery(params))
  const products = data?.data ?? []
  const pagination = data?.pagination

  // Distinct categories from current data
  const { data: allProducts } = useQuery(queryOptions({
    queryFn: async () => {
      const { data } = await createClient().from('products').select('category').order('category')
      return data ?? []
    },
    queryKey: CATEGORIES_QUERY_KEY,
    staleTime: 5 * 60 * 1000,
  }))
  const categories = Array.from(new Set((allProducts ?? []).map(p => p.category).filter(Boolean))) as string[]

  function openCreate() {
    setEditProduct(null)
    setDialogOpen(true)
  }

  function openEdit(p: Product) {
    setEditProduct(p)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="بحث في المنتجات..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="max-w-xs"
        />
        <select
          value={category}
          onChange={e => { setCategory(e.target.value); setPage(1) }}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">كل الفئات</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اسم المنتج</TableHead>
              <TableHead>الكود</TableHead>
              <TableHead>الفئة</TableHead>
              <TableHead>الوحدة</TableHead>
              <TableHead>سعر الوحدة</TableHead>
              <TableHead>التكلفة</TableHead>
              <TableHead>الكمية</TableHead>
              <TableHead>الحد الأدنى</TableHead>
              <TableHead>قطع/وحدة</TableHead>
              <TableHead>إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-muted-foreground">جاري التحميل...</TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-muted-foreground">لا توجد منتجات</TableCell>
              </TableRow>
            ) : (
              products.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">{p.sku ?? '-'}</TableCell>
                  <TableCell>{p.category ?? '-'}</TableCell>
                  <TableCell>{p.unit}</TableCell>
                  <TableCell>{fmtCurrency(p.price)}</TableCell>
                  <TableCell>{p.cost != null ? fmtCurrency(p.cost) : '-'}</TableCell>
                  <TableCell className={p.min_qty != null && p.qty <= p.min_qty ? 'text-red-600 font-bold' : ''}>
                    {p.qty}
                  </TableCell>
                  <TableCell>{p.min_qty ?? '-'}</TableCell>
                  <TableCell>{p.pieces_per_unit ?? '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteId(p.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>السابق</Button>
          <span className="text-sm text-muted-foreground flex items-center">صفحة {page} من {pagination.last_page}</span>
          <Button variant="outline" size="sm" disabled={page >= pagination.last_page} onClick={() => setPage(p => p + 1)}>التالي</Button>
        </div>
      )}

      {/* Form Dialog */}
      <ProductFormDialog open={dialogOpen} onOpenChange={setDialogOpen} product={editProduct} />

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف المنتج</AlertDialogTitle>
            <AlertDialogDescription>هل تريد حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (deleteId) {
                  await deleteMutation.mutateAsync(deleteId)
                  setDeleteId(null)
                }
              }}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
