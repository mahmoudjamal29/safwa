'use client'

import { useSearchParams } from 'next/navigation'
import * as React from 'react'

import {
  type ColumnFiltersState,
  ColumnSort,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  Row,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  useReactTable,
  type VisibilityState
} from '@tanstack/react-table'
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  type Parser,
  useQueryState,
  type UseQueryStateOptions,
  useQueryStates
} from 'nuqs'
import { useDebounceCallback } from 'usehooks-ts'

import {
  type DataTableQueryOptions,
  useDataTableQuery
} from '@/hooks/use-data-table-query'

import { getSortingStateParser } from '@/utils/parsers'

import type { ExtendedColumnSort } from '@/types/data-table'

// ============================================================================
// Constants
// ============================================================================

const PAGE_KEY = 'page'
const PER_PAGE_KEY = 'per_page'
const SORT_KEY = 'sort'
const SEARCH_KEY = 'search'
const ARRAY_SEPARATOR = ','
const DEBOUNCE_MS = 300
const THROTTLE_MS = 50

const STANDARD_PARAMS = ['page', 'per_page', 'search', 'sort', 'tab'] as const

// ============================================================================
// Types
// ============================================================================

interface UseDataTableBaseProps<TData> extends Omit<
  TableOptions<TData>,
  | 'data'
  | 'getCoreRowModel'
  | 'manualFiltering'
  | 'manualPagination'
  | 'manualSorting'
  | 'pageCount'
  | 'state'
> {
  /**
   * Filter keys that should be converted to arrays (for multiselect filters)
   * Values will be split by comma and sent as arrays to the API
   */
  arrayFilterKeys?: string[]
  clearOnDefault?: boolean
  debounceMs?: number
  enableAdvancedFilter?: boolean
  getRowCanExpand?: (row: Row<TData>) => boolean
  history?: 'push' | 'replace'
  initialState?: Omit<Partial<TableState>, 'sorting'> & {
    sorting?: ExtendedColumnSort<TData>[]
  }
  manualFiltering?: boolean
  manualPagination?: boolean
  manualSorting?: boolean
  scroll?: boolean
  shallow?: boolean
  startTransition?: React.TransitionStartFunction
  throttleMs?: number
}

type UseDataTableProps<TData> =
  | UseDataTableWithDataProps<TData>
  | UseDataTableWithQueryProps<TData>

interface UseDataTableWithDataProps<
  TData
> extends UseDataTableBaseProps<TData> {
  data: TData[]
  pageCount: number
  queryOptions?: never
}

interface UseDataTableWithQueryProps<
  TData
> extends UseDataTableBaseProps<TData> {
  data?: never
  pageCount?: never
  queryOptions: DataTableQueryOptions<TData>
}

// ============================================================================
// Hook
// ============================================================================

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  'use no memo'
  const searchParams = useSearchParams()

  const isQueryMode =
    'queryOptions' in props && props.queryOptions !== undefined

  const {
    arrayFilterKeys = [],
    clearOnDefault = true,
    columns,
    debounceMs = DEBOUNCE_MS,
    enableAdvancedFilter = false,
    getRowCanExpand,
    history = 'replace',
    initialState,
    manualFiltering = true,
    manualPagination = true,
    manualSorting = false,
    scroll = false,
    shallow = false,
    startTransition,
    throttleMs = THROTTLE_MS,
    ...tableProps
  } = props

  // -------------------------------------------------------------------------
  // URL State Options
  // -------------------------------------------------------------------------

  const queryStateOptions = React.useMemo<
    Omit<UseQueryStateOptions<string>, 'parse'>
  >(
    () => ({
      clearOnDefault,
      debounceMs,
      history,
      scroll,
      shallow,
      startTransition,
      throttleMs
    }),
    [
      history,
      scroll,
      shallow,
      throttleMs,
      debounceMs,
      clearOnDefault,
      startTransition
    ]
  )

  // -------------------------------------------------------------------------
  // Local State
  // -------------------------------------------------------------------------

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {}
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {})

  // -------------------------------------------------------------------------
  // URL State: Pagination
  // -------------------------------------------------------------------------

  const [page, setPage] = useQueryState(
    PAGE_KEY,
    parseAsInteger.withOptions(queryStateOptions).withDefault(1)
  )
  const [perPage, setPerPage] = useQueryState(
    PER_PAGE_KEY,
    parseAsInteger
      .withOptions(queryStateOptions)
      .withDefault(initialState?.pagination?.pageSize ?? 15)
  )

  const pagination: PaginationState = React.useMemo(
    () => ({
      pageIndex: page - 1,
      pageSize: perPage
    }),
    [page, perPage]
  )

  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      if (typeof updaterOrValue === 'function') {
        const newPagination = updaterOrValue(pagination)
        void setPage(newPagination.pageIndex + 1)
        void setPerPage(newPagination.pageSize)
      } else {
        void setPage(updaterOrValue.pageIndex + 1)
        void setPerPage(updaterOrValue.pageSize)
      }
    },
    [pagination, setPage, setPerPage]
  )

  // -------------------------------------------------------------------------
  // URL State: Sorting
  // -------------------------------------------------------------------------

  const columnIds = React.useMemo(
    () =>
      new Set(columns.map((column) => column.id).filter(Boolean) as string[]),
    [columns]
  )

  const [sorting, setSorting] = useQueryState(
    SORT_KEY,
    getSortingStateParser<TData>(columnIds)
      .withOptions(queryStateOptions)
      .withDefault(initialState?.sorting ?? [])
  )

  const onSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      if (typeof updaterOrValue === 'function') {
        const newSorting = updaterOrValue(sorting as ColumnSort[])
        setSorting(newSorting as ExtendedColumnSort<TData>[])
      } else {
        setSorting(updaterOrValue as ExtendedColumnSort<TData>[])
      }
    },
    [sorting, setSorting]
  )

  // -------------------------------------------------------------------------
  // URL State: Search
  // -------------------------------------------------------------------------

  const [search, setSearch] = useQueryState(
    SEARCH_KEY,
    parseAsString.withOptions(queryStateOptions).withDefault('')
  )

  const debouncedSetSearch = useDebounceCallback((query: string) => {
    void setPage(1)
    void setSearch(query)
  }, debounceMs)

  const handleSearch = React.useCallback(
    (query: string) => {
      debouncedSetSearch(query)
    },
    [debouncedSetSearch]
  )

  // -------------------------------------------------------------------------
  // Filter Params (from URL)
  // -------------------------------------------------------------------------

  const filterParams = React.useMemo(() => {
    if (!isQueryMode) return {}

    const params: Record<string, unknown> = {}
    searchParams.forEach((value, key) => {
      if (
        !STANDARD_PARAMS.includes(key as (typeof STANDARD_PARAMS)[number]) &&
        value
      ) {
        // Convert to array if key is in arrayFilterKeys (for multiselect filters)
        params[key] = arrayFilterKeys.includes(key)
          ? value.split(ARRAY_SEPARATOR)
          : value
      }
    })
    return params
  }, [isQueryMode, searchParams, arrayFilterKeys])

  // -------------------------------------------------------------------------
  // Query (using extracted hook)
  // -------------------------------------------------------------------------

  const queryResult = useDataTableQuery<TData>({
    filterParams,
    isQueryMode,
    manualPagination,
    page,
    perPage,
    queryOptions: isQueryMode
      ? (props as UseDataTableWithQueryProps<TData>).queryOptions
      : undefined,
    search
  })

  // -------------------------------------------------------------------------
  // Table Data
  // -------------------------------------------------------------------------

  const tableData = React.useMemo(() => {
    if (isQueryMode) {
      return queryResult.tableData
    }
    return (props as UseDataTableWithDataProps<TData>).data
  }, [isQueryMode, queryResult.tableData, props])

  const tablePageCount = React.useMemo(() => {
    if (isQueryMode) {
      return queryResult.pageCount
    }
    return (props as UseDataTableWithDataProps<TData>).pageCount
  }, [isQueryMode, queryResult.pageCount, props])

  // -------------------------------------------------------------------------
  // Column Filters
  // -------------------------------------------------------------------------

  const filterableColumns = React.useMemo(() => {
    if (enableAdvancedFilter) return []
    return columns.filter((column) => column.enableColumnFilter)
  }, [columns, enableAdvancedFilter])

  const filterParsers = React.useMemo(() => {
    if (enableAdvancedFilter) return {}

    return filterableColumns.reduce<
      Record<string, Parser<string> | Parser<string[]>>
    >((acc, column) => {
      if (column.meta?.options) {
        acc[column.id ?? ''] = parseAsArrayOf(
          parseAsString,
          ARRAY_SEPARATOR
        ).withOptions(queryStateOptions)
      } else {
        acc[column.id ?? ''] = parseAsString.withOptions(queryStateOptions)
      }
      return acc
    }, {})
  }, [filterableColumns, queryStateOptions, enableAdvancedFilter])

  const [filterValues, setFilterValues] = useQueryStates(filterParsers)

  const debouncedSetFilterValues = useDebounceCallback(
    (values: typeof filterValues) => {
      void setPage(1)
      void setFilterValues(values)
    },
    debounceMs
  )

  const initialColumnFilters: ColumnFiltersState = React.useMemo(() => {
    if (enableAdvancedFilter) return []

    return Object.entries(filterValues).reduce<ColumnFiltersState>(
      (filters, [key, value]) => {
        if (value !== null) {
          const processedValue = Array.isArray(value)
            ? value
            : typeof value === 'string' && /[^a-zA-Z0-9]/.test(value)
              ? value.split(/[^a-zA-Z0-9]+/).filter(Boolean)
              : [value]

          filters.push({
            id: key,
            value: processedValue
          })
        }
        return filters
      },
      []
    )
  }, [filterValues, enableAdvancedFilter])

  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialColumnFilters)

  const onColumnFiltersChange = React.useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      if (enableAdvancedFilter) return

      setColumnFilters((prev) => {
        const next =
          typeof updaterOrValue === 'function'
            ? updaterOrValue(prev)
            : updaterOrValue

        const filterUpdates = next.reduce<
          Record<string, null | string | string[]>
        >((acc, filter) => {
          if (filterableColumns.find((column) => column.id === filter.id)) {
            acc[filter.id] = filter.value as string | string[]
          }
          return acc
        }, {})

        for (const prevFilter of prev) {
          if (!next.some((filter) => filter.id === prevFilter.id)) {
            filterUpdates[prevFilter.id] = null
          }
        }

        debouncedSetFilterValues(filterUpdates)
        return next
      })
    },
    [debouncedSetFilterValues, filterableColumns, enableAdvancedFilter]
  )

  // -------------------------------------------------------------------------
  // React Table
  // -------------------------------------------------------------------------

  const table = useReactTable({
    ...tableProps,
    columns,
    data: tableData,
    defaultColumn: {
      ...tableProps.defaultColumn,
      enableColumnFilter: false
    },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowCanExpand,
    getSortedRowModel: getSortedRowModel(),
    initialState,
    manualFiltering,
    manualPagination,
    manualSorting,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange,
    pageCount: tablePageCount,
    state: {
      columnFilters,
      columnVisibility,
      pagination,
      rowSelection,
      sorting: sorting as ExtendedColumnSort<TData>[]
    }
  })

  // -------------------------------------------------------------------------
  // Return
  // -------------------------------------------------------------------------

  return {
    debounceMs,
    handleSearch,
    page,
    perPage,
    search,
    shallow,
    table,
    throttleMs,
    ...(isQueryMode && {
      data: queryResult.data,
      error: queryResult.error,
      isError: queryResult.isError,
      isFetching: queryResult.isFetching,
      isLoading: queryResult.isLoading,
      pagination: queryResult.pagination,
      refetch: queryResult.refetch
    })
  }
}
