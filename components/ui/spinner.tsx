import { Loader2Icon } from 'lucide-react'

import { cn } from '@/utils'

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  const ariaLabel = props['aria-label'] ?? 'Loading'

  return (
    <Loader2Icon
      aria-label={ariaLabel}
      className={cn('text-muted-foreground size-4 animate-spin', className)}
      role="status"
      {...props}
    />
  )
}

export { Spinner }
