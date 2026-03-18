'use client'

import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utils'

// Define input size variants
const textareaVariants = cva(
  `
    w-full border border-input bg-background text-foreground shadow-xs shadow-black/5 transition-[color,box-shadow]
     placeholder:text-muted-foreground/80 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px]
    focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 [[readonly]]:opacity-70 aria-invalid:border-destructive-foreground
     aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive-foreground dark:aria-invalid:ring-destructive/20
  `,
  {
    defaultVariants: {
      variant: 'md'
    },
    variants: {
      variant: {
        lg: 'px-4 py-4 text-sm rounded-md',
        md: 'px-3 py-3 text-sm leading-(--text-sm--line-height) rounded-md',
        sm: 'px-2.5 py-2.5 text-xs rounded-md'
      }
    }
  }
)

function Textarea({
  className,
  variant,
  ...props
}: React.ComponentProps<'textarea'> & VariantProps<typeof textareaVariants>) {
  return (
    <div className="relative border-none!">
      <textarea
        className={cn(textareaVariants({ variant }), className)}
        data-slot="textarea"
        maxLength={props.maxLength ?? 255}
        {...props}
      />
      <span className="bg-card text-muted-foreground absolute right-4 bottom-4 rounded-md px-2 py-1 text-xs shadow-xs select-none">
        {typeof props.value === 'string' ? props.value.length : 0}/
        {props.maxLength ?? 255}
      </span>
    </div>
  )
}

export { Textarea, textareaVariants }
