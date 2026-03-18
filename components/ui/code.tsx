import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'
import { Check, Copy } from 'lucide-react'
import { Slot as SlotPrimitive } from 'radix-ui'

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'

import { cn } from '@/utils'

import { Button } from '@/components/ui/button'

export interface CodeProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof codeVariants> {
  asChild?: boolean
  copyText?: string
  showCopyButton?: boolean
}

const codeVariants = cva(
  'relative rounded-md bg-muted font-mono text-sm font-medium',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default'
    },
    variants: {
      size: {
        default: 'text-sm px-2.5 py-1.5',
        lg: 'text-base px-3 py-1.5',
        sm: 'text-xs px-2 py-1.5'
      },
      variant: {
        default: 'bg-muted text-muted-foreground',
        destructive: 'bg-destructive/10 text-destructive',
        outline: 'border border-border bg-background text-foreground'
      }
    }
  }
)

function Code({
  asChild = false,
  children,
  className,
  copyText,
  showCopyButton = false,
  size,
  variant,
  ...props
}: CodeProps) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()
  const Comp = asChild ? SlotPrimitive.Slot : 'code'
  const textToCopy = copyText || (typeof children === 'string' ? children : '')

  return (
    <span
      className={cn('inline-flex items-center gap-2', className)}
      data-slot="code"
    >
      <Comp
        className={cn(codeVariants({ size, variant }))}
        data-slot="code-panel"
        {...props}
      >
        {children}
      </Comp>
      {showCopyButton && textToCopy && (
        <Button
          className="h-4 w-4 p-0 opacity-60 hover:opacity-100"
          onClick={() => copyToClipboard(textToCopy)}
          size="icon"
          variant="ghost"
        >
          {isCopied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      )}
    </span>
  )
}

export { Code, codeVariants }
