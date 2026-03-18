'use client'

import React, { startTransition, useEffect, useRef, useState } from 'react'

import { motion, useInView, Variants } from 'motion/react'

import { cn } from '@/utils'

type RevealVariant =
  | 'blur'
  | 'elastic'
  | 'fade'
  | 'rotate'
  | 'scale'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'slideUp'
  | 'stagger'
  | 'typewriter'
  | 'wave'

interface TextRevealProps {
  children: string
  className?: string
  delay?: number
  duration?: number
  once?: boolean
  onComplete?: () => void
  staggerDelay?: number
  startOnView?: boolean
  style?: React.CSSProperties
  variant?: RevealVariant
  wordLevel?: boolean
}

const containerVariants: Record<RevealVariant, Variants> = {
  blur: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.03 }
    }
  },
  elastic: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.07 }
    }
  },
  fade: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.02 }
    }
  },
  rotate: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05 }
    }
  },
  scale: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.06 }
    }
  },
  slideDown: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.04 }
    }
  },
  slideLeft: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.04 }
    }
  },
  slideRight: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.04 }
    }
  },
  slideUp: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.04 }
    }
  },
  stagger: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 }
    }
  },
  typewriter: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 }
    }
  },
  wave: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12 }
    }
  }
}

const itemVariants: Record<RevealVariant, Variants> = {
  blur: {
    hidden: { filter: 'blur(4px)', opacity: 0 },
    visible: {
      filter: 'blur(0px)',
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },
  elastic: {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: [0, 1.2, 1],
      transition: {
        duration: 0.8,
        ease: [0.68, -0.55, 0.265, 1.55],
        times: [0, 0.6, 1]
      }
    }
  },
  fade: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },
  rotate: {
    hidden: { opacity: 0, rotateY: -90 },
    visible: {
      opacity: 1,
      rotateY: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }
    }
  },
  slideDown: {
    hidden: { opacity: 0, scale: 0.98, y: -30 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
      y: 0
    }
  },
  slideLeft: {
    hidden: { opacity: 0, rotateY: 15, x: 60 },
    visible: {
      opacity: 1,
      rotateY: 0,
      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
      x: 0
    }
  },
  slideRight: {
    hidden: { opacity: 0, rotateY: -15, x: -60 },
    visible: {
      opacity: 1,
      rotateY: 0,
      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
      x: 0
    }
  },
  slideUp: {
    hidden: { opacity: 0, scale: 0.95, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
      y: 0
    }
  },
  stagger: {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
      y: 0
    }
  },
  typewriter: {
    hidden: { width: 0 },
    visible: {
      transition: { duration: 0.3, ease: 'easeInOut' },
      width: 'auto'
    }
  },
  wave: {
    hidden: { opacity: 0, rotateZ: -5, y: 20 },
    visible: {
      opacity: 1,
      rotateZ: [-5, 5, 0],
      transition: {
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1],
        times: [0, 0.5, 1]
      },
      y: [20, -10, 0]
    }
  }
}

export function TextReveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
  once = true,
  staggerDelay = 0.03,
  startOnView = true,
  style,
  variant = 'fade',
  wordLevel = false
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { margin: '-10%', once })
  const [hasAnimated, setHasAnimated] = useState(false)

  const shouldAnimate = startOnView ? isInView : true

  // Split text into words or characters
  const elements = wordLevel
    ? children
        .split(' ')
        .map((word, i, arr) => (i < arr.length - 1 ? `${word} ` : word))
    : children.split('')

  // Update container variants with custom stagger delay
  const customContainerVariants = {
    ...containerVariants[variant],
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay
      }
    }
  }

  // Use original item variants - only override duration if explicitly different from default
  const originalVariant = itemVariants[variant]
  const customItemVariants =
    duration === 0.6
      ? originalVariant // Use original variant unchanged if default duration
      : {
          hidden: originalVariant.hidden,
          visible: {
            ...originalVariant.visible,
            transition: {
              ...((originalVariant.visible as Record<string, unknown>)
                .transition as Record<string, unknown>),
              duration
            }
          }
        }

  useEffect(() => {
    if (shouldAnimate && !hasAnimated) {
      startTransition(() => {
        setHasAnimated(true)
      })
    }
  }, [shouldAnimate, hasAnimated])

  const MotionComponent = variant === 'typewriter' ? motion.div : motion.span

  return (
    <motion.div
      animate={shouldAnimate ? 'visible' : 'hidden'}
      className={cn('inline-block', className)}
      initial="hidden"
      ref={ref}
      style={{
        backfaceVisibility: 'hidden',
        contain: 'layout style paint',
        isolation: 'isolate',
        transform: 'translate3d(0,0,0)',
        WebkitBackfaceVisibility: 'hidden',
        WebkitTransform: 'translate3d(0,0,0)',
        willChange: 'transform, opacity',
        ...style
      }}
      variants={customContainerVariants}
    >
      {variant === 'typewriter' ? (
        <motion.span
          className="inline-block overflow-hidden whitespace-nowrap"
          style={{
            display: 'inline-block',
            whiteSpace: 'nowrap'
          }}
          variants={customItemVariants}
        >
          {children}
        </motion.span>
      ) : (
        elements.map((element, index) => (
          <MotionComponent
            className={cn('inline-block', {
              'whitespace-pre': !wordLevel
            })}
            key={index}
            style={{
              backfaceVisibility: 'hidden',
              display: 'inline-block',
              isolation: 'isolate',
              transform: 'translate3d(0,0,0)',
              transformOrigin:
                variant === 'rotate' ? 'center center' : undefined,
              WebkitBackfaceVisibility: 'hidden',
              WebkitTransform: 'translate3d(0,0,0)',
              willChange: 'transform, opacity'
            }}
            variants={customItemVariants}
          >
            {element === ' ' ? '\u00A0' : element}
          </MotionComponent>
        ))
      )}
    </motion.div>
  )
}
