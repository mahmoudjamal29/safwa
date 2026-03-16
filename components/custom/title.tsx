import { cn } from '@/utils/utils'

export function CustomTitle({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2
      className={cn(
        'text-foreground text-3xl leading-6 font-bold md:text-5xl',
        className
      )}
    >
      {children}
    </h2>
  )
}
