'use client'

import type React from 'react'

import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export type DetailsTableColumn<T> = {
  cellClassName?: string
  header: React.ReactNode
  headerClassName?: string
  id: string
  render: (row: T, rowIndex: number) => React.ReactNode
}

type DetailsTableProps<T> = {
  className?: string
  columns: DetailsTableColumn<T>[]
  data: T[]
  emptyMessage?: string
  getRowKey?: (row: T, rowIndex: number) => React.Key
  title?: string
}

export function DetailsTable<T>({
  className,
  columns,
  data,
  emptyMessage,
  getRowKey,
  title = ''
}: DetailsTableProps<T>) {
  const t = useTranslations('components.ui.detailsTable')
  const resolvedEmptyMessage = emptyMessage ?? t('emptyMessage')
  return (
    <div>
      {title && (
        <div className="px-3 sm:px-4">
          <h3 className="text-muted-foreground text-xs font-semibold uppercase sm:text-sm">
            {title}
          </h3>
        </div>
      )}
      <div
        className={cn(
          'bg-card mt-2 w-full max-w-[calc(100vw-4rem)] overflow-x-auto rounded-lg border sm:mt-3 md:mt-4',
          className
        )}
      >
        <Table
          className="min-w-full border-separate border-spacing-0 text-left text-xs sm:text-sm"
          wrapperClassName="w-full"
        >
          <TableHeader className="bg-transparent [&_tr]:border-0">
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  className={cn(
                    'h-auto px-0 text-left',
                    column.headerClassName
                  )}
                  key={column.id}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-transparent">
            {data.map((row, rowIndex) => (
              <TableRow
                className="border-b transition-none last:border-b-0 [&:has(td):hover]:bg-transparent"
                key={getRowKey ? getRowKey(row, rowIndex) : rowIndex}
              >
                {columns.map((column) => (
                  <TableCell
                    className={cn('p-0', column.cellClassName)}
                    key={column.id}
                  >
                    {column.render(row, rowIndex)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow className="transition-none [&:has(td):hover]:bg-transparent">
                <TableCell
                  className="text-muted-foreground px-3 py-4 text-center text-xs sm:px-4 sm:text-sm"
                  colSpan={columns.length}
                >
                  {resolvedEmptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
