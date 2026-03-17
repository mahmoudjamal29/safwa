'use client'

import * as React from 'react'

import { useQuery } from '@tanstack/react-query'
import { Pencil, Trash2 } from 'lucide-react'

import { getAllCustomersQuery, useDeleteCustomer, type Customer } from '@/query/customers'

import { useDebounce } from '@/hooks/use-debounce'

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

import { CustomerFormDialog } from './customer-form-dialog'

export function CustomersTable() {
  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(1)
  const debouncedSearch = useDebounce(search, 300)

  const [editCustomer, setEditCustomer] = React.useState<Customer | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const deleteMutation = useDeleteCustomer()

  const params = React.useMemo(() => ({
    page,
    per_page: 15,
    ...(debouncedSearch && { search: debouncedSearch }),
  }), [page, debouncedSearch])

  const { data, isLoading } = useQuery(getAllCustomersQuery(params))
  const customers = data?.data ?? []
  const pagination = data?.pagination

  function openEdit(c: Customer) {
    setEditCustomer(c)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="بحث في العملاء..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="max-w-xs"
        />
      </div>

      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اسم العميل</TableHead>
              <TableHead>الهاتف</TableHead>
              <TableHead>العنوان</TableHead>
              <TableHead>الرقم الضريبي</TableHead>
              <TableHead>ملاحظات</TableHead>
              <TableHead>إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">جاري التحميل...</TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">لا يوجد عملاء</TableCell>
              </TableRow>
            ) : (
              customers.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.phone ?? '-'}</TableCell>
                  <TableCell>{c.address ?? '-'}</TableCell>
                  <TableCell>{c.tax_number ?? '-'}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{c.notes ?? '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(c)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteId(c.id)}>
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

      {pagination && pagination.last_page > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>السابق</Button>
          <span className="text-sm text-muted-foreground flex items-center">صفحة {page} من {pagination.last_page}</span>
          <Button variant="outline" size="sm" disabled={page >= pagination.last_page} onClick={() => setPage(p => p + 1)}>التالي</Button>
        </div>
      )}

      <CustomerFormDialog open={dialogOpen} onOpenChange={setDialogOpen} customer={editCustomer} />

      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف العميل</AlertDialogTitle>
            <AlertDialogDescription>هل تريد حذف هذا العميل؟ لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
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
