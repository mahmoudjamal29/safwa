import { paginationFallback } from '@/lib'

import type { QueryKey } from '@/query-client/query'
import type {
  DynamicQueryOptions,
  InfiniteQueryOptions,
  InfiniteQueryOptionsFn,
  RegularQueryOptions,
  RegularQueryOptionsFn
} from '@/types/query'

/**
 * Query data extraction utilities
 * @description Utilities for extracting and transforming data from TanStack Query responses
 */

/**
 * Extracts items from regular query data (handles both paginated and non-paginated)
 * @description Used by useDynamicQuery and useDataTable to normalize query responses
 */
export const extractQueryItems = <T>(data: unknown): T[] => {
  if (!data) return []

  // Check if data is paginated (has a 'data' property with array)
  if (typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
    return data.data as T[]
  }

  // Handle non-paginated array response
  if (Array.isArray(data)) {
    return data as T[]
  }

  return []
}

/**
 * Extracts pagination info from query response
 * @returns pagination object or undefined if not paginated
 */
export const extractPagination = (
  data: unknown
): PaginatedResponse<unknown>['pagination'] | undefined => {
  if (!data) return undefined

  if (
    typeof data === 'object' &&
    'pagination' in data &&
    data.pagination !== null
  ) {
    return (data as PaginatedResponse<unknown>).pagination
  }

  return undefined
}

/**
 * Flattens infinite query pages into a single array
 */
export const flattenInfinitePages = <T>(
  data:
    | undefined
    | {
        pageParams: unknown[]
        pages: API<PaginatedResponse<T[]>>[]
      }
): T[] => {
  if (!data?.pages || !Array.isArray(data.pages)) return []
  return data.pages.flatMap((page) => page.data?.data ?? [])
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Checks if data is an infinite query data structure
 * @description Returns true if data has a 'pages' property that is an array, used to validate infinite query data structure
 */
export const isInfiniteQueryData = (
  data: unknown
): data is { pages: unknown[] } => {
  return (
    data !== null &&
    data !== undefined &&
    typeof data === 'object' &&
    'pages' in data &&
    Array.isArray(data.pages)
  )
}

/**
 * Checks if a page is a valid infinite query page structure
 * @description Returns true if page has 'data' property that is an object with 'data' property that is an array, used to validate infinite query page structure
 */
export const isInfiniteQueryPage = <T = unknown>(
  page: unknown
): page is { data: { data: T[] } } => {
  return (
    page !== null &&
    page !== undefined &&
    typeof page === 'object' &&
    'data' in page &&
    page.data !== null &&
    page.data !== undefined &&
    typeof page.data === 'object' &&
    'data' in page.data &&
    Array.isArray(page.data.data)
  )
}

// ============================================================================
// Query Options Resolution
// ============================================================================

type ResolvedQueryOptionsParams<T extends object = object> = {
  infinite: boolean
  isStaticMode: boolean
  queryOptions?: DynamicQueryOptions<T>
  searchQuery: string
}

/**
 * Resolves regular query options from function or direct object
 * @description Converts function-based query options to regular query options by calling the function with search params, or returns the options directly if already an object
 */
export const resolveRegularQueryOptions = <T extends object = object>(
  params: ResolvedQueryOptionsParams<T>
): RegularQueryOptions<T> | undefined => {
  const { infinite, isStaticMode, queryOptions, searchQuery } = params

  if (!queryOptions || infinite || isStaticMode) return undefined

  if (typeof queryOptions === 'function') {
    return (queryOptions as RegularQueryOptionsFn<T>)({
      search: searchQuery
    })
  }

  return queryOptions as RegularQueryOptions<T>
}

/**
 * Resolves infinite query options from function or direct object
 * @description Converts function-based infinite query options to infinite query options by calling the function with search params, or returns the options directly if already an object
 */
export const resolveInfiniteQueryOptions = <T extends object = object>(
  params: ResolvedQueryOptionsParams<T>
): InfiniteQueryOptions<T> | undefined => {
  const { infinite, isStaticMode, queryOptions, searchQuery } = params

  if (!queryOptions || !infinite || isStaticMode) {
    return undefined
  }

  if (typeof queryOptions === 'function') {
    return (queryOptions as InfiniteQueryOptionsFn<T>)({
      search: searchQuery
    })
  }

  return queryOptions as InfiniteQueryOptions<T>
}

// ============================================================================
// Disabled Query Configs
// ============================================================================

/**
 * Creates a disabled regular query config for static mode
 * @description Returns query options with enabled: false and empty data response, used when queries should be disabled (static mode)
 */
export const createDisabledRegularQuery = <T extends object>(
  queryKey: QueryKey
) => ({
  enabled: false,
  queryFn: async () => ({ data: [] as T[], statusCode: 200, success: true }),
  queryKey
})

/**
 * Creates a disabled infinite query config for static mode
 * @description Returns infinite query options with enabled: false and empty paginated response, used when queries should be disabled (static mode)
 */
export const createDisabledInfiniteQuery = <T extends object>(
  queryKey: QueryKey
) => ({
  enabled: false,
  getNextPageParam: () => undefined,
  initialPageParam: 1,
  queryFn: async (): Promise<API<PaginatedResponse<T[]>>> => ({
    data: {
      data: [],
      pagination: paginationFallback
    },
    statusCode: 200,
    success: true
  }),
  queryKey
})
