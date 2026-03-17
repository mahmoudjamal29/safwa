'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAllInventoryQuery, type MovementType } from '@/query/inventory'
import { fmtDate } from '@/utils/formatters'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDebounce } from '@/hooks/use-debounce'
import { cn } from '@/utils/cn'

const typeColors: Record<MovementType, string> = {
  'وارد': 'bg-green-100 text-green-700 border-green-200',
  'صادر': 'bg-blue-100 text-blue-700 border-blue-200',
  'تسوية': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'تالف': 'bg-red-100 text-red-700 border-red-200',
}

const MOVEMENT_TYPES: MovementType[] = ['وارد', 'صادر', 'تسوية', 'تالف']

export function InventoryTable() {
  const [search, setSearch] = React.useState('')
  const [type, setType] = React.useState<string>('')
  const [page, setPage] = React.useState(1)
  const debouncedSearch = useDebounce(search, 300)

  const params = React.useMemo(() => ({
    page,
    per_page: 15,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(type && { type }),
  }), [page, debouncedSearch, type])

  const { data, isLoading } = useQuery(getAllInventoryQuery(params))
  const movements = data?.data ?? []
  const pagination = data?.pagination

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="بحث بالمنتج..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="max-w-xs"
        />
        <Select value={type} onValueChange={v => { setType(v === 'all' ? '' : v); setPage(1) }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="كل الأنواع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الأنواع</SelectItem>
            {MOVEMENT_TYPES.map(t => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المنتج</TableHead>
              <TableHead>النوع</TableHead>
              <TableHead>الكمية</TableHead>
              <TableHead>ملاحظة</TableHead>
              <TableHead>التاريخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">جاري التحميل...</TableCell>
              </TableRow>
            ) : movements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">لا توجد حركات</TableCell>
              </TableRow>
            ) : (
              movements.map(m => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.product_name}</TableCell>
                  <TableCell>
                    <Badge className={cn('text-xs', typeColors[m.type])}>{m.type}</Badge>
                  </TableCell>
                  <TableCell>{m.qty}</TableCell>
                  <TableCell className="text-muted-foreground">{m.note ?? '-'}</TableCell>
                  <TableCell>{fmtDate(m.created_at)}</TableCell>
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
    </div>
  )
}
