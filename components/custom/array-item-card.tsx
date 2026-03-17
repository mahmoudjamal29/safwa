import { TrashIcon } from '@/lib/icons'

import { cn } from '@/utils'

import { Button } from '@/components/ui/button'

export type ArrayItemCardProps = {
  children: React.ReactNode
  classNames?: {
    content?: string
    header?: string
    root?: string
  }
  disabled?: boolean
  error?: boolean
  onRemove: () => void
  title: string
}

export const ArrayItemCard: React.FC<ArrayItemCardProps> = ({
  children,
  classNames,
  disabled = false,
  error = false,
  onRemove,
  title
}) => {
  return (
    <div
      className={cn(
        'group bg-card relative w-full max-w-full overflow-hidden rounded-lg border p-4 shadow-sm transition-all hover:shadow-md',
        error && 'border-destructive',
        classNames?.root
      )}
    >
      <div className="space-y-4">
        <div
          className={cn(
            'flex items-start justify-between gap-4',
            classNames?.header
          )}
        >
          <h4 className="text-sm font-semibold">{title}</h4>
          <Button
            className="hover:bg-destructive/80 h-7 w-7 shrink-0 transition-all"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onRemove()
            }}
            size="icon"
            type="button"
            variant="ghost"
          >
            <TrashIcon className="text-destructive-foreground h-4 w-4" />
          </Button>
        </div>

        <div className={cn('space-y-4', classNames?.content)}>{children}</div>
      </div>
    </div>
  )
}
