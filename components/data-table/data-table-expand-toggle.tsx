'use client'

import { Row } from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/utils'

import { Button } from '@/components/ui/button'

type DataTableExpandToggleProps<TData> = {
  className?: string
  row: Row<TData>
}

export const DataTableExpandToggle = <TData,>({
  className,
  row
}: DataTableExpandToggleProps<TData>) => {
  const canExpand = row.getCanExpand()
  const isExpanded = row.getIsExpanded()
  if (!canExpand) return

  return (
    <div className="flex items-center justify-center">
      <Button
        className={cn(
          'text-primary hover:bg-primary hover:text-primary-foreground hover-border-none border-primary size-6 border bg-transparent',
          isExpanded &&
            'bg-secondary-foreground text-primary-foreground border-none',
          className
        )}
        data-row-selection-ignore
        onClick={row.getToggleExpandedHandler()}
      >
        <ChevronDown
          className={cn(
            'size-4 transition-transform duration-200',
            isExpanded && 'rotate-180'
          )}
        />
      </Button>
    </div>
  )
}
