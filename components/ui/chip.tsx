'use client'

import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'
import { LucideIcon } from 'lucide-react'

import { cn } from '@/utils/utils'

const chipVariants = cva(
  'inline-flex items-center rounded-full border text-sm capitalize px-2.5 font-medium  py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    defaultVariants: {
      capitalize: true,
      color: 'default',
      rounded: 'full',
      size: 'xs',
      variant: 'default'
    },
    variants: {
      capitalize: {
        false: '',
        true: 'capitalize'
      },
      color: {
        danger: 'bg-destructive text-destructive-foreground',
        default: 'bg-muted text-muted-foreground',
        info: 'bg-info-accent text-info-foreground',
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        success: 'bg-success text-success-foreground',
        warning: 'bg-warning text-warning-foreground'
      },
      rounded: {
        full: 'rounded-full',
        lg: 'rounded-lg',
        md: 'rounded-md',
        sm: 'rounded-sm'
      },
      size: {
        lg: 'text-lg',
        md: 'text-md',
        sm: 'text-sm',
        xs: 'text-xs'
      },
      variant: {
        default:
          'border-transparent hover:opacity-90 flex max-w-fit items-center gap-2',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground flex max-w-fit items-center gap-2',
        flat: 'border-transparent bg-transparent flex max-w-fit items-center gap-2',
        info: 'border-transparent bg-info-accent text-info-foreground hover:bg-info-accent/80 flex max-w-fit items-center gap-2',
        outline:
          'text-foreground flex max-w-fit items-center gap-2 bg-transparent',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 flex max-w-fit items-center gap-2',
        success:
          'border-transparent bg-success text-success-foreground hover:bg-success/80 flex max-w-fit items-center gap-2',
        warning:
          'border-transparent bg-warning dark:bg-warning/20 text-warning-foreground hover:bg-warning/80 flex max-w-fit items-center gap-2'
      }
    }
  }
)

export interface ChipProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof chipVariants> {
  children?: React.ReactNode
  Icon?: LucideIcon
  label?: string
}

function Chip({
  className,
  color,
  Icon,
  label,
  rounded,
  size,
  variant,
  ...props
}: ChipProps) {
  return (
    <div
      className={cn(chipVariants({ color, rounded, size, variant }), className)}
      {...props}
    >
      {Icon && <Icon className="size-3.5" />}
      {label && label}
      {props.children}
    </div>
  )
}

export { Chip, chipVariants }
