'use client'

import type { InfiniteData } from '@tanstack/react-query'

/**
 * Filters items client-side based on search query
 */
export function filterItems<T extends object>(
  items: T[],
  searchQuery: string,
  labelKey?: keyof T,
  labelKeys?: Array<keyof T>
): T[] {
  if (!searchQuery.trim()) return items

  const query = searchQuery.toLowerCase()
  return items.filter((item) => {
    const label = getItemLabel(item, labelKey, labelKeys)
    return label.toLowerCase().includes(query)
  })
}

/**
 * Flattens infinite query pages into a single array
 */
export function flattenInfinitePages<T>(
  data: InfiniteData<API<PaginatedResponse<T[]>>> | undefined
): T[] {
  if (!data) return []
  if (!data.pages || !Array.isArray(data.pages)) return []
  return data.pages.flatMap((page) => page.data?.data ?? [])
}

/**
 * Extracts label from an item based on labelKey or labelKeys
 */
export function getItemLabel<T extends object>(
  item: T,
  labelKey?: keyof T,
  labelKeys?: Array<keyof T>
): string {
  if (labelKeys && labelKeys.length > 0) {
    return labelKeys
      .map((key) => item[key])
      .filter((val) => val != null)
      .join(' ')
  }
  if (labelKey && item[labelKey] != null) {
    return String(item[labelKey])
  }
  return ''
}

/**
 * Gets the next page parameter for infinite queries based on pagination
 */
export function getNextPageParam(
  lastPage: API<PaginatedResponse<unknown[]>>,
  _allPages: API<PaginatedResponse<unknown[]>>[]
): number | undefined {
  const pagination = lastPage.data?.pagination
  if (!pagination) return undefined

  const { current_page, last_page } = pagination
  return current_page < last_page ? current_page + 1 : undefined
}
