import { cloneElement, isValidElement, useTransition } from 'react'

import {
  CheckIcon,
  EyeIcon,
  PencilIcon,
  RefreshCcwIcon,
  TrashIcon,
  XIcon
} from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils/utils'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

import { DataTableRowActionsProps } from '@/types/data-table'
import { RowAction } from '@/types/global'

type ActionStyleConfig = {
  buttonClassName: string
  icon: React.ComponentType<{
    className?: string
    height?: number
    width?: number
  }>
  iconClassName: string
  needsTooltip: boolean
  tooltipText: string
  variant:
    | 'default'
    | 'destructive'
    | 'ghost'
    | 'link'
    | 'outline'
    | 'secondary'
}

type GetActionStyleFn = (
  actionId: string,
  options: {
    actionClassName?: string
    isApproved?: boolean
    isLoading?: boolean
    isRejected?: boolean
    label: string
  }
) => ActionStyleConfig

export function DataTableRowActions<TData>({
  actions,
  className,
  row
}: DataTableRowActionsProps<TData>) {
  const tRowActions = useTranslations('components.dataTable.rowActions')

  const visibleActions = actions.filter(
    (action) => !action.hidden || !action.hidden(row.original)
  )

  if (visibleActions.length === 0) {
    return null
  }

  // Map action IDs to complete styling configuration
  const getActionStyle = (
    actionId: string,
    options: {
      actionClassName?: string
      isApproved?: boolean
      isLoading?: boolean
      isRejected?: boolean
      label: string
    }
  ) => {
    const { actionClassName, isApproved, isLoading, isRejected, label } =
      options

    switch (actionId) {
      case 'accept': {
        const acceptClassName = cn(
          'h-8 w-8 p-0 text-success-foreground border border-border bg-background opacity-60',
          !isApproved && !isRejected && 'opacity-100 hover:bg-success',
          !isApproved && 'opacity-80',
          isApproved && 'opacity-100 border-success-foreground',
          actionClassName
        )
        const tooltipText = isLoading
          ? tRowActions('approving')
          : isApproved
            ? tRowActions('approved')
            : tRowActions('approve')

        return {
          buttonClassName: acceptClassName,
          icon: CheckIcon,
          iconClassName: 'text-success-foreground',
          needsTooltip: true,
          tooltipText,
          variant: 'outline' as const
        }
      }

      case 'delete': {
        const deleteClassName = cn(
          'h-8 w-8 p-0 bg-destructive hover:bg-destructive-foreground/20! border-0',
          actionClassName
        )

        return {
          buttonClassName: deleteClassName,
          icon: TrashIcon,
          iconClassName: 'text-destructive-foreground',
          needsTooltip: true,
          tooltipText: tRowActions('delete'),
          variant: 'destructive' as const
        }
      }

      case 'reject': {
        const rejectClassName = cn(
          'h-8 w-8 p-0 text-destructive-foreground border border-border bg-destructive opacity-60',
          !isApproved &&
            !isRejected &&
            'opacity-100 hover:bg-destructive-foreground/20!',
          !isRejected && 'opacity-80',
          isRejected && 'opacity-100 border-destructive',
          actionClassName
        )
        const tooltipText = isLoading
          ? tRowActions('rejecting')
          : isRejected
            ? tRowActions('rejected')
            : tRowActions('reject')

        return {
          buttonClassName: rejectClassName,
          icon: XIcon,
          iconClassName: 'text-destructive-foreground',
          needsTooltip: true,
          tooltipText,
          variant: 'outline' as const
        }
      }

      case 'resend':
        return {
          buttonClassName: cn(
            'border-border h-8 w-8 rounded-md p-1 text-primary-foreground',
            actionClassName
          ),
          icon: RefreshCcwIcon,
          iconClassName: 'text-foreground',
          needsTooltip: true,
          tooltipText: tRowActions('resend'),
          variant: 'outline' as const
        }

      case 'view':
        return {
          buttonClassName: cn(
            'border-border h-8 w-8 rounded-md p-1 text-primary-foreground',
            actionClassName
          ),
          icon: EyeIcon,
          iconClassName: 'text-foreground',
          needsTooltip: true,
          tooltipText: tRowActions('view'),
          variant: 'outline' as const
        }

      default:
        return {
          buttonClassName: cn(
            'border-border h-8 w-8 rounded-md p-1 hover:bg-accent-muted/50',
            actionClassName
          ),
          icon: PencilIcon,
          iconClassName: 'text-foreground',
          needsTooltip: true,
          tooltipText: actionId === 'update' ? tRowActions('edit') : label,
          variant: 'outline' as const
        }
    }
  }

  return (
    <div className={cn('flex justify-center gap-2', className)}>
      {visibleActions.map((action) => (
        <RowActionButton
          action={action}
          getActionStyle={getActionStyle}
          key={action.id}
          row={row}
          tRowActions={tRowActions}
        />
      ))}
    </div>
  )
}

// Simple row actions with buttons (same as DataTableRowActions now)
export function SimpleRowActions<TData>({
  actions,
  className,
  row
}: DataTableRowActionsProps<TData>) {
  return (
    <DataTableRowActions actions={actions} className={className} row={row} />
  )
}

// Separate component for each action button to properly use hooks
function RowActionButton<TData>({
  action,
  getActionStyle,
  row,
  tRowActions
}: {
  action: RowAction<TData>
  getActionStyle: GetActionStyleFn
  row: { original: TData }
  tRowActions: ReturnType<
    typeof useTranslations<'components.dataTable.rowActions'>
  >
}) {
  const [isPending, startTransition] = useTransition()

  // Get loading state and status from action metadata if available
  const isLoading = action.isLoading?.(row.original)
  const isApproved = action.isApproved?.(row.original)
  const isRejected = action.isRejected?.(row.original)

  // Get complete styling configuration for this action
  const {
    buttonClassName,
    icon: Icon,
    iconClassName,
    needsTooltip,
    tooltipText,
    variant
  } = getActionStyle(action.id ?? '', {
    actionClassName: action.className,
    isApproved,
    isLoading,
    isRejected,
    label: action.label
  })

  // Translate label based on action ID
  const getTranslatedLabel = () => {
    switch (action.id) {
      case 'accept':
        return tRowActions('approve')
      case 'delete':
        return tRowActions('delete')
      case 'reject':
        return tRowActions('reject')
      case 'resend':
        return tRowActions('resend')
      case 'update':
        return tRowActions('edit')
      case 'view':
        return tRowActions('view')
      default:
        return action.label
    }
  }

  const translatedLabel = getTranslatedLabel()
  const isDisabled = action.disabled?.(row.original) || isLoading
  const disabledTooltipText = action.disabledTooltip?.(row.original)

  const button = (
    <Button
      aria-label={translatedLabel}
      className={buttonClassName}
      disabled={isDisabled}
      onClick={() => startTransition(() => action.onClick(row.original))}
      variant={variant}
    >
      {isLoading || isPending ? (
        <Spinner
          className={cn(
            action.id === 'delete' && 'text-destructive-foreground'
          )}
        />
      ) : (
        (() => {
          if (action.icon) {
            if (
              isValidElement<{ className?: string }>(
                action.icon as React.ReactElement<{ className?: string }>
              )
            ) {
              const iconElement = action.icon as React.ReactElement<{
                className?: string
              }>
              return cloneElement<{ className?: string }>(iconElement, {
                className: cn(
                  'size-4',
                  iconClassName,
                  iconElement.props.className
                )
              })
            }

            if (typeof action.icon === 'function') {
              const CustomIcon = action.icon as React.ComponentType<{ className?: string; height?: number; width?: number }>
              return (
                <CustomIcon
                  className={cn('size-4', iconClassName)}
                  height={16}
                  width={16}
                />
              )
            }

            return action.icon
          }

          return (
            <Icon
              className={cn('size-4', iconClassName)}
              height={16}
              width={16}
            />
          )
        })()
      )}
      <span className="sr-only">{translatedLabel}</span>
    </Button>
  )

  // Wrap in tooltip if needed (for status indicators) or if disabled with custom tooltip
  if (needsTooltip || (isDisabled && disabledTooltipText)) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>
          {isDisabled && disabledTooltipText
            ? disabledTooltipText
            : tooltipText}
        </TooltipContent>
      </Tooltip>
    )
  }

  return button
}

// Common row actions factory
export const createRowActions = <TData,>(actions: {
  accept?: {
    disabled?: (row: TData) => boolean
    getStatus?: (row: TData) => number | string | undefined
    hidden?: (row: TData) => boolean
    icon?: React.ReactNode
    isApproved?: (row: TData) => boolean
    isLoading?: (row: TData) => boolean
    isRejected?: (row: TData) => boolean
    onClick: (row: TData) => void
  }
  delete?: {
    disabled?: (row: TData) => boolean
    disabledTooltip?: (row: TData) => string | undefined
    getStatus?: (row: TData) => number | string | undefined
    hidden?: (row: TData) => boolean
    icon?: React.ReactNode
    isApproved?: (row: TData) => boolean
    isLoading?: (row: TData) => boolean
    isRejected?: (row: TData) => boolean
    onClick: (row: TData) => void
  }
  reject?: {
    disabled?: (row: TData) => boolean
    getStatus?: (row: TData) => number | string | undefined
    hidden?: (row: TData) => boolean
    icon?: React.ReactNode
    isApproved?: (row: TData) => boolean
    isLoading?: (row: TData) => boolean
    isRejected?: (row: TData) => boolean
    onClick: (row: TData) => void
  }
  resend?: {
    disabled?: (row: TData) => boolean
    getStatus?: (row: TData) => number | string | undefined
    hidden?: (row: TData) => boolean
    icon?: React.ReactNode
    isLoading?: (row: TData) => boolean
    onClick: (row: TData) => void
  }
  update?: {
    disabled?: (row: TData) => boolean
    getStatus?: (row: TData) => number | string | undefined
    hidden?: (row: TData) => boolean
    icon?: React.ReactNode
    isLoading?: (row: TData) => boolean
    onClick: (row: TData) => void
  }
  view?: {
    disabled?: (row: TData) => boolean
    getStatus?: (row: TData) => number | string | undefined
    hidden?: (row: TData) => boolean
    icon?: React.ReactNode
    isLoading?: (row: TData) => boolean
    onClick: (row: TData) => void
  }
}): RowAction<TData>[] => {
  const result: RowAction<TData>[] = []

  // Note: createRowActions is a factory function that runs at module level,
  // so we cannot use hooks here. Use translation keys and resolve labels in
  // the rendering component.
  if (actions.view) {
    result.push({
      disabled: actions.view.disabled,
      hidden: actions.view.hidden,
      icon: actions.view.icon,
      id: 'view',
      label: 'row_actions.view',
      onClick: actions.view.onClick
    })
  }

  if (actions.update) {
    result.push({
      disabled: actions.update?.disabled,
      hidden: actions.update.hidden,
      icon: actions.update.icon,
      id: 'update',
      label: 'row_actions.edit',
      onClick: actions.update.onClick
    })
  }

  if (actions.accept) {
    result.push({
      disabled: actions.accept?.disabled || actions.accept.disabled,
      getStatus: actions.accept.getStatus,
      hidden: actions.accept.hidden,
      icon: actions.accept.icon,
      id: 'accept',
      isApproved: actions.accept.isApproved,
      isLoading: actions.accept.isLoading,
      isRejected: actions.accept.isRejected,
      label: 'row_actions.approve',
      onClick: actions.accept.onClick
    })
  }

  if (actions.reject) {
    result.push({
      disabled: actions.reject?.disabled,
      getStatus: actions.reject.getStatus,
      hidden: actions.reject.hidden,
      icon: actions.reject.icon,
      id: 'reject',
      isApproved: actions.reject.isApproved,
      isLoading: actions.reject.isLoading,
      isRejected: actions.reject.isRejected,
      label: 'row_actions.reject',
      onClick: actions.reject.onClick
    })
  }

  if (actions.delete) {
    result.push({
      disabled: actions.delete?.disabled,
      disabledTooltip: actions.delete?.disabledTooltip,
      hidden: actions.delete.hidden,
      icon: actions.delete.icon,
      id: 'delete',
      label: 'row_actions.delete',
      onClick: actions.delete.onClick,
      variant: 'destructive'
    })
  }

  if (actions.resend) {
    result.push({
      disabled: actions.resend.disabled,
      hidden: actions.resend.hidden,
      icon: actions.resend.icon,
      id: 'resend',
      label: 'row_actions.resend',
      onClick: actions.resend.onClick
    })
  }

  return result
}
