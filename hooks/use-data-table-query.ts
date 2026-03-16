'use client'

import * as React from 'react'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { paginationFallback } from '@/lib'

import { extractPagination, extractQueryItems } from '@/utils/query'

// ============================================================================
// Types
// ============================================================================

export type DataTableQueryOptions<TData> = (params: Record<string, unknown>) =>
  | (Omit<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      UseQueryOptions<any, AxiosError<API>, PaginatedResponse<TData[]>, any>,
      'queryFn'
    > & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryFn?: any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      select?: (data: any) => PaginatedResponse<TData[]>
    })
  | (Omit<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      UseQueryOptions<any, AxiosError<API>, TData[], any>,
      'queryFn'
    > & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryFn?: any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      select?: (data: any) => TData[]
    })
  | UseQueryOptions<
      API<PaginatedResponse<TData[]>>,
      AxiosError<API>,
      PaginatedResponse<TData[]>
    >
  | UseQueryOptions<API<TData[]>, AxiosError<API>, TData[]>

export type UseDataTableQueryParams<TData> = {
  /**
   * Additional filter params from URL (non-standard params)
   */
  filterParams: Record<string, unknown>
  /**
   * Whether the table is in query mode
   */
  isQueryMode: boolean
  /**
   * Whether pagination is handled manually (server-side)
   * When false, pagination params are excluded and all data is fetched for client-side pagination
   */
  manualPagination: boolean
  /**
   * Current page number (1-based)
   */
  page: number
  /**
   * Items per page
   */
  perPage: number
  /**
   * Query options function (only when isQueryMode is true)
   */
  queryOptions?: DataTableQueryOptions<TData>
  /**
   * Current search query
   */
  search: string
}

export type UseDataTableQueryResult<TData> = {
  /**
   * Query result data
   */
  data: unknown
  /**
   * Query error if any
   */
  error: AxiosError<API> | null
  /**
   * Whether query encountered an error
   */
  isError: boolean
  /**
   * Whether query is fetching (including background)
   */
  isFetching: boolean
  /**
   * Whether query is initially loading
   */
  isLoading: boolean
  /**
   * Calculated page count from response
   */
  pageCount: number
  /**
   * Pagination metadata from backend
   */
  pagination: null | Pagination
  /**
   * Refetch function
   */
  refetch: () => void
  /**
   * Extracted table data from query response
   */
  tableData: TData[]
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook that handles all query-related logic for data tables.
 * Extracts query params, executes query, and normalizes response data.
 *
 * @example
 * const queryResult = useDataTableQuery({
 *   isQueryMode: true,
 *   queryOptions: getAllUsersQuery,
 *   page: 1,
 *   perPage: 15,
 *   search: '',
 *   filterParams: { status: 'active' }
 * })
 */
export function useDataTableQuery<TData>(
  params: UseDataTableQueryParams<TData>
): UseDataTableQueryResult<TData> {
  const {
    filterParams,
    isQueryMode,
    manualPagination,
    page,
    perPage,
    queryOptions,
    search
  } = params

  // Build query params object
  const queryParams = React.useMemo(() => {
    if (!isQueryMode) return {}

    return {
      // Only include pagination params when using server-side pagination
      ...(manualPagination && { page, per_page: perPage }),
      ...(search && { search }),
      ...filterParams
    }
  }, [isQueryMode, manualPagination, page, perPage, search, filterParams])

  // Resolve query options
  const queryOptionsMemo = React.useMemo(() => {
    if (isQueryMode && queryOptions) {
      return queryOptions(queryParams)
    }
    return {
      enabled: false,
      queryFn: async () =>
        ({
          data: { data: [] as TData[], pagination: paginationFallback },
          success: true
        }) as unknown as API<PaginatedResponse<TData[]>>,
      queryKey: ['use-data-table-disabled'] as const
    }
  }, [isQueryMode, queryOptions, queryParams])

  // Execute query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queryResult = useQuery(queryOptionsMemo as any)

  // Extract table data from query response
  const tableData = React.useMemo<TData[]>(() => {
    if (!isQueryMode) return []
    return extractQueryItems<TData>(queryResult.data)
  }, [isQueryMode, queryResult.data])

  // Extract pagination metadata from response
  const pagination = React.useMemo(() => {
    if (!isQueryMode || !manualPagination) return null
    return extractPagination(queryResult.data) ?? null
  }, [isQueryMode, manualPagination, queryResult.data])

  // Calculate page count from response
  const pageCount = React.useMemo(() => {
    if (!isQueryMode) return 1

    // For client-side pagination, calculate from array length
    if (!manualPagination) {
      const items = extractQueryItems<TData>(queryResult.data)
      return Math.ceil(items.length / perPage) || 1
    }

    // For server-side pagination, use pagination metadata from response
    if (pagination) {
      return pagination.last_page ?? 1
    }

    // Fallback: calculate from array length
    const items = extractQueryItems<TData>(queryResult.data)
    return Math.ceil(items.length / perPage) || 1
  }, [isQueryMode, manualPagination, queryResult.data, perPage, pagination])

  return {
    data: queryResult.data,
    error: queryResult.error,
    isError: queryResult.isError,
    isFetching: queryResult.isFetching,
    isLoading: queryResult.isLoading,
    pageCount,
    pagination,
    refetch: queryResult.refetch,
    tableData
  }
}
