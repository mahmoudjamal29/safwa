'use client'

import * as React from 'react'

import { cn } from '@/utils/utils'

interface LoaderProps {
  className?: string
  size?: 'lg' | 'md' | 'sm' | 'xl'
  variant?: 'center' | 'default' | 'overlay' | 'page'
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, size = 'md', variant = 'default', ...props }, ref) => {
    const sizeClasses = {
      lg: 'h-8 w-8',
      md: 'h-6 w-6',
      sm: 'h-4 w-4',
      xl: 'h-12 w-12'
    }

    const variantClasses = {
      center: 'flex w-full items-center justify-center',
      default: 'flex items-center justify-center',
      overlay:
        'bg-background/50 pointer-events-none absolute inset-0 z-50 flex items-center justify-center',
      page: 'm-auto h-screen flex items-center justify-center'
    }

    return (
      <div
        className={cn(variantClasses[variant], className)}
        ref={ref}
        {...props}
      >
        <div
          className={cn(
            'animate-spin rounded-full border-2 border-current border-t-transparent',
            sizeClasses[size]
          )}
        />
      </div>
    )
  }
)

Loader.displayName = 'Loader'

export { Loader }
