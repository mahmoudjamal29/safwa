import type {
  UseInfiniteQueryOptions,
  UseQueryOptions
} from '@tanstack/react-query'

// Search params passed to query option functions
export type QuerySearchParams = {
  search?: string
}

// Regular (non-infinite) query options
 
export type RegularQueryOptions<T extends object = object> = UseQueryOptions<
  API<PaginatedResponse<T[]>> | API<T[]>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  PaginatedResponse<T[]> | T[]
>

// Function that returns regular query options given search params
export type RegularQueryOptionsFn<T extends object = object> = (
  params: QuerySearchParams
) => RegularQueryOptions<T>

// Infinite query options
export type InfiniteQueryOptions<T extends object = object> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  UseInfiniteQueryOptions<API<PaginatedResponse<T[]>>, any, PaginatedResponse<T[]>>

// Function that returns infinite query options given search params
export type InfiniteQueryOptionsFn<T extends object = object> = (
  params: QuerySearchParams
) => InfiniteQueryOptions<T>

// Dynamic query options — can be regular or infinite, or a function returning either
export type DynamicQueryOptions<T extends object = object> =
  | RegularQueryOptions<T>
  | RegularQueryOptionsFn<T>
  | InfiniteQueryOptions<T>
  | InfiniteQueryOptionsFn<T>
