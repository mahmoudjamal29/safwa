'use client'

import * as React from 'react'

import {
  AnimatePresence,
  Easing,
  motion,
  useMotionValue,
  useSpring,
  useTransform
} from 'motion/react'

import { cn } from '@/utils'

type AnimationType = 'default' | 'flip' | 'reveal'
type AnimationVariantType =
  | 'decay'
  | 'inertia'
  | 'keyframes'
  | 'spring'
  | 'tween'

interface AvatarGroupContextValue {
  animation?: 'default' | 'flip' | 'reveal'
  tooltipClassName?: string
}

const AvatarGroupContext = React.createContext<AvatarGroupContextValue | null>(
  null
)

interface AvatarGroupItemProps {
  animation?: AnimationType
  children: React.ReactNode
  className?: string
  tooltipClassName?: string
}

interface AvatarGroupProps {
  animation?: AnimationType
  children: React.ReactNode
  className?: string
  tooltipClassName?: string
}

interface AvatarGroupTooltipProps {
  children: React.ReactNode
  className?: string
}

const StaggeredContent = ({ content }: { content: React.ReactNode }) => {
  const children = React.Children.toArray(content)
  return (
    <motion.div
      animate="animate"
      exit="exit"
      initial="initial"
      variants={{
        animate: { transition: { staggerChildren: 0.08 } }
      }}
    >
      {children.map((child, i) => (
        <motion.div
          key={i}
          variants={{
            animate: {
              opacity: 1,
              transition: { duration: 0.3, ease: 'easeOut' },
              y: 0
            },
            exit: {
              opacity: 0,
              transition: { duration: 0.2, ease: 'easeIn' },
              y: -20
            },
            initial: { opacity: 0, y: 20 }
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

export function AvatarGroup({
  animation = 'default',
  children,
  className,
  tooltipClassName
}: AvatarGroupProps) {
  const contextValue: AvatarGroupContextValue = {
    animation,
    tooltipClassName
  }

  return (
    <AvatarGroupContext.Provider value={contextValue}>
      <div className={cn('flex -space-x-2.5', className)}>{children}</div>
    </AvatarGroupContext.Provider>
  )
}

export function AvatarGroupItem({
  animation: itemAnimation,
  children,
  className,
  tooltipClassName
}: AvatarGroupItemProps) {
  const context = React.useContext(AvatarGroupContext)
  const [hoveredIndex, setHoveredIndex] = React.useState<boolean>(false)
  const springConfig = { damping: 5, stiffness: 100 }
  const x = useMotionValue(0)

  const animation = itemAnimation || context?.animation || 'default'
  const finalTooltipClassName = tooltipClassName || context?.tooltipClassName

  // rotate the tooltip
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  )
  // translate the tooltip
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  )

  // Extract tooltip from children
  const tooltipChild = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === AvatarGroupTooltip
  )

  const otherChildren = React.Children.toArray(children).filter(
    (child) =>
      !(React.isValidElement(child) && child.type === AvatarGroupTooltip)
  )

  const tooltipContent =
    tooltipChild && React.isValidElement(tooltipChild)
      ? (tooltipChild.props as AvatarGroupTooltipProps).children
      : null

  const handleMouseMove = (event: React.MouseEvent) => {
    const halfWidth = (event.target as HTMLElement).offsetWidth / 2
    x.set((event.nativeEvent as MouseEvent).offsetX - halfWidth)
  }

  const animationVariants = {
    default: {
      animate: {
        opacity: 1,
        scale: 1,
        transition: {
          damping: 10,
          stiffness: 260,
          type: 'spring' as AnimationVariantType
        },
        y: 0
      },
      exit: {
        opacity: 0,
        scale: 0.6,
        transition: {
          duration: 0.2,
          ease: 'easeInOut' as Easing
        },
        y: 20
      },
      initial: { opacity: 0, scale: 0.6, y: 20 }
    },
    flip: {
      animate: {
        opacity: 1,
        rotateX: 0,
        transition: {
          damping: 25,
          stiffness: 180,
          type: 'spring' as AnimationVariantType
        }
      },
      exit: {
        opacity: 0,
        rotateX: -90,
        transition: {
          duration: 0.3,
          ease: 'easeInOut' as Easing
        }
      },
      initial: { opacity: 0, rotateX: -90 }
    },
    reveal: {
      animate: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.15, ease: 'easeOut' as Easing }
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.1, ease: 'easeIn' as Easing }
      },
      initial: { opacity: 0, scale: 0.95 }
    }
  }

  const selectedVariant = animationVariants[animation]

  return (
    <div
      className={cn('group relative', className)}
      onMouseEnter={() => setHoveredIndex(true)}
      onMouseLeave={() => setHoveredIndex(false)}
    >
      <AnimatePresence mode="wait">
        {hoveredIndex && tooltipContent && (
          <motion.div
            animate={selectedVariant.animate}
            className={cn(
              'absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs font-medium text-white shadow-xl',
              finalTooltipClassName
            )}
            exit={selectedVariant.exit}
            initial={selectedVariant.initial}
            style={{
              rotate: animation === 'reveal' ? 0 : rotate,
              transformOrigin: 'center',
              translateX: animation === 'reveal' ? 0 : translateX,
              whiteSpace: 'nowrap'
            }}
          >
            <motion.div
              animate={{ opacity: 1 }}
              className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent dark:via-emerald-900"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
            <motion.div
              animate={{ opacity: 1 }}
              className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent dark:via-sky-900"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
            {animation === 'reveal' ? (
              <StaggeredContent content={tooltipContent} />
            ) : (
              tooltipContent
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative cursor-pointer"
        onMouseMove={handleMouseMove}
        transition={{
          duration: 0.5
        }}
        whileHover={{
          zIndex: 30
        }}
        whileTap={{ scale: 0.95 }}
      >
        {otherChildren}
      </motion.div>
    </div>
  )
}

export function AvatarGroupTooltip({
  children,
  className
}: AvatarGroupTooltipProps) {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className={cn('relative z-30 hidden', className)}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.div>
  )
}
