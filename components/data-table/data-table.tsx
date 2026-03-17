'use client'

import * as React from 'react'
import { Fragment } from 'react'

import {
  flexRender,
  type Row,
  type Table as TanstackTable
} from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils/utils'

import { ResponsiveTableWrapper } from '@/components/common/responsive-table-wrapper'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import { DataTableError } from './data-table-error'
import { DataTablePagination } from './data-table-pagination'

const ROW_SELECTION_IGNORE_SELECTOR =
  'button, [role="button"], a, input, textarea, select, label, [data-row-selection-ignore]'

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  actionBar?: React.ReactNode
  deleteDialog?: React.ReactNode
  emptyState?: React.ReactNode
  enableRowsPerPage?: boolean
  error?: unknown
  hidePagination?: boolean
  isError?: boolean
  isLoading?: boolean
  onReload?: () => void
  pageSizeOptions?: number[]
  pagination?: DataTablePagination<TData>
  refetch?: (() => Promise<unknown>) | (() => void)
  reloadLabel?: string
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactElement
  retryLabel?: string
  showReload?: boolean
  showRetry?: boolean
  table: TanstackTable<TData>
  toolbar?: React.ReactNode
  wrapperClassName?: string
}

export function DataTable<TData>({
  actionBar,
  children,
  className,
  deleteDialog,
  emptyState,
  enableRowsPerPage,
  error,
  hidePagination = false,
  isError,
  isLoading = false,
  onReload,
  pageSizeOptions,
  pagination,
  refetch,
  reloadLabel,
  renderSubComponent,
  retryLabel,
  showReload,
  showRetry,
  table,
  toolbar,
  wrapperClassName,
  ...props
}: DataTableProps<TData>) {
  const t = useTranslations('common')
  const hasActionBar = Boolean(actionBar)
  const headerGroups = table.getHeaderGroups()
  const headerGroupCount = Math.max(1, headerGroups.length)
  const totalColumnCount = table.getAllColumns().length + (hasActionBar ? 1 : 0)

  const toggleRowSelection = React.useCallback((row: Row<TData>) => {
    row.toggleSelected(!row.getIsSelected())
  }, [])

  const handleRowClick = React.useCallback(
    (event: React.MouseEvent<HTMLTableRowElement>, row: Row<TData>) => {
      if (!hasActionBar || event.defaultPrevented) {
        return
      }

      if (shouldIgnoreRowSelection(event.target)) {
        return
      }

      toggleRowSelection(row)
    },
    [hasActionBar, toggleRowSelection]
  )

  const handleRowKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLTableRowElement>, row: Row<TData>) => {
      if (!hasActionBar) {
        return
      }

      const isActivationKey = event.key === ' ' || event.key === 'Enter'
      if (!isActivationKey) {
        return
      }

      event.preventDefault()
      toggleRowSelection(row)
    },
    [hasActionBar, toggleRowSelection]
  )

  // Show error state if there's an error
  if (isError) {
    return (
      <div
        className={cn(
          '[&_table]:bg-background [&_tbody_tr]:border-border [&_thead_tr]:bg-background [&_th]:text-foreground flex w-full max-w-[calc(100vw-2rem)] flex-col justify-between overflow-hidden rounded-xl border [&_tbody_tr]:border-b [&_td]:px-3 [&_td]:py-3 [&_th]:p-1 [&_th]:font-medium [&_th]:whitespace-nowrap',
          className
        )}
        {...props}
      >
        {toolbar && <div className="border-b p-4">{toolbar}</div>}
        {children}
        <DataTableError
          error={error}
          isError={isError}
          onReload={onReload}
          refetch={refetch}
          reloadLabel={reloadLabel}
          retryLabel={retryLabel}
          showReload={showReload}
          showRetry={showRetry}
        />
      </div>
    )
  }

  return (
    <>
      {toolbar && <div className="py-4">{toolbar}</div>}
      <div
        className={cn(
          '[&_table]:bg-background [&_tbody_tr]:border-border [&_thead_tr]:bg-background [&_th]:text-foreground flex w-full max-w-[calc(100vw-2rem)] flex-col justify-between overflow-hidden rounded-xl border [&_tbody_tr]:border-b [&_td]:px-3 [&_td]:py-3 [&_th]:p-1 [&_th]:font-medium [&_th]:whitespace-nowrap',
          className
        )}
        {...props}
      >
        {children}
        <ResponsiveTableWrapper>
          <div
            className={cn(
              'max-h-[calc(100vh-16rem)] overflow-x-auto overflow-y-auto md:max-h-[calc(100vh-25rem)]',
              wrapperClassName
            )}
          >
            <Table className="w-full overflow-visible">
              <TableHeader>
                {headerGroups.map((headerGroup, index) => (
                  <TableRow
                    className="bg-background sticky top-0 z-20 shadow-xs"
                    key={headerGroup.id}
                  >
                    {hasActionBar && index === 0 && (
                      <TableHead
                        className="border-border bg-background px-3 text-center"
                        rowSpan={headerGroupCount}
                        style={{ width: 56 }}
                      >
                        <Checkbox
                          aria-label={t('components.dataTable.dataGridTable.selectAll')}
                          checked={
                            table.getIsAllPageRowsSelected()
                              ? true
                              : table.getIsSomePageRowsSelected()
                                ? 'indeterminate'
                                : false
                          }
                          onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                          }
                        />
                      </TableHead>
                    )}
                    {headerGroup.headers.map((header) => {
                      const size = header.column.columnDef.size
                      const minSize = header.column.columnDef.minSize
                      const maxSize = header.column.columnDef.maxSize
                      return (
                        <TableHead
                          className="border-border bg-background text-foreground h-13.75 border border-l font-medium whitespace-nowrap first:border-l-0"
                          colSpan={header.colSpan}
                          key={header.id}
                          style={{
                            maxWidth: maxSize != null ? `${maxSize}px` : 'auto',
                            minWidth: minSize != null ? `${minSize}px` : 'auto',
                            width: size != null ? `${size}px` : 'auto'
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody
                className={cn(
                  'relative',
                  isLoading && '[&_tr:has(td):hover]:bg-transparent'
                )}
              >
                {table?.getRowModel()?.rows?.length ? (
                  table?.getRowModel()?.rows?.map((row) => (
                    <Fragment key={row.id}>
                      <TableRow
                        aria-selected={row.getIsSelected() ? true : undefined}
                        className={cn(
                          hasActionBar &&
                            'focus-visible:outline-ring cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-1]',
                          row.getIsExpanded() &&
                            'bg-secondary hover:bg-secondary/70!'
                        )}
                        data-state={row.getIsSelected() && 'selected'}
                        key={row.id}
                        onClick={
                          hasActionBar
                            ? (event) => handleRowClick(event, row)
                            : undefined
                        }
                        onKeyDown={
                          hasActionBar
                            ? (event) => handleRowKeyDown(event, row)
                            : undefined
                        }
                        tabIndex={hasActionBar ? 0 : undefined}
                      >
                        {hasActionBar && (
                          <TableCell
                            className="border-border bg-background p-0 text-center"
                            style={{ width: 56 }}
                          >
                            <Checkbox
                              aria-label={`${t('components.dataTable.dataGridTable.selectRow')} ${row.index + 1}`}
                              checked={row.getIsSelected() || false}
                              className="-ms-2"
                              onCheckedChange={(value) =>
                                row.toggleSelected(!!value)
                              }
                              onClick={(event) => event.stopPropagation()}
                            />
                          </TableCell>
                        )}
                        {row.getVisibleCells().map((cell) => {
                          const size = cell.column.columnDef.size
                          const minSize = cell.column.columnDef.minSize
                          const maxSize = cell.column.columnDef.maxSize
                          return (
                            <TableCell
                              className="whitespace-nowrap"
                              key={cell.id}
                              style={{
                                maxWidth:
                                  maxSize != null ? `${maxSize}px` : 'auto',
                                minWidth:
                                  minSize != null ? `${minSize}px` : 'auto',
                                width: size != null ? `${size}px` : 'auto'
                              }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                      {row.getIsExpanded() &&
                        renderSubComponent &&
                        renderSubComponent({ row })}
                    </Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      className={cn(
                        'text-center',
                        emptyState ? 'h-auto py-4' : 'h-24'
                      )}
                      colSpan={totalColumnCount}
                    >
                      {isLoading ? (
                        <div className="mb-4 flex flex-col gap-4 p-2">
                          {Array.from({
                            length: table.getAllColumns().length
                          }).map((_, index) => (
                            <Skeleton className="h-10 w-full" key={index} />
                          ))}
                        </div>
                      ) : emptyState ? (
                        emptyState
                      ) : (
                        t('components.dataTable.empty.noData')
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </ResponsiveTableWrapper>
        {!hidePagination && (
          <div className="bg-card flex flex-col gap-2.5 border-t p-2.5">
            <DataTablePagination
              enableRowsPerPage={enableRowsPerPage}
              isLoading={isLoading}
              pageSizeOptions={pageSizeOptions}
              pagination={pagination}
              table={table}
            />
            {actionBar &&
              table.getFilteredSelectedRowModel().rows.length > 0 &&
              actionBar}
          </div>
        )}
        {deleteDialog}
      </div>
    </>
  )
}

function shouldIgnoreRowSelection(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return false
  }

  return Boolean(target.closest(ROW_SELECTION_IGNORE_SELECTOR))
}
