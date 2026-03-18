'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'

import { useTranslations } from 'next-intl'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

import {
  type BreadcrumbItemData,
  generateBreadcrumbItems
} from './breadcrumbs-utils'
import { Home2Icon as Home } from './icons'

export interface SmartBreadcrumbProps {
  resourceName?: string
}

interface BreadcrumbContentProps {
  disabled?: boolean
  href: null | string
  isHome: boolean
  isLast: boolean
  title?: string
}

interface BreadcrumbFragmentProps {
  index: number
  item: BreadcrumbItemData
  totalItems: number
}

export function SmartBreadcrumb({ resourceName }: SmartBreadcrumbProps = {}) {
  const pathname = usePathname()
  const t = useTranslations('components.breadcrumbs')

  const breadcrumbItems = generateBreadcrumbItems(pathname, t, resourceName)

  // Don't render if only home breadcrumb or no breadcrumbs
  if (breadcrumbItems.length <= 1) {
    return null
  }

  return (
    <Breadcrumb ariaLabel={t('ariaLabel')} className="mb-4">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbFragment
            index={index}
            item={item}
            key={`${item.title}-${index}`}
            totalItems={breadcrumbItems.length}
          />
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function BreadcrumbContent({
  disabled,
  href,
  isHome,
  isLast,
  title
}: BreadcrumbContentProps) {
  // Active/Current page (last item)
  if (isLast) {
    return (
      <BreadcrumbPage className="flex items-center gap-1.5 rounded-full bg-[#F2F2F2] px-3 py-1 font-medium dark:bg-[#2A2A2A]">
        {isHome && <Home className="size-4" />}
        <span className="text-xs!">{title}</span>
      </BreadcrumbPage>
    )
  }

  // Disabled item (non-navigable)
  if (disabled) {
    return (
      <span className="flex cursor-not-allowed items-center gap-1.5 rounded-full bg-[#F2F2F2] px-3 py-1 text-[#9CA3AF] dark:bg-[#2A2A2A] dark:text-[#6B7280]">
        {isHome && <Home className="size-4" />}
        <span className="text-muted-foreground text-xs!">{title}</span>
      </span>
    )
  }

  // Normal navigable link
  return (
    <BreadcrumbLink asChild>
      <Link
        className="hover:text-foreground flex items-center justify-center gap-1.5 rounded-full bg-[#F2F2F2] p-1 text-[#656565] transition-colors dark:bg-[#2A2A2A] dark:text-[#A0A0A0]"
        href={href || '#'}
      >
        {isHome && <Home className="" />}
        <span className="px-1.5 text-xs!" hidden={!title}>
          {title}
        </span>
      </Link>
    </BreadcrumbLink>
  )
}

function BreadcrumbFragment({
  index,
  item,
  totalItems
}: BreadcrumbFragmentProps) {
  const isLast = index === totalItems - 1
  const isHome = index === 0

  return (
    <Fragment>
      <BreadcrumbItem>
        <BreadcrumbContent
          disabled={item.disabled}
          href={item.href}
          isHome={isHome}
          isLast={isLast}
          title={item.title}
        />
      </BreadcrumbItem>
      {!isLast && <BreadcrumbSeparator />}
    </Fragment>
  )
}
