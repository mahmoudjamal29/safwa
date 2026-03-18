'use client'

import { type ReactNode, useCallback, useTransition } from 'react'

import { Table } from '@tanstack/react-table'
import { Download, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { parseAsString, useQueryState } from 'nuqs'
import { toast } from 'sonner'

import { env } from '@/lib'
import { type PERMISSION } from '@/lib/auth/permissions'

import { cn } from '@/utils'

import { TableSearch } from '@/components/common/table-search'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

import { type DataTableFilterProps } from './data-table-filter'
import { DataTableFiltersPopover } from './data-table-filters-popover'
import { DataTableViewOptions } from './data-table-view-options'

export interface DataTableTopBarProps<TData = unknown> {
  // Children for custom content
  children?: ReactNode
  // Additional props
  className?: string
  // Create button configuration
  createButtonDisabled?: boolean

  createButtonHref?: string
  createButtonText?: string
  disableSearch?: boolean
  // Export configuration
  exportConfig?: {
    buttonText?: string
    endpoint: string
    filename: string
    onExport?: () => Promise<void>
  }

  // Filter configuration - uses same types as DataTableFilter
  filters?: DataTableFilterProps[]

  onCreateClick?: () => void

  permissions?: {
    create?: PERMISSION
    export?: PERMISSION
  }
  // Custom action buttons to render in the actions section
  rightContent?: ReactNode

  searchKey?: string

  // Search configuration
  searchPlaceholder?: string

  showViewOptions?: boolean

  // Table instance for view options
  table?: Table<TData>
}

export type { FilterOption } from './filters/types'

export function DataTableToolbar<TData = unknown>({
  children,
  className,
  createButtonDisabled = false,
  createButtonHref,
  createButtonText,
  disableSearch = false,
  exportConfig,
  filters = [],
  onCreateClick,
  permissions,
  rightContent,
  searchKey = 'search',
  searchPlaceholder,
  showViewOptions = true,
  table
}: DataTableTopBarProps<TData>) {
  const [isExportPending, startExportTransition] = useTransition()
  const [isCreatePending, startCreateTransition] = useTransition()
  const tTopBar = useTranslations('components.dataTable.topbar')
  const tError = useTranslations('components.dataTable.error')
  const resolvedCreateButtonText = createButtonText || tTopBar('create')
  const resolvedSearchPlaceholder = searchPlaceholder || tTopBar('search')

  const [searchValue] = useQueryState(searchKey, parseAsString.withDefault(''))

  const handleExport = useCallback(async () => {
    startExportTransition(async () => {
      if (!exportConfig) return

      try {
        if (exportConfig.onExport) {
          await exportConfig.onExport()
          return
        }

        // Read filter values from URL params for export
        const urlParams = new URLSearchParams(window.location.search)
        const filterParams: Record<string, string> = {}
        filters.forEach((filter) => {
          const value = urlParams.get(filter.key)
          if (value && value !== '') {
            filterParams[filter.key] = value
          }
        })

        const { fetcher } = await import('@/lib/fetcher')
        const response = (await fetcher(exportConfig.endpoint, {
          auth: true,
          method: 'POST',
          params: {
            // Include search if it exists
            ...(searchValue ? { search: searchValue } : {}),
            // Include filter values (excluding page and per_page)
            ...Object.fromEntries(
              Object.entries(filterParams).filter(
                ([key]) => key !== 'page' && key !== 'per_page'
              )
            )
          },
          responseType: 'blob'
        })) as unknown as Blob

        // Create download link
        // if (!blob) {
        //   throw new Error('No data received from export endpoint')
        // }
        const downloadUrl = window.URL.createObjectURL(response)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = `${exportConfig.filename}-${new Date().toISOString().split('T')[0]}.xlsx`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)
      } catch (error) {
        toast.error(tError('exportError'))
        if (env.NEXT_PUBLIC_DEV_MODE) {
          console.error('Export failed:', error)
        }
      }
    })
  }, [exportConfig, filters, searchValue, tError])

  return (
    <div
      className={cn(
        'flex w-full max-w-[calc(100vw-2rem)] flex-col flex-wrap justify-between gap-4 rounded-lg md:w-full lg:flex-row md:rtl:flex-row-reverse',
        className
      )}
    >
      <div className="flex flex-row flex-wrap items-start gap-2 sm:items-center rtl:flex-row-reverse">
        {filters.length > 0 && <DataTableFiltersPopover filters={filters} />}
        {table && showViewOptions && (
          <DataTableViewOptions
            className="ms-0 flex-1 lg:ms-auto lg:flex-initial"
            table={table}
          />
        )}

        {children}
      </div>

      {/* Actions Section */}
      <div className="flex w-full flex-col gap-4 md:w-auto md:flex-wrap lg:flex-row lg:items-center rtl:md:flex-row-reverse">
        {!disableSearch && (
          <TableSearch placeholder={resolvedSearchPlaceholder} />
        )}

        {rightContent && <div className="w-full md:w-auto">{rightContent}</div>}

        {/* Export Button */}
        {exportConfig && (
          <Button
            className="text-muted-foreground bg-card w-full md:w-auto"
            disabled={isExportPending}
            onClick={handleExport}
            permissionKey={permissions?.export}
            variant="outline"
          >
            {isExportPending ? (
              <Spinner className="size-4" />
            ) : (
              <Download className="size-3.5" />
            )}
            {exportConfig.buttonText || tTopBar('export')}
          </Button>
        )}

        {createButtonHref ? (
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center gap-2 md:w-auto"
            disabled={createButtonDisabled || isCreatePending}
            link={{ href: createButtonHref, prefetch: true }}
            onClick={() => startCreateTransition(() => onCreateClick?.())}
            permissionKey={permissions?.create}
          >
            {isCreatePending ? (
              <Spinner className="size-4" />
            ) : (
              <Plus className="size-4" />
            )}
            {resolvedCreateButtonText}
          </Button>
        ) : onCreateClick ? (
          <Button
            className="text-primary-foreground hover:bg-primary/90 w-full transition-colors md:w-auto"
            disabled={createButtonDisabled || isCreatePending}
            onClick={() => startCreateTransition(() => onCreateClick?.())}
            permissionKey={permissions?.create}
          >
            {isCreatePending ? (
              <Spinner className="size-4" />
            ) : (
              <Plus className="size-4" />
            )}
            {resolvedCreateButtonText}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
