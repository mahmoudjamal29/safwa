'use client'

import * as React from 'react'

import { cva, VariantProps } from 'class-variance-authority'
import { Check, Minus } from 'lucide-react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'

import { cn } from '@/utils/index'

// Define the variants for the Checkbox using cva.
const checkboxVariants = cva(
  `
    group peer bg-background shrink-0 rounded-sm overflow-hidden border border-input ring-offset-background focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
    aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20
    in-data-[invalid=true]:border-destructive/60 in-data-[invalid=true]:ring-destructive/10  dark:in-data-[invalid=true]:border-destructive dark:in-data-[invalid=true]:ring-destructive/20,
    `,
  {
    defaultVariants: {
      color: 'secondary',
      size: 'md'
    },
    variants: {
      color: {
        danger:
          'data-[state=checked]:bg-danger data-[state=checked]:border-danger data-[state=checked]:text-danger-foreground',
        primary:
          'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground',
        secondary:
          'data-[state=checked]:bg-secondary data-[state=checked]:border-secondary-foreground data-[state=checked]:text-secondary-foreground',
        success:
          'data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=checked]:text-success-foreground',
        warning:
          'data-[state=checked]:bg-warning data-[state=checked]:border-warning data-[state=checked]:text-warning-foreground'
      },
      size: {
        lg: 'size-5.5 [&_svg]:size-4',
        md: 'size-5 [&_svg]:size-3.5',
        sm: 'size-4.5 [&_svg]:size-3'
      }
    }
  }
)

function Checkbox({
  className,
  size,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(checkboxVariants({ size }), className)}
      data-slot="checkbox"
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn('flex items-center justify-center text-current')}
      >
        <Check className="group-data-[state=indeterminate]:hidden" />
        <Minus className="hidden group-data-[state=indeterminate]:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
