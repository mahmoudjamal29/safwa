'use client'

import * as React from 'react'

export type UseIntersectionObserverOptions = {
  enabled?: boolean
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  itemsCount?: number
  rootMargin?: string
  threshold?: number
}

/**
 * Client-only hook for intersection observer
 * Uses browser APIs: IntersectionObserver, requestAnimationFrame
 * Automatically handles SSR - no-op on server side
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element | null>,
  callback: (() => void) | undefined,
  options: UseIntersectionObserverOptions = {}
) {
  const {
    enabled = true,
    hasNextPage = false,
    isFetchingNextPage = false,
    itemsCount,
    rootMargin = '0px 0px 100px 0px',
    threshold = 0.1
  } = options

  const isClient = typeof window !== 'undefined'
  const hasIntersectionObserver =
    isClient && typeof IntersectionObserver !== 'undefined'

  React.useEffect(() => {
    if (!isClient || !hasIntersectionObserver) {
      return
    }

    if (!enabled || !hasNextPage || isFetchingNextPage) {
      return
    }

    let observer: IntersectionObserver | null = null
    let rafId: null | number = null
    let retryCount = 0
    const maxRetries = 20

    const checkRef = () => {
      const currentElement = elementRef.current
      if (!currentElement) {
        retryCount++
        if (retryCount >= maxRetries) {
          return
        }
        rafId = requestAnimationFrame(checkRef)
        return
      }

      observer = new IntersectionObserver(
        (entries) => {
          if (
            entries[0]?.isIntersecting &&
            hasNextPage &&
            !isFetchingNextPage
          ) {
            callback?.()
          }
        },
        {
          rootMargin,
          threshold
        }
      )

      observer.observe(currentElement)
    }

    rafId = requestAnimationFrame(checkRef)

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      if (observer) {
        observer.disconnect()
      }
    }
  }, [
    enabled,
    hasNextPage,
    isFetchingNextPage,
    callback,
    rootMargin,
    threshold,
    elementRef,
    itemsCount,
    isClient,
    hasIntersectionObserver
  ])
}
