'use client'

import * as React from 'react'

import { PlusIcon, SettingsIcon } from '@/lib/icons'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils/utils'

import { triggerClassName } from '@/components/data-table/filters/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { DataTableColumnVisibilityProps } from '@/types/data-table'

// Format column ID to display name
const formatColumnName = (columnId: string): string => {
  return (
    columnId
      // Replace underscores with spaces
      .replace(/_/g, ' ')
      // Add space before capital letters (for camelCase)
      .replace(/([A-Z])/g, ' $1')
      // Capitalize first letter of each word
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .trim()
  )
}

// View options with column count
export function CountedViewOptions<TData>({
  className,
  table
}: DataTableColumnVisibilityProps<TData>) {
  const t = useTranslations('common')
  const allHideableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanHide())

  const visibleColumns = allHideableColumns.filter((column) =>
    column.getIsVisible()
  ).length

  const totalColumns = allHideableColumns.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn('ms-auto h-8', className)}
          size="sm"
          variant="outline"
        >
          <SettingsIcon className="size-3.5" />
          {t('components.dataTable.viewOptions.view')} ({visibleColumns}/{totalColumns})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>
          {t('components.dataTable.viewOptions.showing')} {visibleColumns} {t('components.dataTable.viewOptions.of')} {totalColumns}{' '}
          {t('components.dataTable.viewOptions.columnsLabel')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {allHideableColumns.map((column) => {
          return (
            <DropdownMenuCheckboxItem
              checked={column.getIsVisible()}
              className="capitalize"
              key={column.id}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {formatColumnName(column.id)}
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function DataTableViewOptions<TData>({
  className,
  table
}: DataTableColumnVisibilityProps<TData>) {
  const t = useTranslations('common')
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            triggerClassName,
            className,
            'text-muted-foreground flex-1 gap-2 lg:max-w-fit lg:flex-initial'
          )}
          variant="outline"
        >
          <SettingsIcon className="size-3.5" />
          {t('components.dataTable.viewOptions.viewOptions')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]" side="bottom">
        <DropdownMenuLabel>{t('components.dataTable.viewOptions.toggleColumns')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                checked={column.getIsVisible()}
                key={column.id}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {formatColumnName(column.id)}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// View options with column groups
export function GroupedViewOptions<TData>({
  className,
  groups,
  table
}: DataTableColumnVisibilityProps<TData> & {
  groups?: Array<{
    columns: string[]
    label: string
  }>
}) {
  const [open, setOpen] = React.useState(false)
  const t = useTranslations('common')

  if (!groups) {
    return <SimpleViewOptions className={className} table={table} />
  }

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn('ms-auto h-8', className)}
          size="sm"
          variant="outline"
        >
          <PlusIcon className="me-2 h-4 w-4" />
          {t('components.dataTable.viewOptions.view')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>{t('components.dataTable.viewOptions.columnVisibility')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {groups.map((group, index) => (
          <React.Fragment key={group.label}>
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              {group.label}
            </DropdownMenuLabel>
            {group.columns.map((columnId) => {
              const column = table.getColumn(columnId)
              if (!column || !column.getCanHide()) return null

              return (
                <DropdownMenuCheckboxItem
                  checked={column.getIsVisible()}
                  className="capitalize"
                  key={columnId}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {formatColumnName(columnId)}
                </DropdownMenuCheckboxItem>
              )
            })}
            {index < groups.length - 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// View options with reset functionality
export function ResettableViewOptions<TData>({
  className,
  table
}: DataTableColumnVisibilityProps<TData>) {
  const [open, setOpen] = React.useState(false)
  const t = useTranslations('common')

  const resetColumns = () => {
    table.resetColumnVisibility()
  }

  const hideAllColumns = () => {
    table.getAllColumns().forEach((column) => {
      if (column.getCanHide()) {
        column.toggleVisibility(false)
      }
    })
  }

  const showAllColumns = () => {
    table.getAllColumns().forEach((column) => {
      if (column.getCanHide()) {
        column.toggleVisibility(true)
      }
    })
  }

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn('ms-auto h-8', className)}
          size="sm"
          variant="outline"
        >
          <PlusIcon className="me-2 h-4 w-4" />
          {t('components.dataTable.viewOptions.view')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>{t('components.dataTable.viewOptions.columnVisibility')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="capitalize" onClick={showAllColumns}>
          {t('components.dataTable.viewOptions.showAll')}
        </DropdownMenuItem>
        <DropdownMenuItem className="capitalize" onClick={hideAllColumns}>
          {t('components.dataTable.viewOptions.hideAll')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="capitalize" onClick={resetColumns}>
          {t('components.dataTable.viewOptions.reset')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                checked={column.getIsVisible()}
                className="capitalize"
                key={column.id}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {formatColumnName(column.id)}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// View options with search
export function SearchableViewOptions<TData>({
  className,
  table
}: DataTableColumnVisibilityProps<TData>) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const t = useTranslations('common')

  const columns = table
    .getAllColumns()
    .filter((column) => column.getCanHide())
    .filter((column) =>
      formatColumnName(column.id).toLowerCase().includes(search.toLowerCase())
    )

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn('ms-auto h-8', className)}
          size="sm"
          variant="outline"
        >
          <PlusIcon className="me-2 h-4 w-4" />
          {t('components.dataTable.viewOptions.view')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>{t('components.dataTable.viewOptions.columnVisibility')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2">
          <input
            className="border-input bg-background w-full rounded border px-2 py-1 text-sm"
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('components.dataTable.viewOptions.searchPlaceholder')}
            type="text"
            value={search}
          />
        </div>
        <DropdownMenuSeparator />
        {columns.length === 0 ? (
          <div className="text-muted-foreground p-2 text-sm">
            {t('components.dataTable.viewOptions.noColumnsFound')}
          </div>
        ) : (
          columns.map((column) => {
            return (
              <DropdownMenuCheckboxItem
                checked={column.getIsVisible()}
                className="capitalize"
                key={column.id}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {formatColumnName(column.id)}
              </DropdownMenuCheckboxItem>
            )
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Simple view options with just show/hide
export function SimpleViewOptions<TData>({
  className,
  table
}: DataTableColumnVisibilityProps<TData>) {
  const [open, setOpen] = React.useState(false)
  const t = useTranslations('common')

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn('ms-auto h-8', className)}
          size="sm"
          variant="outline"
        >
          <PlusIcon className="me-2 h-4 w-4" />
          {t('components.dataTable.viewOptions.columns')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>{t('components.dataTable.viewOptions.showColumns')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                checked={column.getIsVisible()}
                className="capitalize"
                key={column.id}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {formatColumnName(column.id)}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
