import * as React from 'react'

import { ChevronRight, MoreHorizontal } from 'lucide-react'
import { Slot as SlotPrimitive } from 'radix-ui'

import { cn } from '@/utils'

function Breadcrumb({
  ariaLabel,
  ...props
}: React.ComponentProps<'nav'> & {
  ariaLabel?: string
  separator?: React.ReactNode
}) {
  return (
    <nav
      aria-label={ariaLabel || 'breadcrumb'}
      data-slot="breadcrumb"
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      className={cn('inline-flex items-center gap-1.5', className)}
      data-slot="breadcrumb-item"
      {...props}
    />
  )
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<'a'> & {
  asChild?: boolean
}) {
  const Comp = asChild ? SlotPrimitive.Slot : 'a'

  return (
    <Comp
      className={cn('hover:text-foreground transition-colors', className)}
      data-slot="breadcrumb-link"
      {...props}
    />
  )
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
  return (
    <ol
      className={cn(
        'text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words',
        className
      )}
      data-slot="breadcrumb-list"
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-current="page"
      aria-disabled="true"
      className={cn('text-foreground font-normal', className)}
      data-slot="breadcrumb-page"
      role="link"
      {...props}
    />
  )
}

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<'li'>) => (
  <li
    aria-hidden="true"
    className={cn('[&>svg]:h-3.5 [&>svg]:w-3.5', className)}
    data-slot="breadcrumb-separator"
    role="presentation"
    {...props}
  >
    {children ?? <ChevronRight className="rtl:rotate-180" />}
  </li>
)

const BreadcrumbEllipsis = ({
  className,
  moreLabel,
  ...props
}: React.ComponentProps<'span'> & {
  moreLabel?: string
}) => (
  <span
    aria-hidden="true"
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    data-slot="breadcrumb-ellipsis"
    role="presentation"
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">{moreLabel || 'More'}</span>
  </span>
)

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
}
