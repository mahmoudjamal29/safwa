'use client'

import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utils'

const kbdVariants = cva(
  'inline-flex items-center justify-center font-mono rounded-md',
  {
    defaultVariants: {
      size: 'md',
      variant: 'default'
    },
    variants: {
      size: {
        md: 'h-7 min-w-7 px-1.5 text-xs [&_svg]:size-3.5',
        sm: 'h-6 min-w-6 px-1 text-[0.75rem] leading-[0.75rem] [&_svg]:size-3',
        xs: 'h-5 min-w-5 px-1 text-[0.6875rem] leading-[0.75rem] [&_svg]:size-3'
      },
      variant: {
        default: 'bg-accent border border-border text-accent-foreground',
        outline: 'text-accent-foreground border border-input'
      }
    }
  }
)

function Kbd({
  className,
  size,
  variant,
  ...props
}: React.ComponentProps<'kbd'> & VariantProps<typeof kbdVariants>) {
  return (
    <kbd
      className={cn(kbdVariants({ size, variant }), className)}
      data-slot="kbd"
      {...props}
    />
  )
}

export { Kbd, kbdVariants }
