'use client'

import * as React from 'react'

import { cn } from '@/utils/cn'

const HoverCard = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const HoverCardTrigger = ({
  children,
  asChild: _asChild
}: {
  asChild?: boolean
  children: React.ReactNode
}) => {
  return <>{children}</>
}

const HoverCardContent = ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        'bg-popover text-popover-foreground z-50 w-64 rounded-md border p-4 shadow-md',
        className
      )}
    >
      {children}
    </div>
  )
}

export { HoverCard, HoverCardContent, HoverCardTrigger }
