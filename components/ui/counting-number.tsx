'use client'

import { useEffect, useRef, useState } from 'react'

import {
  animate,
  motion,
  useInView,
  UseInViewOptions,
  useMotionValue
} from 'motion/react'

import { cn } from '@/utils'

interface CountingNumberProps {
  className?: string
  delay?: number // ms
  duration?: number // seconds
  format?: (value: number) => string
  from?: number
  inViewMargin?: UseInViewOptions['margin']
  once?: boolean
  onComplete?: () => void
  startOnView?: boolean
  to?: number
}

export function CountingNumber({
  className,
  delay = 0,
  duration = 2,
  format,
  from = 0,
  inViewMargin,
  once = false,
  onComplete,
  startOnView = true,
  to = 100,
  ...props
}: CountingNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { margin: inViewMargin, once })
  const [hasAnimated, setHasAnimated] = useState(false)
  const [display, setDisplay] = useState(from)
  const motionValue = useMotionValue(from)

  // Should start animation?
  const shouldStart = !startOnView || (isInView && (!once || !hasAnimated))

  useEffect(() => {
    if (!shouldStart) return
    setHasAnimated(true)
    const timeout = setTimeout(() => {
      const controls = animate(motionValue, to, {
        duration,
        onComplete,
        onUpdate: (v) => setDisplay(v)
      })
      return () => controls.stop()
    }, delay)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldStart, from, to, duration, delay])

  return (
    <motion.span className={cn('inline-block', className)} ref={ref} {...props}>
      {format ? format(display) : Math.round(display)}
    </motion.span>
  )
}
