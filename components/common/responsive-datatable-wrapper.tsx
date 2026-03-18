import { cn } from '@/utils/utils'

interface ResponsiveDataTableWrapperProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveDataTableWrapper({
  children,
  className
}: ResponsiveDataTableWrapperProps) {
  return (
    <div
      className={cn(
        'mx-auto rounded-2xl border border-gray-200 bg-white',
        className
      )}
    >
      {children}
    </div>
  )
}
