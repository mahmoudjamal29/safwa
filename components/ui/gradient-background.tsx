'use client'

import { HTMLMotionProps, motion, type Transition } from 'motion/react'

import { cn } from '@/utils'

type GradientBackgroundProps = HTMLMotionProps<'div'> & {
  transition?: Transition
}

function GradientBackground({
  className,
  transition = { duration: 10, ease: 'easeInOut', repeat: Infinity },
  ...props
}: GradientBackgroundProps) {
  return (
    <motion.div
      animate={{
        backgroundPosition: [
          '0% 0%',
          '50% 50%',
          '100% 0%',
          '50% 100%',
          '0% 50%',
          '100% 100%',
          '0% 0%'
        ]
      }}
      className={cn(
        'size-full bg-gradient-to-br from-fuchsia-400 from-0% via-violet-500 via-50% to-fuchsia-600 to-100% bg-[length:300%_300%]',
        className
      )}
      data-slot="gradient-background"
      transition={transition}
      whileTap={{
        scale: 0.98
      }}
      {...props}
    />
  )
}

export { GradientBackground, type GradientBackgroundProps }
