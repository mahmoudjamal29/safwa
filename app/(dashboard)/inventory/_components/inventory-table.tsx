'use client'

import { useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
} from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

import { getAllInventoryQuery, type InventoryMovement, type MovementType } from '@/query/inventory'

import { useDebounce } from '@/hooks/use-debounce'

import { cn } from '@/utils/cn'
import { fmtDate } from '@/utils/formatters'

import { DataTable } from '@/components/data-table/data-table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const typeStyles: Record<MovementType, string> = {
  'تالف':  'bg-red-50     text-red-700     border-red-200     dark:bg-red-900/20     dark:text-red-400     dark:border-red-800',
  'تسوية': 'bg-amber-50   text-amber-700   border-amber-200   dark:bg-amber-900/20   dark:text-amber-400   dark:border-amber-800',
  'صادر':  'bg-sky-50     text-sky-700     border-sky-200     dark:bg-sky-900/20     dark:text-sky-400     dark:border-sky-800',
  'وارد':  'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
}

const MOVEMENT_TYPES: MovementType[] = ['وارد', 'صادر', 'تسوية', 'تالف']

const typeTranslationKey: Record<MovementType, string> = {
  'تالف': 'damaged',
  'تسوية': 'adjustment',
  'صادر': 'outgoing',
  'وارد': 'incoming',
}

export function InventoryTable() {
  const t = useTranslations('inventory')
  const [search, setSearch] = useState('')
  const [type, setType] = useState<string>('')
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 15 })
  const debouncedSearch = useDebounce(search, 300)

  const params = useMemo(() => ({
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(type && { type }),
  }), [pagination.pageIndex, pagination.pageSize, debouncedSearch, type])

  const { data, isLoading } = useQuery(getAllInventoryQuery(params))

  const columns = useMemo<ColumnDef<InventoryMovement>[]>(() => [
    {
      accessorKey: 'product_name',
      cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
      header: t('columns.product'),
    },
    {
      accessorKey: 'type',
      cell: ({ getValue }) => {
        const val = getValue<MovementType>()
        return (
          <Badge variant="outline" className={cn('font-medium', typeStyles[val])}>
            {t(`types.${typeTranslationKey[val]}`)}
          </Badge>
        )
      },
      header: t('columns.type'),
      size: 100,
    },
    {
      accessorKey: 'qty',
      cell: ({ getValue }) => <span>{getValue<number>()}</span>,
      header: t('columns.qty'),
      size: 80,
    },
    {
      accessorKey: 'note',
      cell: ({ getValue }) => <span className="text-muted-foreground">{getValue<string | null>() ?? '-'}</span>,
      header: t('columns.notes'),
    },
    {
      accessorKey: 'created_at',
      cell: ({ getValue }) => <span>{fmtDate(getValue<string>())}</span>,
      header: t('columns.date'),
      size: 130,
    },
  ], [t])

  const table = useReactTable({
    columns,
    data: data?.data ?? [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    onPaginationChange: setPagination,
    pageCount: data?.pagination?.last_page ?? 1,
    state: { pagination },
  })

  const toolbar = (
    <div className="flex flex-wrap gap-2">
      <Input
        placeholder={t('searchPlaceholder')}
        value={search}
        onChange={e => {
          setSearch(e.target.value)
          setPagination(p => ({ ...p, pageIndex: 0 }))
        }}
        className="max-w-xs"
      />
      <Select
        value={type || 'all'}
        onValueChange={v => {
          setType(v === 'all' ? '' : v)
          setPagination(p => ({ ...p, pageIndex: 0 }))
        }}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder={t('allTypes')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('allTypes')}</SelectItem>
          {MOVEMENT_TYPES.map(mt => (
            <SelectItem key={mt} value={mt}>{t(`types.${typeTranslationKey[mt]}`)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  return (
    <DataTable
      enableRowsPerPage
      isLoading={isLoading}
      table={table}
      toolbar={toolbar}
    />
  )
}
