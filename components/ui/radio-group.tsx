'use client'

import * as React from 'react'

import { cva, VariantProps } from 'class-variance-authority'
import { Circle } from 'lucide-react'
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'

import { cn } from '@/utils'

type RadioSize = 'lg' | 'md' | 'sm'
type RadioVariant = 'mono' | 'primary'

// Define a cva function for the RadioGroup root.
const radioGroupVariants = cva('grid gap-2.5', {
  defaultVariants: {
    size: 'md',
    variant: 'primary'
  },
  variants: {
    size: {
      lg: '',
      md: '',
      sm: ''
    },
    variant: {
      mono: '',
      primary: ''
    }
  }
})

// Create a context to pass the variant and size down to items.
const RadioGroupContext = React.createContext<{
  size: RadioSize
  variant: RadioVariant
}>({ size: 'md', variant: 'primary' })

function RadioGroup({
  className,
  size,
  variant,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root> &
  VariantProps<typeof radioGroupVariants>) {
  return (
    <RadioGroupContext.Provider
      value={{ size: size ?? 'md', variant: variant ?? 'primary' }}
    >
      <RadioGroupPrimitive.Root
        className={cn(radioGroupVariants({ size, variant }), className)}
        data-slot="radio-group"
        {...props}
      />
    </RadioGroupContext.Provider>
  )
}

// Define variants for the RadioGroupItem using cva.
const radioItemVariants = cva(
  `
    peer aspect-square rounded-full border outline-hidden ring-offset-background focus:outline-none focus-visible:ring-2
    focus-visible:ring-destructive focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
    aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20
    in-data-[invalid=true]:border-destructive/60 in-data-[invalid=true]:ring-destructive/10  dark:in-data-[invalid=true]:border-destructive dark:in-data-[invalid=true]:ring-destructive/20
    border-input text-primary data-[state=checked]:bg-secondary-foreground data-[state=checked]:border-secondary data-[state=checked]:text-primary-foreground
  `,
  {
    defaultVariants: {
      size: 'md'
    },
    variants: {
      size: {
        lg: 'size-5.5 [&_svg]:size-3',
        md: 'size-5 [&_svg]:size-2.5',
        sm: 'size-4.5 [&_svg]:size-2'
      }
    }
  }
)

function RadioGroupItem({
  className,
  size,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> &
  VariantProps<typeof radioItemVariants>) {
  // Use the variant and size from context if not provided at the item level.
  const { size: contextSize } = React.useContext(RadioGroupContext)
  const effectiveSize = size ?? contextSize

  return (
    <RadioGroupPrimitive.Item
      className={cn(radioItemVariants({ size: effectiveSize }), className)}
      data-slot="radio-group-item"
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        className="flex items-center justify-center"
        data-slot="radio-group-indicator"
      >
        <Circle className="fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
