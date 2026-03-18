import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'
import { Slot as SlotPrimitive } from 'radix-ui'

import { cn } from '@/utils'

export interface BadgeButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeButtonVariants> {
  asChild?: boolean
}

export type BadgeDotProps = React.HTMLAttributes<HTMLSpanElement>

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
  disabled?: boolean
  dotClassName?: string
}

const badgeVariants = cva(
  'inline-flex items-center justify-center border border-transparent font-medium focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 [&_svg]:-ms-px [&_svg]:shrink-0',
  {
    compoundVariants: [
      /* Light */
      {
        appearance: 'light',
        className:
          'text-[var(--color-primary-accent,var(--color-blue-700))] bg-[var(--color-primary-soft,var(--color-blue-50))] dark:bg-[var(--color-primary-soft,var(--color-blue-950))] dark:text-[var(--color-primary-soft,var(--color-blue-600))]',
        variant: 'primary'
      },
      {
        appearance: 'light',
        className:
          'bg-secondary dark:bg-secondary/50 text-secondary-foreground',
        variant: 'secondary'
      },
      {
        appearance: 'light',
        className:
          'text-[var(--color-success-accent,var(--color-green-800))] bg-[var(--color-success-soft,var(--color-green-100))] dark:bg-[var(--color-success-soft,var(--color-green-950))] dark:text-[var(--color-success-soft,var(--color-green-600))]',
        variant: 'success'
      },
      {
        appearance: 'light',
        className:
          'text-[var(--color-warning-accent,var(--color-yellow-700))] bg-[var(--color-warning-soft,var(--color-yellow-100))] dark:bg-[var(--color-warning-soft,var(--color-yellow-950))] dark:text-[var(--color-warning-soft,var(--color-yellow-600))]',
        variant: 'warning'
      },
      {
        appearance: 'light',
        className:
          'text-[var(--color-info-accent,var(--color-violet-700))] bg-[var(--color-info-soft,var(--color-violet-100))] dark:bg-[var(--color-info-soft,var(--color-violet-950))] dark:text-[var(--color-info-soft,var(--color-violet-400))]',
        variant: 'info'
      },
      {
        appearance: 'light',
        className:
          'text-[var(--color-destructive-accent,var(--color-red-700))] bg-[var(--color-destructive-soft,var(--color-red-50))] dark:bg-[var(--color-destructive-soft,var(--color-red-950))] dark:text-[var(--color-destructive-soft,var(--color-red-600))]',
        variant: 'destructive'
      },
      /* Outline */
      {
        appearance: 'outline',
        className:
          'text-[var(--color-primary-accent,var(--color-blue-700))] border-[var(--color-primary-soft,var(--color-blue-100))] bg-[var(--color-primary-soft,var(--color-blue-50))] dark:bg-[var(--color-primary-soft,var(--color-blue-950))] dark:border-[var(--color-primary-soft,var(--color-blue-900))] dark:text-[var(--color-primary-soft,var(--color-blue-600))]',
        variant: 'primary'
      },
      {
        appearance: 'outline',
        className:
          'text-[var(--color-success-accent,var(--color-green-700))] border-[var(--color-success-soft,var(--color-green-200))] bg-[var(--color-success-soft,var(--color-green-50))] dark:bg-[var(--color-success-soft,var(--color-green-950))] dark:border-[var(--color-success-soft,var(--color-green-900))] dark:text-[var(--color-success-soft,var(--color-green-600))]',
        variant: 'success'
      },
      {
        appearance: 'outline',
        className:
          'text-[var(--color-warning-accent,var(--color-yellow-700))] border-[var(--color-warning-soft,var(--color-yellow-200))] bg-[var(--color-warning-soft,var(--color-yellow-50))] dark:bg-[var(--color-warning-soft,var(--color-yellow-950))] dark:border-[var(--color-warning-soft,var(--color-yellow-900))] dark:text-[var(--color-warning-soft,var(--color-yellow-600))]',
        variant: 'warning'
      },
      {
        appearance: 'outline',
        className:
          'text-[var(--color-info-accent,var(--color-yellow-700))] border-[var(--color-info-soft,var(--color-yellow-100))] bg-[var(--color-info-soft,var(--color-yellow-50))] dark:bg-[var(--color-info-soft,var(--color-yellow-950))] dark:border-[var(--color-info-soft,var(--color-yellow-900))] dark:text-[var(--color-info-soft,var(--color-yellow-400))]',
        variant: 'info'
      },
      {
        appearance: 'outline',
        className:
          'text-[var(--color-destructive-accent,var(--color-red-700))] border-[var(--color-destructive-soft,var(--color-red-100))] bg-[var(--color-destructive-soft,var(--color-red-50))] dark:bg-[var(--color-destructive-soft,var(--color-red-950))] dark:border-[var(--color-destructive-soft,var(--color-red-900))] dark:text-[var(--color-destructive-soft,var(--color-red-600))]',
        variant: 'destructive'
      },
      /* Ghost */
      {
        appearance: 'ghost',
        className: 'text-primary',
        variant: 'primary'
      },
      {
        appearance: 'ghost',
        className: 'text-secondary-foreground',
        variant: 'secondary'
      },
      {
        appearance: 'ghost',
        className: 'text-[var(--color-success-accent,var(--color-green-500))]',
        variant: 'success'
      },
      {
        appearance: 'ghost',
        className: 'text-[var(--color-warning-accent,var(--color-yellow-500))]',
        variant: 'warning'
      },
      {
        appearance: 'ghost',
        className: 'text-[var(--color-info-accent,var(--color-violet-500))]',
        variant: 'info'
      },
      {
        appearance: 'ghost',
        className: 'text-destructive',
        variant: 'destructive'
      },

      { appearance: 'ghost', className: 'px-0', size: 'lg' },
      { appearance: 'ghost', className: 'px-0', size: 'md' },
      { appearance: 'ghost', className: 'px-0', size: 'sm' },
      { appearance: 'ghost', className: 'px-0', size: 'xs' },

      /* Circle shape overrides */
      { className: 'rounded-full', shape: 'circle', size: 'lg' },
      { className: 'rounded-full', shape: 'circle', size: 'md' },
      { className: 'rounded-full', shape: 'circle', size: 'sm' },
      { className: 'rounded-full', shape: 'circle', size: 'xs' }
    ],
    defaultVariants: {
      appearance: 'default',
      size: 'md',
      variant: 'primary'
    },
    variants: {
      appearance: {
        default: '',
        ghost: 'border-transparent bg-transparent',
        light: '',
        outline: ''
      },
      disabled: {
        true: 'opacity-50 pointer-events-none'
      },
      shape: {
        circle: 'rounded-full',
        default: ''
      },
      size: {
        lg: 'rounded-md px-[0.5rem] h-7 min-w-7 gap-1.5 text-xs [&_svg]:size-3.5',
        md: 'rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs [&_svg]:size-3.5 ',
        sm: 'rounded-sm px-[0.325rem] h-5 min-w-5 gap-1 text-[0.6875rem] leading-[0.75rem] [&_svg]:size-3',
        xs: 'rounded-sm px-[0.25rem] h-4 min-w-4 gap-1 text-[0.625rem] leading-[0.5rem] [&_svg]:size-3'
      },
      variant: {
        destructive: 'bg-destructive text-destructive-foreground',
        info: 'bg-[var(--color-info-accent,var(--color-violet-500))] text-[var(--color-info-foreground,var(--color-white))]',
        outline:
          'bg-transparent border border-border text-secondary-foreground',
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-[#AF7656]/10! text-[#AF7656]',
        success:
          'bg-[var(--color-success-accent,var(--color-green-500))] text-[var(--color-success-foreground,var(--color-white))]',
        warning:
          'bg-[var(--color-warning-accent,var(--color-yellow-500))] text-[var(--color-warning-foreground,var(--color-white))]'
      }
    }
  }
)

const badgeButtonVariants = cva(
  'cursor-pointer transition-all inline-flex items-center justify-center leading-none size-3.5 [&>svg]:opacity-100! [&>svg]:size-3.5! p-0 rounded-md -me-0.5 opacity-60 hover:opacity-100',
  {
    defaultVariants: {
      variant: 'default'
    },
    variants: {
      variant: {
        default: ''
      }
    }
  }
)

function Badge({
  appearance,
  asChild = false,
  className,
  disabled,
  shape,
  size,
  variant,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? SlotPrimitive.Slot : 'span'

  return (
    <Comp
      className={cn(
        badgeVariants({ appearance, disabled, shape, size, variant }),
        className
      )}
      data-slot="badge"
      {...props}
    />
  )
}

function BadgeButton({
  asChild = false,
  className,
  variant,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof badgeButtonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? SlotPrimitive.Slot : 'span'
  return (
    <Comp
      className={cn(badgeButtonVariants({ className, variant }))}
      data-slot="badge-button"
      role="button"
      {...props}
    />
  )
}

function BadgeDot({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'size-1.5 rounded-full bg-[currentColor] opacity-75',
        className
      )}
      data-slot="badge-dot"
      {...props}
    />
  )
}

export { Badge, BadgeButton, BadgeDot, badgeVariants }
