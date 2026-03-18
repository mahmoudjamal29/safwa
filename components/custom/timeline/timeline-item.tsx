'use client'

import { ReactNode } from 'react'

import { cn } from '@/utils/utils'

import type { LucideIcon } from 'lucide-react'

export interface TimelineItemProps {
  children: ReactNode
  icon: any | LucideIcon
  iconClassName?: string
  indicatorClassName?: string
  line?: boolean
  removeSpace?: boolean
}

export function TimelineItem({
  children,
  icon: Icon,
  iconClassName,
  indicatorClassName,
  line = false,
  removeSpace = false
}: TimelineItemProps) {
  return (
    <div className="relative flex items-start">
      {line ? (
        <div className="border-s-input absolute inset-x-auto top-[26px] bottom-0 w-[26px] translate-x-1/2 border-s rtl:-translate-x-1/2" />
      ) : null}
      <div
        className={cn(
          'bg-accent/60 text-secondary-foreground flex size-[26px] shrink-0 items-center justify-center rounded-full',
          indicatorClassName
        )}
      >
        <Icon className={cn('text-base', iconClassName)} />
      </div>
      <div
        className={cn(
          'grow ps-2.5 text-base',
          removeSpace ? undefined : 'mb-7'
        )}
      >
        {children}
      </div>
    </div>
  )
}
