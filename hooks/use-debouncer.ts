import React from 'react'

/**
 * Custom debounce hook with proper ref handling
 * @param callback - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns A debounced version of the callback
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  const callbackRef = React.useRef(callback)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Keep callback ref up to date
  React.useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return React.useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    },
    [delay]
  )
}
