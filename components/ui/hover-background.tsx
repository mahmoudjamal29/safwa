'use client'

import * as React from 'react'

import {
  HTMLMotionProps,
  motion,
  useMotionValue,
  useSpring
} from 'motion/react'

import { cn } from '@/utils'

type HoverBackgroundProps = HTMLMotionProps<'div'> & {
  children?: React.ReactNode
  colors?: {
    background?: string
    glow?: string
    objects?: string[]
  }
  objectCount?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
}

function HoverBackground({
  children,
  className,
  colors = {},
  objectCount = 12,
  ...props
}: HoverBackgroundProps) {
  const {
    background = 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    glow = 'shadow-cyan-400/50',
    objects = [
      'bg-cyan-400/20',
      'bg-purple-400/20',
      'bg-fuchsia-400/20',
      'bg-violet-400/20',
      'bg-blue-400/20',
      'bg-indigo-400/20'
    ]
  } = colors

  const [isHovered, setIsHovered] = React.useState(false)

  // Mouse position tracking for parallax
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring animations for smooth parallax with slower exit
  const springX = useSpring(mouseX, {
    damping: 30,
    restDelta: 0.1,
    // Slower return to center when hover ends
    restSpeed: 0.1,
    stiffness: 300
  })
  const springY = useSpring(mouseY, {
    damping: 30,
    restDelta: 0.1,
    restSpeed: 0.1,
    stiffness: 300
  })

  // Simple seeded random function for deterministic values
  const seededRandom = (seed: number) => {
    let value = seed
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }

  const animatedObjects = React.useMemo(
    () =>
      Array.from({ length: objectCount }, (_, i) => {
        // Use object index as seed for deterministic random values
        const seed = i * 1000 + 54321
        const r1 = seededRandom(seed)
        const r2 = seededRandom(seed + 1)
        const r3 = seededRandom(seed + 2)
        const r4 = seededRandom(seed + 3)
        const r5 = seededRandom(seed + 4)
        const r6 = seededRandom(seed + 5)
        const r7 = seededRandom(seed + 6)
        const r8 = seededRandom(seed + 7)
        const r9 = seededRandom(seed + 8)

        const shape = r1 > 0.5 ? 'circle' : 'square'
        return {
          baseRotation: r2 * 360, // Random starting rotation offset
          breathDuration: r3 * 3 + 3, // 3-6 seconds
          color: objects[i % objects.length],
          delay: r4 * 2,
          floatDirection: r5 > 0.5 ? 1 : -1,
          id: i,
          parallaxStrength: r6 * 0.5 + 0.3, // 0.3-0.8 for more varied parallax depth
          shape,
          size: r7 * 60 + 20, // 20-80px
          x: r8 * 90 + 5, // 5-95% to avoid edges
          y: r9 * 90 + 5
        }
      }),
    [objectCount, objects]
  )

  // Memoize particle configurations
  const particleConfigs = React.useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => {
        const seed = i * 1000 + 98765
        const r1 = seededRandom(seed)
        const r2 = seededRandom(seed + 1)
        const r3 = seededRandom(seed + 2)

        return {
          delay: r3 * 2,
          id: i,
          left: r1 * 100,
          top: r2 * 100
        }
      }),
    []
  )

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered) return

    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate mouse position relative to center (-1 to 1)
    const x = (event.clientX - rect.left - centerX) / centerX
    const y = (event.clientY - rect.top - centerY) / centerY

    mouseX.set(x * 15) // Slightly reduced parallax range
    mouseY.set(y * 15)
  }

  const handleHoverStart = () => {
    setIsHovered(true)
  }

  const handleHoverEnd = () => {
    setIsHovered(false)
    // Smooth return to center
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
      }}
      className={cn(
        'relative size-full overflow-hidden',
        background,
        className
      )}
      data-slot="hover-background"
      onHoverEnd={handleHoverEnd}
      onHoverStart={handleHoverStart}
      onMouseMove={handleMouseMove}
      style={{
        backgroundSize: '200% 200%'
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      {...props}
    >
      {/* Subtle ambient glow */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1]
        }}
        className="bg-gradient-radial absolute inset-0 from-white/5 via-transparent to-transparent"
        transition={{
          duration: 4,
          ease: 'easeInOut',
          repeat: Infinity
        }}
      />

      {/* Animated Objects */}
      {animatedObjects.map((obj) => (
        <motion.div
          animate={{
            opacity: [0.4, 0.6, 0.4],
            rotate:
              obj.shape === 'circle'
                ? [obj.baseRotation, obj.baseRotation + 10, obj.baseRotation]
                : [obj.baseRotation, obj.baseRotation + 5, obj.baseRotation],
            // Default state animations - breathing with base rotation offset
            scale: [0.6, 0.8, 0.6],
            x: [0, obj.floatDirection * 8, 0],
            y: [0, obj.floatDirection * 15, 0]
          }}
          className={cn(
            'absolute border border-white/10 backdrop-blur-sm',
            obj.color,
            obj.shape === 'circle' ? 'rounded-full' : 'rotate-45 rounded-lg'
          )}
          initial={{
            opacity: 0.4,
            rotate: obj.baseRotation,
            scale: 0.6
          }}
          key={obj.id}
          style={{
            height: obj.size,
            left: `${obj.x}%`,
            top: `${obj.y}%`,
            width: obj.size,
            // Apply parallax with individual object strength
            x: springX.get() * obj.parallaxStrength,
            y: springY.get() * obj.parallaxStrength
          }}
          transition={{
            delay: obj.delay,
            duration: obj.breathDuration,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          whileHover={{
            boxShadow: `0 0 30px ${glow.replace('shadow-', '').replace('/50', '')}`,
            scale: 1.5
          }}
        />
      ))}

      {/* Floating Particles on Hover */}
      {isHovered && (
        <div className="pointer-events-none absolute inset-0">
          {particleConfigs.map((particle) => (
            <motion.div
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [0, -50, -100]
              }}
              className="absolute h-1 w-1 rounded-full bg-white/60"
              initial={{ opacity: 0, scale: 0 }}
              key={`particle-${particle.id}`}
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`
              }}
              transition={{
                delay: particle.delay,
                duration: 3,
                ease: 'easeOut',
                repeat: Infinity
              }}
            />
          ))}
        </div>
      )}

      {/* Content Layer */}
      <div className="relative z-10 size-full">{children}</div>
    </motion.div>
  )
}

export { HoverBackground, type HoverBackgroundProps }
