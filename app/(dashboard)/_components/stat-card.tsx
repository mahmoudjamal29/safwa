import { cn } from '@/utils/cn'

type StatCardVariant = 'gold' | 'green' | 'blue' | 'red'

interface StatCardProps {
  label: string
  value: string | number
  icon: string
  variant?: StatCardVariant
  onClick?: () => void
}

const variantClasses: Record<StatCardVariant, string> = {
  gold: 'border-yellow-400/30 bg-yellow-50 dark:bg-yellow-950/20',
  green: 'border-green-400/30 bg-green-50 dark:bg-green-950/20',
  blue: 'border-blue-400/30 bg-blue-50 dark:bg-blue-950/20',
  red: 'border-red-400/30 bg-red-50 dark:bg-red-950/20',
}

const valueClasses: Record<StatCardVariant, string> = {
  gold: 'text-yellow-700 dark:text-yellow-400',
  green: 'text-green-700 dark:text-green-400',
  blue: 'text-blue-700 dark:text-blue-400',
  red: 'text-red-700 dark:text-red-400',
}

export function StatCard({ label, value, icon, variant = 'blue', onClick }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border p-5 flex items-center gap-4 transition-shadow',
        variantClasses[variant],
        onClick && 'cursor-pointer hover:shadow-md'
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      <span className="text-3xl">{icon}</span>
      <div className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={cn('text-2xl font-bold', valueClasses[variant])}>{value}</span>
      </div>
    </div>
  )
}
