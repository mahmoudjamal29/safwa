'use client'

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon
} from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import type { Table } from '@tanstack/react-table'

// Re-exported as a type for use in data-table.tsx
export type DataTablePagination<TData> = {
  pageCount?: number
  total?: number
  table?: Table<TData>
}

interface DataTablePaginationProps<TData> {
  enableRowsPerPage?: boolean
  isLoading?: boolean
  pageSizeOptions?: number[]
  pagination?: DataTablePagination<TData>
  table: Table<TData>
}

const DEFAULT_PAGE_SIZES = [10, 15, 20, 30, 50]

export function DataTablePagination<TData>({
  enableRowsPerPage = true,
  isLoading: _isLoading,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  table
}: DataTablePaginationProps<TData>) {
  const t = useTranslations('components.dataTable.pagination')

  return (
    <div className="flex items-center justify-between gap-4 px-2">
      <div className="text-muted-foreground flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <span>
            {table.getFilteredSelectedRowModel().rows.length}{' '}
            {t('rowsSelected', {
              total: table.getFilteredRowModel().rows.length
            })}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        {enableRowsPerPage && (
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{t('rowsPerPage')}</p>
            <Select
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
              value={`${table.getState().pagination.pageSize}`}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {t('pageOf', {
            current: table.getState().pagination.pageIndex + 1,
            total: table.getPageCount()
          })}
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="hidden h-8 w-8 p-0 lg:flex"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
            variant="outline"
          >
            <span className="sr-only">{t('firstPage')}</span>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            className="h-8 w-8 p-0"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            variant="outline"
          >
            <span className="sr-only">{t('previousPage')}</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            className="h-8 w-8 p-0"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            variant="outline"
          >
            <span className="sr-only">{t('nextPage')}</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            className="hidden h-8 w-8 p-0 lg:flex"
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            variant="outline"
          >
            <span className="sr-only">{t('lastPage')}</span>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
