'use client'

import * as React from 'react'

import { HTMLMotionProps, motion } from 'motion/react'

import { cn } from '@/utils'

type GridBackgroundProps = HTMLMotionProps<'div'> & {
  beams?: {
    colors?: string[]
    count?: number
    shadow?: string
    size?: string
    speed?: number
  }
  children?: React.ReactNode
  colors?: {
    background?: string
    borderColor?: string
    borderSize?: string
    borderStyle?: 'dashed' | 'dotted' | 'solid'
  }
  gridSize?: GridSize
}

type GridSize =
  | '4:4'
  | '5:5'
  | '6:6'
  | '6:8'
  | '8:8'
  | '8:12'
  | '10:10'
  | '12:12'
  | '12:16'
  | '16:16'

function GridBackground({
  beams = {},
  children,
  className,
  colors = {},
  gridSize = '8:8',
  ...props
}: GridBackgroundProps) {
  const {
    background = 'bg-slate-900',
    borderColor = 'border-slate-700/50',
    borderSize = '1px',
    borderStyle = 'solid'
  } = colors

  const {
    colors: beamColors = [
      'bg-cyan-400',
      'bg-purple-400',
      'bg-fuchsia-400',
      'bg-violet-400',
      'bg-blue-400',
      'bg-indigo-400',
      'bg-green-400',
      'bg-yellow-400',
      'bg-orange-400',
      'bg-red-400',
      'bg-pink-400',
      'bg-rose-400'
    ],
    count = 12,
    shadow = 'shadow-lg shadow-cyan-400/50 rounded-full',
    speed = 4
  } = beams

  // Parse grid dimensions
  const [cols, rows] = gridSize.split(':').map(Number)

  // Simple seeded random function for deterministic values
  const seededRandom = (seed: number) => {
    let value = seed
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }

  // Generate beam configurations
  const animatedBeams = React.useMemo(
    () =>
      Array.from({ length: Math.min(count, 12) }, (_, i) => {
        // Use beam index as seed for deterministic random values
        const seed = i * 1000 + 12345
        const r1 = seededRandom(seed)
        const r2 = seededRandom(seed + 1)
        const r3 = seededRandom(seed + 2)
        const r4 = seededRandom(seed + 3)
        const r5 = seededRandom(seed + 4)
        const r6 = seededRandom(seed + 5)
        const r7 = seededRandom(seed + 6)

        const direction = r1 > 0.5 ? 'horizontal' : 'vertical'
        const startPosition = r2 > 0.5 ? 'start' : 'end'

        return {
          color: beamColors[i % beamColors.length],
          delay: r3 * 2,
          direction,
          duration: speed + r4 * 2,
          // For horizontal beams: choose a row index (1 to rows-1) - exclude edges
          // For vertical beams: choose a column index (1 to cols-1) - exclude edges
          gridLine:
            direction === 'horizontal'
              ? Math.floor(r5 * (rows - 1)) + 1
              : Math.floor(r6 * (cols - 1)) + 1,
          id: i,
          repeatDelay: r7 * 3 + 2, // 2-5s pause between repeats
          startPosition
        }
      }),
    [count, beamColors, speed, cols, rows]
  )

  const gridStyle = {
    '--border-style': borderStyle
  } as React.CSSProperties

  return (
    <motion.div
      className={cn(
        'relative size-full overflow-hidden',
        background,
        className
      )}
      data-slot="grid-background"
      style={gridStyle}
      {...props}
    >
      {/* Grid Container */}
      <div
        className={cn('absolute inset-0 size-full', borderColor)}
        style={{
          borderBottomStyle: borderStyle,
          borderBottomWidth: borderSize,
          borderRightStyle: borderStyle,
          borderRightWidth: borderSize,
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`
        }}
      >
        {/* Grid Cells */}
        {Array.from({ length: cols * rows }).map((_, index) => (
          <div
            className={cn('relative', borderColor)}
            key={index}
            style={{
              borderLeftStyle: borderStyle,
              borderLeftWidth: borderSize,
              borderTopStyle: borderStyle,
              borderTopWidth: borderSize
            }}
          />
        ))}
      </div>

      {/* Animated Beams */}
      {animatedBeams.map((beam) => {
        // Calculate exact grid line positions as percentages
        const horizontalPosition = (beam.gridLine / rows) * 100
        const verticalPosition = (beam.gridLine / cols) * 100

        return (
          <motion.div
            animate={{
              opacity: [0, 1, 1, 0],
              ...(beam.direction === 'horizontal'
                ? {
                    // Move across the full width of the container
                    x:
                      beam.startPosition === 'start'
                        ? [0, 'calc(100vw + 24px)']
                        : [0, 'calc(-100vw - 24px)']
                  }
                : {
                    // Move across the full height of the container
                    y:
                      beam.startPosition === 'start'
                        ? [0, 'calc(100vh + 24px)']
                        : [0, 'calc(-100vh - 24px)']
                  })
            }}
            className={cn(
              'absolute z-20 rounded-full backdrop-blur-sm',
              beam.color,
              beam.direction === 'horizontal' ? 'h-0.5 w-6' : 'h-6 w-0.5',
              shadow
            )}
            initial={{
              opacity: 0
            }}
            key={beam.id}
            style={{
              ...(beam.direction === 'horizontal'
                ? {
                    left:
                      beam.startPosition === 'start'
                        ? '-12px'
                        : 'calc(100% + 12px)',
                    // Position exactly on the horizontal grid line
                    top: `${horizontalPosition}%`,
                    transform: 'translateY(-50%)' // Center on the line
                  }
                : {
                    // Position exactly on the vertical grid line
                    left: `${verticalPosition}%`,
                    top:
                      beam.startPosition === 'start'
                        ? '-12px'
                        : 'calc(100% + 12px)',
                    transform: 'translateX(-50%)' // Center on the line
                  })
            }}
            transition={{
              delay: beam.delay,
              duration: beam.duration,
              ease: 'linear',
              repeat: Infinity,
              repeatDelay: beam.repeatDelay, // 2-5s pause between repeats
              times: [0, 0.1, 0.9, 1] // Quick fade in, maintain, quick fade out
            }}
          />
        )
      })}

      {/* Content Layer */}
      <div className="relative z-10 size-full">{children}</div>
    </motion.div>
  )
}

export { GridBackground, type GridBackgroundProps }
