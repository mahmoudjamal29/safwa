'use client'

import { useDynamicQuery } from '@/hooks/use-dynamic-query'

import type { CommandPaletteSearchConfig } from '../command-palette-types'

/**
 * Hook for handling query-based command palette pages
 * Wraps useDynamicQuery with command-palette-specific logic
 */
export function useCommandPaletteQuery<T extends object>(
  searchConfig: CommandPaletteSearchConfig<T> | undefined,
  search: string,
  enabled: boolean
) {
  const { fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, items } =
    useDynamicQuery<T>({
      infinite: searchConfig?.infinite ?? false,
      isStaticMode: !searchConfig,
      queryOptions: searchConfig?.queryOptions,
      searchQuery: search
    })

  return {
    fetchNextPage: enabled ? fetchNextPage : undefined,
    hasNextPage: enabled ? hasNextPage : false,
    isFetchingNextPage: enabled ? isFetchingNextPage : false,
    isLoading: enabled ? isLoading : false,
    items: enabled ? items : []
  }
}
