'use client'

import * as React from 'react'

import { cva, VariantProps } from 'class-variance-authority'
import { Avatar as AvatarPrimitive } from 'radix-ui'

import { cn } from '@/utils'

const avatarVariants = cva('', {
  defaultVariants: {
    shape: 'rounded'
  },
  variants: {
    shape: {
      rounded: 'rounded-full',
      square: 'rounded-md'
    }
  }
})

export type AvatarShape = VariantProps<typeof avatarVariants>['shape']

// Context for passing shape from Avatar to children
const AvatarContext = React.createContext<{
  shape?: AvatarShape
}>({
  shape: 'rounded'
})

const useAvatarContext = () => {
  return React.useContext(AvatarContext)
}

const avatarStatusVariants = cva(
  'flex items-center rounded-full size-2 border-2 border-background',
  {
    defaultVariants: {
      variant: 'online'
    },
    variants: {
      variant: {
        away: 'bg-blue-600',
        busy: 'bg-yellow-600',
        offline: 'bg-zinc-600 dark:bg-zinc-300',
        online: 'bg-green-600'
      }
    }
  }
)

function Avatar({
  children,
  className,
  shape = 'rounded',
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants>) {
  return (
    <AvatarContext.Provider value={{ shape }}>
      <AvatarPrimitive.Root
        className={cn('relative flex size-10 shrink-0', className)}
        data-slot="avatar"
        {...props}
      >
        {children}
      </AvatarPrimitive.Root>
    </AvatarContext.Provider>
  )
}

function AvatarFallback({
  className,
  shape: shapeProp,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> &
  VariantProps<typeof avatarVariants>) {
  const { shape: shapeFromContext } = useAvatarContext()
  const shape = shapeProp ?? shapeFromContext ?? 'rounded'

  return (
    <AvatarPrimitive.Fallback
      className={cn(
        'border-border bg-accent text-accent-foreground flex h-full w-full items-center justify-center border text-xs',
        avatarVariants({ shape }),
        className
      )}
      data-slot="avatar-fallback"
      {...props}
    />
  )
}

function AvatarImage({
  className,
  shape: shapeProp,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image> &
  VariantProps<typeof avatarVariants>) {
  const { shape: shapeFromContext } = useAvatarContext()
  const shape = shapeProp ?? shapeFromContext ?? 'rounded'

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        avatarVariants({ shape }),
        className
      )}
    >
      <AvatarPrimitive.Image
        className={cn('aspect-square h-full w-full')}
        data-slot="avatar-image"
        {...props}
      />
    </div>
  )
}

function AvatarIndicator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'absolute flex size-6 items-center justify-center',
        className
      )}
      data-slot="avatar-indicator"
      {...props}
    />
  )
}

function AvatarStatus({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof avatarStatusVariants>) {
  return (
    <div
      className={cn(avatarStatusVariants({ variant }), className)}
      data-slot="avatar-status"
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIndicator,
  AvatarStatus,
  avatarStatusVariants,
  avatarVariants
}
