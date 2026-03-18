'use client'

import * as React from 'react'
import { ElementType, ReactNode, useEffect, useRef, useState } from 'react'

import { cn } from '@/utils'

export interface SvgTextProps {
  /**
   * The element type to render for the container
   * @default "div"
   */
  as?: ElementType
  /**
   * The content to display (will have the SVG "inside" it)
   */
  children: ReactNode
  /**
   * Additional className for the container
   */
  className?: string
  /**
   * Font size for the text mask (in viewport width units or CSS units)
   * @default "20vw"
   */
  fontSize?: number | string
  /**
   * Font weight for the text mask
   * @default "bold"
   */
  fontWeight?: number | string
  /**
   * The SVG content to display inside the text
   */
  svg: ReactNode
}

/**
 * SvgText displays content with an SVG background fill effect.
 * The SVG is masked by the content, creating a dynamic text look.
 */
export function SvgText({
  as: Component = 'div',
  children,
  className = '',
  fontSize = '20vw',
  fontWeight = 'bold',
  svg
}: SvgTextProps) {
  const textRef = useRef<HTMLDivElement>(null)
  const [textDimensions, setTextDimensions] = useState({ height: 0, width: 0 })
  const content = React.Children.toArray(children).join('')
  const maskId = React.useId()

  useEffect(() => {
    if (!textRef.current) return

    const updateDimensions = () => {
      const rect = textRef.current?.getBoundingClientRect()
      if (rect) {
        setTextDimensions({
          height: Math.max(rect.height, 100),
          width: Math.max(rect.width, 200)
        })
      }
    }

    // Initial measurement
    updateDimensions()

    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(updateDimensions)
    resizeObserver.observe(textRef.current)

    return () => resizeObserver.disconnect()
  }, [content, fontSize, fontWeight])

  return (
    <Component className={cn('relative inline-block', className)}>
      {/* Hidden text for measuring */}
      <div
        className="pointer-events-none absolute font-bold whitespace-nowrap opacity-0"
        ref={textRef}
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
          fontWeight
        }}
      >
        {content}
      </div>

      {/* SVG with text mask */}
      <svg
        className="block"
        height={textDimensions.height}
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
          fontWeight
        }}
        viewBox={`0 0 ${textDimensions.width} ${textDimensions.height}`}
        width={textDimensions.width}
      >
        <defs>
          <mask id={maskId}>
            <rect fill="black" height="100%" width="100%" />
            <text
              dominantBaseline="central"
              fill="white"
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize:
                  typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
                fontWeight
              }}
              textAnchor="middle"
              x="50%"
              y="50%"
            >
              {content}
            </text>
          </mask>
        </defs>

        {/* Background SVG with proper scaling */}
        <g mask={`url(#${maskId})`}>
          <foreignObject
            height="100%"
            style={{
              overflow: 'visible'
            }}
            width="100%"
          >
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                height: `${textDimensions.height}px`,
                justifyContent: 'center',
                width: `${textDimensions.width}px`
              }}
            >
              <div
                style={{
                  height: '200px',
                  transform: `scale(${Math.max(textDimensions.width / 400, textDimensions.height / 200)})`,
                  transformOrigin: 'center',
                  width: '400px'
                }}
              >
                {svg}
              </div>
            </div>
          </foreignObject>
        </g>
      </svg>

      {/* Screen reader text */}
      <span className="sr-only">{content}</span>
    </Component>
  )
}
