import { cn } from '@/utils/utils'

export function CustomSubtitle({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        'text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl',
        className
      )}
    >
      {children}
    </p>
  )
}
