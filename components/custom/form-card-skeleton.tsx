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
import { Skeleton } from '@/components/ui/skeleton'

type FormCardSkeletonProps = ComponentProps<typeof Card> & {
  classNames?: {
    actions?: string
    content?: string
    description?: string
    header?: string
    title?: string
    wrapper?: string
  }
  description?: boolean
  title?: boolean
}

export const FormCardSkeleton: React.FC<FormCardSkeletonProps> = ({
  classNames,
  description = false,
  title = true,
  ...props
}) => {
  return (
    <Card className={cn(classNames?.wrapper)} variant="form" {...props}>
      <CardHeader className={cn('gap-1', classNames?.header)}>
        {title && (
          <CardTitle
            className={cn(
              'col-span-full flex items-center justify-between',
              classNames?.title
            )}
          >
            <Skeleton className="h-6 w-32" />
            {classNames?.actions && (
              <div
                className={cn('flex items-center gap-2', classNames?.actions)}
              >
                <Skeleton className="h-8 w-20" />
              </div>
            )}
          </CardTitle>
        )}
        {description && (
          <CardDescription
            className={cn('col-span-full mt-0', classNames?.description)}
          >
            <Skeleton className="h-4 w-full" />
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className={cn(classNames?.content)}>
        <div className="col-span-full grid w-full grid-cols-1 gap-5 md:grid-cols-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
