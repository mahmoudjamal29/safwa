'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export const triggerClassName =
  'h-8 gap-1 rounded-md border border-dashed text-xs font-normal'

// Resets the page URL param to 1
export const resetPageParam = () => {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  url.searchParams.set('page', '1')
  window.history.replaceState(null, '', url.toString())
}

type FilterState = {
  isEmptyJsonValue: boolean
  setStringValue: (value: null | string | Record<string, string>) => Promise<void>
  value: null | string | Record<string, string> | string[]
}

/**
 * Hook that reads/writes a single filter value in the URL search params
 */
export function useFilterState(filterKey: string, _isJson: boolean): FilterState {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const rawValue = searchParams.get(filterKey)

  let value: null | string | Record<string, string> = rawValue
  let isEmptyJsonValue = false

  if (_isJson && rawValue) {
    try {
      const parsed = JSON.parse(rawValue) as Record<string, string>
      value = parsed
      isEmptyJsonValue =
        Object.values(parsed).every((v) => !v) ?? false
    } catch {
      value = rawValue
    }
  }

  const setStringValue = useCallback(
    async (newValue: null | string | Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())

      if (newValue === null) {
        params.delete(filterKey)
      } else if (typeof newValue === 'object') {
        params.set(filterKey, JSON.stringify(newValue))
      } else {
        params.set(filterKey, newValue)
      }

      router.replace(`${pathname}?${params.toString()}`)
    },
    [filterKey, pathname, router, searchParams]
  )

  return { isEmptyJsonValue, setStringValue, value }
}

type ArrayFilterState = {
  setArrayValue: (values: null | string[]) => void
  value: string[]
}

/**
 * Hook that reads/writes an array filter value in the URL search params
 */
export function useArrayFilterState(filterKey: string): ArrayFilterState {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const rawValue = searchParams.getAll(filterKey)
  const value = rawValue.length > 0 ? rawValue : []

  const setArrayValue = useCallback(
    (newValues: null | string[]) => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete(filterKey)

      if (newValues && newValues.length > 0) {
        newValues.forEach((v) => params.append(filterKey, v))
      }

      router.replace(`${pathname}?${params.toString()}`)
    },
    [filterKey, pathname, router, searchParams]
  )

  return { setArrayValue, value }
}

// Returns date range value from URL param
export function getDateRangeValue(
  value: unknown,
  _variant: string,
  isEmptyJsonValue: boolean
): { dateFrom?: Date; dateTo?: Date } | null {
  if (!value || isEmptyJsonValue) return null

  if (typeof value === 'object' && value !== null) {
    const v = value as Record<string, string>
    return {
      dateFrom: v.from ? new Date(v.from) : undefined,
      dateTo: v.to ? new Date(v.to) : undefined
    }
  }

  return null
}
