'use client'

import { startTransition, useEffect, useRef, useState } from 'react'

import {
  motion,
  MotionProps,
  useInView,
  UseInViewOptions,
  Variants
} from 'motion/react'

import { cn } from '@/utils'

interface WordRotateProps extends Omit<MotionProps, 'children'> {
  animationStyle?: 'fade' | 'flip' | 'scale' | 'slide-down' | 'slide-up'
  className?: string
  containerClassName?: string
  duration?: number // ms each word is visible
  inViewMargin?: UseInViewOptions['margin']
  loop?: boolean
  once?: boolean
  pauseDuration?: number // ms between word transitions
  startOnView?: boolean
  words: string[]
}

export function WordRotate({
  animationStyle = 'fade',
  className,
  containerClassName,
  duration = 1500,
  inViewMargin,
  loop = true,
  once = false,
  pauseDuration = 300,
  startOnView = true,
  words,
  ...props
}: WordRotateProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, {
    margin: inViewMargin as UseInViewOptions['margin'],
    once
  })
  const [hasAnimated, setHasAnimated] = useState(false)
  const [currentWord, setCurrentWord] = useState(0)
  const [show, setShow] = useState(true)

  // Animation variants
  const variants: Record<string, Variants> = {
    fade: {
      animate: {
        opacity: 1,
        transition: {
          duration: 0.4,
          ease: [0.4, 0.0, 0.2, 1] // Custom cubic-bezier for smooth fade
        }
      },
      exit: {
        opacity: 0,
        transition: {
          duration: 0.3,
          ease: [0.4, 0.0, 1, 1] // Faster exit
        }
      },
      initial: { opacity: 0 }
    },
    flip: {
      animate: {
        opacity: 1,
        rotateX: 0,
        transition: {
          damping: 20,
          mass: 1,
          stiffness: 200,
          type: 'spring'
        }
      },
      exit: {
        opacity: 0,
        rotateX: -90,
        transition: {
          duration: 0.3,
          ease: [0.4, 0.0, 1, 1]
        }
      },
      initial: { opacity: 0, rotateX: 90 }
    },
    scale: {
      animate: {
        opacity: 1,
        scale: 1,
        transition: {
          damping: 30,
          mass: 0.6,
          stiffness: 400,
          type: 'spring'
        }
      },
      exit: {
        opacity: 0,
        scale: 0.9,
        transition: {
          duration: 0.2,
          ease: [0.4, 0.0, 1, 1]
        }
      },
      initial: { opacity: 0, scale: 0.8 }
    },
    'slide-down': {
      animate: {
        opacity: 1,
        transition: {
          damping: 25,
          mass: 0.8,
          stiffness: 300,
          type: 'spring'
        },
        y: 0
      },
      exit: {
        opacity: 0,
        transition: {
          duration: 0.25,
          ease: [0.4, 0.0, 1, 1]
        },
        y: 24
      },
      initial: { opacity: 0, y: -24 }
    },
    'slide-up': {
      animate: {
        opacity: 1,
        transition: {
          damping: 25,
          mass: 0.8,
          stiffness: 300,
          type: 'spring'
        },
        y: 0
      },
      exit: {
        opacity: 0,
        transition: {
          duration: 0.25,
          ease: [0.4, 0.0, 1, 1]
        },
        y: -24
      },
      initial: { opacity: 0, y: 24 }
    }
  }

  // Determine if we should start animation
  const shouldStart = !startOnView || (isInView && (!once || !hasAnimated))

  // Set hasAnimated flag
  useEffect(() => {
    if (shouldStart && !hasAnimated) {
      startTransition(() => {
        setHasAnimated(true)
      })
    }
  }, [shouldStart, hasAnimated])

  useEffect(() => {
    if (!shouldStart) return
    const interval = setInterval(() => {
      setShow(false)
      setTimeout(() => {
        setCurrentWord((prev) => {
          if (loop) {
            return (prev + 1) % words.length
          } else {
            return prev < words.length - 1 ? prev + 1 : prev
          }
        })
        setShow(true)
      }, pauseDuration)
    }, duration + pauseDuration)
    return () => clearInterval(interval)
  }, [shouldStart, duration, pauseDuration, words.length, loop])

  return (
    <motion.span
      className={cn('inline-block overflow-hidden', containerClassName)}
      ref={ref}
      {...props}
    >
      <motion.span
        animate={show ? 'animate' : 'exit'}
        className={cn('inline-block overflow-hidden', className)}
        exit="exit"
        initial="initial"
        key={currentWord}
        style={{
          perspective: animationStyle === 'flip' ? 1000 : undefined
        }}
        transition={{ duration: 0.5 }}
        variants={variants[animationStyle]}
      >
        {words[currentWord]}
      </motion.span>
    </motion.span>
  )
}
