'use client'

import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

interface Props {
  className?: string
  /** height of the black indicator */
  indicatorHeight?: number // px
  /** extra top offset if you have a fixed header */
  offsetTop?: number // px
  steps: Step[]
  /** whether to use sticky positioning (default: true) */
  sticky?: boolean
}

type Step = { id: string; label: string }

export function VerticalStepper({
  className,
  indicatorHeight = 38,
  offsetTop = 80,
  steps,
  sticky = true
}: Props) {
  const t = useTranslations('components.form.verticalStepper')
  // Initialize activeIds from URL hash if present, otherwise use first step
  const getInitialActiveIds = () => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1) // Remove '#'
      if (hash && steps.some((step) => step.id === hash)) {
        return new Set([hash])
      }
    }
    return new Set(steps[0]?.id ? [steps[0].id] : [])
  }

  const [activeIds, setActiveIds] = useState<Set<string>>(getInitialActiveIds)
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const railRef = useRef<HTMLDivElement | null>(null)
  const navRef = useRef<HTMLElement | null>(null)
  const isHandlingInitialHashRef = useRef(false)
  const [indicatorTop, setIndicatorTop] = useState(0)
  const [currentIndicatorHeight, setCurrentIndicatorHeight] =
    useState(indicatorHeight)
  const [isFixed, setIsFixed] = useState(false)
  const [spacerDimensions, setSpacerDimensions] = useState<null | {
    height: number
    width: number
  }>(null)
  const [navWidth, setNavWidth] = useState<null | number>(null)

  // Scroll-spy the actual content sections
  useEffect(() => {
    if (!steps.length) return

    let rafId: null | number = null
    let lastActiveIdsString = ''
    let resizeObserver: null | ResizeObserver = null

    const determineActiveSection = () => {
      const scrollY = window.scrollY
      const viewportTop = scrollY + offsetTop
      const viewportBottom = scrollY + window.innerHeight

      // Find all sections that are sufficiently visible in the viewport
      // A section is considered "active" if at least 30% of it is visible
      const MIN_VISIBILITY_THRESHOLD = 0.3
      const visibleSections = new Set<string>()

      steps.forEach((step) => {
        const el = document.getElementById(step.id)
        if (!el) return

        const rect = el.getBoundingClientRect()
        const elementTop = scrollY + rect.top
        const elementBottom = scrollY + rect.bottom

        // Calculate how much of the section is visible
        const visibleTop = Math.max(elementTop, viewportTop)
        const visibleBottom = Math.min(elementBottom, viewportBottom)
        const visibleHeight = Math.max(0, visibleBottom - visibleTop)
        const totalHeight = rect.height

        // Check if section is sufficiently visible
        // Also ensure the element actually intersects the viewport (not completely above or below)
        // getBoundingClientRect() gives positions relative to viewport, so:
        // - rect.top < 0 means element starts above viewport
        // - rect.bottom > window.innerHeight means element extends below viewport
        // - rect.top > window.innerHeight means element is completely below viewport
        // - rect.bottom < 0 means element is completely above viewport
        if (totalHeight > 0 && visibleHeight > 0) {
          const visibilityRatio = visibleHeight / totalHeight
          // Element must be at least MIN_VISIBILITY_THRESHOLD visible AND intersect viewport
          // Account for offsetTop in the intersection check
          const viewportTopWithOffset = offsetTop
          const intersectsViewport =
            rect.bottom > viewportTopWithOffset && rect.top < window.innerHeight

          if (
            visibilityRatio >= MIN_VISIBILITY_THRESHOLD &&
            intersectsViewport
          ) {
            visibleSections.add(step.id)
          }
        }
      })

      // If no sections are visible, use the first section as fallback
      if (visibleSections.size === 0 && steps.length > 0) {
        visibleSections.add(steps[0].id)
      }

      // If handling initial hash, prioritize the hash section even if others are visible
      if (isHandlingInitialHashRef.current && typeof window !== 'undefined') {
        const hash = window.location.hash.slice(1)
        if (hash && steps.some((step) => step.id === hash)) {
          // Only highlight the hash section
          visibleSections.clear()
          visibleSections.add(hash)
        }
      }

      // Only update if the active sections changed (prevent flickering)
      const currentIdsString = Array.from(visibleSections).sort().join(',')

      if (currentIdsString !== lastActiveIdsString) {
        lastActiveIdsString = currentIdsString
        setActiveIds(visibleSections)
      }
    }

    const handleScroll = () => {
      // Don't run scroll-spy while handling initial hash
      if (isHandlingInitialHashRef.current) return

      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(determineActiveSection)
    }

    // Handle URL hash on mount - scroll to hash element and set activeIds
    const handleInitialHash = () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.slice(1)
        if (hash && steps.some((step) => step.id === hash)) {
          // Set activeIds immediately based on hash
          setActiveIds(new Set([hash]))
          isHandlingInitialHashRef.current = true

          const el = document.getElementById(hash)
          if (el) {
            // Function to scroll to element with proper offset
            const scrollToHashElement = () => {
              // Get the element's position relative to the document
              const rect = el.getBoundingClientRect()
              const currentScrollY = window.scrollY
              const elementTopInDocument = rect.top + currentScrollY

              // Calculate target scroll position (element top minus offset)
              const targetScrollPosition = Math.max(
                0,
                elementTopInDocument - offsetTop
              )

              // Scroll to the calculated position
              window.scrollTo({
                behavior: 'instant',
                top: targetScrollPosition
              })

              // Verify and correct scroll position after browser has scrolled
              // Use multiple attempts to ensure it sticks
              const verifyAndCorrect = (attempt = 0) => {
                setTimeout(
                  () => {
                    const newRect = el.getBoundingClientRect()
                    const newScrollY = window.scrollY
                    const expectedTop = offsetTop
                    const actualTop = newRect.top
                    const error = Math.abs(actualTop - expectedTop)

                    // If element is not at the expected position (within 5px tolerance)
                    if (error > 5 && attempt < 5) {
                      // Get element's absolute position in document
                      const elementTopInDocument = newRect.top + newScrollY

                      // Calculate correct scroll position to place element at offsetTop
                      const targetScrollY = Math.max(
                        0,
                        elementTopInDocument - offsetTop
                      )

                      // Only scroll if position is actually different (avoid infinite loops)
                      if (Math.abs(window.scrollY - targetScrollY) > 1) {
                        window.scrollTo({
                          behavior: 'instant',
                          top: targetScrollY
                        })

                        // Retry verification with increasing delay
                        verifyAndCorrect(attempt + 1)
                      } else {
                        // Position is close enough, enable scroll-spy
                        setTimeout(() => {
                          isHandlingInitialHashRef.current = false
                          determineActiveSection()
                        }, 50)
                      }
                    } else {
                      // Position is correct (or max attempts reached), enable scroll-spy
                      setTimeout(() => {
                        isHandlingInitialHashRef.current = false
                        determineActiveSection()
                      }, 50)
                    }
                  },
                  50 + attempt * 30
                ) // Shorter delays, more attempts
              }

              // Start verification after initial scroll
              verifyAndCorrect()
            }

            // Wait for DOM and any async content to be ready
            // The browser may have already scrolled to the hash, so we need to correct it
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                // Check if element exists and has valid dimensions
                const rect = el.getBoundingClientRect()
                if (rect.height > 0 || el.offsetHeight > 0) {
                  // Start scrolling immediately - browser may have already scrolled
                  scrollToHashElement()
                } else {
                  // Element might not be fully rendered yet, wait a bit more
                  setTimeout(() => {
                    scrollToHashElement()
                  }, 100)
                }
              })
            })

            // Also try to correct immediately in case browser already scrolled
            // This catches the case where browser scroll happens before RAF callbacks
            setTimeout(() => {
              const rect = el.getBoundingClientRect()
              if (rect.top < offsetTop) {
                // Browser scrolled to top of element, need to adjust
                const elementTopInDoc = rect.top + window.scrollY
                const targetScroll = Math.max(0, elementTopInDoc - offsetTop)
                window.scrollTo({ behavior: 'instant', top: targetScroll })
              }
            }, 0)
            return // Don't run determineActiveSection immediately
          } else {
            // Element not found, wait a bit and try again
            setTimeout(() => {
              const elRetry = document.getElementById(hash)
              if (elRetry) {
                setActiveIds(new Set([hash]))
                isHandlingInitialHashRef.current = true
                const rect = elRetry.getBoundingClientRect()
                const elementTopInDoc = rect.top + window.scrollY
                const targetScroll = Math.max(0, elementTopInDoc - offsetTop)
                window.scrollTo({ behavior: 'instant', top: targetScroll })
                setTimeout(() => {
                  isHandlingInitialHashRef.current = false
                  determineActiveSection()
                }, 200)
              } else {
                isHandlingInitialHashRef.current = false
                determineActiveSection()
              }
            }, 200)
            return
          }
        }
      }
      // No hash or invalid hash - run initial check immediately
      if (!isHandlingInitialHashRef.current) {
        determineActiveSection()
      }
    }

    // Handle hash changes (when hash changes after initial load)
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash && steps.some((step) => step.id === hash)) {
        // Set activeIds immediately based on hash
        setActiveIds(new Set([hash]))

        const el = document.getElementById(hash)
        if (el) {
          const elementPosition =
            el.getBoundingClientRect().top + window.pageYOffset - offsetTop
          window.scrollTo({
            behavior: 'smooth',
            top: Math.max(0, elementPosition)
          })
          setTimeout(() => {
            determineActiveSection()
          }, 300)
        }
      }
    }

    // Watch for size changes in section elements (e.g., when async content loads)
    // This ensures scroll-spy recalculates when content dimensions change
    // Set up ResizeObserver BEFORE handleInitialHash so it's ready
    resizeObserver = new ResizeObserver(() => {
      // Debounce resize observer calls
      // Don't run while handling initial hash (will run after hash handling completes)
      if (isHandlingInitialHashRef.current) return
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(determineActiveSection)
    })

    // Observe all section elements for size changes
    // Use requestAnimationFrame to ensure DOM is ready
    const observeSections = () => {
      steps.forEach((step) => {
        const el = document.getElementById(step.id)
        if (el) {
          resizeObserver?.observe(el)
        } else {
          // If element doesn't exist yet, try again after a short delay
          // This handles cases where content loads asynchronously
          setTimeout(() => {
            const elRetry = document.getElementById(step.id)
            if (elRetry && resizeObserver) {
              resizeObserver.observe(elRetry)
            }
          }, 100)
        }
      })
    }

    // Use requestAnimationFrame to ensure DOM is ready before observing
    requestAnimationFrame(() => {
      observeSections()
      // Initial check - handle hash AFTER observer is set up and DOM is ready
      handleInitialHash()
    })

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      // Clean up resize observer
      if (resizeObserver) {
        steps.forEach((step) => {
          const el = document.getElementById(step.id)
          if (el) {
            resizeObserver?.unobserve(el)
          }
        })
        resizeObserver.disconnect()
      }

      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      window.removeEventListener('hashchange', handleHashChange)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [steps, offsetTop])

  // Move the rounded indicator to span all active labels
  const updateIndicator = () => {
    const rail = railRef.current
    if (!rail || activeIds.size === 0) return

    // Get all active buttons, sorted by their order in the steps array
    const activeButtons = steps
      .filter((step) => activeIds.has(step.id))
      .map((step) => itemRefs.current[step.id])
      .filter((btn) => btn !== null) as HTMLButtonElement[]

    if (activeButtons.length === 0) return

    const railRect = rail.getBoundingClientRect()
    const railTop = railRect.top

    // Calculate the top of the first active button and bottom of the last active button
    const firstButton = activeButtons[0]
    const lastButton = activeButtons[activeButtons.length - 1]

    const firstButtonTop = firstButton.getBoundingClientRect().top
    const lastButtonBottom = lastButton.getBoundingClientRect().bottom

    // Position indicator to span from first to last active button
    const indicatorTopPosition = firstButtonTop - railTop
    const indicatorHeightValue = lastButtonBottom - firstButtonTop

    setIndicatorTop(indicatorTopPosition)
    setCurrentIndicatorHeight(indicatorHeightValue)
  }

  useEffect(() => {
    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    window.addEventListener('scroll', updateIndicator)
    return () => {
      window.removeEventListener('resize', updateIndicator)
      window.removeEventListener('scroll', updateIndicator)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIds, steps.length])

  // Capture initial width to prevent flicker
  useEffect(() => {
    if (!navRef.current) return

    const navElement = navRef.current

    // Capture initial width immediately if not set
    if (navWidth === null) {
      // Use double RAF to ensure DOM layout is complete and stable
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const computedWidth = navElement.getBoundingClientRect().width
          if (computedWidth > 0) {
            // Set width synchronously on element before state update to prevent flicker
            navElement.style.width = `${computedWidth}px`
            setNavWidth(computedWidth)
          }
        })
      })
    }

    // Update width on resize (debounced)
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        const computedWidth = navElement.getBoundingClientRect().width
        if (computedWidth > 0 && computedWidth !== navWidth) {
          setNavWidth(computedWidth)
          navElement.style.width = `${computedWidth}px`
        }
      }, 100)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimeout) clearTimeout(resizeTimeout)
    }
  }, [navWidth])

  // Handle sticky positioning when CSS sticky doesn't work due to overflow constraints
  useEffect(() => {
    if (!sticky || !navRef.current || navWidth === null) return

    const navElement = navRef.current
    const parentElement = navElement.parentElement
    if (!parentElement) return

    // Always use fixed positioning to prevent flicker from position changes
    let rafId: null | number = null
    let initialTop: null | number = null
    let initialLeft: null | number = null
    let initialHeight: null | number = null
    let isInitialized = false

    // Initialize once: Capture initial position and always render spacer
    const initialize = () => {
      if (isInitialized) return

      const rect = navElement.getBoundingClientRect()
      initialTop = rect.top + window.scrollY
      // For fixed positioning with inset-inline-start:
      // - In LTR: inset-inline-start positions from left, so use rect.left
      // - In RTL: inset-inline-start positions from right, so use window.innerWidth - rect.right
      const computedStyle = window.getComputedStyle(document.documentElement)
      const direction = computedStyle.direction
      initialLeft =
        direction === 'rtl' ? window.innerWidth - rect.right : rect.left
      initialHeight = rect.height || navElement.offsetHeight

      // Always set spacer and fixed state (prevents layout shifts)
      const height = initialHeight || navElement.offsetHeight || 200

      // Defer state updates and positioning to avoid calling flushSync during render
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        flushSync(() => {
          setIsFixed(true)
          setSpacerDimensions({
            height,
            width: navWidth
          })
        })

        // Set fixed positioning immediately after state update
        navElement.style.position = 'fixed'
        navElement.style.width = `${navWidth}px`
        navElement.style.minWidth = `${navWidth}px`
        navElement.style.setProperty('inset-inline-start', `${initialLeft}px`)
        navElement.style.top = `${initialTop}px`
        navElement.style.bottom = 'auto'
      })

      isInitialized = true
    }

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        if (!isInitialized) {
          initialize()
          return
        }

        const parentRect = parentElement.getBoundingClientRect()
        const scrollY = window.scrollY
        const parentTop = scrollY + parentRect.top
        const parentBottom = scrollY + parentRect.bottom
        const shouldStickAt = offsetTop
        const navHeight = initialHeight || 200

        // Calculate desired top position
        let newTop: number | undefined
        let newBottom: string | undefined

        if (parentTop <= shouldStickAt) {
          // Stick at top
          newTop = shouldStickAt
          newBottom = undefined
        } else if (parentBottom <= shouldStickAt + navHeight) {
          // Stick at bottom of viewport
          newTop = undefined
          newBottom = '0px'
        } else {
          // Follow parent's natural position
          newTop = parentTop
          newBottom = undefined
        }

        // Only update if position actually changed (prevent unnecessary updates)
        const currentTop = navElement.style.top
        const currentBottom = navElement.style.bottom
        const topStr = newTop !== undefined ? `${newTop}px` : 'auto'
        const bottomStr = newBottom || 'auto'

        if (currentTop !== topStr || currentBottom !== bottomStr) {
          // Update position - this is just changing top/bottom, not position type
          if (newTop !== undefined) {
            navElement.style.top = `${newTop}px`
            navElement.style.bottom = 'auto'
          } else {
            navElement.style.top = 'auto'
            navElement.style.bottom = bottomStr
          }
        }
      })
    }

    // Initialize on mount
    initialize()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
      // Reset styles on cleanup
      if (navElement) {
        navElement.style.position = ''
        navElement.style.top = ''
        navElement.style.removeProperty('inset-inline-start')
        navElement.style.bottom = ''
        navElement.style.width = ''
      }
    }
  }, [sticky, offsetTop, navWidth])

  const onClick = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return

    // Calculate the position accounting for the offset
    const elementPosition =
      el.getBoundingClientRect().top + window.pageYOffset - offsetTop

    // Smooth scroll to the calculated position
    window.scrollTo({
      behavior: 'smooth',
      top: elementPosition
    })

    // Update URL hash without jump
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <>
      <nav
        aria-label={t('ariaLabel')}
        className={cn(
          'hidden lg:block',
          sticky && 'sticky top-20 z-10 h-fit self-start **:text-sm',
          'ps-0 xl:ps-5',
          className
        )}
        ref={navRef}
        style={
          navWidth
            ? {
                backfaceVisibility: 'hidden',
                minWidth: `${navWidth}px`,
                transform: 'translate3d(0, 0, 0)',
                width: `${navWidth}px`,
                willChange: isFixed ? 'transform' : 'auto'
              }
            : {
                backfaceVisibility: 'hidden',
                minWidth: '200px',
                transform: 'translate3d(0, 0, 0)'
              }
        }
      >
        <div className={cn('relative', 'ps-6')} ref={railRef}>
          {/* vertical rail */}
          <div
            aria-hidden
            className="absolute top-0 bottom-0"
            style={{
              background: 'var(--border)',
              insetInlineStart: 6,
              width: 3
            }}
          />
          {/* moving rounded indicator */}
          <div
            aria-hidden
            className="absolute ms-[2px] rounded-full"
            style={
              {
                background: ' var(--primary)',
                height: currentIndicatorHeight,
                insetInlineStart: 5, // centers a ~4px pill on the 1px rail
                transform: `translateY(${indicatorTop}px)`,
                transition: 'transform 180ms ease, height 180ms ease',
                width: 1
              } as React.CSSProperties
            }
          />

          {steps.map((s) => {
            const active = activeIds.has(s.id)
            return (
              <button
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'block w-full cursor-pointer py-2 focus:outline-none',
                  'text-start',
                  active
                    ? 'text-card-foreground font-medium'
                    : 'text-muted-foreground'
                )}
                key={s.id}
                onClick={() => onClick(s.id)}
                ref={(el) => {
                  itemRefs.current[s.id] = el
                }}
              >
                {s.label}
              </button>
            )
          })}
        </div>
      </nav>
      {/* Spacer to maintain layout when nav is fixed */}
      {isFixed && sticky && spacerDimensions && (
        <div
          aria-hidden
          className="hidden shrink-0 lg:block"
          style={{
            height: `${spacerDimensions.height}px`,
            width: `${spacerDimensions.width}px`
          }}
        />
      )}
    </>
  )
}
