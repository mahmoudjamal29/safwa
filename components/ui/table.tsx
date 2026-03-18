'use client'

import * as React from 'react'

import { cn } from '@/utils'

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  wrapperClassName?: string
  wrapperStyle?: React.CSSProperties
}

function Table({
  className,
  wrapperClassName,
  wrapperStyle,
  ...props
}: TableProps) {
  return (
    <div
      className={cn(
        'text-foreground relative w-full overflow-auto',
        wrapperClassName
      )}
      data-slot="table-wrapper"
      style={wrapperStyle}
    >
      <table
        className={cn('w-full caption-bottom text-sm', className)}
        data-slot="table"
        {...props}
      />
    </div>
  )
}

function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn('bg-card [&_tr:last-child]:border-0', className)}
      data-slot="table-body"
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={cn('text-muted-foreground mt-4 text-sm', className)}
      data-slot="table-caption"
      {...props}
    />
  )
}

function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        'align-start p-4 text-start [&:has([role=checkbox])]:pe-0',
        className
      )}
      data-slot="table-cell"
      {...props}
    />
  )
}

function TableFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={cn(
        'bg-muted/50 border-t font-medium last:[&>tr]:border-b-0',
        className
      )}
      data-slot="table-footer"
      {...props}
    />
  )
}

function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'h-12 px-4 text-center align-middle font-normal [&:has([role=checkbox])]:pe-0',
        className
      )}
      data-slot="table-head"
      {...props}
    />
  )
}

function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn('bg-card [&_tr]:border-b', className)}
      data-slot="table-header"
      {...props}
    />
  )
}

function TableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        '[&:has(td):hover]:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
        className
      )}
      data-slot="table-row"
      {...props}
    />
  )
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
}
