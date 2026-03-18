'use client'

import * as React from 'react'

import { MoreHorizontal } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => {
  const t = useTranslations('components.dataTable.pagination')

  return (
    <nav
      aria-label={t('ariaLabel')}
      className={cn('mx-auto flex w-full justify-center', className)}
      data-slot="pagination"
      role="navigation"
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      className={cn('flex flex-row items-center gap-1', className)}
      data-slot="pagination-content"
      {...props}
    />
  )
}

function PaginationItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li className={cn('', className)} data-slot="pagination-item" {...props} />
  )
}

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => {
  const t = useTranslations('components.dataTable.pagination')

  return (
    <span
      aria-hidden
      className={cn('flex h-9 w-9 items-center justify-center', className)}
      data-slot="pagination-ellipsis"
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">{t('morePages')}</span>
    </span>
  )
}

export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem }
