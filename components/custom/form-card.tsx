'use client'

import { ComponentProps } from 'react'

import { cn } from '@/utils'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

type FormCardProps = ComponentProps<typeof Card> &
  React.PropsWithChildren & {
    actions?: React.ReactNode
    classNames?: {
      actions?: string
      content?: string
      description?: string
      header?: string
      title?: string
      wrapper?: string
    }
    description?: string
    errorMessage?: string
    isFieldInvalid?: boolean
    title?: string
  }

export function FormCard({
  actions,
  children,
  classNames,
  description,
  errorMessage,
  isFieldInvalid,
  title,
  ...props
}: FormCardProps) {
  return (
    <Card
      aria-invalid={isFieldInvalid}
      className={cn(
        classNames?.wrapper,
        isFieldInvalid && 'border-destructive border'
      )}
      variant="form"
      {...props}
    >
      <CardHeader className={cn('gap-0', classNames?.header)}>
        <CardTitle
          className={cn(
            'col-span-full flex items-center justify-between',
            classNames?.title
          )}
        >
          {title}
          {actions && (
            <div className={cn('flex items-center gap-2', classNames?.actions)}>
              {actions}
            </div>
          )}
        </CardTitle>
        {description && (
          <CardDescription
            className={cn('col-span-full mt-0', classNames?.description)}
          >
            {description}
          </CardDescription>
        )}
        {errorMessage && (
          <p className="text-destructive-foreground col-span-full mt-2 text-sm font-medium">
            {errorMessage}
          </p>
        )}
      </CardHeader>
      <CardContent className={cn(classNames?.content)}>{children}</CardContent>
    </Card>
  )
}
