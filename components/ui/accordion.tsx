'use client'

import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'
import { ChevronDown, Plus } from 'lucide-react'
import { Accordion as AccordionPrimitive } from 'radix-ui'

import { cn } from '@/utils'

// Variants
const accordionRootVariants = cva('', {
  defaultVariants: {
    variant: 'default'
  },
  variants: {
    variant: {
      default: '',
      outline: 'space-y-2',
      solid: 'space-y-2',
      styled: ''
    }
  }
})

const accordionItemVariants = cva('', {
  defaultVariants: {
    variant: 'default'
  },
  variants: {
    variant: {
      default: 'border-b border-border',
      outline: 'border border-border rounded-lg px-4',
      solid: 'rounded-lg bg-accent/70 px-4',
      styled: ''
    }
  }
})

const accordionTriggerVariants = cva(
  'group flex flex-1 items-center justify-between py-4 gap-2.5 text-foreground font-medium transition-all [&[data-state=open]>div>span>svg]:rotate-180 cursor-pointer',
  {
    defaultVariants: {
      indicator: 'arrow',
      variant: 'default'
    },
    variants: {
      indicator: {
        arrow: '',
        none: '',
        plus: '[&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0 [&[data-state=open]>svg]:rotate-180'
      },
      variant: {
        default: '',
        outline: '',
        solid: '',
        styled: [
          '[&>div>span]:inline-flex [&>div>span]:items-center [&>div>span]:justify-center group',
          '[&>div>span]:size-5 [&>div>span]:rounded [&>div>span]:border [&>div>span]:border-primary [&>div>span]:text-primary',
          '[&:hover>div>span]:bg-secondary-foreground! [&:hover>div>span]:text-white  dark:[&:hover>div>span]:bg-card',
          '[&[data-state=open]>div>span>svg]:bg-secondary-foreground! [&[data-state=open]>div>span]:text-white dark:[&[data-state=open]>div>span]:bg-card [&[data-state=open]>div>span]:border-secondary-foreground!',
          '[&>div>span]:inline-flex [&>div>span]:items-center [&>div>span]:justify-center'
        ].join(' ')
      }
    }
  }
)

const accordionContentVariants = cva(
  'overflow-hidden text-sm text-accent-foreground transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
  {
    defaultVariants: {
      variant: 'default'
    },
    variants: {
      variant: {
        default: '',
        outline: '',
        solid: '',
        styled: ''
      }
    }
  }
)

// Context
type AccordionContextType = {
  indicator?: 'arrow' | 'none' | 'plus'
  variant?: 'default' | 'outline' | 'solid' | 'styled'
}

const AccordionContext = React.createContext<AccordionContextType>({
  indicator: 'arrow',
  variant: 'default'
})

type AccordionTriggerProps = React.ComponentProps<
  typeof AccordionPrimitive.Trigger
> & {
  actionButton?: React.ReactNode
  indicatorClassName?: string
}

// Components
function Accordion(
  props: React.ComponentProps<typeof AccordionPrimitive.Root> &
    VariantProps<typeof accordionRootVariants> & {
      indicator?: 'arrow' | 'plus'
      variant?: 'default' | 'outline' | 'solid' | 'styled'
    }
) {
  const {
    children,
    className,
    indicator = 'arrow',
    variant = 'default',
    ...rest
  } = props

  return (
    <AccordionContext.Provider
      value={{ indicator, variant: variant || 'default' }}
    >
      <AccordionPrimitive.Root
        className={cn(accordionRootVariants({ variant }), className)}
        data-slot="accordion"
        {...rest}
      >
        {children}
      </AccordionPrimitive.Root>
    </AccordionContext.Provider>
  )
}

function AccordionContent(
  props: React.ComponentProps<typeof AccordionPrimitive.Content>
) {
  const { children, className, ...rest } = props
  const { variant } = React.useContext(AccordionContext)

  return (
    <AccordionPrimitive.Content
      className={cn(accordionContentVariants({ variant }), className)}
      data-slot="accordion-content"
      {...rest}
    >
      <div className={cn('pt-0 pb-5', className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

function AccordionItem(
  props: React.ComponentProps<typeof AccordionPrimitive.Item>
) {
  const { children, className, ...rest } = props
  const { variant } = React.useContext(AccordionContext)

  return (
    <AccordionPrimitive.Item
      className={cn(accordionItemVariants({ variant }), className)}
      data-slot="accordion-item"
      {...rest}
    >
      {children}
    </AccordionPrimitive.Item>
  )
}

function AccordionTrigger(props: AccordionTriggerProps) {
  const { actionButton, children, className, indicatorClassName, ...rest } =
    props
  const { indicator, variant } = React.useContext(AccordionContext)

  return (
    <AccordionPrimitive.Header className="flex items-center gap-2">
      <AccordionPrimitive.Trigger
        className={cn(
          accordionTriggerVariants({ indicator, variant }),
          'rtl:flex-row-reverse',
          className
        )}
        data-slot="accordion-trigger"
        {...rest}
      >
        {children}
        <div className="flex items-center gap-4 rtl:flex-row-reverse">
          {actionButton ? actionButton : null}
          {indicator === 'plus' && (
            <Plus
              className={cn(
                'size-4 shrink-0 transition-transform duration-200',
                indicatorClassName
              )}
              strokeWidth={1}
            />
          )}
          {indicator === 'arrow' && (
            <span
              className={cn(
                'inline-flex items-center justify-center transition-colors duration-200 group-disabled:hidden!',
                indicatorClassName
              )}
            >
              <ChevronDown
                className="size-full shrink-0 transition-transform duration-200"
                strokeWidth={1.8}
              />
            </span>
          )}
        </div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

// Exports
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
