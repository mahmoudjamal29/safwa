import React, { ComponentPropsWithoutRef, useRef } from 'react'

import { cn } from '@/utils'

interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string
  /**
   * ARIA live region politeness
   */
  ariaLive?: 'assertive' | 'off' | 'polite'
  /**
   * ARIA role
   */
  ariaRole?: string
  /**
   * If true, automatically repeats children enough to fill the visible area
   */
  autoFill?: boolean
  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean
}

export function Marquee({
  ariaLabel,
  ariaLive = 'off',
  ariaRole = 'marquee',
  children,
  className,
  pauseOnHover = false,
  repeat = 4,
  reverse = false,
  vertical = false,
  ...props
}: MarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null)

  return (
    <div
      {...props}
      aria-label={ariaLabel}
      aria-live={ariaLive}
      className={cn(
        'group flex [gap:var(--gap)] overflow-hidden p-2 [--duration:40s] [--gap:1rem]',
        {
          'flex-col': vertical,
          'flex-row': !vertical
        },
        className
      )}
      data-slot="marquee"
      ref={marqueeRef}
      role={ariaRole}
      tabIndex={0}
    >
      {React.useMemo(
        () => (
          <>
            {Array.from({ length: repeat }, (_, i) => (
              <div
                className={cn(
                  !vertical
                    ? 'flex-row [gap:var(--gap)]'
                    : 'flex-col [gap:var(--gap)]',
                  'flex shrink-0 justify-around',
                  !vertical && 'animate-marquee flex-row',
                  vertical && 'animate-marquee-vertical flex-col',
                  pauseOnHover && 'group-hover:[animation-play-state:paused]',
                  reverse && '[animation-direction:reverse]'
                )}
                key={i}
              >
                {children}
              </div>
            ))}
          </>
        ),
        [repeat, children, vertical, pauseOnHover, reverse]
      )}
    </div>
  )
}
