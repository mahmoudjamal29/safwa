'use client'

import * as React from 'react'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import {
  createDisabledInfiniteQuery,
  createDisabledRegularQuery,
  extractQueryItems,
  flattenInfinitePages,
  resolveInfiniteQueryOptions,
  resolveRegularQueryOptions
} from '@/utils/query'

import type { QueryKey } from '@/query-client/query'
import type {
  DynamicQueryOptions,
  InfiniteQueryOptions,
  RegularQueryOptions
} from '@/types/query'

export type UseDynamicQueryParams<T extends object = object> = {
  infinite?: boolean
  isStaticMode: boolean
  queryOptions?: DynamicQueryOptions<T>
  searchQuery: string
}

export type UseDynamicQueryResult<T extends object = object> = {
  fetchNextPage: (() => void) | undefined
  hasNextPage: boolean
  isFetchingNextPage: boolean
  isLoading: boolean
  items: T[]
  resolvedInfiniteQueryOptions: InfiniteQueryOptions<T> | undefined
  resolvedRegularQueryOptions: RegularQueryOptions<T> | undefined
}

export function useDynamicQuery<T extends object = object>(
  params: UseDynamicQueryParams<T>
): UseDynamicQueryResult<T> {
  const { infinite = false, isStaticMode, queryOptions, searchQuery } = params

  const resolvedRegularQueryOptions = React.useMemo(
    () =>
      resolveRegularQueryOptions<T>({
        infinite,
        isStaticMode,
        queryOptions,
        searchQuery
      }),
    [queryOptions, infinite, isStaticMode, searchQuery]
  )

  const resolvedInfiniteQueryOptions = React.useMemo(
    () =>
      resolveInfiniteQueryOptions<T>({
        infinite,
        isStaticMode,
        queryOptions,
        searchQuery
      }),
    [queryOptions, infinite, isStaticMode, searchQuery]
  )

  const regularQueryKey = React.useMemo<QueryKey>(
    () =>
      resolvedRegularQueryOptions
        ? ([...resolvedRegularQueryOptions.queryKey, searchQuery] as QueryKey)
        : (['static-options', searchQuery] as QueryKey),
    [resolvedRegularQueryOptions, searchQuery]
  )

  const infiniteQueryKey = React.useMemo<QueryKey>(
    () =>
      resolvedInfiniteQueryOptions
        ? ([
            ...(resolvedInfiniteQueryOptions.queryKey as QueryKey),
            'infinite',
            searchQuery
          ] as QueryKey)
        : ['static-options-infinite', searchQuery],
    [resolvedInfiniteQueryOptions, searchQuery]
  )

  const regularQuery = useQuery(
    isStaticMode || !resolvedRegularQueryOptions
      ? createDisabledRegularQuery<T>(regularQueryKey)
      : {
          ...resolvedRegularQueryOptions,
          enabled:
            !infinite &&
            !isStaticMode &&
            (resolvedRegularQueryOptions.enabled ?? true),
          queryKey: regularQueryKey
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any
  )

  const infiniteQueryEnabled = Boolean(
    infinite &&
    !isStaticMode &&
    (typeof resolvedInfiniteQueryOptions?.enabled === 'boolean'
      ? resolvedInfiniteQueryOptions.enabled
      : true)
  )

  const infiniteQuery = useInfiniteQuery(
    isStaticMode || !resolvedInfiniteQueryOptions
      ? createDisabledInfiniteQuery<T>(infiniteQueryKey)
      : {
          ...resolvedInfiniteQueryOptions,
          enabled: infiniteQueryEnabled,
          queryKey: infiniteQueryKey
        } as InfiniteQueryOptions<T>
  )

  const items = React.useMemo<T[]>(() => {
    if (isStaticMode) return []

    if (infinite) {
      return flattenInfinitePages<T>(infiniteQuery.data as any)
    }

    return extractQueryItems<T>(regularQuery.data)
  }, [isStaticMode, infinite, infiniteQuery.data, regularQuery.data])

  const isLoading = isStaticMode
    ? false
    : infinite
      ? infiniteQuery.isLoading
      : regularQuery.isLoading

  const isFetchingNextPage = infinite ? infiniteQuery.isFetchingNextPage : false
  const hasNextPage = infinite ? (infiniteQuery.hasNextPage ?? false) : false
  const fetchNextPage = infinite ? infiniteQuery.fetchNextPage : undefined

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    items,
    resolvedInfiniteQueryOptions,
    resolvedRegularQueryOptions
  }
}
