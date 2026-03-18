'use client'

import * as React from 'react'

import { ArrowDown, ArrowUp, ArrowUpDown, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils/utils'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { DataTableColumnHeaderProps } from '@/types/data-table'

// Column header with custom actions
export function CustomColumnHeader<TData, TValue>({
  actions,
  className,
  column,
  title
}: DataTableColumnHeaderProps<TData, TValue> & {
  actions?: React.ReactNode
}) {
  const tColumns = useTranslations('components.dataTable.columns.labels')
  const translatedTitle = React.useMemo(() => {
    const rawTitle = title || column.id
    const key = rawTitle
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
    const translationKey = key as never
    return tColumns.has(translationKey) ? tColumns(translationKey) : rawTitle
  }, [column.id, tColumns, title])

  return (
    <div className={cn('flex items-center justify-start', className)}>
      <div className="flex items-center gap-2">
        <span>{translatedTitle}</span>
        {column.getCanSort() && (
          <Button
            className="flex! h-6 w-6 items-center justify-start! p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            size="sm"
            variant="ghost"
          >
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="h-3 w-3" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="h-3 w-3" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-50" />
            )}
          </Button>
        )}
      </div>
      {actions && <div className="flex items-center gap-1">{actions}</div>}
    </div>
  )
}

export function DataTableActionsHeader({ className }: { className?: string }) {
  const tColumns = useTranslations('components.dataTable.columns.labels')

  return (
    <div className={cn('text-center font-semibold', className)}>
      {tColumns('actions')}
    </div>
  )
}

export function DataTableColumnHeader<TData, TValue>({
  className,
  column,
  title
}: DataTableColumnHeaderProps<TData, TValue>) {
  const t = useTranslations('components.dataTable.columnHeader')
  const tColumns = useTranslations('components.dataTable.columns.labels')
  const translatedTitle = React.useMemo(() => {
    const rawTitle = title || column.id
    const key = rawTitle
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
    const translationKey = key as never
    return tColumns.has(translationKey) ? tColumns(translationKey) : rawTitle
  }, [column.id, tColumns, title])

  if (!column.getCanSort()) {
    return (
      <div className={cn('px-2 text-start font-semibold', className)}>
        {translatedTitle}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex w-full items-center justify-center gap-2 px-2',
        className
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="data-[state=open]:bg-accent flex h-10 w-full max-w-full min-w-full items-center justify-start rounded-sm bg-transparent px-2 text-sm font-semibold **:bg-transparent hover:bg-transparent"
            size="sm"
            variant="ghost"
          >
            <span>{translatedTitle}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ms-2 h-4 w-4" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ms-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ms-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="text-muted-foreground/70 me-2 h-3.5 w-3.5" />
            {t('asc')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="text-muted-foreground/70 me-2 h-3.5 w-3.5" />
            {t('desc')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className="text-muted-foreground/70 me-2 h-3.5 w-3.5" />
            {t('hide')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Column header with filter
export function FilterableColumnHeader<TData, TValue>({
  className,
  column,
  filterComponent,
  title
}: DataTableColumnHeaderProps<TData, TValue> & {
  filterComponent?: React.ReactNode
}) {
  const tColumns = useTranslations('components.dataTable.columns.labels')
  const translatedTitle = React.useMemo(() => {
    const rawTitle = title || column.id
    const key = rawTitle
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
    const translationKey = key as never
    return tColumns.has(translationKey) ? tColumns(translationKey) : rawTitle
  }, [column.id, tColumns, title])

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2">
        <span className="font-medium">{translatedTitle}</span>
        {column.getCanSort() && (
          <Button
            className="h-6 w-6 p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            size="sm"
            variant="ghost"
          >
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="h-3 w-3" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="h-3 w-3" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-50" />
            )}
          </Button>
        )}
      </div>
      {filterComponent && (
        <div className="flex items-center gap-2">{filterComponent}</div>
      )}
    </div>
  )
}

// Column header with meta information
export function MetaColumnHeader<TData, TValue>({
  className,
  column,
  title
}: DataTableColumnHeaderProps<TData, TValue>) {
  const meta = column.columnDef.meta
  const tColumns = useTranslations('components.dataTable.columns.labels')
  const translatedTitle = React.useMemo(() => {
    const rawTitle = title || column.id
    const key = rawTitle
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
    const translationKey = key as never
    return tColumns.has(translationKey) ? tColumns(translationKey) : rawTitle
  }, [column.id, tColumns, title])

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center gap-2">
        <span className="font-medium">{translatedTitle}</span>
        {column.getCanSort() && (
          <Button
            className="h-6 w-6 p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            size="sm"
            variant="ghost"
          >
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="h-3 w-3" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="h-3 w-3" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-50" />
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

// Simple column header without dropdown
export function SimpleColumnHeader<TData, TValue>({
  className,
  column,
  title
}: DataTableColumnHeaderProps<TData, TValue>) {
  const tColumns = useTranslations('components.dataTable.columns.labels')
  const handleSort = () => {
    if (column.getCanSort()) {
      column.toggleSorting(column.getIsSorted() === 'asc')
    }
  }
  const translatedTitle = React.useMemo(() => {
    const rawTitle = title || column.id
    const key = rawTitle
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
    const translationKey = key as never
    return tColumns.has(translationKey) ? tColumns(translationKey) : rawTitle
  }, [column.id, tColumns, title])

  return (
    <button
      className={cn(
        'flex items-center gap-2 px-10',
        column.getCanSort() &&
          'hover:text-foreground cursor-pointer select-none',
        column.getCanSort() &&
          'hover:text-foreground cursor-pointer select-none',
        className
      )}
      onClick={handleSort}
    >
      <span>{translatedTitle}</span>
      {column.getCanSort() && (
        <div className="flex flex-col">
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="h-3 w-3" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="h-3 w-3" />
          ) : (
            <ArrowUpDown className="h-3 w-3 opacity-50" />
          )}
        </div>
      )}
    </button>
  )
}
