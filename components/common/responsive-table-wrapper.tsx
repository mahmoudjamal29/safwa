import * as React from 'react'

import { cn } from '@/utils/cn'

interface ResponsiveTableWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function ResponsiveTableWrapper({
  children,
  className,
  ...props
}: ResponsiveTableWrapperProps) {
  return (
    <div className={cn('w-full overflow-auto', className)} {...props}>
      {children}
    </div>
  )
}
