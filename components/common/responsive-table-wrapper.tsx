import { cn } from '@/utils/utils'

interface ResponsiveTableWrapperProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveTableWrapper({
  children,
  className
}: ResponsiveTableWrapperProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full md:max-w-[calc(100vw-2rem-var(--sidebar-width))]',
        className
      )}
    >
      {children}
    </div>
  )
}
