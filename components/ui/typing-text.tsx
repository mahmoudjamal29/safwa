'use client'

import { useEffect, useRef, useState } from 'react'

import {
  motion,
  MotionProps,
  useInView,
  UseInViewOptions,
  Variants
} from 'motion/react'

import { cn } from '@/utils'

type AnimationVariant =
  | 'blurIn'
  | 'blurInDown'
  | 'blurInUp'
  | 'fadeIn'
  | 'scaleDown'
  | 'scaleUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'slideUp'

interface TypingTextProps extends Omit<MotionProps, 'children'> {
  /** The animation preset to use */
  animation?: AnimationVariant
  /** Custom className */
  className?: string
  /** Cursor character */
  cursor?: string
  /** Cursor className */
  cursorClassName?: string
  /** Delay before starting animation */
  delay?: number
  /** Margin for in-view detection (rootMargin) */
  inViewMargin?: UseInViewOptions['margin']
  /** Whether to loop through texts */
  loop?: boolean
  /** Whether to animate only once */
  once?: boolean
  /** Callback when typing completes */
  onComplete?: () => void
  /** Pause duration between loops */
  pauseDuration?: number
  /** Whether to show cursor */
  showCursor?: boolean
  /** Typing speed in milliseconds */
  speed?: number
  /** Whether to start animation when component enters viewport */
  startOnView?: boolean
  /** Text to animate */
  text?: string
  /** Array of texts to cycle through */
  texts?: string[]
}

const cursorVariants: Variants = {
  blinking: {
    opacity: [0, 0, 1, 1],
    transition: {
      duration: 1,
      ease: 'linear',
      repeat: Infinity,
      repeatDelay: 0,
      times: [0, 0.5, 0.5, 1]
    }
  }
}

export function TypingText({
  className,
  cursor = '|',
  cursorClassName = '',
  delay = 0,
  inViewMargin,
  loop = false,
  once = false,
  onComplete,
  pauseDuration = 2000,
  showCursor = true,
  speed = 100,
  startOnView = true,
  text,
  texts,
  ...props
}: TypingTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, {
    margin: inViewMargin as UseInViewOptions['margin'],
    once
  })
  const [hasAnimated, setHasAnimated] = useState(false)
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  // Determine if we should start animation
  const shouldStart = !startOnView || (isInView && (!once || !hasAnimated))

  const textArray = texts && texts.length > 0 ? texts : [text]
  const currentText = textArray[currentTextIndex] ?? ''

  useEffect(() => {
    if (!shouldStart) return
    const timeout = setTimeout(() => {
      setIsTyping(true)
      setHasAnimated(true)
    }, delay)

    return () => clearTimeout(timeout)
  }, [delay, shouldStart])

  useEffect(() => {
    if (!isTyping) return

    if (currentIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else {
      // Typing complete
      onComplete?.()

      if (loop && texts && texts.length > 1) {
        const timeout = setTimeout(() => {
          setDisplayText('')
          setCurrentIndex(0)
          setCurrentTextIndex((prev) => (prev + 1) % texts.length)
        }, pauseDuration)

        return () => clearTimeout(timeout)
      }
    }
  }, [
    currentIndex,
    currentText,
    isTyping,
    speed,
    loop,
    texts,
    pauseDuration,
    onComplete
  ])

  // Animation variants for container (fadeIn by default, extendable)
  const finalVariants = {
    container: {
      exit: { opacity: 0 },
      hidden: { opacity: 0, y: 10 },
      show: { opacity: 1, transition: { staggerChildren: 0.02 }, y: 0 }
    }
  }
  const MotionComponent = motion.span

  return (
    <MotionComponent
      animate={startOnView ? undefined : 'show'}
      className={cn('whitespace-pre-wrap', className)}
      exit="exit"
      initial="hidden"
      ref={ref}
      variants={finalVariants.container as Variants}
      viewport={{ once }}
      whileInView={startOnView ? 'show' : undefined}
      {...props}
    >
      <span style={{ alignItems: 'center', display: 'inline-flex' }}>
        {displayText}
        {showCursor && (
          <motion.span
            animate="blinking"
            className={cn(
              'text-foreground ms-1 inline-block w-px font-normal select-none',
              cursorClassName
            )}
            variants={cursorVariants}
          >
            {cursor}
          </motion.span>
        )}
      </span>
    </MotionComponent>
  )
}
