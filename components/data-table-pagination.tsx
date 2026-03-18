'use client'

import { useCallback } from 'react'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

import { Button } from '@/components/ui/button'

import type { Table } from '@tanstack/react-table'

export type DataTablePagination<TData> =
  | null
  | PaginatedResponse<TData>['pagination']
  | TData
  | undefined

interface DataTablePaginationProps<TData> extends React.ComponentProps<'div'> {
  enableRowsPerPage?: boolean
  isLoading?: boolean
  pageSizeOptions?: number[]
  pagination?: DataTablePagination<TData>
  table: Table<TData>
}

export function DataTablePagination<TData>({
  className,
  enableRowsPerPage = true,
  isLoading = false,
  pageSizeOptions = [15, 25, 50, 100],
  pagination,
  table,
  ...props
}: DataTablePaginationProps<TData>) {
  const t = useTranslations('components.dataTable.pagination')
  // const { locale } = useLocale();
  // const pagination = table.getState().pagination;
  let totalPages = 0
  let currentPage = 0
  let totalItems = 0

  const isPagination =
    !!pagination &&
    typeof pagination === 'object' &&
    'last_page' in pagination &&
    pagination?.last_page !== undefined &&
    'total' in pagination &&
    !isNaN(pagination.total) &&
    'current_page' in pagination &&
    !isNaN(pagination.current_page) &&
    'per_page' in pagination &&
    !isNaN(pagination.per_page)

  const clientTotalPages = table.getPageCount()
  totalPages = isPagination ? pagination?.last_page : clientTotalPages
  currentPage = isPagination
    ? pagination?.current_page
    : table.getState().pagination.pageIndex + 1
  totalItems = isPagination
    ? pagination?.total
    : table.getFilteredRowModel().rows.length
  const handlePageSizeChange = (value: string) => {
    table.setPageSize(Number(value))
  }

  const handlePageChange = (page: number) => {
    table.setPageIndex(page - 1)
  }

  // Generate page numbers to display
  const generatePageNumbers = useCallback(() => {
    if (isLoading) return []

    const pages: (number | string)[] = []

    if (totalPages <= 7) {
      // Show all pages if total pages are 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage <= 2) {
        // Show: 1, 2, 3, ..., last
        for (let i = 2; i <= 3; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Show: 1, ..., last-2, last-1, last
        pages.push('...')
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Show: 1, ..., current-1, current, current+1, ..., last
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }, [isLoading, totalPages, currentPage])

  const pageNumbers = generatePageNumbers()

  if (isLoading) {
    return (
      <div
        className={cn(
          'mx-2 flex items-center justify-between gap-5',
          className
        )}
        {...props}
      >
        <Skeleton className="h-9 w-full max-w-[213px]" />
        <Skeleton className="h-9 w-full max-w-[177px]" />
      </div>
    )
  }

  return (
    <div
      className={cn('flex items-center justify-between gap-5', className)}
      {...props}
    >
      {enableRowsPerPage && (
        <div className="flex items-center gap-2">
          <Select
            disabled={isLoading}
            onValueChange={handlePageSizeChange}
            value={`${isPagination ? pagination?.per_page : table.getState().pagination.pageSize}`}
          >
            <SelectTrigger className="border-border bg-muted text-muted-foreground h-[34px] w-fit min-w-[80px] rounded-[7px] text-sm capitalize">
              <SelectValue />
              <span>{t('perPage')}</span>
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {totalItems !== undefined && (
            <span className="text-muted-foreground bg-muted flex h-9 items-center justify-center rounded-md border px-3 text-sm font-light">
              {t('totalItems', { count: `${totalItems}` })}
            </span>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center space-x-1">
          {pageNumbers.map((page, index) =>
            page === '...' ? (
              <span
                className="text-muted-foreground px-2 py-1 text-sm"
                key={`ellipsis-${index}`}
              >
                ...
              </span>
            ) : (
              <button
                className={cn(
                  'size-9 rounded-md text-sm font-medium transition-all duration-300',
                  currentPage === page
                    ? 'bg-muted border-border text-muted-foreground border'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer'
                )}
                key={page}
                onClick={() => handlePageChange(page as number)}
              >
                {page}
              </button>
            )
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button
          className="border-border bg-muted hover:bg-muted/80 h-9 gap-2.5 rounded-md px-3"
          disabled={currentPage <= 1}
          onClick={() => table.previousPage()}
          type="button"
          variant="outline"
        >
          <ChevronLeft className="size-4 rtl:scale-x-[-1]" /> {t('back')}
        </Button>
        <Button
          className="border-border bg-muted hover:bg-muted/80 h-[34px] gap-2.5 rounded-[7px] px-[14px]"
          disabled={currentPage >= totalPages}
          onClick={() => table.nextPage()}
          type="button"
          variant="outline"
        >
          {t('next')} <ChevronRight className="size-4 rtl:scale-x-[-1]" />
        </Button>
      </div>
    </div>
  )
}
