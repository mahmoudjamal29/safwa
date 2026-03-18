'use client'

import * as React from 'react'

import { Progress as ProgressPrimitive } from 'radix-ui'

import { cn } from '@/utils'

function Progress({
  className,
  indicatorClassName,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  indicatorClassName?: string
}) {
  return (
    <ProgressPrimitive.Root
      className={cn(
        'bg-secondary relative h-1.5 w-full overflow-hidden rounded-full',
        className
      )}
      data-slot="progress"
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          'bg-primary h-full w-full flex-1 transition-all',
          indicatorClassName
        )}
        data-slot="progress-indicator"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

function ProgressCircle({
  children,
  className,
  indicatorClassName,
  size = 48,
  strokeWidth = 4,
  trackClassName,
  value = 0,
  ...props
}: React.ComponentProps<'div'> & {
  /**
   * Content to display in the center of the circle
   */
  children?: React.ReactNode
  /**
   * Additional className for the progress stroke
   */
  indicatorClassName?: string
  /**
   * Size of the circle in pixels
   */
  size?: number
  /**
   * Width of the progress stroke
   */
  strokeWidth?: number
  /**
   * Additional className for the progress track
   */
  trackClassName?: string
  /**
   * Progress value from 0 to 100
   */
  value?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        className
      )}
      data-slot="progress-circle"
      style={{ height: size, width: size }}
      {...props}
    >
      <svg
        className="absolute inset-0 -rotate-90"
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        width={size}
      >
        <circle
          className={cn('text-secondary', trackClassName)}
          cx={size / 2}
          cy={size / 2}
          data-slot="progress-circle-track"
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        <circle
          className={cn(
            'text-primary transition-all duration-300 ease-in-out',
            indicatorClassName
          )}
          cx={size / 2}
          cy={size / 2}
          data-slot="progress-circle-indicator"
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </svg>
      {children && (
        <div
          className="relative z-10 flex items-center justify-center text-sm font-medium"
          data-slot="progress-circle-content"
        >
          {children}
        </div>
      )}
    </div>
  )
}

function ProgressRadial({
  children,
  className,
  endAngle = 90,
  indicatorClassName,
  showLabel = false,
  size = 120,
  startAngle = -90,
  strokeWidth = 8,
  trackClassName,
  value = 0,
  ...props
}: React.ComponentProps<'div'> & {
  /**
   * Custom content to display
   */
  children?: React.ReactNode
  /**
   * End angle in degrees
   */
  endAngle?: number
  /**
   * Additional className for the progress stroke
   */
  indicatorClassName?: string
  /**
   * Whether to show percentage label
   */
  showLabel?: boolean
  /**
   * Size of the radial in pixels
   */
  size?: number
  /**
   * Start angle in degrees
   */
  startAngle?: number
  /**
   * Width of the progress stroke
   */
  strokeWidth?: number
  /**
   * Additional className for the progress track
   */
  trackClassName?: string
  /**
   * Progress value from 0 to 100
   */
  value?: number
}) {
  const radius = (size - strokeWidth) / 2
  const angleRange = endAngle - startAngle
  const progressAngle = (value / 100) * angleRange

  const toRadians = (degrees: number) => (degrees * Math.PI) / 180

  const startX = size / 2 + radius * Math.cos(toRadians(startAngle))
  const startY = size / 2 + radius * Math.sin(toRadians(startAngle))
  const endX =
    size / 2 + radius * Math.cos(toRadians(startAngle + progressAngle))
  const endY =
    size / 2 + radius * Math.sin(toRadians(startAngle + progressAngle))

  const largeArc = progressAngle > 180 ? 1 : 0

  const pathData = [
    'M',
    startX,
    startY,
    'A',
    radius,
    radius,
    0,
    largeArc,
    1,
    endX,
    endY
  ].join(' ')

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        className
      )}
      data-slot="progress-radial"
      style={{ height: size, width: size }}
      {...props}
    >
      <svg height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
        <path
          className={cn('text-secondary', trackClassName)}
          d={[
            'M',
            size / 2 + radius * Math.cos(toRadians(startAngle)),
            size / 2 + radius * Math.sin(toRadians(startAngle)),
            'A',
            radius,
            radius,
            0,
            angleRange > 180 ? 1 : 0,
            1,
            size / 2 + radius * Math.cos(toRadians(endAngle)),
            size / 2 + radius * Math.sin(toRadians(endAngle))
          ].join(' ')}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
        <path
          className={cn(
            'text-primary transition-all duration-300 ease-in-out',
            indicatorClassName
          )}
          d={pathData}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </svg>
      {(showLabel || children) && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children || <span className="text-lg font-bold">{value}%</span>}
        </div>
      )}
    </div>
  )
}

export { Progress, ProgressCircle, ProgressRadial }
