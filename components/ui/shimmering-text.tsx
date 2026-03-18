'use client'

import React, { useMemo, useRef } from 'react'

import { motion, useInView, UseInViewOptions } from 'motion/react'

import { cn } from '@/utils'

interface ShimmeringTextProps {
  /** Custom className */
  className?: string
  /** Base text color */
  color?: string
  /** Delay before starting animation */
  delay?: number
  /** Animation duration in seconds */
  duration?: number
  /** Margin for in-view detection (rootMargin) */
  inViewMargin?: UseInViewOptions['margin']
  /** Whether to animate only once */
  once?: boolean
  /** Whether to repeat the animation */
  repeat?: boolean
  /** Pause duration between repeats in seconds */
  repeatDelay?: number
  /** Shimmer gradient color */
  shimmerColor?: string
  /** Shimmer spread multiplier */
  spread?: number
  /** Whether to start animation when component enters viewport */
  startOnView?: boolean
  /** Text to display with shimmer effect */
  text: string
}

export function ShimmeringText({
  className,
  color,
  delay = 0,
  duration = 2,
  inViewMargin,
  once = false,
  repeat = true,
  repeatDelay = 0.5,
  shimmerColor,
  spread = 2,
  startOnView = true,
  text
}: ShimmeringTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { margin: inViewMargin, once })

  // Calculate dynamic spread based on text length
  const dynamicSpread = useMemo(() => {
    return text.length * spread
  }, [text, spread])

  // Determine if we should start animation
  const shouldAnimate = !startOnView || isInView

  return (
    <motion.span
      animate={
        shouldAnimate
          ? {
              backgroundPosition: '0% center',
              opacity: 1
            }
          : {}
      }
      className={cn(
        'relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent',
        '[--base-color:var(--color-zinc-400)] [--shimmer-color:var(--color-zinc-950)]',
        '[background-repeat:no-repeat,padding-box]',
        '[--shimmer-bg:linear-gradient(90deg,transparent_calc(50%-var(--spread)),var(--shimmer-color),transparent_calc(50%+var(--spread)))]',
        'dark:[--base-color:var(--color-zinc-600)] dark:[--shimmer-color:var(--color-white)]',
        className
      )}
      initial={{
        backgroundPosition: '100% center',
        opacity: 0
      }}
      ref={ref}
      style={
        {
          '--spread': `${dynamicSpread}px`,
          ...(color && { '--base-color': color }),
          ...(shimmerColor && { '--shimmer-color': shimmerColor }),
          backgroundImage: `var(--shimmer-bg), linear-gradient(var(--base-color), var(--base-color))`
        } as React.CSSProperties
      }
      transition={{
        backgroundPosition: {
          delay,
          duration,
          ease: 'linear',
          repeat: repeat ? Infinity : 0,
          repeatDelay
        },
        opacity: {
          delay,
          duration: 0.3
        }
      }}
    >
      {text}
    </motion.span>
  )
}
