import { cn } from '@/utils/utils'

export function CustomBadge({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'mb-1.5 border-b-2 border-indigo-600 py-1 font-semibold text-indigo-600',
        className
      )}
    >
      {children}
    </div>
  )
}
