import { useCallback } from 'react'

import { parseAsArrayOf, parseAsJson, parseAsString, useQueryState } from 'nuqs'

// Stable empty array reference to prevent infinite re-renders
const EMPTY_ARRAY: string[] = []

export const triggerClassName =
  'bg-card h-34 max-h-[34px] w-full rounded-md text-sm font-thin gap-2'

export type FilterValue = string | { from: string; to: string }

export type UseArrayFilterStateReturn = {
  setArrayValue: (values: null | string[]) => Promise<void>
  value: string[]
}

export type UseFilterStateReturn = {
  isEmptyJsonValue: boolean
  setStringValue: (
    value: null | string | { from: string; to: string }
  ) => Promise<void>
  value: FilterValue
}

export function getDateRangeValue(
  value: FilterValue,
  variant: string | undefined,
  isEmptyJsonValue: boolean
): null | { dateFrom: Date | undefined; dateTo: Date | undefined } {
  if (variant !== 'date-range') return null
  if (isEmptyJsonValue) return null
  if (!value || typeof value !== 'object' || !('from' in value)) return null
  const range = value as { from: string; to: string }
  if (!range.from && !range.to) return null
  return {
    dateFrom: range.from ? new Date(range.from) : undefined,
    dateTo: range.to ? new Date(range.to) : undefined
  }
}

export function resetPageParam() {
  const params = new URLSearchParams(window.location.search)
  params.set('page', '1')
  const next = `${window.location.pathname}?${params.toString()}`
  window.history.replaceState({}, '', next)
}

export function useArrayFilterState(
  filterKey: string
): UseArrayFilterStateReturn {
  const [value, setValue] = useQueryState(
    filterKey,
    parseAsArrayOf(parseAsString).withDefault([])
  )

  const handleSetArrayValue = useCallback(
    async (values: null | string[]): Promise<void> => {
      await setValue(values && values.length > 0 ? values : null)
    },
    [setValue]
  )

  return {
    setArrayValue: handleSetArrayValue,
    value: value ?? EMPTY_ARRAY
  }
}

export function useFilterState(
  filterKey: string,
  needsJsonParser: boolean
): UseFilterStateReturn {
  const [stringValue, setStringValue] = useQueryState(
    filterKey,
    needsJsonParser
      ? parseAsJson((value: unknown) => {
          if (
            value &&
            typeof value === 'object' &&
            'from' in value &&
            'to' in value
          ) {
            return value as { from: string; to: string }
          }
          return { from: '', to: '' }
        }).withDefault({ from: '', to: '' })
      : parseAsString.withDefault('')
  )

  // For backward compatibility, use stringValue as value
  const value = needsJsonParser
    ? (stringValue as unknown as { from: string; to: string })
    : (stringValue as string)

  // Check if JSON value is empty (both from and to are empty strings)
  const isEmptyJsonValue =
    needsJsonParser &&
    typeof stringValue === 'object' &&
    stringValue !== null &&
    'from' in stringValue &&
    'to' in stringValue &&
    (stringValue as { from: string; to: string }).from === '' &&
    (stringValue as { from: string; to: string }).to === ''

  // Wrapper function to handle both string and JSON setter types
  const handleSetValue = useCallback(
    async (
      newValue: null | string | { from: string; to: string }
    ): Promise<void> => {
      if (needsJsonParser) {
        await (
          setStringValue as (
            value: null | { from: string; to: string }
          ) => Promise<unknown>
        )(newValue as null | { from: string; to: string })
      } else {
        await (setStringValue as (value: null | string) => Promise<unknown>)(
          newValue as null | string
        )
      }
      resetPageParam()
    },
    [needsJsonParser, setStringValue]
  )

  return {
    isEmptyJsonValue,
    setStringValue: handleSetValue,
    value
  }
}
