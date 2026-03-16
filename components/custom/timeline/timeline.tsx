'use client'

import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode
} from 'react'

import { cn } from '@/utils/utils'

import { TimelineItemProps } from './timeline-item'

interface TimelineProps {
  children: ReactNode
  className?: string
}

export function Timeline({ children, className }: TimelineProps) {
  const items = Children.toArray(children).filter(
    isValidElement
  ) as ReactElement<TimelineItemProps>[]

  return (
    <div className={cn('space-y-0', className)}>
      {items.map((child, index) =>
        cloneElement(child, {
          line: index !== items.length - 1,
          removeSpace: index === items.length - 1 || child.props.removeSpace
        })
      )}
    </div>
  )
}
