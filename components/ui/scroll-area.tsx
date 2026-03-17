import * as React from 'react'

import { cn } from '@/utils/cn'

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <div
    className={cn('relative overflow-hidden', className)}
    ref={ref}
    {...props}
  >
    <div className="h-full w-full overflow-auto">{children}</div>
  </div>
))
ScrollArea.displayName = 'ScrollArea'

const ScrollBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: 'horizontal' | 'vertical' }
>(({ className, orientation: _orientation = 'vertical', ...props }, ref) => (
  <div
    className={cn('flex touch-none select-none transition-colors', className)}
    ref={ref}
    {...props}
  />
))
ScrollBar.displayName = 'ScrollBar'

export { ScrollArea, ScrollBar }
